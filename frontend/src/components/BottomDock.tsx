'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
<<<<<<< Updated upstream
import { X, Layers } from 'lucide-react';
=======
import Image from 'next/image';
>>>>>>> Stashed changes

interface BottomDockProps {
  theme?: 'light' | 'dark';
}

export default function BottomDock({
  theme = 'dark',
}: BottomDockProps) {
  const isLight = theme === 'light';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 120;
      setIsScrolled(scrolled);
      if (!scrolled) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={dockRef}
      className={`fixed left-1/2 -translate-x-1/2 z-50 select-none pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolled ? 'bottom-5 sm:bottom-6' : 'bottom-0'
      }`}
    >
      {/* Hidden SVG definition for trapezoid clip-path */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="bottomTrapeClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,1 C 0.015,0.65 0.035,0.30 0.06,0.12 C 0.075,0.03 0.095,0 0.12,0 L 0.88,0 C 0.905,0 0.925,0.03 0.94,0.12 C 0.965,0.30 0.985,0.65 1,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* =====================================================================
          STATE 1: HERO DOCK (When at top of page, !isScrolled)
      ===================================================================== */}
      {!isScrolled && (
        <div
          className={`relative w-[calc(100vw-1.5rem)] max-w-[460px] sm:max-w-[520px] md:max-w-[560px] h-[52px] sm:h-[62px] flex items-center justify-center filter transition-all duration-500 ${
            isLight
              ? 'drop-shadow-[0_-8px_25px_rgba(15,23,42,0.12)]'
              : 'drop-shadow-[0_-10px_30px_rgba(0,0,0,0.8)]'
          }`}
        >
          {/* Glassmorphic Background with Smooth Rounded Trapezoid Shape */}
          <div
            className={`absolute inset-0 backdrop-blur-2xl ${
              isLight ? 'bg-white/90' : 'bg-[#090a0f]/85'
            }`}
            style={{ clipPath: 'url(#bottomTrapeClip)' }}
          />

          {/* 1px SVG Border Overlay with Smooth Curves & Gradient */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="bottomTrapeStroke" x1="0" y1="1" x2="0" y2="0">
                <stop
                  offset="0%"
                  stopColor={isLight ? 'rgba(15, 23, 42, 0.15)' : 'rgba(255, 255, 255, 0.12)'}
                />
                <stop
                  offset="50%"
                  stopColor={isLight ? 'rgba(82, 39, 255, 0.45)' : 'rgba(56, 189, 248, 0.45)'}
                />
                <stop
                  offset="100%"
                  stopColor={isLight ? 'rgba(255, 159, 252, 0.65)' : 'rgba(56, 189, 248, 0.75)'}
                />
              </linearGradient>
            </defs>
            <path
              d="M 0,100 C 1.5,65 3.5,30 6,12 C 7.5,3 9.5,0 12,0 L 88,0 C 90.5,0 92.5,3 94,12 C 96.5,30 98.5,65 100,100"
              fill="none"
              stroke="url(#bottomTrapeStroke)"
              strokeWidth="1.3"
            />
          </svg>

          {/* Smooth Action Buttons - All on a Single Midline-Centric Row */}
          <div className="relative z-10 flex items-center justify-center flex-nowrap whitespace-nowrap gap-1.5 xs:gap-2.5 sm:gap-3 md:gap-4 px-2 xs:px-4 sm:px-8 pt-0.5 sm:pt-1">
            <Link
              href="/about"
              className="group relative px-2.5 xs:px-3.5 sm:px-6 py-1.5 sm:py-2 rounded-lg bg-white text-black font-modern text-[9px] xs:text-[10px] sm:text-[11px] font-bold tracking-wider sm:tracking-widest uppercase transition-all duration-300 hover:bg-slate-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.7)] active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              About Us
            </Link>

            <Link
              href="/events"
              className="group relative px-2.5 xs:px-3.5 sm:px-6 py-1.5 sm:py-2 rounded-lg bg-white/10 border border-white/25 text-white font-modern text-[9px] xs:text-[10px] sm:text-[11px] font-semibold tracking-wider sm:tracking-widest uppercase backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:shadow-[0_0_18px_rgba(255,255,255,0.3)] active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              RoboSaga &apos;26
            </Link>

            <Link
              href="/contact"
              className="group relative px-2.5 xs:px-3.5 sm:px-6 py-1.5 sm:py-2 rounded-lg bg-white/10 border border-white/25 text-white font-modern text-[9px] xs:text-[10px] sm:text-[11px] font-semibold tracking-wider sm:tracking-widest uppercase backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:shadow-[0_0_18px_rgba(255,255,255,0.3)] active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              Contact
            </Link>
          </div>
        </div>
      )}

      {/* =====================================================================
          STATE 2: MINIMIZED STICKY FLOATING BALL (When isScrolled && !isOpen)
      ===================================================================== */}
      {isScrolled && !isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Navigation Dock"
          className="group relative w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center bg-[#050811]/90 hover:bg-[#070b18] border border-white/20 hover:border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.8),0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_30px_rgba(0,0,0,0.9),0_0_28px_rgba(255,255,255,0.3)] backdrop-blur-xl transition-all duration-300 active:scale-90 cursor-pointer animate-in fade-in zoom-in-75"
        >
          {/* Subtle Ambient Pulse Ring */}
          <span className="absolute -inset-1 rounded-full bg-white/10 blur-sm animate-pulse pointer-events-none" />

          {/* Rotating Glowing Pip Ring */}
          <span className="absolute inset-[2px] rounded-full border border-dashed border-white/20 group-hover:border-white/50 transition-colors pointer-events-none" />

          {/* Center Robolution Logo */}
          <div className="relative z-10 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:scale-110">
            <Image
              src="/robolution-icon-bright.png"
              alt="Robolution Logo"
              width={32}
              height={32}
              className="object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
            />
          </div>

          {/* Tooltip / Micro-Label */}
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/80 border border-white/10 font-mono text-[9px] tracking-widest text-slate-300 uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm">
            MENU
          </span>
        </button>
      )}

      {/* =====================================================================
          STATE 3: EXPANDED FLOATING DOCK (When isScrolled && isOpen)
      ===================================================================== */}
      {isScrolled && isOpen && (
        <div className="relative flex items-center gap-1.5 sm:gap-2 p-1 sm:p-2 rounded-2xl bg-[#070b18]/95 border border-cyan-400/40 shadow-[0_12px_45px_rgba(0,0,0,0.85),0_0_30px_rgba(56,189,248,0.3)] backdrop-blur-2xl transition-all duration-300 animate-in fade-in zoom-in-95 max-w-[calc(100vw-1.5rem)]">
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="px-2.5 xs:px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-white text-black font-modern text-[9px] xs:text-[10px] sm:text-xs font-bold tracking-wider uppercase hover:bg-slate-200 transition-all hover:shadow-[0_0_16px_rgba(255,255,255,0.6)] active:scale-95 cursor-pointer whitespace-nowrap"
          >
            About Us
          </Link>

          <Link
            href="/events"
            onClick={() => setIsOpen(false)}
            className="px-2.5 xs:px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/10 border border-white/20 text-white font-modern text-[9px] xs:text-[10px] sm:text-xs font-semibold tracking-wider uppercase hover:bg-white/20 hover:border-cyan-400/50 hover:shadow-[0_0_16px_rgba(56,189,248,0.3)] transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            RoboSaga &apos;26
          </Link>

          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="px-2.5 xs:px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/10 border border-white/20 text-white font-modern text-[9px] xs:text-[10px] sm:text-xs font-semibold tracking-wider uppercase hover:bg-white/20 hover:border-cyan-400/50 hover:shadow-[0_0_16px_rgba(56,189,248,0.3)] transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            Contact
          </Link>

          {/* Close / Minimize Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close Navigation Dock"
            className="p-1 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-0.5 sm:ml-1"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
