import { z } from "zod";

export type SignInForm = z.infer<typeof SignInForm>
export const SignInForm = z.object({
  email: z.string().email(),
  password: z.string(),
  remember_me: z.boolean()
})