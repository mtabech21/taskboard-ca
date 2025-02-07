import { z } from "zod";

export type NewCompanyForm = z.infer<typeof NewCompanyForm>
export const NewCompanyForm = z.object({
  name: z.string().min(3),
  domain: z.string().min(5),
  address: z.object({
    formatted: z.string(),
    place_id_google: z.string()
  })
})