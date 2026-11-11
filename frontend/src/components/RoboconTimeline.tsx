'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Trophy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface RoboconAchievement {
  id: string;
  section: 'robocon';
  title: string;
  yearOrCycle: string;
  yearNumber: number;
  badge: string;
  status: 'Campaign Active' | 'Historical Milestone';
  venue: string;
  specs?: string;
  metric: string;
  allocationOrPrize?: string;
  image?: string;
  description: string;
  problem?: string;
  teamPov?: string;
  highlights: string[];
}

interface RoboconTimelineProps {
  records: RoboconAchievement[];
  activeTab?: string;
}

interface TimelinePositions {
  ys: number[];
  termY: number;
  totalH: number;
}

export default function RoboconTimeline({ records, activeTab }: RoboconTimelineProps) {
  // Chronological order: 2013 -> 2015 -> 2016 -> 2018 -> 2021 -> 2026
  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => a.yearNumber - b.yearNumber);
  }, [records]);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  // References
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const beaconAnchorRef = useRef<HTMLDivElement>(null);

  const activePathRef = useRef<SVGPathElement>(null);
  const corePathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const basePathRef = useRef<SVGPathElement>(null);
  const tipBeadRef = useRef<SVGCircleElement>(null);
  const particlesRef = useRef<(SVGCircleElement | null)[]>([]);

  // Default initial positions before DOM measurement
  const [positions, setPositions] = useState<TimelinePositions>({
    ys: [140, 500, 880, 1260, 1640, 2020],
    termY: 2360,
    totalH: 2600,
  });

  const [reachedMilestones, setReachedMilestones] = useState<boolean[]>([true, false, false, false, false, false]);
  const [isTerminalReached, setIsTerminalReached] = useState<boolean>(false);

  const milestoneFractionsRef = useRef<number[]>([]);
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);

  // Particle configuration: Style 04 (Luminous particle energy flow with multi-tier depth)
  const particleRadii = [2.2, 3.4, 2.0, 3.8, 2.4, 3.2, 2.6, 4.0, 1.8, 3.0, 2.2, 3.5, 2.0, 3.6];
  const particleOpacities = [0.85, 1.0, 0.7, 0.95, 0.75, 0.9, 0.8, 1.0, 0.65, 0.9, 0.7, 0.95, 0.6, 0.85];
  const particleCount = particleRadii.length;

  // Measure exact DOM positions relative to wrapperRef (SVG coordinate parent)
  useEffect(() => {
    const measure = () => {
      if (!wrapperRef.current) return;
      const wRect = wrapperRef.current.getBoundingClientRect();

      const newYs = sortedRecords.map((_, idx) => {
        const row = rowRefs.current[idx];
        if (!row) {
          return 140 + idx * 380;
        }
        const r = row.getBoundingClientRect();
        return Math.round(r.top - wRect.top + r.height / 2);
      });

      let newTermY = 0;
      if (beaconAnchorRef.current) {
        const anchorRect = beaconAnchorRef.current.getBoundingClientRect();
        newTermY = Math.round(anchorRect.top - wRect.top + anchorRect.height / 2);
      } else {
        newTermY = (newYs[newYs.length - 1] || 2020) + 280;
      }

      const totalH = Math.max(wRect.height, newTermY + 80);

      setPositions(prev => {
        const sameYs = prev.ys.length === newYs.length && prev.ys.every((y, i) => Math.abs(y - newYs[i]) < 2);
        if (sameYs && Math.abs(prev.termY - newTermY) < 2 && Math.abs(prev.totalH - totalH) < 2) {
          return prev;
        }
        return { ys: newYs, termY: newTermY, totalH };
      });
    };

    measure();
    const t1 = setTimeout(measure, 60);
    const t2 = setTimeout(measure, 300);

    const ro = new ResizeObserver(() => {
      measure();
    });
    if (wrapperRef.current) {
      ro.observe(wrapperRef.current);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ro.disconnect();
    };
  }, [sortedRecords, activeTab, expandedId]);

  // Harmonic cubic Bézier serpentine curve
  // Corridor width: 80px (Center = 40).
  // Amplitude: Left (x=18) <-> Right (x=62), Span = 44px
  // Control factor = 0.5 delivers a mathematically pure smoothstep (cubic Hermite) transition
  // with linear y-progression and continuous, harmonic curvature without any awkward diagonal slants
  const serpentinePathD = useMemo(() => {
    const { ys, termY } = positions;
    const y0 = ys[0] ?? 140;
    const startY = Math.max(10, y0 - 90);
    const centerX = 40;
    const leftX = 18;
    const rightX = 62;

    // Start at center x=40, smoothly sweep left into Node 0 at (leftX, y0)
    let d = `M ${centerX},${startY}`;
    const dy0 = y0 - startY;
    d += ` C ${centerX},${startY + dy0 * 0.5} ${leftX},${y0 - dy0 * 0.5} ${leftX},${y0}`;

    // Elegant harmonic S-curves between consecutive milestones
    for (let i = 0; i < sortedRecords.length - 1; i++) {
      const fromX = i % 2 === 0 ? leftX : rightX;
      const toX = (i + 1) % 2 === 0 ? leftX : rightX;
      const fromY = ys[i] ?? (140 + i * 380);
      const toY = ys[i + 1] ?? (140 + (i + 1) * 380);
      const dy = toY - fromY;
      d += ` C ${fromX},${fromY + dy * 0.5} ${toX},${toY - dy * 0.5} ${toX},${toY}`;
    }

    // Smoothly curve from last milestone into terminal beacon at center (centerX, termY)
    const lastIdx = sortedRecords.length - 1;
    const lastX = lastIdx % 2 === 0 ? leftX : rightX;
    const lastY = ys[lastIdx] ?? 2020;
    const dTermY = termY - lastY;
    d += ` C ${lastX},${lastY + dTermY * 0.5} ${centerX},${termY - dTermY * 0.5} ${centerX},${termY}`;

    return d;
  }, [positions, sortedRecords.length]);

  // Pre-calculate path fractions for each milestone to illuminate them as scroll advances
  const totalLenRef = useRef<number>(2700);

  // Measure path length and milestone fractions only when geometry changes
  useEffect(() => {
    if (!basePathRef.current) return;
    try {
      const totalLen = basePathRef.current.getTotalLength();
      if (!totalLen || isNaN(totalLen)) return;
      totalLenRef.current = totalLen;

      if (activePathRef.current) activePathRef.current.style.strokeDasharray = `${totalLen}`;
      if (corePathRef.current) corePathRef.current.style.strokeDasharray = `${totalLen}`;
      if (glowPathRef.current) glowPathRef.current.style.strokeDasharray = `${totalLen}`;

      const { ys } = positions;
      const fractions: number[] = [];
      const step = 4;
      for (const y of ys) {
        let bestLen = 0;
        let bestDiff = 999999;
        for (let l = 0; l <= totalLen; l += step) {
          const pt = basePathRef.current.getPointAtLength(l);
          const diff = Math.abs(pt.y - y);
          if (diff < bestDiff) {
            bestDiff = diff;
            bestLen = l;
          }
          if (diff < 1.0) break;
        }
        fractions.push(bestLen / totalLen);
      }
      milestoneFractionsRef.current = fractions;
    } catch {
      milestoneFractionsRef.current = [0.05, 0.22, 0.40, 0.58, 0.76, 0.92];
    }
  }, [positions, serpentinePathD]);

  // Passive scroll listener: samples scroll progress without forced synchronous layout in RAF
  useEffect(() => {
    const updateScrollTarget = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      let p = 0;
      if (maxScroll > 0 && window.scrollY >= maxScroll - 30) {
        p = 1.0;
      } else {
        const startLine = vh * 0.75;
        const endLine = vh * 0.65;
        const totalDist = rect.height - (startLine - endLine);
        if (totalDist <= 0) {
          p = 1.0;
        } else {
          const currentDist = startLine - rect.top;
          p = Math.max(0, Math.min(1.0, currentDist / totalDist));
        }
      }
      targetProgressRef.current = p;
    };

    updateScrollTarget();
    window.addEventListener('scroll', updateScrollTarget, { passive: true });
    window.addEventListener('resize', updateScrollTarget, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrollTarget);
      window.removeEventListener('resize', updateScrollTarget);
    };
  }, []);

  // RequestAnimationFrame loop for silky-smooth particle flow, active only when visible
  useEffect(() => {
    let animId: number = 0;
    let particleOffset = 0;
    let isVisible = false;

    const tick = () => {
      if (!isVisible) return;
      if (!basePathRef.current || !activePathRef.current) {
        animId = requestAnimationFrame(tick);
        return;
      }

      const basePath = basePathRef.current;
      const activePath = activePathRef.current;
      const corePath = corePathRef.current;
      const glowPath = glowPathRef.current;
      const totalLen = totalLenRef.current || 2700;

      // Smooth progress interpolation
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * 0.18;
      if (Math.abs(targetProgressRef.current - currentProgressRef.current) < 0.001) {
        currentProgressRef.current = targetProgressRef.current;
      }
      const activeP = currentProgressRef.current;

      // Animate progress line strokes
      const currentOffset = totalLen * (1 - activeP);
      activePath.style.strokeDashoffset = `${currentOffset}`;
      if (corePath) {
        corePath.style.strokeDashoffset = `${currentOffset}`;
      }
      if (glowPath) {
        glowPath.style.strokeDashoffset = `${currentOffset}`;
      }

      // Continuous particle flow velocity along the curve
      particleOffset = (particleOffset + 0.0018) % 1;

      // Position glowing energy particles along the illuminated portion of the path
      particlesRef.current.forEach((dot, idx) => {
        if (!dot) return;
        const baseFrac = idx / particleCount;
        const frac = (baseFrac + particleOffset) % 1;

        if (activeP > 0.01 && frac <= activeP) {
          const pt = basePath.getPointAtLength(frac * totalLen);
          dot.setAttribute('cx', `${pt.x}`);
          dot.setAttribute('cy', `${pt.y}`);
          dot.style.opacity = `${particleOpacities[idx]}`;
        } else {
          dot.style.opacity = '0';
        }
      });

      // Leading beacon bead at the exact advancing head of the line
      if (tipBeadRef.current) {
        if (activeP > 0.01 && activeP < 0.999) {
          const tipPt = basePath.getPointAtLength(activeP * totalLen);
          tipBeadRef.current.setAttribute('cx', `${tipPt.x}`);
          tipBeadRef.current.setAttribute('cy', `${tipPt.y}`);
          tipBeadRef.current.style.opacity = '1';
        } else {
          tipBeadRef.current.style.opacity = '0';
        }
      }

      // Milestone illuminated activation states (memoized state dispatch to avoid 60fps React re-renders)
      const fractions = milestoneFractionsRef.current;
      if (fractions.length > 0) {
        const newReached = fractions.map(f => activeP >= f - 0.02);
        setReachedMilestones(prev => {
          if (prev.length === newReached.length && prev.every((v, i) => v === newReached[i])) {
            return prev;
          }
          return newReached;
        });
      }

      // Terminal node illuminates when progress reaches the CTA beacon
      const newTerm = activeP >= 0.95;
      setIsTerminalReached(prev => (prev === newTerm ? prev : newTerm));

      animId = requestAnimationFrame(tick);
    };

    const container = containerRef.current;
    let observer: IntersectionObserver | null = null;
    if (container) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            cancelAnimationFrame(animId);
            animId = requestAnimationFrame(tick);
          } else {
            cancelAnimationFrame(animId);
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(container);
    }

    return () => {
      cancelAnimationFrame(animId);
      observer?.disconnect();
    };
  }, [particleCount]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const { totalH, termY } = positions;

  return (
    <div ref={containerRef} className="relative w-full max-w-7xl mx-auto py-6 sm:py-10">
      {/* ── WRAPPER ENCLOSING MILESTONES & CENTRAL SPINE (Common Coordinate Space) ── */}
      <div ref={wrapperRef} className="relative w-full">
        {/* ── DEDICATED CENTRAL SPINE (DESKTOP) ── */}
        <div
          className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-[80px] pointer-events-none z-10"
          style={{ height: `${totalH}px` }}
        >
          <svg
            viewBox={`0 0 80 ${totalH}`}
            className="w-full h-full overflow-visible"
          >
            <defs>
              {/* Primary Cyan Neon Gradient */}
              <linearGradient id="neonCyanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.9" />
                <stop offset="25%" stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="60%" stopColor="#06b6d4" stopOpacity="1" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="1" />
              </linearGradient>

              {/* Ambient Soft Cyan Aura */}
              <linearGradient id="ambientCyanAura" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
              </linearGradient>

              {/* Glowing Particle Filter */}
              <filter id="particleGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Milestone Node Glow Filter */}
              <filter id="milestoneGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Layer 1: Base Dark Rail Guideline (Precision dashed track) */}
            <path
              ref={basePathRef}
              d={serpentinePathD}
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="2.2"
              strokeDasharray="4 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Layer 2: Wide Ambient Outer Aura (Atmospheric neon glow) */}
            <path
              ref={glowPathRef}
              d={serpentinePathD}
              fill="none"
              stroke="url(#ambientCyanAura)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Layer 3: Primary Neon Illuminated Conduit */}
            <path
              ref={activePathRef}
              d={serpentinePathD}
              fill="none"
              stroke="url(#neonCyanGrad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Layer 4: Electric Superconducting White Hot Inner Core */}
            <path
              ref={corePathRef}
              d={serpentinePathD}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />

            {/* ── STYLE 04: LUMINOUS PARTICLES FLOWING CONTINUOUSLY ALONG THE PATH ── */}
            {particleRadii.map((r, i) => (
              <circle
                key={`flow-particle-${i}`}
                ref={el => { particlesRef.current[i] = el; }}
                cx="40"
                cy="0"
                r={r}
                fill="#ffffff"
                stroke="#38bdf8"
                strokeWidth="1.5"
                filter="url(#particleGlow)"
                className="transition-opacity duration-150"
                style={{ opacity: 0 }}
              />
            ))}

            {/* Advancing Head Beacon Bead */}
            <circle
              ref={tipBeadRef}
              cx="40"
              cy="0"
              r="4.5"
              fill="#ffffff"
              stroke="#22d3ee"
              strokeWidth="2"
              filter="url(#particleGlow)"
              style={{ opacity: 0 }}
            />

            {/* ── MILESTONE NODES & CONNECTOR LINES DIRECTLY ON THE SVG ── */}
            {sortedRecords.map((record, idx) => {
              const isLeft = idx % 2 === 0;
              const nodeX = isLeft ? 18 : 62;
              const nodeY = positions.ys[idx] ?? (140 + idx * 380);
              const isReached = reachedMilestones[idx];

              return (
                <g
                  key={`svg-node-${record.id}`}
                  className="cursor-pointer pointer-events-auto"
                  onClick={() => toggleExpand(record.id)}
                >
                  {/* Symmetrical 18px horizontal dotted connector extending to achievement content */}
                  <line
                    x1={isLeft ? 0 : 80}
                    y1={nodeY}
                    x2={nodeX}
                    y2={nodeY}
                    stroke={isReached ? '#38bdf8' : 'rgba(255, 255, 255, 0.22)'}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="transition-colors duration-400"
                  />

                  {/* Outer pulse wave when reached */}
                  {isReached && (
                    <circle
                      cx={nodeX}
                      cy={nodeY}
                      r="14"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1.5"
                      className="animate-ping origin-center"
                      style={{ transformOrigin: `${nodeX}px ${nodeY}px` }}
                      opacity="0.5"
                    />
                  )}

                  {/* Milestone Node Outer Disc */}
                  <circle
                    cx={nodeX}
                    cy={nodeY}
                    r="8"
                    fill={isReached ? '#0891b2' : '#030712'}
                    stroke={isReached ? '#38bdf8' : 'rgba(255, 255, 255, 0.35)'}
                    strokeWidth="2.5"
                    filter={isReached ? 'url(#milestoneGlow)' : undefined}
                    className="transition-colors duration-400"
                  />

                  {/* Milestone Node Inner Core */}
                  <circle
                    cx={nodeX}
                    cy={nodeY}
                    r="3"
                    fill={isReached ? '#ffffff' : 'rgba(255, 255, 255, 0.45)'}
                    className="transition-colors duration-400"
                  />
                </g>
              );
            })}

            {/* ── TERMINAL BEACON AT (40, termY) - TERMINATES CLEANLY ABOVE THE CTA ── */}
            <g>
              {isTerminalReached && (
                <>
                  <circle
                    cx="40"
                    cy={termY}
                    r="18"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    className="animate-ping origin-center"
                    style={{ transformOrigin: `40px ${termY}px` }}
                    opacity="0.6"
                  />
                  <circle
                    cx="40"
                    cy={termY}
                    r="12"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="1.5"
                    className="animate-pulse origin-center"
                    style={{ transformOrigin: `40px ${termY}px` }}
                    opacity="0.4"
                  />
                </>
              )}

              <circle
                cx="40"
                cy={termY}
                r="9"
                fill={isTerminalReached ? '#0284c7' : '#040817'}
                stroke={isTerminalReached ? '#22d3ee' : 'rgba(255, 255, 255, 0.35)'}
                strokeWidth="2.5"
                filter={isTerminalReached ? 'url(#milestoneGlow)' : undefined}
                className="transition-colors duration-500"
              />

              <circle
                cx="40"
                cy={termY}
                r="3.5"
                fill={isTerminalReached ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'}
                className="transition-colors duration-500"
              />
            </g>
          </svg>
        </div>

        {/* ── 3-ZONE GRID: [ LEFT CONTENT ] | [ 80px CENTRAL SPINE ] | [ RIGHT CONTENT ] ── */}
        <div className="space-y-24 sm:space-y-36 relative z-20">
          {sortedRecords.map((record, idx) => {
            const isLeft = idx % 2 === 0;
            const isExpanded = expandedId === record.id;

            return (
              <div
                key={record.id}
                ref={el => { rowRefs.current[idx] = el; }}
                className="relative grid grid-cols-1 lg:grid-cols-[1fr_80px_1fr] items-center min-h-[320px]"
              >
                {/* ── ZONE 1: LEFT COLUMN (Editorial Content OR Image brought close to center) ── */}
                <div className="w-full flex flex-col justify-center lg:pr-2">
                  {isLeft ? (
                    <div className="lg:text-right flex flex-col lg:items-end w-full">
                      <div className="relative w-full max-w-xl transition-opacity duration-300">
                        {/* Year & Badge Header */}
                        <div className="flex flex-wrap items-center lg:justify-end gap-2.5 mb-2 font-mono">
                          <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                            {record.yearNumber}
                          </span>
                          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-400/30 whitespace-nowrap">
                            {record.badge}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                            {record.yearOrCycle}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-modern font-black text-lg sm:text-xl text-white uppercase tracking-tight leading-snug break-words [text-wrap:balance]">
                          {record.title}
                        </h3>

                        {/* Location & Honors */}
                        <div className="mt-2 flex flex-wrap items-center lg:justify-end gap-x-3 gap-y-1 text-xs text-slate-400">
                          <div className="flex items-center gap-1.5 shrink-0">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{record.venue}</span>
                          </div>
                          {record.allocationOrPrize && (
                            <div className="flex items-center gap-1.5 text-white font-medium shrink-0">
                              <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>{record.allocationOrPrize}</span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="font-sans text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed break-words">
                          {record.description}
                        </p>

                        {/* Technical Tags */}
                        <div className="mt-3 flex flex-wrap gap-1.5 lg:justify-end">
                          {record.highlights.map((h, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 font-sans text-[11px] text-slate-300 whitespace-normal text-left"
                            >
                              {h}
                            </span>
                          ))}
                        </div>

                        {/* Expandable Technical Deep-Dive */}
                        {isExpanded && (
                          <div className="mt-3.5 pt-3 border-t border-white/10 text-left space-y-2 text-xs">
                            {record.problem && (
                              <div className="p-2.5 rounded bg-white/[0.03] border border-white/10">
                                <span className="text-cyan-400 font-semibold uppercase tracking-wider block mb-1 font-mono text-[10px]">
                                  // PROBLEM STATEMENT
                                </span>
                                <span className="text-slate-300 leading-relaxed break-words">
                                  {record.problem}
                                </span>
                              </div>
                            )}

                            {record.teamPov && (
                              <div className="p-2.5 rounded bg-sky-950/20 border border-sky-400/20">
                                <span className="text-sky-300 font-semibold uppercase tracking-wider block mb-1 font-mono text-[10px]">
                                  // TACTICAL SOLUTION
                                </span>
                                <span className="text-slate-300 leading-relaxed break-words">
                                  {record.teamPov}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Read More button */}
                        <div className="mt-3 flex lg:justify-end">
                          <button
                            type="button"
                            onClick={() => toggleExpand(record.id)}
                            className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-cyan-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            <span>{isExpanded ? 'Less' : 'Read Technical Details'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Right-aligned entry: robot image brought close to central timeline */
                    <div className="hidden lg:flex justify-end w-full">
                      {record.image && (
                        <div className="relative w-80 sm:w-[350px] lg:w-[400px] h-64 sm:h-72 lg:h-[300px] rounded-xl overflow-hidden bg-black/70 border border-white/10 shadow-xl flex items-center justify-center p-3 group">
                          <Image
                            src={record.image}
                            alt={record.title}
                            fill
                            sizes="400px"
                            className={`object-contain p-2 group-hover:scale-105 transition-transform duration-300 ease-out ${
                              record.yearNumber === 2016 ? 'scale-[1.65]' : ''
                            }`}
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── ZONE 2: DEDICATED CENTRAL SPINE (Spanning exactly 80px) ── */}
                <div className="hidden lg:block w-[80px] h-full pointer-events-none" />

                {/* ── ZONE 3: RIGHT COLUMN (Editorial Content OR Image brought close to center) ── */}
                <div className="w-full flex flex-col justify-center lg:pl-2">
                  {!isLeft ? (
                    <div className="text-left flex flex-col items-start w-full">
                      <div className="relative w-full max-w-xl transition-opacity duration-300">
                        {/* Year & Badge Header */}
                        <div className="flex flex-wrap items-center gap-2.5 mb-2 font-mono">
                          <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                            {record.yearNumber}
                          </span>
                          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-400/30 whitespace-nowrap">
                            {record.badge}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                            {record.yearOrCycle}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-modern font-black text-lg sm:text-xl text-white uppercase tracking-tight leading-snug break-words [text-wrap:balance]">
                          {record.title}
                        </h3>

                        {/* Location & Honors */}
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                          <div className="flex items-center gap-1.5 shrink-0">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{record.venue}</span>
                          </div>
                          {record.allocationOrPrize && (
                            <div className="flex items-center gap-1.5 text-white font-medium shrink-0">
                              <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>{record.allocationOrPrize}</span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="font-sans text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed break-words">
                          {record.description}
                        </p>

                        {/* Technical Tags */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {record.highlights.map((h, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 font-sans text-[11px] text-slate-300 whitespace-normal"
                            >
                              {h}
                            </span>
                          ))}
                        </div>

                        {/* Expandable Technical Deep-Dive */}
                        {isExpanded && (
                          <div className="mt-3.5 pt-3 border-t border-white/10 text-left space-y-2 text-xs">
                            {record.problem && (
                              <div className="p-2.5 rounded bg-white/[0.03] border border-white/10">
                                <span className="text-cyan-400 font-semibold uppercase tracking-wider block mb-1 font-mono text-[10px]">
                                  // PROBLEM STATEMENT
                                </span>
                                <span className="text-slate-300 leading-relaxed break-words">
                                  {record.problem}
                                </span>
                              </div>
                            )}

                            {record.teamPov && (
                              <div className="p-2.5 rounded bg-sky-950/20 border border-sky-400/20">
                                <span className="text-sky-300 font-semibold uppercase tracking-wider block mb-1 font-mono text-[10px]">
                                  // TACTICAL SOLUTION
                                </span>
                                <span className="text-slate-300 leading-relaxed break-words">
                                  {record.teamPov}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Read More button */}
                        <div className="mt-3 flex">
                          <button
                            type="button"
                            onClick={() => toggleExpand(record.id)}
                            className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-cyan-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            <span>{isExpanded ? 'Less' : 'Read Technical Details'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Left-aligned entry: robot image brought close to central timeline */
                    <div className="hidden lg:flex justify-start w-full">
                      {record.image && (
                        <div className="relative w-80 sm:w-[350px] lg:w-[400px] h-64 sm:h-72 lg:h-[300px] rounded-xl overflow-hidden bg-black/70 border border-white/10 shadow-xl flex items-center justify-center p-3 group">
                          <Image
                            src={record.image}
                            alt={record.title}
                            fill
                            sizes="400px"
                            className={`object-contain p-2 group-hover:scale-105 transition-transform duration-300 ease-out ${
                              record.yearNumber === 2016 ? 'scale-[1.65]' : ''
                            }`}
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── MOBILE PHOTOGRAPH DISPLAY (Only on smaller screens) ── */}
                <div className="block lg:hidden mt-4 w-full">
                  {record.image && (
                    <div className="relative w-full h-56 rounded-lg overflow-hidden bg-black/80 border border-white/10 flex items-center justify-center p-2">
                      <Image
                        src={record.image}
                        alt={record.title}
                        fill
                        sizes="100vw"
                        className={`object-contain p-1 ${
                          record.yearNumber === 2016 ? 'scale-[1.5]' : ''
                        }`}
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CONCLUDING CTA: ATTACHED DIRECTLY AT THE TERMINATION OF THE CENTRAL CURVE ── */}
        <div
          className="relative z-20 mt-20 pt-4 pb-12 flex flex-col items-center justify-center text-center"
        >
          {/* Dedicated anchor container for the terminal beacon with ample vertical breathing room */}
          <div ref={beaconAnchorRef} className="w-10 h-10 mb-8 flex items-center justify-center pointer-events-none" />

          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 font-mono text-xs text-cyan-300 uppercase tracking-widest font-bold mb-3"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>THE JOURNEY CONTINUES</span>
          </div>
          <h4 className="font-modern font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
            ACTIVE LAB EXPEDITIONS
          </h4>
          <p className="font-sans text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
            Team Pratyumnis is actively engineering and simulating autonomous mechanisms for the next ABU Robocon campaign.
          </p>
        </div>
      </div>
    </div>
  );
}