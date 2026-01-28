import * as THREE from 'three';
import type { SwingTrajectoryPoint, SwingFrame } from '../types';

/**
 * Detects the Impact frame based on velocity and swing phase.
 * 
 * @param trajectory The computed trajectory.
 * @param topOfSwingFrame The previously detected Top of Swing frame index.
 * @returns The estimated impact frame index.
 */
/**
 * Detects the Impact frame based on the lowest point of the virtual club head.
 * 
 * @param trajectory The computed trajectory (metrics).
 * @param frames The raw 3D pose frames.
 * @param topOfSwingFrame The previously detected Top of Swing frame index.
 * @returns The estimated impact frame index.
 */
export function detectImpact(trajectory: SwingTrajectoryPoint[], frames: SwingFrame[], topOfSwingFrame: number): number {
    if (frames.length === 0) return 0;

    // Search range: From Top of Swing to the end of the recording.
    // If TOS is invalid (0), start from beginning, but realistically must be after TOS.
    const startFrame = topOfSwingFrame > 0 ? topOfSwingFrame : 0;

    let highestYValue = -Infinity; // Represents the physical lowest point (max Y in screen coords)
    let impactFrame = startFrame;

    const LEFT_SHOULDER = 11;
    const LEFT_ELBOW = 13;
    const LEFT_WRIST = 15;

    // We want to find the FIRST major low point (Max Y) after Top of Swing.
    // If we just search the whole array, we might find the user dropping the club at the end.
    // Strategy: value should increase (go lower) then decrease (go higher).
    // If we see it go "up" (decrease Y) significantly/consistently, we stop.

    // 1. Find the Peak Wrist Velocity in the Downswing (TOS -> End)
    // This anchors our search to the actual swing event, avoiding early noise.
    let maxVelocity = 0;
    let maxVelFrame = startFrame;

    for (let i = startFrame; i < frames.length; i++) {
        if (trajectory[i]) {
            const v = Math.abs(trajectory[i].wristVelocity);
            if (v > maxVelocity) {
                maxVelocity = v;
                maxVelFrame = i;
            }
        }
    }

    // 2. Define Search Window for Impact (Lowest Point)
    // Impact usually occurs near peak wrist velocity (typically slightly after as wrists unhinge).
    // range: [TOS ... MaxVel + Padding]
    // We limit the end to avoid finding "club drop" at the end of recording.
    const SEARCH_WINDOW_PADDING = 20;
    const searchEnd = Math.min(frames.length, maxVelFrame + SEARCH_WINDOW_PADDING);

    // Reset defaults for the search
    highestYValue = -Infinity; // Lowest physical point
    impactFrame = maxVelFrame; // Default to max vel if we fail? Or startFrame?

    // Scan for lowest point (Max Y)
    // We can probably start searching a bit before maxVelFrame too, or just from TOS?
    // TOS is safe.
    for (let i = startFrame; i < searchEnd; i++) {
        const pose = frames[i];
        if (!pose[LEFT_SHOULDER] || !pose[LEFT_ELBOW] || !pose[LEFT_WRIST]) continue;

        const clubHead = getProbePoint(pose[LEFT_SHOULDER], pose[LEFT_ELBOW], pose[LEFT_WRIST]);
        const currentY = clubHead.y;

        if (currentY > highestYValue) {
            highestYValue = currentY;
            impactFrame = i;
        }
    }

    return impactFrame;
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
