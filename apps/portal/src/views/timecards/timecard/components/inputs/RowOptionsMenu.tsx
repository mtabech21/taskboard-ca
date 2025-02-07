import { BetweenHorizonalStart, List, XSquare } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@shad/dropdown-menu';

import { cn } from "@taskboard/client/ui/src/utils"
import { useRow } from '@taskboard/client/hooks/timecard/use-timecard-row';
import { TableCell } from '@shad/table';


export function RowOptionsCell() {
  const row = useRow.context()

  return (
    <TableCell>
      <DropdownMenu>
        <DropdownMenuTrigger disabled={row.state.is_edit_locked} tabIndex={-1} className='focus:outline-none'><List className={cn('overflow-hidden border p-1 rounded bg-slate-100 text-gray-500', { 'bg-white hover:cursor-pointer  hover:bg-slate-100 hover:text-gray-600': !row.state.is_edit_locked, 'opacity-75 text-gray-300': row.state.is_edit_locked })} /></DropdownMenuTrigger>
        <DropdownMenuContent className='text-xs'>
          <DropdownMenuItem onClick={row.edit.add_row} className='text-sm p-1 h-min'><div className='flex items-center gap-2'><BetweenHorizonalStart size={16} /><div>Add Row</div></div></DropdownMenuItem>
          <DropdownMenuItem onClick={row.edit.delete_row} className='text-sm p-1 h-min text-red-600'><div className='flex items-center gap-2'><XSquare size={16} /><div>Delete</div></div></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  );
}
