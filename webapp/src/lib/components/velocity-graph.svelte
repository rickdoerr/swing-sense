<script lang="ts">
    import * as THREE from "three";
    import { onMount } from "svelte";

    import { VelocityTracker } from "$lib/metrics/velocity-tracker";
    import { ThreeScene } from "$lib/rendering/three-scene";
    import type { SwingTrajectoryPoint } from "$lib/metrics/swing-metrics";

    let {
        trajectory = [],
        detectedFrame = 0,
    }: { trajectory?: SwingTrajectoryPoint[]; detectedFrame?: number } =
        $props();

    let canvasElement: HTMLCanvasElement;
    let threeScene: ThreeScene | null = null;
    let velocityTracker: VelocityTracker | null = null;

    onMount(() => {
        threeScene = new ThreeScene(canvasElement, {
            background: 0xf8fafc,
            cameraType: "orthographic",
            enableControls: false,
            enableGrid: false,
            enableAxes: false,
            enableLights: false,
        });

        threeScene.init();

        velocityTracker = new VelocityTracker(
            threeScene.getScene(),
            threeScene.getCamera() as THREE.OrthographicCamera,
        );

        return () => {
            threeScene?.dispose();
            velocityTracker?.dispose();
            threeScene = null;
            velocityTracker = null;
        };
    });

    $effect(() => {
        if (velocityTracker && threeScene && trajectory.length > 0) {
            velocityTracker.update(trajectory, detectedFrame);
            threeScene
                .getRenderer()
                .render(threeScene.getScene(), threeScene.getCamera());
        }
    });
</script>

<div
    class="relative w-full h-full bg-theme-surface-subtle rounded-xl overflow-hidden border border-theme-border shadow-md"
>
    <!-- Graph -->
    <canvas bind:this={canvasElement} class="w-full h-full block"></canvas>

    <!-- Y-Axis Label -->
    <div
        class="absolute left-3 top-1/2 -translate-y-1/2 -rotate-180 text-[10px] font-bold text-slate-400 tracking-widest pointer-events-none whitespace-nowrap"
        style="writing-mode: vertical-rl;"
    >
        WRIST VELOCITY
    </div>

    <!-- X-Axis Label -->
    <div
        class="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 tracking-widest pointer-events-none"
    >
        SWING TIMING
    </div>
</div>
