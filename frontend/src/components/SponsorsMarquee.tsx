'use client';

import React from 'react';
import ScrollReveal from '@/components/ScrollReveal';

interface Sponsor {
  name: string;
  logo: string;
  width: number;
  height: number;
}

const sponsors: Sponsor[] = [
  {
    name: 'BITOSA Global',
    logo: '/sponsors/bitosa-global-dark.png',
    width: 157,
    height: 80,
  },
  {
    name: 'Texas Instruments',
    logo: '/sponsors/texas-instruments-dark.png',
    width: 248,
    height: 65,
  },
  {
    name: 'SolidWorks',
    logo: '/sponsors/solidworks-dark.png',
    width: 296,
    height: 67,
  },
  {
    name: 'BITOSA Alumni Association',
    logo: '/sponsors/bitosa-seal-dark.png',
    width: 132,
    height: 132,
  },
  {
    name: 'NVIDIA',
    logo: '/sponsors/nvidia-dark.png',
    width: 152,
    height: 120,
  },
  {
    name: 'Gilbert',
    logo: '/sponsors/gilbert-dark.png',
    width: 159,
    height: 107,
  },
  {
    name: 'HRS Quality Sporting Goods',
    logo: '/sponsors/hrs-dark.png',
    width: 215,
    height: 113,
  },
];

export default function SponsorsMarquee() {
  // Triple the 7 items for a seamless, continuous infinite scroll loop
  const marqueeItems = [...sponsors, ...sponsors, ...sponsors];

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
              <span className="font-mono text-xs text-sky-400 font-bold tracking-widest uppercase block mb-1">
                INDUSTRIAL ALLIANCES • SPONSORS
              </span>
              <h2 className="font-modern font-black text-3xl sm:text-5xl tracking-tight text-white uppercase mt-1">
                OUR SPONSORS
              </h2>
            </div>
            <p className="font-modern text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed font-mono">
              Backed by alumni networks, industry leaders, and mechatronics patrons.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Marquee Track Container with Edge Gradient Fade */}
      <ScrollReveal direction="up" delay={120}>
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee-left items-center gap-12 sm:gap-18 py-4 select-none">
            {marqueeItems.map((sponsor, index) => (
              <div
                key={`${sponsor.name}-${index}`}
                className="shrink-0 flex items-center justify-center h-14 sm:h-18 px-4 opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer"
                title={sponsor.name}
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="h-9 sm:h-12 w-auto max-w-[180px] sm:max-w-[220px] object-contain drop-shadow-[0_2px_12px_rgba(56,189,248,0.15)] filter brightness-105 contrast-105"
                />
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
