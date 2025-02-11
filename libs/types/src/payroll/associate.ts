
import { UUID } from "crypto"
import { TimecardPunch } from "./timecard"
import { CompanyPosition } from "../company/company"
import { Branch } from "../company/branch"
import { Database } from "../database"

export type Associate = Database.Payroll.Associate

export interface AssociateAccount extends AssociateBadge {
  is_manager: false
}

export interface AssociateBadge {
  associate_id: UUID,
  badge_number: string,
  first_name: string,
  last_name: string,
  company_id: UUID,
  company_name: string,
  branch_id: UUID,
  branch_number: string,
  branch_name: string,
  position_name: string
}

export type AssociateStatus = TimecardPunch

export type AssociatePunches = {
  badge: AssociateBadge
  punches: TimecardPunch[]
}

export type AssociateInsert = {
  badge_number: string
  first_name: string
  last_name: string
  branch_id: UUID
  email: string
  position_id: UUID
}

export type AssociateGroupedList = PositionGroup[] | BranchGroup[]

export type PositionGroup = {
  position: CompanyPosition,
  associates: AssociateBadge[]
}

export type BranchGroup = {
  branch: Branch,
  associates: AssociateBadge[]
}

export type AssociatesFilter = {
  branches: Branch[]
  positions: CompanyPosition[]
}

