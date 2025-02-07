import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shad/form";
import { AddressSearchWidget } from "../../profile/components/AddressSearchWidget";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";

export function AddressField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: UseControllerProps<TFieldValues, TName>) {
  return (
    <FormField control={props.control} name={props.name} render={({ field }) => <FormItem>
      <FormLabel>Address</FormLabel>
      <FormControl>
        <AddressSearchWidget onChange={field.onChange} value={field.value} />
      </FormControl>
      <FormMessage />
    </FormItem>} />
  );
}
