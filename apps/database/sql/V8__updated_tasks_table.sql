ALTER TABLE IF EXISTS tasks.list
    ADD COLUMN branch_id uuid;

ALTER TABLE IF EXISTS tasks.list
    ADD COLUMN associate_id uuid;
ALTER TABLE IF EXISTS tasks.list
    ADD FOREIGN KEY (branch_id)
    REFERENCES public.branches (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

ALTER TABLE IF EXISTS tasks.list
    ADD FOREIGN KEY (associate_id)
    REFERENCES payroll.associates (associate_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;