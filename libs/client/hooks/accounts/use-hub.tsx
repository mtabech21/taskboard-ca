import { useEffect, useState } from "react";
import Contextor from "../contextor";
import { Branch, ManagerAccount } from "@taskboard/types";
import { usePuncher } from "../puncher/use-puncher";
import { useTasks } from "../tasks/use-tasks";
import { useAssociates } from "../associates/use-associates";

export function branch_sort(a: Branch, b: Branch) {
  const aIsLetter = isNaN(Number(a.number));
  const bIsLetter = isNaN(Number(b.number));

  if (aIsLetter && bIsLetter) {
    // If both are letters, compare them as strings
    return a.number.localeCompare(b.number);
  } else if (aIsLetter) {
    // If 'a' is a letter and 'b' is a number, 'a' should come before 'b'
    return -1;
  } else if (bIsLetter) {
    // If 'b' is a letter and 'a' is a number, 'b' should come before 'a'
    return 1;
  } else {
    // If both are numbers, compare them as numbers
    return Number(a) - Number(b);
  }
}

export const useHub = new Contextor((config: { account: ManagerAccount }) => {
  const { account } = config
  const branches = account.branches.sort(branch_sort)

  const saved_branch = localStorage.getItem('selected_branch')
  const [selectedBranch, setSelectedBranch] = useState(saved_branch ? JSON.parse(saved_branch) as Branch : branches[0])
  function selectBranch(branch_id: string) {
    const branch = branches.find(b => b.id === branch_id)
    if (branch) setSelectedBranch(branch)
  }

  const associates = useAssociates.init({ account })
  const puncher = usePuncher.init({ branch: selectedBranch })
  const tasks = useTasks(selectedBranch)

  useEffect(() => { localStorage.setItem('selected_branch', JSON.stringify(selectedBranch)) }, [selectedBranch])

  return { account, puncher, associates, selectedBranch, selectBranch, tasks }
})