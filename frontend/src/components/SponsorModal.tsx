'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Award,
  Mail,
  Phone,
  ChevronDown,
  ArrowUpRight
} from 'lucide-react';

interface SponsorModalProps {
  className?: string;
}

export default function SponsorModal({ className = '' }: SponsorModalProps) {
  const [isHovered, setIsHovered] = useState(false);

  const clubProfilePdf = encodeURI('/sponsors/Sponsorship deck/club_profile.pdf');
  const sponsorshipTiersPdf = encodeURI('/sponsors/Sponsorship deck/Partnership Proposal.pdf');

  // Exact HudBox compact path
  const compactPath = "M 8 40 L 8 16 L 20 4 L 70 4 L 78 0 L 176 0 L 184 4 L 276 4 L 276 40 L 190 40 L 184 36 L 80 36 L 74 40 Z";

  return (
    <div
      className={`relative select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Main Trigger 1:1 with compact HudBox ── */}
      <button
        type="button"
        onClick={() => setIsHovered(prev => !prev)}
        className="relative w-[230px] sm:w-[250px] md:w-[260px] h-[42px] sm:h-[48px] block cursor-pointer group focus:outline-none"
        style={{
          filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.25)) drop-shadow(0 0 20px rgba(180, 200, 220, 0.12))',
        }}
        aria-label="Sponsor Us options"
        aria-expanded={isHovered}
      >
        <svg
          className="w-full h-full absolute inset-0 pointer-events-none transition-all duration-300 group-hover:brightness-125"
          viewBox="0 0 280 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="silverGradSponsor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.80" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.70" />
            </linearGradient>
            <filter id="glowSponsor" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Glass Backdrop Fill */}
          <path d={compactPath} fill="rgba(6, 9, 14, 0.65)" />

          {/* Outer Frame Stroke */}
          <path
            d={compactPath}
            stroke="url(#silverGradSponsor)"
            strokeWidth="1.6"
            fill="none"
            filter="url(#glowSponsor)"
          />

          {/* Raised Center Accent Plate */}
          <polygon
            points="78,0 84,4 170,4 176,0"
            fill="#ffffff"
            filter="url(#glowSponsor)"
          />

          {/* Floating Accent Tick on Left Chamfer */}
          <line
            x1="6"
            y1="18"
            x2="18"
            y2="6"
            stroke="#ffffff"
            strokeWidth="1.4"
            opacity="0.9"
          />

          {/* Stepped Bottom Accent Bar */}
          <line
            x1="80"
            y1="36"
            x2="184"
            y2="36"
            stroke="#ffffff"
            strokeWidth="1.5"
            filter="url(#glowSponsor)"
          />

          {/* Micro Tech Dots */}
          <circle cx="210" cy="36" r="1.6" fill="#ffffff" opacity="0.75" />
          <circle cx="220" cy="36" r="1.6" fill="#ffffff" opacity="0.75" />
          <circle cx="230" cy="36" r="1.6" fill="#ffffff" opacity="0.75" />
        </svg>

        {/* Content: clean typography matching the top-right box without blue dots */}
        <div className="relative z-10 w-full h-full flex items-center justify-center px-6 py-2">
          <div className="flex items-center gap-2">
            <span className="font-modern text-[9.5px] sm:text-[10.5px] font-bold tracking-widest text-slate-100 uppercase group-hover:text-white transition-colors">
              SPONSOR US
            </span>
            <span className="inline-block w-1 h-1 rounded-full bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.6)] shrink-0" aria-hidden="true" />
            <span className="font-modern text-[9.5px] sm:text-[10.5px] font-bold tracking-widest text-slate-100 uppercase group-hover:text-white transition-colors flex items-center gap-1">
              <span>TIERS</span>
              <ChevronDown
                className={`w-3 h-3 text-slate-400 group-hover:text-white transition-transform duration-200 ${
                  isHovered ? 'rotate-180' : ''
                }`}
              />
            </span>
          </div>
        </div>
      </button>

      {/* ── Hover Dropdown Panel ── */}
      <div
        className={`absolute left-0 top-full pt-2 z-50 w-[240px] sm:w-[260px] transition-all duration-200 ${
          isHovered
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
      >
        <div className="p-2 rounded-xl bg-[#040813]/95 border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-xl flex flex-col gap-1.5">
          {/* Header without double slashes */}
          <div className="px-2 py-1 flex items-center justify-between border-b border-white/10 text-[9px] font-mono uppercase tracking-widest text-slate-400">
            <span>PARTNERSHIP DECK</span>
            <span className="text-slate-200 font-bold">BIT MESRA</span>
          </div>

          {/* Button 1: Club Profile */}
          <a
            href={clubProfilePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-white/30 text-slate-200 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-modern font-bold text-xs uppercase tracking-wider">
                Club Profile
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Button 2: Sponsorship Tiers */}
          <a
            href={sponsorshipTiersPdf}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-white/30 text-slate-200 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-modern font-bold text-xs uppercase tracking-wider">
                Sponsorship Tiers
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Button 3: Contact Us */}
          <Link
            href="/contact"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-white/30 text-slate-200 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-modern font-bold text-xs uppercase tracking-wider">
                Contact Us
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          {/* Quick Direct Telemetry: Phone & Mail */}
          <div className="pt-2 mt-1 border-t border-white/10 flex flex-col gap-1.5 px-2 text-[10px] font-mono text-slate-400">
            <a
              href="tel:+918235494988"
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>+91 8235494988</span>
            </a>
            <a
              href="mailto:pratyunmis@bitmesra.ac.in"
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors truncate"
            >
              <Mail className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="truncate">pratyunmis@bitmesra.ac.in</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
