import { UUID } from "crypto"
import { AssociateBadge } from "./associate"
import { Branch } from "../company/branch"



export type PunchType = InPunch | OutPunch
export type InPunch = 'in'
export type OutPunch = "meal" | "out"

export interface TimecardPunchOut {
  id: string
  timestamp: Date
  associate_id: UUID
  branch_id: UUID
  type: OutPunch
}

export interface TimecardPunchIn {
  id: string
  timestamp: Date
  associate_id: UUID
  branch_id: UUID
  type: InPunch
}

export type TimecardPunch = TimecardPunchIn | TimecardPunchOut


export type TimecardRow = {
  id: UUID
  date: string
  in?: TimecardPunchIn
  out?: TimecardPunchOut
}



export type TimecardPeriod = "current_pay_period" | "previous_pay_period" | "year_to_date" | "month_to_date" | "week_to_date" | "previous_month" | "previous_week"

export type TimecardData = {
  associate: AssociateBadge
  date_range: {
    from: Date,
    to: Date
  },
  rows: TimecardRow[]
  statuatory: TimecardStatuatoryData | null
}

export type TimecardDay = {
  date: string,
  statuatory_data: TimecardStatuatoryData | null
  rows: TimecardRow[]
}

export type TimecardStatuatoryData = {
  date: Date,
  branches: BranchStatuatoryData[]
}

export type BranchTotalHours = {
  branch: Branch,
  total_hours: number
}

export type BranchStatuatoryData = {
  date: Date,
  branch_id: string;
  branch_number: string;
  hours: number;
}






