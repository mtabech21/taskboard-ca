import { Button } from "@shad/button";
import { Calendar } from "@shad/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@shad/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shad/select";
import { useTimecards } from "@taskboard/client/hooks/payroll/use-timecards";
import { getDateRange } from "@taskboard/tools/functions/get-date-range";
import { TimecardPeriod } from "@taskboard/types";
import { cn } from "@taskboard/client/ui/src/utils";
import { formatDate } from "date-fns";
import { CalendarIcon, ListRestart } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

const period_select: { value: TimecardPeriod, name: string }[] = [
  { value: 'current_pay_period', name: 'Current Pay Period' },
  { value: 'previous_pay_period', name: 'Previous Pay Period' },
  { value: 'week_to_date', name: 'Current Week' },
  { value: 'month_to_date', name: 'Current Month' },
  { value: 'previous_week', name: 'Previous Week' },
  { value: 'previous_month', name: 'Previous Month' },
]

export function DateRangePicker() {
  const { date_range, load_date_range } = useTimecards.context()
  const [selectedPeriod, setSelectedPeriod] = useState<TimecardPeriod | null>()
  const [dateRange, setDateRange] = useState<DateRange | undefined>(date_range);
  const [reloadable, setReloadable] = useState(dateRange !== date_range)


  useEffect(() => {
    setDateRange(date_range)
  }, [date_range])

  useEffect(() => {
    selectedPeriod && load_date_range(getDateRange(selectedPeriod))
  }, [selectedPeriod, load_date_range])

  useEffect(() => {
    setReloadable(dateRange !== date_range)
  }, [dateRange, date_range])


  return (
    <div className={'flex border rounded overflow-hidden bg-background'}>
      <Popover>
        <PopoverTrigger className="border-none " asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {formatDate(dateRange.from, "LLL dd, y")} -{" "}
                  {formatDate(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                formatDate(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col p-3 gap-3 font-mono">
            <Select
              onValueChange={(value) =>
                setSelectedPeriod(value as TimecardPeriod)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Pay Period" />
              </SelectTrigger>
              <SelectContent position="popper">
                {period_select.map((p) => (
                  <SelectItem key={p.value} className="font-mono" value={p.value}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Calendar
              className="p-0"
              initialFocus
              mode="range"
              max={31}
              defaultMonth={dateRange?.from}
              month={dateRange?.from}
              selected={dateRange}
              onSelect={d => { setDateRange({ from: d?.from && d.from, to: d?.to && d.to }); setSelectedPeriod(null) }}
              numberOfMonths={2}
            />
          </div>
        </PopoverContent>
      </Popover>
      <div className={cn("flex items-center text-secondary rounded px-2", { 'text-primary hover:cursor-pointer': reloadable })} onClick={() => { dateRange && load_date_range(dateRange) }} ><ListRestart size={20} /></div>
    </div>
  )
}