
import { OutPunch, TimecardPunchIn, TimecardPunchOut, TimecardRow } from "@taskboard/types"
import { useCallback } from "react"
import { v4 as uuid } from "uuid"
import { useDay } from "@taskboard/client/hooks/timecard/use-timecard-day"
import Contextor from "../contextor"
import { useTimecardTable } from "./use-timecard-table"
import { getTimestamp } from "@taskboard/tools/functions/generate-timestamp"
import { useTimecard } from "../payroll/use-timecard"
import { UUID } from "crypto"

export const useRow = new Contextor((config: { row?: TimecardRow }) => {
  const { row } = config

  const { associate } = useTimecard.context()
  const table = useTimecardTable.context()
  const day = useDay.context()

  const is_edit_locked = day.locked

  const total_hours = (row?.out && row?.in) ? ((new Date(row.out?.timestamp).valueOf() ?? 0) - new Date((row.in?.timestamp)).valueOf()) / 1000 / 60 / 60 : 0

  const warnings = {
    is_over_day: (row?.out?.timestamp ? (new Date(row.out.timestamp).getDate() > Number(day.date.split('-')[2])) : false)
  }

  const errors = {
    overlapping_rows: row ? table.overlapping_rows.includes(row) : false,
    no_span: new Date(row?.in?.timestamp ?? 1).valueOf() === new Date(row?.out?.timestamp ?? 0).valueOf()
  }

  const edit_row = useCallback((new_row: TimecardRow) => {
    table.set_edited_rows(p => {
      if (!row) return [...p, new_row]
      else return p.map((r) => {
        if (r.id === row.id)
          return { ...new_row }
        else
          return r
      })
    })
  }, [row, day, table.set_edited_rows])

  const delete_row = useCallback(() => {
    console.log('deleting', row)
    table.set_edited_rows(p => {
      const l = [...p]
      return l.filter(p => { console.log(p.id, row?.id); return p.id !== row?.id })
    })
  }, [row, table.set_edited_rows])

  const select_branch = useCallback((branch_id: UUID) => {
    if (row?.in) {
      const punch: TimecardPunchIn = { ...row.in, branch_id }
      edit_row({ ...row, in: punch })
    }
  }, [day, row, table.set_edited_rows])

  const select_out_type = useCallback((type: OutPunch) => {
    if (row?.out) {
      const punch: TimecardPunchOut = { ...row.out, type }
      edit_row({ ...row, out: punch })
    }
  }, [day, row, edit_row])

  const set_in_time = useCallback((time: string) => {
    if (time.length !== 0) {
      const new_row: TimecardRow = row ? { ...row } : { id: uuid() as UUID, date: day.date }
      const new_punch = { branch_id: associate.branch_id, ...row?.in, timestamp: getTimestamp(time, day.date) } as TimecardPunchIn
      new_row.in = new_punch
      edit_row(new_row)
    } else {
      delete_row()
    }
  }, [day.date, row, edit_row, delete_row])

  const set_out_time = useCallback((time: string) => {
    if (row?.in) {
      const new_row: TimecardRow = { ...row, date: day.date }
      const timestamp = getTimestamp(time, day.date)
      if (timestamp.valueOf() < new Date(row.in.timestamp).valueOf())
        timestamp.setDate(timestamp.getDate() + 1)
      // const overlapping_row = table.overlaps(timestamp, row)
      // if (overlapping_row) { toast({ title: 'Overlapping Punches' }); reject(overlapping_row); return }
      const punch = {
        ...new_row.out,
        timestamp,
        type: 'out'
      } as TimecardPunchOut
      if (time.length !== 0) {
        new_row.out = punch
      } else {
        new_row.out = undefined
      }
      edit_row(new_row)
    }
  }, [row, edit_row])

  const add_row = useCallback((): Promise<void> => {
    return new Promise((res, rej) => {
      if (!row)
        rej(new Error('Row not filled'))
      if (Object.values(errors).includes(true))
        rej(new Error('Row contains error'))
      for (const row of day.rows)
        if (!row.out)
          rej(new Error('Missing punch out'))
      res({})
    }).then(() => {
      table.set_edited_rows(p => [...p, {
        id: uuid(),
        date: day.date,
      } as TimecardRow])
    })
  }, [day, table.set_edited_rows])

  return {
    ...row,
    state: {
      is_edit_locked,
      warnings,
      errors
    },
    edit: {
      select_branch,
      select_out_type,
      set_in_time,
      set_out_time,
      add_row,
      delete_row
    },
    total_hours
  }
}
)