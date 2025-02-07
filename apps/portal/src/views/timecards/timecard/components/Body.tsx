import { TableBody } from '@shad/table';
import { useTimecardTable } from '@taskboard/client/hooks/timecard/use-timecard-table';
import { TimecardDayWrapper } from './Day';

export const TimecardBody = () => {
  const { days } = useTimecardTable.context()


  return <TableBody children={days.map((day) => (< TimecardDayWrapper key={day.date} day={day} />))} />
}
