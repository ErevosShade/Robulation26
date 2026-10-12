'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface WorkbenchCanvas3DProps {
  onLoaded?: () => void;
}

export default function WorkbenchCanvas3D({ onLoaded }: WorkbenchCanvas3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<'assembled' | 'exploded'>('assembled');
  const modeRef = useRef<'assembled' | 'exploded'>('assembled');
  modeRef.current = activeMode;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;

    // Scene & Perspective Camera
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    // Angled isometric CAD studio perspective with generous framing
    camera.position.set(4.5, 5.4, 6.4);
    camera.lookAt(0.4, 0.3, 0);

    // High-Performance PBR Renderer with ACES Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // =========================================================================
    // LIGHTING: PRECISION HARDWARE WORKBENCH
    // =========================================================================
    const ambLight = new THREE.AmbientLight(0x1e293b, 2.8);
    scene.add(ambLight);

    // Main Overhead Workbench Fluorescent / LED Work Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
    keyLight.position.set(4, 11, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Precision Electric Cyan Rim Light
    const cyanRim = new THREE.DirectionalLight(0x38bdf8, 2.4);
    cyanRim.position.set(-7, 4, -5);
    scene.add(cyanRim);

    // Warm Soldering Iron / Lab Lamp Fill
    const warmFill = new THREE.DirectionalLight(0xfef08a, 0.7);
    warmFill.position.set(3, -1, 6);
    scene.add(warmFill);

    // =========================================================================
    // PHYSICAL PBR MATERIALS
    // =========================================================================
    const matAluminum = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.85,
      roughness: 0.22,
    });

    const matDarkGunmetal = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.35,
    });

    const matAnodizedBlue = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.82,
      roughness: 0.28,
    });

    const matCarbonFiber = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.3,
      roughness: 0.6,
    });

    const matBrass = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      metalness: 0.92,
      roughness: 0.2,
    });

    const matSteel = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.96,
      roughness: 0.14,
    });

    const matRubber = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      metalness: 0.05,
      roughness: 0.85,
    });

    const matPcbGreen = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      metalness: 0.15,
      roughness: 0.45,
    });

    const matGold = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.95,
      roughness: 0.15,
    });

    const matChipBlack = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.4,
      roughness: 0.5,
    });

    const matLedCyan = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const matLedEmerald = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const matLedAmber = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });

    // The Master World Group (Offset to the right for clear text hierarchy on desktop)
    const worldGroup = new THREE.Group();
    const isDesktop = width >= 1024;
    worldGroup.position.x = isDesktop ? 2.4 : 0;
    worldGroup.position.y = -0.22;
    worldGroup.scale.set(0.9, 0.9, 0.9);
    scene.add(worldGroup);

    // =========================================================================
    // 1. WORKBENCH TABLE SURFACE & ESD CUTTING MAT
    // =========================================================================
    // Expansive dark workshop table surface to eliminate harsh box cutoffs
    const deskGeo = new THREE.PlaneGeometry(40, 40);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x050811,
      roughness: 0.9,
      metalness: 0.1,
    });
    const deskMesh = new THREE.Mesh(deskGeo, deskMat);
    deskMesh.rotation.x = -Math.PI / 2;
    deskMesh.position.y = -0.06;
    deskMesh.receiveShadow = true;
    worldGroup.add(deskMesh);

    // Procedural ESD Anti-Static Cutting Mat Texture
    const matCanvas = document.createElement('canvas');
    matCanvas.width = 1024;
    matCanvas.height = 1024;
    const ctx = matCanvas.getContext('2d');
    if (ctx) {
      // Matte dark slate blue-gray base
      ctx.fillStyle = '#0a101d';
      ctx.fillRect(0, 0, 1024, 1024);

      // Outer bezel border
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 12;
      ctx.strokeRect(6, 6, 1012, 1012);

      // 10mm Minor Grid Lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 32; x < 1024; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 16);
        ctx.lineTo(x, 1008);
        ctx.stroke();
      }
      for (let y = 32; y < 1024; y += 32) {
        ctx.beginPath();
        ctx.moveTo(16, y);
        ctx.lineTo(1008, y);
        ctx.stroke();
      }

      // 50mm Major Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1.5;
      for (let x = 64; x < 1024; x += 128) {
        ctx.beginPath();
        ctx.moveTo(x, 16);
        ctx.lineTo(x, 1008);
        ctx.stroke();
      }
      for (let y = 64; y < 1024; y += 128) {
        ctx.beginPath();
        ctx.moveTo(16, y);
        ctx.lineTo(1008, y);
        ctx.stroke();
      }

      // Metric Calibration Targets
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(512, 512, 340, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(512, 512, 200, 0, Math.PI * 2);
      ctx.stroke();

      // Technical Silkscreen Markings
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('BIT MESRA // ROBOLUTION HARDWARE WORKBENCH', 48, 64);
      ctx.fillText('ABU ROBOCON & ROBOSAGA // TEAM PRATYUMNIS', 48, 92);
      ctx.fillText('METRIC GRID: 1:1 SCALE // ESD-SAFE 10^8 OHM', 570, 64);
    }

    const matTexture = new THREE.CanvasTexture(matCanvas);
    matTexture.anisotropy = 8;

    const esdMatMesh = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 0.08, 5.2),
      new THREE.MeshStandardMaterial({
        map: matTexture,
        roughness: 0.65,
        metalness: 0.12,
      })
    );
    esdMatMesh.position.y = -0.04;
    esdMatMesh.receiveShadow = true;
    worldGroup.add(esdMatMesh);

    // =========================================================================
    // 2. WORKBENCH TOOLS: CALIPERS, SOLDERING IRON, STM32 PCB, BOLTS
    // =========================================================================
    // Digital Caliper
    const caliper = new THREE.Group();
    caliper.position.set(2.0, 0.04, 1.25);
    caliper.rotation.y = -0.38;
    worldGroup.add(caliper);

    const beam = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.035, 0.16), matSteel);
    beam.castShadow = true;
    caliper.add(beam);

    const jawFixed = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.045, 0.65), matSteel);
    jawFixed.position.set(-1.15, 0, 0.28);
    jawFixed.castShadow = true;
    caliper.add(jawFixed);

    const slider = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.075, 0.3), matDarkGunmetal);
    slider.position.set(-0.35, 0.035, 0);
    slider.castShadow = true;
    caliper.add(slider);

    const lcd = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.12), matLedCyan);
    lcd.rotation.x = -Math.PI / 2;
    lcd.position.set(-0.35, 0.08, 0);
    caliper.add(lcd);

    const jawMoving = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.045, 0.65), matSteel);
    jawMoving.position.set(-0.58, 0, 0.28);
    jawMoving.castShadow = true;
    caliper.add(jawMoving);

    // Soldering Iron & Stand (Left Corner of Bench)
    const solderStation = new THREE.Group();
    solderStation.position.set(-2.2, 0.04, -1.5);
    solderStation.rotation.y = 0.45;
    worldGroup.add(solderStation);

    const stationBase = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.2, 0.95), matDarkGunmetal);
    stationBase.castShadow = true;
    solderStation.add(stationBase);

    const stationLed = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.12), matLedAmber);
    stationLed.position.set(0, 0.11, 0.48);
    solderStation.add(stationLed);

    const ironHolder = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.7, 12), matSteel);
    ironHolder.rotation.x = 0.55;
    ironHolder.position.set(0.15, 0.32, -0.05);
    solderStation.add(ironHolder);

    const ironHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 12), matRubber);
    ironHandle.rotation.x = 0.55;
    ironHandle.position.set(0.15, 0.55, -0.22);
    solderStation.add(ironHandle);

    // Custom STM32 Controller Board
    const pcb = new THREE.Group();
    pcb.position.set(-2.0, 0.04, 1.1);
    pcb.rotation.y = 0.32;
    worldGroup.add(pcb);

    const pcbBase = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.035, 1.1), matPcbGreen);
    pcbBase.castShadow = true;
    pcb.add(pcbBase);

    const mcu = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.055, 0.42), matChipBlack);
    mcu.position.set(0, 0.035, 0);
    pcb.add(mcu);

    const pins1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.07, 0.07), matGold);
    pins1.position.set(0, 0.05, 0.42);
    pcb.add(pins1);

    const pins2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.07, 0.07), matGold);
    pins2.position.set(0, 0.05, -0.42);
    pcb.add(pins2);

    const led1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.05), matLedEmerald);
    led1.position.set(-0.5, 0.035, 0.25);
    pcb.add(led1);

    const led2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.05), matLedCyan);
    led2.position.set(-0.5, 0.035, 0.12);
    pcb.add(led2);

    // Hex Key Wrench
    const wrench = new THREE.Group();
    wrench.position.set(-1.6, 0.04, -0.2);
    wrench.rotation.y = 1.15;
    worldGroup.add(wrench);

    const wrenchL = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.2, 8), matSteel);
    wrenchL.rotation.z = Math.PI / 2;
    wrench.add(wrenchL);

    const wrenchS = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.38, 8), matSteel);
    wrenchS.position.set(-0.6, 0, 0.18);
    wrenchS.rotation.x = Math.PI / 2;
    wrench.add(wrenchS);

    // Scattered M3 Machine Screws
    for (let i = 0; i < 4; i++) {
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.14, 8), matSteel);
      screw.position.set(1.8 + i * 0.15, 0.05, -1.2 + (i % 2) * 0.12);
      screw.castShadow = true;
      worldGroup.add(screw);
    }

    // =========================================================================
    // 3. THE ROBOCON COMPETITION BOT (PBR ASSEMBLED IN THE CENTER)
    // =========================================================================
    const robot = new THREE.Group();
    worldGroup.add(robot);

    // Lower Chassis Plate (Octagonal CNC Machined Aluminum)
    const chassis = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.75, 0.18, 8), matAluminum);
    chassis.position.y = 0.28;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    robot.add(chassis);

    // Standoffs (Precision Brass Hex Spacers)
    const standoffs: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const ang = (i * Math.PI) / 3;
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 6), matBrass);
      st.position.set(Math.cos(ang) * 1.35, 0.65, Math.sin(ang) * 1.35);
      st.castShadow = true;
      robot.add(st);
      standoffs.push(st);
    }

    // Top Deck Assembly Group
    const topDeckGroup = new THREE.Group();
    topDeckGroup.position.set(0, 0.98, 0);
    robot.add(topDeckGroup);

    // Top Plate (Carbon Fiber Deck)
    const topPlate = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.14, 8), matCarbonFiber);
    topPlate.castShadow = true;
    topDeckGroup.add(topPlate);

    // Anodized ESC & Battery Housing
    const escHousing = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.28, 0.95), matAnodizedBlue);
    escHousing.position.y = 0.2;
    escHousing.castShadow = true;
    topDeckGroup.add(escHousing);

    // 2D LIDAR Turret Assembly
    const lidar = new THREE.Group();
    lidar.position.set(0, 0.42, 0);
    topDeckGroup.add(lidar);

    const lidarBase = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.54, 0.24, 20), matAluminum);
    lidarBase.castShadow = true;
    lidar.add(lidarBase);

    const lidarRotor = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.32, 20), matDarkGunmetal);
    lidarRotor.position.y = 0.26;
    lidarRotor.castShadow = true;
    lidar.add(lidarRotor);

    const laserEye = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.25), matLedEmerald);
    laserEye.position.set(0.25, 0.26, 0);
    lidarRotor.add(laserEye);

    // Active Sweeping Cyan Laser Scanning Fan
    const laserConeGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(3.4, 0.35, 1.5),
      new THREE.Vector3(3.4, -0.35, 1.5),
      new THREE.Vector3(0, 0, 0),
    ]);
    const laserCone = new THREE.Line(
      laserConeGeo,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55 })
    );
    lidarRotor.add(laserCone);

    // 4x Holonomic Omni-Wheels & Brushless Motors
    const wheelAssemblies: { group: THREE.Group; basePos: THREE.Vector3; dir: THREE.Vector3 }[] = [];
    const wheelAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];

    wheelAngles.forEach((ang) => {
      const wGroup = new THREE.Group();
      const basePos = new THREE.Vector3(Math.cos(ang) * 1.55, 0.28, Math.sin(ang) * 1.55);
      wGroup.position.copy(basePos);
      wGroup.rotation.y = -ang;

      // Brushless Motor Can
      const motorCan = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.42, 16), matDarkGunmetal);
      motorCan.rotation.z = Math.PI / 2;
      motorCan.position.x = -0.22;
      wGroup.add(motorCan);

      // Wheel Rim
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.24, 16), matAnodizedBlue);
      hub.rotation.z = Math.PI / 2;
      hub.castShadow = true;
      wGroup.add(hub);

      // Rubber Outer Tire with Rollers
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.1, 8, 20), matRubber);
      rim.rotation.y = Math.PI / 2;
      rim.castShadow = true;
      wGroup.add(rim);

      robot.add(wGroup);
      wheelAssemblies.push({
        group: wGroup,
        basePos,
        dir: new THREE.Vector3(Math.cos(ang), 0, Math.sin(ang)).normalize(),
      });
    });

    // Front Pneumatic Claw / Gripper
    const gripper = new THREE.Group();
    const gripperBasePos = new THREE.Vector3(0, 0.38, 1.4);
    gripper.position.copy(gripperBasePos);
    robot.add(gripper);

    const gRail = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 0.25), matAluminum);
    gRail.castShadow = true;
    gripper.add(gRail);

    const leftClaw = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.65), matAnodizedBlue);
    leftClaw.position.set(-0.38, 0, 0.32);
    leftClaw.castShadow = true;
    gripper.add(leftClaw);

    const rightClaw = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.65), matAnodizedBlue);
    rightClaw.position.set(0.38, 0, 0.32);
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

      // Exploded Assembly Interpolation
      const targetExplode = modeRef.current === 'exploded' ? 1 : 0;
      explodeAnim += (targetExplode - explodeAnim) * 0.08;

      topDeckGroup.position.y = 0.98 + explodeAnim * 1.35;
      lidar.position.y = 0.42 + explodeAnim * 0.8;

      standoffs.forEach((st) => {
        st.position.y = 0.65 + explodeAnim * 0.6;
        st.scale.y = 1 + explodeAnim * 0.8;
      });

      wheelAssemblies.forEach((w) => {
        const offset = w.dir.clone().multiplyScalar(explodeAnim * 0.85);
        w.group.position.copy(w.basePos.clone().add(offset));
        w.group.children[1].rotation.x += 0.015;
      });

      gripper.position.z = gripperBasePos.z + explodeAnim * 0.85;

      // Active LIDAR 360 Sweep
      lidarRotor.rotation.y += 0.045;

      // Subtle Gripper Breathing
      const clawSpread = 0.38 + Math.sin(clock * 1.5) * 0.04;
      leftClaw.position.x = -clawSpread;
      rightClaw.position.x = clawSpread;

      // Slow Ambient Tilt and Responsive Cursor Tracking
      worldGroup.rotation.y = -0.28 + mouse.x * 0.35 + Math.sin(clock * 0.25) * 0.02;
      worldGroup.rotation.x = 0.18 - mouse.y * 0.18;

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

      // Re-adjust desktop offset if resized across breakpoint
      worldGroup.position.x = w >= 1024 ? 2.4 : 0;
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
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
      />

      {/* Floating CAD Assembly Viewport Controller & Tools Status */}
      <div className="absolute top-24 right-6 sm:top-28 sm:right-10 z-30 pointer-events-auto flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => setActiveMode(activeMode === 'assembled' ? 'exploded' : 'assembled')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md transition-all duration-300 border ${
            activeMode === 'exploded'
              ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.6)] scale-105'
              : 'bg-black/60 text-zinc-300 border-white/20 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              activeMode === 'exploded' ? 'bg-black animate-ping' : 'bg-cyan-400'
            }`}
          />
          <span>{activeMode === 'exploded' ? 'EXPLODED ASSEMBLY' : 'EXPLODE ASSEMBLY'}</span>
        </button>

        <div className="hidden lg:flex flex-col items-end gap-1 font-mono text-[10px] text-zinc-400 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-white/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>CALIPER: 42.85mm</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-white/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>STM32 CAN-BUS: ARMED</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-white/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>SOLDERING: 380&deg;C</span>
          </div>
        </div>
      </div>
    </div>
  );
}
