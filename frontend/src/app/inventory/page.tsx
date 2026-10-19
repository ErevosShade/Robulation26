import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, Package, CheckCircle2, ArrowLeft, LogOut, Cpu, AlertTriangle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import GlassCard from "@/components/GlassCard";
import { verifyInventoryAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const access = await verifyInventoryAccess();

  if (!access.authorized) {
    redirect("/login");
  }

  const { user, roster } = access;
  const isAdmin = user.role === "admin";

  return (
    <div className="relative w-full min-h-screen bg-[#020307] text-white font-sans selection:bg-[#5227FF]/40 selection:text-[#FF9FFC] overflow-x-hidden">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#5227FF]/15 via-[#38bdf8]/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <Sidebar theme="dark" />

      <main className="relative z-10 w-full min-h-screen flex flex-col justify-between p-6 sm:p-12 pl-18 sm:pl-24 max-w-7xl mx-auto">
        {/* Top Telemetry Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO MISSION CONTROL</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span>TERMINAL: AUTH_VERIFIED</span>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white font-mono text-[10px] tracking-widest uppercase transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>MANAGE SESSION</span>
            </Link>
          </div>
        </header>

        {/* Central Terminal Content */}
        <div className="my-auto py-12 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl">
            <GlassCard
              reticle={true}
              badge={`ROBOLUTION // INVENTORY GATEWAY`}
              className="p-8 sm:p-10 space-y-6"
            >
              {/* Header Badge & Title */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-sky-400">
                    ACCESS_LEVEL // {user.role.toUpperCase()}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-500">ID: {user.id.slice(0, 12)}...</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
                  <Package className="w-7 h-7 text-sky-400" />
                  <span>Lab Hardware Inventory</span>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 font-mono">
                  Operational hardware catalog and component checkout ledger for Robolution mechatronics engineers.
                </p>
              </div>

              {/* Verified Profile Card */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-500 uppercase">OPERATOR:</span>
                  <span className="text-zinc-200 font-bold">{user.name}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-500 uppercase">VERIFIED EMAIL:</span>
                  <span className="text-zinc-200">{user.email}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-500 uppercase">ASSIGNED ROLE:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isAdmin
                      ? "bg-purple-500/20 border border-purple-500/40 text-purple-300"
                      : "bg-sky-500/20 border border-sky-500/40 text-sky-300"
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 uppercase">ROSTER STATUS:</span>
                  <span className="text-emerald-400 inline-flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ACTIVE & AUTHORIZED
                  </span>
                </div>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-start gap-3 text-xs text-sky-200 font-mono">
                <Cpu className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold uppercase tracking-wider text-sky-300">
                    BACKEND TELEMETRY VERIFIED
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    Authentication and server-side roster verification completed successfully. The application tables (`inventory_items`, `inventory_requests`, `inventory_checkouts`) will connect to this portal in the next implementation phase.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Footer Telemetry */}
        <footer className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between text-zinc-500 font-mono text-[10px] gap-2">
          <span>ROBOLUTION // TEAM PRATYUMNIS • BIT MESRA</span>
          <span>ROSTER_AUTHORIZATION: SERVER_VERIFIED</span>
        </footer>
      </main>
    </div>
  );
}
