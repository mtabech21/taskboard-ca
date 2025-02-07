import { Separator } from "@shad/separator";
import { useState } from "react";
import { AssociateSelectorItem } from "./AssociateSelectorItem";
import { BranchGroup } from "@taskboard/types";


export function StoreGroup(props: { group: BranchGroup }) {

  const [open, setOpen] = useState(true);

  return (
    <div>
      <div onClick={() => setOpen(p => !p)} className="font-mono text-xs font-light select-none flex justify-between p-1">
        <div className="font-bold">{props.group.branch.number}</div>
        <div className="text-gray-500">({props.group.associates.length} Associates)</div>
      </div>
      <Separator />
      {open &&

        props.group.associates.map((a) => (
          <AssociateSelectorItem associate={a} key={a.associate_id} />
        ))}
    </div>
  );
}
