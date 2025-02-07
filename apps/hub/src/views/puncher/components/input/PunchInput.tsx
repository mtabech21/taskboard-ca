import BadgeInput from "./BadgeInput";
import SelectionDiv from "./PunchTypeInput";
import style from "../../../../styles/tb.module.scss";
import { NewAssociateButton } from "./NewAssociateButton";
import { usePuncher } from "@taskboard/client/hooks/puncher/use-puncher";



export function PunchInput() {
  const puncher = usePuncher.context()
  return (
    <div className={style.userForm}>
      {puncher.punchingFor ?
        <SelectionDiv />
        :
        <div className="flex flex-col justify-center items-center py-2">
          <BadgeInput />
          <NewAssociateButton />
        </div>}
    </div>
  );
}
