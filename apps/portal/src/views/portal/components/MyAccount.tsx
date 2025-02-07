import { Button } from "@shad/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@shad/dropdown-menu"
import { Switch } from "@shad/switch"
import { useAuthenticated } from "@taskboard/client/hooks/global/use-auth"
import { useTheme } from "@taskboard/client/hooks/global/use-theme"
import { cn } from "@taskboard/client/ui/src/utils"
import { LogOut, Moon, Sun, User2 } from "lucide-react"
import { useState } from "react"

const MyAccount = () => {
  const { user, signOut } = useAuthenticated.context()

  const full_name = `${user.first_name} ${user.last_name}`
  const [show_menu, set_show_menu] = useState(false)

  return (
    <DropdownMenu open={show_menu} onOpenChange={() => set_show_menu(false)} >
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} className="flex gap-2 justify-center items-center px-3 rounded" onClick={() => set_show_menu(true)}>
          <User2 className="text-primary" />
          {full_name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background border m-1 p-1 rounded" >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={e => e.preventDefault()} className="justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>Theme</div>
              <ThemeSwitch />
            </div>
            <div className="flex justify-center text-xs text-gray-500">I wouldn't do that...</div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-red-600 h-fit cursor-pointer justify-between w-full">
          <div>Log out</div>
          <LogOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const ThemeSwitch = () => {
  const theme = useTheme.context()
  return (
    <div className="flex justify-center items-center gap-2 p-1 rounded-full">
      <Sun size={16} className={cn('text-gray-600', { 'text-orange-400': theme.currrent == 'light' })} />
      <Switch defaultChecked={theme.currrent == 'dark'} onCheckedChange={c => theme.set(c ? 'dark' : 'light')} />
      <Moon size={16} className={cn('text-gray-600', { 'text-primary': theme.currrent == 'dark' })} />
    </div>
  )
}
export default MyAccount
