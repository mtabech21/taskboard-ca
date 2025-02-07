import { useTimecardTable } from '@taskboard/client/hooks/timecard/use-timecard-table';

export function TimecardGrandTotal() {
  const { total_hours } = useTimecardTable.context()

  return (
    <div className='font-mono border-b items-center flex p-2 pr-5 bg-muted justify-between'>
      <div>Total Hours</div>
      <div className='font-semibold'>{total_hours.toFixed(2)}</div>
    </div>
  );
}
