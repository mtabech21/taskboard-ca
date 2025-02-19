import { Associate, AssociateBadge, AssociateGroupedList, AssociatesFilter, BranchGroup, ManagerAccount, PositionGroup } from "@taskboard/types";
import Contextor from "../contextor";
import { useAPI } from "../global/use-api";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const useAssociates = new Contextor((config: { account: ManagerAccount }) => {
  const { account } = config

  const api = useAPI.context()

  const filter_options = {
    branches: account.branches,
  }

  const { data: associates } = useQuery({
    queryKey: ['associate_item_list', account.user.uuid], queryFn: () => {
      return account.is_admin ? api.post<AssociateBadge[]>(`/payroll/associates/list?company_id=${account.company.id}`).then(res => res.data)
        : api.post<AssociateBadge[]>(`/payroll/associates/list`, { branch_ids: account.branches.flatMap(v => v.id) }).then(res => res.data);
    }, initialData: []
  })


  const [grouped_by, group_by] = useState<'Branch' | 'Position'>('Branch')
  const [filter, set_filter] = useState<AssociatesFilter>({ branches: [], positions: [] });

  const groups = useMemo<AssociateGroupedList>(() => {
    const branch_filter = (branch_number: string) => { return filter.branches.length > 0 ? filter.branches.map(({ number }) => number).includes(branch_number) : true }
    // const position_filter = (position_name: string) => filter.positions.map(({ name }) => name).includes(position_name)
    const filtered = associates.filter(p => branch_filter(p.branch_number))

    switch (grouped_by) {
      case "Branch":
        return filter_options.branches.map<BranchGroup>(branch => {
          return { branch, associates: filtered.filter(({ branch_number }) => branch_number == branch.number) }
        })
      case "Position":
        return filter.positions.map<PositionGroup>(position => { return { position, associates: filtered.filter(({ position_name }) => position_name == position.name) } })
    }
  }, [associates, grouped_by, filter])

  const navigate = useNavigate()
  const [search] = useSearchParams()
  const selected = associates.find(p => p.badge_number === search.get('badge_number'))
  const select = (badge_number: string) => navigate({ search: `badge_number=${badge_number}` })
  console.log(groups)
  return { groups, list: associates, selected, select, group_by, filter, set_filter, filter_options };
})
