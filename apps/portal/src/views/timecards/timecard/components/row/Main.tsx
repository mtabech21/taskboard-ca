import { TableCell, TableRow } from '@shad/table';
import { RowOptionsCell } from '../inputs/RowOptionsMenu';
import { BranchInputCell } from '../inputs/BranchInputCell';
import { DateCell, PunchInputCell, RowSumCell } from '../inputs/DateCell';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@shad/hover-card';
import { cn } from "@taskboard/client/ui/src/utils"
import { TriangleAlertIcon } from 'lucide-react';
import { useManagerAccount } from '@taskboard/client/hooks/accounts/use-manager';
import { useRow } from '@taskboard/client/hooks/timecard/use-timecard-row';
import { useDay } from '@taskboard/client/hooks/timecard/use-timecard-day';

export function PunchTableRowMain() {

  const { total_hours: row_total, in: punch_in } = useRow.context()
  const { total_hours: day_total, date, locked, is_today } = useDay.context()
  const { branches } = useManagerAccount.context()

  return (
    <TableRow className={cn({ 'border-t-4': new Date(date).getDay() === 0, 'bg-gradient-to-bl from-blue-100/50 to-blue-100 from-25%': is_today, 'bg-gray-50 hover:bg-gray-50': locked })}>
      <RowOptionsCell />
      <DateCell disabled={locked} date={date} />
      <PunchInputCell />
      <BranchInputCell disabled={punch_in == undefined} branch_options={branches} />
      <WarningCell />
      <RowSumCell sum={row_total} />
      <DaySumCell sum={day_total} />
    </TableRow>
  );
}



export function WarningCell() {
  const row = useRow.context()
  const day = useDay.context()

  const { errors } = row.state
  const yellow_warning = row.total_hours > 8 || day.total_hours > 12 || (row.in && !row.out) || row.state.warnings.is_over_day
  const red_warning = errors.overlapping_rows || (row.out && new Date(row.out.timestamp).valueOf() > Date.now()) || errors.no_span
  return (
    <TableCell className='flex h-12'>
      <div className='flex px-5 justify-center items-center rounded w-full'>
        {(yellow_warning || red_warning) &&
          <HoverCard>
            <HoverCardTrigger><TriangleAlertIcon className={cn('hover:opacity-70', { 'text-yellow-600': yellow_warning, 'text-red-600': red_warning })} /></HoverCardTrigger>
            <HoverCardContent className='p-0 overflow-hidden font-mono *:text-xs'>
              {/**RED */}
              {errors.no_span && <div className='text-red-600 flex w-full justify-center bg-red-50 p-1'>Punches have the same timestamp</div>}
              {errors.overlapping_rows && <div className='text-red-600 flex w-full justify-center bg-red-50 p-1'>Some rows are overlapping</div>}
              {(row.out && new Date(row.out.timestamp).valueOf() > Date.now()) && <div className='text-red-600 flex w-full justify-center bg-red-50 p-1'>Punch is in future</div>}
              {/**YELLOW */}
              {(row.in && !row.out) && <div className='text-yellow-600 flex w-full justify-center bg-yellow-50 p-1'>Missing punch</div>}
              {row.total_hours > 8 && <div className='text-yellow-600 flex w-full justify-center bg-yellow-50 p-1'>Shift hours exceeds 8 hours</div>}
              {row.total_hours > 12 && <div className='text-yellow-600 flex w-full justify-center bg-yellow-50 p-1'>Day hours exceeds 12 hours</div>}
              {row.state.warnings.is_over_day && <div className='text-yellow-600 flex w-full justify-center bg-yellow-50 p-1'>Shift past midnight</div>}
            </HoverCardContent>
          </HoverCard>
        }
      </div>
    </TableCell>
  )
}

export function DaySumCell(props: { sum: number; }) {
  return (
    <TableCell className={cn("text-right font-mono font-semibold px-5", { 'font-thin text-gray-400': props.sum === 0 })}>
      {Number(props.sum).toFixed(2)}
    </TableCell>
  );
}

