import express from 'express'
import associates from './associates'
import { createObjectCsvWriter } from 'csv-writer'
import positions from './positions'

import { BranchQuerier } from '../../db/public/Branch'
import { BranchPayrollReport } from '@taskboard/types'

import { UUID } from 'crypto'
import timecards from './timecards'




const payroll = express.Router()

export const stat_holidays_canada_2024 = [
  new Date(2024, 8, 2),
  new Date(2024, 9, 14)
]

payroll.use('/positions', positions)
payroll.use('/associates', associates)
payroll.use('/timecards', timecards)

// async function generate_associate_report_csv(report: PayrollReport.Associate) {
//   const file_name = report.associate.last_name + '_' + report.associate.first_name + '_' + report.date_range?.from + '_' + report.date_range?.to + '_' + new Date().valueOf()
//   const file_path = `tmp/${file_name}.csv`
//   const writer = createObjectCsvWriter({
//     path: file_path,
//     header: [
//       { id: 'date', title: 'date' },
//       { id: 'associate', title: 'associate' },
//       { id: 'branch', title: 'branch' },
//       { id: 'rate', title: 'rate' },
//       { id: 'hours', title: 'hours' },
//       { id: 'pay', title: 'pay' },
//       { id: 'pay_code', title: 'pay_code' }
//     ]
//   })
//   const a = report
//   const rate = Number(String(report.employment.rate).replace('$', ''))

//   const records = report.days.map((d) => {
//     let day_hours = 0

//     d.data.forEach((r) => {
//       if (r.out && r.in) { day_hours += (new Date(r.out.timestamp).valueOf() - new Date(r.in.timestamp).valueOf()) / 1000 / 60 / 60 }
//     })

//     return {
//       associate: `${a.associate.first_name} ${a.associate.last_name} (${a.associate.badge_number})`,
//       branch: `${report.branch.number}`,
//       rate: `${rate.toFixed(2)}`,
//       hours: `${total_hours.toFixed(2)}`,
//       pay: `${(total_hours * rate).toFixed(2)}`,
//     }
//   })

//   await writer.writeRecords(records)
//   return file_path
// }

async function createBranchReportCSV(report: BranchPayrollReport): Promise<string> {
  const file_name = report.branch.number + '_' + report.date_range?.from + '_' + report.date_range?.to + '_' + new Date().valueOf()
  const file_path = `tmp/${file_name}.csv`
  const writer = createObjectCsvWriter({
    path: file_path,
    header: [
      { id: 'branch', title: 'branch' },
      { id: 'associate', title: 'associate' },
      { id: 'rate', title: 'rate' },
      { id: 'regular_hours', title: 'regular_hours' },
      { id: 'stat_hours', title: 'stat_hours' },
    ]
  })

  const records = report.associates.map((a) => {

    const rate = Number(String(15).replace('$', ''))
    let regular_hours = 0
    let stat_hours = 0
    a.days.forEach((d) => {
      stat_hours += d.stat_holiday?.find(b => b.branch_id == report.branch.id)?.stat_hours ?? 0
      d.data.forEach((r) => {
        if (r.out && r.in) { regular_hours += (new Date(r.out.timestamp).valueOf() - new Date(r.in.timestamp).valueOf()) / 1000 / 60 / 60 }
      })
    })

    return {
      branch: `${report.branch.number}`,
      associate: `${a.associate.first_name} ${a.associate.last_name} (${a.associate.badge_number})`,
      rate: `${rate.toFixed(2)}`,
      regular_hours: `${regular_hours.toFixed(2)}`,
      stat_hours: `${stat_hours.toFixed(2)}`,
    }
  })
  await writer.writeRecords(records)
  return file_path
}

// payroll.route('/report/associate/:associate_id')
//   .get(async (req, res) => {
//     const associate_id = req.params.associate_id
//     const { from, to, type } = req.query
//   })

payroll.route('/report/branch/:branch_id')
  .get(async (req, res) => {
    const branch_id = req.params.branch_id as UUID
    const { from, to, type } = req.query
    const report = await BranchQuerier.generate_report(branch_id, { from: String(from), to: String(to) })
    if (type == 'csv')
      res.download(await createBranchReportCSV(report))
    else
      res.json(report)
  })




export default payroll