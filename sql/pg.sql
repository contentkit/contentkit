CREATE OR REPLACE FUNCTION public.handle_insert_post() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO documents (
    user_id,
    post_id
  )
  VALUES(
    NEW.user_id,
    NEW.id
  );
  RETURN NEW;
END
$$;


CREATE OR REPLACE FUNCTION public.insert_version() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO versions (
    user_id,
    document_id,
    created_at,
    updated_at,
    raw
  )
  VALUES(
    OLD.user_id,
    OLD.id,
    OLD.updated_at,
    OLD.updated_at,
    OLD.raw
  );
  RETURN NEW;
END
$$;

CREATE OR REPLACE FUNCTION public.set_password() RETURNS trigger LANGUAGE plpgsql AS $$
  BEGIN
    NEW.password = (
      SELECT crypt(NEW.password, gen_salt('bf'))
    );
    RETURN NEW;
  END
$$;