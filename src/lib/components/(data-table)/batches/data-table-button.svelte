<script lang="ts">
	import type { ComponentProps } from 'svelte';
	// import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils';

	let {
		variant = 'ghost',
		text,
		...restProps
	}: ComponentProps<typeof Button> & { text: string } = $props();
</script>

<Button {variant} {...restProps}>
	{text}
	<iconify-icon icon="lucide:arrow-up-down" class="ml-2 size-4"></iconify-icon>
</Button>
