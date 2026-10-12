'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface MissionLoadingScreenProps {
  progress: number;
  stage?: string;
  isLoaded: boolean;
  onFinish?: () => void;
}

const ROBOTICS_DIAGNOSTICS = [
  'INITIALIZING BIT MESRA ROBOLUTION WORKBENCH v2.6...',
  'CONNECTING STM32 CAN-BUS MOTOR ACTUATORS...',
  'CALIBRATING 6-DOF INDUSTRIAL ROBOTIC ARM KINEMATICS...',
  'SYNCING TEAM PRATYUMNIS ABU ROBOCON TELEMETRY...',
  'PARSING 3D CAD MESHES & STRUCTURAL WIREFRAMES...',
  'ROBOSAGA ARENA COMBAT ROBOTICS SYSTEMS ONLINE...',
  'WORKBENCH READY // INITIALIZING HUD CONSOLE...',
];

export default function MissionLoadingScreen({
  progress,
  stage = 'CALIBRATING MECHATRONICS',
  isLoaded,
  onFinish,
}: MissionLoadingScreenProps) {
  const [logIndex, setLogIndex] = useState(0);
  const [shouldRender, setShouldRender] = useState(true);
  const [fadeState, setFadeState] = useState<'visible' | 'fading' | 'hidden'>('visible');

  // Diagnostic log cycling
  useEffect(() => {
    const timer = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % ROBOTICS_DIAGNOSTICS.length);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // When model finishes loading, trigger exit transition
  useEffect(() => {
    if (isLoaded && progress >= 100) {
      const exitTimer = setTimeout(() => {
        setFadeState('fading');
        const hideTimer = setTimeout(() => {
          setFadeState('hidden');
          setShouldRender(false);
          onFinish?.();
        }, 600);
        return () => clearTimeout(hideTimer);
      }, 400);
      return () => clearTimeout(exitTimer);
    }
  }, [isLoaded, progress, onFinish]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#04060a] select-none transition-all duration-700 ease-out ${
        fadeState === 'fading'
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
    >
      {/* Background CAD Grid & Blueprint Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(8, 16, 28, 0.95) 0%, rgba(2, 4, 8, 0.98) 75%, #000000 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Workshop Spotlight */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] opacity-35 blur-[70px]"
          style={{
            background:
              'radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, rgba(14, 165, 233, 0.12) 50%, transparent 80%)',
          }}
        />
      </div>

      {/* Top Header Telemetry Bar */}
      <header className="relative z-10 w-full max-w-6xl pt-6 px-6 sm:px-12 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-7 h-7 flex items-center justify-center">
            <Image
              src="/robolution-icon-bright.png"
              alt="Robolution"
              width={28}
              height={28}
              className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">
              ROBOLUTION // BIT MESRA
            </span>
            <span className="font-mono text-[9px] tracking-wider text-zinc-400 uppercase">
              OFFICIAL ROBOTICS CLUB • TEAM PRATYUMNIS
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-6 font-mono text-[10px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300">SYSTEM: ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="text-zinc-300">ROBOCON KINEMATICS</span>
          </div>
          <div className="text-zinc-500">EST. 2001</div>
        </div>
      </header>

      {/* Central 3D Mechatronic Calibration Stage */}
      <div className="relative z-10 flex-1 w-full max-w-4xl flex flex-col items-center justify-center px-4">
        {/* Holographic Concentric Calibration Rings */}
        <div className="relative w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] flex items-center justify-center">
          {/* Outer Dashed Orbit Ring */}
          <div className="absolute inset-0 rounded-full border border-sky-400/25 border-dashed animate-[spin_35s_linear_infinite]" />
          
          {/* Secondary Precision Ring */}
          <div className="absolute inset-6 rounded-full border border-white/15 animate-[spin_25s_linear_infinite_reverse]" />

          {/* Inner Focusing Ring */}
          <div className="absolute inset-16 rounded-full border border-sky-300/35" />

          {/* Sweeping Laser Radar Line */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            <div
              className="w-full h-full animate-[spin_3.5s_linear_infinite]"
              style={{
                background:
                  'conic-gradient(from 0deg at 50% 50%, rgba(56, 189, 248, 0.28) 0deg, transparent 60deg, transparent 360deg)',
              }}
            />
          </div>

          {/* 3D Robotics Kinetic Icon & Schematic */}
          <div className="relative w-[260px] h-[220px] sm:w-[340px] sm:h-[260px] flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
              <Image
                src="/robolution-icon-bright.png"
                alt="Robolution Robotics Logo"
                width={160}
                height={160}
                priority
                className="object-contain filter drop-shadow-[0_0_24px_rgba(56,189,248,0.5)] brightness-125"
              />

              {/* Horizontal Laser Scanline */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                  className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_12px_#38bdf8] absolute left-0"
                  style={{
                    animation: 'scanlineMove 2.2s ease-in-out infinite',
                  }}
                />
              </div>

              {/* Targeting Reticles on End-Effector */}
              <div className="absolute top-[22%] right-[18%] flex items-center gap-1 font-mono text-[8px] text-sky-300">
                <span className="w-2 h-2 rounded-full border border-sky-400 flex items-center justify-center animate-ping" />
                <span className="bg-black/70 px-1 py-0.5 rounded border border-sky-400/30">END-EFFECTOR // 6-DOF</span>
              </div>

              <div className="absolute bottom-[18%] left-[16%] flex items-center gap-1 font-mono text-[8px] text-sky-300">
                <span className="w-2 h-2 rounded-full border border-sky-400 flex items-center justify-center" />
                <span className="bg-black/70 px-1 py-0.5 rounded border border-sky-400/30">ACTUATORS // ARMED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Live Readout Text */}
        <div className="mt-4 flex flex-col items-center gap-1.5 text-center">
          <div className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-sky-300 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
            <span>{stage.toUpperCase()}</span>
          </div>
          <div className="font-mono text-[10px] sm:text-[11px] text-zinc-400 tracking-wider h-5 overflow-hidden">
            <span className="text-zinc-500 mr-2">&gt;</span>
            <span className="text-zinc-300">{ROBOTICS_DIAGNOSTICS[logIndex]}</span>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar & System Readiness Console */}
      <footer className="relative z-10 w-full max-w-4xl pb-8 px-6 sm:px-12 flex flex-col gap-4">
        {/* Progress Metrics & Bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between font-mono text-xs tracking-wider">
            <span className="text-zinc-400 flex items-center gap-2">
              <span>WORKBENCH CALIBRATION</span>
              <span className="text-white/40">//</span>
              <span className="text-sky-400">{progress}%</span>
            </span>
            <span className="text-zinc-400">
              {progress >= 100 ? 'SYSTEM READY' : 'CALIBRATING'}
            </span>
          </div>

          {/* Stepped Sci-Fi Progress Track */}
          <div className="relative w-full h-2 bg-white/10 rounded-sm overflow-hidden p-[1px] border border-white/20">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-white to-sky-300 transition-all duration-300 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Subsystem Telemetry Status Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[9px] tracking-wider text-zinc-400 pt-1">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white/[0.03] border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>ROBOCON: ABU CONTEST</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white/[0.03] border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>FIRMWARE: STM32 CAN</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white/[0.03] border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span>FLAGSHIP: ROBOSAGA</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white/[0.03] border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>PRATYUMNIS: VERIFIED</span>
          </div>
        </div>
      </footer>

      {/* Global CSS for the laser scanline movement */}
      <style jsx>{`
        @keyframes scanlineMove {
          0% {
            top: 5%;
            opacity: 0.1;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            top: 92%;
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
}
