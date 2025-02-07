
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import z from 'zod'
import { AxiosResponse } from "axios"
import { AssociatePushData, FormData, NewAssociate, NewAssociateForm } from "@taskboard/types"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAPI } from "@taskboard/client/hooks/global/use-api"
import { toast } from "@taskboard/client/ui/src/hooks/use-toast"




export default function useNewAssociateForm___(badge_num: string, branch_id: string) {
  const api = useAPI.context()
  const [formData, setFormData] = useState<FormData>()
  const getBranchFormData = useCallback(async () => {
    const form_data = (await api.get<FormData>(`/payroll/new_associate_form_data?branch_id=${branch_id}`)).data
    setFormData(form_data)
  }, [branch_id, api])

  const form = useForm<z.infer<typeof NewAssociateForm>>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      position_id: '',
      badge_number: badge_num
    },
    resolver: zodResolver(NewAssociateForm)
  })

  async function onSubmit(): Promise<NewAssociate> {
    const values = form.getValues()
    const res = await api.post<AssociatePushData, AxiosResponse<NewAssociate>>('/payroll/associates/new', {
      badge_number: values.badge_number,
      email: values.email,
      first_name: values.first_name,
      last_name: values.last_name,
      position_id: values.position_id,
      branch_id: branch_id
    } as AssociatePushData)

    toast(<>
      <div>Associate has been added</div>
      <div>{String(res.data)}</div>
    </>)

    return res.data

  }

  useEffect(() => { getBranchFormData() }, [getBranchFormData])

  return { form, formData, onSubmit }
}