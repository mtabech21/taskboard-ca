import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shad/form";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";
import { DigitsInput } from "../inputs/DigitsInput";

export function MoneyField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: UseControllerProps<TFieldValues, TName>) {


  return (
    <FormField {...props} name={props.name} render={({ field }) => <FormItem>
      <FormLabel>Rate</FormLabel>
      <FormControl>
        <DigitsInput onChange={field.onChange} value={field.value} format="$xx.xx" fromRight />
      </FormControl>
      <FormMessage />
    </FormItem>} />
  );
}