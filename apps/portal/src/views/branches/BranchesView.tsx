
// import { Button } from "@shad/button"
// import { Card } from "@shad/card"
// import { Form, FormField } from "@shad/form"
// import { Input } from "@shad/input"
// import { Label } from "@shad/label"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { CheckIcon, PlusIcon, SortAscIcon, X } from "lucide-react"
// import { useEffect, useState } from "react"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { Popover, PopoverContent, PopoverTrigger } from "@shad/popover"
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@shad/command"
// import { useQuery } from "@tanstack/react-query"
// import { cn } from "@taskboard/client/ui/src/utils"

// import { useAPI } from "@taskboard/client/hooks/global/use-api"
// import { useManagerAccount } from "@taskboard/client/hooks/accounts/use-manager"
// import { Branch, BranchWidget, Company } from "@taskboard/types"
// import { useAssociates } from "@taskboard/client/hooks/associates/use-associates"



// function BranchesView() {
//   const { company, branches } = useManagerAccount.context()
//   const branch_list = branches.sort((a, b) => {
//     const aIsLetter = isNaN(Number(a.number)); const bIsLetter = isNaN(Number(b.number));
//     return (aIsLetter && bIsLetter) ? a.number.localeCompare(b.number) : aIsLetter ? -1 : bIsLetter ? 1 : Number(a.number) - Number(b.number)
//   })
//   const show = false
//   return (
//     <div className="grid gap-4 p-4 max-h-full overflow-scroll lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  ">
//       {branch_list.map((br) => (
//         <BranchCard key={br.id} branch={br} />
//       ))}
//       {show && <NewBranchCard company={company} />}
//     </div>
//   )
// }



// function NewBranchCard(props: { company: Company }) {
//   const [show_form, set_show_form] = useState(false)



//   return (
//     <Card className="aspect-square overflow-hidden p-2 min-w-fit min-h-fit" >
//       {
//         !show_form ?
//           <div className="flex hover:bg-gray-50 h-full justify-center items-center hover:cursor-pointer rounded" onClick={() => set_show_form(p => { if (p === false) { return true } else return p })}>
//             <PlusIcon size={50} className="text-blue-600" />
//             <div className="text-gray-500">Add Branch</div>
//           </div>
//           :
//           <NewBranchForm company={props.company} set_show={set_show_form} />
//       }
//     </Card>
//   )
// }

// function useBranchForm(company: Company) {
//   const api = useAPI.context()

//   const schema = z.object({
//     branch_name: z.string().min(3).max(20),
//     branch_number: z.string().min(3).max(10),
//     manager_associate_id: z.string().uuid(),
//   })

//   const form = useForm<z.infer<typeof schema>>({
//     defaultValues: {
//       branch_name: '',
//       branch_number: '',
//       manager_associate_id: ''
//     }, resolver: zodResolver(schema)
//   })

//   function handler() {
//     const values = form.getValues()
//     api.post(`/company/${company.id}/create_branch`, values).then(() => { window.location.reload() })
//   }
//   return { ...form, handler }
// }

// function NewBranchForm(props: { company: Company, set_show: React.Dispatch<React.SetStateAction<boolean>> }) {
//   const form = useBranchForm(props.company)
//   // const portal = useContext(portal_context)

//   return (
//     <div className="flex flex-col gap-1 justify-between h-full">
//       <div className="flex justify-end text-red-500"><X className="hover:cursor-pointer hover:text-red-900" onClick={() => { props.set_show(false) }} /></div>
//       <div className="p-3 h-full overflow-scroll rounded border">
//         <Form {...form}>
//           <form className={'flex-col space-y-3'} autoComplete="off" onSubmit={form.handleSubmit(form.handler)}>
//             <FormField control={form.control} name="branch_number" render={({ field }) =>
//               <div className="text-left">
//                 <Label>Branch Number</Label>
//                 <Input placeholder="S12345" {...field} />
//               </div>
//             } />
//             <FormField control={form.control} name="branch_name" render={({ field }) =>
//               <div className="text-left">
//                 <Label>Branch Name</Label>
//                 <Input placeholder="North City Plaza" {...field} />
//               </div>
//             } />
//             <FormField control={form.control} name="branch_number" render={() =>
//               <div className="text-left">
//                 <Label>Manager</Label>
//                 {/* <AssociateSelector associates={portal.} on_selection={(id) => { form.setValue('manager_associate_id', id) }} {...field} /> */}
//               </div>
//             } />
//             <Button type="submit" style={{ width: '6em' }} >Create</Button>
//           </form>
//         </Form>
//       </div>
//     </div >
//   )
// }

// export function AssociateSelector(props: { on_selection: (associate_id: string) => void }) {
//   const [input, set_input] = useState('')
//   const account = useManagerAccount.context()
//   const associates = useAssociates.init({ account })

//   const search_list = associates.list.map((v) => {
//     return {
//       value: v, label: `${v.first_name} ${v.last_name}`
//     };
//   });

//   const value = associates.selected
//   const [open, setOpen] = useState(false);

//   useEffect(() => { props.on_selection(value?.associate_id ?? '') }, [value, props])

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger
//         asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-full justify-between font-mono text-xs"
//         >
//           {value
//             ? search_list.find((employee) => employee.value === value)?.label
//             : "No Manager"}
//           <SortAscIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-full p-0 font-mono">
//         <Command>
//           <CommandInput value={input} placeholder="Search" className="h-9" onValueChange={(v) => set_input(v)} />
//           <CommandEmpty>{input.length > 1 ? 'No Associate' : 'Continue typing...'}</CommandEmpty>
//           {input.length > 1 ? associates.filter_options.branches.map(br => (
//             <CommandGroup key={br} heading={br} className="border-b">
//               {search_list.filter(pr => pr.value.branch_number === br).map((employee) => (
//                 <CommandItem
//                   key={employee.value.associate_id}
//                   value={`${employee.value.first_name} ${employee.value.last_name} ${employee.value.badge_number}`}
//                   onSelect={() => {
//                     const as = associates.list.find(p => p.associate_id === employee.value.associate_id)
//                     // associates.select(pr => { if (pr === as) { associates.filter(''); return undefined } else { associates.setFilter(as?.branch_number ?? ''); return as } });
//                     set_input('')
//                     setOpen(false);
//                   }}
//                 >
//                   <div> <div className="text-xs text-gray-400">{employee.value.badge_number}</div><div>{employee.label}</div></div>
//                   <CheckIcon
//                     className={cn(
//                       "ml-auto h-4 w-4",
//                       value === employee.value ? "opacity-100" : "opacity-0"
//                     )} />
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           )) :
//             associates.selected &&
//             <CommandGroup heading={associates.selected.branch_number} className="border-b">
//               <CommandItem
//                 key={associates.selected.associate_id}
//                 value={`${associates.selected.first_name} ${associates.selected.last_name}`}
//                 onSelect={() => {
//                   const as = associates.list.find(p => p.associate_id === associates.selected?.associate_id)
//                   associates.setSelected(pr => { if (pr === as) { associates.setFilter(''); return undefined } else { associates.setFilter(as?.branch_number ?? ''); return as } });
//                   setOpen(false);
//                 }}
//               >
//                 <div> <div className="text-xs text-gray-400">{associates.selected.badge_number}</div><div>{search_list.find(pr => pr.value.associate_id === associates.selected?.associate_id)?.label}</div></div>
//                 <CheckIcon
//                   className={cn(
//                     "ml-auto h-4 w-4",
//                     value === associates.selected ? "opacity-100" : "opacity-0"
//                   )} />
//               </CommandItem>
//             </CommandGroup>}

//         </Command>
//       </PopoverContent>
//     </Popover>
//   )
// }

// function BranchCard(props: { branch: Branch }) {
//   const api = useAPI.context()
//   const widget = useQuery({ queryKey: ['branch_widget', props.branch.id], queryFn: () => api.get<BranchWidget>(`/branches/widget/${props.branch.id}`).then(r => r.data) })

//   if (widget.isPending) return props.branch.number
//   if (widget.isError) return props.branch.number + 'ERROR'
//   if (widget.isSuccess) {
//     const branch = widget.data

//     const associates = {
//       in: branch.associates.filter(a => a.status.punch === 'in'),
//       out: branch.associates.filter(a => a.status.punch === 'out'),
//       meal: branch.associates.filter(a => a.status.punch === 'meal')
//     }

//     return (
//       <Card className="aspect-square overflow-hidden p-2 select-none" >
//         <div className="flex flex-col hover:bg-gray-50 h-full rounded justify-between"  >
//           <div className="bg-slate-600 text-white rounded m-3">{branch.number}</div>
//           <div>{branch.name}</div>
//           <div className=" w-full flex font-mono flex-1 justify-center items-center">
//             <div className="flex gap-3 w-full justify-center ">
//               {associates.in.length > 0 && <div className="bg-green-500 hover:bg-green-600 rounded-t-full rounded-b-none p-1 text-white aspect-square">
//                 {associates.in.length}
//               </div>}
//               {associates.meal.length > 0 && <div className="bg-yellow-500 hover:bg-yellow-600 rounded-t-full rounded-b-none  p-1 text-white aspect-square">
//                 {associates.meal.length}
//               </div>}
//               {associates.out.length > 0 && <div className="bg-gray-500 hover:bg-gray-600  rounded-t-full rounded-b-none  p-1 text-white aspect-square">
//                 {associates.out.length}
//               </div>}
//             </div>
//           </div>

//         </div>
//       </Card>
//     )
//   }
//   else return <div />
// }

// // function useBranchWidget(branch: Branch.Widget) {

// //   return { ...branch }
// // }

// export default BranchesView