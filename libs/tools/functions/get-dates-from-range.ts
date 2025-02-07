import { DateRange } from "react-day-picker";
import { getLocalDateString } from "./get-date-string";

export function getDatesFromRange(date_range: DateRange): string[] {
  const dates: string[] = [];
  const curr = date_range.from && new Date(date_range.from)
  const max = date_range.to && new Date(date_range.to)
  max?.setDate(max.getDate() + 1)
  while (curr?.toLocaleDateString().split('T')[0] !== max?.toLocaleDateString().split('T')[0]) {
    if (curr)
      dates.push(getLocalDateString(new Date(curr)));
    curr?.setDate(curr.getDate() + 1);
  }
  return dates;
}