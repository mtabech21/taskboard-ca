import { Table } from "@shad/table"
import { TimecardData } from "@taskboard/types"
import { useTimecardTable } from "@taskboard/client/hooks/timecard/use-timecard-table"
import { TimecardSubtotals } from "./Subtotals"
import { TimecardHeader } from "./Header"
import { TimecardBody } from "./Body"
import { TimecardGrandTotal } from "./GrandTotal"

function TimecardTable(props: { data: TimecardData }) {
  const timecard_table = useTimecardTable.init({ timecard: props.data })

  return (
    <useTimecardTable.Provider value={timecard_table}>
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