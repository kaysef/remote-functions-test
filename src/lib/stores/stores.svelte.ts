
import { setContext, getContext } from 'svelte';
import type { DateRange } from 'bits-ui';
import { getLocalTimeZone, today, type DateValue, startOfWeek, endOfWeek } from '@internationalized/date';

export class financeFilters {
    // set default dateRange to the current week
    dateRange = $state<DateRange | undefined>({
        start: startOfWeek(today(getLocalTimeZone()), 'en-US'),
        end: endOfWeek(today(getLocalTimeZone()), 'en-US')
    });
    startValue: DateValue | undefined = $state(undefined);
    multiRun: boolean = $state(true);
    user: string | undefined = $state();
    user_id: string | undefined = $state();
    activeBatch: string | undefined = $state();
    activeBatchId: string | undefined = $state();
    fund: string | undefined = $state();
    fund_id: string | undefined = $state();
    source: string | undefined = $state();
}

export function setFinanceFilters() {
    const finFilters = new financeFilters()
    setContext('financeFilters', finFilters)
    return finFilters
}

export function getFinanceFilters() {
    return getContext<financeFilters>('financeFilters')
}

// Global state to enable the update of table after quick assignment
let count = $state(0)

export const counter = {
    count() { return count },
    setCount(value: number) { count = value },
    increment() { count++ }
}





