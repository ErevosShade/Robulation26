import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Terminal } from "lucide-react";

interface RosterHeaderProps {
  adminEmail: string;
  adminName?: string | null;
}

export function RosterHeader({ adminEmail, adminName }: RosterHeaderProps) {
  return (
    <header className="border-b border-white/10 pb-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-sky-400 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>RETURN TO INVENTORY TERMINAL</span>
          </Link>
          <span className="text-zinc-600 font-mono text-xs">/</span>
          <span className="text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
            ADMIN // ROSTER PRELOAD
          </span>
        </div>

        {/* Status Clearance Badge */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 font-mono text-[10px] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
            <span>GATEWAY: ADMIN_AUTHORIZED</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-[10px] tracking-widest uppercase">
            <Shield className="w-3 h-3 text-purple-400" />
            <span>OPERATOR: {adminEmail}</span>
          </div>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-1">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span>MECHATRONICS LAB // ACCESS ROSTER MANAGEMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
            <span>Member Roster CSV Import</span>
            <span className="text-xs px-2.5 py-0.5 rounded border border-sky-400/30 bg-sky-400/10 text-sky-300 font-mono font-medium tracking-widest">
              ADD_ONLY
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1 max-w-2xl">
            Preload authorized team members and allocate access roles. Validates emails, prevents intra-file duplicates, and safeguards existing administrator privileges.
          </p>
        </div>

        {/* Hazard ticks aesthetic */}
        <div className="hidden lg:flex items-center gap-1 text-zinc-700 font-mono text-xs select-none">
          <span>///</span>
          <span className="tracking-widest uppercase text-[10px] text-zinc-500">
            SYS_TELEMETRY: ACTIVE
          </span>
          <span>///</span>
        </div>
      </div>
    </header>
  );
}
