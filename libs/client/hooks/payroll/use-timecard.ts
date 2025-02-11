import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import Contextor from "../contextor";
import { useAPI } from "../global/use-api";
import { AssociateBadge, TimecardData, TimecardRow } from "@taskboard/types";


export const useTimecard = new Contextor((config: { associate: AssociateBadge, date_range: DateRange }) => {
  const api = useAPI.context()
  const { associate, date_range } = config

  const full_name = `${associate.first_name} ${associate.last_name}`

  useEffect(() => { document.title = `${full_name} | Timecards` })
  const [latest_update, set_latest_update] = useState<Date>()
  const formatted_date_range = { from: date_range.from?.toISOString().split('T')[0], to: date_range.to?.toISOString().split('T')[0] }

  const {data, refetch} = useQuery<TimecardData>({
    queryKey: ['timecard_data', associate.associate_id, date_range],
    queryFn: async () => {
      const timecard = await api.get<TimecardData>(`/payroll/timecards/${associate.associate_id}`, { params: formatted_date_range })
      set_latest_update(new Date())
      return timecard.data
    }
  })
  
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: ['post_punches', associate, date_range],
    mutationFn: async (push: TimecardRow[]) => await api.put(`/payroll/timecards/${associate.associate_id}`,{ ...data, rows: push } as TimecardData)
  })

  const locked = false

  return { associate, latest_update, update, isUpdating, locked, data,refetch }
})