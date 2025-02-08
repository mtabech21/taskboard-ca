import express from 'express'
import { getRequestUser } from '../../tools/get-request-user'
import { accounts } from '../../queries/accounts'

const accounts_route = express.Router()

accounts_route
  .route('/user')
  .get(async (req, res) => {
    const user = await getRequestUser(res)
    try { res.json(await accounts.defined.manager_from_user_id(user)) } catch {
      try { res.json(await accounts.defined.associate_from_user_id(user.uuid)) } catch
      { res.json(null) }
    }
  })


export default accounts_route