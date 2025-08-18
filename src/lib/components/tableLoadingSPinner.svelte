<script lang="ts">
	let { tableColumns }: { tableColumns?: string[] } = $props();
</script>

<table class="w-full border-collapse">
	{#if tableColumns}
		<thead>
			<tr>
				{#each tableColumns as column}
					<th class="p-4 text-left font-semibold uppercase">{column}</th>
				{/each}
			</tr>
		</thead>
	{/if}
	<tbody>
		<!-- 10 rows -->
		{#each Array(10) as _, i}
			<tr>
				{#each Array(5) as __}
					<td class="p-4">
						<div class="h-4 animate-pulse rounded-md bg-gray-300"></div>
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
