"use client";

import React, { useState } from "react";
import { X, Plus, Package, AlertTriangle, RefreshCw } from "lucide-react";
import { STANDARD_INVENTORY_CATEGORIES } from "@/lib/inventory-import/classifier";

interface CreateItemModalProps {
  onClose: () => void;
  onItemCreated: () => void;
}

export function CreateItemModal({ onClose, onItemCreated }: CreateItemModalProps) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState<string>(STANDARD_INVENTORY_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("0");
  const [minimumStock, setMinimumStock] = useState("0");
  const [description, setDescription] = useState("");
  const [locationRoom, setLocationRoom] = useState("");
  const [locationCabinet, setLocationCabinet] = useState("");
  const [locationShelf, setLocationShelf] = useState("");
  const [locationBin, setLocationBin] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [consumable, setConsumable] = useState(false);
  const [internalNotes, setInternalNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const effectiveCategory = category === "CUSTOM" ? customCategory.trim() : category;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Item name is required.");
      return;
    }
    if (!sku.trim()) {
      setErrorMsg("SKU identifier is required.");
      return;
    }
    if (!effectiveCategory) {
      setErrorMsg("Category is required.");
      return;
    }

    const totalQty = parseInt(totalQuantity, 10);
    const minStock = parseInt(minimumStock, 10);

    if (isNaN(totalQty) || totalQty < 0) {
      setErrorMsg("Total quantity must be a non-negative integer.");
      return;
    }
    if (isNaN(minStock) || minStock < 0) {
      setErrorMsg("Minimum stock must be a non-negative integer.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          sku: sku.trim().toUpperCase(),
          category: effectiveCategory,
          totalQuantity: totalQty,
          minimumStock: minStock,
          description: description.trim() || undefined,
          locationRoom: locationRoom.trim() || undefined,
          locationCabinet: locationCabinet.trim() || undefined,
          locationShelf: locationShelf.trim() || undefined,
          locationBin: locationBin.trim() || undefined,
          unitCost: unitCost.trim() || undefined,
          consumable,
          internalNotes: internalNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create inventory item.");
      }

      onItemCreated();
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error creating item.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#050a16] border border-sky-500/30 rounded-2xl shadow-[0_0_50px_rgba(56,189,248,0.2)] overflow-hidden font-sans">
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="space-y-1">
            <span className="font-mono text-[10px] tracking-widest text-sky-400 uppercase">
              ADMIN PROTOCOL // HARDWARE PROVISIONING
            </span>
            <h2 className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-sky-400" />
              <span>Create New Inventory Item</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
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
                placeholder="e.g. Servo Motor MG90S"
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-sky-500 text-white outline-none"
              />
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-zinc-400 uppercase tracking-wider block">
                SKU IDENTIFIER *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="e.g. MTR-MG90S-001"
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-sky-500 text-white outline-none uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-zinc-400 uppercase tracking-wider block">
                CATEGORY *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1222] border border-white/10 focus:border-sky-500 text-white outline-none"
              >
                {STANDARD_INVENTORY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="CUSTOM">+ Custom Category...</option>
              </select>

              {category === "CUSTOM" && (
                <input
                  type="text"
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category name"
                  className="w-full mt-2 px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-sky-500 text-white outline-none"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5 font-mono text-xs">
                <label className="text-zinc-400 uppercase tracking-wider block">
                  INITIAL QTY *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={totalQuantity}
                  onChange={(e) => setTotalQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-sky-500 text-white outline-none"
                />
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <label className="text-zinc-400 uppercase tracking-wider block">
                  MIN STOCK *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={minimumStock}
                  onChange={(e) => setMinimumStock(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-sky-500 text-white outline-none"
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
                placeholder="Room (e.g. Lab 2)"
                value={locationRoom}
                onChange={(e) => setLocationRoom(e.target.value)}
                className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white outline-none"
              />
              <input
                type="text"
                placeholder="Cabinet (e.g. C-1)"
                value={locationCabinet}
                onChange={(e) => setLocationCabinet(e.target.value)}
                className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white outline-none"
              />
              <input
                type="text"
                placeholder="Shelf (e.g. S-3)"
                value={locationShelf}
                onChange={(e) => setLocationShelf(e.target.value)}
                className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white outline-none"
              />
              <input
                type="text"
                placeholder="Bin (e.g. B-12)"
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
              placeholder="Technical specifications, pinouts, compatibility notes..."
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
              placeholder="Vendor contacts, procurement batch reference, special lab rules..."
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
              <span>PROVISION HARDWARE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
