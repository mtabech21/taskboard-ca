import { NavigationMenuItem, navigationMenuTriggerStyle } from "@shad/navigation-menu"
import { cn } from "@taskboard/client/ui/src/utils"
import { ReactNode } from "react"
import { Link } from "react-router-dom"

const NavItem = (props: { title: string, href: string, children?: ReactNode }) => {
  return (
    <NavigationMenuItem >
      <Link to={props.href} className={cn(navigationMenuTriggerStyle(), 'text-left text-sm  hover:bg-muted')}>
        <div>
          <div>{props.title}</div>
          <div className="text-gray-600 font-normal">{props.children}</div>
        </div>
      </Link>
    </NavigationMenuItem >
  )
}

export default NavItem
