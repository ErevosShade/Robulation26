'use client';

import React from 'react';

export default function BottomDock() {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 select-none pointer-events-auto">
      {/* Hidden SVG definition for smooth clip-path */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="bottomTrapeClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,1 C 0.015,0.65 0.035,0.30 0.06,0.12 C 0.075,0.03 0.095,0 0.12,0 L 0.88,0 C 0.905,0 0.925,0.03 0.94,0.12 C 0.965,0.30 0.985,0.65 1,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Trapezoid Container with Smooth Rounded Corners and Edge Slant */}
      <div className="relative w-[320px] sm:w-[370px] h-[52px] sm:h-[58px] flex items-center justify-center filter drop-shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        {/* Glassmorphic Background with Smooth Rounded Trapezoid Shape */}
        <div
          className="absolute inset-0 bg-[#090a0f]/80 backdrop-blur-2xl"
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
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.12)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.35)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.50)" />
            </linearGradient>
          </defs>
          <path
            d="M 0,100 C 1.5,65 3.5,30 6,12 C 7.5,3 9.5,0 12,0 L 88,0 C 90.5,0 92.5,3 94,12 C 96.5,30 98.5,65 100,100"
            fill="none"
            stroke="url(#bottomTrapeStroke)"
            strokeWidth="1.2"
          />
        </svg>

        {/* Smooth Rectangular Action Buttons */}
        <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-4 px-6 pt-1">
          <button
            type="button"
            className="group relative px-5 sm:px-6 py-2 rounded-lg bg-white text-black font-modern text-[10px] sm:text-[11px] font-bold tracking-widest uppercase transition-all duration-300 hover:bg-slate-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.7)] active:scale-95 cursor-pointer"
          >
            About Us
          </button>
          <button
            type="button"
            className="group relative px-5 sm:px-6 py-2 rounded-lg bg-white/10 border border-white/25 text-white font-modern text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:shadow-[0_0_18px_rgba(255,255,255,0.3)] active:scale-95 cursor-pointer"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
