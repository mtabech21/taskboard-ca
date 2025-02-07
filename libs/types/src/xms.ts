import { User } from "./auth/user"

export interface XMSTokens {
  'X-MS-Access-Token': User
  'X-MS-Refresh-Token': object
  'X-MS-API-Token': object
}

export interface XMSAPIKeys {
  'X-MS-API-Key': null
}



export type XMSHeader =
  keyof XMSTokens |
  keyof XMSAPIKeys


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type JWTString<T> = string


