ALTER TABLE IF EXISTS auth.users
    ADD COLUMN phone character varying;

ALTER TABLE IF EXISTS auth.users
    ADD COLUMN birth_date date;