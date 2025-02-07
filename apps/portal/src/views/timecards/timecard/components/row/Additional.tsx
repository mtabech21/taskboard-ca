import { TableCell, TableRow } from '@shad/table';
import { BranchInputCell } from '../inputs/BranchInputCell';
import { CornerDownRight } from 'lucide-react';
import { PunchInputCell, RowSumCell } from '../inputs/DateCell';
import { RowOptionsCell } from '../inputs/RowOptionsMenu';
import { WarningCell } from './Main';
import { useManagerAccount } from '@taskboard/client/hooks/accounts/use-manager';
import { useRow } from '@taskboard/client/hooks/timecard/use-timecard-row';


export function PunchTableRowAdditional() {

  const row = useRow.context()
  const { branches } = useManagerAccount.context()

  return (
    <TableRow className='bg-gradient-to-l from-gray-100/0 to-gray-100 from-75%' >
      <RowOptionsCell />
      <TableCell className="font-medium  px-5"><div><CornerDownRight size={16} className='text-slate-800' /></div></TableCell>
      <PunchInputCell />
      <BranchInputCell branch_options={branches} />
      <WarningCell />
      <RowSumCell sum={row.total_hours} />
      <TableCell />
    </TableRow>
  );
}
