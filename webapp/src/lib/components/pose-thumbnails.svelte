<script lang="ts">
    import RotationDial from "./rotation-dial.svelte";
    import { fade } from "svelte/transition";
    import type { PoseAnalyst } from "$lib/processors/pose-analyst.svelte";

    let { analyst } = $props<{ analyst: PoseAnalyst }>();
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
                    <span class="text-xs text-theme-text-secondary">--</span>
                {/if}
            </div>
            <!-- Dial Section -->
            <div
                class="w-full flex justify-center py-2 bg-theme-surface-subtle rounded-lg border border-theme-border"
            >
                <div class="w-[90%]">
                    <RotationDial
                        variant="address"
                        shoulderAngle={analyst.metrics?.addressShoulderAngle ??
                            0}
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
                {#if analyst.agentResponses["AddressAgent"]}
                    <p class="text-xs text-theme-text-primary leading-relaxed">
                        {analyst.agentResponses["AddressAgent"]}
                    </p>
                {:else}
                    <div
                        class="flex items-center gap-2 py-2 text-xs text-theme-text-secondary animate-pulse"
                    >
                        <div
                            class="w-1.5 h-1.5 rounded-full bg-theme-accent/50"
                        ></div>
                        <span>Analyzing form...</span>
                    </div>
                {/if}
            </div>
        </div>
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
                    <span class="text-xs text-theme-text-secondary">--</span>
                {/if}
            </div>
            <!-- Dial Section -->
            <div
                class="w-full flex justify-center py-2 bg-theme-surface-subtle rounded-lg border border-theme-border"
            >
                <div class="w-[90%]">
                    <RotationDial
                        variant="top"
                        shoulderAngle={analyst.metrics?.shoulderRotation ?? 0}
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
                {#if analyst.agentResponses["TopOfSwingAgent"]}
                    <p class="text-xs text-theme-text-primary leading-relaxed">
                        {analyst.agentResponses["TopOfSwingAgent"]}
                    </p>
                {:else}
                    <div
                        class="flex items-center gap-2 py-2 text-xs text-theme-text-secondary animate-pulse"
                    >
                        <div
                            class="w-1.5 h-1.5 rounded-full bg-theme-accent/50"
                        ></div>
                        <span>Analyzing rotation...</span>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
