import TimeInput from './TimeInput';
import { Card } from '@shad/card';
import { TableCell } from '@shad/table';
import { cn } from "@taskboard/client/ui/src/utils"
import { useRow } from '@taskboard/client/hooks/timecard/use-timecard-row';
import { OutTypeInput } from './OutTypeInput';
import { getTimeInputString } from '@taskboard/tools/functions/get-time-input-string';

export function PunchInputCell() {
  const row = useRow.context()

  return (
    <TableCell className="text-left">
      <div className='w-fit'>
        <div className='flex w-min gap-1 '>
          <TimeInput className={cn({ 'border-red-600 border bg-red-50': row.state.errors.overlapping_rows })} disabled={row.state.is_edit_locked} value={row.in ? getTimeInputString(String(row.in?.timestamp)) : ''} onSubmit={row.edit.set_in_time} />
          <TimeInput className={cn({ ' border-yellow-400': row.state.warnings.is_over_day, 'border-yellow-600 border': row.in?.timestamp && !row.out?.timestamp, 'border-red-600 border bg-red-50': row.state.errors.overlapping_rows || row.state.errors.no_span, })} disabled={row.state.is_edit_locked || !row.in?.timestamp} value={row.out ? getTimeInputString(String(row.out?.timestamp)) : ''} onSubmit={row.edit.set_out_time} />
          <OutTypeInput disabled={row.state.is_edit_locked || !row.in} value={row.out?.type} onValueChange={(d) => row.edit.select_out_type(d)} />
        </div></div>
    </TableCell>
  );
}

export function RowSumCell(props: { sum: number; }) {
  const sum = props.sum;
  return (
    <TableCell className={cn('font-mono text-right w-40 px-5')}>{sum > 0 ? sum.toFixed(2) : '-'}</TableCell>
  );
}

export function DateCell(props: { date: string, disabled: boolean }) {

  const date = new Date(Number(props.date.split('-')[0]), Number(props.date.split('-')[1]) - 1, Number(props.date.split('-')[2]))
  return (
    <TableCell className="font-medium">
      <div className={cn('flex gap-2', { 'opacity-60': props.disabled })}>
        <Card className='font-bol bg-black text-white  font-mono flex h-full px-2 justify-center items-center rounded'>{date.toLocaleDateString(('en-US'), { day: '2-digit', month: '2-digit' })}</Card>
        <div className='font-bold text-black'>{date.toLocaleDateString(('en-CA'), { weekday: 'long' })}</div>
      </div>
    </TableCell>
  );
}
