import { ScrollArea, ScrollBar } from "@shad/scroll-area";
import { Separator } from "@shad/separator";

import { StoreGroup } from "./components/StoreGroup";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAssociates } from "@taskboard/client/hooks/associates/use-associates";
import { BranchGroup } from "@taskboard/types";



export function AssociatesSidebar(props: { withAddButton?: boolean }) {
  const nav = useNavigate()
  const associates = useAssociates.context()
  return (
    <div className="min-w-60 bg-gray-50 whitespace-nowrap flex flex-col">
      <div className="px-1 bg-black text-white text-sm">Associates</div>
      <Separator />
      <div className="flex-1">
        <ScrollArea>
          {(associates.groups as BranchGroup[]).map((group) => (
            group.associates.length > 0 && <StoreGroup group={group} key={group.branch.id} />
          ))}
          <ScrollBar />
        </ScrollArea>
      </div>
      {props.withAddButton &&
        <div onClick={() => nav('/associates/new', { replace: true })} className="p-2 m-2 rounded text-gray-400 hover:bg-gray-100 cursor-pointer flex justify-evenly items-center font-mono text-sm">
          <div>Add Associate</div>
          <Plus />
        </div>}
    </div>
  );
}


