SELECT run_command_on_workers(
  $cmd$
    CREATE OR REPLACE FUNCTION public.handle_insert_post() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      EXECUTE format(
        'INSERT INTO %s (user_id, post_id) SELECT ($1).user_id, ($1).id', TG_ARGV[0]
      ) USING NEW;
      RETURN NEW;
    END
    $$;
  $cmd$
);

SELECT run_command_on_colocated_placements(
  'posts',
  'documents',
  $cmd$
    CREATE TRIGGER trg_handle_insert_post AFTER INSERT ON %s
      FOR EACH ROW EXECUTE PROCEDURE handle_insert_post(%s)
  $cmd$
);

SELECT run_command_on_workers(
  $cmd$
  CREATE FUNCTION public.set_slug_from_title() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
  BEGIN
    NEW.slug := slugify(NEW.title);
    RETURN NEW;
  END
  $$;
  $cmd$
);

SELECT run_command_on_placements(
  'posts',
  $cmd$
    CREATE TRIGGER trg_set_slug_from_title_before_insert BEFORE INSERT ON %s
      FOR EACH ROW EXECUTE PROCEDURE public.set_slug_from_title();
  $cmd$
);

SELECT run_command_on_placements(
  'posts',
  $cmd$
    CREATE TRIGGER trg_set_slug_from_title_before_update BEFORE UPDATE ON %s FOR EACH ROW WHEN (NEW.title IS NOT NULL) EXECUTE PROCEDURE public.set_slug_from_title();
  $cmd$
)

SELECT run_command_on_workers(
  $cmd$
  CREATE OR REPLACE FUNCTION public.slugify(value text) RETURNS text
      LANGUAGE sql IMMUTABLE STRICT
      AS $_$
    WITH "unaccented" AS (
      SELECT unaccent("value") AS "value"
    ),
    "lowercase" AS (
      SELECT lower("value") AS "value"
      FROM "unaccented"
    ),
    "hyphenated" AS (
      SELECT regexp_replace("value", '[^a-z0-9\\-_]+', '-', 'gi') AS "value"
      FROM "lowercase"
    ),
    "trimmed" AS (
      SELECT regexp_replace(regexp_replace("value", '\\-+$', ''), '^\\-', '') AS "value"
      FROM "hyphenated"
    )
    SELECT "value" FROM "trimmed";
  $_$;
  $cmd$
)

SELECT run_command_on_workers(
  $cmd$
    CREATE OR REPLACE FUNCTION public.handle_insert_post() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      EXECUTE format(
        'INSERT INTO %s (user_id, post_id) SELECT ($1).user_id, ($1).id', TG_ARGV[0]
      ) USING NEW;
      RETURN NEW;
    END
    $$;
  $cmd$
);

SELECT run_command_on_workers(
  $cmd$
  CREATE OR REPLACE FUNCTION public.insert_version() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
  BEGIN
    EXECUTE FORMAT(
      'INSERT INTO %s (user_id, document_id, created_at, updated_at, raw) SELECT ($1).user_id, ($1).id, ($1).created_at, ($1).updated_at, ($1).raw',
      TG_ARGV[0]
    ) USING OLD;
    RETURN NEW;
  END
  $$;
  $cmd$
);


SELECT run_command_on_colocated_placements(
  'documents',
  'versions',
  $cmd$
    CREATE TRIGGER trg_insert_version_after_update AFTER UPDATE ON %s
      FOR EACH ROW EXECUTE PROCEDURE insert_version(%s);
  $cmd$
)

SELECT run_command_on_workers(
  $cmd$
CREATE OR REPLACE FUNCTION public.set_password() RETURNS trigger LANGUAGE plpgsql AS $$
  BEGIN
    NEW.password = (
      SELECT crypt(NEW.password, gen_salt('bf'))
    );
    RETURN NEW;
  END
  $$
  $cmd$
);

SELECT run_command_on_placements(
  'users',
  $cmd$
    CREATE TRIGGER trg_set_password_before_insert BEFORE INSERT ON %s
      FOR EACH ROW EXECUTE PROCEDURE public.set_password();
  $cmd$
);

-- SELECT run_command_on_placements(
--  'users',
--  $cmd$
--   CREATE TRIGGER trg_set_password_before_update BEFORE UPDATE ON %s
--      FOR EACH ROW EXECUTE PROCEDURE public.set_password();
--  $cmd$
-- );

SELECT run_command_on_workers(
  $cmd$
  CREATE FUNCTION public.set_updated_at() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
  BEGIN
    NEW.updated_at = current_timestamp;
    RETURN NEW;
  END
  $$;
  $cmd$
);

SELECT run_command_on_placements(
  'users',
  $cmd$
    CREATE TRIGGER trg_set_updated_at_before_update BEFORE UPDATE ON %s
      FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
  $cmd$
)

SELECT run_command_on_workers(
  $cmd$
  CREATE OR REPLACE FUNCTION public.gen_secret() RETURNS text
      LANGUAGE sql IMMUTABLE STRICT
      AS $_$
      SELECT MD5(random()::text)
  $_$;
  $cmd$
)
