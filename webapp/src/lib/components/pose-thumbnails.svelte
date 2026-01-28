<script lang="ts">
    import RotationDial from "./rotation-dial.svelte";
    import { fade } from "svelte/transition";
    import type { PoseAnalyst } from "$lib/processors/pose-analyst.svelte";

    let { analyst } = $props<{ analyst: PoseAnalyst }>();

    // Helper to determine if we should show the loading state for a specific agent
    function isLoading(agentKey: string) {
        return !analyst.agentResponses[agentKey];
    }
</script>

<div class="grid grid-cols-2 gap-4">
    <!-- Address Card -->
    <div
        class="bg-theme-surface border border-theme-border rounded-xl p-4 flex flex-col gap-3 shadow-md h-full"
    >
        <h4
            class="text-xs font-semibold uppercase tracking-wider text-theme-text-secondary m-0"
        >
            Address
        </h4>

        {#if isLoading("AddressAgent")}
            <!-- Loading State -->
            <div
                class="flex flex-col items-center justify-center flex-1 py-12 gap-4"
                transition:fade
            >
                <div class="w-10 h-10">
                    <RotationDial variant="loading" />
                </div>
                <span class="text-xs text-theme-text-secondary animate-pulse"
                    >Analyzing Address...</span
                >
            </div>
        {:else}
            <!-- Content State -->
            <div transition:fade class="flex flex-col gap-3 h-full">
                <div
                    class="relative aspect-[3/4] w-full rounded-lg bg-black/5 overflow-hidden border border-theme-border flex items-center justify-center bg-theme-surface-subtle"
                >
                    {#if analyst.addressImage}
                        <img
                            src={analyst.addressImage}
                            alt="Address Pose"
                            class="w-full h-full object-cover"
                        />
                    {:else}
                        <span class="text-xs text-theme-text-secondary">--</span
                        >
                    {/if}
                </div>
                <!-- Dial Section -->
                <div
                    class="w-full flex justify-center py-2 bg-theme-surface-subtle rounded-lg border border-theme-border"
                >
                    <div class="w-[90%]">
                        <RotationDial
                            variant="address"
                            shoulderAngle={analyst.metrics
                                ?.addressShoulderAngle ?? 0}
                        />
                    </div>
                </div>

                <div
                    class="mt-auto bg-theme-surface border border-theme-border rounded-xl p-3 shadow-sm"
                >
                    <h4
                        class="text-[10px] font-bold uppercase tracking-wider text-theme-text-secondary m-0 mb-1"
                    >
                        Address Analysis
                    </h4>
                    <p class="text-xs text-theme-text-primary leading-relaxed">
                        {analyst.agentResponses["AddressAgent"]}
                    </p>
                </div>
            </div>
        {/if}
    </div>

    <!-- Top of Swing Card -->
    <div
        class="bg-theme-surface border border-theme-border rounded-xl p-4 flex flex-col gap-3 shadow-md h-full"
    >
        <h4
            class="text-xs font-semibold uppercase tracking-wider text-theme-text-secondary m-0"
        >
            Top of Swing
        </h4>

        {#if isLoading("TopOfSwingAgent")}
            <!-- Loading State -->
            <div
                class="flex flex-col items-center justify-center flex-1 min-h-[300px] gap-4"
                transition:fade
            >
                <div class="w-12 h-12">
                    <RotationDial variant="loading" />
                </div>
                <span class="text-xs text-theme-text-secondary animate-pulse"
                    >Analyzing Top Position...</span
                >
            </div>
        {:else}
            <!-- Content State -->
            <div transition:fade class="flex flex-col gap-3 h-full">
                <div
                    class="relative aspect-[3/4] w-full rounded-lg bg-black/5 overflow-hidden border border-theme-border flex items-center justify-center bg-theme-surface-subtle"
                >
                    {#if analyst.topOfSwingImage}
                        <img
                            src={analyst.topOfSwingImage}
                            alt="Top of Swing Pose"
                            class="w-full h-full object-cover"
                        />
                    {:else}
                        <span class="text-xs text-theme-text-secondary">--</span
                        >
                    {/if}
                </div>
                <!-- Dial Section -->
                <div
                    class="w-full flex justify-center py-2 bg-theme-surface-subtle rounded-lg border border-theme-border"
                >
                    <div class="w-[90%]">
                        <RotationDial
                            variant="top"
                            shoulderAngle={analyst.metrics?.shoulderRotation ??
                                0}
                            hipAngle={analyst.metrics?.hipRotation ?? 0}
                        />
                    </div>
                </div>

                <div
                    class="mt-auto bg-theme-surface border border-theme-border rounded-xl p-3 shadow-sm"
                >
                    <h4
                        class="text-[10px] font-bold uppercase tracking-wider text-theme-text-secondary m-0 mb-1"
                    >
                        Top of Swing Analysis
                    </h4>
                    <p class="text-xs text-theme-text-primary leading-relaxed">
                        {analyst.agentResponses["TopOfSwingAgent"]}
                    </p>
                </div>
            </div>
        {/if}
    </div>
</div>
