import * as THREE from 'three';
import type { SwingTrajectoryPoint } from './swing-metrics';

const COLOR_VELOCITY = 0x0d9488; // teal-600
const COLOR_ZERO_AXIS = 0x94a3b8; // slate-400
const COLOR_TOS_MARKER = 0xf97316; // orange-500

export class VelocityTracker {

    constructor(scene: THREE.Scene, camera: THREE.OrthographicCamera) {
        this.scene_ = scene;
        this.camera_ = camera;
    }

    /**
     * Updates the graph with new calculation data.
     */
    update(trajectory: SwingTrajectoryPoint[], detectedToSFrame: number): void {
        this.clearGraph();

        if (trajectory.length === 0) return;
        const width = this.camera_.right - this.camera_.left;
        const height = this.camera_.top - this.camera_.bottom;
        const padding = 20;

        let minVel = 0;
        let maxVel = 0;
        trajectory.forEach(p => {
            minVel = Math.min(minVel, p.wristVelocity);
            maxVel = Math.max(maxVel, p.wristVelocity);
        });

        // Ensure we always have some range centered around 0 if possible, or at least visible
        const range = maxVel - minVel;
        const rangePadding = range * 0.1 || 1; // Default to 1 if flatline
        minVel -= rangePadding;
        maxVel += rangePadding;

        const totalRange = maxVel - minVel;

        const mapX = (frame: number) => padding + (frame / trajectory.length) * (width - 2 * padding);
        const mapY = (val: number) => padding + ((val - minVel) / totalRange) * (height - 2 * padding);

        const velocityPts: THREE.Vector3[] = [];

        trajectory.forEach(pt => {
            const x = mapX(pt.frameIndex);
            velocityPts.push(new THREE.Vector3(x, mapY(pt.wristVelocity), 0));
        });

        this.drawLine(velocityPts, COLOR_VELOCITY);

        // Draw Zero Axis
        const zeroY = mapY(0);
        if (zeroY >= padding && zeroY <= height - padding) {
            this.drawLine([
                new THREE.Vector3(padding, zeroY, 0),
                new THREE.Vector3(width - padding, zeroY, 0)
            ], COLOR_ZERO_AXIS);
        }

        if (detectedToSFrame >= 0 && detectedToSFrame < trajectory.length) {
            const tosX = mapX(detectedToSFrame);
            this.drawLine([
                new THREE.Vector3(tosX, this.camera_.bottom, 0),
                new THREE.Vector3(tosX, this.camera_.top, 0)
            ], COLOR_TOS_MARKER);
        }
    }

    private drawLine(points: THREE.Vector3[], color: number): void {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: color, linewidth: 2 });
        const line = new THREE.Line(geometry, material);
        this.scene_.add(line);
        this.graphObjects_.push(line);
    }

    /**
     * Removes all graphical elements added by this class from the scene.
     */
    private clearGraph(): void {
        this.graphObjects_.forEach(m => {
            if (m instanceof THREE.Line) {
                m.geometry.dispose();
                (m.material as THREE.Material).dispose();
            }
            this.scene_.remove(m);
        });
        this.graphObjects_ = [];
    }

    /**
     * Exposes the internal clear for external cleanup.
     */
    dispose(): void {
        this.clearGraph();
    }

    private scene_: THREE.Scene;
    private camera_: THREE.OrthographicCamera;
    private graphObjects_: THREE.Object3D[] = [];
}
