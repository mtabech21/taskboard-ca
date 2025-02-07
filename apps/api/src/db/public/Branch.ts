
import { UUID } from "crypto";
import db from "../../db";
import { AssociatePayrollReport, AssociatePunches, BranchPayrollReport } from "@taskboard/types";
import { branches } from "../../queries/branches";

export class BranchQuerier {

  static async get_punches(branch_id: UUID): Promise<AssociatePunches[]> {
    const timezone = 'EST'
    const q1 = `
    SELECT 
	    json_build_object(
		    'associate_id',ac.associate_id,
		    'badge_number',ac.badge_number,
		    'first_name',ac.first_name,
		    'last_name',ac.last_name
	    ) badge,
	    array_agg(
		    json_build_object(
		      'id',pn.id,
			    'type', pn.type,
			    'time', pn.timestamp
		    ) order by pn.timestamp asc
	    ) punches 
    FROM (
	    select * from payroll.punches where (timestamp AT TIME ZONE '${timezone}')::date = DATE(now() AT TIME ZONE '${timezone}') AND branch_id = '${branch_id}'
	    ) pn
    JOIN payroll.associates ac ON pn.associate_id = ac.associate_id
    GROUP BY ac.associate_id
    HAVING COUNT(CASE WHEN pn.branch_id = '${branch_id}' THEN 1 END) > 0`;
    const data = await db.manyOrNone<AssociatePunches>(q1);
    for (const a of data) {
      while (a.punches.length > 0 && a.punches[0].type === 'out') {
        a.punches.shift();
      }
    }
    return data;
  }
  
  static async generate_report(branch_id: UUID, date_range: { from: string, to: string }): Promise<BranchPayrollReport> {
    const timezone = 'EST'
    const q1 = `
      SELECT DISTINCT
        associate_id
      FROM payroll.punches pn
      WHERE
        branch_id = '${branch_id}'
      AND
        (timestamp AT TIME ZONE '${timezone}')::date >= '${date_range.from}'
      AND
        (timestamp AT TIME ZONE '${timezone}')::date <= '${date_range.to}'
      UNION
      SELECT DISTINCT associate_id
      FROM payroll.associates aa
      WHERE branch_id = '${branch_id}'`

    // const report_date = new Date()
    const branch = await branches.select.one({ id:branch_id })
    const distinct_associate_ids = await db.manyOrNone<{ associate_id: UUID }>(q1)
    const associates = [] as AssociatePayrollReport[]
    for (const a of distinct_associate_ids) {
      console.log(a)
      // associates.push(await AssociateQuerier.get_payroll_data(a.associate_id, date_range.from, date_range.to, branch_id))
    }
    return { branch, date_range, associates } as BranchPayrollReport
  }
}
