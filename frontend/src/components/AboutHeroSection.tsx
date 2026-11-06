'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import AnimatedCounter from '@/components/AnimatedCounter';

interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

const stats: StatItem[] = [
  { value: 1000, suffix: '+', label: 'Students Trained' },
  { value: 50, suffix: '+', label: 'Competitions Won' },
];

export default function AboutHeroSection() {
  return (
    <section
      id="about"
      className="relative z-20 w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-12 pl-14 sm:pl-20 md:pl-24 bg-transparent text-slate-100 overflow-hidden select-none"
    >
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* =================================================================
            1. TOP: OVERSIZED BOLD "ABOUT US" HEADING (Wide Word-Spacing, Balanced Gap)
        ================================================================= */}
        <ScrollReveal>
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <h2 className="font-modern font-black text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11.5rem] 2xl:text-[13rem] tracking-tight [word-spacing:0.25em] text-white uppercase leading-[0.85] select-none">
              ABOUT US
            </h2>
          </div>
        </ScrollReveal>

        {/* =================================================================
            2. DIRECTION 1: Left Editorial & Borderless Metrics | Right Giant Bot
        ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center">
          {/* ---------------------------------------------------------------
              LEFT COLUMN (5 Cols): Editorial Prose + Telemetry + CTA
          --------------------------------------------------------------- */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between space-y-6">
            <ScrollReveal delay={100}>
              <div className="space-y-4 font-modern text-sm sm:text-base text-slate-300 leading-relaxed">
                <p>
                  Founded in 2001, <strong className="text-white font-semibold">Robolution (Team Pratyumnis)</strong> is the official robotics and innovation society of <strong className="text-white font-semibold">Birla Institute of Technology, Mesra</strong>. We bring together dedicated mechanical, electronics, and software engineers to develop high-kinetic robotic systems that compete across national arenas.
                </p>
                <p>
                  From autonomous ABU Robocon mechatronics and holonomic drive platforms to heavyweight combat robots and ROS perception stacks, our members learn by architecting, manufacturing, and deploying battle-tested hardware.
                </p>
              </div>

              {/* Inline Borderless Telemetry Metrics (Clean, Zero Heavy Box Slop) */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-5 mt-5 border-t border-white/10 max-w-md">
                {stats.map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="flex items-baseline">
                      <AnimatedCounter
                        target={stat.value}
                        suffix={stat.suffix}
                        className="font-mono text-3xl sm:text-4xl font-black text-white tracking-tight"
                      />
                    </div>
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-wider uppercase text-slate-400 mt-1">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Minimal Clean CTA Link */}
              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-mono text-xs tracking-wider uppercase transition-all shadow-sm group"
                >
                  <span>Explore Full Society Heritage</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* ---------------------------------------------------------------
              RIGHT COLUMN (7 Cols): Giant, Unobstructed Floating Bot Showcase
          --------------------------------------------------------------- */}
          <div className="lg:col-span-7 xl:col-span-7 relative w-full flex items-center justify-center translate-y-1 sm:translate-y-2 lg:translate-y-4">
            <ScrollReveal delay={150} className="w-full flex items-center justify-center">
              <div className="relative w-full max-w-[700px] xl:max-w-[760px] aspect-[4/3] sm:aspect-[16/11] h-[360px] sm:h-[440px] lg:h-[500px] xl:h-[560px] flex items-center justify-center">
                {/* Subtle Ambient Radial Backlight Glow */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-45"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
                    filter: 'blur(34px)',
                  }}
                />

                <Image
                  src="/combat-bot-transparent.png"
                  alt="Robolution Combat Drum Spinner Bot CAD Wireframe"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 55vw"
                  className="object-contain filter contrast-125 brightness-110 drop-shadow-[0_0_40px_rgba(56,189,248,0.25)] transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
