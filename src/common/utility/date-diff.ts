import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';

dayjs.extend(durationPlugin);

export function getDateDayDiff(date1: Date, date2: Date = new Date()): number {
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);

  return (date1.getTime() - date2.getTime()) / 86400000;
}

export function getDateDuration(date1: Date, date2: Date = new Date()): durationPlugin.Duration {
  const diff = date1.getTime() - date2.getTime();

  const durationV = dayjs.duration(diff, 'milliseconds');

  return durationV;
}
