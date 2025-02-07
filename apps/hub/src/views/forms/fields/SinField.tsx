import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shad/form";
import { FieldPath, FieldValues, useController, UseControllerProps } from "react-hook-form";

import { DigitsInput } from "../inputs/DigitsInput";
import { cn } from "@taskboard/client/ui/src/utils";


export function SINField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: UseControllerProps<TFieldValues, TName>) {

  const { field } = useController(props);
  const [invalid, set_invalid] = useState(false);

  useEffect(() => {
    set_invalid(() => {
      if (field.value[0] === '8' || field.value[0] === '0') return true;
      if (field.value.length === 9) {
        const check_sum_string = [...'121212121'];
        const digits = [...field.value];
        const result = digits.map((d, i) => {
          const mult = Number(d) * Number(check_sum_string[i]);
          if (mult < 10) { return mult; }
          else { return Number(String(mult)[0]) + Number(String(mult)[1]); }
        });
        let sum = 0;
        result.forEach(n => sum += n);
        const is_valid = sum % 10 === 0;

        return !is_valid;
      } else return false;
    });
  }, [field]);



  return (

    <FormField {...props} render={({ field }) => <FormItem>
      <FormLabel className={cn({ 'text-red-600': invalid })}>Social Insurance Number (SIN)</FormLabel>
      <div className="flex gap-3">
        <FormControl>
          <DigitsInput value={field.value} onChange={field.onChange} format="xxx xxx xxx" />
        </FormControl>
        <div className=" flex justify-center items-center select-none">
          {!invalid && field.value.length === 9 ? <Check className="text-green-600 text-xs font-mono" /> :
            invalid ? <X className="text-red-600 text-xs font-mono" /> :
              <div children={'Enter your SIN'} className="text-gray-400 text-xs font-mono" />}
        </div>
      </div>
      <FormMessage />
    </FormItem>} />
  );
}
