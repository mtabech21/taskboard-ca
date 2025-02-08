import { Database } from "@taskboard/types/src/database";
import Querier from "../tools/querier";
import { TimecardPunch } from "@taskboard/types";
import { generateTimecardRows } from "@taskboard/tools/functions/generate-timecard-rows";


export const punches = Querier.create<Database.Payroll.Punch>()('payroll.punches', (db) => ({
  from_range: (associate_id: string, range: { from: string, to: string }, timezone: string = 'EST') => db.tx(async t => {
    return await t.manyOrNone<TimecardPunch>(`
      SELECT
        pn.id,
        associate_id,
        branch_id,
        type,
        modification_request,
        timestamp
      FROM payroll.punches pn
      WHERE
        associate_id = '${associate_id}'
	    AND
        (timestamp AT TIME ZONE '${timezone}')::date >= '${range.from}'
      AND
        (timestamp AT TIME ZONE '${timezone}')::date <= '${range.to}'
      ORDER BY timestamp`)
  }),
  rows_from_range: (associate_id: string, range: { from: string, to: string }, timezone: string = 'EST') => Querier.tx([punches],
    async ([punches]) => {
    return generateTimecardRows(await punches.defined.from_range(associate_id,range,timezone))
  }),
}))