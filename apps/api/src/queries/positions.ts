import { CompanyPosition, NewCompanyPosition } from "@taskboard/types";
import { UUID } from "crypto";
import { db } from "..";

export const positions = db.querier<CompanyPosition, NewCompanyPosition>()('payroll.positions', (task) => ({
  create: (new_position: NewCompanyPosition) => task.one(`INSERT INTO payroll.positions(name, company_id) VALUES ('${new_position.name}','${new_position.company_id}') RETURNING *`),

  delete: (position_id: UUID) => task.one(`DELETE FROM payroll.positions WHERE id = '${position_id}' RETURNING *`),
  
}))