import { TimecardRow } from "@taskboard/types"

export function getTotalHoursFromRows(rows: TimecardRow[]) {
  let total = 0
  rows.forEach((r) => { if (r.in && r.out) { total += (new Date(r.out.timestamp).valueOf() - new Date(r.in.timestamp).valueOf()) / 1000 / 60 / 60 } })
  return total
}

export function getBranchHoursFromRows(rows: TimecardRow[]) {
  let total = 0
  rows.forEach((r) => { if (r.in && r.out) { total += (new Date(r.out.timestamp).valueOf() - new Date(r.in.timestamp).valueOf()) / 1000 / 60 / 60 } })
  return total
}