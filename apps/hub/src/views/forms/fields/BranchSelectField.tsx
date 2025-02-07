
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shad/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shad/select";
import { Branch } from "@taskboard/types";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";



export function BranchSelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: UseControllerProps<TFieldValues, TName> & { branches: Branch[] }) {

  return (
    <FormField {...props} render={({ field }) => (
      <FormItem>
        <FormLabel>Branch</FormLabel>
        <FormControl>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="min-w-[180px] w-full bg-white">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>

              {props.branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>{branch.number}</SelectItem>
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