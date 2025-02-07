CREATE SCHEMA tasks
    AUTHORIZATION postgres;

ALTER TABLE IF EXISTS auth.users
    ADD PRIMARY KEY (uuid);    

CREATE TABLE tasks.list
(
    task_id uuid NOT NULL DEFAULT gen_random_uuid(),
    task_title character varying NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    due_date timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (task_id),
    CONSTRAINT user_id FOREIGN KEY (created_by)
        REFERENCES auth.users (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS tasks.list
    OWNER to postgres;

    CREATE TABLE tasks.assignages
(
    task_id uuid NOT NULL,
    branch_id uuid,
    associate_id uuid,
    PRIMARY KEY (task_id),
    FOREIGN KEY (task_id)
        REFERENCES tasks.list (task_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    FOREIGN KEY (branch_id)
        REFERENCES public.branches (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    FOREIGN KEY (associate_id)
        REFERENCES payroll.associates (associate_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS tasks.assignages
    OWNER to postgres;

    CREATE TABLE tasks.completions
(
    task_id uuid NOT NULL,
    completion_date timestamp without time zone NOT NULL,
    data jsonb DEFAULT null,
    PRIMARY KEY (task_id),
    FOREIGN KEY (task_id)
        REFERENCES tasks.list (task_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS tasks.completions
    OWNER to postgres;


CREATE TABLE tasks.views
(
    task_id uuid NOT NULL,
    user_id uuid NOT NULL,
    viewed_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (task_id, user_id),
    FOREIGN KEY (task_id)
        REFERENCES tasks.list (task_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    FOREIGN KEY (user_id)
        REFERENCES auth.users (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS tasks.views
    OWNER to postgres;