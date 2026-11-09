'use client';

import React from 'react';
import ScrollReveal from '@/components/ScrollReveal';

interface Sponsor {
  name: string;
  category: string;
  icon: React.ReactNode;
}

const sponsors: Sponsor[] = [
  {
    name: 'MathWorks',
    category: 'MATLAB & Simulink',
    icon: (
      <svg className="w-7 h-7 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17.5L7.5 7L12 15L16.5 9.5L21 16.5H18.5L16.5 12.5L12 18.5L7.5 10.5L4.5 17.5H3Z" />
        <circle cx="12" cy="6" r="2" fill="currentColor" opacity="0.6" />
      </svg>
    ),
  },
  {
    name: 'SolidWorks',
    category: 'CAD & FEA Kinematics',
    icon: (
      <svg className="w-7 h-7 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2L3 7L12 12L21 7L12 2Z" strokeLinejoin="round" />
        <path d="M3 7V17L12 22V12" strokeLinejoin="round" />
        <path d="M21 7V17L12 22" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Texas Instruments',
    category: 'Cortex MCUs & Power',
    icon: (
      <svg className="w-7 h-7 text-rose-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="3" strokeLinecap="round" />
        <path d="M8 8H16V10H13V16H11V10H8V8Z" fill="currentColor" />
        <circle cx="15.5" cy="15.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'STMicroelectronics',
    category: 'STM32 Microcontrollers',
    icon: (
      <svg className="w-7 h-7 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20" strokeLinecap="round" />
        <path d="M8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'NVIDIA',
    category: 'Jetson Autonomous AI',
    icon: (
      <svg className="w-7 h-7 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C15.31 20 18.15 17.98 19.34 15.1" strokeLinecap="round" />
        <path d="M12 7.5C9.51 7.5 7.5 9.51 7.5 12C7.5 14.49 9.51 16.5 12 16.5C13.86 16.5 15.46 15.36 16.13 13.74" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Ansys',
    category: 'FEA Stress & Fluidics',
    icon: (
      <svg className="w-7 h-7 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 19L12 4L19 19L14 19L12 14L10 19H5Z" strokeLinejoin="round" fill="currentColor" fillOpacity="0.25" />
        <line x1="8" y1="15" x2="16" y2="15" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Autodesk',
    category: 'Fusion 360 Fabrication',
    icon: (
      <svg className="w-7 h-7 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 17L12 3L21 17L17 21L12 16L7 21L3 17Z" strokeLinejoin="round" />
        <circle cx="12" cy="11" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'PCBWay',
    category: 'Rapid Hardware Fab',
    icon: (
      <svg className="w-7 h-7 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="16" rx="2" strokeLinecap="round" />
        <circle cx="8" cy="9" r="1.5" fill="currentColor" />
        <circle cx="16" cy="9" r="1.5" fill="currentColor" />
        <circle cx="12" cy="15" r="1.5" fill="currentColor" />
        <path d="M8 9H16V15" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Arduino',
    category: 'Sensor Telemetry & ESCs',
    icon: (
      <svg className="w-7 h-7 text-teal-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="8" cy="12" r="5" strokeLinecap="round" />
        <circle cx="16" cy="12" r="5" strokeLinecap="round" />
        <path d="M6.5 12H9.5" strokeLinecap="round" />
        <path d="M14.5 12H17.5M16 10.5V13.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'ROS 2',
    category: 'Robotics Middleware',
    icon: (
      <svg className="w-7 h-7 text-sky-300 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="6" cy="6" r="2" />
        <circle cx="12" cy="6" r="2" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="6" cy="12" r="2" />
        <circle cx="12" cy="12" r="2.5" fill="#38bdf8" />
        <circle cx="18" cy="12" r="2" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="12" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </svg>
    ),
  },
];

export default function SponsorsMarquee() {
  // Duplicate list to create a seamless infinite scrolling loop
  const marqueeItems = [...sponsors, ...sponsors];

  return (
    <section
      id="sponsors"
      className="relative z-20 py-16 sm:py-24 overflow-hidden border-t border-white/[0.07] bg-transparent"
    >
      {/* Background ambient aerospace glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[180px] bg-sky-500/5 blur-[120px] pointer-events-none rounded-full" />

      <ScrollReveal direction="up">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 pl-14 sm:pl-20 mb-10 sm:mb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-white/[0.03] border border-white/10 font-mono text-[9px] sm:text-[10px] tracking-widest text-slate-300 uppercase mb-3 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)] animate-pulse" />
              <span>INDUSTRIAL ALLIANCES • SPONSOR TELEMETRY</span>
            </div>
            <h2 className="font-modern font-black text-3xl sm:text-5xl tracking-tight text-white uppercase mt-1">
              OUR SPONSORS
            </h2>
          </div>
          <p className="font-modern text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed font-mono">
            Backed by global engineering leaders, computational hardware manufacturers, and collegiate mechatronics patrons.
          </p>
        </div>
      </div>

      </ScrollReveal>

      {/* Marquee Track Container with Edge Gradient Fade */}
      <ScrollReveal direction="up" delay={120}>
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee-left gap-4 sm:gap-6 py-2 select-none">
          {marqueeItems.map((sponsor, index) => (
            <div
              key={`${sponsor.name}-${index}`}
              className="relative group shrink-0 w-[230px] sm:w-[260px] h-[72px] sm:h-[80px] rounded-xl bg-[#040814]/80 hover:bg-[#071126]/90 border border-white/10 hover:border-sky-400/50 backdrop-blur-xl px-4 sm:px-5 flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(56,189,248,0.22)] cursor-default"
            >
              {/* Corner targeting reticles */}
              <span className="pointer-events-none absolute top-2 right-2 font-mono text-[8px] text-white/20 select-none tracking-tighter">
                +
              </span>
              <span className="pointer-events-none absolute bottom-2 left-2 font-mono text-[8px] text-white/20 select-none tracking-tighter">
                +
              </span>

              {/* Sponsor Icon with glow effect */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-sky-400/40 group-hover:bg-sky-500/[0.08] transition-all duration-300">
                {sponsor.icon}
              </div>

              {/* Sponsor Info */}
              <div className="flex flex-col min-w-0">
                <span className="font-modern font-bold text-sm sm:text-base text-white group-hover:text-sky-300 transition-colors uppercase tracking-wider truncate">
                  {sponsor.name}
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] text-slate-400 group-hover:text-slate-300 uppercase tracking-widest truncate mt-0.5">
                  {sponsor.category}
                </span>
              </div>
            </div>
          ))}
        </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
