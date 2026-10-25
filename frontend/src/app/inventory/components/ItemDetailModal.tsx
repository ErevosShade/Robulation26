"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Package,
  Layers,
  MapPin,
  Calendar,
  User,
  Shield,
  FileText,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import type { InventoryItemDto, InventoryItemPublicDto } from "@/lib/inventory/types";
import type { InventoryLedgerRow } from "@/lib/db/schema/inventory";

interface ItemDetailModalProps {
  item: InventoryItemDto | InventoryItemPublicDto | null;
  isAdmin: boolean;
  onClose: () => void;
  onRequestBorrow?: (item: InventoryItemDto | InventoryItemPublicDto) => void;
}

export function ItemDetailModal({
  item,
  isAdmin,
  onClose,
  onRequestBorrow,
}: ItemDetailModalProps) {
  const [ledgerEntries, setLedgerEntries] = useState<InventoryLedgerRow[]>([]);
  const [loadingLedger, setLoadingLedger] = useState(false);
  const [ledgerError, setLedgerError] = useState<string | null>(null);

  useEffect(() => {
    if (!item) return;

    let isMounted = true;
    async function fetchLedger() {
      setLoadingLedger(true);
      setLedgerError(null);
      try {
        const res = await fetch(`/api/inventory/${item?.id}/ledger`);
        if (!res.ok) throw new Error("Failed to load audit history.");
        const data = await res.json();
        if (isMounted) {
          setLedgerEntries(data.entries || []);
        }
      } catch (err) {
        if (isMounted) {
          setLedgerError(err instanceof Error ? err.message : "Error fetching history");
        }
      } finally {
        if (isMounted) setLoadingLedger(false);
      }
    }

    fetchLedger();
    return () => {
      isMounted = false;
    };
  }, [item]);

  if (!item) return null;

  const adminItem = isAdmin ? (item as InventoryItemDto) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#050a16] border border-sky-500/30 rounded-2xl shadow-[0_0_50px_rgba(56,189,248,0.2)] overflow-hidden font-sans">
        {/* Top Aerospace Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-widest text-sky-400 uppercase">
                HARDWARE_TELEMETRY // ID: {item.id.slice(0, 8)}...
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase border ${
                  item.status === "in_stock"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : item.status === "low_stock"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : item.status === "out_of_stock"
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    : "bg-zinc-500/10 border-zinc-500/30 text-zinc-400"
                }`}
              >
                {item.status.replace("_", " ")}
              </span>
            </div>
            <h2 className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-sky-400" />
              <span>{item.name}</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">SKU IDENTIFIER</span>
              <div className="font-bold text-sky-300 text-sm select-all">{item.sku}</div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">CATEGORY</span>
              <div className="font-bold text-zinc-200 text-sm">{item.category}</div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">MINIMUM THRESHOLD</span>
              <div className="font-bold text-zinc-200 text-sm">{item.minimumStock} units</div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">CONSUMABLE</span>
              <div className="font-bold text-zinc-200 text-sm">{item.consumable ? "YES (NO RETURN)" : "NO (RETURN REQUIRED)"}</div>
            </div>
          </div>

          {/* Stock Balances Telemetry Strip */}
          <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/20 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                ACTIVE LAB STOCK CONSERVATION
              </span>
              <span className="text-[10px] text-zinc-400">
                INVARIANT: AVAILABLE = TOTAL - (RESERVED + CHECKED OUT + DAMAGED)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              <div className="p-2.5 rounded bg-black/40 border border-white/5">
                <span className="text-[10px] text-zinc-500 block uppercase">TOTAL</span>
                <span className="text-lg font-bold text-white">{item.totalQuantity}</span>
              </div>
              <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] text-emerald-400 block uppercase">AVAILABLE</span>
                <span className="text-lg font-bold text-emerald-400">{item.availableQuantity}</span>
              </div>
              <div className="p-2.5 rounded bg-purple-500/10 border border-purple-500/20">
                <span className="text-[10px] text-purple-400 block uppercase">RESERVED</span>
                <span className="text-lg font-bold text-purple-400">{item.reservedQuantity}</span>
              </div>
              <div className="p-2.5 rounded bg-sky-500/10 border border-sky-500/20">
                <span className="text-[10px] text-sky-400 block uppercase">CHECKED OUT</span>
                <span className="text-lg font-bold text-sky-400">{item.checkedOutQuantity}</span>
              </div>
              <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20">
                <span className="text-[10px] text-rose-400 block uppercase">DAMAGED</span>
                <span className="text-lg font-bold text-rose-400">{item.damagedQuantity}</span>
              </div>
            </div>
          </div>

          {/* Location & Cost Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 font-mono text-xs">
              <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>PHYSICAL STORAGE LOCATION</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-zinc-300">
                <div>
                  <span className="text-zinc-500 block text-[10px]">ROOM:</span>
                  <span className="font-bold">{item.locationRoom || "N/A"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">CABINET:</span>
                  <span className="font-bold">{item.locationCabinet || "N/A"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">SHELF:</span>
                  <span className="font-bold">{item.locationShelf || "N/A"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">BIN:</span>
                  <span className="font-bold">{item.locationBin || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 font-mono text-xs">
              <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>SPECIFICATIONS &amp; COST</span>
              </div>
              <div className="space-y-1 pt-1 text-zinc-300">
                {item.unitCost ? (
                  <div>
                    <span className="text-zinc-500 text-[10px]">UNIT COST: </span>
                    <span className="font-bold">{item.currency} {item.unitCost}</span>
                  </div>
                ) : (
                  <div className="text-zinc-500">Unit cost not logged.</div>
                )}
                {item.description ? (
                  <p className="text-zinc-400 text-xs leading-relaxed pt-1">
                    {item.description}
                  </p>
                ) : (
                  <div className="text-zinc-500 italic">No public description provided.</div>
                )}
              </div>
            </div>
          </div>

          {/* Admin Internal Notes (Admin-only) */}
          {adminItem?.internalNotes && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 font-mono text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                <span>CONFIDENTIAL INTERNAL NOTES (ADMIN TIER_4 ONLY)</span>
              </div>
              <p className="text-amber-200/90 leading-relaxed whitespace-pre-wrap">
                {adminItem.internalNotes}
              </p>
            </div>
          )}

          {/* Stock Movement History / Ledger Section */}
          <div className="space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                <Clock className="w-3.5 h-3.5" />
                <span>APPEND-ONLY STOCK MOVEMENT AUDIT TRAIL</span>
              </div>
              <span className="text-[10px] text-zinc-500">
                TOTAL EVENTS: {ledgerEntries.length}
              </span>
            </div>

            {loadingLedger ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-sky-400 text-xs">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>FETCHING AUDIT LEDGER...</span>
              </div>
            ) : ledgerError ? (
              <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {ledgerError}
              </div>
            ) : ledgerEntries.length === 0 ? (
              <div className="py-6 text-center text-zinc-500 text-xs italic">
                No stock movement events recorded for this item yet.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {ledgerEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            entry.transactionType === "initial_stock"
                              ? "bg-sky-500/20 text-sky-300"
                              : entry.transactionType === "checkout"
                              ? "bg-purple-500/20 text-purple-300"
                              : entry.transactionType === "reservation"
                              ? "bg-indigo-500/20 text-indigo-300"
                              : entry.transactionType === "return"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : entry.transactionType === "damage"
                              ? "bg-rose-500/20 text-rose-300"
                              : "bg-zinc-500/20 text-zinc-300"
                          }`}
                        >
                          {entry.transactionType.toUpperCase()}
                        </span>
                        <span className="text-zinc-300 font-bold flex items-center gap-1">
                          {entry.quantityDelta > 0 ? (
                            <>
                              <TrendingUp className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">+{entry.quantityDelta}</span>
                            </>
                          ) : entry.quantityDelta < 0 ? (
                            <>
                              <TrendingDown className="w-3 h-3 text-rose-400" />
                              <span className="text-rose-400">{entry.quantityDelta}</span>
                            </>
                          ) : (
                            <span className="text-zinc-400">0</span>
                          )}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500">
                        {new Date(entry.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span>Reason: {entry.reason}</span>
                      <span className="text-zinc-500">Actor: {entry.performedBy}</span>
                    </div>

                    <div className="text-[10px] text-zinc-500 font-mono">
                      Balances after: Total: {entry.totalQuantityAfter} | Avail: {entry.availableQuantityAfter} | Res: {entry.reservedQuantityAfter} | CheckedOut: {entry.checkedOutQuantityAfter} | Damaged: {entry.damagedQuantityAfter}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between p-6 border-t border-white/10 bg-white/[0.02]">
          <span className="font-mono text-[10px] text-zinc-500 uppercase">
            ROBOLUTION LAB INVENTORY LEDGER
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 font-mono text-xs uppercase transition-colors"
            >
              CLOSE
            </button>

            {onRequestBorrow && item.availableQuantity > 0 && (
              <button
                onClick={() => {
                  onClose();
                  onRequestBorrow(item);
                }}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all flex items-center gap-2"
              >
                <span>REQUEST BORROW</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
