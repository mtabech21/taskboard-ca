import { Separator } from "@shad/separator";
import { Calendar, CalendarX } from "lucide-react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { FormControl, FormField, FormItem } from "@shad/form";
import { FieldPath, FieldValues, useController, UseControllerProps } from "react-hook-form";
import { cn } from "@taskboard/client/ui/src/utils";


export function ExpirySinInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: UseControllerProps<TFieldValues, TName>) {
  const { field } = useController(props)
  const valid = (field.value?.valueOf() ?? 0) > Date.now();

  return (
    <FormField {...props} render={() => <FormItem>
      <div className="flex gap-2 items-center">
        <div className="text-xs text-gray-500 px-1 select-none">Expiry Date:</div>
        <FormControl>
          <DateInput onChange={field.onChange} value={field.value} />
        </FormControl>
        {!field.value || valid ? <Calendar size={15} className={cn("text-gray-400", { 'text-green-600': valid })} /> : <CalendarX size={15} className={cn({ 'text-red-600': field.value && !valid })} />}
      </div>
    </FormItem>} />
  );
}

type DateFormat = 'yyyy-mm-dd' | 'dd-mm-yyyy' | 'mm-dd-yyyy'

const DateInput = forwardRef((props: { onChange: (value?: Date) => void, value: Date, format?: DateFormat, isValid?: boolean }, ref) => {
  const { format = 'yyyy-mm-dd', value, onChange, isValid = true } = props
  format
  const localRef = useRef<HTMLDivElement>(null);
  const is_focused = localRef.current == document.activeElement;
  const [input, set_input] = useState('')
  useEffect(() => {
    if (input.length < 8) {
      onChange()
    } else {
      const date = new Date(0)
      const yyyy = Number(input.slice(0, 4))
      const mm = Number(input.slice(4, 6)) - 1
      const dd = Number(input.slice(6, 8))
      date.setFullYear(yyyy, mm, dd)
      onChange(date)
    }
  }, [input, onChange])

  const inputHandle = useCallback((key: string) => {
    set_input(p => {
      let update = p;
      if (p.length < 10) { if ('0123456789'.includes(key)) { update += key } }
      if (key == 'Backspace') { update = update.substring(0, update.length - 1); }
      return update
    })
  }, [])

  useEffect(() => {
    const current = localRef.current;
    const handleKeyDown = (e: KeyboardEvent) => inputHandle(e.key)
    current && current.addEventListener('keydown', handleKeyDown);
    return () => {
      current && current.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputHandle]);

  const setRefs = useCallback((node: HTMLDivElement) => {
    (localRef as React.MutableRefObject<HTMLDivElement>).current = node;
    if (typeof ref === 'function') { ref(node); }
    else if (ref) { (ref as React.MutableRefObject<HTMLDivElement>).current = node; }
  }, [ref]);
  const DateSingle = useCallback(({ ...props }: { i: number; default: string; }) => {
    return (
      <div className={cn("rounded-none border-none w-4 text-center align-middle justify-center items-center flex font-mono", { 'text-gray-300': input[props.i] == undefined })} children={input[props.i] ?? props.default} />
    );
  }, [input]);

  return (
    <div className={cn("flex gap-1 items-center focus:*:border-black", { 'text-red-600': value && !isValid })} tabIndex={0} ref={setRefs}>
      <div className={cn("h-5 select-none text-xs flex border rounded overflow-hidden w-fit hover:cursor-text focus:border-black  bg-white", { 'border-gray-600': (is_focused && input.length < 4) || (is_focused && input.length == 8), 'border-red-600': value && !isValid })}>
        <DateSingle i={0} default="y" />
        <Separator orientation="vertical" className="bg-gray-100" />
        <DateSingle i={1} default="y" />
        <Separator orientation="vertical" className="bg-gray-100" />
        <DateSingle i={2} default="y" />
        <Separator orientation="vertical" className="bg-gray-100" />
        <DateSingle i={3} default="y" />
      </div>
      <div className={cn("h-5 select-none text-xs flex border rounded overflow-hidden w-fit hover:cursor-text focus:border-black  bg-white", { 'border-gray-600': (is_focused && input.length < 6 && !(input.length < 4)) || (is_focused && input.length == 8), 'border-red-600': value && !isValid })}>
        <DateSingle i={4} default="m" />
        <Separator orientation="vertical" className="bg-gray-100" />
        <DateSingle i={5} default="m" />
      </div>
      <div className={cn("h-5 select-none text-xs flex border rounded overflow-hidden w-fit hover:cursor-text focus:border-black  bg-white", { 'border-gray-600': (is_focused && input.length <= 8 && !(input.length < 6)) || (is_focused && input.length == 8), 'border-red-600': value && !isValid })}>
        <DateSingle i={6} default="d" />
        <Separator orientation="vertical" className="bg-gray-100" />
        <DateSingle i={7} default="d" />
      </div>
    </div>
  )
})