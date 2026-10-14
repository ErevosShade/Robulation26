'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Crosshair, ArrowUpRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function AboutHeroSection() {
  return (
    <section
      id="about"
      className="relative z-20 w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 pl-14 sm:pl-20 border-t border-white/10 bg-transparent text-slate-100 overflow-hidden select-none"
    >
      {/* Subtle CAD Grid Overlay with High Transparency */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Top Header Pill */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-[1px] bg-[#FF9FFC] rotate-45 shadow-[0_0_8px_#FF9FFC]" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-slate-300 font-bold uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              SECTION 02 // INSTITUTIONAL TELEMETRY ARCHIVE
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-[9px] text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">PRATYUMNIS LAB 01 // SHADERS LIVE</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Left HUD Console + Right Bot Wireframe */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          {/* =================================================================
              LEFT HALF: ABOUT US HUD CONSOLE (100% Transparent Cyber-Glass)
          ================================================================= */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center">
            <ScrollReveal>
              {/* Bespoke Aerospace HUD Frame Container - Transparent Background */}
              <div
                className="relative p-6 sm:p-8 rounded-[4px] bg-transparent border border-white/20 select-none shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
                style={{
                  clipPath:
                    'polygon(0% 0%, calc(100% - 24px) 0%, 100% 24px, 100% 100%, 24px 100%, 0% calc(100% - 24px))',
                }}
              >
                {/* Stepped Corner Chamfer Accents in Silver & Cyan */}
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/60 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/60 pointer-events-none" />

                {/* Status Badge */}
                <div className="flex items-center gap-2 font-mono text-[9.5px] tracking-widest text-slate-300 uppercase mb-3 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF9FFC] shadow-[0_0_8px_#FF9FFC] animate-pulse" />
                  <span className="font-semibold text-slate-200">INSTITUTIONAL RECORD</span>
                  <span className="text-slate-600">//</span>
                  <span className="text-slate-400">EST. 2001</span>
                </div>

                {/* Main Heavy Heading */}
                <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight text-white mb-1 uppercase font-modern drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  ABOUT US
                </h2>

                {/* Subtitle */}
                <div className="font-mono text-[10.5px] sm:text-[11.5px] font-bold tracking-[0.2em] uppercase mb-5 flex items-center gap-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  <span className="bg-gradient-to-r from-zinc-200 via-white to-zinc-400 bg-clip-text text-transparent">
                    ROBOLUTION // TEAM PRATYUMNIS
                  </span>
                </div>

                {/* Core Society Description */}
                <div className="space-y-3 font-sans text-xs sm:text-[13px] leading-relaxed text-slate-200 font-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  <p>
                    Founded in 2001, <strong className="text-[#FF9FFC] font-semibold">Robolution</strong> is the official robotics and innovation club of{' '}
                    <strong className="text-white font-semibold">BIT Mesra</strong>, one of India&apos;s leading engineering institutions.
                  </p>
                  <p>
                    Also known as <strong className="text-white font-semibold">Team Pratyumnis</strong>, we bring together expertise in mechanical design, electronics, and programming to develop innovative robotic systems that compete at national and international levels.
                  </p>
                </div>

                {/* Technical Telemetry Specs Matrix - 100% Transparent Cards */}
                <div className="grid grid-cols-2 gap-2.5 my-6 pt-5 border-t border-white/10 font-mono text-[10px]">
                  <div className="p-2.5 rounded-[2px] bg-transparent border border-white/15 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                    <span className="text-[8.5px] text-slate-400 block tracking-widest uppercase">
                      AFFILIATION
                    </span>
                    <span className="text-slate-100 font-bold tracking-wider mt-0.5 block truncate">
                      BIT MESRA // PIE DEPT.
                    </span>
                  </div>
                  <div className="p-2.5 rounded-[2px] bg-transparent border border-white/15 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                    <span className="text-[8.5px] text-slate-400 block tracking-widest uppercase">
                      ACHIEVEMENT
                    </span>
                    <span className="text-[#FF9FFC] font-bold tracking-wider mt-0.5 block truncate">
                      100/100 CAD SCORE
                    </span>
                  </div>
                  <div className="p-2.5 rounded-[2px] bg-transparent border border-white/15 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                    <span className="text-[8.5px] text-slate-400 block tracking-widest uppercase">
                      FLAGSHIP ARENA
                    </span>
                    <span className="text-slate-100 font-bold tracking-wider mt-0.5 block truncate">
                      ROBOSAGA &bull; ROBOCON
                    </span>
                  </div>
                  <div className="p-2.5 rounded-[2px] bg-transparent border border-white/15 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                    <span className="text-[8.5px] text-slate-400 block tracking-widest uppercase">
                      ACTIVE MEMBERS
                    </span>
                    <span className="text-cyan-300 font-bold tracking-wider mt-0.5 block truncate">
                      120+ ENGINEERS
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Action Link & Status Dots */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF9FFC] animate-ping" />
                    <span className="font-mono text-[9px] text-slate-300 tracking-widest uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      TELEMETRY VERIFIED
                    </span>
                  </div>

                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[2px] bg-transparent hover:bg-white/10 border border-white/25 text-slate-200 hover:text-white font-mono text-[10px] tracking-widest uppercase transition-all shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                  >
                    <span>EXPLORE ARCHIVE</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Bottom Right HUD Triple Dots */}
                <div className="absolute bottom-2.5 right-4 flex items-center gap-1 opacity-60">
                  <span className="w-1 h-1 rounded-full bg-white" />
                  <span className="w-1 h-1 rounded-full bg-white" />
                  <span className="w-1 h-1 rounded-full bg-white" />
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* =================================================================
              RIGHT HALF: ATTACHED 2D CAD WIREFRAME BOT (Pristine Unobstructed View)
          ================================================================= */}
          <div className="lg:col-span-7 xl:col-span-7 relative">
            <ScrollReveal>
              {/* Outer Card - 100% Transparent */}
              <div className="relative group rounded-[4px] bg-transparent border border-white/20 p-2 sm:p-3 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
                {/* Outer Framing Aerospace Chamfers */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/70 z-20 pointer-events-none" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/70 z-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/70 z-20 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/70 z-20 pointer-events-none" />

                {/* Top Blueprint Telemetry HUD Bar - Transparent */}
                <div className="relative z-20 flex items-center justify-between px-3 py-1.5 bg-transparent border-b border-white/10 text-[9px] font-mono text-slate-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-3 h-3 text-[#FF9FFC] animate-spin" style={{ animationDuration: '10s' }} />
                    <span className="tracking-widest uppercase font-bold text-white">
                      DWG: ROB-2026-DRUM // ISOMETRIC WIREFRAME
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span>CAD RESOLUTION: 4K</span>
                    <span className="text-[#FF9FFC] font-bold">[ 15KG CLASS ]</span>
                  </div>
                </div>

                {/* Transparent Image Container with Clean Transparent PNG */}
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] bg-transparent overflow-hidden flex items-center justify-center">
                  <Image
                    src="/combat-bot-transparent.png"
                    alt="Robolution Combat Drum Spinner Bot 2D Wireframe Blueprint"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 55vw"
                    className="object-contain filter contrast-125 brightness-110 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                </div>

                {/* Bottom Blueprint Telemetry Footer - Transparent */}
                <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 bg-transparent border-t border-white/10 text-[9px] font-mono text-slate-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  <div className="flex items-center gap-3">
                    <span className="text-[#FF9FFC] font-bold">// SYSTEM ARCHITECTURE:</span>
                    <span className="text-slate-100">
                      HEAVYWEIGHT DRUM SPINNER &bull; HARDOX WEDGE &bull; DUAL DRIVE
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>BIT MESRA ROBOTICS</span>
                    <span className="text-white">&bull;</span>
                    <span className="text-[#FF9FFC]">TEAM PRATYUMNIS</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
