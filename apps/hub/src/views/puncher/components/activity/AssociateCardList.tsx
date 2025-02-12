import { useAssociates } from "@taskboard/client/hooks/associates/use-associates";
import style from "../../../../styles/tb.module.scss"
import AssociateCard from "./AssociateCard";
import { usePuncher } from "@taskboard/client/hooks/puncher/use-puncher";
import { AssociateBadge, Punch } from "@taskboard/types";

type CardData = { badge: AssociateBadge, status: Punch }

function AssociateCardList() {
  const { punches, status_list } = usePuncher.context()
  const { list } = useAssociates.context()

  punches.sort((a, b) => { return (a.punches[a.punches.length - 1].timestamp < b.punches[b.punches.length - 1].timestamp) ? 1 : 0 })
  punches.sort((a) => { return a.punches[a.punches.length - 1].type !== 'out' ? 0 : 1 })

  const cards = list.map((badge) => ({ badge, status: status_list.find(p => p?.associate_id == badge.associate_id) }))

  return (
    <div className="flex-1 w-full">
      <div className={style.userLogHeader}>
        <div className="select-none">STATUS</div>
      </div>
      <div className={style.activeLogDiv}>
        {cards.map((v) => (
          <AssociateCard key={v.badge.associate_id} data={v} />
        ))}
      </div>
    </div>
  )
}

export default AssociateCardList;
