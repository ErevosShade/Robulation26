'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import HudBox from '@/components/HudBox';
import PatternWaves from '@/components/PatternWaves';
import {
  K26_CADETS,
  PODS_METADATA,
  CadetResult,
  PodMeta
} from '@/data/inductionResultsK26';
import {
  ArrowLeft,
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

  // Lock body scroll when expanded pod view is active
  useEffect(() => {
    if (selectedPodId) {
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
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
    <div className="relative w-full min-h-screen bg-[#020307] text-white font-sans overflow-x-hidden">
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
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO TRANSMISSIONS</span>
        </Link>

        {/* Heading */}
        <h1 className="font-modern font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase">
          SPRING K26 INDUCTION
        </h1>

        {/* Metrics Only: Selected Candidates & Active Pods */}
        <div className="grid grid-cols-2 gap-4 max-w-md mt-8 mb-16">
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="font-mono text-xs text-slate-400 uppercase tracking-widest">SELECTED CANDIDATES</div>
            <div className="font-modern font-black text-2xl sm:text-3xl text-white mt-1">
              {K26_CADETS.length}
            </div>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="font-mono text-xs text-slate-400 uppercase tracking-widest">ACTIVE PODS</div>
            <div className="font-modern font-black text-2xl sm:text-3xl text-white mt-1">
              {PODS_METADATA.length}
            </div>
          </div>
        </div>

        {/* Sub-Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
          {PODS_METADATA.map(pod => {
            const cadets = cadetsByPod[pod.name] || [];
            const previewCadets = cadets.slice(0, 6);
            const remainingCount = Math.max(0, cadets.length - previewCadets.length);

            return (
              <div
                key={pod.id}
                className="group relative rounded-[24px] border border-white/20 bg-linear-to-b from-[#181d28]/90 via-[#0e121a]/95 to-[#05070d] backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 hover:border-white/40 hover:shadow-[0_16px_50px_rgba(255,255,255,0.06)] flex flex-col justify-between h-[510px]"
              >
                {/* Silver Gradient Top Edge */}
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-linear-to-r from-transparent via-white/60 to-transparent pointer-events-none z-10" />

                {/* Subtle Ambient Silver Aura */}
                <div className="absolute -top-20 -left-20 w-44 h-44 rounded-full bg-slate-300/10 blur-3xl pointer-events-none z-0" />

                {/* PatternWaves Interactive Background */}
                <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500 pointer-events-auto">
                  <PatternWaves
                    preset="silk"
                    color="#ffffff"
                    backgroundColor="#000000"
                    fade="edges"
                    interactive={true}
                    cursorSize={50}
                    cursorStrength={0.6}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>

                {/* Vignette Overlay for Crisp Contrast */}
                <div className="absolute inset-0 z-[1] bg-linear-to-b from-black/45 via-black/25 to-black/85 pointer-events-none" />

                {/* Card Foreground Content */}
                <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between h-full pointer-events-none">
                  <div>
                    {/* Header: Sub Team Name ONLY (no cadet count badge) */}
                    <div className="pb-4 border-b border-white/15">
                      <h2 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                        {pod.name}
                      </h2>
                    </div>

                    {/* 5 - 6 names and branch on bracket */}
                    <ul className="mt-5 space-y-3.5">
                      {previewCadets.map(cadet => (
                        <li
                          key={cadet.id}
                          className="flex items-center gap-2.5 text-base sm:text-lg font-medium text-white"
                        >
                          <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                          <span className="font-semibold text-white tracking-wide">{cadet.name}</span>
                          <span className="text-xs font-mono text-slate-300">({cadet.branch})</span>
                        </li>
                      ))}

                      {/* Dot Dot Dot Indicator for remaining members */}
                      {remainingCount > 0 && (
                        <li className="flex items-center gap-2.5 text-slate-400 font-medium pt-1">
                          <span className="w-2 h-2 rounded-full bg-cyan-400/40 shrink-0" />
                          <span className="tracking-widest text-slate-300 text-lg font-bold leading-none">. . .</span>
                          <span className="text-xs font-mono text-slate-400">
                            (+{remainingCount} more)
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* View More Button */}
                  <div className="mt-6 pt-4 border-t border-white/15 pointer-events-auto">
                    <button
                      type="button"
                      onClick={() => openPod(pod.id)}
                      className="w-full py-3 px-6 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-slate-200 active:scale-[0.99] transition-all cursor-pointer text-center shadow-lg"
                    >
                      VIEW MORE
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Fullscreen Expanded View on Click */}
      {selectedPodId && activePod && (
        <div
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-[#020409] text-white animate-pod-expand"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Sticky Top Header */}
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#040711]/95 backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={closePod}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 text-xs font-mono text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK</span>
              </button>
              <h2 className="font-modern font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                {activePod.name}
              </h2>
              <span className="font-mono text-xs text-slate-300 border border-white/15 px-2.5 py-0.5 rounded-full bg-white/[0.04]">
                {activePodCadets.length} {activePodCadets.length === 1 ? 'Cadet' : 'Cadets'}
              </span>
            </div>

            <button
              type="button"
              onClick={closePod}
              aria-label="Close"
              className="p-2 rounded-lg border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          {/* Modal Main Scrollable Body */}
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
            {/* Sub-team Title Banner */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="font-mono text-xs text-cyan-400 tracking-wider uppercase mb-1">
                  RECRUITMENT RESULTS 2026 • ROSTER
                </div>
                <h3 className="font-modern font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
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
            <div className="w-full overflow-x-auto rounded-xl border border-white/15 bg-white/[0.02] shadow-2xl mb-10">
              <table className="w-full text-left border-collapse min-w-[620px]">
                <thead>
                  <tr className="border-b border-white/15 bg-white/[0.04] text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-4 w-14 text-center font-semibold">#</th>
                    <th className="py-3.5 px-6 font-semibold">CANDIDATE NAME</th>
                    <th className="py-3.5 px-6 font-semibold">ROLL NUMBER</th>
                    <th className="py-3.5 px-6 font-semibold">BRANCH</th>
                    <th className="py-3.5 px-6 text-right font-semibold">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.08] text-sm font-sans">
                  {activePodCadets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-mono text-xs">
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
                        <td className="py-3.5 px-6">
                          <span className="inline-block px-3 py-1 rounded-md border border-white/15 bg-white/[0.05] font-mono text-xs text-slate-200">
                            {cadet.branch}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-6 text-right">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            SELECTED
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
        </div>
      )}

      {/* Pure CSS Animation Styles */}
      <style jsx global>{`
        @keyframes podExpandAnimation {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-pod-expand {
          animation: podExpandAnimation 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
