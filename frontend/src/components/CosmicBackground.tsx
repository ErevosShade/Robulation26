'use client';

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  depth: number;
}

interface Meteor {
  x: number;
  y: number;
  len: number;
  speed: number;
  alpha: number;
  angle: number;
  active: boolean;
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Parallax mouse target
    const mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };
    window.addEventListener('resize', handleResize);

    // Generate Stars
    let stars: Star[] = [];
    const initStars = () => {
      const starCount = Math.floor((width * height) / 7500); // Responsive density
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() < 0.85 ? Math.random() * 1.2 + 0.4 : Math.random() * 1.8 + 1.2,
          baseAlpha: Math.random() * 0.55 + 0.2,
          twinkleSpeed: Math.random() * 0.025 + 0.008,
          twinklePhase: Math.random() * Math.PI * 2,
          depth: Math.random() * 0.6 + 0.4,
        });
      }
    };
    initStars();

    // Occasional Meteor / Telemetry Particle Streak
    let meteor: Meteor = {
      x: 0,
      y: 0,
      len: 0,
      speed: 0,
      alpha: 0,
      angle: Math.PI / 4,
      active: false,
    };

    let meteorTimer = 0;
    const spawnMeteor = () => {
      meteor = {
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.3,
        len: Math.random() * 80 + 50,
        speed: Math.random() * 10 + 8,
        alpha: Math.random() * 0.5 + 0.4,
        angle: (Math.PI / 180) * (35 + Math.random() * 15),
        active: true,
      };
    };

    let lastTime = performance.now();

    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth mouse lerp for subtle cosmic parallax
      mouse.x += (mouse.tx - mouse.x) * 0.03;
      mouse.y += (mouse.ty - mouse.y) * 0.03;

      const pxOffset = ((mouse.x - width / 2) / width) * 25;
      const pyOffset = ((mouse.y - height / 2) / height) * 25;

      ctx.clearRect(0, 0, width, height);

      // Render Stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.twinklePhase += s.twinkleSpeed;
        const twinkle = Math.sin(s.twinklePhase) * 0.35;
        const alpha = Math.max(0.08, Math.min(0.95, s.baseAlpha + twinkle));

        const sx = s.x - pxOffset * s.depth;
        const sy = s.y - pyOffset * s.depth;

        // Wrap around bounds
        const drawX = ((sx % width) + width) % width;
        const drawY = ((sy % height) + height) % height;

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow around brighter stars
        if (s.size > 1.8 && alpha > 0.6) {
          ctx.fillStyle = `rgba(224, 242, 254, ${alpha * 0.3})`;
          ctx.beginPath();
          ctx.arc(drawX, drawY, s.size * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Handle Meteor Streak
      meteorTimer += dt;
      if (!meteor.active && meteorTimer > 7) {
        if (Math.random() < 0.03) {
          spawnMeteor();
          meteorTimer = 0;
        }
      }

      if (meteor.active) {
        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;
        meteor.alpha -= dt * 0.6;

        if (meteor.alpha <= 0 || meteor.x > width || meteor.y > height) {
          meteor.active = false;
        } else {
          const tailX = meteor.x - Math.cos(meteor.angle) * meteor.len;
          const tailY = meteor.y - Math.sin(meteor.angle) * meteor.len;

          const grad = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
          grad.addColorStop(0, `rgba(255, 255, 255, ${meteor.alpha})`);
          grad.addColorStop(0.3, `rgba(186, 230, 253, ${meteor.alpha * 0.8})`);
          grad.addColorStop(1, 'rgba(186, 230, 253, 0)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        }
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Deep Space Atmospheric Void Base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, #050a16 0%, #03060d 45%, #010205 85%, #000000 100%)',
        }}
      />

      {/* 2. Living Interstellar Nebula Auras (Subtle Pulsing Breathing Glows) */}
      <div
        className="absolute top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] sm:w-[1100px] h-[450px] sm:h-[550px] opacity-40 blur-[90px] animate-pulse"
        style={{
          animationDuration: '9s',
          background:
            'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(99, 102, 241, 0.28) 0%, rgba(139, 92, 246, 0.18) 38%, rgba(56, 189, 248, 0.08) 65%, transparent 85%)',
        }}
      />

      <div
        className="absolute bottom-[20%] left-[25%] -translate-x-1/2 w-[600px] h-[380px] opacity-25 blur-[100px]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(14, 165, 233, 0.22) 0%, rgba(30, 58, 138, 0.14) 50%, transparent 80%)',
        }}
      />

      {/* 3. Rover Spotlight / Planetary Stage Horizon Glow */}
      <div
        className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[840px] h-[440px] sm:h-[560px] opacity-80 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 50% 50%, rgba(255, 255, 255, 0.32) 0%, rgba(224, 242, 254, 0.16) 32%, rgba(147, 197, 253, 0.06) 58%, transparent 75%)',
          filter: 'blur(20px)',
        }}
      />

      {/* 4. Telemetry Radar Guidance Concentric Rings (Centered behind 3D Rover) */}
      <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] sm:w-[820px] h-[680px] sm:h-[820px] pointer-events-none opacity-20 flex items-center justify-center">
        {/* Outer Ring with Faint Dashed Orbit */}
        <div className="absolute w-[640px] sm:w-[780px] h-[640px] sm:h-[780px] rounded-full border border-sky-400/25 border-dashed animate-[spin_120s_linear_infinite]" />
        {/* Secondary Ring with Tick Marks */}
        <div className="absolute w-[440px] sm:w-[540px] h-[440px] sm:h-[540px] rounded-full border border-white/20 animate-[spin_90s_linear_infinite_reverse]" />
        {/* Core Focal Ring */}
        <div className="absolute w-[260px] sm:w-[320px] h-[260px] sm:h-[320px] rounded-full border border-sky-300/30" />
        {/* Radar Crosshairs */}
        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-sky-400/15 to-transparent" />
        <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-sky-400/15 to-transparent" />
      </div>

      {/* 5. Precision Sci-Fi Coordinate Reticles & Corner HUD Markers */}
      <div className="absolute inset-6 sm:inset-10 border border-white/[0.04] pointer-events-none">
        {/* Top-Left Reticle */}
        <div className="absolute -top-[1px] -left-[1px] flex items-center gap-1 font-mono text-[9px] tracking-widest text-white/30">
          <span className="text-white/50 text-xs font-bold">+</span>
          <span className="hidden md:inline">SYS.POS // 23°25&apos;N 85°26&apos;E</span>
        </div>

        {/* Top-Right Reticle */}
        <div className="absolute -top-[1px] -right-[1px] flex items-center gap-1 font-mono text-[9px] tracking-widest text-white/30">
          <span className="hidden md:inline">CALIBRATION // NOMINAL</span>
          <span className="text-white/50 text-xs font-bold">+</span>
        </div>

        {/* Bottom-Left Reticle */}
        <div className="absolute -bottom-[1px] -left-[1px] flex items-center gap-1 font-mono text-[9px] tracking-widest text-white/30">
          <span className="text-white/50 text-xs font-bold">+</span>
          <span className="hidden md:inline">FREQ: 8.4 GHz // X-BAND DSN</span>
        </div>

        {/* Bottom-Right Reticle */}
        <div className="absolute -bottom-[1px] -right-[1px] flex items-center gap-1 font-mono text-[9px] tracking-widest text-white/30">
          <span className="hidden md:inline">CAD SCHEMATIC: CURIOSITY-MSL</span>
          <span className="text-white/50 text-xs font-bold">+</span>
        </div>
      </div>

      {/* 6. Dynamic Starfield Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 7. Ultra-fine Mission Control Vignette (Preserves central focus) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.45) 80%, rgba(0, 0, 0, 0.8) 100%)',
        }}
      />
    </div>
  );
}
