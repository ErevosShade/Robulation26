import React from "react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { verifyInventoryAccess } from "@/lib/auth";
import { InventoryBulkImportTerminal } from "./InventoryBulkImportTerminal";

export const dynamic = "force-dynamic";

export default async function InventoryBulkImportPage() {
  const access = await verifyInventoryAccess();

  if (!access.authorized) {
    redirect("/login");
  }

  // Admin authorization guard
  if (access.user.role !== "admin") {
    redirect("/inventory");
  }

  const { user } = access;

  return (
    <div className="relative w-full min-h-screen bg-[#020307] text-white font-sans selection:bg-[#5227FF]/40 selection:text-[#FF9FFC] overflow-x-hidden">
      {/* Background cosmic glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#5227FF]/15 via-[#a855f7]/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <Sidebar theme="dark" />

      <main className="relative z-10 w-full min-h-screen flex flex-col justify-between px-4 pt-18 pb-10 sm:px-8 md:pl-24 md:pt-10 max-w-7xl mx-auto">
        <InventoryBulkImportTerminal user={user} />

        <footer className="border-t border-white/10 mt-12 pt-4 flex flex-col sm:flex-row items-center justify-between text-zinc-500 font-mono text-[10px] gap-2">
          <span>ROBOLUTION // TEAM PRATYUMNIS • BIT MESRA</span>
          <span>ADMIN_CLEARANCE: TIER_4_VERIFIED</span>
        </footer>
      </main>
    </div>
  );
}
