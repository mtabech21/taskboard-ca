import Querier from "../tools/querier";
import { Branch, NewBranch } from "@taskboard/types";

export const branches = Querier.create<Branch, NewBranch>()('public.branches', (db) => ({
  insert: (branch: NewBranch) => db.tx(async t => {
    const {company_id, name, number} = branch
    return t.one<Branch>(`INSERT INTO public.branches(
      "number", name, company_id)
      VALUES ('${number}', '${name}', '${company_id}')
      RETURNING *;`)
  }),
}))