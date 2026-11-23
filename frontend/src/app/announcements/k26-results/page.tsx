'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import HudBox from '@/components/HudBox';
import GlassCard from '@/components/GlassCard';
import {
  K26_CADETS,
  PODS_METADATA,
  CadetResult,
  PodMeta
} from '@/data/inductionResultsK26';
import {
  ArrowLeft,
  ArrowRight,
  X,
  Search,
  Copy,
  Check
} from 'lucide-react';

export default function K26ResultsPage() {
  const [selectedPodId, setSelectedPodId] = useState<string | null>(null);
  const [podSearch, setPodSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when expanded pod view is active and prevent Lenis interception
  useEffect(() => {
    if (selectedPodId) {
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();

      const modalEl = modalRef.current;
      if (modalEl) {
        // Prevent Lenis smooth scroll from capturing wheel/trackpad events inside the modal
        const handleWheel = (e: WheelEvent) => {
          e.stopPropagation();
        };
        modalEl.addEventListener('wheel', handleWheel, { passive: true });
        return () => {
          modalEl.removeEventListener('wheel', handleWheel);
          document.body.style.overflow = '';
        };
      }
    } else {
      document.body.style.overflow = '';
      setPodSearch('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPodId]);

  // Handle ESC key to dismiss expanded pod
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedPodId) {
        closePod();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPodId]);

  // Native View Transition Helper
  const openPod = (podId: string) => {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        setSelectedPodId(podId);
      });
    } else {
      setSelectedPodId(podId);
    }
  };

  const closePod = () => {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        setSelectedPodId(null);
      });
    } else {
      setSelectedPodId(null);
    }
  };

  const handleCopyRoll = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Group cadets by sub-team
  const cadetsByPod = useMemo(() => {
    const map: Record<string, CadetResult[]> = {};
    PODS_METADATA.forEach(p => {
      map[p.name] = K26_CADETS.filter(c => c.assignedSubTeams.includes(p.name));
    });
    return map;
  }, []);

  const activePod = useMemo(() => {
    return PODS_METADATA.find(p => p.id === selectedPodId) || null;
  }, [selectedPodId]);

  const activePodCadets = useMemo(() => {
    if (!activePod) return [];
    const list = cadetsByPod[activePod.name] || [];
    if (!podSearch.trim()) return list;
    const q = podSearch.toLowerCase().trim();
    return list.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.rollNo.toLowerCase().includes(q) ||
        c.branch.toLowerCase().includes(q)
    );
  }, [activePod, cadetsByPod, podSearch]);

  return (
    <div className="relative w-full min-h-screen bg-[#020307] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30 selection:text-white">
      {/* Subtle Cosmic Ambient Glow Depth */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-15%,rgba(56,189,248,0.12),transparent_70%),radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(14,165,233,0.04),transparent_60%)]" />
      {/* Precision Aerospace Grid Dots */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.035]" />

      {/* Sidebar */}
      <Sidebar theme="dark" />

      {/* Top Right Corner Tech Box */}
      <div className="hidden sm:block absolute top-0 right-0 z-30 w-[240px] sm:w-[270px] xl:w-[290px] h-[44px] sm:h-[48px] pointer-events-auto">
        <HudBox compact={true} theme="dark" title="INDUCTION 2026" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-16 sm:pt-24 pb-24 px-4 sm:px-8 md:pl-24 max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          href="/announcements"
          className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.03] text-xs font-mono text-slate-300 hover:text-white hover:border-cyan-400/50 hover:bg-white/[0.06] transition-all mb-8 shadow-sm backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-cyan-400" />
          <span>RETURN TO TRANSMISSIONS</span>
        </Link>

        {/* Title and Horizontal Metrics Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="font-mono text-[10px] sm:text-xs text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
              <span>OFFICIAL SELECTION ROSTER // BATCH K26</span>
            </div>
            <h1 className="font-modern font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
              SPRING K26 INDUCTION
            </h1>
          </div>

          {/* Metrics on Horizontal Label Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl shadow-lg hover:border-white/25 transition-all">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse" />
              <div className="flex flex-col">
                <span className="font-mono text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  SELECTED CANDIDATES
                </span>
                <span className="font-modern font-black text-xl sm:text-2xl text-white leading-tight">
                  {K26_CADETS.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl shadow-lg hover:border-white/25 transition-all">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
              <div className="flex flex-col">
                <span className="font-mono text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  ACTIVE PODS
                </span>
                <span className="font-modern font-black text-xl sm:text-2xl text-white leading-tight">
                  {PODS_METADATA.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Team Glassmorphism Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
          {PODS_METADATA.map((pod, idx) => {
            const cadets = cadetsByPod[pod.name] || [];
            const previewCadets = cadets.slice(0, 6);
            const remainingCount = Math.max(0, cadets.length - previewCadets.length);

            const podTag =
              pod.name === 'Technical'
                ? 'POD 01 // MECHATRONICS'
                : pod.name === 'Graphic Design'
                ? 'POD 02 // VISUAL IDENTITY'
                : pod.name === 'Video Editing'
                ? 'POD 03 // CINEMATICS'
                : 'POD 04 // CORPORATE ALLIANCE';

            return (
              <GlassCard
                key={pod.id}
                tilt={true}
                glowOnHover={true}
                reticle={true}
                chamfer={false}
                outerClassName="w-full flex justify-center"
                className="h-[500px] flex flex-col justify-between group"
              >
                <div>
                  {/* Header: Sub Team Name & Pod Tag */}
                  <div className="pb-4 border-b border-white/15 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-[9px] sm:text-[10px] text-cyan-400 uppercase tracking-widest font-bold mb-1">
                        {podTag}
                      </div>
                      <h2 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                        {pod.name}
                      </h2>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center font-mono text-xs text-slate-400 font-bold shrink-0">
                      0{idx + 1}
                    </div>
                  </div>

                  {/* 5 - 6 names and branch on bracket */}
                  <ul className="mt-5 space-y-2.5">
                    {previewCadets.map(cadet => (
                      <li
                        key={cadet.id}
                        className="group/item flex items-center justify-between text-sm sm:text-base font-medium text-white py-1 px-2 -mx-2 rounded-lg hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                          <span className="font-semibold text-white tracking-wide group-hover/item:text-cyan-300 transition-colors truncate">
                            {cadet.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-300 px-2 py-0.5 rounded border border-white/10 bg-white/[0.04] shrink-0 ml-2">
                          {cadet.branch}
                        </span>
                      </li>
                    ))}

                    {/* Dot Dot Dot Indicator for remaining members */}
                    {remainingCount > 0 && (
                      <li className="flex items-center gap-2 text-slate-400 font-medium pt-2 px-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/40 shrink-0" />
                        <span className="tracking-widest text-slate-300 text-base font-bold leading-none">. . .</span>
                        <span className="text-xs font-mono text-cyan-400/80 font-semibold">
                          (+{remainingCount} more cadets)
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* View More Button */}
                <div className="mt-6 pt-4 border-t border-white/15">
                  <button
                    type="button"
                    onClick={() => openPod(pod.id)}
                    className="group/btn w-full py-3 px-6 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] active:scale-[0.99] transition-all cursor-pointer text-center shadow-[0_4px_16px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
                  >
                    <span>VIEW MORE</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </main>

      {/* Fullscreen Expanded View on Click (Portaled to document.body for native trackpad/touch scrolling) */}
      {selectedPodId && activePod && typeof document !== 'undefined' && createPortal(
        <div
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          data-lenis-prevent="true"
          onWheel={e => e.stopPropagation()}
          className="fixed inset-0 z-50 overflow-y-auto bg-[#020409] text-white animate-modal-fade select-text"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y'
          }}
        >
          {/* Sticky Top Header */}
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#040711]/95 backdrop-blur-md px-3 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
              <button
                type="button"
                onClick={closePod}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-white/15 text-[11px] sm:text-xs font-mono text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">BACK</span>
              </button>
              <h2 className="font-modern font-black text-base sm:text-2xl text-white uppercase tracking-tight truncate">
                {activePod.name}
              </h2>
              <span className="font-mono text-[10px] sm:text-xs text-slate-300 border border-white/15 px-2 sm:px-2.5 py-0.5 rounded-full bg-white/[0.04] shrink-0">
                {activePodCadets.length} <span className="hidden sm:inline">{activePodCadets.length === 1 ? 'Cadet' : 'Cadets'}</span>
              </span>
            </div>

            <button
              type="button"
              onClick={closePod}
              aria-label="Close"
              className="p-1.5 sm:p-2 rounded-lg border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </header>

          {/* Modal Main Scrollable Body */}
          <div className="max-w-5xl mx-auto px-3 sm:px-8 py-6 sm:py-8">
            {/* Sub-team Title Banner */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-white/10">
              <div>
                <div className="font-mono text-[10px] sm:text-xs text-cyan-400 tracking-wider uppercase mb-1">
                  RECRUITMENT RESULTS 2026 • ROSTER
                </div>
                <h3 className="font-modern font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
                  {activePod.name} POD
                </h3>
              </div>
              <div className="font-mono text-xs text-slate-400">
                ACTIVE CADETS: <span className="text-white font-bold">{activePodCadets.length}</span>
              </div>
            </div>

            {/* Search within Pod */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={podSearch}
                  onChange={e => setPodSearch(e.target.value)}
                  placeholder="Filter by name, roll no, or branch..."
                  className="w-full pl-10 pr-10 py-3 bg-white/[0.03] border border-white/15 rounded-xl text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:border-white/40 transition-colors"
                />
                {podSearch && (
                  <button
                    type="button"
                    onClick={() => setPodSearch('')}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Tabular View with Name, Roll No, Branch */}
            <div
              className="w-full overflow-x-auto rounded-xl border border-white/15 bg-white/[0.02] shadow-2xl mb-10"
              style={{ touchAction: 'pan-y' }}
            >
              <table className="w-full text-left border-collapse min-w-[560px]">
                <thead>
                  <tr className="border-b border-white/15 bg-white/[0.04] text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-4 w-14 text-center font-semibold">#</th>
                    <th className="py-3.5 px-6 font-semibold">CANDIDATE NAME</th>
                    <th className="py-3.5 px-6 font-semibold">ROLL NUMBER</th>
                    <th className="py-3.5 px-6 text-right font-semibold">BRANCH</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.08] text-sm font-sans">
                  {activePodCadets.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400 font-mono text-xs">
                        No matching cadet found in {activePod.name}.
                      </td>
                    </tr>
                  ) : (
                    activePodCadets.map((cadet, idx) => (
                      <tr
                        key={cadet.id}
                        className="hover:bg-white/[0.04] transition-colors group"
                      >
                        {/* Serial Number */}
                        <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-400">
                          {String(idx + 1).padStart(2, '0')}
                        </td>

                        {/* Candidate Name */}
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                            <span className="font-semibold text-white tracking-wide text-base">
                              {cadet.name}
                            </span>
                          </div>
                        </td>

                        {/* Roll Number with Copy */}
                        <td className="py-3.5 px-6">
                          <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-300 bg-cyan-950/30 px-2.5 py-1 rounded border border-cyan-800/40">
                            <span className="tracking-wider">{cadet.rollNo}</span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyRoll(e, cadet.rollNo, cadet.id)}
                              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                              title="Copy Roll Number"
                            >
                              {copiedId === cadet.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Branch */}
                        <td className="py-3.5 px-6 text-right">
                          <span className="inline-block px-3 py-1 rounded-md border border-white/15 bg-white/[0.05] font-mono text-xs text-slate-200">
                            {cadet.branch}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Close Button */}
            <div className="flex justify-center pb-16">
              <button
                type="button"
                onClick={closePod}
                className="px-6 py-2.5 rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                CLOSE ROSTER
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Pure CSS Fade Animation (No transform on scroll container) */}
      <style jsx global>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-modal-fade {
          animation: modalFadeIn 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
