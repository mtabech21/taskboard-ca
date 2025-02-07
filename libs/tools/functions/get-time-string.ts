export function getTimeString(date: Date) {

  const hours = date.getHours()
  const minutes = date.getMinutes()

  const hh = hours > 12 ? hours - 12 : hours
  const mm = hours > 0 ? minutes < 10 ? '0' + minutes : minutes : minutes
  const ap = hours > 12 ? 'PM' : 'AM'

  return `${hh}:${mm} ${ap}`
}