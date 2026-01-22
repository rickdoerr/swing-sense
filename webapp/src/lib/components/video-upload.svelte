<script lang="ts">
  import type { PoseAnalyst } from "$lib/processors/pose-analyst.svelte";

  let { analyst } = $props<{ analyst: PoseAnalyst }>();

  let videoElem: HTMLVideoElement;
  let fileInput: HTMLInputElement;
  let isLoading = $state(false);

  async function handleUpload() {
    const file = fileInput.files?.[0];
    if (file) {
      isLoading = true;
      try {
        await analyst.loadVideo(file, videoElem);
        isLoading = false;
        await analyst.process();
      } catch (e) {
        isLoading = false;
        console.error(e);
      }
    }
  }

  async function handleDemo() {
    isLoading = true;
    try {
      const response = await fetch("/media/golf-swing-example-1.mp4");
      const blob = await response.blob();
      const file = new File([blob], "golf-swing-example-1.mp4", {
        type: "video/mp4",
      });
      await analyst.loadVideo(file, videoElem);
      isLoading = false;
      await analyst.process();
    } catch (error) {
      console.error("Failed to load demo video:", error);
      isLoading = false;
    }
  }
</script>

<div class="container">
  <input
    type="file"
    accept="video/*"
    class="hidden"
    bind:this={fileInput}
    onchange={handleUpload}
  />

  <div class="flex gap-2 mb-4">
    <button
      class="btn btn-secondary flex-1 px-4 py-2"
      onclick={() => fileInput.click()}
    >
      Upload Video
    </button>
    <button class="btn btn-primary flex-1 px-4 py-2" onclick={handleDemo}>
      Run Demo
    </button>
  </div>

  <div class="relative w-full">
    <video
      bind:this={videoElem}
      playsinline
      muted
      width="640"
      height="480"
      class="w-full block"
    ></video>

    {#if analyst.processingState === "loading_model"}
      <div
        class="absolute inset-0 flex items-center justify-center bg-black/20 text-white rounded-xl"
      >
        <p>Loading AI Model...</p>
      </div>
    {:else if isLoading}
      <div
        class="absolute inset-0 flex items-center justify-center bg-black/20 text-white rounded-xl"
      >
        <p>Loading Video...</p>
      </div>
    {:else if analyst.processingState === "processing"}
      <div
        class="absolute inset-0 pointer-events-none border-4 border-theme-accent rounded-xl z-10"
      ></div>
    {/if}
  </div>
</div>
