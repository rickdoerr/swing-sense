<script lang="ts">
    import RotationDial from "./rotation-dial.svelte";
    import type { PoseAnalyst } from "$lib/processors/pose-analyst.svelte";

    let { analyst } = $props<{ analyst: PoseAnalyst }>();
</script>

<div class="grid grid-cols-2 gap-4">
    <!-- Address Card -->
    <div
        class="bg-theme-surface border border-theme-border rounded-xl p-4 flex flex-col gap-3 shadow-md"
    >
        <h4
            class="text-xs font-semibold uppercase tracking-wider text-theme-text-secondary m-0"
        >
            Address
        </h4>
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
        {#if analyst.addressImage}
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
        {/if}
    </div>
    <!-- Top of Swing Card -->
    <div
        class="bg-theme-surface border border-theme-border rounded-xl p-4 flex flex-col gap-3 shadow-md"
    >
        <h4
            class="text-xs font-semibold uppercase tracking-wider text-theme-text-secondary m-0"
        >
            Top of Swing
        </h4>
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
        {#if analyst.topOfSwingImage}
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
        {/if}
    </div>
</div>
