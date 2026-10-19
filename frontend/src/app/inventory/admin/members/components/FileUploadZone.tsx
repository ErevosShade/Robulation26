"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, Download, X, AlertCircle } from "lucide-react";
import { MAX_CSV_FILE_SIZE_BYTES } from "@/lib/roster-import";

interface FileUploadZoneProps {
  onFileSelected: (file: File) => void;
  onClear: () => void;
  selectedFile: File | null;
  isLoading: boolean;
}

export function FileUploadZone({
  onFileSelected,
  onClear,
  selectedFile,
  isLoading,
}: FileUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setClientError(null);
    if (!file.name.toLowerCase().endsWith(".csv") && file.type !== "text/csv") {
      setClientError("Invalid file type. Only standard RFC-4180 .csv files are supported.");
      return;
    }
    if (file.size > MAX_CSV_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setClientError(
        `File size (${sizeMb} MB) exceeds maximum permitted limit of 2.0 MB.`
      );
      return;
    }
    onFileSelected(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDownloadTemplate = () => {
    window.open("/api/inventory/admin/members/template", "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-sky-400 font-bold">
            CSV DATA INGESTION DOCK
          </span>
        </div>

        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-sky-500/40 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-sky-400" />
          <span>DOWNLOAD CSV TEMPLATE</span>
        </button>
      </div>

      {clientError && (
        <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{clientError}</span>
        </div>
      )}

      {selectedFile ? (
        <div className="p-4 rounded-lg bg-[#050a16] border border-sky-500/40 flex items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-sky-400" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-white truncate">
                {selectedFile.name}
              </div>
              <div className="text-[11px] text-zinc-400">
                {(selectedFile.size / 1024).toFixed(1)} KB • READY FOR PREVIEW
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClear}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg p-8 sm:p-10 text-center cursor-pointer transition-all ${
            isDragOver
              ? "border-sky-400 bg-sky-500/10 scale-[1.005]"
              : "border-white/15 hover:border-sky-500/40 bg-[#050a16]/60 hover:bg-[#050a16]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center">
              <UploadCloud className="w-6 h-6 text-sky-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">
                Drag and drop member roster <span className="font-mono text-sky-400">.csv</span> file
              </p>
              <p className="text-xs text-zinc-400 font-mono">
                or click to browse local filesystem (Max 2MB, up to 1,000 rows)
              </p>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
              EXPECTED HEADERS: name, email, role, active
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
