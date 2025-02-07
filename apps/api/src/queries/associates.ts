import { UUID } from "crypto"
import Querier from "../tools/querier"
import { Associate, AssociateBadge, NewAssociate } from "@taskboard/types"
import { companies } from "./companies"
import { branches } from "./branches"
import { positions } from "./positions"

export const associates = Querier.create<Associate>()('payroll.associates', (db) => ({
  badge: (associate_id: UUID) => Querier.tx([associates, companies, branches, positions],
    async ([associates, companies, branches, positions]) => {
      const { badge_number, first_name, last_name, ...associate } = (await associates.select.one({associate_id}))
      const { id: company_id, name: company_name } = (await companies.select.one({ id: associate.company_id }))
      const { id: branch_id, name: branch_name, number: branch_number } = (await branches.select.one({ id: associate.branch_id }))
      const { name: position_name } = (await positions.select.one({ id: associate.position_id }))

      return {
        associate_id,
        badge_number,
        first_name,
        last_name,
        company_id,
        company_name,
        branch_id,
        branch_name,
        branch_number,
        position_name
      } as AssociateBadge
    }),

  from_company: (company_id: UUID) => associates.select.many({ company_id }),

  insert: (associate: NewAssociate) => db.tx(async t => {
    const { first_name, last_name, company_id, branch_id, position_id, badge_number} = associate
    const { associate_id } =
      await t.one(`
        INSERT INTO payroll.associates(first_name, last_name, company_id, branch_id, position_id, badge_number)
        VALUES ('${first_name}', '${last_name}', '${company_id}', '${branch_id}', '${position_id}', '${badge_number}')
        RETURNING *`)
    return await associates.task(t).select.one({associate_id})
  }),
}))











