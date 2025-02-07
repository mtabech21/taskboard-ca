
import Contextor from "../contextor";
import { useMemo } from "react";
import { getTotalHoursFromRows } from "../../../tools/functions/get-total-hours-from-rows";
import { TimecardDay } from "@taskboard/types";



export const useDay = new Contextor((config: { day: TimecardDay }) => {
  const { day } = config

  const total_hours = useMemo(() => getTotalHoursFromRows(day.rows), [day.rows])
  const is_today = day.date === new Date().toISOString().split('T')[0]
  const locked = new Date(day.date) > new Date()

  return { ...day, locked, total_hours, is_today }
})