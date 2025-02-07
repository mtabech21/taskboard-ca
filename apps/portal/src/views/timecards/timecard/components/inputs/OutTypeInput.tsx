import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shad/select';
import { useRow } from '@taskboard/client/hooks/timecard/use-timecard-row';
import { OutPunch } from '@taskboard/types';


export function OutTypeInput(props: { value: OutPunch | undefined, onValueChange?: (type: OutPunch) => void, disabled: boolean }) {

  const row = useRow.context()

  return (
    <Select defaultValue={row.out?.type} value={props.value} onValueChange={v => props.onValueChange && props.onValueChange(v as OutPunch)}>
      <SelectTrigger disabled={props.disabled} value={props.value} className="h-fit px-2 py-1 font-mono text-sm bg-slate-100">
        <SelectValue placeholder='-' />
      </SelectTrigger>
      <SelectContent className='h-min'>
        <SelectItem value="meal">Meal</SelectItem>
        <SelectItem value="out">Out</SelectItem>
      </SelectContent>
    </Select>
  );
}
