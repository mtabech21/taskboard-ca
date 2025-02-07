import { useEffect, useState } from "react";

import { AssociatePunches, TimecardPunch } from "@taskboard/types";

export function useAssociateCard(data: AssociatePunches) {
  const latest = getLatestStatus()
  const [reveal, setReveal] = useState(false);
  const [span, setSpan] = useState<string>();
  useEffect(() => {
    const latest = new Date(data.punches[data.punches.length - 1]?.timestamp);
    const now = new Date();
    now.setHours(now.getHours() + 5);
    now.setSeconds(now.getSeconds() + 1);
    const newNow = now;
    const timeSpan = new Date(now.valueOf() - (latest.valueOf() + newNow.getTimezoneOffset()));
    const hours = timeSpan.getHours();
    const minutes = timeSpan.getMinutes();
    const seconds = timeSpan.getSeconds();

    const h = hours > 0 ? hours + ':' : '';
    const m = hours > 0 ? minutes < 10 ? '0' + minutes : minutes : minutes;
    const s = seconds < 10 ? '0' + seconds : seconds;
    setSpan(`${h}${m}:${s}`);
  }, [data.punches]);




  function getLatestStatus(): TimecardPunch {
    if (data.punches != null) {
      return data.punches[data.punches.length - 1];
    } else {
      return {} as TimecardPunch;
    }
  }

  return { reveal, setReveal, span, latest };
}
