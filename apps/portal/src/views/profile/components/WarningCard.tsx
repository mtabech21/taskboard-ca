
import { Card } from "@shad/card";
import { cn } from "@taskboard/client/ui/src/utils";

import { TriangleAlertIcon, X } from "lucide-react";


export function WarningCard(props: { warning: { level: string; title: string; message: string; }; }) {
  const ln = props.warning.level.length ?? 0;
  return (
    <Card className={cn(`text-left flex w-full justify-between items-start gap-2 p-3`, 'text-gray-600 bg-gray-50 border-gray-600', {
      'text-yellow-600 bg-yellow-50 border-yellow-600': ln == 1,
      'text-orange-600 bg-orange-50 border-orange-600': ln == 2,
      'text-red-600 bg-red-50 border-red-600': ln == 3
    })}>
      <div>
        <div className="flex justify-start font-bold items-center align-middle gap-3">
          <div><TriangleAlertIcon className="size-5" /></div>
          <div>{props.warning.title}</div>
        </div>
        <div className="text-sm">{props.warning.message}</div>
      </div>
      <X size={15} className="hover:cursor-pointer" />
    </Card>
  );
}
