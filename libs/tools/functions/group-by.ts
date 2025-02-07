import { UUID } from "crypto";

export function groupBy<T>(array: T[], key: keyof T): Record<(string | UUID), T[]> {
  return array.reduce((result, currentValue) => {
    const groupKey = currentValue[key] as unknown as string | UUID;
    if (!result[groupKey]) { result[groupKey] = []; }
    result[groupKey].push(currentValue);
    return result;
  }, {} as Record<string | UUID, T[]>)
}