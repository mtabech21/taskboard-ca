import { NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from "@shad/navigation-menu"
import { useManagerAccount } from "@taskboard/client/hooks/accounts/use-manager"
import { BriefcaseBusiness } from "lucide-react"
import NavItem from "./NavItem"

function CompanyMenuItem() {
  const { company, is_admin, is_manager } = useManagerAccount.context()
  return (
    <NavigationMenuItem >
      <NavigationMenuTrigger>Company</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
          <li className="row-span-3">
            <NavigationMenuLink asChild>
              <a
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                href="/company"
              >
                <BriefcaseBusiness className="h-6 w-6" />
                <div className="mb-2 mt-4 text-lg font-medium">
                  {company.name}
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                  View company details
                </p>
              </a>
            </NavigationMenuLink>
          </li>
          {is_manager &&
            <>
              <NavItem href="/branches" title="Branches" />
              <NavItem title="Surveys" href="/surveys" />
            </>}
          {is_admin &&
            <>
              <NavItem title="Manage Accounts" href="/accounts" />
            </>
          }
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

export default CompanyMenuItem