<script lang="ts">
  import VideoUpload from "$lib/components/video-upload.svelte";
  import SplineGraph from "$lib/components/spline-graph.svelte";
  import MetricCard from "$lib/components/metric-card.svelte";
  import VelocityGraph from "$lib/components/velocity-graph.svelte";
  import PoseThumbnails from "$lib/components/pose-thumbnails.svelte";
  import { PoseAnalyst } from "$lib/processors/pose-analyst.svelte";

  const analyst = new PoseAnalyst();
</script>

<div class="min-h-screen bg-theme-background">
  <div class="mx-auto w-full max-w-[780px] px-4 py-8">
    <!-- Main Content -->
    <main
      class="bg-theme-surface rounded-2xl shadow-xl shadow-slate-200/50 p-5 sm:p-6 space-y-8 border border-theme-border"
    >
      <section class="space-y-4">
        <h2
          class="text-base font-semibold text-theme-text-secondary uppercase tracking-wider text-xs"
        >
          Video input
        </h2>
        <div class="pose-analyser-container">
          <VideoUpload {analyst} />
        </div>
      </section>

      <section class="space-y-5">
        <!-- Spline Graph -->
        <div
          class="relative rounded-xl overflow-hidden shadow-lg bg-theme-surface-subtle aspect-video border border-theme-border"
        >
          <SplineGraph
            landmarks={analyst.currLandmarks}
            skeletonLandmarks={analyst.addressLandmarks}
          />

          <div
            class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[0.65rem] tracking-wide text-theme-accent-dark font-bold font-mono z-10 shadow-sm border border-slate-100"
          >
            3D TRAJECTORY
          </div>
        </div>

        <div class="mt-4">
          <div class="mt-4">
            <PoseThumbnails {analyst} />
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            <h3
              class="text-base font-semibold text-theme-text-secondary uppercase tracking-wider text-xs"
            >
              Swing metrics
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MetricCard
              label="Shoulder Rotation"
              value={analyst.metrics?.shoulderRotation ?? null}
              unit="°"
            />
            <MetricCard
              label="Hip Rotation"
              value={analyst.metrics?.hipRotation ?? null}
              unit="°"
            />
            <MetricCard
              label="X-Factor"
              value={analyst.metrics?.xFactor ?? null}
              unit="°"
            />
          </div>
        </div>

        <div class="space-y-3">
          <h3
            class="text-base font-semibold text-theme-text-secondary uppercase tracking-wider text-xs"
          >
            Wrist Velocity (Y-Axis)
          </h3>

          <div class="relative h-[250px]">
            {#if analyst.metrics && analyst.metrics.trajectory}
              <VelocityGraph
                trajectory={analyst.metrics.trajectory}
                detectedFrame={analyst.metrics.topOfSwingFrame}
              />
            {:else}
              <div
                class="w-full h-full flex items-center justify-center text-theme-text-secondary text-sm bg-theme-surface-subtle rounded-xl border border-theme-border"
              >
                AWAITING SWING DATA...
              </div>
            {/if}
          </div>
          <div
            class="flex gap-4 text-xs justify-center text-theme-text-secondary"
          >
            <span class="text-theme-accent font-medium"
              >Left Wrist Velocity</span
            >
            <span class="text-theme-highlight font-medium">Top of Swing</span>
          </div>
        </div>
      </section>
    </main>
  </div>
</div>

<style>
  .pose-analyser-container {
    display: contents;
  }

  .pose-analyser-container :global(video) {
    width: 100%;
    border-radius: 0.75rem;
    background-color: var(--color-slate-100);
    box-shadow:
      0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
</style>
