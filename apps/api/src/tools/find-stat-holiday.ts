import { date_from_string } from "@taskboard/tools/functions/get-date-from-string"
import { stat_holidays_canada_2024 } from "../routes/payroll/_payroll"

export function find_stat_holiday(from: string, to: string): Date | null {
  for (const date of stat_holidays_canada_2024) {
    if (date.valueOf() >= date_from_string(from).valueOf() && date.valueOf() <= date_from_string(to).valueOf()) {
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
      return date
    }
  }
  return null
}