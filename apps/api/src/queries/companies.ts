import Querier from "../tools/querier";
import { Company, NewCompany } from "@taskboard/types";

export const companies = Querier.create<Company, NewCompany>()('public.companies', (db) => ({
  
}))