<script lang="ts">
    import type { PoseAnalyst } from "$lib/processors/pose-analyst.svelte";

    let { analyst } = $props<{ analyst: PoseAnalyst }>();
</script>

<div class="grid grid-cols-3 gap-2 mt-4">
    <!-- Render Downswing Sequence -->
    {#each analyst.downswingImages as image, i}
        <div
            class="bg-theme-surface border border-theme-border rounded-xl p-2 flex flex-col gap-2 shadow-md relative"
        >
            <h4
                class="text-[10px] font-semibold uppercase tracking-wider text-theme-text-secondary m-0"
            >
                {#if i === analyst.downswingImages.length - 1}
                    Impact
                {:else}
                    Mid-Downswing {i + 1}
                {/if}
            </h4>
            <div
                class="relative aspect-[3/4] w-full rounded-lg bg-black/5 overflow-hidden border border-theme-border flex items-center justify-center bg-theme-surface-subtle"
            >
                {#if image}
                    <img
                        src={image}
                        alt="Swing Frame"
                        class="w-full h-full object-cover"
                    />
                {:else}
                    <span class="text-xs text-theme-text-secondary">--</span>
                {/if}
            </div>
        </div>
    {/each}
</div>

{#if analyst.agentResponses["ImpactAnalysisAgent"]}
    <div
        class="mt-3 bg-theme-surface border border-theme-border rounded-xl p-3 shadow-sm"
    >
        <h4
            class="text-[10px] font-bold uppercase tracking-wider text-theme-text-secondary m-0 mb-1"
        >
            Impact Analysis
        </h4>
        <p class="text-xs text-theme-text-primary leading-relaxed">
            {analyst.agentResponses["ImpactAnalysisAgent"]}
        </p>
    </div>
{/if}

{#if analyst.downswingImages.length === 0}
    <div
        class="mt-4 p-4 text-center text-xs text-theme-text-secondary border border-theme-border border-dashed rounded-xl"
    >
        Waiting for analysis...
    </div>
{/if}
