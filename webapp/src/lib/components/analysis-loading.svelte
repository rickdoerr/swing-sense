<script lang="ts">
    import RotationDial from "./rotation-dial.svelte";
</script>

<div
    class="w-full aspect-video bg-theme-surface border border-theme-border rounded-xl p-8 flex flex-col items-center justify-center gap-6 shadow-lg"
>
    <div class="w-16 h-16">
        <RotationDial variant="loading" />
    </div>
    <div class="flex flex-col items-center gap-2">
        <h3
            class="text-lg font-display font-medium text-theme-text-primary uppercase tracking-widest"
        >
            Analysing Swing...
        </h3>
        <p class="text-sm text-theme-text-secondary">
            Extracting pose data and biomechanics
        </p>
    </div>
</div>
