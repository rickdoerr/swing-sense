<script lang="ts">
    import { fade } from "svelte/transition";
    import type { PoseAnalyst } from "$lib/processors/pose-analyst.svelte";
    import RotationDial from "./rotation-dial.svelte";

    let { analyst } = $props<{ analyst: PoseAnalyst }>();
</script>

<div class="space-y-4">
    <div class="grid grid-cols-3 gap-2" transition:fade>
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
                        <span class="text-xs text-theme-text-secondary">--</span
                        >
                    {/if}
                </div>
            </div>
        {/each}
    </div>

    <div
        class="bg-theme-surface border border-theme-border rounded-xl p-3 shadow-sm min-h-[60px]"
        transition:fade
    >
        <h4
            class="text-[10px] font-bold uppercase tracking-wider text-theme-text-secondary m-0 mb-1"
        >
            Impact Analysis
        </h4>
        {#if analyst.agentResponses["ImpactAnalysisAgent"]}
            <p class="text-xs text-theme-text-primary leading-relaxed">
                {analyst.agentResponses["ImpactAnalysisAgent"]}
            </p>
        {:else}
            <div
                class="flex items-center gap-2 py-2 text-xs text-theme-text-secondary animate-pulse"
            >
                <div class="w-1.5 h-1.5 rounded-full bg-theme-accent/50"></div>
                <span>Analyzing impact dynamics...</span>
            </div>
        {/if}
    </div>
</div>
