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
  displayValue?: string;
  label: string;
}

const stats: StatItem[] = [
  { value: 24, suffix: '+', label: 'Years of Legacy' },
  { value: 1000, suffix: '+', label: 'Students Trained' },
  { value: 50, suffix: '+', label: 'Competitions Won' },
  { value: 100, displayValue: '100 / 100', label: 'CAD Design Score' },
];

export default function AboutHeroSection() {
  return (
    <section
      id="about"
      className="relative z-20 w-full py-16 sm:py-24 lg:py-28 px-4 sm:px-8 lg:px-12 pl-14 sm:pl-20 bg-transparent text-slate-100 overflow-hidden select-none"
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* =================================================================
            1. TOP: OVERSIZED BOLD "ABOUT US" HEADING (Editorial Scale)
        ================================================================= */}
        <ScrollReveal>
          <div className="mb-8 sm:mb-12">
            <span className="font-mono text-xs sm:text-sm font-bold tracking-[0.25em] text-cyan-400 uppercase block mb-3">
              // OFFICIAL ROBOTICS SOCIETY &bull; BIT MESRA &bull; EST. 2001
            </span>
            <h2 className="font-modern font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter text-white uppercase leading-[0.95] select-none">
              ABOUT US
            </h2>
          </div>
        </ScrollReveal>

        {/* =================================================================
            2. THREE-PART LOWER LAYOUT: Text | Centered Bot | Stacked Stats
        ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
          {/* ---------------------------------------------------------------
              LEFT COLUMN (4 Cols): Two Compact Descriptive Paragraphs
          --------------------------------------------------------------- */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 order-1">
            <ScrollReveal delay={100}>
              <div className="space-y-4 font-modern text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>
                  Founded in 2001, <strong className="text-white font-semibold">Robolution (Team Pratyumnis)</strong> is the official robotics and innovation society of <strong className="text-white font-semibold">Birla Institute of Technology, Mesra</strong>. We bring together dedicated mechanical, electronics, and software engineers to develop high-kinetic robotic systems that compete across national arenas.
                </p>
                <p>
                  From autonomous ABU Robocon mechatronics and holonomic drive platforms to heavyweight combat robots and ROS perception stacks, our members learn by architecting, manufacturing, and deploying battle-tested hardware.
                </p>
              </div>

              {/* Minimal Editorial Divider Rule */}
              <div className="w-full h-[1px] bg-white/10 mt-6" />

              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 font-mono text-[11px] text-slate-400 hover:text-white uppercase tracking-wider transition-colors group"
                >
                  <span>Explore Full Society Heritage</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* ---------------------------------------------------------------
              CENTER COLUMN (5 Cols): Clean, Isolated Bot Wireframe
          --------------------------------------------------------------- */}
          <div className="lg:col-span-5 relative flex items-center justify-center order-2">
            <ScrollReveal delay={150}>
              <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[460px] xl:h-[500px] flex items-center justify-center">
                <Image
                  src="/combat-bot-wireframe.jpg"
                  alt="Robolution Combat Drum Spinner Bot CAD Wireframe"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 40vw"
                  className="object-contain filter contrast-125 brightness-110 mix-blend-screen drop-shadow-[0_0_28px_rgba(56,189,248,0.25)] transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            </ScrollReveal>
          </div>

          {/* ---------------------------------------------------------------
              RIGHT COLUMN (3 Cols): 4 Vertically Stacked Numerical Blocks
          --------------------------------------------------------------- */}
          <div className="lg:col-span-3 flex flex-col gap-3 sm:gap-4 justify-between order-3">
            {stats.map((stat, i) => (
              <ScrollReveal key={i} delay={100 + i * 60}>
                <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all duration-300 flex flex-col justify-center">
                  {stat.displayValue ? (
                    <span className="font-mono text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {stat.displayValue}
                    </span>
                  ) : (
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      className="font-mono text-3xl sm:text-4xl font-black text-white tracking-tight"
                    />
                  )}
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-wider uppercase text-slate-400 mt-1">
                    {stat.label}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
