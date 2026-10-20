"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, Copy, ShieldAlert, Filter } from "lucide-react";
import type { ValidatedRosterRow, RowValidationStatus } from "@/lib/roster-import";

interface PreviewTableProps {
  rows: ValidatedRosterRow[];
}

export function PreviewTable({ rows }: PreviewTableProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | RowValidationStatus>("all");

  const filteredRows = rows.filter((row) => {
    if (activeFilter === "all") return true;
    return row.status === activeFilter;
  });

  const getStatusBadge = (status: RowValidationStatus) => {
    switch (status) {
      case "valid_new":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase">
            <CheckCircle2 className="w-3 h-3" />
            <span>VALID NEW</span>
          </span>
        );
      case "already_exists":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/10 border border-sky-500/30 text-sky-400 uppercase">
            <span>EXISTS IN DB</span>
          </span>
        );
      case "duplicate_in_file":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 uppercase">
            <Copy className="w-3 h-3" />
            <span>FILE DUP</span>
          </span>
        );
      case "invalid":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400 uppercase">
            <AlertTriangle className="w-3 h-3" />
            <span>INVALID</span>
          </span>
        );
    }
  };

  const getRoleBadge = (role: string) => {
    const isSpecial = role === "admin";
    return (
      <span
        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
          isSpecial
            ? "bg-purple-500/20 border border-purple-500/40 text-purple-300"
            : "bg-sky-500/10 border border-sky-500/30 text-sky-300"
        }`}
      >
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Filtering Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-zinc-500 mr-1" />
          <span className="text-zinc-500 text-[10px] uppercase tracking-wider mr-2">FILTER:</span>
          {(
            [
              { id: "all", label: "ALL", count: rows.length },
              {
                id: "valid_new",
                label: "VALID NEW",
                count: rows.filter((r) => r.status === "valid_new").length,
              },
              {
                id: "already_exists",
                label: "EXISTING",
                count: rows.filter((r) => r.status === "already_exists").length,
              },
              {
                id: "duplicate_in_file",
                label: "DUPLICATES",
                count: rows.filter((r) => r.status === "duplicate_in_file").length,
              },
              {
                id: "invalid",
                label: "ERRORS",
                count: rows.filter((r) => r.status === "invalid").length,
              },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer ${
                activeFilter === filter.id
                  ? "bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold"
                  : "bg-white/[0.02] hover:bg-white/[0.05] text-zinc-400 hover:text-white border border-transparent"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        <div className="text-[11px] text-zinc-500">
          SHOWING {filteredRows.length} OF {rows.length} ROWS
        </div>
      </div>

      {/* Rows Table */}
      <div className="rounded-lg border border-white/10 bg-[#050a16] overflow-hidden">
        <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-[#081024] border-b border-white/10 z-10">
              <tr className="text-[10px] uppercase tracking-wider text-zinc-400">
                <th className="py-2.5 px-3 w-16">LINE</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3">NAME</th>
                <th className="py-2.5 px-3">EMAIL ADDRESS</th>
                <th className="py-2.5 px-3 w-28">ROLE</th>
                <th className="py-2.5 px-3 w-24">ACTIVE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    No rows matching active filter.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <React.Fragment key={`row-${row.line}-${row.email}`}>
                    <tr
                      className={`hover:bg-white/[0.02] transition-colors ${
                        row.status === "invalid"
                          ? "bg-rose-500/[0.03]"
                          : row.status === "duplicate_in_file"
                          ? "bg-amber-500/[0.02]"
                          : ""
                      }`}
                    >
                      <td className="py-2.5 px-3 text-zinc-500 font-bold">
                        #{row.line}
                      </td>
                      <td className="py-2.5 px-3">{getStatusBadge(row.status)}</td>
                      <td className="py-2.5 px-3 text-zinc-200">
                        {row.name || <span className="text-zinc-600">—</span>}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-300 font-mono">
                        {row.email}
                      </td>
                      <td className="py-2.5 px-3">{getRoleBadge(row.role)}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[10px] font-bold ${
                            row.active ? "text-emerald-400" : "text-zinc-500"
                          }`}
                        >
                          {row.active ? "TRUE" : "FALSE"}
                        </span>
                      </td>
                    </tr>

                    {/* Validation Errors Callout Row */}
                    {row.errors.length > 0 && (
                      <tr className="bg-rose-950/20 border-b border-rose-900/30">
                        <td colSpan={6} className="py-2 px-4">
                          <div className="flex flex-col gap-1 text-[11px] text-rose-300">
                            {row.errors.map((err, idx) => (
                              <div
                                key={idx}
                                className="inline-flex items-center gap-2 font-mono"
                              >
                                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                <span>
                                  [Line {err.line}]: {err.message}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
