'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RoboconBot3DProps {
  onProgress?: (progress: number, stage: string) => void;
  onLoaded?: () => void;
}

export default function RoboconBot3D({
  onProgress,
  onLoaded,
}: RoboconBot3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 500;

    onProgress?.(30, 'INITIALIZING OMNI-DRIVE CHASSIS');

    // 1. Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(3.4, 2.6, 4.4);
    camera.lookAt(0, 0.1, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Root Group
    const botGroup = new THREE.Group();
    botGroup.rotation.y = 0.4;
    scene.add(botGroup);

    // Materials: High-contrast CAD wireframe + dark occluding mesh
    const whiteLineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      depthTest: true,
    });

    const cyanLineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9,
      depthTest: true,
    });

    const emeraldLineMat = new THREE.LineBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.9,
      depthTest: true,
    });

    const darkBodyMat = new THREE.MeshBasicMaterial({
      color: 0x070b14,
      transparent: true,
      opacity: 0.96,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    const darkAccentMat = new THREE.MeshBasicMaterial({
      color: 0x0c1424,
      transparent: true,
      opacity: 0.98,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    const makeCadMesh = (
      geo: THREE.BufferGeometry,
      lineMat = whiteLineMat,
      meshMat = darkBodyMat,
      thresh = 28
    ) => {
      const group = new THREE.Group();
      const mesh = new THREE.Mesh(geo, meshMat);
      const edges = new THREE.EdgesGeometry(geo, thresh);
      const lines = new THREE.LineSegments(edges, lineMat);
      group.add(mesh);
      group.add(lines);
      return group;
    };

    // 2. Main Holonomic Robocon Chassis Base (Octagonal Low-Profile Armor)
    const chassisBase = makeCadMesh(
      new THREE.CylinderGeometry(1.6, 1.8, 0.45, 8),
      whiteLineMat,
      darkBodyMat
    );
    chassisBase.position.y = 0.35;
    botGroup.add(chassisBase);

    // Upper Electronics Deck (Carbon-Fiber Hex Tray)
    const deckPlate = makeCadMesh(
      new THREE.CylinderGeometry(1.4, 1.4, 0.22, 6),
      cyanLineMat,
      darkAccentMat
    );
    deckPlate.position.y = 0.68;
    botGroup.add(deckPlate);

    // 3. Four 45-Degree Holonomic Omni-Wheels (Signature Robocon Bot Mechatronics)
    const wheels: THREE.Group[] = [];
    const wheelAngles = [
      Math.PI / 4,
      (3 * Math.PI) / 4,
      (5 * Math.PI) / 4,
      (7 * Math.PI) / 4,
    ];

    wheelAngles.forEach((ang) => {
      const wheelMount = new THREE.Group();
      wheelMount.position.set(Math.cos(ang) * 1.6, 0.25, Math.sin(ang) * 1.6);
      wheelMount.rotation.y = -ang;

      // Wheel Rim
      const wheelRim = makeCadMesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.26, 16),
        whiteLineMat,
        darkAccentMat
      );
      wheelRim.rotation.z = Math.PI / 2;
      wheelMount.add(wheelRim);

      // Hub Motor Hub
      const motorHub = makeCadMesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.32, 12),
        cyanLineMat,
        darkBodyMat
      );
      motorHub.rotation.z = Math.PI / 2;
      wheelMount.add(motorHub);

      botGroup.add(wheelMount);
      wheels.push(wheelMount);
    });

    onProgress?.(65, 'ASSEMBLING LIDAR TURRET & GRIPPER');

    // 4. Center High-Speed Rotating LIDAR Sensor Turret
    const lidarPod = new THREE.Group();
    lidarPod.position.set(0, 0.95, 0);
    botGroup.add(lidarPod);

    const lidarBase = makeCadMesh(
      new THREE.CylinderGeometry(0.5, 0.6, 0.3, 16),
      cyanLineMat,
      darkBodyMat
    );
    lidarPod.add(lidarBase);

    const lidarRotor = makeCadMesh(
      new THREE.CylinderGeometry(0.38, 0.42, 0.35, 16),
      whiteLineMat,
      darkAccentMat
    );
    lidarRotor.position.y = 0.32;
    lidarPod.add(lidarRotor);

    // Optical Laser Emitter Aperture
    const laserAperture = makeCadMesh(
      new THREE.BoxGeometry(0.15, 0.12, 0.32),
      emeraldLineMat,
      darkBodyMat
    );
    laserAperture.position.set(0.25, 0.32, 0);
    lidarRotor.add(laserAperture);

    // Dynamic 360-Degree Sweeping LIDAR Beam (Visual Projection Cone)
    const lidarBeamGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(2.5, 0.4, 1.2),
      new THREE.Vector3(2.5, -0.4, 1.2),
      new THREE.Vector3(0, 0, 0),
    ]);
    const lidarBeamMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    const lidarBeam = new THREE.Line(lidarBeamGeo, lidarBeamMat);
    lidarRotor.add(lidarBeam);

    // 5. Front Dual Pneumatic Gripper Arms (Pick & Place Manipulator)
    const frontManipulator = new THREE.Group();
    frontManipulator.position.set(0, 0.55, 1.35);
    botGroup.add(frontManipulator);

    // Gripper Base Rail
    const railMount = makeCadMesh(
      new THREE.BoxGeometry(1.2, 0.16, 0.28),
      whiteLineMat,
      darkAccentMat
    );
    frontManipulator.add(railMount);

    // Left Gripper Claw
    const leftClaw = new THREE.Group();
    leftClaw.position.set(-0.4, 0, 0.3);
    const leftArm1 = makeCadMesh(
      new THREE.BoxGeometry(0.12, 0.16, 0.6),
      cyanLineMat,
      darkBodyMat
    );
    leftClaw.add(leftArm1);
    const leftPincer = makeCadMesh(
      new THREE.BoxGeometry(0.1, 0.14, 0.3),
      whiteLineMat,
      darkBodyMat
    );
    leftPincer.position.set(0.12, 0, 0.38);
    leftPincer.rotation.y = 0.5;
    leftClaw.add(leftPincer);
    frontManipulator.add(leftClaw);

    // Right Gripper Claw
    const rightClaw = new THREE.Group();
    rightClaw.position.set(0.4, 0, 0.3);
    const rightArm1 = makeCadMesh(
      new THREE.BoxGeometry(0.12, 0.16, 0.6),
      cyanLineMat,
      darkBodyMat
    );
    rightClaw.add(rightArm1);
    const rightPincer = makeCadMesh(
      new THREE.BoxGeometry(0.1, 0.14, 0.3),
      whiteLineMat,
      darkBodyMat
    );
    rightPincer.position.set(-0.12, 0, 0.38);
    rightPincer.rotation.y = -0.5;
    rightClaw.add(rightPincer);
    frontManipulator.add(rightClaw);

    // 6. Rear Dual Battery Packs & CAN-Bus Inverter
    const rearPower = new THREE.Group();
    rearPower.position.set(0, 0.62, -1.05);
    const battery1 = makeCadMesh(
      new THREE.BoxGeometry(0.65, 0.35, 0.4),
      whiteLineMat,
      darkAccentMat
    );
    battery1.position.x = -0.42;
    rearPower.add(battery1);
    const battery2 = makeCadMesh(
      new THREE.BoxGeometry(0.65, 0.35, 0.4),
      whiteLineMat,
      darkAccentMat
    );
    battery2.position.x = 0.42;
    rearPower.add(battery2);
    botGroup.add(rearPower);

    onProgress?.(100, 'TEAM PRATYUMNIS BOT READY');
    onLoaded?.();

    // Responsive Scale & Alignment
    botGroup.scale.setScalar(0.88);
    botGroup.position.set(0, -0.4, 0);

    // Mouse Tracking & Physics Animation
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, clicking: false };

    const onPointerMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onPointerDown = () => {
      mouse.clicking = true;
    };
    const onPointerUp = () => {
      mouse.clicking = false;
    };

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);

    let animationId: number;
    let clock = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      clock += 0.02;

      // Smooth mouse lerp
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      // Chassis responds to mouse heading and leans slightly
      botGroup.rotation.y = 0.35 + mouse.x * 0.75 + Math.sin(clock * 0.5) * 0.03;
      botGroup.rotation.x = -0.15 - mouse.y * 0.35;
      botGroup.rotation.z = -mouse.x * 0.08;

      // Continuous high-speed LIDAR sweep
      lidarRotor.rotation.y += 0.04;

      // Omni-wheels roll slightly in response to lateral mouse shifts
      wheels.forEach((w, i) => {
        w.children[0].rotation.x += 0.02 * (i % 2 === 0 ? 1 : -1);
      });

      // Gripper clamping animation (closes on mouse click)
      const targetSpread = mouse.clicking ? -0.22 : -0.4;
      leftClaw.position.x += (targetSpread - leftClaw.position.x) * 0.15;
      rightClaw.position.x += (-targetSpread - rightClaw.position.x) * 0.15;

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
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [onProgress, onLoaded]);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div
        ref={mountRef}
        className="w-full h-full flex items-center justify-center pointer-events-none"
      />
    </div>
  );
}
