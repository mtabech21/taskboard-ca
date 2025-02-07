import { FormControl, FormField, FormItem, FormLabel } from "@shad/form";
import { Input } from "@shad/input";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";

export function FullNameField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: { left: UseControllerProps<TFieldValues, TName>; right: UseControllerProps<TFieldValues, TName>; }) {
  return (
    <div className="flex gap-2 w-full *:flex-1">
      <FormField control={props.left.control} name={props.left.name} render={({ field }) => <FormItem>
        <FormLabel>First Name <span className="text-xs font-normal">(Legal)</span></FormLabel>
        <FormControl><Input placeholder="John" {...field} className="bg-white" /></FormControl>
      </FormItem>} />
      <FormField control={props.right.control} name={props.right.name} render={({ field }) => <FormItem>
        <FormLabel>Last Name <span className="text-xs font-normal">(Legal)</span></FormLabel>
        <FormControl><Input placeholder="Spirit" {...field} className="bg-white" /></FormControl>
      </FormItem>} />
    </div>
  );
}
