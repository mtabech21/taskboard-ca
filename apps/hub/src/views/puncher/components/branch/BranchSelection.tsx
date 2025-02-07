import { useState } from "react";
import { AiOutlineGlobal } from "react-icons/ai";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shad/select";
import { branch_sort, useHub } from "@taskboard/client/hooks/accounts/use-hub";


export function BranchSelection() {
  const { account, selectedBranch, selectBranch } = useHub.context()

  const online = true;
  const [showSelectBranch, setShowSelectBranch] = useState(false);
  return (

    <Select value={selectedBranch.id} onValueChange={(v) => selectBranch(v)} open={showSelectBranch} onOpenChange={() => setShowSelectBranch(false)} >
      <div className="flex w-full justify-center bg-white p-3">
        <SelectTrigger onClick={() => { setShowSelectBranch(true); }} className="flex justify-center items-center text-center align-middle gap-2 text-gray-500 bg-white select-none p-2 rounded hover:bg-slate-100 cursor-pointer">
          <div className="flex items-center justify-center gap-1">{online ? "Online" : "Offline"} <AiOutlineGlobal style={{ height: "20px", color: `${online ? "green" : "red"}`, alignItems: "center" }} /></div>
          -
          <SelectValue defaultValue={selectedBranch.id}><span style={{ color: "black", fontWeight: 500 }}>{selectedBranch.number}</span> ({selectedBranch.name})</SelectValue>
        </SelectTrigger>
      </div>

      <SelectContent>
        {account.branches.sort(branch_sort).map((b, i) => (
          <SelectItem key={i} value={b.id} className="flex justify-center items-center text-center align-middle gap-2 text-gray-500 bg-white select-none p-2 rounded hover:bg-slate-100 cursor-pointer" >
            <span style={{ color: "black", fontWeight: 500 }}>{b.number}</span> ({b.name})
          </SelectItem>
        ))}
      </SelectContent>
    </Select >
  );
}
