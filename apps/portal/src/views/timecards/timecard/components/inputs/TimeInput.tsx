
import { cn } from "@taskboard/client/ui/src/utils"
import { ClassValue } from "clsx"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"


function TimeInput(props: { tabIndex?: number, className?: ClassValue, value: string, onSubmit?: (value: string) => void, disabled?: boolean }) {

  const [input, setInput] = useState(props.value)
  const backup = useRef(String(props.value))
  const [color, setColor] = useState<'blue' | 'red'>('blue')

  useEffect(() => { setInput(props.value) }, [props.value])

  function flashError() {
    setColor('red')
    setTimeout(() => { setColor('blue'); setTimeout(() => { setColor('red'); setTimeout(() => { setColor('blue') }, 140) }, 140) }, 140)
  }

  const disabled = useMemo(() => props.disabled ?? false, [props.disabled])

  const ref = useRef<HTMLDivElement>(null)

  const submit = useCallback(() => {
    props.onSubmit && props.onSubmit(backup.current)
  }, [backup, props])

  const validate = useCallback(async () => {
    setInput(pr => {
      try {
        let inp = pr
        if (inp.length === 0) { backup.current = inp; ref.current?.blur(); return inp }
        else if (Number(inp) === 0) { flashError(); return backup.current }
        if (inp.length <= 2 && inp.length > 0) { inp += '00' }
        let time = ''
        let ampm = ''
        const a = inp.indexOf('A');
        const p = inp.indexOf('P');
        if (a > 0) {
          ampm = 'AM'
          if (Number(inp.substring(0, a)) < 1260) { time = inp.substring(0, a); if (time.length <= 2) { time += '00' } } else { flashError(); return backup.current }
        }
        else if (p > 0) {
          ampm = 'PM'
          if (Number(inp.substring(0, p)) < 1260) { time = inp.substring(0, p); if (time.length <= 2) { time += '00' } } else { flashError(); return backup.current }
        }
        else {
          if (Number(inp) > 2359) { flashError(); return backup.current }
          else if (Number(inp) < 1200) { ampm = 'AM'; time = inp }
          else if (Number(inp) < 1300) { ampm = 'PM'; time = inp }
          else { ampm = 'PM'; time = String(Number(inp) - 1200) }
        }

        if (Number(time) > 2359) { flashError(); return backup.current }
        const result = time + ampm
        backup.current = String(result)
        setColor('blue')
        ref.current?.blur();
        return result
      } catch {
        setColor('red'); return backup.current
      }
    })
  }, [])

  useEffect(() => {
    function InputHandle(key: string) {
      setInput(p => {
        let inp = p
        if (disabled) return inp
        if (p.includes('A') || p.includes('P')) {
          switch (key) {
            case 'M':
            case 'm':
              inp += 'M'; validate(); break;
            case 'Enter': validate(); break;
            case '0': inp = '0'; break;
            case '1': inp = '1'; break;
            case '2': inp = '2'; break;
            case '3': inp = '3'; break;
            case '4': inp = '4'; break;
            case '5': inp = '5'; break;
            case '6': inp = '6'; break;
            case '7': inp = '7'; break;
            case '8': inp = '8'; break;
            case '9': inp = '9'; break;
          }
        }

        else if (inp.length === 3 && Number(inp[0]) > 2) {
          switch (key) {
            case 'a':
            case 'A':
              inp += 'A'; break;
            case 'p':
            case 'P':
              inp += 'P'; break;
          }
        }
        else if (Number(inp[0]) > 1 && inp.length === 1) {
          switch (key) {
            case '0': inp += '0'; break;
            case '1': inp += '1'; break;
            case '2': inp += '2'; break;
            case '3': inp += '3'; break;
            case '4': inp += '4'; break;
            case '5': inp += '5'; break;
            case 'a':
            case 'A':
              inp += 'A'; break;
            case 'p':
            case 'P':
              inp += 'P'; break;
          }
        }
        else if (inp.length < 4) {
          switch (key) {
            case '0': inp += '0'; break;
            case '1': inp += '1'; break;
            case '2': inp += '2'; break;
            case '3': inp += '3'; break;
            case '4': inp += '4'; break;
            case '5': inp += '5'; break;
            case '6': inp += '6'; break;
            case '7': inp += '7'; break;
            case '8': inp += '8'; break;
            case '9': inp += '9'; break;
            case 'a':
            case 'A':
              if (inp.length > 0) inp += 'A'; break;
            case 'p':
            case 'P':
              if (inp.length > 0) inp += 'P'; break;
          }
        }
        else if (inp.length < 5) {
          switch (key) {
            case 'a': if (inp.length > 2) inp += 'A'; break;
            case 'p': if (inp.length > 2) inp += 'P'; break;
          }
        }

        if (key === 'Backspace') { if (inp.includes('M')) { return '' } else { inp = inp.substring(0, inp.length - 1) } }
        if (key === 'Enter') { validate(); focusNextElement() }
        if (key === 'Tab') { validate(); focusNextElement() }
        if (Number(inp) > 2359) { inp = inp.substring(0, inp.length - 1) }
        return inp
      })
    }
    const current = ref.current
    function handler(e: KeyboardEvent) { e.preventDefault(); InputHandle(e.key) }
    current && ref.current.addEventListener('keydown', handler)
    return () => {
      current?.removeEventListener('keydown', handler)
    }
  }, [validate, disabled])

  useEffect(() => {
    const current = ref.current
    function focusOut() { validate().then(submit) }
    function setFocusState() {
      current?.removeEventListener('focusin', setFocusState);
    }
    if (current) {
      current.addEventListener('focusin', setFocusState)
      current.addEventListener('focusout', focusOut)
    }

    return () => {
      current?.removeEventListener('focusin', setFocusState)
      current?.removeEventListener('focusout', focusOut)
    }
  }, [validate, submit])

  function getDigit(digit: number) {
    let aorp = input.indexOf('A')
    if (aorp < 0) aorp = input.indexOf('P')
    const number = (5 - digit) + (aorp > 0 ? input.length - aorp : 0)
    return input.substring(0, aorp > 0 ? aorp : input.length)[0 + (input.length - number)]
  }
  function getAoP() {
    if (input.includes('A')) return 'A'
    if (input.includes('P')) return 'P'
    return
  }
  function getM() {
    if (input.includes('M')) return 'M'
    return
  }
  const focusNextElement = useCallback(() => {
    const focusable = Array.from(
      document.querySelectorAll<HTMLElement>(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("disabled"));

    const index = focusable.indexOf(ref.current!);
    if (index >= 0 && focusable[index + 1]) {
      focusable[index + 1].focus();
    }
  }, []);

  return (
    <div tabIndex={!props.disabled ? props.tabIndex ?? 0 : undefined} className={
      cn('border bg-white rounded flex *:flex-1 justify-evenly px-2 py-1 w-fit gap-1 select-none hover:cursor-text font font-mono outline-none',
        {
          'bg-gray-100 hover:cursor-not-allowed': disabled,
          'bg-red-50 border-red-500 focus:border-red-500 focus:bg-red-50': color === 'red',
          'focus:border-blue-500 focus:bg-blue-50': color === 'blue'
        }, 'font-extrabold focus:font-extralight', props.className)} ref={ref} >
      <div className={cn({ "text-gray-200 font-thin": !getDigit(1) })}>{getDigit(1) ?? '-'}</div>
      <div className={cn({ "text-gray-200 font-thin": !getDigit(2) })}>{getDigit(2) ?? '-'}</div>
      <div>:</div>
      <div className={cn({ "text-gray-200 font-thin": !getDigit(3) })}>{getDigit(3) ?? '-'}</div>
      <div className={cn({ "text-gray-200 font-thin": !getDigit(4) })}>{getDigit(4) ?? '-'}</div>
      <div className={cn({ "text-gray-200 font-thin": !getAoP() })}>{getAoP() ?? 'A'}</div>
      <div className={cn({ "text-gray-200 font-thin": !getM() })}>M</div>
    </div >
  )
}

export default TimeInput