import { UUID } from "crypto"
import { AssociateBadge } from "../payroll/associate"

export type Task = {
  id: string
  title: string
  body: string
  created_at: Date
  created_by: AssociateBadge
  due_date: Date
  branch_id?: UUID,
  associate_id?: UUID
  completed_at?: Date
  viewed_at?: Date
}

export enum TaskStatus {
  new, seen, completed, overdue, dueSoon, important
}

export type TaskFilterOption = 'incompleted' | 'late' | 'completed' | 'all'