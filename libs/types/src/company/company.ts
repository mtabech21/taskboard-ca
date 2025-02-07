import { UUID } from "crypto"
import { Database } from "../database"

export interface Address {
  formatted: string
  place_id_google: string
}

export type Company = Database.Public.Company

export interface NewCompany {
  name: string
  domain: string
  address: string
  place_id_google: string
}

export type CompanyPosition = Database.Payroll.Position

export interface NewCompanyPosition {
  name: string,
  company_id: UUID
}








