'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export interface SectionSliderProps {
  slides: {
    src: string;
    alt: string;
    caption?: string;
    tag?: string;
  }[];
  tagColor?: 'red' | 'cyan';
  intervalMs?: number;
}

export default function SectionSlider({
  slides,
  tagColor = 'red',
  intervalMs = 4000
}: SectionSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [slides, intervalMs]);

  const dotActiveClass =
    tagColor === 'red' ? 'bg-red-500 w-5' : 'bg-cyan-400 w-5';

  return (
    <div className="relative w-full aspect-[16/10] sm:h-52 rounded-xl overflow-hidden mb-5 border border-white/10 bg-black/60 shadow-lg group/slider">
      {/* Slides with cross-fade */}
      {slides.map((slide, idx) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-cover group-hover/slider:scale-105 transition-transform duration-700 ease-out"
            priority={idx === 0}
          />
        </div>
      ))}

      {/* Atmospheric Overlays - clean without text clutter */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 z-20 pointer-events-none" />

      {/* Clean Minimal Slide Dots at Bottom Right */}
      <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
        {slides.map((_, dotIdx) => (
          <button
            key={dotIdx}
            type="button"
            onClick={() => setCurrentIndex(dotIdx)}
            aria-label={`Go to slide ${dotIdx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              dotIdx === currentIndex ? dotActiveClass : 'bg-white/30 w-1.5 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
