import { NewUser, User } from "@taskboard/types";
import Querier from "../tools/querier";
import { hash } from "argon2";
import { decrypt } from "../secret";

export const users = Querier.create<User>()('auth.users', (db) => ({
  new: (user: NewUser) => db.tx(async t => {
    const { enc_pass, email, first_name, last_name } = user
    const password = decrypt(enc_pass)
    const hashed = await hash(password)
    return await t.one<User>(`INSERT INTO auth.users (email, password, first_name, last_name) VALUES ('${email}','${hashed}','${first_name}','${last_name}') RETURNING * `)

  })
}))