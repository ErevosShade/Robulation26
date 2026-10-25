"use client";

import React, { useState } from "react";
import { X, Send, AlertTriangle, Calendar, Package, RefreshCw } from "lucide-react";
import type { InventoryItemDto, InventoryItemPublicDto } from "@/lib/inventory/types";

interface BorrowRequestModalProps {
  item: InventoryItemDto | InventoryItemPublicDto;
  onClose: () => void;
  onRequestSubmitted: () => void;
}

export function BorrowRequestModal({
  item,
  onClose,
  onRequestSubmitted,
}: BorrowRequestModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

  const [quantity, setQuantity] = useState("1");
  const [project, setProject] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(nextWeek);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setErrorMsg("Requested quantity must be at least 1.");
      return;
    }
    if (qty > item.availableQuantity) {
      setErrorMsg(
        `Requested quantity (${qty}) exceeds currently available stock (${item.availableQuantity}).`
      );
      return;
    }
    if (!project.trim() || project.trim().length < 3) {
      setErrorMsg("Project purpose must be at least 3 characters.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setErrorMsg("Expected return date cannot be earlier than checkout date.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/inventory/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: project.trim(),
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          items: [
            {
              itemId: item.id,
              quantity: qty,
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit borrow request.");
      }

      onRequestSubmitted();
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error submitting request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[#050a16] border border-sky-500/30 rounded-2xl shadow-[0_0_50px_rgba(56,189,248,0.2)] overflow-hidden font-sans">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="space-y-1">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-sky-400 uppercase">
              BORROWING LIFECYCLE // SUBMIT REQUEST
            </span>
            <h2 className="text-base sm:text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 shrink-0" />
              <span>Request Hardware Checkout</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-mono text-xs">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase">TARGET COMPONENT:</span>
            <div className="text-white font-bold text-sm">{item.name}</div>
            <div className="flex items-center justify-between text-zinc-400 pt-1">
              <span>SKU: {item.sku}</span>
              <span className="text-emerald-400 font-bold">
                {item.availableQuantity} units available
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 uppercase tracking-wider block">
              REQUESTED QUANTITY (MAX {item.availableQuantity}) *
            </label>
            <input
              type="number"
              min="1"
              max={item.availableQuantity}
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-sky-500 text-white outline-none font-bold text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 uppercase tracking-wider block">
              PROJECT / MISSION PURPOSE *
            </label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Robocon 2026 Navigation Chassis subsystem prototype..."
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-sky-500 text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-zinc-400 uppercase tracking-wider block">
                CHECKOUT DATE *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1222] border border-white/10 focus:border-sky-500 text-white outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 uppercase tracking-wider block">
                EXPECTED RETURN DATE *
              </label>
              <input
                type="date"
                required
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0b1222] border border-white/10 focus:border-sky-500 text-white outline-none"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300 text-[11px] leading-relaxed">
            Submitting this request alerts lab administrators via Telegram. Pending requests do not deduct available stock; stock is atomically reserved upon admin review.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 font-mono text-xs uppercase"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading || item.availableQuantity <= 0}
              className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-mono text-xs uppercase font-bold tracking-wider shadow-[0_0_20px_rgba(56,189,248,0.3)] flex items-center gap-2 cursor-pointer"
            >
              {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>SUBMIT REQUEST</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
