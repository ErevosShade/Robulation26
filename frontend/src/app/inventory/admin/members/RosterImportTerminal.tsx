"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  FileCheck2,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Database,
  RotateCcw,
} from "lucide-react";
import { FileUploadZone } from "./components/FileUploadZone";
import { StatsOverview } from "./components/StatsOverview";
import { PreviewTable } from "./components/PreviewTable";
import { ImportConfirmModal } from "./components/ImportConfirmModal";
import type {
  RosterPreviewResponse,
  RosterImportResponse,
} from "@/lib/roster-import";

interface RosterImportTerminalProps {
  adminEmail: string;
}

export function RosterImportTerminal({ adminEmail }: RosterImportTerminalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvContent, setCsvContent] = useState<string>("");
  const [preview, setPreview] = useState<RosterPreviewResponse | null>(null);
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<RosterImportResponse | null>(null);

  const handleFileSelected = async (file: File) => {
    setSelectedFile(file);
    setErrorMessage(null);
    setImportResult(null);
    setIsPreviewing(true);

    try {
      const text = await file.text();
      setCsvContent(text);

      const response = await fetch("/api/inventory/admin/members/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ csvContent: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Failed to parse and validate CSV.");
        setPreview(null);
      } else {
        setPreview(data);
      }
    } catch (err) {
      console.error("[Roster Client] Preview error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Network error during preview generation."
      );
      setPreview(null);
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setCsvContent("");
    setPreview(null);
    setErrorMessage(null);
    setImportResult(null);
    setIsConfirmModalOpen(false);
  };

  const handleConfirmImport = async () => {
    if (!csvContent) return;

    setIsImporting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/inventory/admin/members/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ csvContent }),
      });

      const data: RosterImportResponse = await response.json();

      if (!response.ok && !data.success) {
        setErrorMessage(data.message || "Import operation failed.");
      }

      setImportResult(data);

      // Refresh the preview data to reflect the newly inserted database records
      if (data.success && data.summary.insertedCount > 0) {
        const refreshRes = await fetch("/api/inventory/admin/members/preview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ csvContent }),
        });
        if (refreshRes.ok) {
          const freshData = await refreshRes.json();
          setPreview(freshData);
        }
      }
    } catch (err) {
      console.error("[Roster Client] Import execution error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Network failure executing import."
      );
    } finally {
      setIsImporting(false);
    }
  };

  const validNewCount = preview?.summary.validNewCount ?? 0;

  return (
    <div className="space-y-6">
      {/* File Upload Zone */}
      <FileUploadZone
        selectedFile={selectedFile}
        isLoading={isPreviewing || isImporting}
        onFileSelected={handleFileSelected}
        onClear={handleClear}
      />

      {/* Loading Indicator */}
      {isPreviewing && (
        <div className="p-8 rounded-lg bg-[#050a16] border border-sky-500/30 flex flex-col items-center justify-center gap-3 text-sky-400 font-mono">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <div className="text-xs tracking-wider uppercase">
            PARSING CSV TELEMETRY & CROSS-REFERENCING NEON DB...
          </div>
        </div>
      )}

      {/* Error Callout */}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold uppercase tracking-wider">VALIDATION_ALERT</div>
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Preview Section */}
      {preview && !isPreviewing && (
        <div className="space-y-6 animate-fade-in">
          {/* Telemetry Stats */}
          <StatsOverview summary={preview.summary} />

          {/* Table Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#050a16] border border-white/10 font-mono">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                VALIDATED ROSTER MATRIX
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET</span>
              </button>

              <button
                type="button"
                disabled={validNewCount === 0 || isImporting}
                onClick={() => setIsConfirmModalOpen(true)}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  validNewCount > 0
                    ? "bg-sky-500 hover:bg-sky-400 text-black shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                    : "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/5"
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>
                  {validNewCount > 0
                    ? `IMPORT ${validNewCount} NEW MEMBERS`
                    : "NO NEW MEMBERS TO IMPORT"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Parsed Rows Table */}
          <PreviewTable rows={preview.rows} />
        </div>
      )}

      {/* Confirmation & Status Modal */}
      <ImportConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmImport}
        summary={preview?.summary ?? null}
        isImporting={isImporting}
        importResult={importResult}
      />
    </div>
  );
}
