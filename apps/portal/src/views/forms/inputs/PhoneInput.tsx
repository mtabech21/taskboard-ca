import { cn } from "@taskboard/client/ui/src/utils";
import { forwardRef, useCallback, useEffect, useMemo, useRef } from "react";


export const PhoneInput = forwardRef((props: { onChange: (value: string) => void, value: string }, ref) => {
  const { value, onChange } = props
  const localRef = useRef<HTMLDivElement>(null);
  const formatted = useMemo(() => {
    const strings = [...value];
    let fm = '';
    strings.forEach((s, i) => {
      switch (i) {
        case 0: fm += '(' + s; break;
        case 1: fm += s; break;
        case 2: fm += s + ')'; break;
        case 3: fm += s; break;
        case 4: fm += s; break;
        case 5: fm += s + '-'; break;
        case 6: fm += s; break;
        case 7: fm += s; break;
        case 8: fm += +s; break;
        case 9: fm += s; break;
      }
    });
    return fm;
  }, [value]);


  const inputHandle = useCallback((key: string) => {
    let update = value;
    if (value.length < 10) { if ('0123456789'.includes(key)) { update += key } }
    if (key === 'Backspace') { update = update.substring(0, update.length - 1); }
    onChange(update)
  }, [onChange, value])

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

  const Single = (props: { s: string }) => <span className={cn({ 'text-gray-400': (props.s === '(' || props.s === ')' || props.s === '-') })} children={props.s} />
  return (
    <div className="border p-2 rounded flex font-mono text-sm hover:cursor-text focus:border-black shadow-sm bg-white w-[15em]" tabIndex={0} ref={setRefs}>
      <div className="flex justify-center items-center h-full aspect-square text-gray-600"><span className="text-gray-400" children={'+'} />1</div>
      <div className="space-x-0.5">{[...formatted].map((s, i) => <Single key={i} s={s} />)}</div>
    </div>
  )
})