<script lang="ts">
    import { fade } from "svelte/transition";
    import type { PoseAnalyst } from "$lib/processors/pose-analyst.svelte";
    import RotationDial from "./rotation-dial.svelte";

    let { analyst } = $props<{ analyst: PoseAnalyst }>();
</script>

<div class="space-y-4">
    <div
        class="bg-theme-surface border border-theme-border rounded-xl p-3 shadow-sm min-h-[60px]"
        transition:fade
    >
        <h4
            class="text-[10px] font-bold uppercase tracking-wider text-theme-text-secondary m-0 mb-1"
        >
            AI Swing Synthesis
        </h4>

        {#if analyst.agentResponses["SynthesisAgent"]}
            <p class="text-xs text-theme-text-primary leading-relaxed">
                {analyst.agentResponses["SynthesisAgent"]}
            </p>
        {:else}
            <div
                class="flex items-center gap-2 py-2 text-xs text-theme-text-secondary animate-pulse"
            >
                <div class="w-1.5 h-1.5 rounded-full bg-theme-accent/50"></div>
                <span>Coach is synthesizing specific feedback...</span>
            </div>
        {/if}
    </div>
</div>
