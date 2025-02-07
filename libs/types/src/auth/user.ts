import { UUID } from "crypto";
import { WithEncryptedPassword } from "./authentication";

export interface User {
  uuid: UUID,
  email: string,
  first_name: string,
  last_name: string,
  phone?: string,
  birth_date?: Date
}

export type NewUser = {
  email: string
  first_name: string,
  last_name: string,
  phone?: string,
  birth_date?: Date
} & WithEncryptedPassword





