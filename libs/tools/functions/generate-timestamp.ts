export function getTimestamp(s: string, date: string) {
  const ampm = s.slice(s.length - 2, s.length);
  const minutes = Number(s.slice(s.length - 4, s.length - 2));
  let hours = Number(s.slice(0, s.length - 4));
  switch (ampm) {
    case 'AM': if (hours === 12) hours = 0; break;
    case 'PM': if (hours < 12) hours += 12; break;
  }
  const new_date = new Date(Number(date.split('-')[0]),Number(date.split('-')[1]) - 1,Number(date.split('-')[2]));
  new_date.setHours(hours); new_date.setMinutes(minutes)

  return new_date;
}