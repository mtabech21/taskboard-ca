import { Unauthenticated } from "@taskboard/types";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  remember_me: z.boolean()
})

export const useSignIn = (auth: Unauthenticated) => {

  const form = useForm<z.infer<typeof signInSchema>>({
    defaultValues: {
      email: '',
      password: '',
      remember_me: false
    },
    resolver: zodResolver(signInSchema)
  });

  function handler() {
    const { email, password } = form.getValues();

    auth.signIn({ email, password })
      .then((user) => user)
      .catch((err) => { console.log(err) });
  }

  return { form, handler };
};
