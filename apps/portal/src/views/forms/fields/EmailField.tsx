import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shad/form";
import { Input } from "@shad/input";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";


export function EmailField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: UseControllerProps<TFieldValues, TName>) {
  return (
    <FormField control={props.control} name={props.name} render={({ field }) => <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl><Input placeholder="johnspirit@example.com" {...field} className="bg-white" /></FormControl>
      <FormMessage />
    </FormItem>} />
  );
}
