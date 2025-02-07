import { useEffect, useState } from "react";
import { TimecardPunch } from "@taskboard/types";
import { generateTimecardRows } from "@taskboard/tools/functions/generate-timecard-rows";




function getHoursSum(punches: TimecardPunch[]) {
  let ms = 0
  let lastIn = new Date(punches[0].timestamp).valueOf()
  const data = [...punches]
  data[data.length - 1].type === 'in' && data.push({ timestamp: new Date(), type: 'out' } as TimecardPunch)
  data.forEach((d) => {
    switch (d.type) {
      case "in": lastIn = new Date(d.timestamp).valueOf(); break;
      case "out": ms += new Date(d.timestamp).valueOf() - lastIn; break;
      case "meal": ms += new Date(d.timestamp).valueOf() - lastIn; break;
    }
  })
  const time = new Date(ms)
  time.setMinutes(time.getMinutes() + time.getTimezoneOffset())
  const hours = time.getHours()
  const minutes = time.getMinutes()

  const hh = hours
  const mm = minutes < 10 ? '0' + minutes : minutes
  return `${hh}:${mm}`
}

export function useAssociatePunchLog(data: TimecardPunch[]) {

  const [rows, setRows] = useState(generateTimecardRows(data));
  const [hours, setHours] = useState<string>('0:00')

  useEffect(() => {
    setRows(generateTimecardRows(data));
    setHours(getHoursSum(data));
  }, [data]);

  useEffect(() => {
    setTimeout(() => { setHours(getHoursSum(data)) }, 5000);
  })

  return { rows, hours };
}
