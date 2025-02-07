import { NavigationMenu, NavigationMenuList } from "@shad/navigation-menu";
import { PanelsTopLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useManagerAccount } from "@taskboard/client/hooks/accounts/use-manager";
import { cn } from "@taskboard/client/ui/src/utils";
import { TaskboardLogo } from "@taskboard/client/ui";
import NavItem from "./NavItem";
import MyAccount from "./MyAccount";
import CompanyMenuItem from "./CompanyMenu";
import { AssocociateMenuItem } from "./AssociateMenu";

export function TopMenu() {
  const { is_manager } = useManagerAccount.context()
  return (
    <div className="flex justify-between">
      <div className="flex">
        <Link to={import.meta.env.VITE_LANDING_URL} className="flex h-full w-36 mr-6" children={<TaskboardLogo className="h-full" />} />
        <NavigationMenu hidden>
          <NavigationMenuList>
            <CompanyMenuItem />
            <AssocociateMenuItem />
            {is_manager && <NavItem title="Tasks" href="/tasks" />}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex items-center gap-5">
        <MyAccount />
        <Link to={import.meta.env.VITE_HUB_URL} className={cn('text-primary hover:opacity-80')} title="Go to hub">
          <PanelsTopLeft />
        </Link>
      </div>
    </div>
  );
}
