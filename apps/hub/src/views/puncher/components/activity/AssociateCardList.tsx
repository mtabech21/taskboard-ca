import { AssociatePunches } from "@taskboard/types";
import style from "../../../../styles/tb.module.scss"

import AssociateCard from "./AssociateCard";


function AssociateCardList(props: { data: AssociatePunches[] }) {
  props.data.sort((a, b) => { return (a.punches[a.punches.length - 1].timestamp < b.punches[b.punches.length - 1].timestamp) ? 1 : 0 })
  props.data.sort((a) => { return a.punches[a.punches.length - 1].type !== 'out' ? 0 : 1 })
  return (
    <div className="flex-1 w-full">
      <div className={style.userLogHeader}>
        <div className="select-none">STATUS</div>
      </div>
      <div className={style.activeLogDiv}>
        {props.data && props.data.map((v, i) => (
          <AssociateCard key={i} data={v} />
        ))}
      </div>
    </div>
  )
}

export default AssociateCardList;
