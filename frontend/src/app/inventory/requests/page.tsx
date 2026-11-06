import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, LogOut } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { requireInventoryRole } from "@/lib/auth";
import { BorrowRequestsTerminal } from "./BorrowRequestsTerminal";

export const dynamic = "force-dynamic";

export default async function BorrowRequestsPage() {
  const access = await requireInventoryRole(["admin", "member"]);

  if (!access.authorized) {
    redirect("/login");
  }

  const { user } = access;

  return (
    <div className="relative w-full min-h-screen bg-[#020307] text-white font-sans selection:bg-[#5227FF]/40 selection:text-[#FF9FFC] overflow-x-hidden">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#5227FF]/15 via-[#38bdf8]/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <Sidebar theme="dark" />

      <main className="relative z-10 w-full min-h-screen flex flex-col justify-between px-4 pt-18 pb-10 sm:px-8 md:pl-24 md:pt-10 max-w-7xl mx-auto space-y-8">
        <div>
          {/* Top Navigation / Breadcrumbs */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <Link
                href="/inventory"
                className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>RETURN TO INVENTORY GATEWAY</span>
              </Link>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
                <span>ROLE: {user.role.toUpperCase()}</span>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white tracking-widest uppercase transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>{user.email}</span>
              </Link>
            </div>
          </header>

          {/* Page Title */}
          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-2 font-mono text-xs text-sky-400 uppercase tracking-widest">
              <Package className="w-4 h-4 text-sky-400" />
              <span>LAB HARDWARE LIFECYCLE MANAGEMENT</span>
            </div>
            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">
              Borrow Requests &amp; Return Console
            </h1>
            <p className="text-sm text-zinc-400 font-mono max-w-3xl">
              Track hardware checkout requests, confirm physical component collection, process returns with condition inspection, and audit lab stock allocations.
            </p>
          </div>

          {/* Interactive Terminal Component */}
          <BorrowRequestsTerminal user={user} />
        </div>

        {/* Telemetry Footer */}
        <footer className="border-t border-white/10 mt-16 pt-4 flex flex-col sm:flex-row items-center justify-between text-zinc-500 font-mono text-[10px] gap-2">
          <span>ROBOLUTION // MECHATRONICS ASSET TRACKING</span>
          <span>BORROWING_LIFECYCLE_STAGE: ACTIVE_VERIFIED</span>
        </footer>
      </main>
    </div>
  );
}
