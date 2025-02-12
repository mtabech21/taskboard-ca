
import { Branch, NewBranch } from "@taskboard/types";
import { db } from "..";

export const branches = db.querier<Branch, NewBranch>()('public.branches', (task) => ({
  insert: (branch: NewBranch) => task.tx(async t => {
    const {company_id, name, number} = branch
    return t.one<Branch>(`INSERT INTO public.branches(
      "number", name, company_id)
      VALUES ('${number}', '${name}', '${company_id}')
      RETURNING *;`)
  }),
}))