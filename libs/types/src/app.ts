
import { UUID } from "crypto"
import { ManagerAccount } from "./company/manager"
import { AssociateAccount } from "./payroll/associate"


export type Account = ManagerAccount | AssociateAccount

export type AccountData = Database.Portal.Account

export type AccountListItem = AccountData & User


export type AccountRegistrationData = {
  user: NewUser,
  branch_ids: UUID[]
  is_admin: boolean
}




export type Theme = "dark" | "light" | "system"

import { NewUser, User } from "./auth/user"
import { CompanyPosition } from "./company/company"
import { AssociateBadge } from "./payroll/associate"
import { Database } from "./database"


export type DateInterval = {
  from: Date,
  to: Date
}





export type CheckEntity = {
  body: string,
  checked: boolean
}



export type AssociateHours = {
  badge: AssociateBadge
  hours: number
}


export type FormData = {
  branch_id: string
  company_id: string
  badges: AssociateBadge[]
  positions: CompanyPosition[]
}
export type NewAssociate = {
  first_name: string
  last_name: string
  company_id: string
  branch_id: string
  position_id: string
  folder_ref: string
  date_added: string
  badge_number: string
}
export type AssociatePushData = {
  badge_number: string
  first_name: string
  last_name: string
  branch_id: string
  email: string
  position_id: string
}

export type Authentication = Unauthenticated | Authenticated

export type Unauthenticated = {
  user: null;
  get: () => Promise<User>;
  signIn: (login_data: { email: string; password: string; }) => Promise<User>;
  signUp: (register_data: { first_name: string, last_name: string, email: string, phone: string, password: string }) => Promise<User>
  isLoading: boolean;
  goToSignInPage(redirect?: boolean): void;
}

export type Authenticated = {
  user: User;
  signOut: () => Promise<void>;
  isLoading: boolean;
}


export type Warning = {
  level: '!!!' | '!!' | '!' | ''
  title: string
  message: string
}



















