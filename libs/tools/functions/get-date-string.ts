export function getLocalDateString(date: Date): string {
  const d = new Date(date)
  const year = String(d.getFullYear())
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}