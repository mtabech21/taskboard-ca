
import { Card } from "@shad/card";
import { ArrowRight, Edit, Equal } from "lucide-react";
import { Separator } from "@shad/separator";

import { useAssociatePunchLogRow } from "../../../../hooks/puncher/useAssociatePunchLogRow";
import TimeInput from "../input/TimeInput";
import { TimecardRow } from "@taskboard/types";
import { getTimeSpan } from "@taskboard/tools/functions/get-time-span";




export function AssociateLogRow(props: { row: TimecardRow; i: number; }) {

  const row = useAssociatePunchLogRow(props.row);

  return (
    <>
      <Card className="h-full flex items-center rounded-none justify-between border-none px-3 py-1 gap-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="font-bold text-gray-300">{props.i}</div>
          <div className="flex justify-between items-center gap-3">
            <div>
              <TimeInput value={row.tIn} onSubmit={(a) => row.setTIn(a)} disabled={!row.edit} />
            </div>
            <ArrowRight size={12} />
            <div>
              <TimeInput value={row.tOut} onSubmit={(a) => row.setTOut(a)} disabled={!row.edit} />
            </div>
            <Equal size={12} />
            <div className="font-bold text-right text-slate-600 whitespace-nowrap font-mono text-sm">
              {(props.row.in && props.row.out) && `${getTimeSpan(props.row.in.timestamp, props.row.out.timestamp)}`}
            </div>
          </div>
        </div>
        <div>
          {!row.edit ?
            <div onClick={() => { row.setEdit(true); row.fRef.current?.focus(); row.fRef.current?.select(); }}><div className="select-none font-bold hover:cursor-pointer text-gray-500 hover:text-gray-700"><Edit size={18} /></div></div>
            :
            <div onClick={() => { row.setEdit(false); }}><div className="select-none font-bold hover:cursor-pointer text-blue-500 hover:text-blue-700">SAVE</div></div>}
        </div>
      </Card>
      <Separator />
    </>
  );
}
