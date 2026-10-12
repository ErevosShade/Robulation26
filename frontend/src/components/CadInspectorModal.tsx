'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { X, RotateCw, Box, Eye, Layers, Maximize2, Activity } from 'lucide-react';
import DecryptedText from '@/components/DecryptedText';

interface CadInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  specs: string;
  tag: string;
  modelPath: string;
  accentColor?: string;
}

export default function CadInspectorModal({
  isOpen,
  onClose,
  title,
  specs,
  tag,
  modelPath,
  accentColor = '#FF9FFC',
}: CadInspectorModalProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframeOnly, setWireframeOnly] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [telemetry, setTelemetry] = useState<{ yaw: number; pitch: number; zoom: number }>({
    yaw: 0,
    pitch: 0,
    zoom: 100,
  });
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Keep state refs for Three.js render loop
  const wireframeRef = useRef(wireframeOnly);
  wireframeRef.current = wireframeOnly;
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const mount = mountRef.current;
    if (!mount) return;

    setIsLoaded(false);
    setLoadingProgress(10);

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(3.5, 2.0, 4.2);
    camera.lookAt(0, 0, 0);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 3. Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x5227ff, 1.8);
    dirLight2.position.set(-6, -4, -5);
    scene.add(dirLight2);

    // 4. Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Line material & Occlude material
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      depthTest: true,
    });

    const occludeMat = new THREE.MeshStandardMaterial({
      color: 0x060913,
      metalness: 0.8,
      roughness: 0.25,
      transparent: true,
      opacity: 0.94,
    });

    const wireframeLines: THREE.LineSegments[] = [];
    const solidMeshes: THREE.Mesh[] = [];

    // 5. Load GLTF
    let isCancelled = false;
    const loader = new GLTFLoader();

    loader.load(
      modelPath,
      (gltf) => {
        if (isCancelled) return;
        const model = gltf.scene;

        setLoadingProgress(60);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            solidMeshes.push(mesh);
            mesh.material = occludeMat;

            // Generate clean structural wireframe edges
            const edges = new THREE.EdgesGeometry(mesh.geometry, 42);
            const line = new THREE.LineSegments(edges, lineMat);
            line.visible = true;
            mesh.add(line);
            wireframeLines.push(line);
          }
        });

        // Compute Bounding Box & Center
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.4 / (maxDim || 1);

        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale;
        model.position.z = -center.z * scale;
        model.scale.setScalar(scale);

        modelGroup.add(model);
        setLoadingProgress(100);
        setIsLoaded(true);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadingProgress(Math.round((xhr.loaded / xhr.total) * 90));
        }
      },
      (err) => {
        console.error('Failed to load 3D CAD model:', err);
      }
    );

    // 6. Interactive Drag & Zoom Controls
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let currentRotationY = 0;
    let currentRotationX = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let zoomDistance = 4.2;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      prevMousePos = { x: e.clientX, y: e.clientY };

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;
      // Clamp pitch
      targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomDistance += e.deltaY * 0.003;
      zoomDistance = Math.max(2.0, Math.min(7.0, zoomDistance));
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });

    // Touch controls
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMousePos.x;
        const deltaY = e.touches[0].clientY - prevMousePos.y;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        targetRotationY += deltaX * 0.01;
        targetRotationX += deltaY * 0.01;
      }
    };
    const onTouchEnd = () => {
      isDragging = false;
    };

    domEl.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // 7. Render Loop with Floating Harmonic Bobbing
    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Continuous turntable float rotation if autoRotate is true and not dragging
      if (autoRotateRef.current && !isDragging) {
        targetRotationY += 0.005;
      }

      // Smooth dampening
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;

      modelGroup.rotation.y = currentRotationY;
      modelGroup.rotation.x = currentRotationX + Math.sin(elapsed * 0.8) * 0.02;
      modelGroup.rotation.z = Math.cos(elapsed * 0.7) * 0.015;

      // Vertical Harmonic Hover Bobbing
      modelGroup.position.y = Math.sin(elapsed * 1.4) * 0.06;

      // Camera distance lerp
      camera.position.z += (zoomDistance - camera.position.z) * 0.1;

      // Toggle wireframe mode visibility
      wireframeLines.forEach((line) => {
        line.visible = wireframeRef.current;
      });

      // Update telemetry display occasionally
      setTelemetry({
        yaw: Math.round(((currentRotationY * 180) / Math.PI) % 360),
        pitch: Math.round((currentRotationX * 180) / Math.PI),
        zoom: Math.round((4.2 / camera.position.z) * 100),
      });

      renderer.render(scene, camera);
    };

    animate();

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
      isCancelled = true;
      cancelAnimationFrame(animationId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('wheel', onWheel);
      domEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [isOpen, modelPath]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      {/* Outer Shell: Double-Bezel Precision Glass Container */}
      <div className="relative w-full max-w-5xl h-[85vh] max-h-[760px] rounded-[1.75rem] p-1.5 bg-gradient-to-b from-white/20 via-[#5227FF]/20 to-white/10 shadow-[0_0_50px_rgba(82,39,255,0.35)] flex flex-col overflow-hidden">
        {/* Inner Core Shell */}
        <div className="relative w-full h-full rounded-[calc(1.75rem-0.375rem)] bg-[#03060c]/95 border border-white/10 flex flex-col overflow-hidden">
          {/* Top Aerospace Telemetry Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: accentColor }}
              />
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 block">
                  MECHATRONIC CAD TELEMETRY // 3D INSPECTOR
                </span>
                <h3 className="font-modern font-black text-lg sm:text-xl text-white uppercase tracking-tight">
                  {title}
                </h3>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Wireframe Toggle */}
              <button
                type="button"
                onClick={() => setWireframeOnly(!wireframeOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer border ${
                  wireframeOnly
                    ? 'bg-[#5227FF]/30 border-[#FF9FFC]/40 text-[#FF9FFC] shadow-[0_0_10px_rgba(255,159,252,0.2)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
                title="Toggle Wireframe Edges"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CAD Edges</span>
              </button>

              {/* Auto Rotate Toggle */}
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer border ${
                  autoRotate
                    ? 'bg-white/10 border-white/30 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
                title="Toggle Turntable Rotation"
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Float</span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer ml-2"
                title="Close Inspector (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3D Viewport Canvas Container */}
          <div className="relative flex-1 w-full h-full bg-[#020409] overflow-hidden cursor-grab active:cursor-grabbing">
            {/* Background Grid Pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '36px 36px',
              }}
            />

            {/* Loading Indicator */}
            {!isLoaded && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#03060c]/80 backdrop-blur-xs">
                <div className="w-10 h-10 border-2 border-white/20 border-t-[#FF9FFC] rounded-full animate-spin" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#FF9FFC]">
                  STREAMING CAD MESH ({loadingProgress}%)
                </span>
              </div>
            )}

            {/* Mounting div for Three.js */}
            <div ref={mountRef} className="w-full h-full" />

            {/* HUD Reticles & Targeting Crosshairs */}
            <div className="absolute top-4 left-4 pointer-events-none font-mono text-[9px] text-slate-400 space-y-1">
              <div className="text-[#FF9FFC] font-bold">STATUS: TELEMETRY STREAM ONLINE</div>
              <div>YAW: {telemetry.yaw}&deg; &bull; PITCH: {telemetry.pitch}&deg;</div>
              <div>MAGNIFICATION: {telemetry.zoom}%</div>
              <div>CAD ORBIT ENGINE // 60 FPS VECTOR PIPELINE</div>
            </div>

            <div className="absolute bottom-4 left-4 pointer-events-none flex items-center gap-2">
              <span
                className="font-mono text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border shadow-xs"
                style={{
                  color: accentColor,
                  borderColor: `${accentColor}50`,
                  backgroundColor: `${accentColor}15`,
                }}
              >
                {tag}
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {specs}
              </span>
            </div>

            {/* Corner Crosshairs */}
            <div className="absolute top-4 right-4 pointer-events-none font-mono text-[10px] text-slate-500">
              [CAD-3D-VIEW]
            </div>
            <div className="absolute bottom-4 right-4 pointer-events-none flex items-center gap-2 font-mono text-[10px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE GLTF RENDER</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
