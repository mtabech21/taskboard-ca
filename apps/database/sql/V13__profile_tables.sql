ALTER TABLE IF EXISTS payroll.associates
    RENAME associate_id TO id;

CREATE TABLE IF NOT EXISTS associate_files.personal_data

(
    associate_id uuid NOT NULL,
    first_name character varying COLLATE pg_catalog."default" NOT NULL,
    last_name character varying COLLATE pg_catalog."default" NOT NULL,
    gender character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying COLLATE pg_catalog."default" NOT NULL,
    phone character varying COLLATE pg_catalog."default" NOT NULL,
    address character varying COLLATE pg_catalog."default" NOT NULL,
    place_id_google character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT personal_data_pkey PRIMARY KEY (associate_id),
    CONSTRAINT personal_data_email_key UNIQUE (email),
    CONSTRAINT personal_data_associate_id_fkey FOREIGN KEY (associate_id)
        REFERENCES payroll.associates (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS associate_files.personal_data
    OWNER to postgres;

ALTER TABLE IF EXISTS associate_files.social_insurance_numbers
    ADD FOREIGN KEY (associate_id)
    REFERENCES payroll.associates (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;   

ALTER TABLE IF EXISTS associate_files.employment
    ADD FOREIGN KEY (associate_id)
    REFERENCES payroll.associates (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;    

ALTER TABLE IF EXISTS associate_files.direct_deposit_accounts
    ADD FOREIGN KEY (associate_id)
    REFERENCES payroll.associates (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;     