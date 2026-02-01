import * as THREE from 'three';
import type { SwingTrajectoryPoint, SwingFrame } from '../types';

/**
 * Detects the Impact frame based on velocity and swing phase.
 * Detects the Impact frame based on Wrist Velocity Zero-Crossing.
 * Finds the max velocity after Top of Swing, then the first subsequent frame where velocity <= 0.
 * 
 * @param trajectory The computed trajectory.
 * @param frames The raw 3D pose frames (unused in this strategy).
 * @param topOfSwingFrame The previously detected Top of Swing frame index.
 * @returns The estimated impact frame index.
 */
export function detectImpact(trajectory: SwingTrajectoryPoint[], frames: SwingFrame[], topOfSwingFrame: number): number {
    if (trajectory.length === 0) return 0;

    // Search range: From Top of Swing to the end.
    const startFrame = topOfSwingFrame > 0 ? topOfSwingFrame : 0;

    // 1. Find Peak positive Wrist Velocity in the Downswing
    let maxVelocity = -Infinity;
    let maxVelFrame = startFrame;

    for (let i = startFrame; i < trajectory.length; i++) {
        const v = trajectory[i].wristVelocity;
        if (v > maxVelocity) {
            maxVelocity = v;
            maxVelFrame = i;
        }
    }

    // 2. Find Zero-Crossing (Positive -> Negative or Zero)
    // This represents the point of maximum extension where the wrists stop moving forward relative to the camera frame.
    for (let i = maxVelFrame; i < trajectory.length; i++) {
        if (trajectory[i].wristVelocity <= 0) {
            return i;
        }
    }

    // Fallback
    return maxVelFrame;
}

/**
 * Classifies the shot. Currently a placeholder as we move to visual AI application.
 */
export function classifyShot(frames: SwingFrame[], impactFrameIdx: number, addressPose: SwingFrame): string[] {
    return [];
}

/**
 * Estimates a "Club Head" point by extending the Forearm vector.
 * Ideally, we should use the arm vector (shoulder to wrist) because at impact the arm is straight.
 * But using forearm (elbow->wrist) is also a good approximation for the extension direction.
 */
function getProbePoint(shoulder: THREE.Vector3, elbow: THREE.Vector3, wrist: THREE.Vector3): THREE.Vector3 {
    // Strategy: Vector from Shoulder -> Wrist
    // At impact, the lead arm + club is roughly a straight line.
    const armVector = new THREE.Vector3().subVectors(wrist, shoulder).normalize();

    // An average driver is ~45 inches, arm is ~25 inches. 
    // Ratio ~1.8x. Let's extend by a significant amount to represent the club.
    // Length from wrist.
    const EXTENSION_LENGTH = 1.5; // Meters? Arbitrary units relative to body. 
    // Normalized poses usually have height ~1.8. 0.5 - 1.0 is reasonable club length.

    return wrist.clone().add(armVector.multiplyScalar(0.8)); // 0.8 is a safe bet for club length relative to body scale
}
