import { Eye, EyeOff } from "lucide-react"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList } from "@shad/tabs"

import { useHub } from "@taskboard/client/hooks/accounts/use-hub"
import { cn } from "@taskboard/client/ui/src/utils"



function DashboardView() {
  const { puncher: { getTotals } } = useHub.context()



  const [selected, set_selected] = useState('')
  const [totalHours, setTotalHours] = useState<string>('-h --m')
  const [hide_data, set_hide_data] = useState(false)

  const updateTotalHours = useCallback(() => {
    const totals = getTotals()
    const timeSpan = totals.reduce<number>((p, c) => p + c.total, 0)
    const hours = String((timeSpan / 1000 / 60 / 60)).split('.')[0]
    const minutes = String(((timeSpan / 1000 / 60) % 60)).split('.')[0]
    const h = hours;
    const m = minutes.length < 2 ? `0${minutes}` : minutes
    setTotalHours(`${h}h ${m}m`)
  }, [getTotals])

  useEffect(() => {
    updateTotalHours()
    setInterval(updateTotalHours, 60 * 1000)
  }, [updateTotalHours, getTotals])

  return (
    <Tabs value={selected} onValueChange={(v) => set_selected(v)} >
      <TabsList className='flex justify-evenly w-full gap-1 font-mono p-1 h-fit bg-white'>
        <div className="p-2 hover:text-black hover:cursor-pointer" onClick={() => set_hide_data(p => !p)}>{!hide_data ? <EyeOff size={20} /> : <Eye size={20} />}</div>
        <TabItem value="sales" on_selection={(v) => set_selected(v)} selected={selected} color="green">
          <div>{hide_data ? '$-,---.--' : `${'$-,---.--'}`}</div>
          <div className="text-orange-500 text-sm">{hide_data ? '$-,---.--' : `${'$-,---.--'}`}</div>
        </TabItem>
        <TabItem value="hours" on_selection={(v) => set_selected(v)} selected={selected} color="blue">
          <div>{hide_data ? '-h --m' : `${totalHours}`}</div>
          <div className="text-orange-500 text-sm">{hide_data ? '-h --m' : '0h 00m'}</div>
        </TabItem>
        {/* <TabItem value="kpis" title="KPIs" on_selection={(v) => set_selected(v)} selected={selected} color="orange">{hide_data ? 'Rank -' : 'Rank 4'}</TabItem> */}
      </TabsList>
      <TabsContent value="sales" className="mt-0 p-1 h-96">Sales Dashboard</TabsContent>
      <TabsContent value="hours" className="mt-0 p-1 h-96">Hours Dashboard</TabsContent>
      <TabsContent value="kpis" className="mt-0 p-1 h-96">KPIs</TabsContent>
    </Tabs>
  )
}

function TabItem(props: { title?: string, value: string, selected: string, on_selection: (value: string) => void, color?: "green" | "blue" | "orange", children?: ReactNode }) {
  const is_selected = props.value === props.selected
  function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  return (
    <div onClick={() => props.on_selection(is_selected ? '' : props.value)} className={cn("select-none flex flex-col flex-1 items-center justify-between p-1 font-bold hover:cursor-pointer border rounded hover:bg-gray-50", { 'bg-gray-50': is_selected })}>
      <div className={cn("text-xs", { 'text-green-700': props.color === 'green', 'text-blue-700': props.color === 'blue', 'text-orange-700': props.color === 'orange' })}>{props.title ?? capitalizeFirstLetter(props.value)}</div>
      <div className={cn("text-xl h-max", { 'text-black': props.selected === '' || is_selected })}>
        {props.children}
      </div>
    </div>
  )
}

export default DashboardView