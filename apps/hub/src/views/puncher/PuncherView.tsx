import Clock from "./components/clock/Clock";
import { PunchInput } from "./components/input/PunchInput";
import { BranchSelection } from "./components/branch/BranchSelection";
import { BottomBar } from "./components/activity/BottomBar";
import AssociateCardList from "./components/activity/AssociateCardList";
import { useHub } from "@taskboard/client/hooks/accounts/use-hub";
import { usePuncher } from "@taskboard/client/hooks/puncher/use-puncher";

function PuncherView() {
  const { puncher } = useHub.context()

  return (
    <usePuncher.Provider value={puncher}>
      <div className="bg-gray-50  h-full max-h-full min-w-fit flex items-center flex-col m-0 text-center box-border overflow-hidden relative">
        <BranchSelection />
        <Clock />
        <PunchInput />
        <AssociateCardList data={puncher.punches} />
        <BottomBar />
      </div >
    </usePuncher.Provider>
  );
}



export default PuncherView;
