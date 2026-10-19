import React from "react";
import { UserPlus, UserCheck, Copy, AlertTriangle } from "lucide-react";
import type { RosterImportPreviewSummary } from "@/lib/roster-import";

interface StatsOverviewProps {
  summary: RosterImportPreviewSummary | null;
}

export function StatsOverview({ summary }: StatsOverviewProps) {
  const validNew = summary?.validNewCount ?? 0;
  const alreadyExists = summary?.alreadyExistsCount ?? 0;
  const duplicateInFile = summary?.duplicateInFileCount ?? 0;
  const invalid = summary?.invalidCount ?? 0;
  const total = summary?.totalRows ?? 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
      {/* 1. Valid New Members */}
      <div className="relative overflow-hidden p-4 rounded-lg bg-[#050a16] border border-emerald-500/30 group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-xl pointer-events-none" />
        <div className="flex items-center justify-between text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-2">
          <span>VALID NEW</span>
          <UserPlus className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
          {validNew}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Ready to insert</span>
        </div>
      </div>

      {/* 2. Already in Database */}
      <div className="relative overflow-hidden p-4 rounded-lg bg-[#050a16] border border-sky-500/30 group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/5 blur-xl pointer-events-none" />
        <div className="flex items-center justify-between text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-2">
          <span>ALREADY IN ROSTER</span>
          <UserCheck className="w-4 h-4 text-sky-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-400">
          {alreadyExists}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span>Preserved safely</span>
        </div>
      </div>

      {/* 3. Intra-file Duplicates */}
      <div className="relative overflow-hidden p-4 rounded-lg bg-[#050a16] border border-amber-500/30 group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 blur-xl pointer-events-none" />
        <div className="flex items-center justify-between text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-2">
          <span>FILE DUPLICATES</span>
          <Copy className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">
          {duplicateInFile}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Duplicate rows in file</span>
        </div>
      </div>

      {/* 4. Invalid Rows */}
      <div className="relative overflow-hidden p-4 rounded-lg bg-[#050a16] border border-rose-500/30 group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 blur-xl pointer-events-none" />
        <div className="flex items-center justify-between text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-2">
          <span>VALIDATION ERRORS</span>
          <AlertTriangle className="w-4 h-4 text-rose-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-400">
          {invalid}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          <span>Requires correction</span>
        </div>
      </div>
    </div>
  );
}
