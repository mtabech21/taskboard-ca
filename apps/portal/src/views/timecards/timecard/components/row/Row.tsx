import { useRow } from "@taskboard/client/hooks/timecard/use-timecard-row";
import { TimecardRow } from "@taskboard/types";
import { PunchTableRowAdditional } from "./Additional";
import { PunchTableRowMain } from "./Main";



export function TimecardTableRow(props: { day_index: number, row?: TimecardRow }) {

  const row = useRow.init({ row: props.row })

  return (
    <useRow.Provider value={row} children={
      props.day_index === 0 ?
        <PunchTableRowMain />
        :
        <PunchTableRowAdditional />
    } />
  )
}


