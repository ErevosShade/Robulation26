"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2,
  Eye,
  LogOut,
  ArrowLeft,
  Clock,
  Sparkles,
  X,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { ItemDetailModal } from "./ItemDetailModal";
import { CreateItemModal } from "./CreateItemModal";
import { EditItemModal } from "./EditItemModal";
import { BorrowRequestModal } from "./BorrowRequestModal";
import type {
  InventoryItemDto,
  InventoryItemPublicDto,
  PaginatedResponse,
} from "@/lib/inventory/types";

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface StatsData {
  totalItems: number;
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  checkedOutUnits: number;
  damagedUnits: number;
  lowStockItems: number;
  outOfStockItems: number;
  pendingRequests: number;
  approvedRequests: number;
  activeCheckouts: number;
}

export function InventoryManagementTerminal({ user }: Props) {
  const isAdmin = user.role === "admin";

  // Data states
  const [items, setItems] = useState<Array<InventoryItemDto | InventoryItemPublicDto>>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);

  // Unique categories gathered from data
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // Modals state
  const [inspectingItem, setInspectingItem] = useState<
    InventoryItemDto | InventoryItemPublicDto | null
  >(null);
  const [editingItem, setEditingItem] = useState<
    InventoryItemDto | InventoryItemPublicDto | null
  >(null);
  const [borrowingItem, setBorrowingItem] = useState<
    InventoryItemDto | InventoryItemPublicDto | null
  >(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await fetch("/api/inventory/stats");
      const data = await res.json();
      if (res.ok && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("[Inventory UI] Failed to fetch stats:", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch Catalog Items
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (search.trim()) params.set("search", search.trim());
      if (category.trim()) params.set("category", category.trim());
      if (status.trim()) params.set("status", status.trim());

      const res = await fetch(`/api/inventory?${params.toString()}`);
      const data: PaginatedResponse<InventoryItemDto | InventoryItemPublicDto> =
        await res.json();

      if (!res.ok) {
        throw new Error((data as any).message || "Failed to load inventory items.");
      }

      setItems(data.items || []);
      setTotalPages(data.pagination.totalPages);
      setTotalItemsCount(data.pagination.totalItems);

      // Extract unique categories
      const cats = Array.from(
        new Set(
          (data.items || [])
            .map((i) => i.category)
            .filter((c): c is string => Boolean(c && c.trim()))
        )
      );
      setAvailableCategories((prev) => Array.from(new Set([...prev, ...cats])));
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error fetching items.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, category, status]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Handle Archive Item (Admin-only)
  async function handleArchiveItem(item: InventoryItemDto | InventoryItemPublicDto) {
    if (!confirm(`Are you sure you want to archive '${item.name}' (${item.sku})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/inventory/${item.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to archive item.");
      }

      setSuccessMsg(`Archived '${item.name}' successfully.`);
      await fetchItems();
      await fetchStats();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to archive item.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Telemetry Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO MISSION CONTROL</span>
          </Link>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>TERMINAL: AUTH_VERIFIED</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] tracking-widest uppercase text-sky-300">
            <span>OPERATOR: {user.name}</span>
            <span className="text-zinc-500">[{user.role.toUpperCase()}]</span>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white font-mono text-[10px] tracking-widest uppercase transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>MANAGE SESSION</span>
          </Link>
        </div>
      </header>

      {/* Main Terminal Title & Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-sky-400">
              ROBOLUTION // MECHATRONICS LAB
            </span>
            <span className="text-zinc-600 font-mono text-xs">•</span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-400">
              STOCK LEDGER V2
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
            <Package className="w-7 h-7 text-sky-400" />
            <span>Hardware Inventory &amp; Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono">
            Authoritative component tracking, append-only stock movement audit, and checkout lifecycle console.
          </p>
        </div>

        {/* Global Navigation Hub */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/inventory/requests"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/30 text-sky-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all"
          >
            <Clock className="w-4 h-4 text-sky-400" />
            <span>BORROWING &amp; RETURNS CONSOLE</span>
          </Link>

          {isAdmin && (
            <>
              <Link
                href="/inventory/admin/import"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              >
                <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                <span>BULK EXCEL/CSV IMPORT</span>
              </Link>

              <button
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>NEW HARDWARE ITEM</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Notifications Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-rose-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Aerospace Dashboard Telemetry Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1 font-mono">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">
            CATALOG ITEMS
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-white">
            {loadingStats ? "..." : stats?.totalItems ?? 0}
          </div>
          <span className="text-[10px] text-zinc-400">Unique Hardware SKUs</span>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1 font-mono">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">
            TOTAL UNITS
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-zinc-200">
            {loadingStats ? "..." : stats?.totalUnits ?? 0}
          </div>
          <span className="text-[10px] text-zinc-400">Total lab holdings</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1 font-mono">
          <span className="text-[10px] text-emerald-400 uppercase tracking-widest block">
            AVAILABLE UNITS
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400">
            {loadingStats ? "..." : stats?.availableUnits ?? 0}
          </div>
          <span className="text-[10px] text-emerald-400/80">Ready for checkout</span>
        </div>

        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1 font-mono">
          <span className="text-[10px] text-purple-400 uppercase tracking-widest block">
            RESERVED UNITS
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-purple-400">
            {loadingStats ? "..." : stats?.reservedUnits ?? 0}
          </div>
          <span className="text-[10px] text-purple-400/80">Approved requests</span>
        </div>

        <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-1 font-mono">
          <span className="text-[10px] text-sky-400 uppercase tracking-widest block">
            CHECKED OUT
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-sky-400">
            {loadingStats ? "..." : stats?.checkedOutUnits ?? 0}
          </div>
          <span className="text-[10px] text-sky-400/80">Active in projects</span>
        </div>

        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1 font-mono">
          <span className="text-[10px] text-rose-400 uppercase tracking-widest block">
            QUARANTINED
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-rose-400">
            {loadingStats ? "..." : stats?.damagedUnits ?? 0}
          </div>
          <span className="text-[10px] text-rose-400/80">Damaged / maintenance</span>
        </div>
      </div>

      {/* Operational Telemetry Sub-Bar (Pending Requests & Low Stock Alerts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
        {/* Pending Requests & Return Telemetry */}
        <div className="p-3.5 rounded-xl bg-[#050a16] border border-sky-500/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-zinc-400 text-[11px] block uppercase">
                PENDING BORROW REQUESTS
              </span>
              <span className="text-white font-bold text-sm">
                {stats?.pendingRequests ?? 0} awaiting admin review
              </span>
            </div>
          </div>
          <Link
            href="/inventory/requests?status=pending"
            className="text-[11px] font-bold text-sky-400 hover:text-sky-300 uppercase tracking-wider flex items-center gap-1"
          >
            <span>REVIEW</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Low Stock Telemetry Alert */}
        <div className="p-3.5 rounded-xl bg-[#050a16] border border-amber-500/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-zinc-400 text-[11px] block uppercase">
                LOW STOCK ALERT
              </span>
              <span className="text-white font-bold text-sm">
                {stats?.lowStockItems ?? 0} items at or below minimum threshold
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setStatus("low_stock");
              setPage(1);
            }}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
          >
            <span>FILTER LOW STOCK</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search, Filter & View Controls */}
      <div className="p-4 rounded-xl bg-[#050a16] border border-white/10 space-y-3 font-mono text-xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by equipment name, SKU, or keyword..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-sky-500 text-white outline-none placeholder:text-zinc-600 text-xs"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-48">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-[#0b1222] border border-white/10 focus:border-sky-500 text-zinc-200 outline-none text-xs"
            >
              <option value="">All Categories</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-44">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-[#0b1222] border border-white/10 focus:border-sky-500 text-zinc-200 outline-none text-xs"
            >
              <option value="">All Statuses</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              {isAdmin && <option value="archived">Archived</option>}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => {
              fetchItems();
              fetchStats();
            }}
            disabled={loading}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Refresh Catalog Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-sky-400" : ""}`} />
          </button>
        </div>

        {/* Active Filters Summary */}
        {(search || category || status) && (
          <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] text-zinc-400">
            <span className="text-zinc-500 uppercase">ACTIVE FILTERS:</span>
            {search && (
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white">
                Query: "{search}"
              </span>
            )}
            {category && (
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white">
                Category: {category}
              </span>
            )}
            {status && (
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white">
                Status: {status}
              </span>
            )}
            <button
              onClick={() => {
                setSearch("");
                setCategory("");
                setStatus("");
                setPage(1);
              }}
              className="text-sky-400 hover:underline uppercase text-[10px] ml-1 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Catalog Items Table */}
      <div className="rounded-xl border border-white/10 bg-[#050a16] overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-sky-400 font-mono text-xs">
            <RefreshCw className="w-7 h-7 animate-spin" />
            <span className="tracking-widest uppercase">FETCHING HARDWARE TELEMETRY...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-500 font-mono text-xs">
            <Package className="w-10 h-10 text-zinc-600 stroke-[1.5]" />
            <span className="font-bold uppercase tracking-wider text-zinc-400">
              NO HARDWARE ITEMS FOUND
            </span>
            <p className="text-zinc-500 text-center max-w-sm">
              No inventory records matched your search filters. Try resetting search criteria or provision new hardware.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-white/10 bg-white/[0.02] text-zinc-500 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">EQUIPMENT NAME</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">CATEGORY</th>
                  <th className="py-3 px-3 text-center">AVAILABLE / TOTAL</th>
                  <th className="py-3 px-3">STATUS</th>
                  <th className="py-3 px-3">LOCATION</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((item) => {
                  const isAvailable = item.availableQuantity > 0;
                  const ratio =
                    item.totalQuantity > 0
                      ? Math.min(100, Math.round((item.availableQuantity / item.totalQuantity) * 100))
                      : 0;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Name & Tags */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <button
                            onClick={() => setInspectingItem(item)}
                            className="font-bold text-white hover:text-sky-300 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{item.name}</span>
                          </button>
                          <div className="text-[10px] text-zinc-500 flex items-center gap-2">
                            <span>ID: {item.id.slice(0, 8)}...</span>
                            {item.consumable && (
                              <span className="text-amber-400/80">[CONSUMABLE]</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-3 text-sky-400 font-bold select-all">
                        {item.sku}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 text-zinc-300">{item.category}</td>

                      {/* Available / Total with Progress Bar */}
                      <td className="py-3 px-3 text-center">
                        <div className="space-y-1">
                          <span className="font-bold text-white">
                            <span
                              className={
                                isAvailable
                                  ? item.status === "low_stock"
                                    ? "text-amber-400"
                                    : "text-emerald-400"
                                  : "text-rose-400"
                              }
                            >
                              {item.availableQuantity}
                            </span>
                            <span className="text-zinc-500"> / {item.totalQuantity}</span>
                          </span>
                          <div className="w-16 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.status === "in_stock"
                                  ? "bg-emerald-400"
                                  : item.status === "low_stock"
                                  ? "bg-amber-400"
                                  : "bg-rose-400"
                              }`}
                              style={{ width: `${ratio}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                            item.status === "in_stock"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : item.status === "low_stock"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                              : item.status === "out_of_stock"
                              ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                              : "bg-zinc-500/10 border-zinc-500/30 text-zinc-400"
                          }`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${
                              item.status === "in_stock"
                                ? "bg-emerald-400"
                                : item.status === "low_stock"
                                ? "bg-amber-400"
                                : item.status === "out_of_stock"
                                ? "bg-rose-400"
                                : "bg-zinc-400"
                            }`}
                          />
                          <span>{item.status.replace("_", " ")}</span>
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-3 text-zinc-400 text-[11px]">
                        {item.locationRoom || item.locationShelf
                          ? `${item.locationRoom || ""}${
                              item.locationShelf ? ` / ${item.locationShelf}` : ""
                            }`
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inspect Detail */}
                          <button
                            onClick={() => setInspectingItem(item)}
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                            title="Inspect Details & Ledger History"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Request Borrow */}
                          {isAvailable && (
                            <button
                              onClick={() => setBorrowingItem(item)}
                              className="px-2 py-1 rounded bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/40 text-sky-200 hover:text-white font-mono text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer"
                              title="Submit Borrow Request for Item"
                            >
                              BORROW
                            </button>
                          )}

                          {/* Admin Edit */}
                          {isAdmin && (
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-1.5 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-white transition-colors cursor-pointer"
                              title="Edit Item Specs & Holdings"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Admin Archive */}
                          {isAdmin && !item.archived && (
                            <button
                              onClick={() => handleArchiveItem(item)}
                              className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-white transition-colors cursor-pointer"
                              title="Archive Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-white/10 bg-white/[0.01] font-mono text-xs">
          <div className="text-zinc-500 text-[11px]">
            SHOWING {(page - 1) * limit + (items.length > 0 ? 1 : 0)} -{" "}
            {Math.min(page * limit, totalItemsCount)} OF {totalItemsCount} HARDWARE ITEMS
          </div>

          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 rounded bg-black/40 border border-white/10 text-zinc-300 text-xs outline-none"
            >
              <option value="15">15 / PAGE</option>
              <option value="30">30 / PAGE</option>
              <option value="50">50 / PAGE</option>
            </select>

            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="p-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 text-zinc-300 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-zinc-400 px-2">
              PAGE {page} OF {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="p-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 text-zinc-300 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      {inspectingItem && (
        <ItemDetailModal
          item={inspectingItem}
          isAdmin={isAdmin}
          onClose={() => setInspectingItem(null)}
          onRequestBorrow={(item) => setBorrowingItem(item)}
        />
      )}

      {/* Admin Create Item Modal */}
      {isCreateOpen && (
        <CreateItemModal
          onClose={() => setIsCreateOpen(false)}
          onItemCreated={() => {
            fetchItems();
            fetchStats();
            setSuccessMsg("Hardware item provisioned successfully.");
          }}
        />
      )}

      {/* Admin Edit Item Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onItemUpdated={() => {
            fetchItems();
            fetchStats();
            setSuccessMsg(`Updated item '${editingItem.sku}' successfully.`);
          }}
        />
      )}

      {/* Borrow Request Modal */}
      {borrowingItem && (
        <BorrowRequestModal
          item={borrowingItem}
          onClose={() => setBorrowingItem(null)}
          onRequestSubmitted={() => {
            fetchItems();
            fetchStats();
            setSuccessMsg(
              `Borrow request submitted for '${borrowingItem.name}'. Telemetry dispatched to lab administrators.`
            );
          }}
        />
      )}
    </div>
  );
}
