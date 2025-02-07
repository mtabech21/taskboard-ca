import express from 'express'
import { UUID } from 'crypto'
import { Company, NewCompany } from '@taskboard/types'
import { getRequestUser } from '../../tools/get-request-user'
import { companies } from '../../queries/companies'
import { associates } from '../../queries/associates'
import { accounts } from '../../queries/accounts'

const company = express.Router()

company
  .route('/badge_list/:company_id')
  .get(async (req, res) => {
    const company_id = req.params.company_id as UUID
    const badge_numbers = (await associates.defined.from_company(company_id)).map(p => p.badge_number)
    res.json({ badge_numbers })
  })

company
  .route('/create')
  .post(async (req, res, next) => {
      const user = await getRequestUser(res)
      const new_company = req.body as NewCompany
      res.json(await companies.insert<Omit<Company,'id'>>({...new_company,email:user.email}).catch(next))
  })

company
  .route('/:company_id/create_branch')
  .post(async (req, res) => {
    const company_id = req.params.company_id as UUID
    const { branch_name, branch_number } = req.body
    res.json(await companies.defined.create_branch({company_id,name: branch_name, number: branch_number}))
  })

company
  .route('/accounts/:company_id')
  .get(async (req, res) => {
    const company_id = req.params.company_id
    res.json(await accounts.select.many({ company_id }))
  })

export default company