import express from 'express'
import { TimecardData } from '@taskboard/types'
import { associates } from '../../queries/associates'
import { punches } from '../../queries/punches'
import Querier from '../../tools/querier'
import { getIO } from '../../tools/io'

const timecards = express.Router()

timecards
  .route('/:associate_id')
  .get(async (req, res) => {
    const { from, to } = req.query as { from: string, to: string }
    const { associate_id } = req.params
    const timecard = Querier.tx([associates, punches],
      async ([associates, punches]) => {
        return {
          associate: await associates.select.one({id: associate_id}),
          date_range: { from, to },
          rows: await punches.defined.rows_from_range(associate_id, {from,to}),
          statuatory: null
        } as TimecardData
      })
    
    res.json(await timecard)
  })

  .put(async (req, res, next) => {
    const timecard = req.body as TimecardData
    console.log(timecard)
    const { associate_id } = req.params
    if (timecard.associate.id == associate_id) {
      await punches.defined.update(timecard)
      getIO(req).emit('associate_update', associate_id)
      res.send()
    } else {
      next(new Error('UUID MISMATCH'))
    }
  })

export default timecards  