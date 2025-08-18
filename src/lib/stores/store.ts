import { getLocalTimeZone, today } from '@internationalized/date';
import { endOfMonth, startOfMonth } from 'date-fns';
import { writable } from 'svelte/store';

export const modal_class = writable('modal is-open');
export const theme_ = writable('light');
export const fillNav = writable(true);


export const dateTimeOptions: { locale: string; options: Intl.DateTimeFormatOptions, timeOnlyOptions: Intl.DateTimeFormatOptions, dateOnlyOptions: Intl.DateTimeFormatOptions } = {
  locale: 'en-US',
  options: {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
    timeZone: getLocalTimeZone()
  },
  timeOnlyOptions: {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  },
  dateOnlyOptions: {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
}
export const defaultDates: { start: string, end: string } = {
  start: startOfMonth(today(getLocalTimeZone()).toDate(getLocalTimeZone())).toISOString(),
  end: endOfMonth(today(getLocalTimeZone()).toDate(getLocalTimeZone())).toISOString()
}







