import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface InitMessage {
  type: 'init';
  canvas: OffscreenCanvas;
  width: number;
  height: number;
  pixelRatio: number;
  modelPath: string;
}

interface PointerMoveMessage {
  type: 'pointermove';
  x: number;
  y: number;
}

interface ResizeMessage {
  type: 'resize';
  width: number;
  height: number;
}

interface DisposeMessage {
  type: 'dispose';
}

type WorkerMessage = InitMessage | PointerMoveMessage | ResizeMessage | DisposeMessage;

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let modelGroup: THREE.Group | null = null;
let animationId: number | null = null;

const mouseOffset = { x: 0, y: 0 };
const targetMouseOffset = { x: 0, y: 0 };
const clock = new THREE.Clock();

const FIXED_SCALE = 3.6;

function init(data: InitMessage) {
  const { canvas, width, height, pixelRatio, modelPath } = data;

  scene = new THREE.Scene();
  scene.background = null;

  camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(3.8, 2.2, 4.4);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(pixelRatio);

  modelGroup = new THREE.Group();
  modelGroup.rotation.y = 0.45;
  scene.add(modelGroup);

  // Precise CAD Wireframe Edge Material: crisp silver/cyan glow
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.88,
    depthTest: true,
  });

  // Dark Body Occlusion Material: clean mechatronic silhouette
  const occludeMat = new THREE.MeshBasicMaterial({
    color: 0x05070a,
    transparent: true,
    opacity: 0.96,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });

  // Load GLTF Model in Background Worker Thread
  const loader = new GLTFLoader();

  fetch(modelPath)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return res.arrayBuffer();
    })
    .then((arrayBuffer) => {
      loader.parse(
        arrayBuffer,
        '',
        (gltf) => {
          const model = gltf.scene;
          const meshes: THREE.Mesh[] = [];

          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              meshes.push(child as THREE.Mesh);
            }
          });

          for (let i = 0; i < meshes.length; i++) {
            const mesh = meshes[i];
            mesh.material = occludeMat;

            // Generate clean structural wireframe edges with 48° threshold
            const edges = new THREE.EdgesGeometry(mesh.geometry, 48);
            const lineSegments = new THREE.LineSegments(edges, lineMat);
            mesh.add(lineSegments);
          }

          // Compute Bounding Box & Center CAD Assembly
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = FIXED_SCALE / maxDim;

          model.position.x = -center.x * scale;
          model.position.y = -center.y * scale;
          model.position.z = -center.z * scale;
          model.scale.setScalar(scale);

          modelGroup?.add(model);

          // Notify main thread that model is fully loaded and processed
          self.postMessage({ type: 'loaded' });
        },
        (error) => {
          console.error('[Worker] Error parsing GLTF:', error);
          self.postMessage({ type: 'error', error: String(error) });
        }
      );
    })
    .catch((err) => {
      console.error('[Worker] Fetch model error:', err);
      self.postMessage({ type: 'error', error: String(err) });
    });

  // Start Animation Loop in Worker
  animate();
}

function animate() {
  animationId = requestAnimationFrame(animate);

  if (!renderer || !scene || !camera || !modelGroup) return;

  const elapsed = clock.getElapsedTime();

  // Smooth mouse lerp
  mouseOffset.x += (targetMouseOffset.x - mouseOffset.x) * 0.05;
  mouseOffset.y += (targetMouseOffset.y - mouseOffset.y) * 0.05;

  // Continuous Slow Turntable Floating Rotation
  modelGroup.rotation.y = elapsed * 0.16 + mouseOffset.x;
  modelGroup.rotation.x = mouseOffset.y + Math.sin(elapsed * 0.8) * 0.03;
  modelGroup.rotation.z = Math.cos(elapsed * 0.7) * 0.025;

  // Vertical Harmonic Floating / Hover Mimic
  modelGroup.position.y = Math.sin(elapsed * 1.3) * 0.09;

  renderer.render(scene, camera);
}

function handlePointerMove(data: PointerMoveMessage) {
  targetMouseOffset.x = data.x * 0.55;
  targetMouseOffset.y = -data.y * 0.28;
}

function handleResize(data: ResizeMessage) {
  if (!renderer || !camera) return;
  const { width, height } = data;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

function dispose() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  if (renderer) {
    renderer.dispose();
    renderer = null;
  }
  scene = null;
  camera = null;
  modelGroup = null;
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const data = e.data;
  switch (data.type) {
    case 'init':
      init(data);
      break;
    case 'pointermove':
      handlePointerMove(data);
      break;
    case 'resize':
      handleResize(data);
      break;
    case 'dispose':
      dispose();
      break;
  }
};
