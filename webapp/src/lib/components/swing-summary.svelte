<script lang="ts">
    import { fade } from "svelte/transition";
    import type { PoseAnalyst } from "$lib/processors/pose-analyst.svelte";
    import RotationDial from "./rotation-dial.svelte";

    let { analyst } = $props<{ analyst: PoseAnalyst }>();

    function isLoading() {
        // Only show loading if we have some data but no synthesis yet,
        // OR simply if we are in a processing state.
        // For now, let's assume if this component is mounted, we want to show *something*
        // until the synthesis is ready.
        return !analyst.agentResponses["SynthesisAgent"];
    }
</script>

<div class="space-y-4">
    {#if isLoading()}
        <div
            class="w-full py-4 border border-theme-border border-dashed rounded-xl bg-theme-surface-subtle flex items-center justify-center gap-3"
            transition:fade
        >
            <div class="w-6 h-6">
                <RotationDial variant="loading" />
            </div>
            <span class="text-xs text-theme-text-secondary animate-pulse"
                >Synthesizing Coach's Feedback...</span
            >
        </div>
    {:else}
        <div
            class="bg-theme-surface border border-theme-border rounded-xl p-3 shadow-sm"
            transition:fade
        >
            <h4
                class="text-[10px] font-bold uppercase tracking-wider text-theme-text-secondary m-0 mb-1"
            >
                AI Swing Synthesis
            </h4>
            <p class="text-xs text-theme-text-primary leading-relaxed">
                {analyst.agentResponses["SynthesisAgent"]}
            </p>
        </div>
    {/if}
</div>
