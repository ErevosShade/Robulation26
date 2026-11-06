'use client';

import React, { useRef, useState } from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  outerClassName?: string;
  spotlightColor?: string;
  badge?: string;
  reticle?: boolean;
  chamfer?: boolean;
  glowOnHover?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  outerClassName = '',
  spotlightColor = 'rgba(255, 255, 255, 0.08)',
  badge,
  reticle = true,
  chamfer = false,
  glowOnHover = true,
  ...props
}: GlassCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group rounded-[1.75rem] p-1.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        glowOnHover
          ? 'hover:shadow-[0_0_30px_rgba(255,255,255,0.06)]'
          : ''
      } ${outerClassName}`}
      style={{
        background:
          'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 60%, rgba(255, 255, 255, 0.08) 100%)',
      }}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[1.75rem] transition-opacity duration-300 -z-0"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />

      {/* Outer Hairline Border */}
      <div className="absolute inset-0 rounded-[1.75rem] border border-white/10 group-hover:border-white/25 pointer-events-none transition-colors duration-500" />

      {/* Inner Machined Core (Double-Bezel) */}
      <div
        className={`relative z-10 w-full h-full rounded-[calc(1.75rem-0.375rem)] bg-[#03060c]/80 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)] group-hover:bg-[#03060c]/70 transition-colors duration-500 ${className}`}
      >
        {/* Subtle Laser Scanline sweep on hover */}
        <div className="pointer-events-none absolute -inset-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent group-hover:translate-x-full duration-1000 transform -skew-x-12" />

        {/* Aerospace Reticles / Corner Brackets */}
        {reticle && (
          <>
            <span className="pointer-events-none absolute top-2.5 left-2.5 font-mono text-[9px] text-white/20 select-none tracking-tighter">
              +
            </span>
            <span className="pointer-events-none absolute top-2.5 right-2.5 font-mono text-[9px] text-white/20 select-none tracking-tighter">
              +
            </span>
            <span className="pointer-events-none absolute bottom-2.5 left-2.5 font-mono text-[9px] text-white/20 select-none tracking-tighter">
              +
            </span>
            <span className="pointer-events-none absolute bottom-2.5 right-2.5 font-mono text-[9px] text-white/20 select-none tracking-tighter">
              +
            </span>
          </>
        )}

        {/* Micro Telemetry Eyebrow Badge (if provided) */}
        {badge && (
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
              <span className="tracking-widest">{badge}</span>
            </div>
            {/* Live Micro Signal Equalizer Bars */}
            <div className="flex items-end gap-0.5 h-3 opacity-60 group-hover:opacity-100 transition-opacity">
              <span className="w-[2px] bg-white/70 animate-equalizer-1 rounded-full" />
              <span className="w-[2px] bg-sky-400 animate-equalizer-2 rounded-full" />
              <span className="w-[2px] bg-white animate-equalizer-3 rounded-full" />
              <span className="w-[2px] bg-white/50 animate-equalizer-4 rounded-full" />
            </div>
          </div>
        )}

        {/* Card Content */}
        {children}
      </div>
    </div>
  );
}
