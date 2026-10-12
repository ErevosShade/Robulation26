'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function RoverWireframe3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 500;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(4.0, 2.5, 4.6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Root Group for the NASA Rover
    const roverGroup = new THREE.Group();
    roverGroup.rotation.y = 0.35;
    scene.add(roverGroup);

    // CAD Wireframe Materials: Crisp clean white lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      depthTest: true,
    });

    // High-opacity dark body (0.97) to cleanly occlude messy interior/back-face wireframes
    const occludeMat = new THREE.MeshBasicMaterial({
      color: 0x05070a,
      transparent: true,
      opacity: 0.97,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    // Balanced scale: little bigger than 3.2
    const FIXED_SCALE = 3.7;

    // Load Official NASA Curiosity Rover 3D Model
    const loader = new GLTFLoader();
    loader.load(
      '/curiosity.glb',
      (gltf) => {
        const model = gltf.scene;

        // Traverse all meshes and simplify geometry:
        // Use threshold angle of 48 degrees to keep clean structural lines
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = occludeMat;

            const edges = new THREE.EdgesGeometry(mesh.geometry, 48);
            const lineSegments = new THREE.LineSegments(edges, lineMat);
            mesh.add(lineSegments);
          }
        });

        // Compute Bounding Box & Center NASA Rover with Balanced Scale
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = FIXED_SCALE / maxDim;

        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale;
        model.position.z = -center.z * scale;
        model.scale.setScalar(scale);

        roverGroup.add(model);
        setLoaded(true);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadingProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (err) => {
        console.error('Failed to load curiosity.glb:', err);
      }
    );

    // Cursor tracking: Rover turns towards cursor direction
    const targetRotation = { x: 0, y: 0.35 };

    const onPointerMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;

      targetRotation.y = 0.35 + nx * 0.75;
      targetRotation.x = -ny * 0.35;
    };

    window.addEventListener('mousemove', onPointerMove);

    // Animation Loop: Smooth lerp towards cursor look direction
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      roverGroup.rotation.y += (targetRotation.y - roverGroup.rotation.y) * 0.06;
      roverGroup.rotation.x += (targetRotation.x - roverGroup.rotation.x) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 font-mono text-xs text-zinc-400 z-10 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="tracking-widest uppercase">
              CALIBRATING NASA CURIOSITY SCHEMATIC... {loadingProgress}%
            </span>
          </div>
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-200"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      )}
      <div
        ref={mountRef}
        className="w-full h-full flex items-center justify-center pointer-events-none"
      />
    </div>
  );
}
