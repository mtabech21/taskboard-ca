import { Button } from "@shad/button"
import { Card, CardDescription, CardTitle } from "@shad/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shad/form"
import { Input } from "@shad/input"
import { Company, NewCompanyForm } from "@taskboard/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { ExternalLink, Key } from "lucide-react"
import logo from '@assets/images/logo.svg'
import { AddressField } from "./fields/AddressField"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAPI } from "@taskboard/client/hooks/global/use-api"
import { useAuth } from "@taskboard/client/hooks/global/use-auth"
import { cn } from "@taskboard/client/ui/src/utils"

function useNewCompanyForm(token?: string) {
  const form = useForm<NewCompanyForm>({
    defaultValues: {
      address: undefined,
      domain: '',
      name: '',
    }, resolver: zodResolver(NewCompanyForm),
  })

  const api = useAPI.context()
  const client = useQueryClient()

  const { mutate: post } = useMutation({
    mutationKey: ['new_company'],
    mutationFn: async () => (await api.post<Company>(`/company/create`, form.getValues())),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['account'] })
    }
  })


  return { ...form, post, token }
}

function RegisterCompanyForm(props: { registration_key?: string }) {

  const { user } = useAuth.context()
  const search = new URLSearchParams(window.location.href)
  const key = props.registration_key ?? search.get('key')

  const [key_input, set_key_input] = useState(key ?? '')
  const [token] = useState<string>()
  const [invalid, set_invalid] = useState(false)

  useEffect(() => { set_invalid(false) }, [key_input])

  const form = useNewCompanyForm(token)

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

  return (
    (token || user) ?
      <div className="w-full h-full flex flex-col items-center justify-center gap-5 overflow-scroll">
        <div>
          <div className="text-2xl">Create Company</div>
          {token && <div className="font-mono text-sm text-gray-500">Your unique key: <span className="bg-black text-white px-1 text-xs">{key_input}</span></div>}
        </div>
        <Card className="w-fit">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => form.post())} className="flex flex-col p-5 gap-5 text-left">
              {/* {!user &&
                <>
                  <FullNameInput />
                  <EmailInput />
                </>
              } */}
              <CompanyInput />
              <AddressField control={form.control} name="address" />
              {!user && <Card className="p-3 flex flex-col gap-5 bg-gray-50">
                {/* <PasswordInput /> */}
              </Card>
              }
              <FormMessage />
              <Button type="submit" >CREATE COMPANY</Button>
            </form>
          </Form>
        </Card>
        <div className="text-sm text-gray-500 flex items-center justify-center gap-2"><div>COPYRIGHT 2024 © METE SOLUTIONS INC.</div><a href="https://metesolutions.com" target="_blank" rel="noreferrer" className="text-sx"><ExternalLink size={15} className="text-blue-500 hover:text-blue-400" /></a></div>
      </div> :
      <div className="flex h-full w-full">
        <div className="m-auto flex flex-col justify-center items-center gap-10">
          <img alt='logo' src={logo} style={{ maxHeight: '3em', userSelect: 'none', aspectRatio: "auto" }} />
          <Card className="max-w-fit p-5 flex flex-col gap-3">
            <CardTitle>Register Company</CardTitle>
            <CardDescription>Enter the unique key that you have been provided with</CardDescription>
            <Card className="p-3 gap-3 flex bg-gray-50 items-center">
              <Key className="text-blue-600" />
              <form className={cn("w-full")} >
                <Input className={cn("bg-white", { 'text-red-600': invalid })} value={key_input} onChange={(v) => set_key_input(v.currentTarget.value)} />
              </form >
            </Card>
            {invalid ? <div className="text-red-600 text-xs">Key is invalid.</div> : <div className="text-gray-600 text-xs">Enter to submit</div>}
          </Card>
          <div className="text-sm text-gray-500 flex items-center justify-center gap-2"><div>COPYRIGHT 2024 © METE SOLUTIONS INC.</div><a href="https://metesolutions.com" target="_blank" rel="noreferrer" className="text-sx"><ExternalLink size={15} className="text-blue-500 hover:text-blue-400" /></a></div>
        </div>
      </div >
  )
}

export default RegisterCompanyForm