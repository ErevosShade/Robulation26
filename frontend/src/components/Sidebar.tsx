'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Target,
  Terminal,
  Calendar,
  Cpu,
  Rocket,
  Users,
  Aperture,
  Share2
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Target },
  { id: 'about', label: 'About', icon: Terminal },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'systems', label: 'Systems', icon: Cpu },
  { id: 'updates', label: 'Updates', icon: Rocket },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'gallery', label: 'Gallery', icon: Aperture },
  { id: 'contact', label: 'Contact', icon: Share2 },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('home');

  return (
    <aside className="fixed left-0 top-1/2 -translate-y-1/2 z-40 select-none pointer-events-auto">
      {/* Hidden SVG for smooth clip-path */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="smoothTrapeClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 C 0.35,0.015 0.70,0.035 0.88,0.06 C 0.97,0.075 1,0.095 1,0.12 L 1,0.88 C 1,0.905 0.97,0.925 0.88,0.94 C 0.70,0.965 0.35,0.985 0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Trapezoid Container with Smooth Rounded Corners and Edge Slant */}
      <div className="relative w-13 sm:w-15 py-6 px-1.5 flex flex-col items-center filter drop-shadow-[0_12px_36px_rgba(0,0,0,0.7)]">
        {/* Glassmorphic Background with Smooth Rounded Trapezoid Shape */}
        <div
          className="absolute inset-0 bg-[#06090e]/35 backdrop-blur-md"
          style={{ clipPath: 'url(#smoothTrapeClip)' }}
        />

        {/* 1px SVG Border Overlay with Smooth Curves & Gradient */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="smoothTrapeStroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.35)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.12)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.28)" />
            </linearGradient>
          </defs>
          <path
            d="M 0,0 C 35,1.5 70,3.5 88,6 C 97,7.5 100,9.5 100,12 L 100,88 C 100,90.5 97,92.5 88,94 C 70,96.5 35,98.5 0,100 Z"
            fill="none"
            stroke="url(#smoothTrapeStroke)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Inner Content Stack */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          {/* Top ROBOLUTION Logo Icon */}
          <button
            type="button"
            onClick={() => setActiveItem('home')}
            className="relative group p-1.5 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer flex items-center justify-center mb-0.5"
            aria-label="ROBOLUTION Home"
          >
            <div className="relative w-7.5 h-7.5 sm:w-8 sm:h-8 flex items-center justify-center">
              <Image
                src="/robolution-icon-bright.png"
                alt="ROBOLUTION Logo"
                width={32}
                height={32}
                className="object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.35)] transition-transform duration-200 group-hover:scale-110"
                priority
              />
            </div>

            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-zinc-950/95 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono tracking-wider whitespace-nowrap opacity-0 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-2xl z-50">
              ROBOLUTION
            </div>
          </button>

          {/* Subtle Cyber Glass Divider */}
          <div className="w-5 h-[1px] bg-white/20 mb-0.5" />

          {/* Navigation Items */}
          <nav className="flex flex-col items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <div key={item.id} className="relative group flex items-center">
                  <button
                    type="button"
                    onClick={() => setActiveItem(item.id)}
                    className={`relative p-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
                      isActive
                        ? 'text-white bg-white/15 shadow-[0_0_15px_rgba(255,255,255,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)]'
                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                    aria-label={item.label}
                  >
                    <Icon
                      className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 ${
                        isActive ? 'scale-110 text-white' : 'group-hover:scale-110'
                      }`}
                      strokeWidth={1.5}
                    />

                    {/* Active Indicator Pip */}
                    {isActive && (
                      <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-3 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                    )}
                  </button>

                  {/* Floating Tooltip */}
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-zinc-950/95 backdrop-blur-md border border-white/20 text-white text-xs font-medium tracking-wide whitespace-nowrap opacity-0 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-2xl z-50 flex items-center gap-1.5">
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#ffffff]" />
                    )}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
