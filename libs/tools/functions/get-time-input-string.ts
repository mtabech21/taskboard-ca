export function getTimeInputString(timestamp: string): string {
  if (timestamp == undefined) return '';
  const time = new Date(Date.parse(timestamp));

  let hours = time.getHours();
  const minutes = time.getMinutes();
  let ampm = 'AM';
  if (hours == 12) { ampm = 'PM' }
  if (hours > 12) { hours -= 12; ampm = 'PM' }
  return '' + hours + (minutes < 10 ? '0' + minutes : minutes) + ampm;
}