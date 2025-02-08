import Querier from "../tools/querier";
import { CompanyPosition, NewCompanyPosition } from "@taskboard/types";
import { UUID } from "crypto";

export const positions = Querier.create<CompanyPosition, NewCompanyPosition>()('payroll.positions', (db) => ({
  create: (new_position: NewCompanyPosition) => db.one(`INSERT INTO payroll.positions(name, company_id) VALUES ('${new_position.name}','${new_position.company_id}') RETURNING *`),

  delete: (position_id: UUID) => db.one(`DELETE FROM payroll.positions WHERE id = '${position_id}' RETURNING *`),
  
}))