
import { Card } from "@shad/card";
import { Separator } from "@shad/separator";
import { Check, Copy, FileCog, Key, Plus } from "lucide-react";
import { createContext, useCallback, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query";
import { LoadingView } from "../auth/components/LoadingView";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@shad/checkbox";
import { Button } from "@shad/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shad/hover-card";
import { AccountListItem, Company } from "@taskboard/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@shad/sheet";
import { cn } from "@taskboard/client/ui/src/utils";
import { useAPI } from "@taskboard/client/hooks/global/use-api";
import { useManagerAccount } from "@taskboard/client/hooks/accounts/use-manager";
import { UUID } from "crypto";





export type AccountManagerType = {
  company: Company
  accounts: AccountListItem[]
}

function useAccountManager(company: Company) {
  const api = useAPI.context()
  const accounts = useQuery({
    queryKey: ['account_list'], queryFn: () => api.get<AccountListItem[]>(`/company/accounts/${company.id}`).then(r => r.data.sort((a, b) => {
      const aIsLetter = isNaN(Number(a.first_name)); const bIsLetter = isNaN(Number(b.first_name));
      return (aIsLetter && bIsLetter) ? a.first_name.localeCompare(b.first_name) : aIsLetter ? -1 : bIsLetter ? 1 : Number(a.first_name) - Number(b.first_name)
    }))
  })
  const generated_passwords = useQuery({
    queryKey: ['generated_passwords', company.id],
    queryFn: () => api.get<{ user_id: string, password: string }[]>(`/portal/generated_passwords`).then(r => r.data),
    initialData: [],
  })

  return { company, accounts, generated_passwords: generated_passwords.data }
}

const account_manager_context = createContext({} as AccountManagerType)



function AccountManager() {
  const { company } = useManagerAccount.context()
  const manager = useAccountManager(company)
  const nav = useNavigate()

  if (manager.accounts.isPending) { return <LoadingView /> }
  if (manager.accounts.isSuccess) {
    return (
      <account_manager_context.Provider value={{ accounts: manager.accounts.data, company: manager.company }} >
        <div className="max-h-full flex flex-col">
          <div className="text-2xl p-3 flex justify-center items-center gap-3"><div>Accounts</div> <Plus className="text-blue-600 hover:cursor-pointer hover:text-blue-700" onClick={() => nav('/accounts/new')} /></div>
          <Separator />
          <div className="overflow-scroll max-h-full flex flex-col p-2 gap-2">
            {manager.accounts.data.map(acc => (
              <AccountCard key={acc.uuid} account={acc} password={manager.generated_passwords.find(p => p.user_id === acc.user_id)?.password} />
            ))}
          </div>
        </div>
      </ account_manager_context.Provider >
    )
  }
  else return <div />
}


function AccountCard(props: { account: AccountListItem, password?: string }) {

  return (
    <Card className="flex rounded justify-between items-center p-3 hover:cursor-default hover:bg-gray-50 h-full">
      <div className="text-left flex items-center gap-5">
        <div className="text-sm border px-1 rounded bg-gray-100 flex-1">{props.account.first_name} {props.account.last_name}</div>
        <div className="text-sm border px-1 rounded bg-gray-100 flex-1">{props.account.email}</div>
        {props.password && <HoverCard>
          <HoverCardTrigger className="p-1 rounded hover:cursor-pointer hover:text-gray-500">
            <Key size={15} />
          </HoverCardTrigger>
          <HoverCardContent className="p-2 flex w-fit items-center justify-between gap-5 font-mono text-sm">
            <PasswordToClipboard password={props.password} />
          </HoverCardContent>
        </HoverCard>}
        {props.account.is_admin ? <div className="text-sm bg-slate-800 text-white font-bold rounded px-1">ADMIN</div> : <div className="text-sm bg-slate-200 font-bold border rounded px-1">PORTAL</div>}
      </div>
      {!props.password && <ManageAssociateButton account={props.account} />}
    </Card>
  )
}

function ManageAssociateButton(props: { account: AccountListItem }) {


  return (
    <Sheet>
      <SheetTrigger>
        <div className="flex text-gray-600 hover:text-gray-500 hover:cursor-pointer"><FileCog /></div>
      </SheetTrigger>
      <SheetContent className="flex justify-center *:flex-1 *:gap-3">
        <SheetHeader>
          <SheetTitle>Manage Account</SheetTitle>
          <div className="text-sm border px-1 rounded bg-gray-100">{props.account.email}</div>
          {props.account.is_admin ?
            <div className="text-sm bg-slate-800 text-white font-bold rounded px-1">ADMIN</div> :
            <BranchCheckList user_id={props.account.user_id} branch_access_list={props.account.branch_ids} />
          }
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

function BranchCheckList(props: { user_id: string, branch_access_list: UUID[] }) {
  const api = useAPI.context()
  const { branches } = useManagerAccount.context()
  const [branch_access, set_branch_access] = useState<UUID[]>(props.branch_access_list)
  const branch_list = branches.sort((a, b) => {
    const aIsLetter = isNaN(Number(a.number)); const bIsLetter = isNaN(Number(b.number));
    return (aIsLetter && bIsLetter) ? a.number.localeCompare(b.number) : aIsLetter ? -1 : bIsLetter ? 1 : Number(a.number) - Number(b.number)
  })

  const all_selected = branch_access.length === branches.length
  const on_select_all = () => {
    if (!all_selected) {
      set_branch_access(branch_list.map(b => b.id))
    } else {
      set_branch_access([])
    }
  }

  const check = useCallback((branch_id: UUID) => {
    set_branch_access((p) => {
      if (p.includes(branch_id)) {
        p = p.filter(b => b !== branch_id)
      } else {
        p.push(branch_id)
      }
      const l = [...p]
      return l
    })
  }, [])

  function save() {
    api.post(`/portal/account/${props.user_id}/branch_access`, { branch_ids: branch_access }).then(() => window.location.reload())
  }
  return (
    <>
      <div className="flex flex-col overflow-scroll gap-3 w-full">
        <Button className={cn({ 'bg-gray-500': all_selected })} onClick={on_select_all}>{!all_selected ? 'Select All' : 'Unselect All'}</Button>
        {
          branches.map(b => (
            <Card key={b.id} className={cn("flex p-3 items-center justify-evenly", { "text-slate-400": !branch_access.includes(b.id) })}>
              <div className="w-[33%]">{b.number}</div>
              <div className="flex-1 text-sm whitespace-nowrap truncate">{b.name}</div>
              <Checkbox checked={branch_access.includes(b.id)} onClick={() => check(b.id)} />
            </Card>)
          )
        }
      </div>
      <Button onClick={save}>Save</Button>
    </>
  )
}

function PasswordToClipboard(props: { password: string }) {
  const [clicked, set_clicked] = useState(false)
  const text_ref = useRef<HTMLDivElement>(null)
  function copy(s: string) {
    navigator.clipboard.writeText(s); set_clicked(true);
  }

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="outline-none bg-gray-900 rounded text-white px-1" ref={text_ref}>{props.password}</div>
      </div>
      <button disabled={clicked} onClick={() => copy(props.password)} title="Copy Password" className={cn("border rounded p-1", { "hover:cursor-default bg-gray-50 text-gray-600": clicked, "hover:bg-gray-50": !clicked })}>{!clicked ? <Copy size={15} /> : <Check size={15} />}</button>
    </>
  )
}
export default AccountManager