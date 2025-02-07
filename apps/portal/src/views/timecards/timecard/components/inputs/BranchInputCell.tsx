import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shad/select';
import { TableCell } from '@shad/table';
import { useRow } from '@taskboard/client/hooks/timecard/use-timecard-row';
import { Branch } from '@taskboard/types';
import { UUID } from 'crypto';


export function BranchInputCell(props: { branch_options: Branch[], disabled?: boolean }) {

  const row = useRow.context()

  return (
    <TableCell className="text-left">
      <div className='w-full'>
        <Select value={row.in?.branch_id} onValueChange={(branch_id) => row.edit.select_branch(branch_id as UUID)}>
          <SelectTrigger disabled={row.state.is_edit_locked || props.disabled} className="h-fit px-2 py-1 font-mono text-sm bg-slate-100">
            <SelectValue placeholder='Select store' />
          </SelectTrigger>
          <SelectContent className='h-min'>
            {props.branch_options.map((b, i) => (
              <SelectItem key={i} value={b.id}>{b.number}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </TableCell>
  );
}
