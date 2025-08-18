<script lang="ts" generics="TData">
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

<section class="animate-in fade-in-0 slide-in-from-right-2">
	<a href="/" class="absolute top-12 rounded-full bg-red-500 px-4 py-2 text-white">Go back home</a>
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
</section>
