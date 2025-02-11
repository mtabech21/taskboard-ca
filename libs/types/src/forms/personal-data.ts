import { z } from "zod"

export type PersonalDataForm = z.infer<typeof PersonalDataForm>
export const PersonalDataForm = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  address: z.string(),
  place_id_google: z.string(),
})

