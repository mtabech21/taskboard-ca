import { Button } from "@shad/button"
import { Card } from "@shad/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shad/form"
import { Input } from "@shad/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { ExternalLink } from "lucide-react"
import { z } from "zod"
import { AddressField } from "./fields/AddressField"
import { NewCompany, User } from "@taskboard/types"
import { useAPI } from "@taskboard/client/hooks/global/use-api"

function useNewCompanyForm(token?: string) {

  const api = useAPI.context()

  const schema = z.object({
    name: z.string().min(3),
    domain: z.string().min(5),
    address: z.object({
      formatted: z.string(),
      place_id_google: z.string()
    })
  })

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      address: undefined,
      domain: '',
      name: '',
    }, resolver: zodResolver(schema)
  })

  async function handler(): Promise<void> {
    const values = form.getValues()
    await api.post(`/company/create`, { domain: values.domain, address: values.address.formatted, name: values.name, place_id_google: values.address.place_id_google } as NewCompany, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  return { ...form, handler, token }
}

function RegisterCompanyForm() {

  const form = useNewCompanyForm()

  // const FullNameInput = useCallback(() =>
  //   <div className="flex gap-2">
  //     <FormField control={form.control} name="first_name" render={({ field }) =>
  //       <FormItem>
  //         <FormLabel>First Name</FormLabel>
  //         <FormControl><Input placeholder="John" {...field} /></FormControl>
  //       </FormItem>
  //     } />
  //     <FormField control={form.control} name="last_name" render={({ field }) =>
  //       <FormItem>
  //         <FormLabel>Last Name</FormLabel>
  //         <FormControl><Input placeholder="Spirit" {...field} /></FormControl>
  //       </FormItem>
  //     } />
  //   </div>, [form.control])


  // const EmailInput = useCallback(() =>
  //   <FormField control={form.control} name="email" render={({ field }) =>
  //     <FormItem>
  //       <FormLabel>Email</FormLabel>
  //       <FormDescription>
  //         This email will be used for the company admin login.
  //       </FormDescription>
  //       <FormControl><Input placeholder="johnspirit@example.com" {...field} className="bg-white" /></FormControl>
  //       <FormMessage />
  //     </FormItem>
  //   } />, [form.control])

  const CompanyInput = useCallback(() =>
    <>
      <FormField control={form.control} name="name" render={({ field }) =>
        <FormItem>
          <FormLabel>Company Name</FormLabel>
          <FormControl><Input placeholder="Milk Company Inc." {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      } />
      <FormField control={form.control} name="domain" render={({ field }) =>
        <FormItem>
          <FormLabel>Company Website</FormLabel>
          <FormControl><Input placeholder="milkcompany.com" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      } />
    </>, [form.control,])

  // const PasswordInput = useCallback(() =>
  //   <>
  //     <FormField control={form.control} name="password" render={({ field }) =>
  //       <FormItem>
  //         <FormLabel>Password</FormLabel>
  //         <FormDescription>Must be at least 8 characters</FormDescription>
  //         <FormControl><Input type="password" {...field} className="bg-white" /></FormControl>
  //         <FormMessage />
  //       </FormItem>
  //     } />
  //     <FormField control={form.control} name="confirm_password" render={({ field }) =>
  //       <FormItem>
  //         <FormLabel>Confirm Password</FormLabel>
  //         <FormControl><Input type="password" {...field} className="bg-white" /></FormControl>
  //         <FormMessage />
  //       </FormItem>
  //     } />
  //   </>, [form.control])

  return (
    <div className="w-full h-full flex justify-center">
      <div className="h-full overflow-scroll flex flex-col items-center gap-5 p-5 w-full">
        <div>
          <div className="text-2xl">Create Company</div>
        </div>
        <Card className="w-fit">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(form.handler)} className="flex flex-col p-5 gap-5 text-left">
              <CompanyInput />
              <AddressField control={form.control} name="address" />
              <Card className="p-3 flex flex-col gap-5 bg-gray-50">
              </Card>
              <FormMessage />
              <Button type="submit" >CREATE COMPANY</Button>
            </form>
          </Form>
        </Card>
        <div className="text-sm text-gray-500 flex items-center justify-center gap-2"><div>COPYRIGHT 2024 © METE SOLUTIONS INC.</div><a href="https://metesolutions.com" target="_blank" rel="noreferrer" className="text-sx"><ExternalLink size={15} className="text-blue-500 hover:text-blue-400" /></a></div>

      </div>
    </div>
  )
}



export default RegisterCompanyForm