import { AssociateBadge, AssociatePunches, Branch, NewPunch, PunchType, TimecardPunch } from "@taskboard/types"
import { useCallback, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { UUID } from "crypto"
import Contextor from "../contextor"
import { useAPI } from "../global/use-api"
import useClock from "./use-clock"
import { useToast } from "@taskboard/client/ui/src/hooks/use-toast"
import { useAssociates } from "../associates/use-associates"

export const usePuncher = new Contextor((config: { branch: Branch }) => {
  const { branch } = config
  const api = useAPI.context()
  const { toast } = useToast()

  const [punchingFor, setPunchingFor] = useState<AssociateBadge | null>(null)

  const punchesQuery = useQuery<AssociatePunches[]>({
    initialData: [],
    queryKey: ['punches', branch.id],
    // queryFn: async () => (await api.get(`/payroll/associates/punches?branch_id=${branch.id}`)).data,
  })
  const { status_list } = useAssociates.context()

  const punchMutation = useMutation({
    mutationKey: ['associate_punch'],
    mutationFn: async (punch: { user_id: UUID, type: PunchType }) => {
      const selected = punches.find(v => v.badge.associate_id === punch.user_id)
      if (selected?.punches[selected.punches.length - 1].type === punch.type) { throw new Error('status-not-changed') }
      const punchData: TimecardPunch = {} as TimecardPunch
      const timestamp = clock.currentTime
      timestamp.setSeconds(0)
      punchData.timestamp = timestamp
      punchData.type = punch.type
      if (punchData.type) {
        api.post('/payroll/associates/punch/', {
          timestamp: punchData.timestamp,
          associate_id: punch.user_id,
          type: punchData.type,
          branch_id: branch.id
        } as NewPunch)
          .then(() => {
            punchesQuery.refetch()
            toast({ title: 'Successfully Punched' })
          })
          .catch((e) => {
            toast({
              title: 'ERROR',
              description: JSON.stringify(e)
            })
          })
      }
    }
  })

  const badgesQuery = useQuery<AssociateBadge[]>({
    initialData: [],
    queryKey: ['badges', branch.id],
    queryFn: async () => (await api.get(`/payroll/associates/badges?company_id=${branch.company_id}`)).data
  })

  const punches = punchesQuery.data
  const badges = badgesQuery.data
  const punch = punchMutation.mutate
  const clock = useClock.init({})

  const getTotals = useCallback((): { associate: AssociateBadge, total: number }[] => {
    return punches.map(a => {
      let sum = 0
      let lastIn: Date | null = null
      a.punches.forEach((p, i, a) => {
        if (p.type === 'in') {
          lastIn = new Date(p.timestamp);
          if (a.length === i + 1) { sum += Date.now() - new Date(p.timestamp).getTime(); }
        } else if ((p.type === 'out' || p.type === 'meal') && lastIn) {
          sum += (new Date(p.timestamp).getTime() - lastIn.getTime())
          lastIn = null
        }
      })
      return { associate: a.badge, total: sum }

    })
  }, [punches])

  return { clock, punch, badges, punches, punchingFor, setPunchingFor, getTotals, status_list }
})

