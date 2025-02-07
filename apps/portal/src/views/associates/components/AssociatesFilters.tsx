// import { Button } from "@shad/button";
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@shad/command";
// import { Popover, PopoverContent, PopoverTrigger } from "@shad/popover";
// import { Toggle } from "@shad/toggle";
// import { useAssociates } from "@taskboard/client/hooks/use-associates";
// import { cn } from "@taskboard/client/ui/src/utils";
// import { CheckIcon, SortAscIcon, TriangleAlertIcon } from "lucide-react";

// import { useState } from "react";

// export function AssociatesFilters() {
//   const associates = useAssociates()

//   const frameworks = associates.filterList.map((v) => {
//     return { value: v, label: v };
//   });

//   const value = associates.filter;
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="flex justify-start items-center gap-2">
//       <Toggle pressed={associates.filterWarnings} onPressedChange={e => associates.setFilterWarnings(e)} variant={"outline"} className="text-orange-600" aria-label="Toggle warning">
//         <TriangleAlertIcon className="h-5 w-5" />
//       </Toggle>
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             role="combobox"
//             aria-expanded={open}
//             className="w-[200px] justify-between font-mono text-xs"
//           >
//             {value
//               ? frameworks.find((framework) => framework.value === value)?.label
//               : "Select store..."}
//             <SortAscIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-[200px] p-0 font-mono">
//           <Command>
//             <CommandInput placeholder="Search store..." className="h-9" />
//             <CommandEmpty>No store found.</CommandEmpty>
//             <CommandGroup>
//               {frameworks.map((framework) => (
//                 <CommandItem
//                   key={framework.value}
//                   value={framework.value}
//                   onSelect={(currentValue) => {
//                     associates.setFilter(currentValue === value ? "" : currentValue);
//                     setOpen(false);
//                   }}
//                 >
//                   {framework.label}
//                   <CheckIcon
//                     className={cn(
//                       "ml-auto h-4 w-4",
//                       value === framework.value ? "opacity-100" : "opacity-0"
//                     )} />
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </Command>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }
