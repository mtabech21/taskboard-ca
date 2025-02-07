import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shad/form";
import { Input } from "@shad/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@shad/select";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";
import bankList from '../external_data/banks.json'



export function BankInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: UseControllerProps<TFieldValues, TName> & { transit: FieldPath<TFieldValues>; institution: FieldPath<TFieldValues>; account: FieldPath<TFieldValues>; }) {
  return (
    <div className="flex flex-col gap-3">
      <FormLabel>Direct Deposit Information</FormLabel>
      <div className="flex gap-5 font-mono">
        <div className="w-[30%]">
          <FormField control={props.control} name={props.transit} render={({ field }) => <FormItem>
            <FormLabel className="text-xs text-gray-600">Transit</FormLabel>
            <FormControl>
              <Input maxLength={5} placeholder="00000" {...field} className="bg-white" />
            </FormControl>
            <FormMessage />
          </FormItem>} />
        </div>
        <div className="w-[20%]">
          <FormField control={props.control} name={props.institution} render={({ field }) => <FormItem>
            <FormLabel className="text-xs text-gray-600">Bank</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange} defaultValue="001">
                <SelectTrigger className="max-w-min bg-white" >
                  <div>{field.value}</div>
                </SelectTrigger>
                <SelectContent>
                  {bankList.map((bank) => (
                    <SelectItem key={bank.code} value={String(bank.code)}><div>
                      <div>{bank.code}</div>
                      <div className="text-gray-500 text-xs">{bank.name}</div>
                    </div>
                    </SelectItem>
                  ))}

                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>} />
        </div>
        <div className="w-[50%]">
          <FormField control={props.control} name={props.account} render={({ field }) => <FormItem>
            <FormLabel className="text-xs text-gray-600">Account Number</FormLabel>
            <FormControl>
              <Input maxLength={12} placeholder="0000000" {...field} className="bg-white" />
            </FormControl>
            <FormMessage />
          </FormItem>} />
        </div>
      </div>
    </div>
  );
}
