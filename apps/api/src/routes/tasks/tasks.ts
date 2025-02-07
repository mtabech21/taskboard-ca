import express from 'express'
import { User } from '@taskboard/types'
import db from '../../db'


const tasks = express.Router()

type NewTask = {
  title: string,
  created_by: string,
  due_date: Date,
  branch_id?: string,
  associate_id?: string
}

tasks
  .route('')
  .get(async (req, res) => {
    const { branch_id } = req.query
    const q = `
    SELECT * FROM tasks.overview WHERE branch_id = '${branch_id}'`

    res.json(await db.manyOrNone(q))
  })
  .post(async (req, res, next) => {
    const { title, created_by, due_date, branch_id, associate_id } = req.body as NewTask

    const q1 = `
      INSERT INTO tasks.list(
	    task_title, created_by, due_date, branch_id, associate_id)
	    VALUES ('${title}', '${created_by}', '${new Date(due_date).toISOString()}', ${branch_id ? `'${branch_id}'` : 'null'}, ${associate_id ? `'${associate_id}'` : 'null'})
      RETURNING task_id`

    try {
      res.json(db.tx(async t => {
        const { task_id } = (await t.one<{ task_id: string }>(q1))
        return task_id
      }))
    } catch (e) {
      next(e)
    }
  })

tasks
  .route('/view')
  .post(async (req, res) => {
    const { task_id } = req.query
    const user = res.locals.user as User
    try {
      res.json((await db.one(`INSERT INTO tasks.views(task_id, user_id) VALUES ('${task_id}', '${user.uuid}') RETURNING task_id`)).task_id)
    } catch {
      res.json(task_id)
    }
  })
export default tasks