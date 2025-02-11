import { Database } from "../database";
import { Partialize } from "../generics";



export type Punch = Database.Payroll.Punch
export type NewPunch = Partialize<Omit<Punch,'id'>,'timestamp' | 'approved' >