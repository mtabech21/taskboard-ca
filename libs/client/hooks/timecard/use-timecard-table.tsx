import { useCallback, useEffect, useMemo, useState } from "react";
import { BranchTotalHours, TimecardData, TimecardDay, TimecardRow } from "@taskboard/types";
import { getTotalHoursFromRows } from "../../../tools/functions/get-total-hours-from-rows";
import Contextor from "../contextor";
import { getDatesFromRange } from "@taskboard/tools/functions/get-dates-from-range";
import { date_from_string } from "@taskboard/tools/functions/get-date-from-string";
import { useTimecard } from "../payroll/use-timecard";

export const useTimecardTable = new Contextor((config: { timecard: TimecardData }) => {
  const { rows: original_rows, date_range, statuatory } = config.timecard
  const dates = useMemo(() => getDatesFromRange({ from: date_from_string(date_range.from), to: date_from_string(date_range.to) }), [date_range])
  const [edited_rows, set_edited_rows] = useState<TimecardRow[]>([...original_rows])

  useEffect(() => { set_edited_rows(original_rows) }, [original_rows])

  const { update } = useTimecard.context()

  const save = useCallback(async () => { update(edited_rows) }, [edited_rows, update])

  const days = useMemo<TimecardDay[]>(() => {
    return dates.map((date) => {
      const rows = edited_rows.filter(p => p.date == date)
      return {
        date,
        statuatory_data: statuatory,
        rows: rows
      }
    })
  }, [dates, edited_rows])

  const branch_hours: BranchTotalHours[] = []
  const total_hours: number = useMemo(() => getTotalHoursFromRows(edited_rows), [edited_rows])

  const overlaps = useCallback((timestamp: Date, current_row: TimecardRow): TimecardRow | undefined => {
    for (const row of edited_rows) {
      if (
        (current_row !== row) &&
        (row.in && row.out) &&
        (new Date(row.in.timestamp).valueOf() < new Date(timestamp).valueOf()) &&
        (new Date(row.out.timestamp).valueOf() > new Date(timestamp).valueOf())
      ) { return row }
    }
    return
  }, [])

  const overlapping_rows = useMemo(() => {
    const l: TimecardRow[] = []
    edited_rows.forEach((r) => {
      if (r.in) {
        const row = overlaps(new Date(r.in?.timestamp), r)
        if (row) l.push(row)
      }
      if (r.out) {
        const row = overlaps(new Date(r.out?.timestamp), r)
        if (row) l.push(row)
      }
    })
    return l
  }, [edited_rows, overlaps])

  const save_locked: boolean =
    JSON.stringify(edited_rows) == JSON.stringify(original_rows) ||
    overlapping_rows.length > 0 ||
    edited_rows.map(r => {
      return (
        new Date(r.in?.timestamp ?? 0).valueOf() > Date.now() ||
        new Date(r.out?.timestamp ?? 0).valueOf() > Date.now()
      )
    }).includes(true)

  return { days, dates, date_range, set_edited_rows, total_hours, branch_hours, overlapping_rows, save_locked, original_rows, save };
})
