import { cn } from "@taskboard/client/ui/src/utils";
import { UserRoundPlus } from "lucide-react";



export function NewAssociateButton() {



  return (
    <div style={{ color: "rgb(20,105,185)" }} className={cn("bg-white py-1 px-3 w-fit rounded items-center hover:bg-slate-100 cursor-pointer flex gap-3")} onClick={() => window.open(import.meta.env.VITE_PORTAL_URL + `/associates/new?`)}>
      <div>New Associate</div> <UserRoundPlus size={16} />
    </div>
  )

}
