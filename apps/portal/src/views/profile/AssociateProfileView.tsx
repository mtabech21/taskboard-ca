
import { WarningCard } from "./components/WarningCard";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@shad/card";
import { Separator } from "@shad/separator";
import { AssociateItem, Warning } from "@taskboard/types";
import { useAPI } from "@taskboard/client/hooks/global/use-api";



export type PlacePrediction = {
  placePrediction: {
    place: string,
    placeId: string,
    text: {
      text: string,
      matches: {
        startOffset?: number
        endOffset?: number
      }[],
    }
  }
}




type PersonalData = {
  first_name: string
  last_name: string

}

type ProfileData = {
  id: string
  personal: PersonalData
  employment: 'EmploymentData'
  payroll: 'PayrollData'
  bank: 'BankData'
  warnings: Warning[]
}

const AssociateProfileSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  branch_id: z.string().uuid()
})

const loadErrorWarning = { level: '!!!', title: `Cannot Manage Profile`, message: `Profile manager is still under development and cannot be used at the moment.` } as Warning

function useAssociateProfile(info: AssociateItem) {
  const api = useAPI.context()
  const [data, setData] = useState<ProfileData>()
  const [warnings, setWarnings] = useState<Warning[]>([])

  useEffect(() => {
    setData(undefined)
    api.get<ProfileData>(`/payroll/associates/profile?id=${info.associate_id}`).then((v) => {
      v.data && setData(v.data)
    }).catch(() => {
      setData({} as ProfileData)
      setWarnings([loadErrorWarning])
    })
  }, [info, api])

  const form = useForm<z.infer<typeof AssociateProfileSchema>>({
    resolver: zodResolver(AssociateProfileSchema),
  })

  return { data, form, info, warnings }
}

export function AssociateProfileView(props: { associate: AssociateItem }) {

  const profile = useAssociateProfile(props.associate)

  return (
    <div className="flex flex-1 flex-col justify-start w-full p-8 gap-3 overflow-scroll">
      <div className="text-left flex justify-between h-fit">
        <div>
          <div className="text-4xl">{profile.info.last_name}, {profile.info.first_name}</div>
          <div className="text-sm font-mono">{profile.info.position_name}</div>
        </div>
        <div className="font-mono text-2xl bg-slate-600 text-white h-fit px-1 rounded">{profile.info.branch_number}</div>
      </div>
      {profile.data &&
        <>
          {profile.warnings.map((w, i) => (<WarningCard key={i} warning={w} />))}
          <PersonalCard />
          <EmploymentCard />
          <PayrollCard />
          <BankCard />
        </>
      }
    </div>
  );
}

function PayrollCard() {
  return (
    <Card >
      <div className="m-3 flex flex-col items-start gap-2">
        <div className="text-xl font-bold">Payroll</div>
        <Separator />
      </div>
    </Card>
  )
}

function PersonalCard() {

  return (
    <Card >
      <div className="m-3 flex flex-col items-start gap-2">
        <div className="text-xl font-bold">Personal</div>
        <Separator />

      </div>
    </Card>
  )
}
function EmploymentCard() {
  return (
    <Card >
      <div className="m-3 flex flex-col items-start gap-2">
        <div className="text-xl font-bold">Employment </div>
        <Separator />
      </div>
    </Card>
  )
}

function BankCard() {
  return (
    <Card >
      <div className="m-3 flex flex-col items-start gap-2">
        <div className="text-xl font-bold">Direct Deposit</div>
        <Separator />
      </div>
    </Card>
  )
}