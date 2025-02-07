import { usePuncher } from "@taskboard/client/hooks/puncher/use-puncher";
import { PunchType } from "@taskboard/types";
import React, { useCallback, useState } from "react";
import { useEffect } from "react";

export function usePunchTypeInput() {
  const puncher = usePuncher.context()
  const [selections, setSelections] = useState<PunchType[]>([]);

  const [selectedType, setSelectedType] = useState<PunchType>(selections[0]);

  const init = useCallback(() => setSelectedType(selections[0]), [selections])

  useEffect(() => {
    init()
  }, [init])

  const handleCancel = useCallback(() => puncher.setPunchingFor(null), [puncher]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>, type: PunchType) => {
    e.preventDefault();
    const user_id = puncher.punchingFor?.associate_id
    if (!user_id) { throw new Error("NO UID"); }
    puncher.punch({ user_id, type });
    puncher.setPunchingFor(null);
    setSelectedType(selections[0])
  }, [puncher, selections]);

  const handleSelection = useCallback((e: KeyboardEvent) => {

    setSelectedType(prev => {
      const i = selections.findIndex((x) => x === prev);
      if (e.key === "ArrowRight") return selections[(((i % selections.length) + selections.length) + 1) % selections.length];
      else if (e.key === "ArrowLeft") return selections[(((i % selections.length) + selections.length) - 1) % selections.length];
      else if (e.key === "Enter") return prev;
      else return selections[0];
    });
  }, [selections]);

  useEffect(() => {
    window.addEventListener("keydown", e => handleSelection(e), { once: true });
    return () => {
      window.removeEventListener("keydown", (e) => handleSelection(e), true);
    };
  }, [selectedType, handleSelection]);

  useEffect(() => {
    const user = puncher.punches.find((u) => u.badge.associate_id === puncher.punchingFor?.associate_id)
    setSelections(() => {
      if (user?.punches[user.punches.length - 1].type === 'in') return ['meal', 'out']
      else return ['in']
    })
  }, [puncher.punchingFor, puncher.punches])
  return { selections, selectedType, handleCancel, handleSubmit, init };

}
