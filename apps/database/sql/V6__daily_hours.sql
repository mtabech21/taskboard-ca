CREATE TABLE public.daily_hours
(
    store character varying NOT NULL,
    date date NOT NULL,
    hours numeric NOT NULL,
    PRIMARY KEY (store, date)
);

ALTER TABLE IF EXISTS public.daily_hours
    OWNER to postgres;