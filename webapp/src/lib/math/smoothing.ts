import * as THREE from 'three';

export function smoothVec3D(history: THREE.Vector3[], newRawPoint: THREE.Vector3, windowSize: number=5): THREE.Vector3 {

	if (windowSize <= 1 || history.length === 0) {
		return newRawPoint; 
	}

	const pointsToAverage = [...history.slice(-(windowSize - 1)), newRawPoint];

	let sumX = 0; 
	let sumY = 0;
	let sumZ = 0; 

	for (const point of pointsToAverage) {
		sumX += point.x; 
		sumY += point.y; 
		sumZ += point.z; 
	}

	return new THREE.Vector3(
		sumX / pointsToAverage.length,
		sumY / pointsToAverage.length,
		sumZ / pointsToAverage.length
	);
}