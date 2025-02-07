import { Account, AssociateAccount, Authenticated } from "@taskboard/types";
import { useState } from 'react';
import { TaskboardView } from '../tbs/TaskboardView';
import { Card } from "@shad/card";
import { BriefcaseBusiness, User } from "lucide-react";
import RegisterCompanyForm from "../forms/RegisterCompanyForm";
import logo from '@assets/images/logo.svg'


import { useQuery } from "@tanstack/react-query";
import { useAuthenticated } from "@taskboard/client/hooks/global/use-auth";
import { useAPI } from "@taskboard/client/hooks/global/use-api";

export function AuthenticatedView(props: { auth: Authenticated; }) {
  const authenticated = useAuthenticated.init({ auth: props.auth })
  const api = useAPI.context()
  const { data: account } = useQuery<Account | null>({
    queryKey: ['account', props.auth.user.uuid],
    queryFn: async () => (await api.get<Account>('/accounts/user')).data
  })


  return (
    <useAuthenticated.Provider value={authenticated} children={
      account ?

        (account.is_manager) ? <TaskboardView account={account} />
          : <AssociateSelfView account={account} />
        :
        <AccountSetupView />
    } />
  )
}

function AssociateSelfView(props: { account: AssociateAccount }) {
  const { first_name, last_name } = props.account
  return (
    <div>
      {first_name} {last_name}
    </div>
  )
}

function AccountSetupView() {

  const [selected, setSelected] = useState<'business' | 'associate'>()

  return (
    <div className="h-full w-full p-10 flex flex-col items-center justify-center">
      <TopMenu />
      <div className="flex flex-col justify-center items-center h-full w-full gap-7 select-none">
        {selected ?
          selected === 'business' ?
            <RegisterCompanyForm />
            : <div></div>
          : <SelectAccountType set={setSelected} />
        }
      </div>
    </div >
  )
}

function TopMenu() {
  const { signOut } = useAuthenticated.context()

  return <div className="flex justify-between w-full max-w-screen-lg">
    <img src={logo} alt="logo" draggable='false' className="h-[4em]" style={{ maxHeight: '2em', userSelect: 'none', aspectRatio: "auto" }} />
    <div className="text-red-600 font-tb_medium hover:text-red-400 flex items-center justify-center gap-3 cursor-pointer" onClick={signOut}>
      Sign Out
    </div>
  </div>;
}

function SelectAccountType(props: { set: React.Dispatch<React.SetStateAction<"associate" | "business" | undefined>> }) {
  return (
    <>
      <div className="font-tb_medium text-5xl">Let's begin!</div>
      <div className="font-tb_medium text-2xl">Please select one of the options below.</div>
      <div className="flex items-center justify-center gap-10 w-full p-10 max-w-[1000px]">
        <Card className="shadow-lg flex-1 aspect-square flex flex-col justify-center items-center rounded gap-5 text-blue font-tb_medium border-2 border-gray-200 hover:border-blue hover:bg-gray-50 hover:cursor-pointer transition-all" onClick={() => props.set('associate')}>
          <User className="w-40 text-5xl sm:text-9xl" />
          <div className="text-black text-sm sm:text-xl p-3">Setup an associate profile</div>
        </Card>
        <Card className="shadow-lg flex-1 aspect-square flex flex-col justify-center items-center rounded gap-5 text-blue font-tb_medium border-2 border-gray-200 hover:border-blue hover:bg-gray-50 hover:cursor-pointer transition-all" onClick={() => props.set('business')}>
          <BriefcaseBusiness className="w-40 text-5xl sm:text-9xl" />
          <div className="text-black text-sm sm:text-xl p-3">Initialize a business</div>
        </Card>
      </div>
    </>
  )
}

// function AccountSelectPrompt(props: { setSelected: (value: React.SetStateAction<"company" | "associate" | undefined>) => void }) {
//   return (
//     <div className="flex gap-10">
//       <div onClick={() => props.setSelected('associate')}>Associate Account</div>
//       <div onClick={() => props.setSelected('company')}>Company Account</div>
//     </div>
//   )
// }