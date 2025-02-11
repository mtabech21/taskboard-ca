import express from 'express'
import { UUID } from 'crypto'

import { getRequestUser } from '../../tools/get-request-user'
import { companies } from '../../queries/companies'
import { associates } from '../../queries/associates'
import { accounts } from '../../queries/accounts'
import Querier from '../../tools/querier'
import { branches } from '../../queries/branches'
import { NewCompany } from '@taskboard/types'
import { positions } from '../../queries/positions'

const company = express.Router()

company
  .route('/used_badges/:company_id')
  .get(async (req, res) => {
    const { uuid: user_id } = await getRequestUser(res)
    const company_id = req.params.company_id as UUID

    const badges = Querier.tx([associates, accounts],
      async ([associates, accounts]) => {
        const { is_admin } = await accounts.select.one({ user_id }, { select: ['is_admin']})
        const badge_numbers = await associates.select.many({ company_id }, { select: is_admin ? ['badge_number', 'first_name', 'last_name'] : ['badge_number'] }).catch(() => [])
        return badge_numbers
      }
    )
    
    res.json(await badges)
  })

company
  .route('/create')
  .post(async (req, res, next) => {
    const { uuid: user_id, first_name, last_name} = await getRequestUser(res)
    const new_company = req.body as NewCompany
    const company = Querier.tx([companies, accounts, branches, positions, associates],
      async ([companies, accounts, branches, positions, associates]) => {
        const company = await companies.insert(new_company)
        const { id: company_id } = company
        const { id: branch_id } = await branches.insert({ company_id, name: company.name, number: '10000' })
        const { id: position_id } = await positions.insert({ company_id, name: 'Administration' })
        await associates.insert({ associate_id: user_id, badge_number: '000000', company_id, branch_id, first_name, last_name, position_id })
        await accounts.insert({ company_id, user_id, branch_ids: [branch_id], is_admin: true })
        return { company }
      })
    res.json(await company.catch(next))
  })

company
  .route('/:company_id/create_branch')
  .post(async (req, res) => {
    const company_id = req.params.company_id as UUID
    const { branch_name, branch_number } = req.body
    res.json(await branches.insert({company_id,name: branch_name, number: branch_number}))
  })

company
  .route('/accounts/:company_id')
  .get(async (req, res) => {
    const company_id = req.params.company_id
    res.json(await accounts.select.many({ company_id }))
  })

export default company