"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  X,
  Loader2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import type {
  BorrowRequestDto,
  BorrowRequestReturnDto,
} from "@/lib/inventory/types";

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export function BorrowRequestsTerminal({ user }: Props) {
  const [requests, setRequests] = useState<BorrowRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Collection modal state
  const [collectingReq, setCollectingReq] = useState<BorrowRequestDto | null>(null);
  const [collectionNotes, setCollectionNotes] = useState("");
  const [isCollecting, setIsCollecting] = useState(false);

  // Approve modal state
  const [approvingReq, setApprovingReq] = useState<BorrowRequestDto | null>(null);
  const [approveAdminNotes, setApproveAdminNotes] = useState("");
  const [isApproving, setIsApproving] = useState(false);

  // Reject modal state
  const [rejectingReq, setRejectingReq] = useState<BorrowRequestDto | null>(null);
  const [rejectAdminNotes, setRejectAdminNotes] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // Return modal state
  const [returningReq, setReturningReq] = useState<BorrowRequestDto | null>(null);
  const [returnItemsState, setReturnItemsState] = useState<
    Array<{
      itemId: string;
      name: string;
      sku: string;
      outstanding: number;
      returnQuantity: number;
      condition: "good" | "damaged";
      notes: string;
    }>
  >([]);
  const [returnBatchNotes, setReturnBatchNotes] = useState("");
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  // Return history modal state
  const [inspectingReq, setInspectingReq] = useState<BorrowRequestDto | null>(null);
  const [returnsHistory, setReturnsHistory] = useState<BorrowRequestReturnDto[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const query = activeFilter === "all" ? "" : `?status=${activeFilter}`;
      const res = await fetch(`/api/inventory/requests${query}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load requests.");
      }
      setRequests(data.items || []);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error fetching requests.");
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Handle Admin Approval
  async function handleConfirmApprove() {
    if (!approvingReq) return;
    try {
      setIsApproving(true);
      setErrorMsg(null);
      const res = await fetch(`/api/inventory/requests/${approvingReq.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: approveAdminNotes.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to approve request.");
      }
      setSuccessMsg(`Request ${approvingReq.id} approved. Hardware reserved for collection.`);
      setApprovingReq(null);
      setApproveAdminNotes("");
      await fetchRequests();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Approval failed.");
    } finally {
      setIsApproving(false);
    }
  }

  // Handle Admin Rejection
  async function handleConfirmReject() {
    if (!rejectingReq) return;
    try {
      setIsRejecting(true);
      setErrorMsg(null);
      const res = await fetch(`/api/inventory/requests/${rejectingReq.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: rejectAdminNotes.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to reject request.");
      }
      setSuccessMsg(`Request ${rejectingReq.id} rejected.`);
      setRejectingReq(null);
      setRejectAdminNotes("");
      await fetchRequests();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Rejection failed.");
    } finally {
      setIsRejecting(false);
    }
  }

  // Handle Collection Confirmation
  async function handleConfirmCollection() {
    if (!collectingReq) return;
    try {
      setIsCollecting(true);
      setErrorMsg(null);
      const res = await fetch(`/api/inventory/requests/${collectingReq.id}/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: collectionNotes.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to confirm collection.");
      }
      setSuccessMsg(`Collection confirmed for request ${collectingReq.id}. Hardware checked out.`);
      setCollectingReq(null);
      setCollectionNotes("");
      await fetchRequests();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Collection failed.");
    } finally {
      setIsCollecting(false);
    }
  }

  // Open Return Modal
  function openReturnModal(req: BorrowRequestDto) {
    const activeItems = req.items
      .filter((i) => (i.outstandingQuantity ?? i.quantity) > 0)
      .map((i) => ({
        itemId: i.itemId,
        name: i.name,
        sku: i.sku,
        outstanding: i.outstandingQuantity ?? i.quantity,
        returnQuantity: 0,
        condition: "good" as const,
        notes: "",
      }));

    setReturnItemsState(activeItems);
    setReturnBatchNotes("");
    setReturningReq(req);
  }

  // Handle Return Submission
  async function handleSubmitReturn() {
    if (!returningReq) return;
    const itemsToSubmit = returnItemsState.filter((i) => i.returnQuantity > 0);
    if (itemsToSubmit.length === 0) {
      setErrorMsg("Please specify at least 1 unit to return.");
      return;
    }

    try {
      setIsSubmittingReturn(true);
      setErrorMsg(null);
      const res = await fetch(`/api/inventory/requests/${returningReq.id}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: returnBatchNotes.trim() || undefined,
          items: itemsToSubmit.map((i) => ({
            itemId: i.itemId,
            quantity: i.returnQuantity,
            condition: i.condition,
            notes: i.notes.trim() || undefined,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to process return.");
      }
      setSuccessMsg(`Return logged successfully for request ${returningReq.id}.`);
      setReturningReq(null);
      await fetchRequests();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Return processing failed.");
    } finally {
      setIsSubmittingReturn(false);
    }
  }

  // Handle Inspect Returns
  async function openInspectReturns(req: BorrowRequestDto) {
    setInspectingReq(req);
    setLoadingHistory(true);
    setReturnsHistory([]);
    try {
      const res = await fetch(`/api/inventory/requests/${req.id}/returns`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch returns history.");
      }
      setReturnsHistory(data.returns || []);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to load returns history.");
    } finally {
      setLoadingHistory(false);
    }
  }

  // Telemetry counts
  const countAwaitingCollection = requests.filter((r) => r.status === "approved").length;
  const countActiveCheckedOut = requests.filter(
    (r) => r.status === "collected" || r.status === "partially_returned"
  ).length;
  const countReturned = requests.filter((r) => r.status === "returned").length;
  const countPending = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-8 font-sans">
      {/* Telemetry Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 font-mono space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-zinc-400 flex items-center justify-between">
            <span>AWAITING COLLECTION</span>
            <Clock className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-300">{countAwaitingCollection}</div>
          <div className="text-[10px] text-zinc-500">Approved by flight lead</div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 font-mono space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-zinc-400 flex items-center justify-between">
            <span>ACTIVE CHECKED OUT</span>
            <Package className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-300">{countActiveCheckedOut}</div>
          <div className="text-[10px] text-zinc-500">Physically with members</div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 font-mono space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-zinc-400 flex items-center justify-between">
            <span>COMPLETED RETURNS</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300">{countReturned}</div>
          <div className="text-[10px] text-zinc-500">Fully reconciled</div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 font-mono space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-zinc-400 flex items-center justify-between">
            <span>PENDING REVIEW</span>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300">{countPending}</div>
          <div className="text-[10px] text-zinc-500">Under admin review</div>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between">
          <span>✓ {successMsg}</span>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-center justify-between">
          <span>⚠ {errorMsg}</span>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-red-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {[
            { id: "all", label: "ALL REQUESTS" },
            { id: "approved", label: "READY FOR COLLECTION" },
            { id: "collected", label: "CHECKED OUT" },
            { id: "partially_returned", label: "PARTIAL RETURNS" },
            { id: "returned", label: "COMPLETED" },
            { id: "pending", label: "PENDING" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold"
                  : "bg-white/[0.03] text-zinc-400 hover:text-white border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => fetchRequests()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-zinc-400 hover:text-white transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>REFRESH TELEMETRY</span>
        </button>
      </div>

      {/* Requests Listing */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3 font-mono text-zinc-400 text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
          <span>QUERYING HARDWARE BORROWING TELEMETRY...</span>
        </div>
      ) : requests.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white/[0.01] border border-white/5 space-y-3 font-mono">
          <Package className="w-10 h-10 text-zinc-600 mx-auto" />
          <div className="text-zinc-300 font-bold text-sm">NO BORROWING RECORDS FOUND</div>
          <p className="text-zinc-500 text-xs max-w-md mx-auto">
            No hardware checkout requests match the active telemetry filter. Submit a checkout request from the hardware catalog or update filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const isApproved = req.status === "approved";
            const isCollected = req.status === "collected";
            const isPartialReturn = req.status === "partially_returned";
            const isReturned = req.status === "returned";
            const isPending = req.status === "pending";
            const isRejected = req.status === "rejected";

            const canCollect = isApproved && (user.role === "admin" || req.userId === user.id);
            const canReturn =
              (isCollected || isPartialReturn) &&
              (user.role === "admin" || req.userId === user.id);
            const canReview = isPending && user.role === "admin";

            return (
              <GlassCard
                key={req.id}
                className="p-6 space-y-4 hover:border-white/20 transition-all"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-zinc-500 uppercase">
                        REQ_ID //
                      </span>
                      <code className="font-mono text-xs text-sky-400 font-bold">
                        {req.id}
                      </code>
                      {/* Status Badge */}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          isApproved
                            ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                            : isCollected
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                            : isPartialReturn
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : isReturned
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : isPending
                            ? "bg-zinc-500/20 text-zinc-300 border border-zinc-500/40"
                            : "bg-red-500/20 text-red-300 border border-red-500/40"
                        }`}
                      >
                        {req.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="text-base font-bold text-white flex items-center gap-2">
                      <span>{req.project}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2">
                    {canReview && (
                      <>
                        <button
                          onClick={() => {
                            setApprovingReq(req);
                            setApproveAdminNotes("");
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>APPROVE REQUEST</span>
                        </button>
                        <button
                          onClick={() => {
                            setRejectingReq(req);
                            setRejectAdminNotes("");
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>REJECT</span>
                        </button>
                      </>
                    )}

                    {canCollect && (
                      <button
                        onClick={() => setCollectingReq(req)}
                        className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>CONFIRM COLLECTION</span>
                      </button>
                    )}

                    {canReturn && (
                      <button
                        onClick={() => openReturnModal(req)}
                        className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>RECORD RETURN</span>
                      </button>
                    )}

                    {(isPartialReturn || isReturned) && (
                      <button
                        onClick={() => openInspectReturns(req)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 font-mono text-xs uppercase tracking-wider border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>INSPECT RETURNS</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Metadata details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs text-zinc-400">
                  <div>
                    <span className="text-zinc-600 uppercase">REQUESTER:</span>{" "}
                    <span className="text-zinc-300">{req.userName}</span> (
                    <code>{req.userEmail}</code>)
                  </div>
                  <div>
                    <span className="text-zinc-600 uppercase">TIMELINE:</span>{" "}
                    <span className="text-zinc-300">
                      {String(req.startDate).slice(0, 10)} ➔{" "}
                      {String(req.endDate).slice(0, 10)}
                    </span>
                  </div>
                  <div>
                    {req.collectedBy ? (
                      <>
                        <span className="text-zinc-600 uppercase">COLLECTED BY:</span>{" "}
                        <span className="text-purple-300">{req.collectedBy}</span>
                      </>
                    ) : req.reviewedBy ? (
                      <>
                        <span className="text-zinc-600 uppercase">REVIEWED BY:</span>{" "}
                        <span className="text-sky-300">{req.reviewedBy}</span>
                      </>
                    ) : (
                      <span className="text-zinc-600">AWAITING REVIEW</span>
                    )}
                  </div>
                </div>

                {/* Component Table */}
                <div className="rounded-lg border border-white/5 bg-black/20 overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] text-zinc-500 uppercase tracking-widest bg-white/[0.02]">
                        <th className="py-2 px-3">COMPONENT</th>
                        <th className="py-2 px-3">SKU</th>
                        <th className="py-2 px-3 text-right">REQUESTED</th>
                        <th className="py-2 px-3 text-right text-emerald-400">RETURNED (GOOD)</th>
                        <th className="py-2 px-3 text-right text-amber-400">DAMAGED</th>
                        <th className="py-2 px-3 text-right text-sky-400 font-bold">OUTSTANDING</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {req.items.map((item) => (
                        <tr key={item.id} className="hover:bg-white/[0.01]">
                          <td className="py-2 px-3 text-zinc-200 font-medium">{item.name}</td>
                          <td className="py-2 px-3 text-zinc-400 font-mono text-[11px]">
                            {item.sku}
                          </td>
                          <td className="py-2 px-3 text-right text-zinc-300">{item.quantity}</td>
                          <td className="py-2 px-3 text-right text-emerald-400">
                            {item.returnedGoodQuantity ?? 0}
                          </td>
                          <td className="py-2 px-3 text-right text-amber-400">
                            {item.returnedDamagedQuantity ?? 0}
                          </td>
                          <td className="py-2 px-3 text-right text-sky-300 font-bold">
                            {item.outstandingQuantity ?? item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Review / Admin Notes if present */}
                {req.adminNotes && (
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-xs font-mono text-zinc-400">
                    <span className="text-zinc-500 uppercase">ADMIN REVIEW NOTE:</span>{" "}
                    <i>{req.adminNotes}</i>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* APPROVE REQUEST MODAL */}
      {approvingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#090d16] border border-emerald-500/40 shadow-2xl space-y-4 font-mono my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>APPROVE HARDWARE REQUEST</span>
              </div>
              <button
                onClick={() => setApprovingReq(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-zinc-400">
                REQUEST ID: <code className="text-emerald-300 font-bold">{approvingReq.id}</code>
              </div>
              <div className="text-zinc-400">
                REQUESTER: <span className="text-white">{approvingReq.userName}</span> ({approvingReq.userEmail})
              </div>
              <div className="text-zinc-400">
                PROJECT: <span className="text-white font-bold">{approvingReq.project}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>STOCK RESERVATION COMMITMENT</span>
              </div>
              <div>• Requested quantities will be atomically reserved in the stock ledger.</div>
              <div>• Available stock will be decremented; status set to &quot;approved&quot;.</div>
              <div>• Requester will be authorized to physically collect the hardware.</div>
            </div>

            {/* Hardware Items to reserve */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">HARDWARE TO RESERVE:</div>
              <div className="rounded-lg border border-white/5 bg-black/30 p-2.5 space-y-1 max-h-36 overflow-y-auto text-xs">
                {approvingReq.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between py-1 border-b border-white/5 last:border-b-0">
                    <span className="text-zinc-300">
                      {it.name} <code className="text-zinc-500 text-[10px]">({it.sku})</code>
                    </span>
                    <span className="font-bold text-emerald-300 font-mono">{it.quantity} unit(s)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase">Optional Admin Review Notes:</label>
              <textarea
                value={approveAdminNotes}
                onChange={(e) => setApproveAdminNotes(e.target.value)}
                placeholder="e.g., Approved for flight telemetry rig. Return by scheduled timeline."
                className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                rows={2}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setApprovingReq(null)}
                disabled={isApproving}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-400"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmApprove}
                disabled={isApproving}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                {isApproving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>CONFIRM APPROVAL</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT REQUEST MODAL */}
      {rejectingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#090d16] border border-red-500/40 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="text-sm font-bold text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>REJECT HARDWARE REQUEST</span>
              </div>
              <button
                onClick={() => setRejectingReq(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to reject hardware request{" "}
              <code className="text-red-300 font-bold">{rejectingReq.id}</code> for{" "}
              <span className="text-white font-bold">{rejectingReq.project}</span>?
            </p>

            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px] text-red-300 space-y-1">
              <div>• Status will transition to &quot;rejected&quot;.</div>
              <div>• Zero stock mutations will occur (no stock will be reserved).</div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase">Reason / Admin Rejection Note (Recommended):</label>
              <textarea
                value={rejectAdminNotes}
                onChange={(e) => setRejectAdminNotes(e.target.value)}
                placeholder="e.g., Components currently reserved for avionics flight test."
                className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500"
                rows={2}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingReq(null)}
                disabled={isRejecting}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-400"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={isRejecting}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                {isRejecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>CONFIRM REJECTION</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM COLLECTION MODAL */}
      {collectingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#090d16] border border-sky-500/40 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="text-sm font-bold text-sky-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>CONFIRM HARDWARE COLLECTION</span>
              </div>
              <button
                onClick={() => setCollectingReq(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              You are confirming physical retrieval of all approved hardware items for request{" "}
              <code className="text-sky-300 font-bold">{collectingReq.id}</code>.
            </p>

            <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20 text-[11px] text-sky-300 space-y-1">
              <div className="font-bold">STOCK TRANSITION:</div>
              <div>• Reserved quantities will be converted to Checked-Out quantities.</div>
              <div>• Stock conservation invariant will be maintained in the audit ledger.</div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase">Optional Collection Notes:</label>
              <textarea
                value={collectionNotes}
                onChange={(e) => setCollectionNotes(e.target.value)}
                placeholder="e.g., Retrieved from Storage Bay 3 by Cadet Liam"
                className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-sky-500"
                rows={2}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCollectingReq(null)}
                disabled={isCollecting}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-400"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmCollection}
                disabled={isCollecting}
                className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isCollecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>CONFIRM RETRIEVAL</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD RETURN MODAL */}
      {returningReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl p-6 rounded-2xl bg-[#090d16] border border-purple-500/40 shadow-2xl space-y-5 font-mono my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="text-sm font-bold text-purple-400 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-purple-400" />
                <span>RECORD HARDWARE RETURN</span>
              </div>
              <button
                onClick={() => setReturningReq(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300">
              Specify the returned quantities and verified physical condition for request{" "}
              <code className="text-purple-300 font-bold">{returningReq.id}</code>.
            </p>

            {/* Return Items Configuration */}
            <div className="space-y-3">
              {returnItemsState.map((item, idx) => (
                <div
                  key={item.itemId}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{item.name}</span>{" "}
                      <span className="text-zinc-500">({item.sku})</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Outstanding:{" "}
                      <span className="text-sky-400 font-bold">{item.outstanding} unit(s)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-zinc-400 uppercase block">Units Returning:</label>
                      <input
                        type="number"
                        min={0}
                        max={item.outstanding}
                        value={item.returnQuantity}
                        onChange={(e) => {
                          const val = Math.max(0, Math.min(item.outstanding, parseInt(e.target.value) || 0));
                          setReturnItemsState((prev) =>
                            prev.map((it, i) => (i === idx ? { ...it, returnQuantity: val } : it))
                          );
                        }}
                        className="w-full p-2 rounded bg-black/40 border border-white/10 text-white font-mono text-xs focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-400 uppercase block">Condition:</label>
                      <select
                        value={item.condition}
                        onChange={(e) =>
                          setReturnItemsState((prev) =>
                            prev.map((it, i) =>
                              i === idx
                                ? { ...it, condition: e.target.value as "good" | "damaged" }
                                : it
                            )
                          )
                        }
                        className="w-full p-2 rounded bg-black/40 border border-white/10 text-white font-mono text-xs focus:border-purple-500 focus:outline-none"
                      >
                        <option value="good">Good (Re-enter Available Stock)</option>
                        <option value="damaged">Damaged (Hold in Damaged Quarantine)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-400 uppercase block">Condition Notes:</label>
                      <input
                        type="text"
                        value={item.notes}
                        placeholder={item.condition === "damaged" ? "Describe defect/damage" : "Optional notes"}
                        onChange={(e) =>
                          setReturnItemsState((prev) =>
                            prev.map((it, i) => (i === idx ? { ...it, notes: e.target.value } : it))
                          )
                        }
                        className="w-full p-2 rounded bg-black/40 border border-white/10 text-white font-mono text-xs focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase">Batch Return Notes:</label>
              <textarea
                value={returnBatchNotes}
                onChange={(e) => setReturnBatchNotes(e.target.value)}
                placeholder="e.g., Competition conclusion return batch"
                className="w-full p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500"
                rows={2}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReturningReq(null)}
                disabled={isSubmittingReturn}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-400"
              >
                CANCEL
              </button>
              <button
                onClick={handleSubmitReturn}
                disabled={isSubmittingReturn}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmittingReturn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>COMMIT HARDWARE RETURN</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT RETURNS HISTORY MODAL */}
      {inspectingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl p-6 rounded-2xl bg-[#090d16] border border-white/20 shadow-2xl space-y-4 font-mono max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="text-sm font-bold text-sky-400 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-sky-400" />
                <span>RETURN &amp; CONDITION AUDIT TRAIL</span>
              </div>
              <button
                onClick={() => setInspectingReq(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-zinc-400">
              Audit logs for Request <code className="text-white font-bold">{inspectingReq.id}</code> ({inspectingReq.project}):
            </div>

            {loadingHistory ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-2 text-xs text-zinc-500">
                <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
                <span>LOADING RETURN SESSIONS...</span>
              </div>
            ) : returnsHistory.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-white/[0.01] border border-white/5 text-xs text-zinc-500">
                No return events recorded for this request yet.
              </div>
            ) : (
              <div className="space-y-3">
                {returnsHistory.map((ret, idx) => (
                  <div
                    key={ret.id}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500">EVENT #{returnsHistory.length - idx}</span>
                        <span className="text-zinc-300 font-bold">{ret.returnedBy}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">
                        {String(ret.createdAt).replace("T", " ").slice(0, 19)} UTC
                      </span>
                    </div>

                    {ret.notes && (
                      <div className="text-[11px] text-zinc-400 italic">
                        Note: {ret.notes}
                      </div>
                    )}

                    <div className="space-y-1">
                      {ret.items.map((it) => (
                        <div
                          key={it.id}
                          className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5 text-[11px]"
                        >
                          <div>
                            <span className="text-white font-medium">{it.name}</span>{" "}
                            <span className="text-zinc-500 font-mono">({it.sku})</span>
                            {it.notes && (
                              <span className="text-zinc-400 block text-[10px]">
                                Defect/Condition: {it.notes}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-200">{it.quantity} unit(s)</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                it.condition === "good"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              }`}
                            >
                              {it.condition}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectingReq(null)}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
