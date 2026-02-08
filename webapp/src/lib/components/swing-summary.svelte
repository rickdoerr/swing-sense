<script lang="ts">
    import { fade } from "svelte/transition";
    import type { PoseAnalyst } from "$lib/processors/pose-analyst.svelte";
    import RotationDial from "./rotation-dial.svelte";

    let { analyst } = $props<{ analyst: PoseAnalyst }>();
</script>

<div class="space-y-4">
    <div
        class="bg-gradient-to-br from-theme-surface to-theme-surface/50 border border-theme-border rounded-xl shadow-lg overflow-hidden relative"
        transition:fade
    >
        <!-- Dynamic Header -->
        <div
            class="bg-theme-secondary/10 p-3 border-b border-theme-border/50 flex items-center justify-between"
        >
            <h4
                class="text-xs font-black uppercase tracking-widest text-theme-accent flex items-center gap-2"
            >
                <span class="text-lg">⚡</span> AI Coach Synthesis
            </h4>
            {#if !analyst.agentResponses["SynthesisAgent"]}
                <span
                    class="text-[10px] text-theme-text-secondary animate-pulse"
                    >Analyzing...</span
                >
            {/if}
        </div>

        <div class="p-4">
            {#if analyst.agentResponses["SynthesisAgent"]}
                <!-- Parse the response which is in format: Swing Summary: ... Analysis: ... Key Focus Area: ... -->
                {@const response = analyst.agentResponses["SynthesisAgent"]}
                {@const summary = response
                    .match(
                        /Swing Summary:\s*(.*?)(?=Analysis:|Key Focus Area:|$)/s,
                    )?.[1]
                    ?.trim()}
                {@const analysis = response
                    .match(/Analysis:\s*(.*?)(?=Key Focus Area:|$)/s)?.[1]
                    ?.trim()}
                {@const focusArea = response
                    .match(/Key Focus Area:\s*(.*)/s)?.[1]
                    ?.trim()}

                <div class="space-y-4">
                    {#if summary}
                        <div
                            class="text-sm font-bold text-theme-text-primary leading-relaxed"
                        >
                            {summary}
                        </div>
                    {/if}

                    {#if analysis}
                        <div
                            class="text-xs text-theme-text-secondary leading-relaxed bg-theme-surface/50 p-2 rounded-md border border-theme-border/50"
                        >
                            <span
                                class="font-bold text-theme-accent mb-1 block text-[10px] uppercase"
                                >The Why</span
                            >
                            {analysis}
                        </div>
                    {/if}

                    {#if focusArea}
                        <div
                            class="bg-theme-accent/10 border-l-4 border-theme-accent p-3 rounded-r-md transition-all hover:bg-theme-accent/20"
                        >
                            <h5
                                class="text-[10px] font-bold uppercase text-theme-accent mb-1 tracking-wider"
                            >
                                High Impact Fix
                            </h5>
                            <p
                                class="text-sm font-bold text-theme-text-primary"
                            >
                                {focusArea}
                            </p>
                        </div>
                    {:else if !summary && !analysis}
                        <!-- Fallback if parsing fails -->
                        <p
                            class="text-xs text-theme-text-primary leading-relaxed whitespace-pre-wrap"
                        >
                            {response}
                        </p>
                    {/if}
                </div>
            {:else}
                <div
                    class="flex flex-col items-center justify-center py-6 gap-3 text-theme-text-secondary/50"
                >
                    <div
                        class="w-8 h-8 rounded-full border-2 border-theme-text-secondary/20 border-t-theme-accent animate-spin"
                    ></div>
                    <span class="text-xs font-medium"
                        >Crunching the numbers...</span
                    >
                </div>
            {/if}
        </div>

        <!-- Decoration -->
        <div
            class="absolute -bottom-10 -right-10 w-32 h-32 bg-theme-accent/5 rounded-full blur-3xl pointer-events-none"
        ></div>
    </div>
</div>
