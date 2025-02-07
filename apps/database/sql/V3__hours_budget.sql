CREATE TABLE public.hours_budget
(
    store_number character varying NOT NULL,
    hours integer NOT NULL,
    PRIMARY KEY (store_number)
);

ALTER TABLE IF EXISTS public.hours_budget
    OWNER to postgres;