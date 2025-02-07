
import { User } from "../auth/user";
import { AssociateBadge } from "../payroll/associate";
import { Branch } from "./branch";
import { Company } from "./company";

export interface ManagerAccount {
  user: User
  badge: AssociateBadge | null
  company: Company
  branches: Branch[]
  is_manager: true
  is_admin: boolean
}