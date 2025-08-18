<script lang="ts">
	import '../app.css';

	import { Skeleton } from '$lib/components/ui/skeleton';

	let { children } = $props();
</script>

<div>
	<svelte:boundary>
		{#snippet pending()}
			<span
				class="grid h-screen w-full place-content-center items-center justify-center space-x-4 place-self-center overflow-clip"
			>
				<Skeleton class="rounded-full" />
				<span class="space-y-2">
					<Skeleton class="h-4 w-[250px]" />
					<Skeleton class="h-4 w-[250px]" />
				</span>
			</span>
		{/snippet}
		{@render children()}
	</svelte:boundary>
</div>
