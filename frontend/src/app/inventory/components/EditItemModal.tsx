"use client";

import React, { useState } from "react";
import { X, Edit3, AlertTriangle, RefreshCw, Layers } from "lucide-react";
import type { InventoryItemDto, InventoryItemPublicDto } from "@/lib/inventory/types";

interface EditItemModalProps {
  item: InventoryItemDto | InventoryItemPublicDto;
  onClose: () => void;
  onItemUpdated: () => void;
}

export function EditItemModal({ item, onClose, onItemUpdated }: EditItemModalProps) {
  const adminItem = item as InventoryItemDto;

  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [totalQuantity, setTotalQuantity] = useState(String(item.totalQuantity));
  const [minimumStock, setMinimumStock] = useState(String(item.minimumStock));
  const [description, setDescription] = useState(item.description || "");
  const [locationRoom, setLocationRoom] = useState(item.locationRoom || "");
  const [locationCabinet, setLocationCabinet] = useState(item.locationCabinet || "");
  const [locationShelf, setLocationShelf] = useState(item.locationShelf || "");
  const [locationBin, setLocationBin] = useState(item.locationBin || "");
  const [unitCost, setUnitCost] = useState(item.unitCost || "");
  const [consumable, setConsumable] = useState(item.consumable);
  const [internalNotes, setInternalNotes] = useState(adminItem.internalNotes || "");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const committedUnits = item.reservedQuantity + item.checkedOutQuantity + item.damagedQuantity;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const newTotal = parseInt(totalQuantity, 10);
    const newMin = parseInt(minimumStock, 10);

    if (isNaN(newTotal) || newTotal < 0) {
      setErrorMsg("Total quantity must be a non-negative integer.");
      return;
    }
    if (newTotal < committedUnits) {
      setErrorMsg(
        `Cannot reduce total quantity below currently committed stock (${committedUnits} units reserved/checked out/damaged).`
      );
      return;
    }
    if (isNaN(newMin) || newMin < 0) {
      setErrorMsg("Minimum stock must be a non-negative integer.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/inventory/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category: category.trim(),
          totalQuantity: newTotal,
          minimumStock: newMin,
          description: description.trim() || null,
          locationRoom: locationRoom.trim() || null,
          locationCabinet: locationCabinet.trim() || null,
          locationShelf: locationShelf.trim() || null,
          locationBin: locationBin.trim() || null,
          unitCost: unitCost.trim() || null,
          consumable,
          internalNotes: internalNotes.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update item.");
      }

      onItemUpdated();
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error updating item.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#050a16] border border-sky-500/30 rounded-2xl shadow-[0_0_50px_rgba(56,189,248,0.2)] overflow-hidden font-sans">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="space-y-1">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-sky-400 uppercase">
              ADMIN PROTOCOL // MODIFY HARDWARE SPECIFICATIONS
            </span>
            <h2 className="text-base sm:text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 shrink-0" />
              <span className="truncate">Edit Item: {item.sku}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-zinc-400 uppercase tracking-wider block">
                EQUIPMENT NAME *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-sky-500 text-white outline-none"
              />
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-zinc-400 uppercase tracking-wider block">
                CATEGORY *
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-sky-500 text-white outline-none"
              />
            </div>
          </div>

          {/* Stock Holdings Adjustment */}
          <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/20 space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-sky-300">
                HOLDINGS &amp; STOCK INVARIANTS
              </span>
              <span className="text-[10px] text-zinc-400">
                ACTIVE COMMITMENT: {committedUnits} UNITS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 block uppercase">
                  TOTAL QUANTITY (MIN {committedUnits})
                </label>
                <input
                  type="number"
                  min={committedUnits}
                  required
                  value={totalQuantity}
                  onChange={(e) => setTotalQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-sky-500 text-white outline-none font-bold text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block uppercase">
                  MINIMUM STOCK THRESHOLD
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={minimumStock}
                  onChange={(e) => setMinimumStock(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/40 border border-white/10 focus:border-sky-500 text-white outline-none font-bold text-sm"
                />
              </div>
            </div>
          </div>

          {/* Storage Locations */}
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">
              STORAGE LOCATION CO-ORDINATES
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              <input
                type="text"
                placeholder="Room"
                value={locationRoom}
                onChange={(e) => setLocationRoom(e.target.value)}
                className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white outline-none"
              />
              <input
                type="text"
                placeholder="Cabinet"
                value={locationCabinet}
                onChange={(e) => setLocationCabinet(e.target.value)}
                className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white outline-none"
              />
              <input
                type="text"
                placeholder="Shelf"
                value={locationShelf}
                onChange={(e) => setLocationShelf(e.target.value)}
                className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white outline-none"
              />
              <input
                type="text"
                placeholder="Bin"
                value={locationBin}
                onChange={(e) => setLocationBin(e.target.value)}
                className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-400 uppercase tracking-wider block">
                UNIT COST (INR)
              </label>
              <input
                type="text"
                placeholder="e.g. 250.00"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-sky-500 text-white outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consumable}
                  onChange={(e) => setConsumable(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-black/40 text-sky-500 focus:ring-0"
                />
                <span className="text-zinc-300">CONSUMABLE COMPONENT</span>
              </label>
            </div>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <label className="text-zinc-400 uppercase tracking-wider block">
              DESCRIPTION
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-sky-500 text-white outline-none"
            />
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <label className="text-amber-400/90 uppercase tracking-wider block">
              ADMIN CONFIDENTIAL NOTES (TIER_4)
            </label>
            <textarea
              rows={2}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-amber-500/20 focus:border-amber-500/50 text-white outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 font-mono text-xs uppercase"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-[0_0_20px_rgba(56,189,248,0.3)] flex items-center gap-2 cursor-pointer"
            >
              {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>SAVE CHANGES</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
