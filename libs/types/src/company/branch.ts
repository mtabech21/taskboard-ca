import { AssociateBadge, AssociateStatus } from "../payroll/associate";
import { CompanyPosition } from "./company";
import { Database } from "../database";
import { UUID } from "crypto";


export type Branch = Database.Public.Branch

export type NewBranch = {
  number: string,
  name: string
  company_id: UUID
}

export type BranchWidget = Branch & {
  associates: AssociateStatus[]
  sales?: {
    actual?: number,
    plan?: number,
  },
  hours?: {
    actual?: number,
    plan?: number,
  }
}
export type BranchFormData = {
  id: string;
  company_id: string;
  badges: AssociateBadge[];
  positions: CompanyPosition[];
};

