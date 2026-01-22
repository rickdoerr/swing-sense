import * as THREE from 'three';

// internal dependencies
import { smoothVec3D } from '../math/smoothing';
import { safeNormal } from '../math/geometry';

export class SwingPath {
	constructor(
		extensionFactor: number = 1.2,
		smoothingWindow: number = 6
	) {
		this.extensionFactor_ = extensionFactor;
		this.smoothingWindow_ = smoothingWindow;

		this.trailPoints_ = [];
		this.smoothedPointsHistory_ = [];

		this.bufferCapacity_ = 1000;
		this.positionsBuffer_ = new Float32Array(this.bufferCapacity_ * 3);
	}

	clear(): void {
		this.trailPoints_.length = 0;
		this.smoothedPointsHistory_.length = 0;
		this.bufferCapacity_ = 1000;
		this.positionsBuffer_ = new Float32Array(this.bufferCapacity_ * 3);
	}

	getUpdatedPointsBuffer(): Float32Array {
		return this.positionsBuffer_.slice(0, this.trailPoints_.length * 3);
	}

	update(landmarks: any[]): void {

		const rawElbow = landmarks[14];
		const rawWrist = landmarks[16];
		const rawThumb = landmarks[22];

		if (!rawElbow || !rawWrist) return;

		// The body coordinate system that we use is left handed, where +X is right. 
		// Three.js is also left handed, but +Y is up. We're aligning the 3D graph 
		// to our internal body coordinate system here. 
		const elbow = new THREE.Vector3(rawElbow.x, rawElbow.z, -rawElbow.y);
		const wrist = new THREE.Vector3(rawWrist.x, rawWrist.z, -rawWrist.y);

		const directionCandidate = new THREE.Vector3().subVectors(wrist, elbow);
		const direction = safeNormal(directionCandidate);

		let clubDirection = direction.clone();

		// Use the thumb to determine the hand orientation (radial side)
		// This provides a stable plane reference even if the wrist is straight
		if (rawThumb) {
			const thumb = new THREE.Vector3(rawThumb.x, rawThumb.z, -rawThumb.y);
			const thumbVector = new THREE.Vector3().subVectors(thumb, wrist);
			const rotationAxis = new THREE.Vector3().crossVectors(direction, thumbVector);

			// If axis is valid, rotate the club direction by 40 degrees (away from thumb -> ulnar deviation)
			if (rotationAxis.lengthSq() > 0.0001) {
				rotationAxis.normalize();
				// Rotate 40 degrees (away from thumb) to create the 140 degree angle
				clubDirection.applyAxisAngle(rotationAxis, 40 * (Math.PI / 180));
			}
		}

		// Extend wrist vector by extension factor in the direction of the swing
		const tipPoint = wrist.clone().add(clubDirection.multiplyScalar(this.extensionFactor_));

		const smoothedPoint = smoothVec3D(this.smoothedPointsHistory_, tipPoint, this.smoothingWindow_);

		this.smoothedPointsHistory_.push(smoothedPoint);
		if (this.smoothedPointsHistory_.length > this.smoothingWindow_) {
			this.smoothedPointsHistory_.shift();
		}

		this.trailPoints_.push(smoothedPoint);

		if (this.trailPoints_.length >= this.bufferCapacity_) this.growBuffer();

		const pointsIndex = this.trailPoints_.length - 1;
		const bufferIndex = pointsIndex * 3;
		this.positionsBuffer_[bufferIndex] = this.trailPoints_[pointsIndex].x;
		this.positionsBuffer_[bufferIndex + 1] = this.trailPoints_[pointsIndex].y;
		this.positionsBuffer_[bufferIndex + 2] = this.trailPoints_[pointsIndex].z;
	}

	private growBuffer(): void {
		const newCapacity = this.bufferCapacity_ * 2;
		const newBuffer = new Float32Array(newCapacity * 3);

		newBuffer.set(this.positionsBuffer_.subarray(0, this.trailPoints_.length * 3));

		this.positionsBuffer_ = newBuffer;
		this.bufferCapacity_ = newCapacity;
	}

	private extensionFactor_: number;
	private smoothingWindow_: number;
	private trailPoints_: THREE.Vector3[];
	private smoothedPointsHistory_: THREE.Vector3[];
	private bufferCapacity_: number;
	private positionsBuffer_: Float32Array;

}