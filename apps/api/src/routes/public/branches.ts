
import express from 'express'
import { UUID } from 'crypto'
import { branches } from '../../queries/branches'

const branches_route = express.Router()

branches_route
  .route('/list')
  .get(async (req, res, next) => {
    const company_id = req.query.company_id as UUID
    res.json(await branches.select.many({ company_id }))
  })

export default branches_route