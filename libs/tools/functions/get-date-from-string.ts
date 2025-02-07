export function date_from_string(date_string: string): Date {
  const split = date_string.split('-')
  const y = Number(split[0])
  const m = Number(split[1]) - 1
  const d = Number(split[2])
  return new Date(y, m, d)
}