// shadcn-svelte utils
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { DateRange } from 'bits-ui';
import {
	endOfMonth,
	endOfYear,
	getLocalTimeZone,
	parseAbsoluteToLocal,
	startOfMonth,
	startOfYear,
	today,
	type DateFormatter,
	type DateValue
} from '@internationalized/date';
import { endOfQuarter, startOfQuarter } from 'date-fns';
import { dateTimeOptions } from '$lib/stores/store';
import { startOfDay, endOfDay } from 'date-fns';


export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

// Custom utils


// Currency
export const cad = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' });

export const roundToX = (num = 0, decimals = 2) =>
	Math.round(num * 10 ** decimals) / 10 ** decimals;

export function getRandomInt(min: number, max: number) {
	// min inclusive, max exclusive
	return Math.floor(Math.random() * (max - min) + min);
}

export function toTitleCase(text: string) {
	return text
		.toLowerCase()
		.replace(/(?<![^\s\p{Pd}])[^\s\p{Pd}]/gu, (match) => match.toUpperCase());
}

export function getFirstLetters(sentence: string) {
	return sentence
		.split(' ') // Split the sentence into words
		.map((word) => word.charAt(0)) // Get the first character of each word
		.join(''); // Join the first letters into a string
}



// datetime helpers
export const customDates = [
	{ value: 0, label: 'This Month' },
	{ value: 1, label: 'Last Month' },
	{ value: 2, label: 'This Quarter' },
	{ value: 3, label: 'Last Quarter' },
	{ value: 4, label: 'This Year' },
	{ value: 5, label: 'Last Year' }
];

export function displayValueString(
	value: DateRange | undefined,
	df: DateFormatter,
	startValue: DateValue | undefined,
	showLabel: boolean = false,
	text: string = 'Pick a Date'
) {
	const day = customDatesArray.find(
		(item) => item.start === value?.start && item.end === value?.end
	);
	if (day && showLabel) {
		return day.label;
	} else if (value && value.start) {
		if (value.end) {
			return `${df.format(value.start.toDate(getLocalTimeZone()))} - ${df.format(value.end.toDate(getLocalTimeZone()))}`;
		} else {
			return `${df.format(value.start.toDate(getLocalTimeZone()))}`;
		}
	} else if (startValue) {
		return `${df.format(startValue.toDate(getLocalTimeZone()))}`;
	} else {
		return text;
	}
}

export function getValue(valueString: string) {
	const day = customDatesArray.find((item) => item.label === valueString);
	if (day) {
		return {
			start: day.start,
			end: day.end
		};
	}
}

export const customDatesArray = [
	{
		start: startOfMonth(today(getLocalTimeZone())),
		end: endOfMonth(today(getLocalTimeZone())),
		label: 'This Month'
	},
	{
		start: startOfMonth(today(getLocalTimeZone()).subtract({ months: 1 })),
		end: endOfMonth(today(getLocalTimeZone()).subtract({ months: 1 })),
		label: 'Last Month'
	},
	{
		start: startOfYear(today(getLocalTimeZone()).subtract({ years: 1 })),
		end: endOfYear(today(getLocalTimeZone()).subtract({ years: 1 })),
		label: 'Last Year'
	},
	{
		start: startOfYear(today(getLocalTimeZone())),
		end: endOfYear(today(getLocalTimeZone())),
		label: 'This Year'
	},
	{
		start: parseAbsoluteToLocal(startOfQuarter(today(getLocalTimeZone()).toString()).toISOString()),
		end: parseAbsoluteToLocal(endOfQuarter(today(getLocalTimeZone()).toString()).toISOString()),
		label: 'This Quarter'
	},
	{
		start: parseAbsoluteToLocal(
			startOfQuarter(today(getLocalTimeZone()).subtract({ months: 3 }).toString()).toISOString()
		),
		end: parseAbsoluteToLocal(
			endOfQuarter(today(getLocalTimeZone()).subtract({ months: 3 }).toString()).toISOString()
		),
		label: 'Last Quarter'
	}
];





export function getFilterDates(
	dateRange: DateRange | undefined,
	startValue: DateValue | undefined
) {
	const dateToUse: { start: string | undefined; end: string | undefined } = {
		start: undefined,
		end: undefined
	};
	if (dateRange && dateRange.end) {
		((dateToUse.start = startOfDay(dateRange.start!.toDate(getLocalTimeZone())).toISOString()),
			(dateToUse.end = endOfDay(dateRange.end!.toDate(getLocalTimeZone())).toISOString()));
	} else if (startValue) {
		dateToUse.start = startOfDay(startValue!.toDate(getLocalTimeZone())).toISOString();
		dateToUse.end = endOfDay(startValue!.toDate(getLocalTimeZone())).toISOString();
	}
	return dateToUse;
}

export const dateFormatter = new Intl.DateTimeFormat('en-US', dateTimeOptions.dateOnlyOptions);
export const timeFormatter = new Intl.DateTimeFormat('en-US', dateTimeOptions.timeOnlyOptions);

