import { Separator } from "@shad/separator";
import { cn } from "@taskboard/client/ui/src/utils";
import { forwardRef, Fragment, useCallback, useEffect, useRef } from "react";


export const DigitsInput = forwardRef((props: { onChange: (value: string) => void, value: string, format?: string, fromRight?: boolean, className?: string }, ref) => {
  const { format = '$xx.xx', value, onChange, fromRight = false, className } = props
  const localRef = useRef<HTMLDivElement>(null);
  const max = format.replace(/[^x]/g, "").length

  const inputHandle = useCallback((key: string) => {
    let update = value;
    if (value.length < max) { if ('0123456789'.includes(key)) { update += key } }
    if (key == 'Backspace') { update = update.substring(0, update.length - 1); }
    onChange(update)
  }, [onChange, value, max])

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

  const Single = ({ ...props }: { v: string, i: number, className?: string }) => <div className={cn("rounded-none border-none w-5 flex-1 justify-center flex font-mono", props.className, className)} children={props.v[props.i]} />;

  return (
    <div tabIndex={0} ref={setRefs} className="flex h-6 select-none text-sm border-2 w-fit rounded overflow-hidden hover:cursor-text focus:border-black bg-white" >
      <div className="flex h-6 select-none text-sm w-full font-mono">
        {
          format.split('').map((c, i) => (
            <Fragment key={i}>{
              c == 'x' ? <>
                <Single v={value} i={
                  fromRight ? format.slice(0, i).replace(/[^x]/g, "").length + value.length - max
                    : format.slice(0, i).replace(/[^x]/g, "").length
                } className="font-bold" />
                {(format[i + 1] != ' ') && i != format.length - 1 && <Separator orientation="vertical" className="bg-gray-100" />}
              </> :
                c == ' ' ? <>
                  <Separator orientation="vertical" />
                  <Separator orientation="vertical" />
                </> : <>
                  <Single v={c} i={0} className={cn("text-gray-600 bg-gray-50", { 'max-w-3': c == '.' || c == ',' })} />
                  <Separator orientation="vertical" className="bg-gray-100" />
                </>
            }</Fragment>
          ))
        }
      </div>
    </div>
  )
})