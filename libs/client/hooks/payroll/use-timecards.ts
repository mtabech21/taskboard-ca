import { useCallback, useEffect, useState } from "react"
import { DateRange } from "react-day-picker"
import { ManagerAccount } from "@taskboard/types"
import { useQuery } from "@tanstack/react-query"
import { useAssociates } from "../associates/use-associates"
import { useAPI } from "../global/use-api"
import Contextor from "../contextor"
import { getDateRange } from "@taskboard/tools/functions/get-date-range"



export const useTimecards = new Contextor((config: { account: ManagerAccount }) => {
  const api = useAPI.context()
  const { account } = config
  const associates = useAssociates.init({ account })

  const [date_range, set_date_range] = useState<DateRange>(getDateRange('current_pay_period'))

  const load_date_range = useCallback((selectedRange: DateRange) => { set_date_range(selectedRange) }, [])
  useEffect(() => { document.title = 'Timecards'; load_date_range(getDateRange('current_pay_period')) }, [load_date_range]);

  const { refetch: download_report } = useQuery<void>({
    queryKey: ['timecard_report'],
    queryFn: () => {
      const b = account.branches.find(a => a.number.toLowerCase() === associates.filter.branches[0].number.toLowerCase())
      if (date_range.from && date_range.to && b) {
        api.get(`/payroll/report/branch/${b.id}?from=${date_range.from.toISOString().split('T')[0]}&to=${date_range.to.toISOString().split('T')[0]}&type=csv`,
          { responseType: 'blob' })
          .then((r) => {
            const href = URL.createObjectURL(r.data);
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', `report_${b.number}_${date_range.from?.toISOString().split('T')[0]}_${date_range.to?.toISOString().split('T')[0]}.csv`); //or any other extension
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
      }
    },
    enabled: false
  })

  return { associates, date_range, set_date_range, load_date_range, download_report }
})

