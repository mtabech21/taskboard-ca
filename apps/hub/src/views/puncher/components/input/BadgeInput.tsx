import { usePuncher } from "@taskboard/client/hooks/puncher/use-puncher";
import React, { useEffect, useRef, useState } from "react";

const BadgeInput = () => {

  const badgeInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const l = (e: KeyboardEvent) => {
      if ((e.key === "c") && (badgeInputRef.current != null)) {
        if (document.activeElement?.nodeName === 'BODY') { badgeInputRef.current.focus() }
      }

    }
    window.addEventListener("keypress", l)
    return () => window.removeEventListener('keypress', l)
  })

  const [input, setInput] = useState("");

  const update = (e: React.ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value.replace(/\D/g, '')
    setInput(str);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (e != null) {
      e.preventDefault();
    }
    handle(input)
    setInput("")
  };

  const puncher = usePuncher.context()

  const handle = (bn: string) => {
    const badge = puncher.badges.find((badge) => bn === badge.badge_number)
    console.log(puncher.badges)
    if (badge !== undefined) {
      puncher.setPunchingFor(badge)
    }
  }



  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className='font-mono font-semibold'>
        BADGE ID
      </div>
      <input
        className={'boing placeholder:text-gray-500 cursor-pointer h-14 w-32 text-3xl text-center font-semibold font-mono border border-black bg-slate-100 rounded m-2 focus:w-44 focus:bg-white focus:cursor-text focus:placeholder:text-white'}
        ref={badgeInputRef}
        value={input}
        maxLength={6}
        minLength={5}
        onChange={update}
        placeholder="[C]"
      ></input>
    </form>
  );
};

export default BadgeInput;
