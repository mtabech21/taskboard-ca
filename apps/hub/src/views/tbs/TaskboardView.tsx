import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@shad/resizable";
import PuncherView from "../puncher/PuncherView";
import TopMenu from "./components/TopMenu";
import DashboardView from "./components/Dashboard";
import Taskboard from "./components/tasksview/Taskboard";
import BottomMenu from "./components/Bottommenu";
import { Toaster } from "@shad/toaster";
import { ManagerAccount } from "@taskboard/types";
import { useHub } from "@taskboard/client/hooks/accounts/use-hub";
import { useAssociates } from "@taskboard/client/hooks/associates/use-associates";

export function TaskboardView(props: { account: ManagerAccount }) {
  const hub = useHub.init({ account: props.account })

  return (
    <useHub.Provider value={hub}>
      <useAssociates.Provider value={hub.associates}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel minSize={30} collapsible={true} maxSize={50} defaultSize={30} >
            <PuncherView />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel className='flex flex-col'>
            <TopMenu />
            <DashboardView />
            <Taskboard />
            <BottomMenu />
          </ResizablePanel>
        </ResizablePanelGroup>
        <Toaster />
      </useAssociates.Provider>
    </useHub.Provider>
  );
}


