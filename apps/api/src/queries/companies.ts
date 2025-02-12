
import { Company, NewCompany } from "@taskboard/types";
import { db } from "..";

export const companies = db.querier<Company, NewCompany>()('public.companies', (task) => ({
  
}))