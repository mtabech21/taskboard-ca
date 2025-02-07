
import { Card } from "@shad/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shad/form";
import { Input } from "@shad/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@shad/button";
import { AssociateSearch } from "../components/Filters";
import { useAPI } from "@taskboard/client/hooks/global/use-api";
import { useManagerAccount } from "@taskboard/client/hooks/accounts/use-manager";


function useNewBranchForm(company_id: string) {
  const api = useAPI.context()
  const nav = useNavigate()
  const schema = z.object({
    branch_name: z.string().min(3),
    branch_number: z.string().min(2).max(10),
    manager_associate_id: z.string().uuid()
  })

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      branch_name: '',
      branch_number: '',
      manager_associate_id: ''
    }, resolver: zodResolver(schema)
  })

  async function handler(): Promise<void> {
    const values = form.getValues()
    await api.post(`/company/${company_id}/create_branch`, values).then(() => {
      nav('/company', { replace: true })
    })
  }
  return { ...form, handler }
}

export function NewBranchForm() {
  const api = useAPI.context()

  const { company } = useManagerAccount.context()
  const form = useNewBranchForm(company.id)
  const associates = useQuery({ queryKey: ['associate_list'], queryFn: () => api.post(`/payroll/associates/list?company_id=${company.id}`).then(r => r.data) })

  const BranchNameInput = useCallback(() =>
    <FormField control={form.control} name="branch_name" render={({ field }) =>
      <FormItem>
        <FormLabel>Branch Number</FormLabel>
        <FormControl><Input placeholder="SPIRIT PLAZA" {...field} className="bg-white" /></FormControl>
        <FormMessage />
      </FormItem>
    } />, [form.control])

  const BranchNumberInput = useCallback(() =>
    <FormField control={form.control} name="branch_number" render={({ field }) =>
      <FormItem>
        <FormLabel>Branch Number</FormLabel>
        <FormControl><Input placeholder="00000" {...field} className="bg-white" /></FormControl>
        <FormMessage />
      </FormItem>
    } />, [form.control])

  if (associates.isPending) return 'Wait...'
  if (associates.isError) return 'ERROR'
  if (associates.isSuccess)
    return (
      <div className="w-full flex justify-center p-5">
        <Card className="w-fit bg-gray-50">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(form.handler)} className="flex flex-col p-5 gap-5 text-left">
              <BranchNameInput />
              <BranchNumberInput />
              <AssociateSearch />
              <Button type="submit" >CREATE BRANCH</Button>
            </form>
          </Form>
        </Card>
      </div>
    )
  else return (<div />)
}