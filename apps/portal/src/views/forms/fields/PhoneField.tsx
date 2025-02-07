import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shad/form";
import { FieldPath, FieldValues, useController, UseControllerProps } from "react-hook-form";
import { PhoneInput } from "../inputs/PhoneInput";


export function PhoneField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: UseControllerProps<TFieldValues, TName>) {
  const { field } = useController(props);

  return (
    <FormField {...props} name={props.name} render={() => <FormItem>
      <FormLabel>Phone Number</FormLabel>
      <FormControl>
        <PhoneInput onChange={field.onChange} value={field.value} />
      </FormControl>
      <FormMessage />
    </FormItem>} />
  );
}
