'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface RoverWireframe3DProps {
  modelPath?: string;
  onProgress?: (progress: number, stage: string) => void;
  onLoaded?: () => void;
}

export default function RoverWireframe3D({
  modelPath = '/curiosity.glb',
  onProgress,
  onLoaded,
}: RoverWireframe3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Purge any stale canvas elements from previous mounts (e.g. React StrictMode)
    container.innerHTML = '';

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    let isDisposed = false;
    let worker: Worker | null = null;
    let mainRenderer: THREE.WebGLRenderer | null = null;
    let mainAnimationId: number | null = null;

    // Dynamically create a brand-new canvas for this mount lifecycle
    let activeCanvas = document.createElement('canvas');
    activeCanvas.className = 'w-full h-full pointer-events-none transition-opacity duration-700 opacity-0 block';
    container.appendChild(activeCanvas);

    const markLoaded = () => {
      activeCanvas.classList.remove('opacity-0');
      activeCanvas.classList.add('opacity-100');
      setLoaded(true);
      onLoaded?.();
    };

    // =========================================================================
    // 1. OFF-MAIN-THREAD WORKER EXECUTION (OffscreenCanvas)
    // Runs Three.js rendering, GLTF parsing & EdgesGeometry off the main thread.
    // =========================================================================
    const supportsOffscreen =
      typeof activeCanvas.transferControlToOffscreen === 'function' &&
      typeof Worker !== 'undefined';

    let workerStarted = false;

    if (supportsOffscreen) {
      try {
        // Instantiate the Worker FIRST before transferring control.
        // If worker instantiation fails, canvas has NOT been transferred.
        const w = new Worker(new URL('../workers/rover.worker.ts', import.meta.url), {
          type: 'module',
        });

        const offscreen = activeCanvas.transferControlToOffscreen();
        worker = w;
        workerStarted = true;

        worker.onmessage = (e: MessageEvent<{ type: string; error?: string }>) => {
          if (isDisposed) return;
          if (e.data.type === 'loaded') {
            markLoaded();
          } else if (e.data.type === 'error') {
            console.error('[RoverWireframe3D] Worker reported error:', e.data.error);
          }
        };

        const absoluteModelUrl = new URL(modelPath, window.location.href).href;

        worker.postMessage(
          {
            type: 'init',
            canvas: offscreen,
            width,
            height,
            pixelRatio,
            modelPath: absoluteModelUrl,
          },
          [offscreen]
        );

        const onPointerMove = (e: MouseEvent) => {
          if (!worker || isDisposed) return;
          const nx = (e.clientX / window.innerWidth) * 2 - 1;
          const ny = (e.clientY / window.innerHeight) * 2 - 1;
          worker.postMessage({ type: 'pointermove', x: nx, y: ny });
        };

        const handleResize = () => {
          if (!worker || isDisposed || !container) return;
          const w = container.clientWidth || 800;
          const h = container.clientHeight || 500;
          worker.postMessage({ type: 'resize', width: w, height: h });
        };

        window.addEventListener('mousemove', onPointerMove, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
          isDisposed = true;
          window.removeEventListener('mousemove', onPointerMove);
          window.removeEventListener('resize', handleResize);
          if (worker) {
            worker.postMessage({ type: 'dispose' });
            worker.terminate();
            worker = null;
          }
          if (container.contains(activeCanvas)) {
            container.removeChild(activeCanvas);
          }
        };
      } catch (err) {
        console.warn(
          '[RoverWireframe3D] OffscreenCanvas worker initialization failed, switching to main thread fallback:',
          err
        );
        // If canvas was already transferred before the error was thrown, remove it
        if (container.contains(activeCanvas)) {
          container.removeChild(activeCanvas);
        }
      }
    }

    // =========================================================================
    // 2. MAIN-THREAD FALLBACK (If OffscreenCanvas or Worker is unavailable)
    // =========================================================================
    if (!workerStarted) {
      // Create a fresh, untransferred canvas for the main thread WebGLRenderer
      activeCanvas = document.createElement('canvas');
      activeCanvas.className = 'w-full h-full pointer-events-none transition-opacity duration-700 opacity-0 block';
      container.appendChild(activeCanvas);

      const scene = new THREE.Scene();
      scene.background = null;

      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(3.8, 2.2, 4.4);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({
        canvas: activeCanvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      mainRenderer = renderer;
      renderer.setSize(width, height);
      renderer.setPixelRatio(pixelRatio);

      const modelGroup = new THREE.Group();
      modelGroup.rotation.y = 0.45;
      scene.add(modelGroup);

      const lineMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.88,
        depthTest: true,
      });

      const occludeMat = new THREE.MeshBasicMaterial({
        color: 0x05070a,
        transparent: true,
        opacity: 0.96,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      });

      const FIXED_SCALE = 3.6;
      const loader = new GLTFLoader();

      loader.load(
        modelPath,
        (gltf) => {
          if (isDisposed) return;
          const model = gltf.scene;

          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.material = occludeMat;
              const edges = new THREE.EdgesGeometry(mesh.geometry, 48);
              const lineSegments = new THREE.LineSegments(edges, lineMat);
              mesh.add(lineSegments);
            }
          });

          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = FIXED_SCALE / maxDim;

          model.position.x = -center.x * scale;
          model.position.y = -center.y * scale;
          model.position.z = -center.z * scale;
          model.scale.setScalar(scale);

          modelGroup.add(model);
          markLoaded();
        },
        undefined,
        (err) => console.error('[RoverWireframe3D] Fallback 3D loader error:', err)
      );

      const clock = new THREE.Clock();
      const mouseOffset = { x: 0, y: 0 };
      const targetMouseOffset = { x: 0, y: 0 };

      const onPointerMove = (e: MouseEvent) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        targetMouseOffset.x = nx * 0.55;
        targetMouseOffset.y = -ny * 0.28;
      };

      window.addEventListener('mousemove', onPointerMove, { passive: true });

      const animate = () => {
        mainAnimationId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        mouseOffset.x += (targetMouseOffset.x - mouseOffset.x) * 0.05;
        mouseOffset.y += (targetMouseOffset.y - mouseOffset.y) * 0.05;

        modelGroup.rotation.y = elapsed * 0.16 + mouseOffset.x;
        modelGroup.rotation.x = mouseOffset.y + Math.sin(elapsed * 0.8) * 0.03;
        modelGroup.rotation.z = Math.cos(elapsed * 0.7) * 0.025;
        modelGroup.position.y = Math.sin(elapsed * 1.3) * 0.09;

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!container || isDisposed) return;
        const w = container.clientWidth || 800;
        const h = container.clientHeight || 500;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize, { passive: true });

      return () => {
        isDisposed = true;
        if (mainAnimationId !== null) {
          cancelAnimationFrame(mainAnimationId);
        }
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('resize', handleResize);
        if (mainRenderer) {
          mainRenderer.dispose();
        }
        if (container.contains(activeCanvas)) {
          container.removeChild(activeCanvas);
        }
      };
    }
  }, [modelPath, onLoaded]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none pointer-events-none"
    />
  );
}
