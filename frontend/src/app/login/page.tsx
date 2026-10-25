import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cpu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import LoginTerminal from './LoginTerminal';

export const metadata: Metadata = {
  title: 'Terminal Login // Robolution Inventory',
  description: 'Mechatronics lab inventory access and Google OAuth authentication terminal.',
};

export const dynamic = 'force-dynamic';

function LoginFallback() {
  return (
    <div className="w-full max-w-xl mx-auto p-12 text-center font-mono text-xs text-zinc-400">
      <div className="inline-flex items-center gap-2 text-sky-400 animate-pulse">
        <Cpu className="w-4 h-4" />
        <span>INITIALIZING TELEMETRY CONSOLE...</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative w-full min-h-screen bg-[#020307] text-white font-sans selection:bg-[#5227FF]/40 selection:text-[#FF9FFC] overflow-x-hidden">
      {/* Background Precision Grid & Radial Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#5227FF]/15 via-[#38bdf8]/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <Sidebar theme="dark" />

      <main className="relative z-10 w-full min-h-screen flex flex-col justify-between px-4 pt-18 pb-10 sm:px-8 md:pl-24 md:pt-10 max-w-7xl mx-auto">
        {/* Top Header Navigation */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>RETURN TO MISSION CONTROL</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 font-mono text-[10px] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
              <span>NODE: LAB_TERMINAL_01</span>
            </div>
          </div>
        </header>

        {/* Central Card Area */}
        <div className="my-auto py-10 flex flex-col items-center justify-center">
          <Suspense fallback={<LoginFallback />}>
            <LoginTerminal />
          </Suspense>
        </div>

        {/* Telemetry Footer */}
        <footer className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between text-zinc-500 font-mono text-[10px] gap-2">
          <span>ROBOLUTION // TEAM PRATYUMNIS • BIT MESRA</span>
          <span>SYSTEM PROTOCOL: OAUTH_ROSTER_V1</span>
        </footer>
      </main>
    </div>
  );
}
