import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shad/form";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";
import { DigitsInput } from "../inputs/DigitsInput";


export function BadgeField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: UseControllerProps<TFieldValues, TName> & { available: boolean }) {



  return (
    <FormField {...props} name={props.name} render={({ field }) => <FormItem>
      <div className="flex flex-col gap-2">
        <FormLabel>Badge Number</FormLabel>
        <div className="flex gap-3 items-center">
          <FormControl>
            <div className="bg-gray-100 p-2 border w-fit rounded">
              <DigitsInput onChange={field.onChange} value={field.value} format="x x x x x x" fromRight />
            </div>
          </FormControl>
          {!props.available ? <div className="text-xs text-red-600">Already in use</div> :
            field.value.length >= 5 ? <div className="text-xs text-green-600">Available</div> :
              <div className="text-xs text-gray-400">Enter badge number</div>}
        </div>
      </div>
      <FormMessage />
    </FormItem>} />
  );
}