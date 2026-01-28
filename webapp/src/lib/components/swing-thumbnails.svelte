<script lang="ts">
    import { fade } from "svelte/transition";
    import type { PoseAnalyst } from "$lib/processors/pose-analyst.svelte";
    import RotationDial from "./rotation-dial.svelte";

    let { analyst } = $props<{ analyst: PoseAnalyst }>();

    function isLoading() {
        return !analyst.agentResponses["ImpactAnalysisAgent"];
    }
</script>

<div class="space-y-4">
    {#if isLoading()}
        <div
            class="w-full py-12 border border-theme-border border-dashed rounded-xl bg-theme-surface-subtle flex flex-col items-center justify-center gap-4"
            transition:fade
        >
            <div class="w-12 h-12">
                <RotationDial variant="loading" />
            </div>
            <span class="text-xs text-theme-text-secondary animate-pulse"
                >Analyzing Swing Mechanics...</span
            >
        </div>
    {:else}
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
                            <span class="text-xs text-theme-text-secondary"
                                >--</span
                            >
                        {/if}
                    </div>
                </div>
            {/each}
        </div>

        {#if analyst.agentResponses["ImpactAnalysisAgent"]}
            <div
                class="bg-theme-surface border border-theme-border rounded-xl p-3 shadow-sm"
                transition:fade
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
    {/if}
</div>
