CREATE TYPE public.access_group_operation AS ENUM (
    'READ',
    'UPDATE',
    'DELETE',
    'CREATE'
);
CREATE TYPE public.origin_type AS ENUM (
    'DOMAIN',
    'IP_ADDRESS'
);
CREATE TYPE public.post_status AS ENUM (
    'PUBLISHED',
    'DRAFT'
);
CREATE TYPE public.user_role AS ENUM (
    'EDITOR',
    'MODERATOR',
    'ADMIN'
);
CREATE FUNCTION public.gen_id() RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
  key TEXT;
BEGIN
  key := encode(gen_random_bytes(8), 'base64');
  key := replace(key, '/', '_');
  key := replace(key, '+', '-');
  RETURN key;
END;
$$;
CREATE FUNCTION public.gen_secret() RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      SELECT MD5(random()::text)
  $$;
CREATE FUNCTION public.generate_uid(size integer) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
  characters TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
  bytes BYTEA := gen_random_bytes(size);
  l INT := length(characters);
  i INT := 0;
  output TEXT := '';
BEGIN
  WHILE i < size LOOP
    output := output || substr(characters, get_byte(bytes, i) % l + 1, 1);
    i := i + 1;
  END LOOP;
  RETURN output;
END;
$$;
CREATE FUNCTION public.insert_document() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO documents (
    post_id
  )
  VALUES(
    NEW.id
  );
  RETURN NEW;
END
$$;
CREATE FUNCTION public.insert_version() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO versions (
    document_id,
    created_at,
    updated_at,
    raw
  )
  VALUES(
    OLD.id,
    OLD.updated_at,
    OLD.updated_at,
    OLD.raw
  );
  RETURN NEW;
END
$$;
CREATE FUNCTION public.set_password() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    NEW.password = (
      SELECT crypt(NEW.password, gen_salt('bf'))
    );
    RETURN NEW;
  END
  $$;
CREATE FUNCTION public.set_post_excerpt() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.excerpt = (
    SELECT substring(
      (SELECT raw::json#>>'{blocks, 0, text}' FROM documents WHERE documents.post_id = NEW.id),
      0,
      100
    )
  );
  RETURN NEW;
END
$$;
CREATE FUNCTION public.set_slug_from_title() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.slug := slugify(NEW.title);
  RETURN NEW;
END
$$;
CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = current_timestamp;
  RETURN NEW;
END
$$;
CREATE FUNCTION public.slugify(value text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
  -- removes accents (diacritic signs) from a given string --
  WITH "unaccented" AS (
    SELECT unaccent("value") AS "value"
  ),
  -- lowercases the string
  "lowercase" AS (
    SELECT lower("value") AS "value"
    FROM "unaccented"
  ),
  -- replaces anything that's not a letter, number, hyphen('-'), or underscore('_') with a hyphen('-')
  "hyphenated" AS (
    SELECT regexp_replace("value", '[^a-z0-9\\-_]+', '-', 'gi') AS "value"
    FROM "lowercase"
  ),
  -- trims hyphens('-') if they exist on the head or tail of the string
  "trimmed" AS (
    SELECT regexp_replace(regexp_replace("value", '\\-+$', ''), '^\\-', '') AS "value"
    FROM "hyphenated"
  )
  SELECT "value" FROM "trimmed";
$_$;
CREATE FUNCTION public.update_post_excerpt() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE posts
  SET excerpt = (
    SELECT substring(
      NEW.raw::json#>>'{blocks, 0, text}',
      0,
      100
    )
  )
  WHERE posts.id = NEW.post_id;
  RETURN NEW;
END
$$;
CREATE TABLE public.images (
    id text DEFAULT public.generate_uid(25) NOT NULL,
    url text NOT NULL,
    post_id text NOT NULL,
    user_id text NOT NULL
);
CREATE TABLE public.origins (
    id text DEFAULT public.generate_uid(25) NOT NULL,
    name character varying(255) NOT NULL,
    project_id text NOT NULL,
    origin_type public.origin_type DEFAULT 'DOMAIN'::public.origin_type NOT NULL,
    user_id text NOT NULL
);
CREATE TABLE public.posts (
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    project_id text NOT NULL,
    title text,
    slug text,
    status public.post_status DEFAULT 'DRAFT'::public.post_status,
    excerpt text,
    published_at timestamp without time zone,
    id text DEFAULT public.generate_uid(25) NOT NULL,
    source text,
    raw jsonb DEFAULT '{"blocks": [{"text": ""}], "entityMap": {}}'::jsonb NOT NULL,
    encoded_html text,
    cover_image_id text,
    user_id text NOT NULL
);
CREATE TABLE public.posts_tags (
    post_id text NOT NULL,
    tag_id text NOT NULL
);
CREATE TABLE public.projects (
    id text DEFAULT public.generate_uid(25) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name character varying(255),
    user_id text NOT NULL
);
CREATE TABLE public.tags (
    id text DEFAULT public.generate_uid(25) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name text NOT NULL,
    description text,
    slug text,
    project_id text,
    user_id text NOT NULL
);
CREATE TABLE public.users (
    id text DEFAULT public.generate_uid(25) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role public.user_role DEFAULT 'ADMIN'::public.user_role NOT NULL,
    email text NOT NULL,
    name text,
    password text,
    secret text
);
ALTER TABLE ONLY public.origins
    ADD CONSTRAINT domains_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_id_key UNIQUE (id);
ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.posts_tags
    ADD CONSTRAINT posts_tags_pkey PRIMARY KEY (post_id, tag_id);
ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_id_key UNIQUE (id);
ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);
ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_key UNIQUE (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
CREATE INDEX posts_project_id_slug_index ON public.posts USING btree (project_id, slug);
CREATE INDEX posts_slug_idx ON public.posts USING btree (slug, project_id);
CREATE TRIGGER trg_set_password_before_insert BEFORE INSERT ON public.users FOR EACH ROW EXECUTE PROCEDURE public.set_password();
CREATE TRIGGER trg_set_slug_from_title_before_insert BEFORE INSERT ON public.posts FOR EACH ROW WHEN ((new.slug IS NULL)) EXECUTE PROCEDURE public.set_slug_from_title();
CREATE TRIGGER trg_set_updated_at_before_update BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE TRIGGER trg_set_updated_at_before_update BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
ALTER TABLE ONLY public.origins
    ADD CONSTRAINT domains_project_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.origins
    ADD CONSTRAINT origins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_image_id_fkey FOREIGN KEY (cover_image_id) REFERENCES public.images(id);
ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.posts_tags
    ADD CONSTRAINT posts_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON UPDATE CASCADE;
ALTER TABLE ONLY public.posts_tags
    ADD CONSTRAINT posts_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON UPDATE CASCADE;
ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
