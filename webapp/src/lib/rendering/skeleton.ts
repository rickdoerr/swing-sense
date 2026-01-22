import * as THREE from "three";

export class Skeleton {
    // MediaPipe Pose Landmark Connections (Subset for visual clarity)
    // 11-12 (Shoulders), 11-23 (Left Side), 12-24 (Right Side), 23-24 (Hips)
    // 11-13-15 (Left Arm), 12-14-16 (Right Arm)
    // 23-25-27-29-31 (Left Leg to Foot), 24-26-28-30-32 (Right Leg to Foot)
    private static readonly BONE_CONNECTIONS = [
        [11, 12], // Shoulders
        [11, 23], // Left Torso
        [12, 24], // Right Torso
        [23, 24], // Hips
        [11, 13], [13, 15], // Left Arm
        [12, 14], [14, 16], // Right Arm
        [23, 25], [25, 27], [27, 31], // Left Leg
        [24, 26], [26, 28], [28, 32]  // Right Leg
    ];

    private static readonly JOINT_INDICES = [
        11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28, 31, 32
    ];

    constructor(scene: THREE.Scene) {
        this.scene_ = scene;
        this.group_ = new THREE.Group();
        this.scene_.add(this.group_);
        this.connections_ = [];
        this.joints_ = [];
        this.initSkeleton();
    }

    private initSkeleton(): void {
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x94a3b8,
            linewidth: 1,
            transparent: true,
            opacity: 0.6
        });

        // Initialize reusable line objects for connections
        for (let i = 0; i < Skeleton.BONE_CONNECTIONS.length; i++) {
            const geometry = new THREE.BufferGeometry();
            // Start with zero-length line
            const positions = new Float32Array(6);
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const line = new THREE.Line(geometry, lineMaterial);
            this.connections_.push(line);
            this.group_.add(line);
        }

        // Initialize joints
        const jointGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const jointMaterial = new THREE.MeshBasicMaterial({ color: 0xcbd5e1 });

        for (let i = 0; i < Skeleton.JOINT_INDICES.length; i++) {
            const joint = new THREE.Mesh(jointGeometry, jointMaterial);
            joint.visible = false;
            this.joints_.push(joint);
            this.group_.add(joint);
        }
    }

    update(landmarks: any[]): void {
        if (!landmarks || landmarks.length === 0) {
            this.group_.visible = false;
            return;
        }

        this.group_.visible = true;

        Skeleton.BONE_CONNECTIONS.forEach((pair, index) => {
            const startNode = landmarks[pair[0]];
            const endNode = landmarks[pair[1]];

            if (startNode && endNode) {
                const line = this.connections_[index];
                const positions = line.geometry.attributes.position.array as Float32Array;

                // The body coordinate system that we use is left handed, where +X is right. 
                // Three.js is also left handed, but +Y is up. We're aligning the 3D graph 
                // to our internal body coordinate system here. 
                positions[0] = startNode.x;
                positions[1] = startNode.z; // BodyFrame +Z up -> Three +Y up
                positions[2] = -startNode.y; // BodyFrame +Y forward -> Three -Z forward

                positions[3] = endNode.x;
                positions[4] = endNode.z;
                positions[5] = -endNode.y;

                line.geometry.attributes.position.needsUpdate = true;
                line.visible = true;
            } else {
                this.connections_[index].visible = false;
            }
        });

        // Update Joints
        Skeleton.JOINT_INDICES.forEach((landmarkIndex, i) => {
            const node = landmarks[landmarkIndex];
            if (node) {
                const joint = this.joints_[i];
                joint.position.set(node.x, node.z, -node.y);
                joint.visible = true;
            } else {
                this.joints_[i].visible = false;
            }
        });
    }

    clear(): void {
        this.group_.visible = false;
    }

    dispose(): void {
        this.scene_.remove(this.group_);

        this.connections_.forEach(line => {
            line.geometry.dispose();
            (line.material as THREE.Material).dispose();
        });

        this.joints_.forEach(mesh => {
            mesh.geometry.dispose();
            (mesh.material as THREE.Material).dispose();
        });

        this.connections_ = [];
        this.joints_ = [];
    }

    private scene_: THREE.Scene;
    private group_: THREE.Group;
    private connections_: THREE.Line[];
    private joints_: THREE.Mesh[];

}
