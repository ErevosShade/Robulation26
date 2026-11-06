'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function AboutHeroSection() {
  return (
    <section
      id="about"
      className="relative z-20 w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 pl-14 sm:pl-20 bg-transparent text-slate-100 overflow-hidden select-none"
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* 2-Column Responsive Layout: Left Clean Editorial + Right Clean Enlarged Bot Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          {/* =================================================================
              LEFT: ABOUT US (Enlarged Title Font & Clean Essential Copy)
          ================================================================= */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center">
            <ScrollReveal>
              <div className="space-y-4">
                <span className="font-mono text-xs sm:text-sm font-bold tracking-[0.25em] text-cyan-400 uppercase block">
                  ROBOLUTION &bull; TEAM PRATYUMNIS
                </span>

                <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase font-modern leading-[1.05]">
                  ABOUT US
                </h2>

                <p className="font-modern text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                  Founded in 2001, <strong className="text-white font-semibold">Robolution</strong> is the official robotics and innovation society of <strong className="text-white font-semibold">Birla Institute of Technology, Mesra</strong>. We bring together mechanical engineering, embedded electronics, and software architecture to build battlefield-ready combat machines and national-podium autonomous systems.
                </p>

                <div className="pt-3">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-mono text-xs tracking-wider uppercase transition-all shadow-sm"
                  >
                    <span>Read Full Heritage</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* =================================================================
              RIGHT: ENLARGED IMAGE (No Borders, No Border Info/Telemetry)
          ================================================================= */}
          <div className="lg:col-span-7 xl:col-span-7 relative flex items-center justify-center">
            <ScrollReveal>
              <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] xl:h-[580px] flex items-center justify-center">
                <Image
                  src="/combat-bot-transparent.png"
                  alt="Robolution Combat Robot Wireframe Blueprint"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 65vw, 60vw"
                  className="object-contain filter contrast-125 brightness-110 drop-shadow-[0_0_24px_rgba(56,189,248,0.2)] transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
