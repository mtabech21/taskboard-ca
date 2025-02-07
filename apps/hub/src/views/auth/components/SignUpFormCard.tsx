
import { Button } from "@shad/button"
import { Form, FormField, FormItem } from "@shad/form"
import { Input } from "@shad/input"
import { Label } from "@shad/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shad/select"
import { Unauthenticated } from "@taskboard/types"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { FieldPath, FieldValues, useController, UseControllerProps, useForm } from "react-hook-form"
import { z } from "zod"
import { FullNameField } from "../../forms/fields/FullNameField"
import { PhoneField } from "../../forms/fields/PhoneField"

const signUpFormSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  password: z.string().min(8),
  confirm_password: z.string()
})


function useSignUp(auth: Unauthenticated) {

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      confirm_password: '',
      email: '',
      password: '',
      phone: ''
    },
  })

  function handler() {
    auth.signUp(form.getValues())
  }

  return { form, handler }
}

export default function SignUpFormCard(props: { auth: Unauthenticated; }) {
  const { form, handler } = useSignUp(props.auth)
  return (

    <Form {...form} >
      <form className={'flex flex-col gap-8 select-none '} autoComplete="off" onSubmit={form.handleSubmit(handler)}  >
        <div className="flex flex-col gap-3 ">
          <FullNameField left={{ control: form.control, name: 'first_name' }} right={{ control: form.control, name: 'last_name' }} />
          <FormField control={form.control} name="email" render={({ field }) =>
            <div className="text-left">
              <Label >Email</Label>
              <Input {...field} autoComplete="off" />
            </div>
          } />
          <PhoneField control={form.control} name="phone" />
          <FormField control={form.control} name="password" render={({ field }) =>
            <div className="text-left">
              <Label >Password</Label>
              <Input {...field} type="password" autoComplete="off" />
            </div>
          } />
          <FormField control={form.control} name="confirm_password" render={({ field }) =>
            <div className="text-left">
              <Label >Confirm Password</Label>
              <Input {...field} type="password" />
            </div>
          } />

        </div>

        <div className="flex flex-col gap-3 text-gray-600">
          <Button className="bg-blue min-w-full hover:bg-blue hover:opacity-85 rounded font-tb_medium shadow-lg" type="submit" disabled={!form.formState.isValid} style={{ width: '6em' }} >Next</Button>
          <div className="text-xs">By signing up, you agree to the <span className="text-blue cursor-pointer hover:underline">Terms of Service</span> and <span className="text-blue cursor-pointer hover:underline">Privacy Policy</span>, including <span className="text-blue cursor-pointer hover:underline">Cookie Use</span>.</div>
        </div>
      </form>
    </Form>

  )
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


export function BirthDateField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: UseControllerProps<TFieldValues, TName>) {
  const { value, onChange } = useController(props).field;

  const [days, setDays] = useState(31)
  const [day, month, year] = (value as string).split('-')


  useEffect(() => {
    setDays(() => {
      switch (month) {
        case 'January':
        case 'March':
        case 'May':
        case 'July':
        case 'August':
        case 'October':
        case 'December':
          return 31
        case 'April':
        case 'June':
        case 'September':
        case 'November':
          return 30
        case 'February':
          if (Number(year) && ((Number(year) % 4 === 0 && Number(year) % 100 !== 0) || (Number(year) % 400 === 0))) {
            return 29
          } else {
            return 28
          }
        default:
          return 31
      }
    })

  }, [month, year])

  return (
    <FormField {...props} name={props.name} render={() =>
      <FormItem className="flex justify-center items-center ">
        <Select onValueChange={v => onChange(`${String(v)}-${month}-${year}`)} value={String(day)}>
          <div>
            <SelectTrigger className="border-none shadow-none focus:ring-0 text-lg">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
          </div>
          <SelectContent className="w-fit">
            {Array.from({ length: days }).map((_, i) => (
              <SelectItem key={i} value={String(i + 1)}>{String(i + 1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={v => onChange(`${day}-${String(months.findIndex(p => p === v)) + 1}-${year}`)} value={month}>
          <SelectTrigger className="border-none shadow-none focus:ring-0 text-lg" >
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={v => onChange(`${day}-${month}-${String(v)}`)} value={String(year)}>
          <SelectTrigger className="border-none shadow-none focus:ring-0 text-lg">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: new Date().getFullYear() - 1900 }).map((_, i) => (
              <SelectItem key={i} value={String(i + 1900)}>{String(i + 1900)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>
    } />
  )
}
