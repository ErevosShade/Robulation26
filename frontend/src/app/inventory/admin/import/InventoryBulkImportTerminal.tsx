"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Download,
  Shield,
  Layers,
  Sparkles,
  Info,
  Check,
  X,
  Search,
  ChevronDown,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { STANDARD_INVENTORY_CATEGORIES } from "@/lib/inventory-import/classifier";
import type {
  ImportPreviewResponse,
  ValidatedImportRow,
  ImportCommitResponse,
} from "@/lib/inventory-import";

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export function InventoryBulkImportTerminal({ user }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreviewResponse | null>(null);
  const [editableRows, setEditableRows] = useState<ValidatedImportRow[]>([]);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isExportingErrors, setIsExportingErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [importResult, setImportResult] = useState<ImportCommitResponse | null>(null);

  // Table filters inside preview
  const [previewFilter, setPreviewFilter] = useState<"all" | "valid" | "flagged" | "exists">("all");
  const [previewSearch, setPreviewSearch] = useState("");

  // Handle File Selection
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  }

  // Handle Drag & Drop
  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processFile(file);
  }

  async function processFile(file: File) {
    setSelectedFile(file);
    setErrorMessage(null);
    setImportResult(null);
    setIsPreviewing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/inventory/admin/import/preview", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to generate preview.");
      }

      setPreview(data);
      setEditableRows(data.rows || []);
    } catch (err: unknown) {
      console.error("[Bulk Import Client] Preview error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Error analyzing spreadsheet file."
      );
      setPreview(null);
      setEditableRows([]);
    } finally {
      setIsPreviewing(false);
    }
  }

  function handleClear() {
    setSelectedFile(null);
    setPreview(null);
    setEditableRows([]);
    setErrorMessage(null);
    setImportResult(null);
    setIsConfirmModalOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // Update Category in row
  function handleCategoryChange(line: number, newCategory: string) {
    setEditableRows((prev) =>
      prev.map((r) => {
        if (r.line !== line) return r;
        const finalCategory = newCategory.trim();
        const hasCat = finalCategory.length > 0;
        const errors = r.errors.filter((e) => e.field !== "category");
        if (!hasCat) {
          errors.push({
            line: r.line,
            field: "category",
            message: "Category is required by database.",
            severity: "error",
          });
        }
        const status =
          r.status === "already_exists"
            ? "already_exists"
            : errors.length > 0
            ? "needs_review"
            : "valid_new";

        return {
          ...r,
          finalCategory,
          status,
          errors,
        };
      })
    );
  }

  // Bulk Approve all suggested categories
  function handleApproveAllSuggestions() {
    setEditableRows((prev) =>
      prev.map((r) => {
        if (!r.finalCategory && r.suggestedCategory) {
          const errors = r.errors.filter((e) => e.field !== "category");
          const status =
            r.status === "already_exists"
              ? "already_exists"
              : errors.length > 0
              ? "needs_review"
              : "valid_new";

          return {
            ...r,
            finalCategory: r.suggestedCategory,
            categoryConfidence: "suggested",
            status,
            errors,
          };
        }
        return r;
      })
    );
  }

  // Export Errors / Flagged CSV
  async function handleExportErrors() {
    if (!editableRows.length) return;
    setIsExportingErrors(true);
    try {
      const res = await fetch("/api/inventory/admin/import/export-errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: editableRows }),
      });

      if (!res.ok) throw new Error("Failed to export error report.");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inventory_import_report_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to download error report."
      );
    } finally {
      setIsExportingErrors(false);
    }
  }

  // Handle Confirmed Commit
  async function handleExecuteCommit() {
    const validRowsToCommit = editableRows
      .filter((r) => r.status === "valid_new")
      .map((r) => ({
        line: r.line,
        name: r.name,
        sku: r.finalSku,
        category: r.finalCategory,
        totalQuantity: r.parsedQuantity,
        unit: r.parsedUnit,
        notes: r.notes || undefined,
        internalNotes: r.internalNotes || undefined,
      }));

    if (validRowsToCommit.length === 0) {
      setErrorMessage("No valid rows available to import.");
      setIsConfirmModalOpen(false);
      return;
    }

    setIsImporting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/inventory/admin/import/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: validRowsToCommit,
          filename: selectedFile?.name || "inventory_import.xlsx",
        }),
      });

      const data = await res.json();
      if (!res.ok && !data.success) {
        throw new Error(data.message || "Import execution failed.");
      }

      setImportResult(data);
      setIsConfirmModalOpen(false);

      // Re-trigger preview with fresh database check
      if (selectedFile) {
        processFile(selectedFile);
      }
    } catch (err: unknown) {
      console.error("[Bulk Import Client] Import commit error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Error executing import commit."
      );
    } finally {
      setIsImporting(false);
    }
  }

  // Filtered rows for table view
  const filteredRows = editableRows.filter((r) => {
    if (previewFilter === "valid" && r.status !== "valid_new") return false;
    if (previewFilter === "exists" && r.status !== "already_exists") return false;
    if (
      previewFilter === "flagged" &&
      r.status !== "needs_review" &&
      r.status !== "invalid" &&
      !r.hasNonStandardUnit &&
      !r.isDuplicateCandidate
    )
      return false;

    if (previewSearch.trim()) {
      const query = previewSearch.toLowerCase();
      const matchName = r.name.toLowerCase().includes(query);
      const matchSku = r.finalSku.toLowerCase().includes(query);
      const matchCat = (r.finalCategory || r.originalCategory).toLowerCase().includes(query);
      if (!matchName && !matchSku && !matchCat) return false;
    }

    return true;
  });

  const readyToImportCount = editableRows.filter((r) => r.status === "valid_new").length;
  const alreadyInDbCount = editableRows.filter((r) => r.status === "already_exists").length;
  const needsReviewCount = editableRows.filter(
    (r) => r.status === "needs_review" || r.status === "invalid"
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Telemetry Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO INVENTORY CATALOG</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[10px] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_#c084fc]" />
            <span>TERMINAL: ADMIN_TIER_4_IMPORT</span>
          </div>

          <span className="font-mono text-xs text-zinc-400">
            {user.email}
          </span>
        </div>
      </header>

      {/* Main Terminal Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-purple-400">
            ROBOLUTION // MASS INVENTORY INGESTION
          </span>
          <span className="text-zinc-600 font-mono text-xs">•</span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-400">
            TRANSACTIONAL STAGING
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
          <FileSpreadsheet className="w-7 h-7 text-purple-400" />
          <span>Excel &amp; CSV Bulk Inventory Importer</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-mono">
          Upload hardware workbooks (.xlsx, .csv). Validate initial quantities, auto-generate standard SKUs, inspect deterministic category classifications, and commit initial stock to Neon PostgreSQL.
        </p>
      </div>

      {/* Notifications Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Import Result Screen */}
      {importResult && (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm uppercase">
              <CheckCircle2 className="w-5 h-5" />
              <span>INVENTORY BATCH IMPORT COMMITTED SUCCESSFULLY</span>
            </div>
            <span className="text-xs text-zinc-400">BATCH_ID: {importResult.batchId}</span>
          </div>

          <p className="text-xs text-emerald-200/90 leading-relaxed">
            {importResult.message}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="p-3 rounded-lg bg-black/40 border border-emerald-500/20">
              <span className="text-[10px] text-zinc-400 block uppercase">ITEMS INSERTED</span>
              <span className="text-lg font-bold text-emerald-400">
                {importResult.summary.insertedCount}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-emerald-500/20">
              <span className="text-[10px] text-zinc-400 block uppercase">TOTAL UNITS PROVISIONED</span>
              <span className="text-lg font-bold text-white">
                {importResult.summary.totalUnitsProvisioned}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-emerald-500/20">
              <span className="text-[10px] text-zinc-400 block uppercase">SKIPPED (EXISTING)</span>
              <span className="text-lg font-bold text-amber-400">
                {importResult.summary.skippedCount}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-emerald-500/20">
              <span className="text-[10px] text-zinc-400 block uppercase">ERRORS</span>
              <span className="text-lg font-bold text-rose-400">
                {importResult.summary.errorCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/inventory"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <span>VIEW INVENTORY CATALOG</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 text-xs uppercase transition-colors"
            >
              UPLOAD ANOTHER SPREADSHEET
            </button>
          </div>
        </div>
      )}

      {/* File Upload Zone */}
      {!preview && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={handleDrop}
          className="relative border-2 border-dashed border-white/15 hover:border-purple-500/50 rounded-2xl p-10 sm:p-14 text-center transition-all bg-[#050a16] group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all">
              <UploadCloud className="w-10 h-10" />
            </div>

            <div className="space-y-1 font-mono">
              <h3 className="text-base font-bold uppercase tracking-wide text-white">
                DRAG &amp; DROP WORKBOOK OR CLICK TO BROWSE
              </h3>
              <p className="text-xs text-zinc-400">
                Supports Excel (.xlsx, .xls) and CSV (.csv) spreadsheets up to 5 MB.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest pt-2">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>FORMULA INJECTION DEFENSE ACTIVE • ZERO DB WRITES ON PREVIEW</span>
            </div>
          </div>
        </div>
      )}

      {/* Loading Analysis Screen */}
      {isPreviewing && (
        <div className="p-12 rounded-2xl bg-[#050a16] border border-purple-500/30 flex flex-col items-center justify-center gap-4 text-purple-400 font-mono">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <div className="text-xs tracking-wider uppercase font-bold text-center space-y-1">
            <div>ANALYZING SPREADSHEET TELEMETRY...</div>
            <div className="text-zinc-500 text-[10px]">
              DISCOVERING HEADERS • INFERRING CATEGORIES • GENERATING SKUS • CROSS-REFERENCING NEON DB
            </div>
          </div>
        </div>
      )}

      {/* Preview Section */}
      {preview && !isPreviewing && (
        <div className="space-y-6">
          {/* File Information & Action Strip */}
          <div className="p-4 rounded-xl bg-[#050a16] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white block">{selectedFile?.name}</span>
                <span className="text-[10px] text-zinc-500">
                  {selectedFile ? (selectedFile.size / 1024).toFixed(1) : 0} KB • {preview.summary.totalRows} hardware rows detected
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white text-xs uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>CHANGE FILE</span>
              </button>

              <button
                onClick={handleExportErrors}
                disabled={isExportingErrors}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 text-xs uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Download CSV report of rejected and warning rows"
              >
                <Download className="w-3.5 h-3.5" />
                <span>EXPORT REPORT (.CSV)</span>
              </button>

              {needsReviewCount > 0 && (
                <button
                  onClick={handleApproveAllSuggestions}
                  className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs uppercase font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>APPROVE ALL SUGGESTIONS</span>
                </button>
              )}

              <button
                onClick={() => setIsConfirmModalOpen(true)}
                disabled={readyToImportCount === 0 || isImporting}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>COMMIT IMPORT ({readyToImportCount})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Telemetry Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 font-mono">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-0.5">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">
                TOTAL ROWS
              </span>
              <div className="text-xl font-bold text-white">
                {preview.summary.totalRows}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-0.5">
              <span className="text-[9px] text-emerald-400 uppercase tracking-widest block">
                VALID NEW
              </span>
              <div className="text-xl font-bold text-emerald-400">
                {readyToImportCount}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-0.5">
              <span className="text-[9px] text-amber-400 uppercase tracking-widest block">
                ALREADY IN DB
              </span>
              <div className="text-xl font-bold text-amber-400">
                {alreadyInDbCount}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-0.5">
              <span className="text-[9px] text-purple-400 uppercase tracking-widest block">
                NEEDS REVIEW
              </span>
              <div className="text-xl font-bold text-purple-400">
                {needsReviewCount}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-0.5">
              <span className="text-[9px] text-sky-400 uppercase tracking-widest block">
                NON-STD UNITS
              </span>
              <div className="text-xl font-bold text-sky-400">
                {preview.summary.nonStandardUnitCount}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-0.5">
              <span className="text-[9px] text-indigo-400 uppercase tracking-widest block">
                DUPLICATE NAMES
              </span>
              <div className="text-xl font-bold text-indigo-400">
                {preview.summary.duplicateCandidateCount}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-0.5">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">
                UNITS TO ADD
              </span>
              <div className="text-xl font-bold text-white">
                {preview.summary.totalInitialUnitsToProvision}
              </div>
            </div>
          </div>

          {/* Table Search & Tab Filters */}
          <div className="p-3 rounded-xl bg-[#050a16] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setPreviewFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs uppercase font-bold transition-colors cursor-pointer ${
                  previewFilter === "all"
                    ? "bg-white/15 text-white border border-white/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                ALL ROWS ({editableRows.length})
              </button>
              <button
                onClick={() => setPreviewFilter("valid")}
                className={`px-3 py-1.5 rounded-lg text-xs uppercase font-bold transition-colors cursor-pointer ${
                  previewFilter === "valid"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                READY TO IMPORT ({readyToImportCount})
              </button>
              <button
                onClick={() => setPreviewFilter("flagged")}
                className={`px-3 py-1.5 rounded-lg text-xs uppercase font-bold transition-colors cursor-pointer ${
                  previewFilter === "flagged"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                FLAGGED / REVIEW ({needsReviewCount + preview.summary.nonStandardUnitCount})
              </button>
              <button
                onClick={() => setPreviewFilter("exists")}
                className={`px-3 py-1.5 rounded-lg text-xs uppercase font-bold transition-colors cursor-pointer ${
                  previewFilter === "exists"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                EXISTING IN DB ({alreadyInDbCount})
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search preview rows..."
                value={previewSearch}
                onChange={(e) => setPreviewSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Interactive Preview Table */}
          <div className="rounded-xl border border-white/10 bg-[#050a16] overflow-hidden">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0f1d] text-zinc-500 text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">LINE</th>
                    <th className="py-2.5 px-4">EQUIPMENT NAME</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3">CATEGORY (ORIGINAL &rarr; FINAL)</th>
                    <th className="py-2.5 px-3 text-center">QUANTITY &amp; UNIT</th>
                    <th className="py-2.5 px-3">STATUS</th>
                    <th className="py-2.5 px-4">TELEMETRY &amp; WARNINGS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRows.map((row) => (
                    <tr
                      key={row.line}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        row.status === "invalid" || row.status === "needs_review"
                          ? "bg-purple-950/10"
                          : row.status === "already_exists"
                          ? "bg-amber-950/10"
                          : ""
                      }`}
                    >
                      {/* Line */}
                      <td className="py-2.5 px-3 text-zinc-500 text-[11px]">
                        {row.line}
                      </td>

                      {/* Equipment Name (Preserved) */}
                      <td className="py-2.5 px-4 font-bold text-white">
                        <div className="space-y-0.5">
                          <span>{row.name}</span>
                          {row.notes && (
                            <div className="text-[10px] text-zinc-500 italic">
                              Notes: {row.notes}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-2.5 px-3">
                        <div className="space-y-0.5">
                          <span className="font-bold text-sky-400 select-all">
                            {row.finalSku}
                          </span>
                          {row.skuGenerated && (
                            <span className="text-[9px] text-zinc-500 block">
                              [AUTO-GENERATED]
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category Selection */}
                      <td className="py-2.5 px-3">
                        <div className="space-y-1">
                          <select
                            value={row.finalCategory}
                            onChange={(e) => handleCategoryChange(row.line, e.target.value)}
                            className={`w-full px-2 py-1 rounded text-xs outline-none border ${
                              !row.finalCategory
                                ? "bg-rose-950/40 border-rose-500 text-rose-300 font-bold"
                                : row.categoryConfidence === "suggested"
                                ? "bg-[#0b1222] border-purple-500/50 text-purple-300"
                                : "bg-[#0b1222] border-white/10 text-zinc-200"
                            }`}
                          >
                            <option value="">-- SELECT CATEGORY --</option>
                            {STANDARD_INVENTORY_CATEGORIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                            {row.originalCategory &&
                              !STANDARD_INVENTORY_CATEGORIES.includes(row.originalCategory as any) && (
                                <option value={row.originalCategory}>
                                  {row.originalCategory} (Original)
                                </option>
                              )}
                          </select>

                          {row.suggestedCategory && row.suggestedCategory !== row.finalCategory && (
                            <div className="text-[9px] text-purple-400 flex items-center gap-1">
                              <span>Suggested: {row.suggestedCategory}</span>
                              <button
                                onClick={() => handleCategoryChange(row.line, row.suggestedCategory)}
                                className="text-white hover:underline uppercase"
                              >
                                [Accept]
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Quantity & Unit */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="space-y-0.5">
                          <span className="font-bold text-white text-sm">
                            {row.parsedQuantity}
                          </span>
                          <span
                            className={`text-[10px] block ${
                              row.hasNonStandardUnit
                                ? "text-amber-400 font-bold"
                                : "text-zinc-500"
                            }`}
                          >
                            {row.parsedUnit}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                            row.status === "valid_new"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : row.status === "already_exists"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                              : row.status === "needs_review"
                              ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                          }`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${
                              row.status === "valid_new"
                                ? "bg-emerald-400"
                                : row.status === "already_exists"
                                ? "bg-amber-400"
                                : row.status === "needs_review"
                                ? "bg-purple-400"
                                : "bg-rose-400"
                            }`}
                          />
                          <span>{row.status.replace("_", " ")}</span>
                        </span>
                      </td>

                      {/* Warnings / Telemetry */}
                      <td className="py-2.5 px-4 text-[11px]">
                        <div className="space-y-1">
                          {row.errors.map((e, idx) => (
                            <div
                              key={idx}
                              className="text-rose-400 flex items-start gap-1"
                            >
                              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                              <span>{e.message}</span>
                            </div>
                          ))}

                          {row.warnings.map((w, idx) => (
                            <div
                              key={idx}
                              className="text-amber-400/90 flex items-start gap-1"
                            >
                              <Info className="w-3 h-3 shrink-0 mt-0.5" />
                              <span>{w.message}</span>
                            </div>
                          ))}

                          {row.errors.length === 0 && row.warnings.length === 0 && (
                            <span className="text-zinc-500 italic">Valid and verified.</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
          <div className="relative w-full max-w-lg bg-[#050a16] border border-purple-500/30 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
              <div className="space-y-1 font-mono">
                <span className="text-[10px] tracking-widest text-purple-400 uppercase">
                  EXECUTE HARDWARE INGESTION PROTOCOL
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span>Confirm Inventory Ingestion</span>
                </h3>
              </div>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 font-mono text-xs">
              <p className="text-zinc-300 leading-relaxed">
                You are about to write <span className="text-emerald-400 font-bold">{readyToImportCount} validated items</span> into the Neon PostgreSQL hardware catalog.
              </p>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 uppercase">ITEMS TO INSERT:</span>
                  <span className="text-emerald-400 font-bold">{readyToImportCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 uppercase">SKIPPED (EXISTING IN DB):</span>
                  <span className="text-amber-400 font-bold">{alreadyInDbCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 uppercase">TOTAL STOCK UNITS PROVISIONED:</span>
                  <span className="text-white font-bold">{preview?.summary.totalInitialUnitsToProvision}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 uppercase">INITIAL AUDIT LEDGER WRITES:</span>
                  <span className="text-sky-400 font-bold">{readyToImportCount} entries</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] leading-relaxed">
                Existing inventory balances will strictly NOT be overwritten. Initial stock will be recorded with transactionType <span className="text-white font-bold">'initial_stock'</span> referencing your admin email ({user.email}).
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 uppercase"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleExecuteCommit}
                  disabled={isImporting}
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2 cursor-pointer"
                >
                  {isImporting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>COMMIT TO NEON DB</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
