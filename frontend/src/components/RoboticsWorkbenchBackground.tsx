'use client';

import React, { useEffect, useRef } from 'react';

export default function RoboticsWorkbenchBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Circuit Pulses: Electrical signals traveling along PCB/bus tracks
    interface Pulse {
      x: number;
      y: number;
      dx: number;
      dy: number;
      len: number;
      speed: number;
      alpha: number;
      vertical: boolean;
    }

    const pulses: Pulse[] = [];
    const spawnPulse = () => {
      if (pulses.length > 8) return;
      const vertical = Math.random() < 0.5;
      pulses.push({
        x: vertical ? Math.floor(Math.random() * (width / 80)) * 80 + 40 : 0,
        y: vertical ? 0 : Math.floor(Math.random() * (height / 80)) * 80 + 40,
        dx: vertical ? 0 : 1,
        dy: vertical ? 1 : 0,
        len: Math.random() * 60 + 40,
        speed: Math.random() * 2.5 + 1.8,
        alpha: Math.random() * 0.4 + 0.3,
        vertical,
      });
    };

    let lastSpawn = performance.now();

    const render = (now: number) => {
      animId = requestAnimationFrame(render);

      if (now - lastSpawn > 1200) {
        spawnPulse();
        lastSpawn = now;
      }

      ctx.clearRect(0, 0, width, height);

      // Render circuit bus pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.x += p.dx * p.speed;
        p.y += p.dy * p.speed;

        if (p.x > width + 100 || p.y > height + 100) {
          pulses.splice(i, 1);
          continue;
        }

        const grad = ctx.createLinearGradient(
          p.x,
          p.y,
          p.x - p.dx * p.len,
          p.y - p.dy * p.len
        );
        grad.addColorStop(0, `rgba(56, 189, 248, ${p.alpha})`);
        grad.addColorStop(0.3, `rgba(14, 165, 233, ${p.alpha * 0.7})`);
        grad.addColorStop(1, 'rgba(14, 165, 233, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.dx * p.len, p.y - p.dy * p.len);
        ctx.stroke();

        // Glowing pulse head
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Industrial Slate/Obsidian Workshop Floor Base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, #080d16 0%, #05080e 45%, #020306 85%, #000000 100%)',
        }}
      />

      {/* 2. Focused Mechatronics Testing Stage Spotlight (Backlight for the Robot) */}
      <div
        className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] sm:w-[860px] h-[400px] sm:h-[540px] pointer-events-none opacity-75"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(255, 255, 255, 0.28) 0%, rgba(224, 242, 254, 0.14) 30%, rgba(56, 189, 248, 0.05) 55%, transparent 75%)',
          filter: 'blur(18px)',
        }}
      />

      {/* 3. Subtle CAD Blueprint Isometric / Orthogonal Floor Grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* 4. Fine 16px Secondary Grid (Precision Millimeter Ruler) */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(56, 189, 248, 0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.8) 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px',
        }}
      />

      {/* 5. ABU Robocon & RoboSaga Arena Calibrated Boundary Arc */}
      <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[660px] sm:w-[820px] h-[660px] sm:h-[820px] pointer-events-none opacity-20 flex items-center justify-center">
        {/* Outer Circular Boundary with Angle Graduation Ticks */}
        <div className="absolute w-[620px] sm:w-[760px] h-[620px] sm:h-[760px] rounded-full border border-sky-400/30 border-dashed" />
        {/* Secondary Kinematic Work-Envelope Radius */}
        <div className="absolute w-[440px] sm:w-[540px] h-[440px] sm:h-[540px] rounded-full border border-white/20" />
        {/* Origin Reticle Circle */}
        <div className="absolute w-[220px] sm:w-[280px] h-[220px] sm:h-[280px] rounded-full border border-sky-300/40" />
        {/* Cartesian Crosshairs */}
        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-sky-400/20 to-transparent" />
        <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-sky-400/20 to-transparent" />
      </div>

      {/* 6. Hardware Circuit Traces Stream Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 7. CAD Metric Ruler Borders & BIT Mesra Robocon Telemetry Markers */}
      <div className="absolute inset-6 sm:inset-10 border border-white/[0.06] pointer-events-none">
        {/* Top-Left: Lab Identification */}
        <div className="absolute -top-[1px] -left-[1px] flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-white/40">
          <span className="text-white font-bold text-xs">+</span>
          <span className="hidden md:inline">LAB.BITM // ROBOTICS &amp; MECHATRONICS</span>
        </div>

        {/* Top-Right: ABU Robocon Contest Code */}
        <div className="absolute -top-[1px] -right-[1px] flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-white/40">
          <span className="hidden md:inline">TEAM PRATYUMNIS // ABU ROBOCON</span>
          <span className="text-white font-bold text-xs">+</span>
        </div>

        {/* Bottom-Left: Kinematics Axis Indicator */}
        <div className="absolute -bottom-[1px] -left-[1px] flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-white/40">
          <span className="text-white font-bold text-xs">+</span>
          <span className="hidden md:inline">KINEMATICS: 6-DOF // CAN-BUS STM32</span>
        </div>

        {/* Bottom-Right: RoboSaga Fest Flagship */}
        <div className="absolute -bottom-[1px] -right-[1px] flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-white/40">
          <span className="hidden md:inline">FLAGSHIP: ROBOSAGA // EST. 2001</span>
          <span className="text-white font-bold text-xs">+</span>
        </div>
      </div>

      {/* 8. Vignette Edge Softener */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 45%, rgba(0, 0, 0, 0.5) 85%, rgba(0, 0, 0, 0.85) 100%)',
        }}
      />
    </div>
  );
}
