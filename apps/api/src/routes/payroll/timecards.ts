import express from 'express'
import { TimecardData } from '@taskboard/types'
import { associates } from '../../queries/associates'
import { UUID } from 'crypto'
import { punches } from '../../queries/punches'

const timecards = express.Router()

timecards
  .route('/:associate_id')
  .get(async (req, res) => {
    const { from, to } = req.query as { from: string, to: string }
    const { associate_id } = req.params
    res.json({
      associate: await associates.defined.badge(associate_id as UUID),
      date_range: { from: new Date(from), to: new Date(to) },
      rows: await punches.defined.rows_from_range(associate_id, {from,to}),
      statuatory: null
    } as TimecardData)
  })

export default timecards  