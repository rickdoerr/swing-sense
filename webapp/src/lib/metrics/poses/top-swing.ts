import type { SwingTrajectoryPoint } from '../types';

/**
 * Detects the Top of Swing (TOS) frame from the computed trajectory.
 * TOS is defined as the point of maximum shoulder rotation before the peak velocity event.
 * 
 * @param trajectory The computed swing trajectory.
 * @returns The frame index of the top of swing.
 */
export function detectTopSwing(trajectory: SwingTrajectoryPoint[]): number {
    if (trajectory.length === 0) return 0;

    // 1. Find Peak Wrist Velocity to limit our search
    // We ignore the first few frames to avoid address noise
    let maxVelocityFrame = 0;
    let maxVelocity = 0;
    const IGNORE_START_FRAMES = 15;

    for (let i = IGNORE_START_FRAMES; i < trajectory.length; i++) {
        const pt = trajectory[i];
        // Ensure we aren't picking up a follow-through high velocity by checking shoulder rotation isn't extreme? 
        // Original logic: Math.abs(pt.shoulderRotation) < 140 (Checking if not in follow through?)
        // Actually, getting high velocity while uncoiling.
        if (Math.abs(pt.wristVelocity) > maxVelocity && Math.abs(pt.shoulderRotation) < 140) {
            maxVelocity = Math.abs(pt.wristVelocity);
            maxVelocityFrame = pt.frameIndex;
        }
    }

    // 2. Find Max Shoulder Rotation BEFORE peak velocity
    // If movement is too slow, search the whole trajectory
    const searchLimitFrame = maxVelocity > 5 ? maxVelocityFrame : trajectory.length;

    let maxShoulderRot = 0;
    let bestFrameIndex = 0;

    // Iterate up to the peak velocity frame
    for (let i = 0; i < trajectory.length; i++) {
        const pt = trajectory[i];
        // We only care about frames before the search limit (peak velocity)
        if (pt.frameIndex >= searchLimitFrame) break;

        if (Math.abs(pt.shoulderRotation) > maxShoulderRot) {
            maxShoulderRot = Math.abs(pt.shoulderRotation);
            bestFrameIndex = pt.frameIndex;
        }
    }

    return bestFrameIndex;
}
