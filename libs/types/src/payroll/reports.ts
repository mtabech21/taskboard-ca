
import { UUID } from "crypto"
import { Branch } from "../company/branch"
import { AssociateBadge } from "./associate"
import { TimecardRow } from "./timecard"

export type DayPayrollReport = {
  associate_id?: UUID,
  date: Date,
  data: TimecardRow[]
  stat_holiday?: {
    branch_id: string,
    stat_hours: number
  }[]
}

export type AssociatePayrollReport = {
  associate: AssociateBadge,
  date_range?: { from: string, to: string }
  days: DayPayrollReport[]
}

export type BranchPayrollReport = {
  branch: Branch,
  date_range?: { from: string, to: string }
  associates: AssociatePayrollReport[]
}
