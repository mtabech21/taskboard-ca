ALTER TABLE IF EXISTS tasks.list
    ADD CHECK (branch_id IS NOT NULL OR associate_id IS NOT NULL)
    NOT VALID;

CREATE VIEW tasks.overview
 AS
select 
	tasks.task_id id,
	tasks.task_title title,
	tasks.created_at,
	tasks.due_date,
	to_jsonb(usr) created_by,
	tasks.branch_id,
	tasks.associate_id,
	cmp.completion_date completed_at,
	vws.viewed_at
from tasks.list tasks
join (select uuid, email, first_name, last_name from auth.users) usr on created_by = uuid
LEFT join tasks.completions cmp on cmp.task_id = tasks.task_id
LEFT join tasks.views vws on vws.task_id = tasks.task_id;

ALTER TABLE tasks.overview
    OWNER TO postgres;