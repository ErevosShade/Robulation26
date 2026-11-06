'use client';

import React, { useState, useEffect } from 'react';
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
  Package,
  Menu,
  X,
  ChevronRight,
  Shield,
  ArrowRight
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  code: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home // Mission Control', shortLabel: 'Mission Control', code: '01', icon: Target },
  { href: '/about', label: 'About // Heritage & Vision', shortLabel: 'Heritage & Vision', code: '02', icon: Compass },
  { href: '/team', label: 'Team // Officers & Leads', shortLabel: 'Command Roster', code: '03', icon: Users },
  { href: '/events', label: "Events // RoboSaga '26", shortLabel: "RoboSaga '26", code: '04', icon: Trophy },
  { href: '/gallery', label: 'Gallery // Build Archives', shortLabel: 'Build Archives', code: '05', icon: ImageIcon },
  { href: '/announcements', label: 'Updates // Transmissions', shortLabel: 'Transmissions', code: '06', icon: Bell },
  { href: '/contact', label: 'Contact // Lab Coordinates', shortLabel: 'Lab Coordinates', code: '07', icon: Mail },
  { href: '/inventory', label: 'Inventory // Hardware Catalog', shortLabel: 'Hardware Catalog', code: '08', icon: Package },
];

interface SidebarProps {
  theme?: 'light' | 'dark';
}

export default function Sidebar({ theme = 'dark' }: SidebarProps) {
  const pathname = usePathname();
  const isLight = theme === 'light';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const activeItem = navItems.find((item) => item.href === pathname) || navItems[0];

  return (
    <>
      {/* =====================================================================
          1. MOBILE AEROSPACE HUD TOP BAR (< md)
      ===================================================================== */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 z-40 bg-[#020408] border-b border-white/10 px-4 flex items-center justify-between select-none">
        {/* Left Brand Identity */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2.5 active:scale-95 transition-transform"
        >
          <div className="relative w-7 h-7 flex items-center justify-center">
            <Image
              src="/robolution-icon-bright.png"
              alt="ROBOLUTION Logo"
              width={28}
              height={28}
              className="object-contain filter drop-shadow-[0_0_8px_rgba(255,159,252,0.5)]"
              priority
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-widest text-white leading-tight font-modern">
              ROBOLUTION
            </span>
            <span className="text-[8.5px] font-mono uppercase tracking-widest text-sky-400 leading-tight">
              BIT MESRA // EST. 2001
            </span>
          </div>
        </Link>

        {/* Right Controls: Telemetry Pip & Mobile HUD Menu Trigger */}
        <div className="flex items-center gap-2">
          <div className="hidden xs:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 font-mono text-[9px] text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
            <span className="uppercase text-zinc-300 font-bold">{activeItem.shortLabel}</span>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-3.5 h-3.5 text-sky-400" />
            <span>MENU</span>
          </button>
        </div>
      </header>

      {/* =====================================================================
          2. STANDALONE MOBILE FULLSCREEN OVERLAY MODAL (< md)
          Separated from header to prevent CSS backdrop-filter containing block bugs
      ===================================================================== */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-[100] flex flex-col bg-[#020408] text-white select-none overflow-hidden"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100dvh' }}
        >
          {/* Overlay Top Bar */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-white/10 bg-[#020408] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <Image
                  src="/robolution-icon-bright.png"
                  alt="ROBOLUTION Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-black tracking-widest text-white leading-tight font-modern">
                  ROBOLUTION
                </span>
                <span className="text-[8.5px] font-mono uppercase tracking-widest text-sky-400 leading-tight">
                  NAVIGATION HUD
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/20 text-rose-300 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-[0_0_12px_rgba(244,63,94,0.3)]"
              aria-label="Close Navigation Menu"
            >
              <X className="w-3.5 h-3.5 text-rose-400" />
              <span>CLOSE</span>
            </button>
          </div>

          {/* Overlay Nav Content (Scrollable internally) */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                <span>SECTOR // MISSION NAVIGATION</span>
                <span className="text-sky-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>

              {/* Navigation Items List */}
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all active:scale-[0.98] ${
                        isActive
                          ? 'bg-gradient-to-r from-sky-500/20 via-purple-500/10 to-transparent border-sky-500/40 text-white shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                          : 'bg-white/[0.03] border-white/10 text-zinc-200 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2.5 rounded-lg ${
                            isActive
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : 'bg-white/5 text-zinc-400 border border-white/10'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left font-mono">
                          <div className="text-sm font-bold uppercase tracking-wider text-white">
                            {item.shortLabel}
                          </div>
                          <div className="text-[10px] text-zinc-400 tracking-wider">
                            // {item.code} {item.label.split(' // ')[0]}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        {isActive ? (
                          <span className="px-2 py-0.5 rounded bg-sky-500/20 border border-sky-500/30 text-sky-300 font-bold">
                            ACTIVE
                          </span>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-zinc-500" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Quick Console Hub */}
            <div className="pt-4 mt-6 border-t border-white/10 space-y-3 font-mono text-xs shrink-0">
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/inventory"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl bg-sky-600/20 border border-sky-500/40 text-sky-300 hover:text-white text-center font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Package className="w-4 h-4" />
                  <span>INVENTORY</span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:text-white text-center font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Shield className="w-4 h-4" />
                  <span>SESSION</span>
                </Link>
              </div>

              <div className="text-center pt-1 text-[9px] text-zinc-500 tracking-widest uppercase">
                ROBOLUTION // TEAM PRATYUMNIS • BIT MESRA EST. 2001
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. DESKTOP BESPOKE SMOOTH TRAPEZOID SIDEBAR (>= md)
      ===================================================================== */}
      <aside className="hidden md:block fixed left-0 top-1/2 -translate-y-1/2 z-40 select-none pointer-events-auto">
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
    </>
  );
}
