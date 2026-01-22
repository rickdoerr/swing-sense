import * as THREE from 'three';
import { safeNormal } from '../math/geometry';

export interface SwingTrajectoryPoint {
    frameIndex: number;
    shoulderRotation: number;
    hipRotation: number;
    xFactor: number;
    wristVelocity: number;
}

export class SwingMetrics {
    /**
    *    Calculates the rotational difference between shoulders and hips.
    *    @param normalizedFrames Array of frames, where each frame is an array of THREE.Vector3
    */
    calculate(normalizedFrames: THREE.Vector3[][]): {
        shoulderRotation: number;
        hipRotation: number;
        xFactor: number;
        topOfSwingFrame: number;
        addressShoulderAngle: number;
        trajectory: SwingTrajectoryPoint[];
    } {
        this.reset();

        const LEFT_SHOULDER = 11;
        const RIGHT_SHOULDER = 12;
        const LEFT_HIP = 23;
        const RIGHT_HIP = 24;
        const LEFT_HEEL = 29;
        const RIGHT_HEEL = 30;
        const LEFT_WRIST = 15;

        if (normalizedFrames.length < 10) {
            console.warn("Not enough video frames to calculate swing metrics.");
            return { shoulderRotation: 0, hipRotation: 0, xFactor: 0, topOfSwingFrame: 0, addressShoulderAngle: 0, trajectory: [] };
        }

        // Using the first frame as our baseline
        const addressPose = normalizedFrames[0];

        // The baseline hip and shoulder vectors are projected on the XY plane. 
        const addressHipVec = this.getHorizontalVector(addressPose[LEFT_HIP], addressPose[RIGHT_HIP]);
        const addressShoulderVec = this.getHorizontalVector(addressPose[LEFT_SHOULDER], addressPose[RIGHT_SHOULDER]);
        const addressFootVec = this.getHorizontalVector(addressPose[LEFT_HEEL], addressPose[RIGHT_HEEL]);

        // Calculate Address Shoulder Alignment relative to Feet
        // Angle between Shoulder Vector and Foot Vector
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

            // Wrist velocity calculation (Y-axis)
            // +Y is forward (in front of golfer), -Y is backwards (behind golfer)
            const currentWristPos = new THREE.Vector3(pose[LEFT_WRIST].x, pose[LEFT_WRIST].y, pose[LEFT_WRIST].z);

            // Velocity = delta position / delta time (assuming 1 unit time per frame)
            // TODO add smoothing
            const velocityY = (currentWristPos.y - previousWristPos.y) * 100; // Scaling factor for readability
            previousWristPos = currentWristPos;

            this.trajectory_.push({
                frameIndex: index,
                shoulderRotation: shoulderTurnDeg,
                hipRotation: hipTurnDeg,
                xFactor: currentXFactor,
                wristVelocity: velocityY
            });
        });

        // Smooth the wrist velocity to reduce noise (moving avg 5 frames)
        const smoothedVelocities = this.trajectory_.map((pt, i, arr) => {
            const start = Math.max(0, i - 2);
            const end = Math.min(arr.length, i + 3);
            const window = arr.slice(start, end);
            const sum = window.reduce((acc, curr) => acc + curr.wristVelocity, 0);
            return sum / window.length;
        });

        // Update trajectory with smoothed values
        this.trajectory_.forEach((pt, i) => {
            pt.wristVelocity = smoothedVelocities[i];
        });

        let maxVelocityFrame = 0;
        let maxVelocity = 0;
        const IGNORE_START_FRAMES = 15;

        for (let i = IGNORE_START_FRAMES; i < this.trajectory_.length; i++) {
            const pt = this.trajectory_[i];
            if (Math.abs(pt.wristVelocity) > maxVelocity && Math.abs(pt.shoulderRotation) < 140) {
                maxVelocity = Math.abs(pt.wristVelocity);
                maxVelocityFrame = pt.frameIndex;
            }
        }

        // Find Top of Swing: Max shoulder rotation BEFORE peak velocity
        const searchLimitFrame = maxVelocity > 5 ? maxVelocityFrame : this.trajectory_.length;

        // Reset max tracking for the second pass
        let maxShoulderRot = 0;
        let bestFrameIndex = 0;

        for (let i = 0; i < searchLimitFrame; i++) {
            const pt = this.trajectory_[i];
            if (Math.abs(pt.shoulderRotation) > maxShoulderRot) {
                maxShoulderRot = Math.abs(pt.shoulderRotation);
                bestFrameIndex = pt.frameIndex;
            }
        }

        // Set the final metrics based on the best frame found
        if (this.trajectory_.length > 0) {
            const tosPoint = this.trajectory_[bestFrameIndex];
            this.shoulderRotation_ = Math.abs(tosPoint.shoulderRotation);
            this.hipRotation_ = Math.abs(tosPoint.hipRotation);
            this.xFactor_ = tosPoint.xFactor;
            this.topOfSwingFrame_ = bestFrameIndex;
        }

        this.roundMetrics();

        return {
            shoulderRotation: this.shoulderRotation_,
            hipRotation: this.hipRotation_,
            xFactor: this.xFactor_,
            topOfSwingFrame: this.topOfSwingFrame_,
            addressShoulderAngle: this.addressShoulderAngle_,
            trajectory: this.trajectory_
        };
    }

    /*
        Helper: Gets a vector between two points, flattened to the XY plane (removes Z tilt).
        This simulates looking at the golfer from directly above.
     */
    private getHorizontalVector(p1: THREE.Vector3, p2: THREE.Vector3): THREE.Vector3 {
        const vCandidate = new THREE.Vector3().subVectors(p2, p1);
        vCandidate.z = 0;

        return safeNormal(vCandidate);
    }

    /*
        Helper: Determines if rotation is clockwise or counter clockwise
        From a top-down view (onto XY plane)
        - cross product > 0 counter-clockwise
        - cross product < 0 clockwise
    */
    private isClockwise(from: THREE.Vector3, to: THREE.Vector3): boolean {
        const cross = new THREE.Vector3().crossVectors(from, to);
        return cross.z < 0;
    }

    private reset() {
        this.shoulderRotation_ = 0;
        this.hipRotation_ = 0;
        this.xFactor_ = 0;
        this.topOfSwingFrame_ = 0;
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
    private addressShoulderAngle_: number = 0;
    private trajectory_: SwingTrajectoryPoint[] = [];
}