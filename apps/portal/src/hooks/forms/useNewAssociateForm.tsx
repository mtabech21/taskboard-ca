import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosResponse } from "axios";

import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Branch, ManagerAccount, NewAssociateForm } from "@taskboard/types";
import { useAPI } from "@taskboard/client/hooks/global/use-api";
import { toast } from "@taskboard/client/ui/src/hooks/use-toast";






export function useNewAssociateForm(account: ManagerAccount) {

  const nav = useNavigate()

  const AssociateFormSchema = z.object({
    first_name: z.string().min(3).regex(RegExp('[a-zA-Z]')),
    last_name: z.string().min(3).regex(RegExp('[a-zA-Z]')),
    email: z.string().email().min(5),
    phone: z.string().length(10, 'Enter a full phone number'),
    address: z.object({
      place_id_google: z.string(),
      formatted: z.string()
    }),
    sin: z.string().length(9, 'SIN must have 9 digits').optional(),
    sin_expiry: z.date().optional(),
    badge_number: z.string().min(5).max(6),
    position_id: z.string().uuid(),
    branch_id: z.string().uuid(),
    bank: z.object({
      transit: z.string().length(5, '5 digits').optional(),
      institution: z.string().length(3, '3 digits').optional(),
      account: z.string().min(7, '7 or 12 digits').max(12, '7 or 12 digits').optional()
    }).optional(),
    employment: z.object({
      employment_type: z.string(),
      province_code: z.string(),
      pay_daya: z.object({
        salary_rate: z.string().min(3),
        salary_structure: z.string().min(1)
      }),
      position_id: z.string()
    })
  })
    .superRefine(({ sin }, ctx) => {
      if (sin) {
        const check_sum_string = [...'121212121']
        const digits = [...sin]
        const result = digits.map((d, i) => {
          const mult = Number(d) * Number(check_sum_string[i])
          if (mult < 10) return mult
          else { return Number(String(mult)[0]) + Number(String(mult)[1]) }
        })
        let sum = 0
        result.forEach(n => sum += n)
        const is_valid = sum % 10 === 0
        if (!is_valid) ctx.addIssue({
          code: 'custom',
          message: 'Invalid SIN Number'
        })
      }
    });
  const form = useForm<z.infer<typeof AssociateFormSchema>>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      position_id: '',
      branch_id: '',
      badge_number: '',
      sin: '',
      sin_expiry: undefined,
      bank: {
        account: '',
        institution: '001',
        transit: ''
      },
      address: undefined,
      employment: {
        employment_type: 'full_time',
        position_id: '',
        province_code: 'QC',
        pay_daya: {
          salary_rate: '',
          salary_structure: 'hourly'
        },
      }
    },
    resolver: zodResolver(AssociateFormSchema)
  });

  const selected_province_code = form.watch('employment.province_code')
  useEffect(() => {
    switch (selected_province_code) {
      case 'NB': form.setValue('employment.pay_daya.salary_rate', '1530'); break;
      case 'NF': form.setValue('employment.pay_daya.salary_rate', '1560'); break;
      case 'ON': form.setValue('employment.pay_daya.salary_rate', '1655'); break;
      case 'PE': form.setValue('employment.pay_daya.salary_rate', '1540'); break;
      case 'QC': form.setValue('employment.pay_daya.salary_rate', '1525'); break;
      case 'NS': form.setValue('employment.pay_daya.salary_rate', '1520'); break;
    }
  }, [selected_province_code, form])
  const address_province_code = form.watch('address.formatted')?.split(',')[2].split(' ')[1]
  useEffect(() => form.setValue('employment.province_code', address_province_code), [form, address_province_code])
  const province_mismatch = useMemo(() => address_province_code !== undefined && address_province_code !== selected_province_code, [address_province_code, selected_province_code])


  const selected_branch_id = form.watch('branch_id')
  const badge_number = form.watch('badge_number')
  const [taken_badge_numbers, set_taken_badge_numbers] = useState<string[]>()
  const generate_badge_number = useCallback((branch?: Branch): string => {
    if (taken_badge_numbers) {
      if (branch) {
        const prefix = branch.number.slice(branch.number.length - 2, branch.number.length)
        const gen = () => Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        if (!isNaN(Number(prefix))) {
          let badgenum = prefix + gen()
          while (taken_badge_numbers.includes(badgenum)) { badgenum = prefix + gen() }
          return badgenum
        } else {
          const prefix = '10'
          let badgenum = prefix + gen()
          while (taken_badge_numbers.includes(badgenum)) {
            badgenum = prefix + gen()
          }
          return badgenum
        }
      } else { return '' }
    } return ''
  }, [taken_badge_numbers])
  useEffect(() => { form.setValue('badge_number', generate_badge_number(account.branches.find(b => b.id === selected_branch_id)), { shouldValidate: false }) }, [form, generate_badge_number, account.branches, selected_branch_id])
  const badge_available = useMemo(() => !taken_badge_numbers?.includes(badge_number), [badge_number, taken_badge_numbers])

  const api = useAPI.context()

  useEffect(() => { api.get(`/company/badge_list/${account.company.id}`).then((r) => { set_taken_badge_numbers(r.data.badge_numbers) }) }, [account.company.id, api])

  async function handler(): Promise<void> {
    const values = form.getValues() as NewAssociateForm;
    const res = await api.post<NewAssociateForm, AxiosResponse<NewAssociateForm>>('/payroll/associates/new', values);
    nav(`/associates/profiles?badge_number=${res.data.badge_number}`)
    toast(
      <>
        <div>Associate has been added</div>
        {/* <div>{String(res.data)}</div> */}
      </>
    );

  }

  return { ...form, handler, badge_available, province_mismatch };

}