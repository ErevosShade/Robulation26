'use client';

import React, { useState } from 'react';
import {
  Cpu,
  Radio,
  GitBranch,
  RotateCw,
  Gauge,
  Compass,
  Layers,
  Activity
} from 'lucide-react';

interface Subsystem {
  id: string;
  name: string;
  category: string;
  spec: string;
  coords: { x: number; y: number };
  icon: React.ComponentType<{ className?: string }>;
}

const subsystems: Subsystem[] = [
  {
    id: 'chassis',
    name: 'M.A.R.S. Core Avionics Chassis',
    category: 'Structural / PCB',
    spec: 'Dual-layer white PCB enclosure, motor driver H-bridges, 5V power bus, perforations for modular brackets.',
    coords: { x: 50, y: 50 },
    icon: Cpu,
  },
  {
    id: 'sonar',
    name: 'Ultrasonic Sonar Mast (HC-SR04)',
    category: 'Sensor Telemetry',
    spec: 'Dual 40kHz acoustic transducers, 2cm–400cm ranging, active front scanning for automated obstacle avoidance.',
    coords: { x: 26, y: 30 },
    icon: Radio,
  },
  {
    id: 'suspension',
    name: 'Rocker-Bogie Articulation System',
    category: 'Kinematics',
    spec: 'Dual-side passive linkage beams with center differential crossbar, traverses obstacles up to 2× wheel diameter.',
    coords: { x: 62, y: 44 },
    icon: GitBranch,
  },
  {
    id: 'steering',
    name: '4× Corner Digital Steering Servos',
    category: 'Actuation',
    spec: 'MG90S metal gear micro-servos mounted on corner brackets, enables zero-radius skid turns & Ackerman geometry.',
    coords: { x: 30, y: 72 },
    icon: RotateCw,
  },
  {
    id: 'wheels',
    name: '6× High-Traction Gearmotor Wheels',
    category: 'Powertrain',
    spec: 'Independent geared DC motors, deep chevron rubber all-terrain treads, lightweight white spoke hubs.',
    coords: { x: 74, y: 76 },
    icon: Gauge,
  },
  {
    id: 'controller',
    name: 'Acrylic Compute Expansion Bay',
    category: 'Logic Core',
    spec: 'Vertical transparent enclosure slotted for BBC micro:bit / Raspberry Pi robotics controller board.',
    coords: { x: 52, y: 26 },
    icon: Layers,
  },
];

export default function RoverGridDiagram() {
  const [activeSubsystem, setActiveSubsystem] = useState<string>('chassis');

  const selected = subsystems.find((s) => s.id === activeSubsystem) || subsystems[0];

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 text-white font-mono select-none">
      {/* Top Diagram Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-bold text-white tracking-wider">
            M.A.R.S. ROVER // GRID STRUCTURAL SCHEMATIC
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-[10px]">
            REV 2.4
          </span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400 text-[11px]">
          <span>GRID: 20×20mm</span>
          <span>•</span>
          <span>SCALE: 1:1 ORTHO</span>
          <span>•</span>
          <span className="text-emerald-400">STATUS: TELEMETRY NOMINAL</span>
        </div>
      </div>

      {/* Main Blueprint Grid Area */}
      <div className="relative flex-1 w-full my-4 rounded-xl border border-white/10 bg-[#090b10]/90 backdrop-blur-xl overflow-hidden flex items-center justify-center">
        {/* Subtle CAD Coordinate Grid lines */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px',
          }}
        />

        {/* Diagonal Crosshairs / Coordinate Markers */}
        <div className="absolute top-3 left-3 text-[10px] text-zinc-500">
          [X: 000.00 Y: +155.0]
        </div>
        <div className="absolute bottom-3 right-3 text-[10px] text-zinc-500">
          [DIM: 220 × 195 × 155 mm]
        </div>

        {/* Blueprint Schematic SVG Graphic of the Rover */}
        <svg
          className="w-full max-w-xl h-auto max-h-[300px] text-zinc-400"
          viewBox="0 0 600 360"
          fill="none"
        >
          {/* Central Chassis Outline */}
          <rect
            x="200"
            y="120"
            width="200"
            height="110"
            rx="6"
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            fill="rgba(255,255,255,0.03)"
          />
          <text x="215" y="145" fill="white" fontSize="12" fontWeight="bold">
            M.A.R.S. MAINBOARD
          </text>

          {/* Controller Bay */}
          <rect
            x="270"
            y="55"
            width="60"
            height="65"
            rx="3"
            stroke="#38bdf8"
            strokeWidth="1.5"
            fill="rgba(56,189,248,0.06)"
          />
          <text x="276" y="85" fill="#38bdf8" fontSize="10">
            COMPUTE
          </text>

          {/* Ultrasonic Mast */}
          <line x1="160" y1="120" x2="160" y2="70" stroke="white" strokeWidth="2" />
          <rect x="135" y="45" width="50" height="30" rx="3" stroke="white" strokeWidth="1.5" />
          <circle cx="148" cy="60" r="8" stroke="cyan" strokeWidth="1.5" fill="rgba(6,182,212,0.1)" />
          <circle cx="172" cy="60" r="8" stroke="cyan" strokeWidth="1.5" fill="rgba(6,182,212,0.1)" />

          {/* Rocker-Bogie Linkage Arms */}
          {/* Main Pivot */}
          <circle cx="300" cy="175" r="7" stroke="white" strokeWidth="2" fill="#09090b" />
          {/* Forward Arm to Bogie Pivot */}
          <line x1="300" y1="175" x2="190" y2="210" stroke="white" strokeWidth="3" />
          <circle cx="190" cy="210" r="6" stroke="white" strokeWidth="2" fill="#09090b" />
          {/* Bogie Beam */}
          <line x1="130" y1="240" x2="250" y2="240" stroke="white" strokeWidth="2.5" />
          {/* Rear Rocker Arm */}
          <line x1="300" y1="175" x2="450" y2="220" stroke="white" strokeWidth="3" />

          {/* 6 Wheels Blueprint Outlines */}
          {/* Front Left */}
          <rect x="90" y="240" width="60" height="42" rx="6" stroke="white" strokeWidth="1.5" />
          {/* Mid Left */}
          <rect x="230" y="240" width="60" height="42" rx="6" stroke="white" strokeWidth="1.5" />
          {/* Rear Left */}
          <rect x="430" y="240" width="60" height="42" rx="6" stroke="white" strokeWidth="1.5" />

          {/* Steering Servo brackets */}
          <rect x="105" y="215" width="30" height="25" rx="3" stroke="#f97316" strokeWidth="1.5" />
          <rect x="445" y="215" width="30" height="25" rx="3" stroke="#f97316" strokeWidth="1.5" />

          {/* Leader Lines to Subsystems */}
          <line x1="160" y1="60" x2="90" y2="30" stroke="rgba(255,255,255,0.4)" strokeDasharray="2 2" />
          <line x1="300" y1="175" x2="300" y2="135" stroke="rgba(255,255,255,0.4)" strokeDasharray="2 2" />
        </svg>

        {/* Interactive Hotspot Nodes */}
        {subsystems.map((sub) => {
          const isSelected = sub.id === activeSubsystem;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => setActiveSubsystem(sub.id)}
              style={{ left: `${sub.coords.x}%`, top: `${sub.coords.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500 text-black border-white shadow-[0_0_15px_#06b6d4] scale-125'
                  : 'bg-black/80 text-white border-white/30 hover:border-white hover:scale-110'
              }`}
              title={sub.name}
            >
              <sub.icon className="w-3.5 h-3.5" />
            </button>
          );
        })}
      </div>

      {/* Selected Subsystem Detail Card */}
      <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
              {selected.category}
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-semibold text-white">{selected.name}</span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">{selected.spec}</p>
        </div>

        {/* Quick Spec Pills */}
        <div className="flex items-center gap-2 text-[10px] shrink-0">
          <div className="px-2.5 py-1 rounded border border-white/10 bg-black/40 text-zinc-300">
            MOTOR: 6× N20 GEARED
          </div>
          <div className="px-2.5 py-1 rounded border border-white/10 bg-black/40 text-zinc-300">
            SERVOS: 4× 9G METAL
          </div>
        </div>
      </div>
    </div>
  );
}
