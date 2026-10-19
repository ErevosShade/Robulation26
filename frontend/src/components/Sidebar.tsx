'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Target,
  Compass,
  Users,
  Trophy,
  Calendar,
  Image as ImageIcon,
  Bell,
  Mail,
  Package
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home // Mission Control', icon: Target },
  { href: '/about', label: 'About // Heritage & Vision', icon: Compass },
  { href: '/team', label: 'Team // Officers & Leads', icon: Users },
  { href: '/events', label: "Events // RoboSaga '26", icon: Trophy },
  { href: '/gallery', label: 'Gallery // Build Archives', icon: ImageIcon },
  { href: '/announcements', label: 'Updates // Transmissions', icon: Bell },
  { href: '/contact', label: 'Contact // Lab Coordinates', icon: Mail },
  { href: '/inventory', label: 'Inventory // Hardware Catalog', icon: Package },
];

interface SidebarProps {
  theme?: 'light' | 'dark';
}

export default function Sidebar({ theme = 'dark' }: SidebarProps) {
  const pathname = usePathname();
  const isLight = theme === 'light';

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
      <div
        className={`relative w-13 sm:w-15 py-6 px-1.5 flex flex-col items-center filter ${
          isLight
            ? 'drop-shadow-[0_12px_28px_rgba(15,23,42,0.12)]'
            : 'drop-shadow-[0_12px_36px_rgba(0,0,0,0.7)]'
        }`}
      >
        {/* Glassmorphic Background with Smooth Rounded Trapezoid Shape */}
        <div
          className={`absolute inset-0 backdrop-blur-xl ${
            isLight ? 'bg-white/85' : 'bg-[#06090e]/60'
          }`}
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
              <stop
                offset="0%"
                stopColor={isLight ? "rgba(15, 23, 42, 0.18)" : "rgba(255, 159, 252, 0.45)"}
              />
              <stop
                offset="50%"
                stopColor={isLight ? "rgba(2, 132, 199, 0.45)" : "rgba(82, 39, 255, 0.3)"}
              />
              <stop
                offset="100%"
                stopColor={isLight ? "rgba(15, 23, 42, 0.18)" : "rgba(255, 255, 255, 0.28)"}
              />
            </linearGradient>
          </defs>
          <path
            d="M 0,0 C 35,1.5 70,3.5 88,6 C 97,7.5 100,9.5 100,12 L 100,88 C 100,90.5 97,92.5 88,94 C 70,96.5 35,98.5 0,100 Z"
            fill="none"
            stroke="url(#smoothTrapeStroke)"
            strokeWidth="1.3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Inner Content Stack */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          {/* Top ROBOLUTION Logo Icon */}
          <Link
            href="/"
            className={`relative group p-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center mb-0.5 ${
              isLight ? 'hover:bg-slate-100' : 'hover:bg-white/10'
            }`}
            aria-label="ROBOLUTION Home"
          >
            <div className="relative w-7.5 h-7.5 sm:w-8 sm:h-8 flex items-center justify-center">
              <Image
                src="/robolution-icon-bright.png"
                alt="ROBOLUTION Logo"
                width={32}
                height={32}
                className="object-contain filter drop-shadow-[0_0_10px_rgba(255,159,252,0.45)] transition-transform duration-200 group-hover:scale-110"
                priority
              />
            </div>

            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[11px] font-mono tracking-wider whitespace-nowrap opacity-0 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-2xl z-50 border border-white/10">
              ROBOLUTION // HOME
            </div>
          </Link>

          {/* Cyber Glass Divider */}
          <div className={`w-5 h-[1px] ${isLight ? 'bg-slate-200' : 'bg-white/20'} mb-0.5`} />

          {/* Navigation Items */}
          <nav className="flex flex-col items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <div key={item.href} className="relative group flex items-center">
                  <Link
                    href={item.href}
                    className={`relative p-2 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer flex items-center justify-center ${
                      isActive
                        ? isLight
                          ? 'text-cyan-700 bg-cyan-50/90 border border-cyan-200/80 shadow-[0_2px_8px_rgba(2,132,199,0.2)]'
                          : 'text-white bg-white/20 shadow-[0_0_15px_rgba(255,159,252,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/25'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                    aria-label={item.label}
                  >
                    <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-115 group-hover:-rotate-6" strokeWidth={1.75} />

                    {/* Active Pip Indicator */}
                    {isActive && (
                      <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-gradient-to-b from-[#FF9FFC] to-[#5227FF] rounded-r-full shadow-[0_0_12px_#ff9ffc]" />
                    )}
                  </Link>

                  {/* Tooltip on Hover */}
                  <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-slate-950/95 text-white text-[11px] font-mono tracking-wider whitespace-nowrap opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none shadow-2xl z-50 border border-white/15 backdrop-blur-md">
                    {item.label}
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
