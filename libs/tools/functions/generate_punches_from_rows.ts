import { NewPunch, TimecardRow } from "@taskboard/types";
import { UUID } from "crypto";

export function generatePunches(associate_id: UUID,rows: TimecardRow[]){
  return rows.reduceRight<NewPunch[]>((curr, prev) => {
    const punch_in = prev.in && { associate_id, type: prev.in.type, branch_id: prev.in.branch_id, timestamp: prev.in.timestamp } as NewPunch
    const punch_out = prev.out && {associate_id, type: prev.out.type, branch_id: prev.out.branch_id, timestamp: prev.out.timestamp } as NewPunch
    punch_in && curr.push(punch_in)
    punch_out && curr.push(punch_out)
    return curr
  }, [])
}