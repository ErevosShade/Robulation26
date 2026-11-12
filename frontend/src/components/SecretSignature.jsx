'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { X, Sparkles, Terminal, Code2, ShieldCheck, Heart } from 'lucide-react';

/**
 * SecretSignature Easter Egg Component
 * 
 * Secret Keystroke Trigger:
 * - Listens to global keydown events
 * - Automatically ignores typing inside inputs, textareas, selects, or contentEditable elements
 * - Triggers modal when user types the secret keyword (default: "erevos")
 * - Closes on Escape, clicking outside the modal, or on the close button
 * 
 * DevTools & DOM watermark:
 * - Logs styled console badge once per session
 * - Sets data-crafted-by watermark on document.documentElement
 */
export default function SecretSignature({ keyword = 'erevos' }) {
  const [isOpen, setIsOpen] = useState(false);
  const targetKey = keyword.toLowerCase();

  useEffect(() => {
    // 3. HTML DOM Watermark attribute
    try {
      document.documentElement.setAttribute('data-crafted-by', 'Erevos Team');
    } catch {
      // Ignore in non-browser/SSR environments
    }

    // 2. DevTools Console Badge
    if (typeof window !== 'undefined' && !window.__EREVOS_LOGGED__) {
      window.__EREVOS_LOGGED__ = true;
      console.log(
        '%c✦ ROBOLUTION 2026 %c Crafted with precision by Erevos Team ',
        'background: #020617; color: #38bdf8; font-weight: 800; font-family: monospace; font-size: 12px; padding: 6px 12px; border-left: 3px solid #38bdf8; border-radius: 3px;',
        'background: #0f172a; color: #e2e8f0; font-family: monospace; font-size: 11px; padding: 6px 10px; border-radius: 3px;'
      );
    }

    let buffer = '';

    const handleKeyDown = (e) => {
      // 1. Secret Keystroke Trigger: Ignore form elements & editable areas
      const activeElement = document.activeElement;
      if (activeElement) {
        const tagName = activeElement.tagName.toLowerCase();
        const isEditable = activeElement.isContentEditable;
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select' || isEditable) {
          return;
        }
      }

      // Close modal on Escape
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }

      // Ignore modifier keys
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      // Append character to buffer
      if (e.key && e.key.length === 1) {
        buffer = (buffer + e.key.toLowerCase()).slice(-targetKey.length);
        if (buffer === targetKey) {
          setIsOpen(true);
          buffer = '';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [targetKey]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signature-title"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={handleClose}
    >
      {/* Easter Egg Modal Card */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-sky-500/30 bg-[#040814]/95 p-6 sm:p-7 shadow-[0_0_50px_rgba(56,189,248,0.2)] transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 0 0 1px rgba(56,189,248,0.2), 0 20px 50px -10px rgba(0,0,0,0.8), 0 0 30px rgba(56,189,248,0.15)',
        }}
      >
        {/* Top Accent Gradient Border Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

        {/* Ambient Radial Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close signature modal"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-sky-400"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header telemetry badge */}
        <div className="flex items-center gap-2 mb-4 font-mono text-[10px] tracking-widest text-sky-400/90 uppercase">
          <Terminal className="w-3.5 h-3.5 text-sky-400" />
          <span>DECLASSIFIED // DEVELOPER SIGNATURE</span>
        </div>

        {/* Center Emblem */}
        <div className="flex flex-col items-center text-center my-3">
          <div className="relative mb-3 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-sky-500/20 to-sky-950/40 border border-sky-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.25)]">
              <Code2 className="w-8 h-8 text-sky-300" />
            </div>
            <div className="absolute -inset-1 rounded-2xl border border-sky-400/20 animate-pulse pointer-events-none" />
          </div>

          {/* Subtitle / Team Name */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-950/60 border border-sky-500/30 font-mono text-[10px] tracking-wider text-sky-300 mb-2">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>ROBOLUTION • EREVOS CORE LAB</span>
          </div>

          {/* Main Message */}
          <h3 id="signature-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2 mt-1">
            Made with <Heart className="w-5 h-5 text-rose-500 fill-rose-500 inline-block animate-pulse" /> by <span className="bg-gradient-to-r from-sky-300 via-white to-sky-400 bg-clip-text text-transparent">Erevos Team</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-300/80 mt-2.5 max-w-xs font-sans leading-relaxed">
            Crafted with high-kinetic aerospace telemetry, precision engineering, and love for robotics.
          </p>
        </div>

        {/* Footer Telemetry Status */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3 h-3" />
            <span>AUTHENTICATED KEY: &quot;{targetKey}&quot;</span>
          </span>
          <span className="text-slate-500">PRESS ESC TO CLOSE</span>
        </div>
      </div>
    </div>
  );
}
