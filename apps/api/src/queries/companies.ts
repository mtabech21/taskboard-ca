import { generatePassword } from "@taskboard/tools/functions/generate_password";
import Querier from "../tools/querier";
import { Company, NewBranch, NewCompany } from "@taskboard/types";
import { encrypt } from "../secret";
import { users } from "./users";
import { branches } from "./branches";
import { accounts } from "./accounts";

export const companies = Querier.create<Company>()('public.companies', (db) => ({
  insert: (new_company: NewCompany, email: string) => db.one<Company>(`
      INSERT INTO companies (name, domain, address, place_id_google, email)
      VALUES ('${new_company.name}','${new_company.domain}','${new_company.address}','${new_company.place_id_google}', '${email}') 
      RETURNING *`
  ),
  create_branch: (new_branch: NewBranch) => Querier.tx([companies,branches,users],async ([companies,branches,users],t) => {
    const password = generatePassword()
    const enc_pass = await encrypt(password)
    const company = await companies.select.one({ id: new_branch.company_id })
    const user = await users.defined.new({ first_name: new_branch.number, last_name: new_branch.name, enc_pass, email: `${new_branch.number}@${company.domain}` })
    const branch = await branches.defined.insert(new_branch)
    await t.none(`INSERT INTO portal.generated_passwords(user_id, password) VALUES ('${user.uuid}','${password}')`)
    await accounts.defined.insert({user_id: user.uuid, company_id: company.id, branch_ids: [branch.id], is_admin: false})
    return branch
  })
}))