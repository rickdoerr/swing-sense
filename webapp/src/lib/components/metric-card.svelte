<script lang="ts">
	let {
		label = "",
		value = null,
		unit = "°",
	}: {
		label: string;
		value: number | null;
		unit?: string;
	} = $props();
</script>

<div
	class="bg-theme-surface border border-theme-border rounded-xl p-4 min-w-[140px] flex flex-col gap-3 transition-all duration-200 shadow-md hover:border-theme-accent hover:shadow-lg"
>
	<div class="flex justify-between items-center">
		<h4
			class="text-xs font-semibold uppercase tracking-wider text-theme-text-secondary m-0"
		>
			{label}
		</h4>
	</div>

	<div class="flex items-baseline gap-1">
		{#if value !== null}
			<span class="text-[2rem] font-bold text-theme-accent leading-none"
				>{value}</span
			>
			<span class="text-base text-theme-text-secondary">{unit}</span>
		{:else}
			<span
				class="text-[2rem] font-bold text-theme-text-secondary leading-none"
				>--</span
			>
		{/if}
	</div>
</div>
