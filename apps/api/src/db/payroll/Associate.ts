import db from "../../db";
import { TimecardPunch } from "@taskboard/types";
import { UUID } from "crypto";

export class AssociateQuerier {

  static async update_punch_list(associate: string, from: string, to: string, data: TimecardPunch[]): Promise<TimecardPunch[]> {
    const timezone = 'EST'
    const q1 = `
    DELETE
    FROM payroll.punches pn
    WHERE
      associate_id = '${associate}'
    AND
      (timestamp AT TIME ZONE '${timezone}')::date >= '${from}'
    AND
      (timestamp AT TIME ZONE '${timezone}')::date <= '${to}'`;


    await db.tx(async (tx) => {
      await tx.none(q1);
      const insert_punches_list = data.map((p) => {
        const q2 = `
        INSERT INTO 
          payroll.punches(associate_id, branch_id, type, "timestamp")
        VALUES ('${associate}', '${p.branch_id}', '${p.type}', '${p.timestamp}');`

        return tx.none(q2);
      });
      return tx.batch(insert_punches_list);
    })

    return data;
  }

  static async get_latest_punch(associate_id: UUID): Promise<TimecardPunch> {
    const q1 = `
    SELECT * FROM payroll.punches
    WHERE associate_id = '${associate_id}'
    ORDER BY timestamp DESC,
    CASE
    WHEN type = 'in' THEN 1
    END
    LIMIT 1`
    return await db.oneOrNone<TimecardPunch>(q1) ?? { timestamp: new Date(0), type: 'out' } as TimecardPunch
  }

  // static async punch(data: TimecardPunch): Promise<null> {
  //   const latest_punch = await this.get_latest_punch(data.associate_id)
  //   const is_first_ever = new Date(0).valueOf() === latest_punch.timestamp.valueOf()
  //   const is_repeat = latest_punch.type == data.type
  //   const is_different_branch = data.branch_id != latest_punch.branch_id
  //   const is_after_latest_punch = new Date(data.timestamp).valueOf() > new Date(latest_punch.timestamp).valueOf()
  //   // const is_different_day = new Date(latest_punch.timestamp).getDate() > new Date(data.timestamp).getDate()
  //   const is_long_shift = latest_punch.type == 'in' && (((new Date(data.timestamp).valueOf() - new Date(latest_punch.timestamp).valueOf()) / 1000 / 60 / 60) > 12)

  //   function insert_punch(time_value: number, associate_id: UUID, branch_id: UUID, type: PunchType) {
  //     const time = new Date(time_value)
  //     time.setMilliseconds(0)
  //     time.setSeconds(0)
  //     return `INSERT INTO payroll.punches(timestamp, associate_id, branch_id, type)
  //     VALUES ((to_timestamp(${time.valueOf()} / 1000.0)),'${associate_id}','${branch_id}','${type}')`;
  //   }

  //   if (!is_first_ever && is_long_shift) { throw new Error('Shift Is Too Long') }

  //   if (is_after_latest_punch) {
  //     if (!is_different_branch) {
  //       if (!is_repeat) { return db.none(insert_punch(Date.now(), data.associate_id, data.branch_id, data.type)) }
  //       else { return null }  // ^^^^   IF SAME BRANCH    ^^^^ //
  //     } else {                // vvvv IF DIFFERENT BRANCH vvvv //
  //       if (is_repeat) {
  //         if (data.type == 'in') {
  //           return await db.tx(t => {
  //             t.none(insert_punch(new Date(data.timestamp).valueOf(), data.associate_id, latest_punch.branch_id, 'out'))
  //             t.none(insert_punch(new Date(data.timestamp).valueOf(), data.associate_id, data.branch_id, 'in'))
  //             return null
  //           })
  //         } else { return null }
  //       } else {
  //         if (latest_punch.branch_id == undefined) { return db.none(insert_punch(Date.now(), data.associate_id, data.branch_id, data.type)) } else {
  //           return await db.tx(t => {
  //             t.none(`UPDATE payroll.punches SET type = 'out' WHERE id = '${latest_punch.id}'`)
  //             t.none(insert_punch(Date.now(), data.associate_id, data.branch_id, data.type))
  //             return null
  //           })
  //         }
  //       }
  //     }
  //   } else { throw new Error('Has Future Punch') }
  // }




  // static async get_stat_holiday_hours(date: Date, associate_id: UUID): Promise<{ branch_id: string, stat_hours: number }[]> {

  //   const to = new Date(date)
  //   to.setDate(date.getDate() - date.getDay() - 1)
  //   const from = new Date(to)
  //   from.setDate(from.getDate() - 28)
  //   const data = await this.get_payroll_data(associate_id, this.string_from_date(from), this.string_from_date(to))
  //   const branches: { branch_id: string, stat_hours: number }[] = []
  //   data.days.forEach(d => {
  //     d.data.forEach(r => {
  //       const i = branches.findIndex(b => b.branch_id == r.branch_id)
  //       if (i >= 0) {
  //         branches[i].stat_hours += (r.in && r.out) ? (r.out?.timestamp.valueOf() - r.in?.timestamp.valueOf()) / 1000 / 60 / 60 : 0
  //       } else {
  //         if (r.branch_id) branches.push({ branch_id: r.branch_id, stat_hours: (r.in && r.out) ? (r.out?.timestamp.valueOf() - r.in?.timestamp.valueOf()) / 1000 / 60 / 60 : 0 })
  //       }
  //     })
  //   })
  //   return branches.map(b => { b.stat_hours = b.stat_hours / 20; return b })
  // }

  // static async get_payroll_data(associate_id: UUID, from: string, to: string, branch_id?: UUID, t?: Task): Promise<AssociatePayrollReport> {
  //   const ref = t ? t : db
  //   return await ref.tx(async () => {
  //     const stat_holiday = this.find_stat_holiday(from, to)
  //     const associate = await this.get_associate_badge(associate_id)
  //     // const employment = await this.get_employment_data(associate_id)
  //     const punches = await this.get_punch_list(associate_id, from, to)
  //     const rows = generateRowsFromPunches(punches)
  //     const report = {
  //       associate, date_range: { from, to }, days: [], employment: {}
  //     } as AssociatePayrollReport
  //     if (stat_holiday) report.days.push({ date: stat_holiday, data: [], associate_id, stat_holiday: await this.get_stat_holiday_hours(stat_holiday, associate_id) })
  //     rows.forEach((row) => {
  //       if (branch_id != undefined && row.branch_id != branch_id) { return } else {
  //         const dayIndex = report.days.findIndex(d => { return new Date(d.date).toISOString().split('T')[0] == row.date })
  //         if (dayIndex >= 0) report.days[dayIndex].data.push(row)
  //         else report.days.push({ date: new Date(row.date), data: [row] })
  //       }
  //     })
  //     return report
  //   })
  // }
}


