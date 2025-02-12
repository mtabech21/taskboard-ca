import { NewPunch, Punch, TimecardData, TimecardPunch } from "@taskboard/types";
import { generateTimecardRows } from "@taskboard/tools/functions/generate-timecard-rows";
import { generatePunches } from "@taskboard/tools/functions/generate_punches_from_rows";
import { db } from "..";

export const timezone = 'EST'

export const punches = db.querier<Punch, NewPunch>()('payroll.punches', (task) => ({
  from_range: (associate_id: string, range: { from: string, to: string }) => task.tx(async t => {
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
  rows_from_range: (associate_id: string, range: { from: string, to: string }) => db.tx([punches],
    async ([punches]) => { return generateTimecardRows(await punches.defined.from_range(associate_id, range)) }),
  update: (timecard: Omit<TimecardData,'statuatory'>) => db.tx([punches], async ([punches]) => {
    const { date_range, associate, rows } = timecard
    await punches.delete({
      associate_id: associate.id,
      where: [
        `(timestamp AT TIME ZONE '${timezone}')::date >= '${date_range.from}'`,
        `(timestamp AT TIME ZONE '${timezone}')::date <= '${date_range.to}'`
      ]
    }, true)
    const data = generatePunches(associate.id, rows)
    if (data[0]) 
      await punches.insert(data as [NewPunch, ...NewPunch[]])
  }),
}))