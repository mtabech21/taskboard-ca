
import { TableHead, TableHeader, TableRow } from '@shad/table';
import { CheckCheckIcon } from 'lucide-react';
import { cn } from "@taskboard/client/ui/src/utils"
import { useTimecardTable } from '@taskboard/client/hooks/timecard/use-timecard-table';

export function TimecardHeader() {
  const table = useTimecardTable.context()
  const can_approve_all = table.date_range.to ? table.date_range.to?.valueOf() < Date.now() : false

  return (
    <TableHeader >
      <TableRow>
        <TableHead className="w-min"></TableHead>
        <TableHead className="w-[100px]">Date</TableHead>
        <TableHead className="text-left">In/Out</TableHead>
        <TableHead className='text-left'>Branch</TableHead>
        <TableHead className='flex'>
          <div title={can_approve_all ? 'Approve All' : 'Period Still Active'} className={cn('flex flex-col px-2 m-2 justify-center items-center rounded border bg-red-50 text-gray-400 cursor-not-allowed', { 'cursor-pointer hover:bg-slate-200 bg-white': can_approve_all })} >
            <CheckCheckIcon />
          </div>
        </TableHead>
        <TableHead className="text-right px-5">Row</TableHead>
        <TableHead className="text-right px-5">Total</TableHead>
      </TableRow>
    </TableHeader >
  );
}
