import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shad/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shad/select";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";


export function EmploymentTypeField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: UseControllerProps<TFieldValues, TName>) {
  const employment_types: { name: string, code: string }[] = [
    {
      name: 'Full Time',
      code: 'full_time'
    },
    {
      name: 'Part Time',
      code: 'part_time'
    },
    {
      name: 'Seasonal',
      code: 'seasonal'
    },
    {
      name: 'Temporary',
      code: 'temporary'
    },
  ]

  return (
    <FormField {...props} render={({ field }) => (
      <FormItem>
        <FormLabel>Type</FormLabel>
        <FormControl>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-min bg-white">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {employment_types.map((t) => (
                <SelectItem key={t.code} value={t.code}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    )
    } />


  )
}