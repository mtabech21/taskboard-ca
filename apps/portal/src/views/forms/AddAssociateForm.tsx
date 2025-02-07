import { useEffect, useMemo, useState } from "react";
import { Form, FormDescription } from "@shad/form";
import { Card, CardDescription, CardTitle } from "@shad/card";
import { Button } from "@shad/button";
import { ExpirySinInput } from "./inputs/ExpirySinInput";
import { BankInput } from "./fields/BankField";
import { FullNameField } from "./fields/FullNameField";
import { useNewAssociateForm } from "../../hooks/forms/useNewAssociateForm";
import { Popover, PopoverContent, PopoverTrigger } from "@shad/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@shad/command";
import { SINField } from "./fields/SinField";
import { PhoneField } from "./fields/PhoneField";
import { EmailField } from "./fields/EmailField";
import { AddressField } from "./fields/AddressField";
import { MoneyField } from "./fields/MoneyField";
import { BadgeField } from "./fields/BadgeField";
import { BranchSelectField } from "./fields/BranchSelectField";
import { PositionSelectField } from "./fields/PositionSelectField";
import { ProvinceSelectField } from "./fields/ProvinceSelectField";
import { EmploymentTypeField } from "./fields/EmploymentTypeField";

import { Checkbox } from "@shad/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Branch } from "@taskboard/types";
import { cn } from "@taskboard/client/ui/src/utils";
import { useManagerAccount } from "@taskboard/client/hooks/accounts/use-manager";

export function AddAssociateForm() {
  const account = useManagerAccount.context()
  const [confirmed, setConfirmed] = useState<CheckedState>(false)
  const form = useNewAssociateForm(account);
  const sin = form.watch().sin

  return (
    <div className="w-full justify-center flex max-h-full select-none overflow-scroll scrollbar-hide">
      <div className="w-fit flex flex-col gap-6 p-6">
        <CardTitle >New Associate</CardTitle>
        <CardDescription >
          Fill out this form to add a new associate to the company.
        </CardDescription>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(form.handler)} className="flex flex-col gap-5 text-left">
              {/* PERSONAL */}
              <Card className="p-5 flex flex-col gap-5 bg-gray-50">
                <div className="font-bold text-lg">Personal</div>
                <FullNameField left={{ control: form.control, name: 'first_name' }} right={{ control: form.control, name: 'last_name' }} />
                <EmailField control={form.control} name="email" />
                <PhoneField control={form.control} name="phone" />
                <AddressField control={form.control} name="address" />
                <Card className="p-5 gap-5 flex flex-col bg-gray-100">
                  <div className="flex flex-col gap-2">
                    <SINField control={form.control} name="sin" />
                    {sin && sin[0] === '9' && <ExpirySinInput control={form.control} name="sin_expiry" />}
                  </div>
                  <BankInput control={form.control} name="bank" institution="bank.institution" account="bank.account" transit="bank.transit" />
                </Card>
                <div>
                  <FormDescription className="whitespace-normal">Please confirm all the information is correct. </FormDescription>
                  <FormDescription className="whitespace-normal font-bold">This data will be used for <span className="underline">all legal documents</span> related to this associate.</FormDescription>
                </div>
              </Card>
              {/* EMPLOYMENT */}
              <Card className="p-5 flex flex-col gap-5 bg-gray-50">
                <div className="font-bold text-lg">Employment</div>
                <div className="flex gap-5">
                  <BranchSelectField control={form.control} name="branch_id" branches={account.branches} />
                  <PositionSelectField control={form.control} name="position_id" />
                </div>
                <div>
                  <BadgeField control={form.control} name="badge_number" available={form.badge_available} />
                </div>
                <Card className="p-5 flex flex-col gap-5 bg-gray-100">
                  <div className="font-bold text-lg">Pay Data</div>
                  <div className="flex flex-col gap-3">
                    <ProvinceSelectField control={form.control} name="employment.province_code" mismatch={form.province_mismatch} />
                    <EmploymentTypeField control={form.control} name="employment.employment_type" />
                    <MoneyField control={form.control} name="employment.pay_daya.salary_rate" />
                  </div>
                </Card>
              </Card>
              <Card className="p-5 flex gap-5 bg-gray-50 items-center text-sm font-bold">
                <div className="flex gap-2 items-center" >
                  <Checkbox checked={confirmed} onCheckedChange={(a) => setConfirmed(a)} disabled={!form.formState.isValid} />
                  <div>
                    I confirm that the information provided is accurate.
                  </div>
                </div>
              </Card>
              <Button disabled={!confirmed} className="m-5">Create Associate</Button>
            </form>
          </Form>
        </div>
      </div >
    </div >
  );
}

export function BranchSelector(props: { branches: Branch[], set_value?: (branch?: Branch) => void }) {
  const [open, setOpen] = useState(false)
  const [selected_id, set_selected_id] = useState('')
  const branches = props.branches
  const selected_branch = useMemo(() => { return branches.find((branch) => branch.id === selected_id) }, [selected_id, branches])

  useEffect(() => { props.set_value && props.set_value(selected_branch) }, [selected_branch, props])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selected_id
            ? <div>{selected_branch?.number}</div>
            : "Select branch..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search branch..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {branches.map((branch, _, a) => (
              <CommandItem
                key={branch.id}
                value={`${branch.number} ${branch.name}`}
                onSelect={(curr) => {
                  const b_id = a.find(b => `${b.number} ${b.name}`.toLowerCase() === curr.toLowerCase())?.id ?? ''
                  set_selected_id(pr => b_id === pr ? "" : b_id)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected_id === branch.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {branch.number}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}