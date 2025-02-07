
import { Card } from "@shad/card";
import { useAssociatePunchLog } from "../../../../hooks/puncher/useAssociatePunchLog";
import { AssociateLogRow } from "./AssociateLogRow";
import { Separator } from "@shad/separator";
import { TimecardPunch } from "@taskboard/types";




export function AssociateLog(props: { data: TimecardPunch[]; }) {

  const { rows, hours } = useAssociatePunchLog(props.data);

  return (
    <Card className="m-1 rounded overflow-hidden shadow-sm">
      <div className="font-extrabold bg-gray-100">Punches</div>
      <Separator />
      {rows.map((row, i) => (
        row.in && <AssociateLogRow key={`${JSON.stringify(row.in.timestamp)}`} row={row} i={i + 1} />
      ))}
      <div className="flex justify-between p-3 bg-gray-100">
        <div className="font-extrabold">Total:</div>
        <div className="font-extrabold">{hours.toString() ?? '10:00'}</div>
      </div>
    </Card>
  );
}
