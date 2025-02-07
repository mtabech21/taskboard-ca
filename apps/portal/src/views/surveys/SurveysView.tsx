import { Button } from "@shad/button"
import { Checkbox } from "@shad/checkbox"

import { Dialog, DialogContent, DialogTrigger } from "@shad/dialog"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shad/hover-card"


import { useMutation, useQuery } from "@tanstack/react-query"
import { CheckIcon, Edit, FilterIcon, X } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@taskboard/client/ui/src/utils"
import { useAPI } from "@taskboard/client/hooks/global/use-api"
import { useManagerAccount } from "@taskboard/client/hooks/accounts/use-manager"


type Field = {
  id: string,
  type: string,
  ref: string
}

export type StringAnswer = {
  field: Field
  type: "text"
  text: string
}

export type NumberAnswer = {
  field: Field
  type: "number"
  number: number
}

export type BooleanAnswer = {
  field: Field
  type: "boolean"
  boolean: boolean
}

export type Answer = StringAnswer | NumberAnswer | BooleanAnswer

export type Response = {
  answers: Answer[]
}

export type StoreActualData = {
  store: string,
  total: number
}
export type StoreBudgetData = {
  store_number: string,
  hours: number,
  opening: number,
  closing: number
}
export type StoreDailyTotalData = {
  store: string,
  total_hours: number,
}
export type StoreDailyData = {
  store: string,
  date: string,
  hours: number,
}


export function SurveysView() {
  const api = useAPI.context()
  const { company, branches, is_admin } = useManagerAccount.context()
  const budgetQuery = useQuery({
    initialData: [],
    queryKey: ['hours_budget'],
    queryFn: async () => (await api.get('/surveys/hours_budget').then(r => r.data as StoreBudgetData[])).sort((a, b) => { return Number(a.store_number) - Number(b.store_number) })
  })
  const budgetMutator = useMutation({
    mutationKey: ['hours_budget'],
    mutationFn: async (data: StoreBudgetData) => await api.post(`/surveys/hours_budget?store=${data.store_number}&hours=${data.hours}&opening=${data.opening}&closing=${data.closing}`).then(() => window.location.reload())
  })

  const hoursQuery = useQuery({
    initialData: [],
    queryKey: ['hours_daily'],
    queryFn: async () => (await api.get('/surveys/hours?store=totals').then(r => r.data as StoreDailyTotalData[]))
  })

  const [showFilter, setShowFilter] = useState(false)

  const stores = budgetQuery.data.map(d => d.store_number)

  // useEffect(() => {
  //   set_filtered_stores(stores)
  // }, [stores])

  const [filtered_stores, set_filtered_stores] = useState(stores)
  useEffect(() => {
    set_filtered_stores(budgetQuery.data.map(d => d.store_number))
  }, [budgetQuery.data])

  return (
    <div className="p-3 flex flex-col h-full">
      <div className="flex justify-center gap-2 font-mono font-bold">
        <div>Surveys</div>
        {company && <FilterIcon className="text-blue-500 hover:cursor-pointer" onClick={() => setShowFilter(p => !p)} />}
      </div>
      {showFilter ? <Filter stores={stores} filtered={filtered_stores} set_filter={set_filtered_stores} /> :
        <div className="w-full flex flex-col rounded p-2 gap-3 font-mono overflow-scroll">
          {budgetQuery.isSuccess && hoursQuery.isSuccess && (is_admin ?
            filtered_stores.map(s => (
              <StoreBar key={s} hours={hoursQuery.data.find(p => p.store === s) ?? { store: s, total_hours: 0 }} s={budgetQuery.data.find(p => p.store_number === s) ?? { closing: 0, hours: 0, opening: 0, store_number: s }} save={(b) => budgetMutator.mutate(b)} />
            ))
            :
            branches.map(s => (
              <StoreBar key={s.number} hours={hoursQuery.data.find(p => p.store === s.number) ?? { store: s.number, total_hours: 0 }} s={budgetQuery.data.find(p => p.store_number === s.number) ?? { store_number: s.number, opening: 550, closing: 300, hours: 4000 }} save={(b) => budgetMutator.mutate(b)} />
            )))
          }
        </div>
      }
    </div >
  )
}

function Filter(props: { stores: string[], filtered: string[], set_filter: React.Dispatch<React.SetStateAction<string[]>> }) {
  return (
    <div className="grid">
      {
        props.stores.map(s => (
          <FilterRow key={s} store={s} setFilter={props.set_filter} filtered={props.filtered} />
        ))
      }
      <Button onClick={() => props.set_filter([])}>Deselect All</Button>
    </div>
  )
}
function FilterRow(props: { store: string, filtered: string[], setFilter: React.Dispatch<React.SetStateAction<string[]>> }) {
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    props.setFilter((p) => {
      const l = p
      if (!checked) {
        const i = l.indexOf(props.store)
        l.splice(i, 1)
        return l
      } else {
        l.push(props.store)
        return l
      }
    })
  }, [checked, props])

  useEffect(() => {
    setChecked(props.filtered.includes(props.store))
  }, [props])

  return (
    <div className="flex gap-3 items-center">
      <Checkbox checked={checked} onClick={() => {
        setChecked(p => !p)
      }} />
      <div>{props.store}</div>
    </div>
  )
}

const BlinkingRedDot = () => {
  return (
    <div className="flex items-center text-xs">
      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      <span className="ml-2 text-[10px] text-gray-400">LIVE</span>
    </div>
  );
};

export function StoreBar(props: { s: StoreBudgetData, hours: StoreDailyTotalData, save: (data: StoreBudgetData) => void, tracker?: boolean }) {
  const api = useAPI.context()
  const { s, tracker = false, hours } = props
  const [budget, setBudget] = useState<number>(s.hours)
  const { is_admin } = useManagerAccount.context()
  const total = Number(hours.total_hours)
  const dates = getLastTenDays()

  const dailyQuery = useQuery({
    initialData: [],
    queryKey: ['hours_daily_store', s.store_number],
    queryFn: async () => await api.get(`/surveys/hours?store=${s.store_number}`).then(r => (r.data as StoreDailyData[]).sort((a, b) => { return new Date(a.date).valueOf() - new Date(b.date).valueOf() }))
  })
  const live_query = useQuery({
    queryKey: [s],
    queryFn: async () => (await api.get(`/spirit/live_sales?store=${s.store_number}`)).data
  })

  const latest = dates.find(p => dailyQuery.data.map(d => d.date.split('T')[0]).includes(p))


  return (
    <div key={s.store_number} className="flex w-full rounded items-center p-2 bg-gray-200 gap-3">
      {!tracker && <div className="bg-orange-400  font-bold h-full p-3 rounded justify-center flex items-center hover:opacity-85 cursor-pointer " onClick={() => window.open(`${window.location.origin}/tracker/${Number(s.store_number) * Number(s.store_number)}`, '_blank')}>{s.store_number}</div>}
      <div className="flex flex-col w-full gap-1">
        <div className="flex w-full bg-yellow-300 rounded  justify-between overflow-hidden">
          <div title={`${s.opening}`} className="p-1 bg-green-300" style={{ width: `${(s.opening / s.hours) * 100}%` }}></div>
          <div title={`${s.closing}`} className="p-1 bg-red-300" style={{ width: `${(s.closing / s.hours) * 100}%` }}></div>
        </div>
        <div className="flex w-full bg-gray-100 rounded  justify-between">

          <div className={cn("flex bg-blue-600 rounded items-center justify-end px-3 py-2 text-white font-bold min-w-fit hover:cursor-default", { 'bg-orange-700': total > s.hours })} style={{ width: `${(total) * 100 / s.hours}%` }} >
            <HoverCard >
              <HoverCardTrigger>{Math.round(total)}</HoverCardTrigger>
              {!tracker && <HoverCardContent>
                <DailyList data={dailyQuery.data} />
              </HoverCardContent>
              }
            </HoverCard>

          </div>
          <div className="w-fit px-3 py-2">{s.hours}</div>
        </div>
        {!tracker && <div className="text-xs text-gray-500">Latest submission: {latest ?? 'N/A'}</div>}
      </div>
      {live_query.data ? <div className="font-mono text-sm bg-gray-900 h-full rounded p-1 text-white w-32 align-middle justify-center items-center flex flex-col">
        <BlinkingRedDot />
        <div className="flex gap-1">
          <div >{live_query.data.sales}</div>
        </div>
        <div className="text-xs text-yellow-400 font-semibold">{live_query.data.plan}</div>
      </div> : <div className="w-32 text-xs text-gray-500">NO DATA</div>
      }
      {is_admin &&
        <Dialog>
          <DialogTrigger><div className="p-3 text-gray-600 hover:text-gray-400"><Edit /></div></DialogTrigger>
          <DialogContent>
            <div className="flex flex-col gap-3">
              <div className="text-lg">{s.store_number}</div>
              <div className="font-bold">Hours</div>
              <input type="number" value={budget} onChange={(e) => {
                // eslint-disable-next-line no-constant-binary-expression
                setBudget(Number(e.currentTarget.value) ?? 0)
              }} />
              <button onClick={() => {
                const n = s
                n.hours = budget
                props.save(n)
              }}>Save</button>
            </div>
          </DialogContent>
        </Dialog>
      }
    </div>
  )
}

function getLastTenDays(): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]); // Format the date to 'YYYY-MM-DD'
  }

  return dates;
}

function DailyList(props: { data: StoreDailyData[] }) {
  const dates = getLastTenDays()
  return (
    <div>
      <div className="text-lg">Submissions</div>
      <div className="text-xs text-gray-400">Last 10 days</div>
      <div className="p-1 flex flex-col gap-2">
        <div className="min-w-fit flex *:flex-1 justify-between">
          <div>Date</div>
          <div>Hours</div>
          <div className="text-green-600" />
        </div>
        {dates.map((d) => (
          <div key={d} className="bg-gray-200 rounded min-w-fit flex *:flex-1 justify-between">
            <div className="font-medium">{d.split('2024-')[1]}</div>
            <div>{props.data.find(p => p.date.split('T')[0] === d)?.hours}</div>
            {props.data.find(p => p.date.split('T')[0] === d) ? <CheckIcon className="text-green-600" /> : <X className="text-red-600" />}
          </div>
        ))}
      </div>
    </div>
  )
}