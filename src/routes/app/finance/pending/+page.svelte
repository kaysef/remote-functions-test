<!-- <script lang="ts" generics="TData">
	import * as Card from '$lib/components/ui/card';
	import 'iconify-icon';

	import DataTable from '$lib/components/(data-table)/data-table.svelte';
	import { columns } from '$lib/components/(data-table)/columns/pending-tab';

	import { type Table } from '@tanstack/table-core';
	import { getFilterDates } from '$lib/utils';
	import TableLoadingSpinner from '$lib/components/tableLoadingSPinner.svelte';
	import { getData } from '../data.remote.js';

	let { data } = $props();

	let tableRef: Table<TData> = $state(null);

	let totalAmount = $derived.by(() => {
		// let sum = 0;
		if (tableRef) {
			return tableRef
				.getCoreRowModel()
				.rows.reduce(
					(accumulator, currentValue) => accumulator + currentValue.getValue('amount'),
					0
				);
		}
		return 0;
	});

	let filterDates = $derived(getFilterDates(data.filters.dateRange, data.filters.startValue));

	let tableData = $derived(
		getData({
			startDate: filterDates.start,
			endDate: filterDates.end,
			activeBatchId: data.filters.activeBatchId
		})
	);
</script>

<section class="animate-in fade-in-0 slide-in-from-right-2 relative">
	<a href="/" class="absolute -top-16 rounded-full bg-red-500 px-4 py-2 text-white">Go back home</a>
	<Card.Root class="p-4">
		<Card.Content>
			<svelte:boundary>
				{#snippet pending()}
					<TableLoadingSpinner />
				{/snippet}
				<DataTable
					bind:tableRef
					data={(await tableData).data}
					{columns}
					filter_column="donor_name"
					filter_placeholder="Filter Donors ..."
				/>
			</svelte:boundary>
		</Card.Content>
	</Card.Root>
</section> -->

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import 'iconify-icon';

	import { columns } from '$lib/components/(data-table)/columns/pending-tab';
	import DataTable from '$lib/components/(data-table)/data-table.svelte';

	import TableLoadingSpinner from '$lib/components/tableLoadingSPinner.svelte';
	import { cad, getFilterDates } from '$lib/utils';
	import type { Row, Table } from '@tanstack/table-core';
	import { getData, type Donation } from '../data.remote.js';
	let { data } = $props();

	let tableRef: Table<Donation> | undefined = $state(null);
	let visibleRows: Row<Donation>[] = $state([]); // new: will hold currently visible rows
	let totalRows: Row<Donation>[] = $state([]); // new: will hold currently visible rows

	let filterDates = $derived(getFilterDates(data.filters.dateRange, data.filters.startValue));

	let tableData = $derived(
		getData({
			// TODO: Is undefined really needed? (`start: string | undefined`)
			startDate: filterDates.start, // Type 'string | undefined' is not assignable to type 'string'. Type 'undefined' is not assignable to type 'string'.ts(2322)
			endDate: filterDates.end,
			activeBatchId: data.filters.activeBatchId
		})
	);

	// Keep visibleRows in sync whenever tableRef state changes
	$effect(() => {
		if (!tableRef) return;
		// Update immediately
		visibleRows = tableRef.getRowModel().rows;
		totalRows = tableRef.getCoreRowModel().rows;
		// Wrap existing onStateChange to react to changes
		// const prev = tableRef.options.onStateChange;
		tableRef.setOptions((opts) => ({
			...opts,
			onStateChange: (updater) => {
				// If the previous handler exists, call it first
				opts.onStateChange?.(updater);

				// Only access getRowModel if tableRef and getRowModel are defined
				// This avoids runtime errors
				if (tableRef && typeof tableRef.getRowModel === 'function') {
					visibleRows = tableRef.getRowModel().rows ?? [];
					totalRows = tableRef.getCoreRowModel().rows;
				} else {
					visibleRows = []; // fallback: set as empty array
					totalRows = [];
				}
			}
		}));
	});

	// Reactive total for *currently visible rows*
	let totalAmount = $derived.by(() =>
		visibleRows.reduce((acc, r) => acc + (r.getValue('amount') as number), 0)
	);
	let allAmount = $derived.by(() =>
		totalRows.reduce((acc, r) => acc + (r.getValue('amount') as number), 0)
	);

	// TODO: Could lift this in to a global error handler for reporting and stuff?
	// TODO: If so, I'd type a generic error type definitiont that'd be used throughout the app for `e: unknown`.
	// const report = (e: unknown) => {
	// 	console.error(e);
	// };

	// Generic error shape with optional message and stack
	interface GenericError {
		name?: string;
		message?: string;
		stack?: string;
		[key: string]: unknown; // other custom fields
	}

	// Type guard to check if value is likely an Error-like object
	function isGenericError(e: unknown): e is GenericError {
		return (
			typeof e === 'object' &&
			e !== null &&
			'message' in e &&
			typeof (e as any).message === 'string'
		);
	}

	// Your report function using this type
	const report = (e: unknown) => {
		if (isGenericError(e)) {
			// safe access
			console.error(`Error: ${e.message}`, e.stack ?? '');
		} else {
			// fallback for unknown shapes
			console.error('Unknown error:', e);
		}
	};
</script>

<section class="animate-in fade-in-0 slide-in-from-right-2 relative">
	<a href="/" class="absolute -top-16 rounded-full bg-red-500 px-4 py-2 text-white">Go back home</a>
	<Card.Root class="p-4">
		<Card.Header>
			<!-- Display the live-updating total -->
			<div class="text-muted-foreground mt-4 text-sm">
				Total: {cad.format(totalAmount)}
			</div>
			<div class="text-muted-foreground mt-4 text-sm">
				Total: {cad.format(allAmount)}
			</div>
		</Card.Header>
		<Card.Content>
			<svelte:boundary onerror={(e) => report(e)}>
				{#snippet pending()}
					<TableLoadingSpinner />
				{/snippet}
				{#snippet failed(error, reset)}
					<p class="text-red-600">
						Failed to load data: {error instanceof Error ? error.message : 'Unknown error'}
					</p>
					<!-- Could do something like this: -->
					<button onclick={reset}>Try again..</button>
				{/snippet}
				<DataTable
					bind:tableRef
					data={(await tableData).data}
					{columns}
					filter_column="donor_name"
					filter_placeholder="Filter Donors ..."
				/>
			</svelte:boundary>
		</Card.Content>
	</Card.Root>
</section>
