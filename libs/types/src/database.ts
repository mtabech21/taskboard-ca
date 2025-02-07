import { UUID } from "crypto";
import { Branch } from "./company/branch";

type Foreign<TTable, TKey> = TKey

export namespace Database {
  export namespace Public {
    export interface Company {
      id: UUID,
      name: string,
      domain: string,
      address: string,
      place_id_google: string,
      email: string
    }
    export interface Branch {
      id: UUID,
      number: string,
      name: string,
      company_id: Foreign<Company,UUID>
    }
  }
  export namespace Payroll {
    export type PunchType = 'in' | 'out' | 'meal'

    export interface Punch {
      id: UUID,
      associate_id: Foreign<Associate, UUID>,
      branch_id: Foreign<Branch, UUID>,
      type: PunchType,
      modification_request: Date,
      timestamp: Date,
      approver: boolean
    }

    export interface Associate {
      associate_id: UUID,
      first_name: string,
      last_name: string,
      company_id: Foreign<Public.Company, UUID>,
      branch_id: Foreign<Public.Branch, UUID>
      position_id: Foreign<Position, UUID>
      date: string,
      badge_number: string
    }
    export interface Position {
      id: UUID,
      name: string,
      company_id: Foreign<Public.Company, UUID>
      default_permissions: string[]
    }
  }
  export namespace Portal {
    export interface Account {
      user_id: UUID,
      company_id: Foreign<Public.Company, UUID>,
      branch_ids: Foreign<Public.Branch, UUID>[],
      is_admin: boolean
    }
  }
}