<script lang="ts">
	import 'iconify-icon';

	let { children, data } = $props();
</script>

<div class="wrapper pt-5">
	{@render children?.()}
</div>
