import { TimecardPeriod } from "@taskboard/types"
import { DateRange } from "react-day-picker"


export function getDateRange(period: TimecardPeriod): DateRange {
  const today = new Date()
  const from = new Date(today.getFullYear(),today.getMonth(),today.getDate())
  const to = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  function getCurrentPeriod() {
    const date = today.getDate()
    if (date > 0 && date <= 15) { from.setDate(1); to.setDate(15) }
    else { from.setDate(16); to.setMonth(to.getMonth() + 1); to.setDate(0) }
    return { from, to }
  }

  function getPreviousPeriod() {
    const date = today.getDate()
    if (date > 0 && date <= 15) { from.setMonth(from.getMonth() - 1); from.setDate(16); to.setDate(0) }
    else { from.setDate(1); to.setDate(15) }
    return { from, to }
  }

  function getCurrentMonth() {
    from.setDate(1); to.setMonth(to.getMonth() + 1); to.setDate(0)
    return { from, to }
  }

  function getPreviousMonth() {
    from.setMonth(from.getMonth() - 1)
    from.setDate(1); to.setMonth(to.getMonth()); to.setDate(0)
    return { from, to }
  }
  function getCurrentYear() {
    from.setDate(1); to.setFullYear(to.getFullYear() + 1); to.setDate(0)
    return { from, to }
  }

  function getCurrentWeek() {
    const day = today.getDay()
    from.setDate(from.getDate() - day); to.setDate(to.getDate() + (6 - day))
    return { from, to }
  }

  function getPreviousWeek() {
    const day = today.getDay()
    from.setDate(from.getDate() - day - 7); to.setDate(to.getDate() + (6 - day) - 7)
    return { from, to }
  }

  switch (period) {
    case "current_pay_period": return getCurrentPeriod()
    case "previous_pay_period": return getPreviousPeriod()
    case "year_to_date": return getCurrentYear()
    case "month_to_date": return getCurrentMonth()
    case "week_to_date": return getCurrentWeek()
    case "previous_month": return getPreviousMonth()
    case "previous_week": return getPreviousWeek()
  }
}