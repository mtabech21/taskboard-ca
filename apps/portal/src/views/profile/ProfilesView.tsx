import { Separator } from "@shad/separator"
import { RefreshCcw } from "lucide-react"
import { AssociatesSidebar } from "../associates/AssociatesSidebar"
import { AssociateProfileView } from "./AssociateProfileView"
import { useEffect } from "react"
import { AssociateFilters } from "../components/Filters"
import { useManagerAccount } from "@taskboard/client/hooks/accounts/use-manager"
import { useAssociates } from "@taskboard/client/hooks/associates/use-associates"


function ProfilesView() {

  const account = useManagerAccount.context()
  const associates = useAssociates.init({ account: account })

  useEffect(() => {
    if (associates.selected) {
      const associate = associates.selected
      document.title = `${associate.first_name} ${associate.last_name} | Profile`
    } else {
      document.title = 'Profiles'
    }
  }, [associates.selected])

  return (
    <useAssociates.Provider value={associates}>
      <div className="h-full flex flex-col">
        <div className="p-3 flex justify-between items-center *:flex-1">
          <AssociateFilters />
          <div className="text-lg font-bold whitespace-nowrap">Manage Profiles</div>
          <div className="flex justify-end">
            <RefreshCcw size={24} className="p-1 rounded border hover:bg-slate-200 cursor-pointer" />
          </div>
        </div>
        <Separator />
        <div className="flex overflow-hidden flex-grow">
          <AssociatesSidebar withAddButton />
          <Separator orientation="vertical" />
          {associates.selected ? < AssociateProfileView associate={associates.selected} /> : <div className="flex-1 m-auto select-none text-gray-500 font-mono">Select Associate</div>}
        </div>
      </div>
    </useAssociates.Provider>
  )
}


export default ProfilesView