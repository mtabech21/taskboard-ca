import { TimecardPunch, TimecardRow } from "@taskboard/types"
import { getLocalDateString } from "./get-date-string"
import { v4 as uuid } from 'uuid'

export function generateTimecardRows(data: TimecardPunch[]): TimecardRow[] {
  if (data.length === 0) return []
  const rows = [] as TimecardRow[]
  data.sort((a, b) => {
    if (a.timestamp < b.timestamp) return -1
    if (a.timestamp > b.timestamp) return 1
    else return 0
  })

  while (data[0].type === 'out') {
    data.shift()
  }

  for (const punch of data) {
    switch (punch.type) {
      case "in":
        rows.push({ id: uuid(), in: punch, date: getLocalDateString(punch.timestamp) } as TimecardRow)
        break
      case "out":
      case "meal":
        if (rows[rows.length - 1].out)
          rows.push({ out: punch } as TimecardRow)
        else
          rows[rows.length - 1].out = punch
        break
    }
  }
  return rows
}
