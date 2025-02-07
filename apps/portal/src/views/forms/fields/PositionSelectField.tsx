
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shad/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shad/select";
import { useQuery } from "@tanstack/react-query";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";
import { useAPI } from "@taskboard/client/hooks/global/use-api";
import { useManagerAccount } from "@taskboard/client/hooks/accounts/use-manager";
import { CompanyPosition } from "@taskboard/types";



export function PositionSelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: UseControllerProps<TFieldValues, TName>) {
  const api = useAPI.context()
  const { company } = useManagerAccount.context()
  const positions = useQuery({ queryKey: ['position_list_item', company.id], queryFn: () => api.get<CompanyPosition[]>(`/payroll/positions/${company.id}`).then((r) => r.data), initialData: [] })

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