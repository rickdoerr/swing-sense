import * as THREE from 'three';

export type SwingFrame = THREE.Vector3[];

export interface SwingTrajectoryPoint {
    frameIndex: number;
    shoulderRotation: number;
    hipRotation: number;
    xFactor: number;
    wristVelocity: number;
}

export interface SwingMetricsResult {
    shoulderRotation: number;
    hipRotation: number;
    xFactor: number;
    topOfSwingFrame: number;
    impactFrame: number;
    // Indices for visualization: [Mid1, Mid2, Impact] (or similar)
    downswingSequence: number[];
    addressShoulderAngle: number;
    shotClassification: string[];
    trajectory: SwingTrajectoryPoint[];
}
