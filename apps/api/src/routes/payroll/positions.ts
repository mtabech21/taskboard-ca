import express from 'express'
import { UUID } from 'crypto'
import { CompanyPosition } from '@taskboard/types'
import { positions } from '../../queries/positions'

const positions_route = express.Router()

positions_route
  .route('/:company_id')
  .get(async (req, res) => {
    const { company_id } = req.params
    res.json(await positions.select.manyOrNone({company_id}))
  })
  .post(async (req, res) => {
    const company_id  = req.params.company_id as UUID
    const { name } = req.body as CompanyPosition
    res.json(await positions.defined.create({company_id,name}))
  })

positions_route
  .route('/:position_id')
  .delete(async (req, res) => {
    const position_id = req.params.position_id as UUID
    res.json(await positions.defined.delete(position_id))
  })

export default positions_route
