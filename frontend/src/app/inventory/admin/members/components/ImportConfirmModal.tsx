"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowRight,
  X,
  Loader2,
} from "lucide-react";
import type {
  RosterImportPreviewSummary,
  RosterImportResponse,
} from "@/lib/roster-import";

interface ImportConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  summary: RosterImportPreviewSummary | null;
  isImporting: boolean;
  importResult: RosterImportResponse | null;
}

export function ImportConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  summary,
  isImporting,
  importResult,
}: ImportConfirmModalProps) {
  const [confirmedAcknowledged, setConfirmedAcknowledged] = useState(false);

  if (!isOpen) return null;

  const validNew = summary?.validNewCount ?? 0;
  const alreadyExists = summary?.alreadyExistsCount ?? 0;
  const invalidOrDups =
    (summary?.invalidCount ?? 0) + (summary?.duplicateInFileCount ?? 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in font-mono">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-xl bg-[#030610] border border-sky-500/40 shadow-[0_0_50px_rgba(56,189,248,0.15)]">
        {/* Top Header Reticle */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-[#081024]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              CONFIRM ROSTER INGESTION TRANSACTION
            </span>
          </div>

          {!isImporting && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {importResult ? (
            /* Post-Import Result View */
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg border ${
                  importResult.success
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                } flex items-start gap-3 text-xs`}
              >
                {importResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="font-bold text-sm uppercase tracking-wide">
                    {importResult.success
                      ? "TRANSACTION COMMITTED TO NEON"
                      : "IMPORT ENCOUNTERED ERRORS"}
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    {importResult.message}
                  </p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">INSERTED NEW:</span>
                  <span className="text-emerald-400 font-bold">
                    {importResult.summary.insertedCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">EXISTING PRESERVED:</span>
                  <span className="text-sky-400 font-bold">
                    {importResult.summary.alreadyExistsCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">SKIPPED (DUPS/INVALID):</span>
                  <span className="text-zinc-500 font-bold">
                    {importResult.summary.duplicateInFileCount +
                      importResult.summary.invalidCount}
                  </span>
                </div>
              </div>

              {/* Inserted Emails List */}
              {importResult.insertedEmails.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                    INSERTED IDENTIFIERS:
                  </span>
                  <div className="p-3 rounded bg-black/40 border border-white/5 max-h-36 overflow-y-auto text-[11px] text-zinc-300 space-y-1">
                    {importResult.insertedEmails.map((email) => (
                      <div key={email} className="truncate">
                        + {email}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  DISMISS & RETURN
                </button>
              </div>
            </div>
          ) : (
            /* Pre-Confirmation Prompt */
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-200 space-y-2">
                <div className="font-bold uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-sky-400" />
                  <span>TRANSACTION SAFEGUARDS (ADD-ONLY)</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  This operation executes a strictly additive import. Existing roster
                  members, including all administrator accounts, remain protected and
                  will not be overwritten or modified.
                </p>
              </div>

              {/* Summary Stats Matrix */}
              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">NEW ROWS TO INSERT:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {validNew} record(s)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">EXISTING ROWS (PRESERVED):</span>
                  <span className="text-sky-400 font-bold text-sm">
                    {alreadyExists} record(s)
                  </span>
                </div>
                {invalidOrDups > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">INVALID / DUPLICATES (IGNORED):</span>
                    <span className="text-rose-400 font-bold text-sm">
                      {invalidOrDups} record(s)
                    </span>
                  </div>
                )}
              </div>

              {/* Checkbox Acknowledgment */}
              <label className="flex items-start gap-3 p-3 rounded bg-white/[0.03] border border-white/10 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={confirmedAcknowledged}
                  onChange={(e) => setConfirmedAcknowledged(e.target.checked)}
                  disabled={isImporting || validNew === 0}
                  className="mt-0.5 rounded border-white/20 text-sky-500 focus:ring-sky-500 cursor-pointer"
                />
                <span className="text-[11px] text-zinc-300 leading-snug">
                  I confirm the ingestion of {validNew} new approved member(s) into
                  the Robolution database.
                </span>
              </label>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isImporting}
                  onClick={onClose}
                  className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  CANCEL
                </button>

                <button
                  type="button"
                  disabled={!confirmedAcknowledged || isImporting || validNew === 0}
                  onClick={onConfirm}
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    confirmedAcknowledged && !isImporting && validNew > 0
                      ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      : "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/5"
                  }`}
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>WRITING TO NEON...</span>
                    </>
                  ) : (
                    <>
                      <span>CONFIRM INGESTION</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
