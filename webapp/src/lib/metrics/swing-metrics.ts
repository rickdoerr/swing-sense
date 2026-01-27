import * as THREE from 'three';
import { safeNormal } from '../math/geometry';
import type { SwingMetricsResult, SwingTrajectoryPoint } from './types';
export type { SwingMetricsResult, SwingTrajectoryPoint } from './types';
import { detectTopSwing } from './poses/top-swing';
import { detectImpact, classifyShot } from './poses/impact';

export class SwingMetrics {
    /**
    *    Calculates the rotational difference between shoulders and hips.
    *    @param normalizedFrames Array of frames, where each frame is an array of THREE.Vector3
    */
    calculate(normalizedFrames: THREE.Vector3[][]): SwingMetricsResult {
        this.reset();

        const LEFT_SHOULDER = 11;
        const RIGHT_SHOULDER = 12;
        const LEFT_WRIST = 15;
        const LEFT_HIP = 23;
        const RIGHT_HIP = 24;
        const LEFT_HEEL = 29;
        const RIGHT_HEEL = 30;

        if (normalizedFrames.length < 10) {
            console.warn("Not enough video frames to calculate swing metrics.");
            return {
                shoulderRotation: 0,
                hipRotation: 0,
                xFactor: 0,
                topOfSwingFrame: 0,
                impactFrame: 0,
                downswingSequence: [],
                addressShoulderAngle: 0,
                shotClassification: [],
                trajectory: []
            };
        }

        const addressPose = normalizedFrames[0];

        const addressHipVec = this.getHorizontalVector(addressPose[LEFT_HIP], addressPose[RIGHT_HIP]);
        const addressShoulderVec = this.getHorizontalVector(addressPose[LEFT_SHOULDER], addressPose[RIGHT_SHOULDER]);
        const addressFootVec = this.getHorizontalVector(addressPose[LEFT_HEEL], addressPose[RIGHT_HEEL]);

        let addressShoulderAngleRad = addressFootVec.angleTo(addressShoulderVec);
        if (this.isClockwise(addressFootVec, addressShoulderVec)) addressShoulderAngleRad = -addressShoulderAngleRad;
        this.addressShoulderAngle_ = addressShoulderAngleRad * (180 / Math.PI);

        let previousWristPos = new THREE.Vector3(
            normalizedFrames[0][LEFT_WRIST].x,
            normalizedFrames[0][LEFT_WRIST].y,
            normalizedFrames[0][LEFT_WRIST].z
        );

        normalizedFrames.forEach((pose, index) => {

            const currentHipVec = this.getHorizontalVector(pose[LEFT_HIP], pose[RIGHT_HIP]);
            const currentShoulderVec = this.getHorizontalVector(pose[LEFT_SHOULDER], pose[RIGHT_SHOULDER]);

            let hipTurnRad = addressHipVec.angleTo(currentHipVec);
            if (this.isClockwise(addressHipVec, currentHipVec)) hipTurnRad = -hipTurnRad;

            let shoulderTurnRad = addressShoulderVec.angleTo(currentShoulderVec);
            if (this.isClockwise(addressShoulderVec, currentShoulderVec)) shoulderTurnRad = -shoulderTurnRad;

            const hipTurnDeg = hipTurnRad * (180 / Math.PI);
            const shoulderTurnDeg = shoulderTurnRad * (180 / Math.PI);

            const currentXFactor = Math.abs(shoulderTurnDeg - hipTurnDeg);

            const currentWristPos = new THREE.Vector3(pose[LEFT_WRIST].x, pose[LEFT_WRIST].y, pose[LEFT_WRIST].z);

            // TODO add smoothing
            const velocityY = (currentWristPos.y - previousWristPos.y) * 100;
            previousWristPos = currentWristPos;

            this.trajectory_.push({
                frameIndex: index,
                shoulderRotation: shoulderTurnDeg,
                hipRotation: hipTurnDeg,
                xFactor: currentXFactor,
                wristVelocity: velocityY
            });
        });

        const smoothedVelocities = this.trajectory_.map((pt, i, arr) => {
            const start = Math.max(0, i - 2);
            const end = Math.min(arr.length, i + 3);
            const window = arr.slice(start, end);
            const sum = window.reduce((acc, curr) => acc + curr.wristVelocity, 0);
            return sum / window.length;
        });

        this.trajectory_.forEach((pt, i) => {
            pt.wristVelocity = smoothedVelocities[i];
        });

        // 1. Detect Top of Swing
        this.topOfSwingFrame_ = detectTopSwing(this.trajectory_);

        if (this.trajectory_.length > 0 && this.topOfSwingFrame_ < this.trajectory_.length) {
            const tosPoint = this.trajectory_[this.topOfSwingFrame_];
            this.shoulderRotation_ = Math.abs(tosPoint.shoulderRotation);
            this.hipRotation_ = Math.abs(tosPoint.hipRotation);
            this.xFactor_ = tosPoint.xFactor;
        }

        // 2. Detect Impact
        this.impactFrame_ = detectImpact(this.trajectory_, this.topOfSwingFrame_);

        // 3. Classify Shot
        const classifications = classifyShot(normalizedFrames, this.impactFrame_, addressPose);

        // 4. Determine Downswing Sequence (2 intermediate + Impact)
        const sequence: number[] = [];
        if (this.topOfSwingFrame_ < this.impactFrame_) {
            const range = this.impactFrame_ - this.topOfSwingFrame_;
            // We want 2 intermediate frames.
            // 0% (TOS) ... 33% ... 66% ... 100% (Impact)
            // But user said "Top of Swing, Mid-Downswing, Impact" in plan, but "two more frames between" in chat.
            // Let's go with: [33%, 66%, 100%] roughly.

            const p1 = Math.round(this.topOfSwingFrame_ + range * 0.33);
            const p2 = Math.round(this.topOfSwingFrame_ + range * 0.66);

            // Ensure distinct and ordered
            if (p1 > this.topOfSwingFrame_ && p1 < this.impactFrame_) sequence.push(p1);
            if (p2 > p1 && p2 < this.impactFrame_) sequence.push(p2);
        }
        // Always include impact at the end
        sequence.push(this.impactFrame_);

        // Ensure we have 3 frames if possible, even if duplicate (though UI should handle uniques)
        // If range is too small, we might just have impact. UI will handle it.

        this.roundMetrics();

        return {
            shoulderRotation: this.shoulderRotation_,
            hipRotation: this.hipRotation_,
            xFactor: this.xFactor_,
            topOfSwingFrame: this.topOfSwingFrame_,
            impactFrame: this.impactFrame_,
            downswingSequence: sequence,
            addressShoulderAngle: this.addressShoulderAngle_,
            shotClassification: classifications,
            trajectory: this.trajectory_
        };
    }

    private getHorizontalVector(p1: THREE.Vector3, p2: THREE.Vector3): THREE.Vector3 {
        const vCandidate = new THREE.Vector3().subVectors(p2, p1);
        vCandidate.z = 0;

        return safeNormal(vCandidate);
    }

    private isClockwise(from: THREE.Vector3, to: THREE.Vector3): boolean {
        const cross = new THREE.Vector3().crossVectors(from, to);
        return cross.z < 0;
    }

    private reset() {
        this.shoulderRotation_ = 0;
        this.hipRotation_ = 0;
        this.xFactor_ = 0;
        this.topOfSwingFrame_ = 0;
        this.impactFrame_ = 0;
        this.trajectory_ = [];
    }

    private roundMetrics() {
        this.shoulderRotation_ = Math.round(this.shoulderRotation_);
        this.hipRotation_ = Math.round(this.hipRotation_);
        this.xFactor_ = Math.round(this.xFactor_);
        this.addressShoulderAngle_ = Math.round(this.addressShoulderAngle_);
    }

    private shoulderRotation_: number = 0;
    private hipRotation_: number = 0;
    private xFactor_: number = 0;
    private topOfSwingFrame_: number = 0;
    private impactFrame_: number = 0;
    private addressShoulderAngle_: number = 0;
    private trajectory_: SwingTrajectoryPoint[] = [];
}