// import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shad/form";
// import { FieldPath, FieldValues, useController, UseControllerProps } from "react-hook-form";

// export function CustomField<
//   TFieldValues extends FieldValues = FieldValues,
//   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
// >({
//   ...props
// }: UseControllerProps<TFieldValues, TName> & { label?: string, children: JSX.Element }) {
//   const { field, fieldState, formState } = useController(props)

//   return (
//     <FormItem>
//       {props.label && <FormLabel>{props.label}</FormLabel>}
//       <FormControl>
//         {props.children}
//       </FormControl>
//       <FormMessage />
//     </FormItem >
//   )
// }