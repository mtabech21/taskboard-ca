ALTER TABLE IF EXISTS public.hours_budget
    ADD COLUMN opening integer NOT NULL DEFAULT 550;

ALTER TABLE IF EXISTS public.hours_budget
    ADD COLUMN closing integer NOT NULL DEFAULT 300;