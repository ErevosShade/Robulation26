import React from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import { verifyInventoryAccess } from "@/lib/auth";
import { InventoryManagementTerminal } from "./components/InventoryManagementTerminal";
import InventoryUnderConstruction from "./components/InventoryUnderConstruction";

export const dynamic = "force-dynamic";

interface InventoryPageProps {
  searchParams?: Promise<{ mode?: string }>;
}

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const isTerminalRequested = resolvedParams.mode === "terminal";

  let access: Awaited<ReturnType<typeof verifyInventoryAccess>>;
  try {
    access = await verifyInventoryAccess();
  } catch {
    access = {
      authorized: false,
      error: "UNAUTHENTICATED",
      message: "Session verification unavailable",
    };
  }


  return (
    <div className="relative w-full min-h-screen bg-[#020307] text-white font-sans selection:bg-[#5227FF]/40 selection:text-[#FF9FFC] overflow-x-hidden">
      {/* Background cosmic radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#5227FF]/15 via-[#38bdf8]/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <Sidebar theme="dark" />

      <main className="relative z-10 w-full min-h-screen flex flex-col justify-between px-4 pt-18 pb-10 sm:px-8 md:pl-24 md:pt-10 max-w-7xl mx-auto">
        {access.authorized && isTerminalRequested ? (
          <InventoryManagementTerminal user={access.user} />
        ) : (
          <InventoryUnderConstruction isAuthorized={access.authorized} />
        )}

        {/* Footer Telemetry with Logo */}
        <footer className="border-t border-white/10 mt-12 pt-4 flex flex-col sm:flex-row items-center justify-between text-zinc-500 font-mono text-[10px] gap-2">
          <span className="flex items-center gap-2">
            <Image
              src="/robolution-icon-bright.png"
              alt="Robolution Logo"
              width={16}
              height={16}
              className="object-contain filter drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]"
            />
            <span>ROBOLUTION &bull; TEAM PRATYUMNIS &bull; BIT MESRA</span>
          </span>
          <span>
            {access.authorized && isTerminalRequested
              ? "HARDWARE_TELEMETRY: ACTIVE_LEDGER_CONNECTED"
              : "HARDWARE_TELEMETRY: VAULT_UNDER_CONSTRUCTION // BUILD_PHASE_K26"}
          </span>
        </footer>
      </main>
    </div>
  );
}
