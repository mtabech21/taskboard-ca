import express, { NextFunction, Request, Response } from 'express'
import punches_route from './punches'
import { UUID } from 'crypto'
import { associates } from '../../queries/associates'
import { Associate, NewAssociate, NewPunch } from '@taskboard/types'
import { getIO } from '../../tools/io'

const associates_route = express.Router()

export function update_associate(req: Request<{ associate_id: string }>, res: Response, next: NextFunction) {
  const id = req.params.associate_id
  const io = getIO(req)
  res.on('finish', () => io.emit('associate_update', id))
  next()
}

associates_route.use('/punches', punches_route)

associates_route
  .route('')
  .put(async (req, res, next) => {
    const associate_id = req.query.associate_id as UUID
    const data = req.body as Partial<Associate>
    res.json((await associates.update({id: associate_id}, data))[0])
  })

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
    const data = req.body as NewAssociate
    res.json(await associates.insert({
      badge_number: data.badge_number,
      branch_id: data.branch_id,
      company_id: data.company_id,
      first_name: data.first_name,
      last_name: data.last_name,
      position_id: data.position_id
    }))
  })


associates_route
  .route('/status/:associate_id')
  .get( async (req, res, next) => {
    const { associate_id } = req.params
    res.json(await associates.defined.status(associate_id as UUID).catch(() =>  null))
  })

associates_route
  .route('/day_activity/:associate_id')
  .get( async (req, res) => {
    const {associate_id} = req.params
    res.json(await associates.defined.day_activity(associate_id as UUID))
  })
associates_route
  .route('/punch')
  .get( async (req, res, next) => {
    const punch_data = req.body as NewPunch
    res.json(await associates.defined.punch(punch_data))
  })


 

export default associates_route

