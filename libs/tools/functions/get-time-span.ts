export function getTimeSpan(from: Date, to: Date): string {
  const latest = new Date(from);
  const now = new Date(to);


  const timeSpan = new Date(now.valueOf() - latest.valueOf());
  timeSpan.setHours(timeSpan.getHours() + 5);
  const hours = timeSpan.getHours();
  const minutes = timeSpan.getMinutes();

  const h = hours > 0 ? hours + ':' : '0:';
  const m = minutes < 10 ? '0' + minutes : minutes;
  return `${h}${m}`;
}