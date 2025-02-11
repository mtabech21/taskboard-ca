

import { Separator } from "@shad/separator";
import { Link } from "react-router-dom";
import { cn } from "@taskboard/client/ui/src/utils";
import { useAssociates } from "@taskboard/client/hooks/associates/use-associates";
import { AssociateBadge } from "@taskboard/types";


export function AssociateSelectorItem(props: { associate: AssociateBadge; }) {
  const { selected: current_selection, status_list } = useAssociates.context()
  const status = status_list.find(p => p?.associate_id == props.associate.associate_id)

  const selected = props.associate === current_selection;
  return (
    <Link to={
      {
        pathname: '',
        search: 'badge_number=' + props.associate.badge_number,
      }
    }>
      <div className="flex" >
        <div className={cn(`w-full bg-white flex-col items-start text-left text-sm px-3 py-2 select-none hover:bg-slate-100 cursor-pointer`, { 'bg-slate-100': selected })}>
          <div>{props.associate.last_name}, {props.associate.first_name}</div>
          <div className="text-xs text-gray-600"><span className={cn("bg-gray-600 text-white px-1 rounded text-xs", { 'bg-green-600': status?.type == 'in', 'bg-gray-600': status?.type == 'out', 'bg-yellow-500': status?.type == 'meal' })}>{props.associate.badge_number}</span> {props.associate.position_name}</div>
        </div>
      </div>
      <Separator />
    </Link>
  );
}





