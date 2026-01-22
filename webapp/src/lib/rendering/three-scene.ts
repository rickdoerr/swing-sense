import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export interface ThreeSceneOptions {
	background?: number;
	cameraPosition?: [number, number, number];
	cameraFov?: number;
	enableGrid?: boolean;
	enableAxes?: boolean;
	enableLights?: boolean;
	enableControls?: boolean;
	cameraType?: 'perspective' | 'orthographic';
}

const DEFAULT_OPTIONS: Required<ThreeSceneOptions> = {
	background: 0x0f172a,
	cameraPosition: [0, 0.5, 2],
	cameraFov: 75,
	enableGrid: true,
	enableAxes: true,
	enableLights: true,
	enableControls: true,
	cameraType: 'perspective'
};

export class ThreeScene {

	constructor(canvas: HTMLCanvasElement, options: ThreeSceneOptions = {}) {
		this.canvas_ = canvas;
		this.options_ = { ...DEFAULT_OPTIONS, ...options };
		this.isInitialized_ = false;
		this.animationFrameId_ = null;
		this.onWindowResizeBound_ = this.onWindowResize.bind(this);
	}

	init(): void {
		if (this.isInitialized_) return;

		this.setupScene();
		this.setupCamera();
		this.setupRenderer();
		this.setupControls();
		this.setupHelpers();

		window.addEventListener('resize', this.onWindowResizeBound_);

		this.isInitialized_ = true;
	}

	animate(): void {
		if (this.animationFrameId_ !== null) return; // Already animating
		this.animationLoop();
	}

	dispose(): void {
		if (!this.isInitialized_) return;

		this.stopAnimation();
		this.controls_?.dispose();
		this.renderer_?.dispose();
		window.removeEventListener('resize', this.onWindowResizeBound_);

		this.isInitialized_ = false;
	}

	getScene(): THREE.Scene {
		return this.scene_;
	}

	getCamera(): THREE.Camera {
		return this.camera_;
	}

	getRenderer(): THREE.WebGLRenderer {
		return this.renderer_;
	}

	stopAnimation(): void {
		if (this.animationFrameId_ !== null) {
			cancelAnimationFrame(this.animationFrameId_);
			this.animationFrameId_ = null;
		}
	}

	private setupScene(): void {
		this.scene_ = new THREE.Scene();
		this.scene_.background = new THREE.Color(this.options_.background);
	}

	private setupCamera(): void {

		const width = this.canvas_.clientWidth;
		const height = this.canvas_.clientHeight;

		if (this.options_.cameraType === 'orthographic') {
			this.camera_ = new THREE.OrthographicCamera(
				0,
				width,
				height,
				0,
				0.1,
				1000
			);

			this.camera_.position.set(0, 0, 10);
			this.camera_.lookAt(0, 0, 0);
		} else {
			const aspect = this.canvas_.clientWidth / this.canvas_.clientHeight;
			this.camera_ = new THREE.PerspectiveCamera(
				this.options_.cameraFov,
				aspect,
				0.1,
				2000
			);

			const [x, y, z] = this.options_.cameraPosition;
			this.camera_.position.set(x, y, z);
		}
	}

	private setupRenderer(): void {
		this.renderer_ = new THREE.WebGLRenderer({
			canvas: this.canvas_,
			antialias: true
		});
		this.renderer_.setSize(this.canvas_.clientWidth, this.canvas_.clientHeight);
	}

	private setupControls(): void {
		if (this.options_.enableControls) {
			this.controls_ = new OrbitControls(this.camera_, this.renderer_.domElement);
			this.controls_.enableDamping = true;
			this.controls_.dampingFactor = 0.05;
		}
	}

	private setupHelpers(): void {
		if (this.options_.enableLights) {
			const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
			this.scene_.add(ambientLight);

			const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
			directionalLight.position.set(0, 1, 1);
			this.scene_.add(directionalLight);
		}

		if (this.options_.enableGrid) {
			const gridHelper = new THREE.GridHelper(2, 10, 0x475569, 0x475569);
			this.scene_.add(gridHelper);
		}

		if (this.options_.enableAxes) {
			const axesHelper = new THREE.AxesHelper(0.5);
			this.scene_.add(axesHelper);
		}
	}

	private animationLoop(): void {
		this.animationFrameId_ = requestAnimationFrame(() => this.animationLoop());

		if (this.controls_) {
			this.controls_.update();
		}

		this.renderer_.render(this.scene_, this.camera_);
	}

	private onWindowResize(): void {
		const width = this.canvas_.clientWidth;
		const height = this.canvas_.clientHeight;

		if (this.options_.cameraType === 'orthographic') {
			(this.camera_ as THREE.OrthographicCamera).left = 0;
			(this.camera_ as THREE.OrthographicCamera).right = width;
			(this.camera_ as THREE.OrthographicCamera).top = height;
			(this.camera_ as THREE.OrthographicCamera).bottom = 0;
			(this.camera_ as THREE.OrthographicCamera).updateProjectionMatrix();

		} else {
			(this.camera_ as THREE.PerspectiveCamera).aspect = width / height;
			(this.camera_ as THREE.PerspectiveCamera).updateProjectionMatrix();
		}

		this.renderer_.setSize(this.canvas_.clientWidth, this.canvas_.clientHeight);
	}

	private scene_!: THREE.Scene;
	private camera_!: THREE.Camera;
	private renderer_!: THREE.WebGLRenderer;
	private controls_?: OrbitControls;
	private canvas_: HTMLCanvasElement;
	private options_: Required<ThreeSceneOptions>;
	private animationFrameId_: number | null;
	private isInitialized_: boolean;
	private onWindowResizeBound_: () => void;

}
