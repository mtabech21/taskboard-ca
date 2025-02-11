import { Card } from "@shad/card";
import { Separator } from "@shad/separator";
import { AssociateBadge, Punch } from "@taskboard/types";
import { useAPI } from "@taskboard/client/hooks/global/use-api";
import { Badge } from "@shad/badge";
import { cn } from "@taskboard/client/ui/src/utils";
import { useQueries, useQuery } from "@tanstack/react-query";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shad/hover-card";
import { useAssociates } from "@taskboard/client/hooks/associates/use-associates";


function useAssociateProfile(badge: AssociateBadge) {
  const api = useAPI.context()
  const [] = useQueries({
    queries: [
      {
        queryKey: ['associate_personal_data', badge.associate_id],
        queryFn: async () => await api.get(`/payroll/associates/profile?id=${badge.associate_id}`)
      }
    ]
  })

  return { badge }
}

export function AssociateProfileView(props: { associate: AssociateBadge }) {

  const profile = useAssociateProfile(props.associate)

  return (
    <div className="flex flex-1 flex-col justify-start p-5 w-full gap-3 overflow-scroll">
      <AssociateBadgeHeader badge={profile.badge} />
      <>
        <PersonalCard />
        <EmploymentCard />
        <PayrollCard />
        <BankCard />
      </>
    </div>
  );
}

export function AssociateBadgeHeader(props: { badge: AssociateBadge, className?: string }) {
  const { badge } = props
  const { status_list } = useAssociates.context()
  const status = status_list.find(p => p?.associate_id == badge.associate_id)

  return (
    <div className={cn("text-left flex justify-between h-fit", props.className)}>
      <div className="flex flex-col gap-2">
        <div>
          <div className="text-4xl flex items-center gap-2">
            <div>{badge.last_name}, {badge.first_name}</div>
          </div>
          <div className="text-xl text-gray-600">{badge.position_name}</div>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono">
          <Badge>{badge.branch_number}</Badge>
          <div>{badge.branch_name}</div>
        </div>
      </div>
      <div className="flex gap-2 flex-col items-end">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className={cn("font-mono text-2xl bg-slate-600 text-white h-fit px-1 rounded w-fit", { 'bg-green-600': status?.type == 'in', 'bg-gray-600': status?.type == 'out', 'bg-yellow-500': status?.type == 'meal' },)}>{badge.badge_number}</div>
          </HoverCardTrigger>
          <HoverCardContent asChild>
            <div>dads</div>
          </HoverCardContent>
        </HoverCard>

      </div>
    </div>
  )
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