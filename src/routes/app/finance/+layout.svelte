<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import 'iconify-icon';
	import { DateFormatter } from '@internationalized/date';
	import { cn, displayValueString, getValue, customDates } from '$lib/utils';
	import { RangeCalendar } from '$lib/components/ui/range-calendar';
	import * as Popover from '$lib/components/ui/popover';
	import * as Select from '$lib/components/ui/select';

	import { page } from '$app/state';

	import type { DateRange } from 'bits-ui';

	let { children, data } = $props();

	let value: DateRange | undefined = $derived(data.filters.dateRange);

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	let valueString: string | undefined = $derived(
		displayValueString(data.filters.dateRange, df, data.filters.startValue, false, 'Presets')
	);
</script>

<div class="animate-in fade-in-0 slide-in-from-right-2">
	{#if !(page.url.pathname.includes('batches') || page.url.pathname.includes('donors'))}
		<div class="xs:flex grid grid-cols-[minmax(0,1fr)] px-4">
			<div class="flex-1 space-y-4 p-8 pt-6">
				<div class="grid place-items-center space-y-2 sm:flex sm:justify-end">
					<div
						class="flex flex-wrap items-center gap-4 sm:items-center sm:space-x-2 md:flex-nowrap"
					>
						<div class="grid gap-2">
							<Popover.Root>
								<Popover.Trigger>
									{#snippet child({ props })}
										<Button
											variant="default"
											class={cn(
												'ease w-auto justify-start text-left font-normal transition-transform duration-105 hover:scale-105',
												'bg-card text-card-foreground hover:bg-card/50',
												!data.filters.dateRange && 'text-muted-foreground'
											)}
											{...props}
										>
											<iconify-icon icon="lucide:calendar" class="mr-2 h-4 w-4"></iconify-icon>
											{displayValueString(
												data.filters.dateRange,
												df,
												data.filters.startValue,
												true
											)}
										</Button>
									{/snippet}
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" align="start">
									<Select.Root
										type="single"
										name="presetDate"
										value={valueString}
										onValueChange={(v) => {
											if (!v) return;
											valueString = customDates.find((elem) => elem.value === +v)?.label;
											data.filters.dateRange = getValue(valueString as string);
										}}
									>
										<Select.Trigger class="justify-between border-0 outline-0 focus:ring-0">
											{valueString}
										</Select.Trigger>
										<Select.Content>
											{#each customDates as item (item.value)}
												<Select.Item value={`${item.value}`}>{item.label}</Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
									<RangeCalendar
										onValueChange={(v) => {
											data.filters.multiRun = true;
											data.filters.dateRange = v;
										}}
										onStartValueChange={(v) => {
											data.filters.startValue = v;
										}}
										bind:value
										numberOfMonths={1}
									/>
								</Popover.Content>
							</Popover.Root>
						</div>
						<!-- End date picker -->
					</div>
				</div>
			</div>
		</div>
	{/if}

	<div class="px-8">
		{@render children()}
	</div>
</div>
