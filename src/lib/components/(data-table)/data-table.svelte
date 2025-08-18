<script lang="ts" generics="TData, TValue">
	import { Button } from '$lib/components/ui/button';
	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		type ColumnFiltersState,
		type VisibilityState,
		type RowSelectionState,
		type Table as TanstackTableType,
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { toTitleCase } from '$lib/utils';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
		filter_placeholder?: string;
		filter_column?: string;
		row_selection?: boolean;
		pageSize?: number;
		tableRef?: TanstackTableType<TData>;
	};

	let {
		data,
		columns,
		filter_column,
		filter_placeholder,
		pageSize,
		row_selection = true,
		tableRef = $bindable(null)
	}: DataTableProps<TData, TValue> = $props();
	let value: string | undefined = $state();
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: pageSize ?? 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let rowSelection = $state<RowSelectionState>({});

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			}
		},
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel()
	});

	$effect(() => {
		tableRef = table;
	});
</script>

<div>
	{#if filter_column}
		<div class="flex items-center py-4">
			<div class="relative w-full max-w-sm">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<iconify-icon icon="lucide:search" class="text-primary text-lg"></iconify-icon>
				</div>
				<Input
					placeholder={filter_placeholder}
					value={(table.getColumn(filter_column)?.getFilterValue() as string) ?? ''}
					onchange={(e) => {
						table.getColumn(filter_column)?.setFilterValue(e.currentTarget.value);
					}}
					oninput={(e) => {
						table.getColumn(filter_column)?.setFilterValue(e.currentTarget.value);
					}}
					class="w-full max-w-sm py-2 pr-4 pl-10"
				/>
			</div>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" class="ml-auto">Columns</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					{#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
						<DropdownMenu.CheckboxItem
							class="capitalize"
							bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
						>
							{toTitleCase(column.id.split('_').join(' '))}
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	{/if}
	<div class="rounded-md">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row data-state={row.getIsSelected() && 'selected'}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<!-- Footer with Pagination -->
	{#if table.getPageCount() > 0}
		<div class="flex items-center justify-between gap-4 space-x-2 py-4">
			{#if !row_selection}
				<div class="text-muted-foreground flex-1 text-sm">
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
			{/if}

			<div class="text-muted-foreground flex items-center space-x-2 text-sm">
				<p class="text-sm font-medium">Rows per page</p>
				<Select.Root
					bind:value
					type="single"
					onValueChange={() => table.setPageSize(Number(value))}
				>
					<Select.Trigger class="text-muted-foreground h-8 w-[70px] text-sm">
						{pagination.pageSize ?? 'Select page size'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="10">10</Select.Item>
						<Select.Item value="20">20</Select.Item>
						<Select.Item value="30">30</Select.Item>
						<Select.Item value="40">40</Select.Item>
						<Select.Item value="50">50</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>

			<div class="text-muted-foreground text-sm">
				{#if table.getPageCount() > 0}
					Page {pagination.pageIndex + 1} of {table.getPageCount()}
				{/if}
			</div>
			<div>
				<Button
					variant="outline"
					size="icon"
					onclick={() => table.firstPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<iconify-icon icon="lucide:chevrons-left"></iconify-icon>
				</Button>
				<Button
					variant="outline"
					size="icon"
					onclick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<iconify-icon icon="lucide:chevron-left"></iconify-icon>
				</Button>
				<Button
					variant="outline"
					size="icon"
					onclick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<iconify-icon icon="lucide:chevron-right"></iconify-icon>
				</Button>
				<Button
					variant="outline"
					size="icon"
					onclick={() => table.lastPage()}
					disabled={!table.getCanNextPage()}
				>
					<iconify-icon icon="lucide:chevrons-right"></iconify-icon>
				</Button>
			</div>
		</div>
	{/if}
</div>
