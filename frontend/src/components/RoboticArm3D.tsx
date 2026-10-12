'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RoboticArm3DProps {
  onProgress?: (progress: number, stage: string) => void;
  onLoaded?: () => void;
}

export default function RoboticArm3D({
  onProgress,
  onLoaded,
}: RoboticArm3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 500;

    // Report immediate ready progress
    onProgress?.(40, 'CALIBRATING 6-DOF JOINTS');

    // Scene & Perspective Camera
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(3.8, 3.2, 5.2);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Root Group
    const rootArm = new THREE.Group();
    scene.add(rootArm);

    // Materials: Crisp CAD wireframe + dark occluding mesh
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      depthTest: true,
    });

    const occludeMat = new THREE.MeshBasicMaterial({
      color: 0x060911,
      transparent: true,
      opacity: 0.96,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    const accentMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8, // Electric Cyan Accent
      transparent: true,
      opacity: 0.9,
    });

    const createCadPart = (
      geo: THREE.BufferGeometry,
      mat = lineMat,
      thresh = 35
    ): THREE.Group => {
      const group = new THREE.Group();
      const mesh = new THREE.Mesh(geo, occludeMat);
      const edges = new THREE.EdgesGeometry(geo, thresh);
      const lines = new THREE.LineSegments(edges, mat);
      group.add(mesh);
      group.add(lines);
      return group;
    };

    // 1. Base Stand & Flange
    const baseStand = createCadPart(new THREE.CylinderGeometry(1.3, 1.5, 0.35, 24));
    baseStand.position.y = 0.175;
    rootArm.add(baseStand);

    // Motor Hub Housing
    const motorHub = createCadPart(new THREE.CylinderGeometry(0.9, 0.9, 0.45, 20), accentMat);
    motorHub.position.y = 0.55;
    rootArm.add(motorHub);

    // 2. Turntable Group (Joint 1 - Yaw Rotation)
    const turntable = new THREE.Group();
    turntable.position.y = 0.75;
    rootArm.add(turntable);

    const turretBase = createCadPart(new THREE.BoxGeometry(1.1, 0.6, 1.0));
    turntable.add(turretBase);

    // Twin Shoulder Upright Brackets
    const leftBracket = createCadPart(new THREE.BoxGeometry(0.2, 0.9, 0.6));
    leftBracket.position.set(-0.45, 0.5, 0);
    turntable.add(leftBracket);

    const rightBracket = createCadPart(new THREE.BoxGeometry(0.2, 0.9, 0.6));
    rightBracket.position.set(0.45, 0.5, 0);
    turntable.add(rightBracket);

    // 3. Shoulder Pivot Group (Joint 2 - Pitch)
    const shoulder = new THREE.Group();
    shoulder.position.set(0, 0.8, 0);
    turntable.add(shoulder);

    const shoulderPin = createCadPart(new THREE.CylinderGeometry(0.32, 0.32, 1.2, 16), accentMat);
    shoulderPin.rotation.z = Math.PI / 2;
    shoulder.add(shoulderPin);

    // Primary Bicep Boom (Twin Truss Beams)
    const bicepBeamLeft = createCadPart(new THREE.BoxGeometry(0.12, 1.8, 0.28));
    bicepBeamLeft.position.set(-0.25, 0.95, 0);
    shoulder.add(bicepBeamLeft);

    const bicepBeamRight = createCadPart(new THREE.BoxGeometry(0.12, 1.8, 0.28));
    bicepBeamRight.position.set(0.25, 0.95, 0);
    shoulder.add(bicepBeamRight);

    // Counterbalance Hydraulic Cylinder
    const hydCylinder = createCadPart(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 12), lineMat);
    hydCylinder.position.set(0, 0.8, -0.3);
    shoulder.add(hydCylinder);

    // 4. Elbow Joint Group (Joint 3 - Elbow Pitch)
    const elbow = new THREE.Group();
    elbow.position.set(0, 1.9, 0);
    shoulder.add(elbow);

    const elbowHub = createCadPart(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16), accentMat);
    elbowHub.rotation.z = Math.PI / 2;
    elbow.add(elbowHub);

    // Forearm Boom
    const forearm = createCadPart(new THREE.BoxGeometry(0.4, 1.6, 0.35));
    forearm.position.set(0, 0.85, 0);
    elbow.add(forearm);

    // 5. Wrist Pitch & Roll Assembly (Joint 4 & 5)
    const wrist = new THREE.Group();
    wrist.position.set(0, 1.7, 0);
    elbow.add(wrist);

    const wristGimbal = createCadPart(new THREE.CylinderGeometry(0.24, 0.24, 0.45, 16), accentMat);
    wrist.add(wristGimbal);

    // 6. Tool Flange & Robotic Gripper End-Effector (Joint 6)
    const gripperBase = createCadPart(new THREE.BoxGeometry(0.65, 0.18, 0.45));
    gripperBase.position.set(0, 0.3, 0);
    wrist.add(gripperBase);

    // Left Gripper Finger
    const leftFinger = createCadPart(new THREE.BoxGeometry(0.08, 0.55, 0.18));
    leftFinger.position.set(-0.22, 0.6, 0);
    wrist.add(leftFinger);

    // Right Gripper Finger
    const rightFinger = createCadPart(new THREE.BoxGeometry(0.08, 0.55, 0.18));
    rightFinger.position.set(0.22, 0.6, 0);
    wrist.add(rightFinger);

    // Optical Rangefinder Laser Projector
    const laserBeamGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.85, 0),
      new THREE.Vector3(0, 2.2, 0),
    ]);
    const laserLine = new THREE.Line(
      laserBeamGeo,
      new THREE.LineDashedMaterial({
        color: 0x38bdf8,
        dashSize: 0.12,
        gapSize: 0.08,
        opacity: 0.75,
        transparent: true,
      })
    );
    laserLine.computeLineDistances();
    wrist.add(laserLine);

    onProgress?.(85, 'SYNCHRONIZING CAN-BUS ENCODERS');

    // Scale and position the whole robot cleanly in view
    rootArm.scale.setScalar(0.92);
    rootArm.position.set(0, -1.35, 0);

    // Dynamic Kinematics State
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

    onProgress?.(100, 'ROBOTICS WORKBENCH ONLINE');
    onLoaded?.();

    // Kinematic Animation Loop: Responsive reaching & articulation
    let animationId: number;
    let clock = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      clock += 0.02;

      // Smooth mouse lerp
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      // Inverse-Kinematic Angle Calculation:
      // Base Yaw rotates smoothly towards mouse X
      turntable.rotation.y = mouse.x * 1.1 + Math.sin(clock * 0.5) * 0.05;

      // Shoulder tilts forward/back in response to mouse Y
      shoulder.rotation.x = -0.3 + mouse.y * 0.45;

      // Elbow counter-balances to reach naturally
      elbow.rotation.x = 0.55 - mouse.y * 0.35 + Math.cos(clock * 0.8) * 0.03;

      // Wrist points forward and tracks cursor
      wrist.rotation.x = -0.25 - mouse.y * 0.2;
      wrist.rotation.z = mouse.x * 0.3;

      // Gripper clamping physics (click to clamp or breathing cycle)
      const targetFingerSpread = mouse.clicking
        ? 0.12
        : 0.24 + Math.sin(clock * 1.5) * 0.04;
      leftFinger.position.x += (-targetFingerSpread - leftFinger.position.x) * 0.15;
      rightFinger.position.x += (targetFingerSpread - rightFinger.position.x) * 0.15;

      // Slow orbital drift
      rootArm.rotation.y = 0.25 + Math.sin(clock * 0.3) * 0.08;

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
