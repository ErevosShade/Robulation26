"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Compass,
  Hammer,
  Lock,
  Cpu,
  Layers,
  Activity,
  Terminal as TerminalIcon,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface InventoryUnderConstructionProps {
  isAuthorized?: boolean;
}

export default function InventoryUnderConstruction({
  isAuthorized = false,
}: InventoryUnderConstructionProps) {
  const [activeTab, setActiveTab] = useState<"telemetry" | "manifesto">("telemetry");
  const [progress, setProgress] = useState(74);

  // Subtle live calibration oscillation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (Math.random() > 0.5 ? 0.2 : -0.2);
        return Math.min(Math.max(Number(next.toFixed(1)), 73.0), 76.5);
      });
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto py-8 sm:py-12 space-y-8 select-none">
      {/* Top Telemetry Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>RETURN TO MISSION CONTROL</span>
          </Link>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
            <span>STATUS: 404 // VAULT_UNDER_CONSTRUCTION</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 font-mono text-[10px] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span>SECTOR: LAB_VAULT_01</span>
          </div>
        </div>
      </header>

      {/* Main Terminal HUD Frame */}
      <div className="relative rounded-2xl bg-[#03060e]/80 border border-white/10 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Stepped Corner Reticles */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-sky-400" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-sky-400" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-sky-400" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-sky-400" />

        {/* Diagonal Hazard Top Bar */}
        <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 pb-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">/// RESTRICTED_SUBSYSTEM</span>
            <span>[NODE: BIT-MESRA // DEPT. PRODUCTION &amp; IND. ENGG.]</span>
          </div>
          <span className="hidden sm:inline text-sky-400 font-mono text-[10px] tracking-widest uppercase">
            SYS.VER: K26-ALPHA // BUILD 04
          </span>
        </div>

        {/* Central Hero Alert */}
        <div className="pt-8 pb-6 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-b from-sky-500/20 to-sky-950/40 border border-sky-500/30 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
            <Image
              src="/robolution-icon-bright.png"
              alt="Robolution Emblem"
              width={56}
              height={56}
              className="object-contain filter drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]"
              priority
            />
            {/* Pulsing indicator badge */}
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/50 backdrop-blur-md text-amber-300">
              <Hammer className="w-4 h-4 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 font-mono text-xs text-amber-400 uppercase tracking-widest">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>404 PROTOCOL &bull; HARDWARE VAULT INACTIVE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-modern tracking-tight text-white uppercase leading-none">
              INVENTORY UNDER CONSTRUCTION
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 font-mono leading-relaxed max-w-2xl">
              The automated Robolution Mechatronics Component Catalog &amp; Lab Checkout Ledger is undergoing core architectural calibration and RFID database integration.
            </p>
          </div>
        </div>

        {/* Progress & Calibration Bar */}
        <div className="p-4 sm:p-5 rounded-xl bg-black/40 border border-white/5 space-y-2.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-zinc-400 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>HARDWARE LEDGER SYNC &amp; VALIDATION</span>
            </span>
            <span className="text-sky-400 font-bold">{progress}% CALIBRATED</span>
          </div>

          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 via-sky-400 to-amber-400 transition-all duration-700 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-zinc-500 pt-1">
            <span>[STAGE 1: SCHEMA COMPILED]</span>
            <span className="text-sky-400">[STAGE 2: ROSTER PERMISSIONS ACTIVE]</span>
            <span>[STAGE 3: HARDWARE CATALOG DEPLOY]</span>
          </div>
        </div>

        {/* Telemetry Tabs */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <button
              onClick={() => setActiveTab("telemetry")}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "telemetry"
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>LIVE TELEMETRY LOG</span>
            </button>
            <button
              onClick={() => setActiveTab("manifesto")}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "manifesto"
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>SUBSYSTEM SPECIFICATIONS</span>
            </button>
          </div>

          {activeTab === "telemetry" ? (
            <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] space-y-1.5 text-zinc-400">
              <div className="text-zinc-600">// ROBOLUTION LAB INVENTORY SYSTEM DIAGNOSTICS LOG</div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>[00:00:12] OAuth 2.0 PKCE Roster Validation Gateway: ONLINE</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>[00:00:28] Drizzle ORM Multi-Tenant Stock Ledger: MIGRATED</span>
              </div>
              <div className="flex items-center gap-2 text-amber-300">
                <AlertTriangle className="w-3 h-3 shrink-0 animate-pulse" />
                <span>[00:01:04] Lab Physical Component Audit: IN PROGRESS (840/1450 Items Tagged)</span>
              </div>
              <div className="flex items-center gap-2 text-sky-300">
                <Cpu className="w-3 h-3 shrink-0" />
                <span>[00:01:42] RFID Barcode Terminal Bus: CALIBRATING HARDWARE STACK</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <span>[00:02:15] Public Access Lock: ACTIVE (ENROLLED OPERATORS ONLY)</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">ESTIMATED ROLLOUT</span>
                <div className="text-sm font-bold font-mono text-white">ROBOSAGA '26 FEST</div>
                <p className="text-[10px] font-mono text-zinc-400">Full self-service student checkout terminal</p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">TOTAL STOCK VAULT</span>
                <div className="text-sm font-bold font-mono text-sky-400">1,450+ HARDWARE UNITS</div>
                <p className="text-[10px] font-mono text-zinc-400">Microcontrollers, actuators, ESCs &amp; sensors</p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">TELEGRAM DISPATCH</span>
                <div className="text-sm font-bold font-mono text-amber-400">INSTANT NOTIFICATIONS</div>
                <p className="text-[10px] font-mono text-zinc-400">Real-time alerts for approvals &amp; returns</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button Cluster */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO MISSION CONTROL</span>
            </Link>

            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs uppercase tracking-wider transition-colors"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              <span>EXPLORE SOCIETY EVENTS</span>
            </Link>
          </div>

          {/* Authorized Admin / Lab Member Bypass */}
          <div className="w-full sm:w-auto text-right">
            {isAuthorized ? (
              <Link
                href="/inventory?mode=terminal"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs uppercase tracking-wider transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ACCESS GRANTED: OPEN TERMINAL</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-wider transition-all group"
              >
                <Lock className="w-3.5 h-3.5 text-sky-400 group-hover:text-white transition-colors" />
                <span>AUTHORIZED LAB OPERATOR SIGN-IN</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
