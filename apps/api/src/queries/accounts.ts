import { Database } from "@taskboard/types/src/database";
import Querier from "../tools/querier";
import { UUID } from "crypto";
import { AccountData, AssociateAccount, ManagerAccount, User } from "@taskboard/types";
import { companies } from "./companies";
import { associates } from "./associates";
import { branches } from "./branches";

export const accounts = Querier.create<AccountData>()('portal.accounts', (db) => ({
  manager_from_user_id: (user: User) => Querier.tx([accounts, associates, companies, branches],
    async ([accounts, associates, companies, branches]) => {
        const account = await accounts.select.one({user_id:user.uuid})
        const badge = await associates.defined.badge(account.user_id).catch(() => null)
        const company = await companies.select.one({ id: account.company_id })
        const branch_list = account.is_admin ?
          await branches.select.manyOrNone({ company_id: company.id })
          : await branches.select.manyOrNone({ id: account.branch_ids })
      
      return {
          user,
          badge,
          branches: branch_list,
          company,
          is_admin: account.is_admin,
          is_manager: true
        } as ManagerAccount
    }),
  
  associate_from_user_id: (id: UUID) => db.tx(async t => {
    const badge = await associates.task(t).defined.badge(id)
    return { ...badge, is_manager: false } as AssociateAccount
  }),

  insert: (account: Database.Portal.Account) => db.one<Database.Portal.Account>(`INSERT INTO portal.accounts(user_id, company_id, branch_ids, admin) VALUES ('${account.user_id}','${account.company_id}',${account.branch_ids.length > 0 ? `'{${account.branch_ids.join(`','`)}}'` : 'array[]::uuid[]'},${account.is_admin ?? false}) RETURNING *`),

  update_branch_list: (user_id: UUID, branch_ids: UUID[]) => db.tx(async t => {
    return await t.none(`
    UPDATE portal.accounts SET
    branch_ids = '{${branch_ids.join(`,`)}}'
    WHERE user_id = '${user_id}'`)
  })
}))