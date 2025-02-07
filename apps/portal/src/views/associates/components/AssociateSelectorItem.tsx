

import { Separator } from "@shad/separator";
import { AssociateItem } from "@taskboard/types";
import { Link } from "react-router-dom";
import { cn } from "@taskboard/client/ui/src/utils";
import { useAssociates } from "@taskboard/client/hooks/associates/use-associates";


export function AssociateSelectorItem(props: { associate: AssociateItem; }) {
  const { selected: current_selection } = useAssociates.context()
  // const wl = props.associate.warning_level ? props.associate.warning_level.length : 0;
  const selected = props.associate === current_selection;
  return (
    <Link to={
      {
        pathname: '',
        search: 'badge_number=' + props.associate.badge_number,
      }
    }>
      <div className="flex" >
        {/* <div className={cn(`bg-green-600 w-1 `, {
          'bg-yellow-600': wl === 1,
          'bg-orange-600': wl === 2,
          'bg-red-600': wl === 3,
        })} /> */}
        <div className={cn(`w-full bg-white flex-col items-start text-left text-sm px-3 py-2 select-none hover:bg-slate-100 cursor-pointer`, { 'bg-slate-100': selected })}>
          <div>{props.associate.last_name}, {props.associate.first_name}</div>
          <div className="text-xs text-gray-600"><span className="bg-gray-400 text-white px-1 rounded text-xs">{props.associate.badge_number}</span> {props.associate.position_name}</div>
        </div>
      </div>
      <Separator />
    </Link>
  );
}





