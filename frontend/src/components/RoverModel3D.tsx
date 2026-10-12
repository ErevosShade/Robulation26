'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface RoverModel3DProps {
  wireframe?: boolean;
  autoRotate?: boolean;
  driving?: boolean;
}

export default function RoverModel3D({
  wireframe = false,
  autoRotate = true,
  driving = true,
}: RoverModel3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const steeringRef = useRef<THREE.Group[]>([]);
  const radarEyeRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 500;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null; // transparent background so cursor grid shines through

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.5, 3.2, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 14;
    controls.minDistance = 2.5;
    controls.target.set(0, 0.2, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.4);
    dirLight1.position.set(5, 8, 5);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa5b4fc, 1.2);
    dirLight2.position.set(-6, 4, -4);
    scene.add(dirLight2);

    const rimLight = new THREE.PointLight(0x38bdf8, 2.5, 10);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Grid Floor
    const grid = new THREE.GridHelper(8, 20, 0x52525b, 0x27272a);
    grid.position.y = -0.7;
    scene.add(grid);

    // Rover Root Group
    const rover = new THREE.Group();
    scene.add(rover);

    // Helper to generate textures
    const createSidePCBTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(canvas);

      ctx.fillStyle = '#f4f4f5';
      ctx.fillRect(0, 0, 512, 256);

      // Perforated hole pattern
      ctx.fillStyle = '#18181b';
      for (let x = 20; x < 500; x += 32) {
        for (let y = 20; y < 240; y += 32) {
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // M.A.R.S. rover branding
      ctx.fillStyle = '#09090b';
      ctx.font = 'bold 36px monospace';
      ctx.fillText('M.A.R.S.', 50, 120);
      ctx.font = 'bold 24px monospace';
      ctx.fillText('rover', 75, 150);

      // Copper logo square
      ctx.fillStyle = '#b45309';
      ctx.fillRect(360, 90, 70, 70);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4;
      ctx.strokeRect(360, 90, 70, 70);

      return new THREE.CanvasTexture(canvas);
    };

    const createTopPCBTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(canvas);

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 512, 512);

      // Circuit gold traces
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3;
      for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        ctx.moveTo(30 + i * 30, 40);
        ctx.lineTo(60 + i * 30, 200);
        ctx.lineTo(120 + i * 20, 450);
        ctx.stroke();
      }

      // Pin header markings
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(180, 320, 140, 50);
      ctx.fillStyle = '#cbd5e1';
      for (let x = 190; x < 310; x += 15) {
        ctx.fillRect(x, 330, 8, 30);
      }

      // "4" logo on top
      ctx.fillStyle = '#1e293b';
      ctx.font = '900 64px monospace';
      ctx.fillText('4', 360, 420);

      return new THREE.CanvasTexture(canvas);
    };

    // Materials
    const whiteChassisMat = new THREE.MeshStandardMaterial({
      color: 0xf4f4f5,
      roughness: 0.35,
      metalness: 0.1,
      wireframe,
    });

    const sidePCBMat = new THREE.MeshStandardMaterial({
      map: createSidePCBTexture(),
      roughness: 0.4,
      metalness: 0.1,
      wireframe,
    });

    const topPCBMat = new THREE.MeshStandardMaterial({
      map: createTopPCBTexture(),
      roughness: 0.4,
      metalness: 0.1,
      wireframe,
    });

    const blackBeamMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.6,
      metalness: 0.4,
      wireframe,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe4e4e7,
      roughness: 0.15,
      metalness: 0.85,
      wireframe,
    });

    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.85,
      metalness: 0.05,
      wireframe,
    });

    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.1,
      wireframe,
    });

    const acrylicMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
      roughness: 0.1,
      transmission: 0.85,
      thickness: 0.6,
      wireframe,
    });

    const servoMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      roughness: 0.3,
      metalness: 0.3,
      wireframe,
    });

    const orangeWireMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.5,
      metalness: 0.1,
    });

    // 1. Central Chassis Body
    const chassisGeo = new THREE.BoxGeometry(1.6, 0.7, 1.4);
    const chassisMaterials = [
      sidePCBMat, // right
      sidePCBMat, // left
      topPCBMat,  // top
      whiteChassisMat, // bottom
      sidePCBMat, // front
      sidePCBMat, // back
    ];
    const chassis = new THREE.Mesh(chassisGeo, chassisMaterials);
    chassis.position.y = 0.55;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    rover.add(chassis);

    // 2. Central Clear Acrylic Module (Micro:bit / Controller cassette)
    const acrylicGeo = new THREE.BoxGeometry(0.18, 0.95, 0.9);
    const acrylicCase = new THREE.Mesh(acrylicGeo, acrylicMat);
    acrylicCase.position.set(0.1, 1.15, 0);
    acrylicCase.rotation.y = Math.PI / 2;
    rover.add(acrylicCase);

    // Circuit inside acrylic case
    const pcbInsideGeo = new THREE.BoxGeometry(0.04, 0.8, 0.8);
    const pcbInside = new THREE.Mesh(
      pcbInsideGeo,
      new THREE.MeshStandardMaterial({ color: 0x047857, metalness: 0.4 })
    );
    pcbInside.position.copy(acrylicCase.position);
    pcbInside.rotation.copy(acrylicCase.rotation);
    rover.add(pcbInside);

    // Top Differential Crossbar with Pivot Nut
    const topBarGeo = new THREE.BoxGeometry(1.3, 0.04, 0.3);
    const topBar = new THREE.Mesh(topBarGeo, blackBeamMat);
    topBar.position.set(0.35, 0.92, 0);
    rover.add(topBar);

    const pivotNut = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.08, 16),
      chromeMat
    );
    pivotNut.position.set(0.35, 0.96, 0);
    rover.add(pivotNut);

    // 3. Ultrasonic Sensor Mast ("Eyes") at the Front
    const mastGroup = new THREE.Group();
    mastGroup.position.set(-0.75, 1.05, -0.3);

    // Mast Bracket
    const mastPcbGeo = new THREE.BoxGeometry(0.08, 0.75, 0.55);
    const mastPcb = new THREE.Mesh(mastPcbGeo, whiteChassisMat);
    mastGroup.add(mastPcb);

    // 2 Cylindrical Sonar Eyes
    const eyeGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.22, 24);
    const eyeMeshGeo = new THREE.CircleGeometry(0.14, 24);
    const eyeMeshMat = new THREE.MeshStandardMaterial({
      color: 0x3f3f46,
      roughness: 0.9,
    });

    [-0.16, 0.16].forEach((zOffset) => {
      const eyeCylinder = new THREE.Mesh(eyeGeo, chromeMat);
      eyeCylinder.rotation.z = Math.PI / 2;
      eyeCylinder.position.set(-0.12, 0.15, zOffset);
      mastGroup.add(eyeCylinder);

      const eyeScreen = new THREE.Mesh(eyeMeshGeo, eyeMeshMat);
      eyeScreen.rotation.y = -Math.PI / 2;
      eyeScreen.position.set(-0.235, 0.15, zOffset);
      mastGroup.add(eyeScreen);
    });

    radarEyeRef.current = mastGroup;
    rover.add(mastGroup);

    // 4. Wheel & Tire Builder
    const createWheel = () => {
      const wheelGroup = new THREE.Group();

      // Outer Rubber Tire
      const tireGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.34, 28);
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.rotation.x = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      // White Inner Spoke Rim
      const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.36, 18);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      wheelGroup.add(rim);

      // Center Axle Chrome Cap
      const capGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.39, 12);
      const cap = new THREE.Mesh(capGeo, chromeMat);
      cap.rotation.x = Math.PI / 2;
      wheelGroup.add(cap);

      // Tread Knobs on Tire Outer Ring
      const treadCount = 12;
      for (let i = 0; i < treadCount; i++) {
        const angle = (i / treadCount) * Math.PI * 2;
        const treadGeo = new THREE.BoxGeometry(0.08, 0.07, 0.35);
        const tread = new THREE.Mesh(treadGeo, tireMat);
        tread.position.set(Math.cos(angle) * 0.38, Math.sin(angle) * 0.38, 0);
        tread.rotation.z = angle;
        wheelGroup.add(tread);
      }

      return wheelGroup;
    };

    // 5. Build Rocker-Bogie Linkages & Wheels (Left & Right)
    wheelsRef.current = [];
    steeringRef.current = [];

    const sides = [1, -1]; // 1 = Left (+z), -1 = Right (-z)

    sides.forEach((side) => {
      const zBase = side * 0.85;

      // Rocker Main Pivot on Chassis Side
      const mainPivot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.14, 16),
        chromeMat
      );
      mainPivot.rotation.x = Math.PI / 2;
      mainPivot.position.set(0.0, 0.55, zBase);
      rover.add(mainPivot);

      // Rocker Arm (Angles forward and downward to bogie pivot)
      const forwardRockerArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.95, 0.1, 0.05),
        blackBeamMat
      );
      forwardRockerArm.position.set(-0.45, 0.38, zBase + side * 0.08);
      forwardRockerArm.rotation.z = 0.35;
      rover.add(forwardRockerArm);

      // Rear Rocker Arm (Angles backward to rear wheel)
      const rearRockerArm = new THREE.Mesh(
        new THREE.BoxGeometry(1.15, 0.1, 0.05),
        blackBeamMat
      );
      rearRockerArm.position.set(0.55, 0.42, zBase + side * 0.08);
      rearRockerArm.rotation.z = -0.28;
      rover.add(rearRockerArm);

      // Bogie Pivot joint
      const bogiePivot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.12, 16),
        chromeMat
      );
      bogiePivot.rotation.x = Math.PI / 2;
      bogiePivot.position.set(-0.85, 0.22, zBase + side * 0.08);
      rover.add(bogiePivot);

      // Bogie beam connecting front & middle wheels
      const bogieBeam = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.09, 0.05),
        blackBeamMat
      );
      bogieBeam.position.set(-0.85, 0.15, zBase + side * 0.12);
      rover.add(bogieBeam);

      // Wheel Positions:
      // Front (steering), Middle (fixed bogie), Rear (steering)
      const wheelConfigs = [
        { x: -1.25, y: -0.1, isSteering: true, name: 'front' },
        { x: -0.45, y: -0.1, isSteering: false, name: 'mid' },
        { x: 1.1, y: -0.1, isSteering: true, name: 'rear' },
      ];

      wheelConfigs.forEach((cfg) => {
        const wheelAssembly = new THREE.Group();
        wheelAssembly.position.set(cfg.x, cfg.y, zBase + side * 0.22);

        if (cfg.isSteering) {
          // Steering Bracket & Micro-Servo
          const bracket = new THREE.Mesh(
            new THREE.BoxGeometry(0.24, 0.28, 0.22),
            blackBeamMat
          );
          bracket.position.set(0, 0.28, 0);
          wheelAssembly.add(bracket);

          const servo = new THREE.Mesh(
            new THREE.BoxGeometry(0.18, 0.2, 0.16),
            servoMat
          );
          servo.position.set(0, 0.32, 0);
          wheelAssembly.add(servo);

          // Coiled ribbon wire on servo
          const wireCoil = new THREE.Mesh(
            new THREE.TorusGeometry(0.12, 0.025, 8, 20),
            orangeWireMat
          );
          wireCoil.position.set(0, 0.36, 0);
          wireCoil.rotation.x = Math.PI / 2;
          wheelAssembly.add(wireCoil);

          // Steering steering group
          const steerGroup = new THREE.Group();
          const wheel = createWheel();
          steerGroup.add(wheel);
          wheelAssembly.add(steerGroup);

          steeringRef.current.push(steerGroup);
          wheelsRef.current.push(wheel);
        } else {
          // Fixed hub for middle wheel
          const axleHub = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.06, 0.14, 12),
            chromeMat
          );
          axleHub.rotation.x = Math.PI / 2;
          axleHub.position.set(0, 0.1, 0);
          wheelAssembly.add(axleHub);

          const wheel = createWheel();
          wheelAssembly.add(wheel);
          wheelsRef.current.push(wheel);
        }

        rover.add(wheelAssembly);
      });
    });

    setLoading(false);

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Update OrbitControls
      controls.update();

      // Auto-rotation around Y axis
      if (autoRotate) {
        rover.rotation.y += delta * 0.45;
      }

      // Wheel Driving Rotation
      if (driving) {
        wheelsRef.current.forEach((wheel) => {
          wheel.rotation.z -= delta * 3.5;
        });

        // Steering wiggle simulation
        steeringRef.current.forEach((steer, idx) => {
          const steerDirection = idx % 2 === 0 ? 1 : -1;
          steer.rotation.y = Math.sin(elapsedTime * 1.5) * 0.25 * steerDirection;
        });
      }

      // Radar scanning sweep
      if (radarEyeRef.current) {
        radarEyeRef.current.rotation.y = Math.sin(elapsedTime * 2.0) * 0.35;
      }

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
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [wireframe, autoRotate, driving]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-zinc-400">
          INITIALIZING M.A.R.S. ROVER 3D GEOMETRY...
        </div>
      )}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
