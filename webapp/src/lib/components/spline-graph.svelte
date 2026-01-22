<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";

  // internal dependencies
  import { SwingPath } from "../metrics/swing-path";
  import { ThreeScene } from "../rendering/three-scene";
  import { Skeleton } from "../rendering/skeleton";

  let {
    landmarks = null,
    skeletonLandmarks = null,
  }: { landmarks?: any; skeletonLandmarks?: any } = $props();

  let canvasElement: HTMLCanvasElement;
  let threeScene: ThreeScene | null = null;
  let swingLine: THREE.Line;
  let skeleton: Skeleton | null = null;

  const swingPath = new SwingPath();

  onMount(() => {
    threeScene = new ThreeScene(canvasElement, {
      background: 0xf8fafc,
      cameraPosition: [0, 0.5, 2],
      cameraFov: 75,
    });
    threeScene.init();

    const material = new THREE.LineBasicMaterial({
      color: 0x0d9488,
      linewidth: 3,
      transparent: true,
      opacity: 0.8,
    });
    const geometry = new THREE.BufferGeometry();
    swingLine = new THREE.Line(geometry, material);
    threeScene.getScene().add(swingLine);

    skeleton = new Skeleton(threeScene.getScene());

    threeScene.animate();

    return () => {
      threeScene?.dispose();
      threeScene?.dispose();
      skeleton?.dispose();
      threeScene = null;
      skeleton = null;
    };
  });

  function clearTrail() {
    swingPath.clear();
    if (swingLine) {
      swingLine.geometry.setDrawRange(0, 0);
      if (swingLine.geometry.attributes.position) {
        swingLine.geometry.attributes.position.needsUpdate = true;
      }
    }
  }

  let wasNull = true;

  $effect(() => {
    if (!threeScene) return;

    const isNull = !landmarks || landmarks.length === 0;

    if (isNull) {
      clearTrail();
      wasNull = true;
      return;
    }

    if (wasNull) {
      clearTrail();
      wasNull = false;
    }

    swingPath.update(landmarks);
    const swingLineBufferAttribute = new THREE.BufferAttribute(
      swingPath.getUpdatedPointsBuffer(),
      3,
    );

    swingLine.geometry.setAttribute("position", swingLineBufferAttribute);
    swingLine.geometry.setDrawRange(0, swingLineBufferAttribute.count);
    swingLine.geometry.attributes.position.needsUpdate = true;
    swingLine.geometry.computeBoundingSphere();
  });

  $effect(() => {
    if (!skeleton) return;

    if (skeletonLandmarks) {
      skeleton.update(skeletonLandmarks);
    } else {
      skeleton.clear();
    }
  });
</script>

<canvas bind:this={canvasElement} class="w-full h-full"></canvas>

<style>
  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
