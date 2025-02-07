import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shad/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shad/select";
import { useQuery } from "@tanstack/react-query";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";
import { CompanyPosition } from "@taskboard/types";
import { useHub } from "@taskboard/client/hooks/accounts/use-hub";
import { useAPI } from "@taskboard/client/hooks/global/use-api";



export function PositionSelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: UseControllerProps<TFieldValues, TName>) {
  const api = useAPI.context()
  const { account } = useHub.context()
  const positions = useQuery({ queryKey: ['position_list_item'], queryFn: () => api.get<CompanyPosition[]>(`/payroll/positions/${account.company.id}`).then((r) => r.data), initialData: [] })

  return (
    <FormField {...props} render={({ field }) => (
      <FormItem>
        <FormLabel>Position</FormLabel>
        <FormControl>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="min-w-[180px] w-full bg-white">
              <SelectValue placeholder="Select Position" />
            </SelectTrigger>
            <SelectContent>
              {positions.data.map((position) => (
                <SelectItem key={position.id} value={position.id}>{position.name}</SelectItem>
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