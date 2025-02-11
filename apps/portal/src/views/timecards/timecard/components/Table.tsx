import { Table } from "@shad/table"
import { TimecardData } from "@taskboard/types"
import { useTimecardTable } from "@taskboard/client/hooks/timecard/use-timecard-table"
import { TimecardSubtotals } from "./Subtotals"
import { TimecardHeader } from "./Header"
import { TimecardBody } from "./Body"
import { TimecardGrandTotal } from "./GrandTotal"
import { Button } from "@shad/button"

function TimecardToolbar() {
  const { save, save_locked } = useTimecardTable.context()
  return (
    <div className=' flex p-1 justify-between items-center gap-1 text-xs border-b bg-gray-100'>
      <div></div>
      <Button disabled={save_locked} title='Save' className='bg-primary hover:bg-slate-600 border shadow-none font-bold text-xs' onClick={save}>SAVE</Button>
    </div>
  )
}

function TimecardTable(props: { data: TimecardData }) {
  const timecard_table = useTimecardTable.init({ timecard: props.data })

  return (
    <useTimecardTable.Provider value={timecard_table}>
      <TimecardToolbar />
      <Table className='select-none max-h-full bg-white'>
        <TimecardHeader />
        <TimecardBody />
      </Table>
      <TimecardSubtotals />
      <TimecardGrandTotal />
    </useTimecardTable.Provider >
  )
}

export default TimecardTable