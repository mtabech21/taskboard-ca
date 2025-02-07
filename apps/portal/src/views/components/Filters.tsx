import { Button } from "@shad/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@shad/command";
import { Popover, PopoverContent, PopoverTrigger } from "@shad/popover";
import { CheckIcon, Search, UserRoundSearch } from "lucide-react";
import { useState } from "react";
import { cn } from "@taskboard/client/ui/src/utils";
import { useAssociates } from "@taskboard/client/hooks/associates/use-associates";
import { Branch, BranchGroup } from "@taskboard/types";



export function AssociateFilters() {

  return (
    <div className="flex justify-start items-center gap-2">
      {/* <WarningFilter /> */}
      <BranchFilter />
      <AssociateSearch />
    </div>
  );
}


// function WarningFilter() {
//   const associates = useAssociates()
//   return (
//     <Toggle pressed={associates.filterWarnings} onPressedChange={e => associates.setFilterWarnings(e)} variant={"outline"} className="text-orange-600" aria-label="Toggle warning">
//       <TriangleAlertIcon className="h-5 w-5" />
//     </Toggle>
//   )
// }

function BranchFilter() {
  const { filter, set_filter, filter_options } = useAssociates.context()
  const selected_branch: Branch | undefined = filter.branches[0]
  const [open, setOpen] = useState(false);


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between font-mono text-xs"
        >
          {selected_branch
            ? selected_branch?.number
            : "Select store..."}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 font-mono">
        <Command>
          <CommandInput placeholder="Search store..." className="h-9" />
          <CommandEmpty>No store found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {filter_options.branches.map((branch) => (
                <CommandItem
                  key={`${branch.number} ${branch.name}`.toLowerCase()}
                  value={branch.number.toLowerCase()}
                  onSelect={() => {
                    if (branch.number === selected_branch?.number)
                      set_filter({ branches: [], positions: [] })
                    else
                      set_filter({ branches: [branch], positions: [] })
                    setOpen(false);
                  }}
                >
                  {branch.number}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function AssociateSearch() {



  const { selected, groups, select } = useAssociates.context()
  const [open, setOpen] = useState(false);

  const [search_input, set_search_input] = useState('')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between font-mono text-xs"
        >
          {selected
            ? `${selected.first_name} ${selected.last_name}`
            : "Find Employee..."}
          <UserRoundSearch className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 font-mono">
        <Command>
          <CommandInput placeholder="Search" className="h-9" onValueChange={set_search_input} />
          {search_input.length > 3 &&
            <CommandEmpty>No Employees</CommandEmpty>}
          <CommandList>
            {search_input.length > 3 &&
              (groups as BranchGroup[]).map(group => (
                <CommandGroup key={group.branch.id} heading={group.branch.number} className="border-b">

                  {group.associates.map((associate) => (
                    <CommandItem
                      key={associate.associate_id}
                      value={`${associate.first_name} ${associate.last_name} ${associate.badge_number}`}
                      onSelect={() => {
                        select(associate.badge_number)
                        setOpen(false);
                      }}
                    >
                      <div> <div className="text-xs text-gray-400">{associate.badge_number}</div><div>{associate.first_name} {associate.last_name}</div></div>
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          associate.associate_id === selected?.associate_id ? "opacity-100" : "opacity-0"
                        )} />
                    </CommandItem>
                  ))}

                </CommandGroup>
              ))
            }
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover >
  )
}
