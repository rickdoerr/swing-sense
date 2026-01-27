import * as THREE from 'three';
import type { SwingTrajectoryPoint, SwingFrame } from '../types';

/**
 * Detects the Impact frame based on velocity and swing phase.
 * 
 * @param trajectory The computed trajectory.
 * @param topOfSwingFrame The previously detected Top of Swing frame index.
 * @returns The estimated impact frame index.
 */
export function detectImpact(trajectory: SwingTrajectoryPoint[], topOfSwingFrame: number): number {
    if (trajectory.length === 0) return 0;

    // 1. Initial Candidate: Global max velocity (calculated again or passed in? Let's recalculate simply)
    // We want the peak velocity, but specifically the downswing one.
    let maxVelocity = 0;
    let maxVelocityFrame = 0;

    // Find global max velocity first to have a baseline
    for (const pt of trajectory) {
        if (Math.abs(pt.wristVelocity) > maxVelocity) {
            maxVelocity = Math.abs(pt.wristVelocity);
            maxVelocityFrame = pt.frameIndex;
        }
    }

    let impactFrameCandidate = maxVelocityFrame;

    // 2. Refine: Impact MUST be after Top of Swing
    if (impactFrameCandidate < topOfSwingFrame) {
        // Search for local max velocity strictly after TOS
        let maxVelAfterTOS = 0;
        let maxVelFrameAfterTOS = topOfSwingFrame;

        // Find the index in trajectory corresponding to topOfSwingFrame
        // (Assuming trajectory is ordered by frameIndex, which it is)
        // Optimization: iterate directly
        for (const pt of trajectory) {
            if (pt.frameIndex <= topOfSwingFrame) continue;

            if (Math.abs(pt.wristVelocity) > maxVelAfterTOS) {
                maxVelAfterTOS = Math.abs(pt.wristVelocity);
                maxVelFrameAfterTOS = pt.frameIndex;
            }
        }
        impactFrameCandidate = maxVelFrameAfterTOS;
    }

    return impactFrameCandidate;
}

/**
 * Classifies the shot. Currently a placeholder as we move to visual AI application.
 */
export function classifyShot(frames: SwingFrame[], impactFrameIdx: number, addressPose: SwingFrame): string[] {
    return [];
}

/**
 * Estimates a "Club Head" point by extending the Forearm vector.
 */
function getProbePoint(shoulder: THREE.Vector3, elbow: THREE.Vector3, wrist: THREE.Vector3): THREE.Vector3 {
    const forearm = new THREE.Vector3().subVectors(wrist, elbow).normalize();
    const EXTENSION = 1.0;
    return wrist.clone().add(forearm.multiplyScalar(EXTENSION));
}
