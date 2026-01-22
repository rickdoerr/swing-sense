import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import * as THREE from "three";
import { SwingMetrics, type SwingTrajectoryPoint } from "$lib/metrics/swing-metrics";
import {
    buildBodyFrame,
    toBodyFrame,
    type BodyFrame,
} from "$lib/math/geometry";

type ProcessingState = "idle" | "loading_model" | "processing" | "completed" | "stopped";

type SessionData = {
    bodyFrame: BodyFrame;
    history: THREE.Vector3[][];
} | null;

export class PoseAnalyst {
    // State
    processingState = $state<ProcessingState>("idle");
    currLandmarks = $state<THREE.Vector3[] | null>(null);
    landmarksHistory = $state<THREE.Vector3[][] | null>(null);
    addressLandmarks = $derived(
        this.landmarksHistory && this.landmarksHistory.length > 0
            ? this.landmarksHistory[0]
            : null
    );

    // Metrics
    metrics = $state<{
        shoulderRotation: number;
        hipRotation: number;
        xFactor: number;
        topOfSwingFrame: number;
        addressShoulderAngle: number;
        trajectory: SwingTrajectoryPoint[];
    } | null>(null);

    // Thumbnails
    addressImage = $state<string | null>(null);
    topOfSwingImage = $state<string | null>(null);



    constructor() {
        if (typeof document !== "undefined") {
            this.initialize();
        }
    }

    async initialize() {
        if (this.vision_) return;
        this.processingState = "loading_model";
        try {
            this.vision_ = await FilesetResolver.forVisionTasks("/models/wasm");
            this.poseLandmarker_ = await this.createPoseLandmarker();
            this.processingState = "idle";
        } catch (e) {
            console.error("Failed to initialize MediaPipe", e);
            this.processingState = "idle";
        }
    }

    async loadVideo(file: File, videoElem: HTMLVideoElement) {
        this.stop();
        this.videoElem_ = videoElem;
        this.processingState = "idle";

        // Reset data
        this.resetData();

        if (this.videoElem_.src) {
            URL.revokeObjectURL(this.videoElem_.src);
        }

        this.videoElem_.src = URL.createObjectURL(file);

        await new Promise((resolve) => {
            if (!this.videoElem_) return resolve(null);
            this.videoElem_.onloadedmetadata = resolve;
        });
    }

    async process() {
        if (!this.videoElem_ || !this.poseLandmarker_) return;

        this.stop();
        this.abortController_ = new AbortController();
        const signal = this.abortController_.signal;

        this.processingState = "processing";
        this.resetData();

        // Re-create landmarker to ensure fresh state if needed
        if (this.poseLandmarker_) await this.poseLandmarker_.close();
        this.poseLandmarker_ = await this.createPoseLandmarker();

        if (!this.poseLandmarker_) {
            console.error("Failed to initialize PoseLandmarker");
            this.processingState = "stopped";
            return;
        }

        let currentTime = 0;
        const duration = this.videoElem_.duration;

        this.videoElem_.muted = true;
        this.videoElem_.pause();

        try {
            while (currentTime <= duration) {
                if (signal.aborted) break;

                this.videoElem_.currentTime = currentTime;
                await this.waitForSeek(this.videoElem_);

                if (signal.aborted) break;

                // Check again in case of async race, though unlikely with await
                if (!this.poseLandmarker_) break;

                const result = this.poseLandmarker_.detectForVideo(
                    this.videoElem_,
                    currentTime * 1000
                );

                this.processFrameResult(result);

                currentTime += 1 / 30; // 30 fps target
            }

            if (!signal.aborted) {
                await this.completeProcessing();
            }
        } catch (e) {
            console.error("Processing interrupted", e);
            this.processingState = "stopped";
        }
    }

    stop() {
        if (this.abortController_) {
            this.abortController_.abort();
            this.abortController_ = null;
        }
        if (this.processingState === "processing") {
            this.processingState = "stopped";
        }
    }

    private async createPoseLandmarker() {
        if (!this.vision_) return null;
        return await PoseLandmarker.createFromOptions(this.vision_, {
            baseOptions: {
                modelAssetPath: "/models/pose_landmarker_lite.task",
                delegate: "GPU",
            },
            runningMode: "VIDEO",
        });
    }

    private waitForSeek(video: HTMLVideoElement) {
        return new Promise<void>((resolve) => {
            const onSeeked = () => {
                video.removeEventListener("seeked", onSeeked);
                resolve();
            };
            video.addEventListener("seeked", onSeeked);
        });
    }

    private processFrameResult(result: any) {
        const rawLandmarks = result.worldLandmarks[0];
        if (!rawLandmarks) return;

        if (!this.sessionData_) {
            const bodyFrame = buildBodyFrame(rawLandmarks);
            if (!bodyFrame) return;

            this.sessionData_ = { bodyFrame, history: [] };
        }

        const landmarks = toBodyFrame(rawLandmarks, this.sessionData_.bodyFrame);
        this.currLandmarks = landmarks;

        if (landmarks && landmarks.length > 0) {
            this.sessionData_!.history.push([...landmarks]);
        }
    }

    private async completeProcessing() {
        this.processingState = "completed";
        if (this.sessionData_?.history && this.sessionData_.history.length > 0) {
            this.landmarksHistory = this.sessionData_.history;
            this.metrics = this.swingMetricsCalculator_.calculate(this.landmarksHistory);

            if (this.metrics && this.videoElem_) {
                // Capture thumbnails
                this.addressImage = await this.captureFrame(0);
                // metrics.topOfSwingFrame is a frame index, frame rate assumed 30fps
                const tosTime = this.metrics.topOfSwingFrame / 30;
                this.topOfSwingImage = await this.captureFrame(tosTime);
            }
        }
    }

    private async captureFrame(time: number): Promise<string | null> {
        const video = this.videoElem_;
        if (!video) return null;

        return new Promise((resolve) => {
            const onSeeked = () => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL("image/jpeg"));
                } else {
                    resolve(null);
                }
                video.removeEventListener("seeked", onSeeked);
            };

            video.currentTime = time;
            video.addEventListener("seeked", onSeeked, { once: true });
        });
    }

    private resetData() {
        this.sessionData_ = null;
        this.currLandmarks = null;
        this.landmarksHistory = null;
        this.metrics = null;
        this.addressImage = null;
        this.topOfSwingImage = null;
    }
    // Private
    private videoElem_: HTMLVideoElement | null = null;
    private poseLandmarker_: PoseLandmarker | null = null;
    private vision_: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>> | null = null;
    private abortController_: AbortController | null = null;
    private sessionData_: SessionData = null;
    private swingMetricsCalculator_ = new SwingMetrics();
}
