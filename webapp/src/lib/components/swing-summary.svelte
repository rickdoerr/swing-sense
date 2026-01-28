<script lang="ts">
    import type { PoseAnalyst } from "$lib/processors/pose-analyst.svelte";

    let { analyst } = $props<{ analyst: PoseAnalyst }>();
</script>

{#if analyst.agentResponses["SynthesisAgent"]}
    <div
        class="bg-theme-surface border border-theme-border rounded-xl p-5 shadow-md flex flex-col gap-3 relative overflow-hidden"
    >
        <div class="absolute top-0 left-0 w-1 h-full bg-theme-accent"></div>
        <h3
            class="text-xs font-bold uppercase tracking-wider text-theme-text-secondary m-0 flex items-center gap-2"
        >
            <span class="w-2 h-2 rounded-full bg-theme-accent animate-pulse"
            ></span>
            AI Swing Synthesis
        </h3>
        <p class="text-sm text-theme-text-primary leading-relaxed font-medium">
            {analyst.agentResponses["SynthesisAgent"]}
        </p>
    </div>
{/if}
