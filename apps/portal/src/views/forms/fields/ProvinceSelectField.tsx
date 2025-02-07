import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shad/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shad/select";
import { TriangleAlertIcon } from "lucide-react";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";


export function ProvinceSelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: UseControllerProps<TFieldValues, TName> & { mismatch: boolean }) {
  const provinces: { province: string, code: string }[] = [
    {
      code: 'NB',
      province: 'New Brunswick'
    },
    {
      code: 'NF',
      province: 'Newfoundland'
    },
    {
      code: 'NS',
      province: 'Nova Scotia'
    },
    {
      code: 'ON',
      province: 'Ontario'
    },
    {
      code: 'PE',
      province: 'Prince Edward Island'
    },
    {
      code: 'QC',
      province: 'Quebec'
    },
  ]

  return (
    <FormField {...props} render={({ field }) => (
      <FormItem>
        <FormLabel>Province</FormLabel>
        <div className="flex gap-3 items-center">
          <FormControl>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-min bg-white">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((p) => (
                  <SelectItem key={p.code} value={p.code}>{p.province}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {props.mismatch && <div className="text-xs bg-yellow-50 p-1 px-2 border border-yellow-400 rounded text text-yellow-600 w-min whitespace-nowrap flex items-center gap-1 align-middle" >
            <TriangleAlertIcon />
            <div>Residential and employment province do not match.</div>
          </div>}
        </div>
        <FormMessage />
      </FormItem>
    )
    } />


  )
}