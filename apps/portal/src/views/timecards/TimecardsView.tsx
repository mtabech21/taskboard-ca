import { FileDown } from "lucide-react"
import { Separator } from "@shad/separator"
import { AssociateFilters } from "../components/Filters"
import { cn } from "@taskboard/client/ui/src/utils"
import { useManagerAccount } from "@taskboard/client/hooks/accounts/use-manager"
import AssociateTimecardView from "./AssociateTimecard"
import { AssociatesSidebar } from "../associates/AssociatesSidebar"
import { DateRangePicker } from "./timecard/components/inputs/DateRangePicker"
import { useTimecards } from "@taskboard/client/hooks/payroll/use-timecards"
import { useAssociates } from "@taskboard/client/hooks/associates/use-associates"

function TimecardsView() {
  const account = useManagerAccount.context()
  const timecards = useTimecards.init({ account })
  const { associates } = timecards

  return (
    <useTimecards.Provider value={timecards}>
      <useAssociates.Provider value={timecards.associates}>
        <div className="flex flex-col h-full">
          <div className="p-3 flex justify-between items-center gap-3 *:flex-1 ">
            <AssociateFilters />
            <div className="text-lg font-bold whitespace-nowrap">Timecards</div>
            <div className="flex justify-end items-center gap-3">
              <DateRangePicker />
              <FileDown size={20} className={cn("text-primary hover:opacity-80 cursor-pointer", { 'text-muted cursor-default': !associates.filter || !timecards.date_range.from || !timecards.date_range.to })} onClick={() => timecards.download_report()} />
            </div>
          </div>
          <Separator />
          <div className="flex overflow-hidden flex-grow">
            <AssociatesSidebar />
            <Separator orientation="vertical" />
            {associates.selected && <AssociateTimecardView associate={associates.selected} date_range={timecards.date_range} />}
          </div>
        </div>
      </useAssociates.Provider>
    </useTimecards.Provider >
  )
}

export default TimecardsView