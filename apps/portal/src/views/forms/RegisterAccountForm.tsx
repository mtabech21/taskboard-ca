import { Button } from "@shad/button"
import { Card } from "@shad/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@shad/form"
import { Input } from "@shad/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { AccountRegistrationData, UserRegisterationData } from "@taskboard/types"
import { useAPI } from "@taskboard/client/hooks/global/use-api"

import { UUID } from "crypto"
import { useManagerAccount } from "@taskboard/client/hooks/accounts/use-manager"




function useNewAccountForm(company_id: UUID) {
  const api = useAPI.context()

  const schema = z.object({
    email: z.string().email('Please enter a valid email.'),
    first_name: z.string().min(3).max(12),
    last_name: z.string().min(3).max(12),
    password: z.string().min(8, 'Password must be 8 characters or more').max(31, 'Password too long'),
    confirm_password: z.string(),
  })

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      confirm_password: '',
    }, resolver: zodResolver(schema)
  })

  const nav = useNavigate()

  function handler() {
    const user = form.getValues() as UserRegisterationData
    api.post(`/portal/accounts/${company_id}`, {
      user, branch_ids: [], is_admin: false
    } as AccountRegistrationData).then(() => {
      nav('/accounts', { replace: true })
    })
  }

  return { ...form, handler }
}

function RegisterAccountForm() {
  const { company } = useManagerAccount()
  const form = useNewAccountForm(company.id)

  const FullNameInput = useCallback(() =>
    <div className="flex gap-2">
      <FormField control={form.control} name="first_name" render={({ field }) =>
        <FormItem>
          <FormLabel>First Name</FormLabel>
          <FormControl><Input placeholder="John" {...field} /></FormControl>
        </FormItem>
      } />
      <FormField control={form.control} name="last_name" render={({ field }) =>
        <FormItem>
          <FormLabel>Last Name</FormLabel>
          <FormControl><Input placeholder="Spirit" {...field} /></FormControl>
        </FormItem>
      } />
    </div>, [form.control])


  const EmailInput = useCallback(() =>
    <FormField control={form.control} name="email" render={({ field }) =>
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormDescription>
          This email will be used for the company admin login.
        </FormDescription>
        <FormControl><Input placeholder="johnspirit@example.com" {...field} className="bg-white" /></FormControl>
        <FormMessage />
      </FormItem>
    } />, [form.control])


  const PasswordInput = useCallback(() =>
    <>
      <FormField control={form.control} name="password" render={({ field }) =>
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormDescription>Must be at least 8 characters</FormDescription>
          <FormControl><Input type="password" {...field} className="bg-white" /></FormControl>
          <FormMessage />
        </FormItem>
      } />
      <FormField control={form.control} name="confirm_password" render={({ field }) =>
        <FormItem>
          <FormLabel>Confirm Password</FormLabel>
          <FormControl><Input type="password" {...field} className="bg-white" /></FormControl>
          <FormMessage />
        </FormItem>
      } />
    </>, [form.control])

  return (

    <div className="w-full h-full flex flex-col items-center justify-center gap-5 overflow-scroll">
      <div>
        <div className="text-2xl">Create Account</div>
        <div className="font-mono text-sm text-gray-500">Create New Account for <span className="bg-black text-white px-1 text-xs">{company.name}</span></div>
      </div>
      <Card className="w-fit">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(form.handler)} className="flex flex-col p-5 gap-5 text-left">
            <FullNameInput />
            <EmailInput />
            <Card className="p-3 flex flex-col gap-5 bg-gray-50">
              <PasswordInput />
            </Card>
            <FormMessage />
            <Button type="submit" >REGISTER ACCOUNT</Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}



export default RegisterAccountForm