import { NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from "@shad/navigation-menu";
import { UserPlus } from "lucide-react";
import NavItem from "./NavItem";

export function AssocociateMenuItem() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Associates</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
          <li className="row-span-3">
            <NavigationMenuLink asChild>
              <a
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                href="/associates/new"
              >
                <UserPlus className="h-6 w-6" />
                <div className="mb-2 mt-4 text-lg font-medium">
                  New Associate
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                  Onboard a new associate into the company.
                </p>
              </a>
            </NavigationMenuLink>
          </li>
          <NavItem href="/associates/profiles" title="Profiles" children={'View and edit associate profile details'} />
          <NavItem href="/associates/timecards" title="Timecards" children={'Manage associate timecards'} />
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}