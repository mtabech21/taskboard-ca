import { useState } from 'react'
import { TableCell, TableRow } from '@shad/table';
import { Branch, TimecardDay, TimecardStatuatoryData } from '@taskboard/types';
import { useManagerAccount } from '@taskboard/client/hooks/accounts/use-manager';
import { useDay } from '@taskboard/client/hooks/timecard/use-timecard-day';
import { TimecardTableRow } from './row/Row';


export function TimecardDayWrapper(props: { day: TimecardDay }) {
  const { branches } = useManagerAccount.context()

  const day = useDay.init({ day: props.day })
  const { statuatory_data, rows } = day

  if (rows.length === 0)
    return (
      <useDay.Provider value={day}>
        <StatHolidayRow statuatory_data={statuatory_data} branches={branches} />
        <TimecardTableRow day_index={0} />
      </useDay.Provider>
    )
  else
    return (
      <useDay.Provider value={day}>
        <StatHolidayRow statuatory_data={statuatory_data} branches={branches} />
        {rows.map((row, i) => <TimecardTableRow key={row.date + i} day_index={i} row={row} />)}
      </useDay.Provider>
    );
}

export function StatHolidayRow(props: { statuatory_data: TimecardStatuatoryData | null, branches: Branch[] }) {
  const [show, set_show] = useState(false)
  const sum = props.branches.length > 0 ? props.statuatory_data?.branches.map(b => b.hours).reduce((a, current) => a + current, 0) ?? 0 : 0

  if (props.statuatory_data == null) return null

  return (
    <TableRow>
      <TableCell colSpan={7} className='p-0'>
        <div className='px-4 py-1 m-0 bg-gray-800 text-white flex flex-col font-mono text-left justify-start text-xs gap-1 hover:bg-gray-600' onClick={() => set_show(p => !p)}>
          <div className='flex justify-between'>
            <div className='font-bold whitespace-nowrap justify-between'>Stat. Holiday Hours</div>
            <div>{sum.toFixed(2)}</div>
          </div>
          {show && props.statuatory_data.branches.map(b => (
            <div key={b.branch_id} className='whitespace-nowrap'>
              {props.branches.find(br => b.branch_id === br.id)?.number ?? 'UNKNOWN'}: {b.hours.toFixed(2)}
            </div>
          ))}
        </div>
      </TableCell>
    </TableRow>
  )

}


