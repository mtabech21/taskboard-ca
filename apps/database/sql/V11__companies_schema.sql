CREATE SCHEMA companies
    AUTHORIZATION postgres;

CREATE TABLE IF NOT EXISTS public.companies
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    domain character varying COLLATE pg_catalog."default" NOT NULL,
    address character varying COLLATE pg_catalog."default",
    place_id_google character varying COLLATE pg_catalog."default",
    email character varying COLLATE pg_catalog."default",
    CONSTRAINT companies_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.companies
    OWNER to postgres;