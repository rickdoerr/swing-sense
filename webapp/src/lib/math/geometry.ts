import * as THREE from 'three';

/*
      Pose landmarks reference. 
      0 - nose
      1 - left eye (inner)
      2 - left eye
      3 - left eye (outer)
      4 - right eye (inner)
      5 - right eye
      6 - right eye (outer)
      7 - left ear
      8 - right ear
      9 - mouth (left)
      10 - mouth (right)
      11 - left shoulder
      12 - right shoulder
      13 - left elbow
      14 - right elbow
      15 - left wrist
      16 - right wrist
      17 - left pinky
      18 - right pinky
      19 - left index
      20 - right index
      21 - left thumb
      22 - right thumb
      23 - left hip
      24 - right hip
      25 - left knee
      26 - right knee
      27 - left ankle
      28 - right ankle
      29 - left heel
      30 - right heel
      31 - left foot index
      32 - right foot index
*/

// Utility function, in cases when we want to apply "normalize" on a zero vector
export function safeNormal(vector: THREE.Vector3): THREE.Vector3 {
  if (vector.lengthSq() < 1e-6) return new THREE.Vector3(0, 0, 0);

  return vector.clone().normalize();
}

export type BodyFrame = {
  origin: THREE.Vector3; 
  xAxis: THREE.Vector3; 
  yAxis: THREE.Vector3; 
  zAxis: THREE.Vector3; 
}

/*
  Build a 
  X [0, 1] = right  [-1, 0] = left
  Y [0, 1] = forward [-1, 0] = backwards
  Z [0, 1] = up [-1, 0] = down

  @landmarks: taking the pose object which is an array of up to 32 
  {x,y,z,visibility} landmark objects.
  returning either the BodyFrame or a null.
*/
export function buildBodyFrame(landmarks: any[]): BodyFrame | null {
  // For convenience being explicit with the landmarks we're using
  const LEFT_SHOULDER = 11; 
  const RIGHT_SHOULDER = 12; 
  const LEFT_HIP = 23; 
  const RIGHT_HIP = 24; 

  if (!landmarks || landmarks.length <= RIGHT_HIP) return null;

  const leftHip = new THREE.Vector3(
    landmarks[LEFT_HIP].x, 
    landmarks[LEFT_HIP].y,
    landmarks[LEFT_HIP].z
  );

  const rightHip = new THREE.Vector3(
    landmarks[RIGHT_HIP].x, 
    landmarks[RIGHT_HIP].y,
    landmarks[RIGHT_HIP].z
  );

  const leftShoulder = new THREE.Vector3(
    landmarks[LEFT_SHOULDER].x, 
    landmarks[LEFT_SHOULDER].y,
    landmarks[LEFT_SHOULDER].z
  );

  const rightShoulder = new THREE.Vector3(
    landmarks[RIGHT_SHOULDER].x, 
    landmarks[RIGHT_SHOULDER].y,
    landmarks[RIGHT_SHOULDER].z
  );

  // Set coordinate system origin as mid-hip 
  const origin = leftHip.clone().add(rightHip).multiplyScalar(0.5);

  // Z axis or up (+Z) and down (-Z)
  const midShoulder = leftShoulder.clone().add(rightShoulder).multiplyScalar(0.5);
  const zAxisCandidate = new THREE.Vector3().subVectors(midShoulder, origin);
  const zAxis = safeNormal(zAxisCandidate);

  if (zAxis.lengthSq() === 0) return null; 

  // X axis or right (+X) and left (-X)
  const hipVector = new THREE.Vector3().subVectors(rightHip, leftHip);
  const yAxisTemp = new THREE.Vector3().crossVectors(zAxis, hipVector);
  const xAxis = safeNormal(new THREE.Vector3().crossVectors(yAxisTemp, zAxis));

  if (xAxis.lengthSq() === 0) return null; 

  // Y axis or forward (+Y) and backwards (-Y)
  const yAxis = safeNormal(new THREE.Vector3().crossVectors(zAxis, xAxis));

  if (yAxis.lengthSq() === 0) return null; 

  return { origin, xAxis, yAxis, zAxis };
}

/*
  Convert landmarks' coordinate frame to a body frame. 
*/
export function toBodyFrame(landmarks: any[], coordinateFrame: BodyFrame): THREE.Vector3[] {
  const { origin, xAxis, yAxis, zAxis } = coordinateFrame; 

  return landmarks.map((lm) => {
    const v = new THREE.Vector3(lm.x, lm.y, lm.z).sub(origin);
    return new THREE.Vector3(
      v.dot(xAxis),
      v.dot(yAxis),
      v.dot(zAxis)
    );
  });
}



