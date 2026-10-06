'use client';

import React from 'react';

export type HudBoxVariant = 'shape1' | 'shape2' | 'shape3' | 'shape4' | 'shape5' | 'shape6';

interface HudBoxProps {
  variant?: HudBoxVariant;
  className?: string;
  leaderSide?: 'left' | 'right';
  title?: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  children?: React.ReactNode;
  compact?: boolean;
}

export default function HudBox({
  variant = 'shape1',
  className = '',
  leaderSide = 'left',
  title,
  subtitle,
  badge,
  description,
  children,
  compact = false,
}: HudBoxProps) {
  const isRight = leaderSide === 'right';

  if (compact) {
    return (
      <div
        className={`relative select-none ${className}`}
        style={{
          filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.2))',
        }}
      >
        <svg
          className={`w-full h-full absolute inset-0 pointer-events-none ${
            isRight ? 'scale-x-[-1]' : ''
          }`}
          viewBox="0 0 280 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="silverGlowCompact" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="silverInnerCompact" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          {/* Backdrop Fill */}
          <path
            d="M 28 6 L 272 6 L 272 32 L 262 40 L 36 40 L 28 32 Z"
            fill="rgba(6, 9, 14, 0.85)"
          />
          {/* Outer Border */}
          <path
            d="M 28 6 L 272 6 L 272 32 L 262 40 L 36 40 L 28 32 Z"
            stroke="url(#silverGlowCompact)"
            strokeWidth="1.6"
            
          />
          {/* Tracer Animation Line */}
          <path
            d="M 28 6 L 272 6 L 272 32 L 262 40 L 36 40 L 28 32 Z"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="1.5"
            fill="none"
            
            pathLength="100"
            strokeDasharray="15 85"
            className="animate-svg-tracer"
          />
          {/* Inner Accent Line */}
          <path
            d="M 33 11 L 267 11 L 267 29 L 259 35 L 39 35 L 33 29 Z"
            stroke="url(#silverInnerCompact)"
            strokeWidth="1"
            
          />
          {/* Left Runner Line with Dot Terminal */}
          <path
            d="M 28 32 L 14 32 L 6 32"
            stroke="#ffffff"
            strokeWidth="1.4"
            
          />
          <circle cx="5" cy="32" r="3" fill="#ffffff" />
          <circle cx="5" cy="32" r="1.2" fill="#000000" />
        </svg>

        <div className="relative z-10 w-full h-full flex items-center justify-center px-6 py-2">
          {children ? (
            children
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] animate-pulse" />
              <span className="font-arcade text-[8px] sm:text-[9px] tracking-widest text-slate-200 uppercase">
                {title || 'EST. 2001 // BIT MESRA'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative select-none ${className} w-full h-full`}
      style={{
        filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.18)) drop-shadow(0 0 16px rgba(180, 200, 220, 0.08))',
      }}
    >
      {/* SVG Sci-Fi HUD Frame */}
      <svg
        className={`w-full h-full absolute inset-0 pointer-events-none ${
          isRight ? 'scale-x-[-1]' : ''
        }`}
        viewBox="0 0 400 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        overflow="visible"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={`silverGrad_${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id={`silverInner_${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.45" />
          </linearGradient>
          <filter id="hudWhiteGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {variant === 'shape1' && (
          <>
            {/* Dark glass backdrop fill */}
            <path
              d="M 30 32 L 60 5 L 396 5 L 396 130 L 170 130 L 160 120 L 130 120 L 120 130 L 60 130 L 30 100 Z"
              fill="rgba(6, 9, 14, 0.86)"
            />
            {/* Outer HUD Border */}
            <path
              d="M 30 32 L 60 5 L 396 5 L 396 130 L 170 130 L 160 120 L 130 120 L 120 130 L 60 130 L 30 100 Z"
              stroke={`url(#silverGrad_${variant})`}
              strokeWidth="2"
              
              filter="url(#hudWhiteGlow)"
            />
            {/* Tracer Animation Line */}
            <path
              d="M 30 32 L 60 5 L 396 5 L 396 130 L 170 130 L 160 120 L 130 120 L 120 130 L 60 130 L 30 100 Z"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="1.5"
              fill="none"
              
              pathLength="100"
              strokeDasharray="15 85"
              className="animate-svg-tracer"
            />
            {/* Inner Accent Line */}
            <path
              d="M 38 34 L 64 12 L 388 12 L 388 122 L 174 122 L 164 112 L 126 112 L 116 122 L 64 122 L 38 96 Z"
              stroke={`url(#silverInner_${variant})`}
              strokeWidth="1"
              
            />
            {/* Leader Callout Line with Dot Terminal */}
            <path
              d="M 30 100 L 10 120 L 0 120"
              stroke="#ffffff"
              strokeWidth="1.6"
              
            />
            <circle cx="5" cy="120" r="3.5" fill="#ffffff" filter="url(#hudWhiteGlow)" />
            <circle cx="5" cy="120" r="1.5" fill="#000000" />
          </>
        )}

        {variant === 'shape2' && (
          <>
            {/* Dark glass backdrop fill */}
            <path
              d="M 30 5 L 396 5 L 396 100 L 386 110 L 396 120 L 396 140 L 70 140 L 30 100 Z"
              fill="rgba(6, 9, 14, 0.86)"
            />
            {/* Outer HUD Border */}
            <path
              d="M 30 5 L 396 5 L 396 100 L 386 110 L 396 120 L 396 140 L 70 140 L 30 100 Z"
              stroke={`url(#silverGrad_${variant})`}
              strokeWidth="2"
              
              filter="url(#hudWhiteGlow)"
            />
            {/* Tracer Animation Line */}
            <path
              d="M 30 5 L 396 5 L 396 100 L 386 110 L 396 120 L 396 140 L 70 140 L 30 100 Z"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="1.5"
              fill="none"
              
              pathLength="100"
              strokeDasharray="15 85"
              className="animate-svg-tracer"
            />
            {/* Inner Accent Line */}
            <path
              d="M 38 12 L 388 12 L 388 96 L 378 106 L 388 116 L 388 132 L 74 132 L 38 96 Z"
              stroke={`url(#silverInner_${variant})`}
              strokeWidth="1"
              
            />
            {/* Leader Callout Line with Dot Terminal */}
            <path
              d="M 30 100 L 10 120 L 0 120"
              stroke="#ffffff"
              strokeWidth="1.6"
              
            />
            <circle cx="5" cy="120" r="3.5" fill="#ffffff" filter="url(#hudWhiteGlow)" />
            <circle cx="5" cy="120" r="1.5" fill="#000000" />
          </>
        )}
      </svg>

      {/* Content Area Inside the HUD Box - Clean Safe Area Position */}
      <div
        className={`absolute top-[13px] bottom-[10px] flex flex-col justify-start pointer-events-auto overflow-hidden ${
          isRight
            ? 'left-[16px] right-[48px] items-start text-left'
            : 'left-[48px] right-[16px] items-start text-left'
        }`}
      >
        {badge && (
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] animate-pulse" />
            <span className="font-arcade text-[7px] sm:text-[8px] tracking-widest uppercase text-slate-400">
              {badge}
            </span>
          </div>
        )}

        {title && (
          <h3 className="font-arcade text-[9px] sm:text-[11px] tracking-wider uppercase text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] leading-snug">
            {title}
          </h3>
        )}

        {subtitle && (
          <p className="font-arcade text-[7.5px] sm:text-[8.5px] tracking-wide text-slate-300 mt-1 leading-snug">
            {subtitle}
          </p>
        )}

        {description && (
          <p className="font-arcade text-[6.5px] sm:text-[7.5px] tracking-normal text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
