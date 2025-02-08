import express from 'express'
import punches from './punches'
import { UUID } from 'crypto'
import { associates } from '../../queries/associates'

const associates_route = express.Router()

associates_route.use('/punches', punches)

associates_route
  .route('/list')
  .post(async (req, res, next) => {
    const company_id = req.query.company_id as UUID
    const branch_ids = req.body.branch_ids as string[]
    if (company_id) {
      res.json(await associates.defined.badges('*', { 'id': company_id }, '*', '*'))
    } else if (branch_ids.length > 0) {
      res.json(await associates.defined.badges('*', '*', { id: branch_ids }, '*'))
    }
    else
      next("No Branches")
  })

associates_route
  .route('/badges')
  .get(async (req, res, next) => {
    const company_id = req.query.company_id as UUID
    res.json(await associates.select.manyOrNone({company_id}))
  })
 
associates_route
  .route('/new')
  .post(async (req, res) => {
    res.json(await associates.insert({...req.body}))
  })

export default associates_route

