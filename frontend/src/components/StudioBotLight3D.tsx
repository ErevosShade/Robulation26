'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface StudioBotLight3DProps {
  isExploded?: boolean;
  onLoaded?: () => void;
}

export default function StudioBotLight3D({
  isExploded = false,
  onLoaded,
}: StudioBotLight3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const explodedRef = useRef<boolean>(isExploded);
  explodedRef.current = isExploded;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || 800;
    let height = mount.clientHeight || 500;

    // Scene & Perspective Camera
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(3.4, 2.7, 4.4);
    camera.lookAt(0, 0.2, 0);

    // High-Performance PBR Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // =========================================================================
    // STUDIO LIGHTING FOR LIGHT MODE
    // =========================================================================
    const ambLight = new THREE.AmbientLight(0xf1f5f9, 2.6);
    scene.add(ambLight);

    // Main Overhead Studio Softbox Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(4, 9, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Precision Electric Cyan Rim Light
    const cyanRim = new THREE.DirectionalLight(0x0284c7, 1.8);
    cyanRim.position.set(-6, 3, -4);
    scene.add(cyanRim);

    // Soft Cool Fill from Below
    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 1.0);
    fillLight.position.set(2, -2, 5);
    scene.add(fillLight);

    // =========================================================================
    // PHYSICAL PBR MATERIALS
    // =========================================================================
    const matAluminum = new THREE.MeshStandardMaterial({
      color: 0xcfd4dc,
      metalness: 0.88,
      roughness: 0.22,
    });

    const matGunmetal = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.75,
      roughness: 0.35,
    });

    const matAnodizedBlue = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.85,
      roughness: 0.25,
    });

    const matCarbon = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.25,
      roughness: 0.6,
    });

    const matBrass = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      metalness: 0.94,
      roughness: 0.18,
    });

    const matSteel = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.96,
      roughness: 0.12,
    });

    const matRubber = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.05,
      roughness: 0.85,
    });

    const matLedEmerald = new THREE.MeshBasicMaterial({ color: 0x10b981 });

    // Root Assembly Group
    const botGroup = new THREE.Group();
    botGroup.position.set(0, -0.15, 0);
    scene.add(botGroup);

    // =========================================================================
    // 1. DRAFTING PLATFORM BASE (CONCENTRIC METRIC PAD)
    // =========================================================================
    const padCanvas = document.createElement('canvas');
    padCanvas.width = 512;
    padCanvas.height = 512;
    const pctx = padCanvas.getContext('2d');
    if (pctx) {
      pctx.fillStyle = '#f8fafc';
      pctx.fillRect(0, 0, 512, 512);

      pctx.strokeStyle = '#e2e8f0';
      pctx.lineWidth = 4;
      pctx.strokeRect(6, 6, 500, 500);

      // Concentric Calibration Circles
      pctx.strokeStyle = 'rgba(2, 132, 199, 0.25)';
      pctx.lineWidth = 1.5;
      pctx.beginPath();
      pctx.arc(256, 256, 220, 0, Math.PI * 2);
      pctx.stroke();

      pctx.beginPath();
      pctx.arc(256, 256, 150, 0, Math.PI * 2);
      pctx.stroke();

      pctx.beginPath();
      pctx.arc(256, 256, 75, 0, Math.PI * 2);
      pctx.stroke();

      // Axis crosshairs
      pctx.strokeStyle = 'rgba(15, 23, 42, 0.12)';
      pctx.lineWidth = 1;
      pctx.beginPath();
      pctx.moveTo(256, 20);
      pctx.lineTo(256, 492);
      pctx.moveTo(20, 256);
      pctx.lineTo(492, 256);
      pctx.stroke();
    }
    const padTexture = new THREE.CanvasTexture(padCanvas);

    const padMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(2.6, 2.7, 0.06, 32),
      new THREE.MeshStandardMaterial({
        map: padTexture,
        roughness: 0.65,
        metalness: 0.15,
      })
    );
    padMesh.position.y = -0.04;
    padMesh.receiveShadow = true;
    botGroup.add(padMesh);

    // =========================================================================
    // 2. CHASSIS BASE & LOWER DECK
    // =========================================================================
    const chassis = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.48, 0.16, 8),
      matAluminum
    );
    chassis.position.y = 0.26;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    botGroup.add(chassis);

    // 6x Precision Brass Hex Standoffs
    const standoffs: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const ang = (i * Math.PI) / 3;
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.55, 6), matBrass);
      st.position.set(Math.cos(ang) * 1.15, 0.58, Math.sin(ang) * 1.15);
      st.castShadow = true;
      botGroup.add(st);
      standoffs.push(st);
    }

    // Top Deck Assembly
    const topDeckGroup = new THREE.Group();
    topDeckGroup.position.set(0, 0.88, 0);
    botGroup.add(topDeckGroup);

    const topPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(1.3, 1.3, 0.12, 8),
      matCarbon
    );
    topPlate.castShadow = true;
    topDeckGroup.add(topPlate);

    const escHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.26, 0.8),
      matAnodizedBlue
    );
    escHousing.position.y = 0.18;
    escHousing.castShadow = true;
    topDeckGroup.add(escHousing);

    // 2D LIDAR Turret
    const lidar = new THREE.Group();
    lidar.position.set(0, 0.38, 0);
    topDeckGroup.add(lidar);

    const lidarBase = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.2, 20), matAluminum);
    lidarBase.castShadow = true;
    lidar.add(lidarBase);

    const lidarRotor = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.28, 20), matGunmetal);
    lidarRotor.position.y = 0.24;
    lidarRotor.castShadow = true;
    lidar.add(lidarRotor);

    const laserEye = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.22), matLedEmerald);
    laserEye.position.set(0.22, 0.24, 0);
    lidarRotor.add(laserEye);

    // Cyan Laser Scan Cone
    const laserConeGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(2.8, 0.3, 1.2),
      new THREE.Vector3(2.8, -0.3, 1.2),
      new THREE.Vector3(0, 0, 0),
    ]);
    const laserCone = new THREE.Line(
      laserConeGeo,
      new THREE.LineBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.65 })
    );
    lidarRotor.add(laserCone);

    // 4x Holonomic Omni-Wheels
    const wheelAssemblies: { group: THREE.Group; basePos: THREE.Vector3; dir: THREE.Vector3 }[] = [];
    const wheelAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];

    wheelAngles.forEach((ang) => {
      const wGroup = new THREE.Group();
      const basePos = new THREE.Vector3(Math.cos(ang) * 1.35, 0.26, Math.sin(ang) * 1.35);
      wGroup.position.copy(basePos);
      wGroup.rotation.y = -ang;

      const motorCan = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.38, 16), matGunmetal);
      motorCan.rotation.z = Math.PI / 2;
      motorCan.position.x = -0.18;
      wGroup.add(motorCan);

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.22, 16), matAnodizedBlue);
      hub.rotation.z = Math.PI / 2;
      hub.castShadow = true;
      wGroup.add(hub);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.09, 8, 20), matRubber);
      rim.rotation.y = Math.PI / 2;
      rim.castShadow = true;
      wGroup.add(rim);

      botGroup.add(wGroup);
      wheelAssemblies.push({
        group: wGroup,
        basePos,
        dir: new THREE.Vector3(Math.cos(ang), 0, Math.sin(ang)).normalize(),
      });
    });

    // Front Pneumatic Claw Gripper
    const gripper = new THREE.Group();
    const gripperBasePos = new THREE.Vector3(0, 0.34, 1.25);
    gripper.position.copy(gripperBasePos);
    botGroup.add(gripper);

    const gRail = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.14, 0.22), matSteel);
    gRail.castShadow = true;
    gripper.add(gRail);

    const leftClaw = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 0.58), matAnodizedBlue);
    leftClaw.position.set(-0.34, 0, 0.28);
    leftClaw.castShadow = true;
    gripper.add(leftClaw);

    const rightClaw = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 0.58), matAnodizedBlue);
    rightClaw.position.set(0.34, 0, 0.28);
    rightClaw.castShadow = true;
    gripper.add(rightClaw);

    onLoaded?.();

    // =========================================================================
    // MOUSE PARALLAX & ANIMATION LOOP
    // =========================================================================
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let explodeAnim = 0;

    const onPointerMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onPointerMove, { passive: true });

    let animationId: number;
    let clock = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      clock += 0.02;

      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      const targetExplode = explodedRef.current ? 1 : 0;
      explodeAnim += (targetExplode - explodeAnim) * 0.08;

      topDeckGroup.position.y = 0.88 + explodeAnim * 1.2;
      lidar.position.y = 0.38 + explodeAnim * 0.7;

      standoffs.forEach((st) => {
        st.position.y = 0.58 + explodeAnim * 0.55;
        st.scale.y = 1 + explodeAnim * 0.75;
      });

      wheelAssemblies.forEach((w) => {
        const offset = w.dir.clone().multiplyScalar(explodeAnim * 0.75);
        w.group.position.copy(w.basePos.clone().add(offset));
        w.group.children[1].rotation.x += 0.015;
      });

      gripper.position.z = gripperBasePos.z + explodeAnim * 0.75;

      // Active LIDAR 360 Sweep
      lidarRotor.rotation.y += 0.045;

      // Subtle Claw Breathing
      const clawSpread = 0.34 + Math.sin(clock * 1.5) * 0.035;
      leftClaw.position.x = -clawSpread;
      rightClaw.position.x = clawSpread;

      // Ambient Tilt & Responsive Cursor Tracking
      botGroup.rotation.y = 0.35 + mouse.x * 0.45 + Math.sin(clock * 0.3) * 0.03;
      botGroup.rotation.x = 0.12 - mouse.y * 0.15;

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
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [onLoaded]);

  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing select-none">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
