import { useManagerAccount } from "@taskboard/client/hooks/accounts/use-manager"
import { ManagerAccount } from "@taskboard/types"
import { TopMenu } from "./components/TopMenu"
import { Card } from "@shad/card"
import { Navigate, Route, Routes } from "react-router-dom"
import CompanyView from "../company/CompanyView"
import AccountsView from "../accounts/AccountsView"
import RegisterAccountForm from "../forms/RegisterAccountForm"
import { AddAssociateForm } from "../forms/AddAssociateForm"

import { NewBranchForm } from "../forms/AddBranchForm"
import { ExternalLink } from "lucide-react"
import TimecardsView from "../timecards/TimecardsView"
import ProfilesView from "../profile/ProfilesView"

function MissingRoute() {
  return <Navigate to={'/branches'} />
}

function Footer() {
  return (
    <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
      <div>COPYRIGHT 2024 © METE SOLUTIONS INC.</div>
      <a rel="noreferrer" href="https://metesolutions.com" target="_blank" className="text-sx">
        <ExternalLink size={15} className="text-blue-500 hover:text-blue-400" />
      </a>
    </div>
  )
}

function ManagerView(props: { account: ManagerAccount }) {
  const account = useManagerAccount.init({ account: props.account })
  return (
    <useManagerAccount.Provider value={account}>
      <div className="flex flex-col flex-1 gap-3 justify-start p-3 min-[1200px]:w-[1200px] min-w-fit w-full m-auto h-full overflow-hidden" >
        <TopMenu />
        <Card className="overflow-hidden flex-1">
          <Routes>
            {account.is_admin && <Route path="/company" element={<CompanyView />} />}
            <Route path="/accounts" >
              <Route path="/accounts" element={<AccountsView />} />
              <Route path="/accounts/new" element={<RegisterAccountForm />} />
            </Route>
            <Route path="/associates">
              <Route path="/associates/profiles" element={<ProfilesView />} />
              <Route path="/associates/timecards" element={<TimecardsView />} />
              <Route path="/associates/new" element={<AddAssociateForm />} />
            </Route>
            <Route path="/branches">
              <Route path="/branches" element={'Branches'} />
              <Route path="/branches/new" element={<NewBranchForm />} />
            </Route>
            {/* <Route path="/surveys" element={<SurveysView />} /> */}
            <Route path="*" element={<MissingRoute />} />
          </Routes>
        </Card>
        <Footer />
      </div >
    </useManagerAccount.Provider>
  )
}

export default ManagerView