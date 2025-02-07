import z from "zod";


export type NewAssociateForm = z.infer<typeof NewAssociateForm>
export const NewAssociateForm = z.object({
  badge_number: z.string().min(5).max(6),
  email: z.string().email().min(5),
  first_name: z.string().min(3),
  last_name: z.string().min(3),
  position_id: z.string().uuid(),
  branch_id: z.string().uuid()
})

