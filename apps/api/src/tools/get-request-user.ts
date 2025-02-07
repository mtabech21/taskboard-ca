import { User } from "@taskboard/types"
import { Response } from "express"

export function getRequestUser(res: Response): Promise<User> {
  return new Promise((resp, reje) => {
    const user = res.locals.user as User
    if (!user.uuid) {
      reje('No User')
    }
    resp(user)
  })
}