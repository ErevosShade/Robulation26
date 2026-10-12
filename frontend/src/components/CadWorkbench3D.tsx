'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CadWorkbench3DProps {
  onProgress?: (progress: number, stage: string) => void;
  onLoaded?: () => void;
}

export default function CadWorkbench3D({
  onProgress,
  onLoaded,
}: CadWorkbench3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isExploded, setIsExploded] = useState(false);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  // References to pass state to Three.js loop
  const explodedRef = useRef(false);
  explodedRef.current = isExploded;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 900;
    const height = mount.clientHeight || 560;

    onProgress?.(30, 'PREPARING CAD WORKBENCH STAGE');

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(4.0, 3.4, 4.8);
    camera.lookAt(0, 0.4, 0);

    // 2. High-Performance PBR Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // 3. Realistic Workshop Studio Lighting
    const ambLight = new THREE.AmbientLight(0x334155, 1.4);
    scene.add(ambLight);

    // Primary Overhead Workbench Lamp (Key Light)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(5, 8, 4);
    scene.add(keyLight);

    // Secondary Cool Rim Light (Blue/Cyan Accent)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimLight.position.set(-6, 4, -4);
    scene.add(rimLight);

    // Under-Desk Warm Ambient Fill
    const fillLight = new THREE.DirectionalLight(0xf8fafc, 1.0);
    fillLight.position.set(0, -3, 4);
    scene.add(fillLight);

    // =========================================================================
    // PHYSICAL CAD MATERIALS (PBR SHADERS)
    // =========================================================================
    const matAluminum = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.88,
      roughness: 0.22,
    });

    const matAnodizedBlue = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.82,
      roughness: 0.28,
    });

    const matCarbonFiber = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.2,
      roughness: 0.6,
    });

    const matBrass = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      metalness: 0.92,
      roughness: 0.2,
    });

    const matRubber = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      metalness: 0.05,
      roughness: 0.85,
    });

    const matStainlessSteel = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.15,
    });

    const matPcbGreen = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      metalness: 0.1,
      roughness: 0.45,
    });

    const matGoldPins = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.96,
      roughness: 0.1,
    });

    const matIcBlack = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.3,
      roughness: 0.5,
    });

    const matLedCyan = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    const matLedEmerald = new THREE.MeshBasicMaterial({
      color: 0x34d399,
    });

    // Root Workbench World Group
    const workbenchGroup = new THREE.Group();
    scene.add(workbenchGroup);

    // =========================================================================
    // 1. ESD ANTI-STATIC WORKBENCH CUTTING MAT (TEXTURED GROUND)
    // =========================================================================
    const matCanvas = document.createElement('canvas');
    matCanvas.width = 1024;
    matCanvas.height = 1024;
    const mctx = matCanvas.getContext('2d');
    if (mctx) {
      // Base dark graphite/blue anti-static surface
      mctx.fillStyle = '#0b1120';
      mctx.fillRect(0, 0, 1024, 1024);

      // Outer bezel border
      mctx.strokeStyle = '#1e293b';
      mctx.lineWidth = 12;
      mctx.strokeRect(6, 6, 1012, 1012);

      // Fine 10mm grid lines
      mctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      mctx.lineWidth = 1;
      for (let x = 32; x < 1024; x += 32) {
        mctx.beginPath();
        mctx.moveTo(x, 16);
        mctx.lineTo(x, 1008);
        mctx.stroke();
      }
      for (let y = 32; y < 1024; y += 32) {
        mctx.beginPath();
        mctx.moveTo(16, y);
        mctx.lineTo(1008, y);
        mctx.stroke();
      }

      // Major 50mm grid lines
      mctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      mctx.lineWidth = 1.5;
      for (let x = 64; x < 1024; x += 128) {
        mctx.beginPath();
        mctx.moveTo(x, 16);
        mctx.lineTo(x, 1008);
        mctx.stroke();
      }
      for (let y = 64; y < 1024; y += 128) {
        mctx.beginPath();
        mctx.moveTo(16, y);
        mctx.lineTo(1008, y);
        mctx.stroke();
      }

      // Concentric Angle Circles & Calibrated Crosshairs
      mctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
      mctx.lineWidth = 2;
      mctx.beginPath();
      mctx.arc(512, 512, 320, 0, Math.PI * 2);
      mctx.stroke();

      mctx.beginPath();
      mctx.arc(512, 512, 180, 0, Math.PI * 2);
      mctx.stroke();

      // Engineering Silkscreen Text on Mat
      mctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      mctx.font = 'bold 18px monospace';
      mctx.fillText('BIT MESRA // ROBOLUTION MECHATRONICS LAB', 48, 64);
      mctx.fillText('ABU ROBOCON WORKBENCH // ESD-SAFE 10^8 Ω', 48, 92);
      mctx.fillText('GRID: 10.0mm METRIC • SCALE 1:1', 680, 64);
      mctx.fillText('ORIGIN: X0 Y0 Z0', 780, 92);
    }

    const matTexture = new THREE.CanvasTexture(matCanvas);
    matTexture.anisotropy = 8;

    // Sized to fit comfortably inside the camera view with breathing margins
    const esdMat = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.08, 4.6),
      new THREE.MeshStandardMaterial({
        map: matTexture,
        roughness: 0.65,
        metalness: 0.1,
      })
    );
    esdMat.position.y = -0.04;
    workbenchGroup.add(esdMat);

    // =========================================================================
    // 2. TOOL A: DIGITAL VERNIER CALIPER (RESTING ON WORKBENCH)
    // =========================================================================
    const caliperGroup = new THREE.Group();
    caliperGroup.position.set(1.85, 0.05, 1.05);
    caliperGroup.rotation.y = -0.4;
    workbenchGroup.add(caliperGroup);

    // Main Stainless Steel Beam
    const caliperBeam = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.04, 0.18),
      matStainlessSteel
    );
    caliperGroup.add(caliperBeam);

    // Fixed Left Jaw
    const fixedJaw = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.05, 0.7),
      matStainlessSteel
    );
    fixedJaw.position.set(-1.14, 0, 0.3);
    caliperGroup.add(fixedJaw);

    // Slider Unit with Digital LCD Display
    const sliderBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.08, 0.32),
      matCarbonFiber
    );
    sliderBox.position.set(-0.35, 0.04, 0);
    caliperGroup.add(sliderBox);

    // LCD Readout Screen
    const lcdScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.32, 0.14),
      matLedCyan
    );
    lcdScreen.rotation.x = -Math.PI / 2;
    lcdScreen.position.set(-0.35, 0.085, 0);
    caliperGroup.add(lcdScreen);

    // Moving Jaw attached to slider
    const movingJaw = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.05, 0.7),
      matStainlessSteel
    );
    movingJaw.position.set(-0.6, 0, 0.3);
    caliperGroup.add(movingJaw);

    // =========================================================================
    // 3. TOOL B: CUSTOM STM32 / CAN-BUS ROBOTICS PCB CONTROLLER
    // =========================================================================
    const pcbGroup = new THREE.Group();
    pcbGroup.position.set(-1.85, 0.05, 0.95);
    pcbGroup.rotation.y = 0.35;
    workbenchGroup.add(pcbGroup);

    // FR4 Green PCB Board
    const pcbBoard = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.04, 1.05),
      matPcbGreen
    );
    pcbGroup.add(pcbBoard);

    // Main STM32 Microcontroller IC (LQFP Package)
    const mcuChip = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.06, 0.38),
      matIcBlack
    );
    mcuChip.position.set(0, 0.04, 0);
    pcbGroup.add(mcuChip);

    // Gold Pin Headers
    const pinHeader1 = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.08, 0.08),
      matGoldPins
    );
    pinHeader1.position.set(0, 0.06, 0.42);
    pcbGroup.add(pinHeader1);

    const pinHeader2 = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.08, 0.08),
      matGoldPins
    );
    pinHeader2.position.set(0, 0.06, -0.42);
    pcbGroup.add(pinHeader2);

    // Surface Mount Status LEDs (CAN TX/RX & Power)
    const pwrLed = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.06), matLedEmerald);
    pwrLed.position.set(-0.5, 0.04, 0.25);
    pcbGroup.add(pwrLed);

    const canLed = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.06), matLedCyan);
    canLed.position.set(-0.5, 0.04, 0.12);
    pcbGroup.add(canLed);

    // USB-C Connector
    const usbPort = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.1, 0.26),
      matStainlessSteel
    );
    usbPort.position.set(-0.65, 0.06, -0.18);
    pcbGroup.add(usbPort);

    // =========================================================================
    // 4. TOOL C: INDUSTRIAL ALLEN KEY / HEX WRENCH
    // =========================================================================
    const wrenchGroup = new THREE.Group();
    wrenchGroup.position.set(-1.65, 0.04, -1.35);
    wrenchGroup.rotation.y = 1.1;
    workbenchGroup.add(wrenchGroup);

    const wrenchLong = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 1.2, 8),
      matStainlessSteel
    );
    wrenchLong.rotation.z = Math.PI / 2;
    wrenchGroup.add(wrenchLong);

    const wrenchShort = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.4, 8),
      matStainlessSteel
    );
    wrenchShort.position.set(-0.6, 0, 0.2);
    wrenchShort.rotation.x = Math.PI / 2;
    wrenchGroup.add(wrenchShort);

    // A few scattered M3 Socket Head Screws
    for (let i = 0; i < 4; i++) {
      const screw = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.14, 8),
        matStainlessSteel
      );
      screw.position.set(1.7 + i * 0.14, 0.05, -1.3 + (i % 2) * 0.12);
      workbenchGroup.add(screw);
    }

    onProgress?.(70, 'ASSEMBLING SOLID CAD ROBOT COMPONENTS');

    // =========================================================================
    // 5. THE SOLID CAD ROBOCON ROBOT (CENTERSTAGE ASSEMBLY)
    // =========================================================================
    const robotRoot = new THREE.Group();
    robotRoot.position.set(0, 0, 0);
    workbenchGroup.add(robotRoot);

    // --- Sub-Assembly A: Lower Aluminum Chassis Plate ---
    const lowerDeck = new THREE.Mesh(
      new THREE.CylinderGeometry(1.65, 1.75, 0.18, 8),
      matAluminum
    );
    lowerDeck.position.y = 0.28;
    robotRoot.add(lowerDeck);

    // --- Sub-Assembly B: Brass Standoff Pillars (Separating Decks) ---
    const standoffs: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const ang = (i * Math.PI) / 3;
      const standoff = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.6, 6),
        matBrass
      );
      standoff.position.set(Math.cos(ang) * 1.35, 0.65, Math.sin(ang) * 1.35);
      robotRoot.add(standoff);
      standoffs.push(standoff);
    }

    // --- Sub-Assembly C: Upper Carbon-Fiber Top Deck (Separates in Exploded View) ---
    const topDeckGroup = new THREE.Group();
    topDeckGroup.position.set(0, 0.98, 0);
    robotRoot.add(topDeckGroup);

    const topDeck = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 0.14, 8),
      matCarbonFiber
    );
    topDeckGroup.add(topDeck);

    // Electronics Enclosure on Top Deck
    const electronicsBox = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.28, 0.9),
      matAnodizedBlue
    );
    electronicsBox.position.y = 0.2;
    topDeckGroup.add(electronicsBox);

    // --- Sub-Assembly D: 360-Degree LIDAR Scanner Turret (Floats in Exploded View) ---
    const lidarAssembly = new THREE.Group();
    lidarAssembly.position.set(0, 0.42, 0);
    topDeckGroup.add(lidarAssembly);

    const lidarBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.54, 0.24, 20),
      matAluminum
    );
    lidarAssembly.add(lidarBase);

    const lidarRotor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.42, 0.32, 20),
      matCarbonFiber
    );
    lidarRotor.position.y = 0.26;
    lidarAssembly.add(lidarRotor);

    const lidarSensorEye = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.14, 0.25),
      matLedEmerald
    );
    lidarSensorEye.position.set(0.25, 0.26, 0);
    lidarRotor.add(lidarSensorEye);

    // Sweeping Cyan Laser Scanning Fan
    const laserConeGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(3.2, 0.35, 1.4),
      new THREE.Vector3(3.2, -0.35, 1.4),
      new THREE.Vector3(0, 0, 0),
    ]);
    const laserFan = new THREE.Line(
      laserConeGeo,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55 })
    );
    lidarRotor.add(laserFan);

    // --- Sub-Assembly E: Four 45° Holonomic Omni-Wheels (Expand in Exploded View) ---
    const wheelAssemblies: { group: THREE.Group; basePos: THREE.Vector3; dir: THREE.Vector3 }[] = [];
    const wheelAngles = [
      Math.PI / 4,
      (3 * Math.PI) / 4,
      (5 * Math.PI) / 4,
      (7 * Math.PI) / 4,
    ];

    wheelAngles.forEach((ang) => {
      const wGroup = new THREE.Group();
      const basePos = new THREE.Vector3(Math.cos(ang) * 1.55, 0.28, Math.sin(ang) * 1.55);
      wGroup.position.copy(basePos);
      wGroup.rotation.y = -ang;

      // Anodized Aluminum Wheel Hub
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.36, 0.36, 0.24, 16),
        matAnodizedBlue
      );
      hub.rotation.z = Math.PI / 2;
      wGroup.add(hub);

      // Rubber Traction Rollers Ring
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.36, 0.1, 8, 20),
        matRubber
      );
      rim.rotation.y = Math.PI / 2;
      wGroup.add(rim);

      robotRoot.add(wGroup);
      wheelAssemblies.push({
        group: wGroup,
        basePos,
        dir: new THREE.Vector3(Math.cos(ang), 0, Math.sin(ang)).normalize(),
      });
    });

    // --- Sub-Assembly F: Front Pneumatic Gripper (Extends in Exploded View) ---
    const gripperAssembly = new THREE.Group();
    const gripperBasePos = new THREE.Vector3(0, 0.38, 1.4);
    gripperAssembly.position.copy(gripperBasePos);
    robotRoot.add(gripperAssembly);

    const gripperRail = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.15, 0.25),
      matAluminum
    );
    gripperAssembly.add(gripperRail);

    const leftClaw = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.18, 0.65),
      matAnodizedBlue
    );
    leftClaw.position.set(-0.38, 0, 0.32);
    gripperAssembly.add(leftClaw);

    const rightClaw = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.18, 0.65),
      matAnodizedBlue
    );
    rightClaw.position.set(0.38, 0, 0.32);
    gripperAssembly.add(rightClaw);

    onProgress?.(100, 'CAD WORKBENCH OPERATIONAL');
    onLoaded?.();

    // =========================================================================
    // INTERACTIVE MOUSE ROTATION & SMOOTH KINEMATICS
    // =========================================================================
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, isDragging: false, prevX: 0, prevY: 0 };
    let explodeFactor = 0; // 0 = assembled, 1 = fully exploded

    const onPointerMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onPointerMove);

    let animationId: number;
    let clock = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      clock += 0.02;

      // Smooth mouse lerp
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      // Smooth Exploded View Interpolation
      const targetExplode = explodedRef.current ? 1 : 0;
      explodeFactor += (targetExplode - explodeFactor) * 0.08;

      // --- Apply Exploded View Translations ---
      // 1. Top Deck lifts upward
      topDeckGroup.position.y = 0.98 + explodeFactor * 1.35;

      // 2. LIDAR lifts even further upward
      lidarAssembly.position.y = 0.42 + explodeFactor * 0.85;

      // 3. Standoffs stretch/lift proportionally
      standoffs.forEach((st, idx) => {
        st.position.y = 0.65 + explodeFactor * 0.6;
        st.scale.y = 1 + explodeFactor * 0.8;
      });

      // 4. Wheels slide outward along their 45° angle trajectories
      wheelAssemblies.forEach((w) => {
        const offset = w.dir.clone().multiplyScalar(explodeFactor * 0.9);
        w.group.position.copy(w.basePos.clone().add(offset));
        w.group.children[0].rotation.x += 0.02; // Slow roll animation
      });

      // 5. Front Gripper extends forward
      gripperAssembly.position.z = gripperBasePos.z + explodeFactor * 0.85;

      // High-Speed LIDAR Continuous Sweep
      lidarRotor.rotation.y += 0.05;

      // Gripper breathing cycle
      const clawSpread = 0.38 + Math.sin(clock * 1.4) * 0.06;
      leftClaw.position.x = -clawSpread;
      rightClaw.position.x = clawSpread;

      // Subtle Camera/Workbench Tilt responding to mouse
      workbenchGroup.rotation.y = -0.25 + mouse.x * 0.5 + Math.sin(clock * 0.3) * 0.02;
      workbenchGroup.rotation.x = 0.15 - mouse.y * 0.25;

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
  }, [onProgress, onLoaded]);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* Three.js Canvas Container with Organic Radial Edge Blending */}
      <div
        ref={mountRef}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          maskImage: 'radial-gradient(ellipse 74% 70% at 50% 50%, black 50%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 74% 70% at 50% 50%, black 50%, transparent 95%)',
        }}
      />

      {/* Floating CAD Viewport HUD Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsExploded(!isExploded)}
          className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 backdrop-blur-md border ${
            isExploded
              ? 'bg-sky-500 text-black border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]'
              : 'bg-black/60 text-zinc-300 border-white/20 hover:bg-white/10 hover:text-white'
          }`}
        >
          {isExploded ? '● EXPLODED ASSEMBLY' : '○ SOLID SHADED'}
        </button>
      </div>

      {/* Bottom Tool Legend Readout */}
      <div className="absolute bottom-3 left-4 z-20 hidden sm:flex items-center gap-4 font-mono text-[10px] text-zinc-400 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded border border-white/10 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>TOOL: DIGITAL CALIPER [42.85mm]</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded border border-white/10 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>BOARD: STM32 CAN-BUS PCB</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded border border-white/10 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          <span>STANDOFFS: BRASS M3</span>
        </div>
      </div>
    </div>
  );
}
