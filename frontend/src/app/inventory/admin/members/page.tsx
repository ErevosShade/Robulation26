import React from "react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { requireInventoryRole } from "@/lib/auth";
import { RosterHeader } from "./components/RosterHeader";
import { RosterImportTerminal } from "./RosterImportTerminal";

export const dynamic = "force-dynamic";

export default async function AdminRosterImportPage() {
  // Strictly enforce server-side admin role authorization
  const access = await requireInventoryRole(["admin"]);

  if (!access.authorized) {
    if (access.error === "UNAUTHENTICATED") {
      redirect("/login");
    } else {
      // Non-admin authenticated users are redirected to standard inventory
      redirect("/inventory");
    }
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

      <main className="relative z-10 w-full min-h-screen flex flex-col justify-between p-6 sm:p-12 pl-18 sm:pl-24 max-w-7xl mx-auto">
        <div>
          <RosterHeader adminEmail={user.email} adminName={user.name} />
          <RosterImportTerminal adminEmail={user.email} />
        </div>

        {/* Telemetry Footer */}
        <footer className="border-t border-white/10 mt-16 pt-4 flex flex-col sm:flex-row items-center justify-between text-zinc-500 font-mono text-[10px] gap-2">
          <span>ROBOLUTION // MECHATRONICS ACCESS REGISTRY</span>
          <span>SYSTEM_CLEARANCE: ADMIN_LEVEL_4 // ACTIVE</span>
        </footer>
      </main>
    </div>
  );
}
