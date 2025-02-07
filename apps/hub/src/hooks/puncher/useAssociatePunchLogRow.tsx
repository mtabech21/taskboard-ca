import { useRef, useState } from "react";
import { TimecardRow } from "@taskboard/types";


export function getTimeInputString(timestamp: string): string {
  if (timestamp === undefined) return '';
  const time = new Date(Date.parse(timestamp));

  let hours = time.getHours();
  const minutes = time.getMinutes();
  let ampm = 'AM';
  if (hours === 12) { ampm = 'PM' }
  if (hours > 12) { hours -= 12; ampm = 'PM' }
  return '' + hours + (minutes < 10 ? '0' + minutes : minutes) + ampm;
}


export function useAssociatePunchLogRow(row: TimecardRow) {
  const current = {
    in: row.in ? getTimeInputString(String(row.in.timestamp)) : '',
    out: row.out ? getTimeInputString(String(row.out.timestamp)) : ''
  };
  const [tIn, setTIn] = useState(current.in);
  const [tOut, setTOut] = useState(current.out);

  const [edit, setEdit] = useState(false);
  const fRef = useRef<HTMLInputElement>(null);
  const sRef = useRef<HTMLInputElement>(null);

  function onSubmit() {
    sRef.current?.setSelectionRange(null, null);
    setTIn(current.in);
    setTOut(current.out);
    setEdit(false);
  }

  return { tIn, tOut, edit, fRef, sRef, onSubmit, current, setEdit, setTIn, setTOut };
}
