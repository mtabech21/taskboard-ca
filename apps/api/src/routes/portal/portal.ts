import express from 'express'
import { UUID } from 'crypto'
import { associates } from '../../queries/associates'
import { accounts } from '../../queries/accounts'
import { getRequestUser } from '../../tools/get-request-user'

const portal = express.Router()

portal
  .route('/generated_passwords')
  .get(async (_, res) => {
    res.send([])
  })
portal
  .route('/company')
  .get(async (_, res) => {
    const user = await getRequestUser(res)
    await accounts.select.one({user_id: user.uuid})
  })

portal
  .route('/associate')
  .get(async (_, res, next) => {
    const user = await getRequestUser(res)
    try { res.json(await associates.defined.badge(user.uuid)) } catch (e) { next(e) }
  })

portal
  .route('/accounts/:company_id')
  .post(async (req, res) => {
    // const company_id = req.params.company_id as UUID
    // const { user, branch_ids, is_admin } = req.body as AccountRegistrationData
    // res.json(await accounts.defined.register(user,{branch_ids,company_id, is_admin}))
  })

portal
  .route('/account/:user_id/branch_access')
  .post(async (req, res) => {
    const { user_id } = req.params
    const branch_ids = req.body.branch_ids as UUID[]
    res.json(await accounts.defined.update_branch_list(user_id as UUID, branch_ids))
  })

export default portal