import { useParams } from "react-router-dom"
import { Response, StoreBar, StoreBudgetData, StoreDailyData, StoreDailyTotalData } from "./SurveysView"
import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"

import { Button } from "@shad/button"
import { useAPI } from "@taskboard/client/hooks/global/use-api"


export function TrackerView() {
  const { store_hash } = useParams()
  // eslint-disable-next-line no-constant-binary-expression
  const store_number = String(Math.sqrt(Number(store_hash) ?? 0))

  const api = useAPI.context()


  const budgetQuery = useQuery({
    initialData: [],
    queryKey: ['hours_budget'],
    queryFn: async () => (await api.get('/surveys/hours_budget').then(r => r.data as StoreBudgetData[])).sort((a, b) => { return Number(a.store_number) - Number(b.store_number) })
  })

  const hoursQuery = useQuery({
    initialData: [],
    queryKey: ['hours_daily'],
    queryFn: async () => (await api.get('/surveys/hours?store=totals').then(r => r.data as StoreDailyTotalData[]))
  })

  const hoursMutator = useMutation({
    mutationKey: ['hours_daily'],
    mutationFn: async () => (
      await api.post(`/surveys/hours?store=${store_number}&date=${date}&hours=${hours}`).then(() => window.location.reload())
    )
  })
  const responsesQuery = useQuery({
    initialData: [],
    queryKey: ['responses_daily'],
    queryFn: async () => (await api.get('/surveys/responses').then(r => {
      return r.data as Response[]
    }))
  })
  const dailyQuery = useQuery({
    initialData: [],
    queryKey: ['hours_daily_store', store_number],
    queryFn: async () => await api.get(`/surveys/hours?store=${store_number}`).then(r => { return (r.data as StoreDailyData[]).sort((a, b) => { return new Date(a.date).valueOf() - new Date(b.date).valueOf() }) })
  })

  const default_d = new Date()
  default_d.setHours(default_d.getHours() - 10)
  const [date, setDate] = useState<string>(default_d.toISOString().split('T')[0])
  const [hours, setHours] = useState<number>()

  useEffect(() => {
    setHours(Number(dailyQuery.data.find(p => p.date.split('T')[0] === date)?.hours ?? 0));
  }, [dailyQuery.data, date])

  const store_data = {
    daily: hoursQuery.data.find(p => p.store === store_number),
    budgets: budgetQuery.data.find(p => p.store_number === store_number)
  }



  return (
    <div className="flex justify-center h-full items-center p-5 bg-gray-900">
      <div className="flex flex-col w-full max-w-[800px] gap-5 items-center">
        <div className="text-white font-bold text-4xl">{store_number}</div>
        {budgetQuery.isSuccess && hoursQuery.isSuccess && responsesQuery.isSuccess && store_data.budgets && store_data.daily ? <StoreBar tracker={true} hours={store_data.daily} s={store_data.budgets} save={() => { return }} /> : 'Waiting for data...'}
        <div className="bg-gray-200 gap-3 w-fit p-5 flex flex-col rounded">
          <div className="font-bold">Daily Submission</div>
          <div>
            <input className="p-1 rounded" type="date" max={new Date().toISOString().split('T')[0]} value={date} onChange={(c) => { setDate(c.currentTarget.value) }} />
          </div>
          <div>
            <input className="p-3 rounded text-center text-lg" type="number" onChange={c => { setHours(Number(c.currentTarget.value.replace(',', '.'))) }} />
          </div>
          <div className="text-sm">{`${hours ?? 0} hours worked on ${new Date(date).toUTCString().split(' 0')[0]}`}</div>
          <Button onClick={() => { hoursMutator.mutate() }} disabled={!hours || Number(dailyQuery.data.find(p => p.date.split('T')[0] === date)?.hours) === hours}>Submit</Button>
        </div>
      </div>
    </div>
  )
}