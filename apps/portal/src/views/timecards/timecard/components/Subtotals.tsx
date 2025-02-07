import { TableCell, TableRow } from '@shad/table';
import { useTimecardTable } from '@taskboard/client/hooks/timecard/use-timecard-table';
import { Branch } from '@taskboard/types';


export function TimecardSubtotals() {
  const table = useTimecardTable.context()
  return (
    <div className='font-mono border-t-2'>
      {table.branch_hours.map((r) => (
        r.total_hours > 0 && <Subtotal key={r.branch.id} branch={r.branch} total_hours={r.total_hours} />
      ))}
    </div>
  );
}

function Subtotal(props: { branch: Branch, total_hours: number }) {
  const { branch } = props
  return (
    <TableRow >
      <TableCell className='text-left ' colSpan={6}><div><span className='font-bold'>{String(branch.number ?? 'UNKNOWN')}</span> ({branch?.name ?? 'UNKNOWN'})</div></TableCell>
      <TableCell className='text-right px-5'>{props.total_hours.toFixed(2)}</TableCell>
    </TableRow>
  )
} 
