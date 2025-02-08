
import express from 'express'
import { AssociateQuerier } from '../../db/payroll/Associate'
import { BranchQuerier } from '../../db/public/Branch'
import { TimecardPunch } from '@taskboard/types'
import { UUID } from 'crypto'
import { punches } from '../../queries/punches'
import { find_stat_holiday } from '../../tools/find-stat-holiday'

const punches_route = express.Router()

punches_route
  .route('')
  .post(async (req, res) => {
    try {
      res.json(await AssociateQuerier.punch(req.body as TimecardPunch))
    } catch (e) {
      res.status(400).json({ error_message: (e as Error).message })
    }
  })
  .get(async (req, res) => {
    const branch_id = req.query.branch_id as UUID
    const punches = await BranchQuerier.get_punches(branch_id).catch(() => [])
    res.json(punches)
  })


punches_route
  .get('/:associate_id/stat', async (req, res) => {
    const { from, to } = req.query as { from: string, to: string }
    const stat = find_stat_holiday(from, to)
    // const { associate_id } = req.params
    if (stat)
      res.json(null)
    else
      res.json(null)
  })


punches_route
  .route('/:associate_id/range')
  .get(async (req, res) => {
    const { from, to } = req.query as { from: string, to: string }
    const { associate_id } = req.params
    res.json(await punches.defined.from_range(associate_id,{from,to}))
  })
  .post(async (req, res) => {
    const { from, to } = req.query as { from: string, to: string }
    const { associate_id } = req.params
    const punches = req.body.punches
    res.json(await AssociateQuerier.update_punch_list(associate_id, from, to, punches))
  })

export default punches_route
