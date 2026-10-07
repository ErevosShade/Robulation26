'use client';

import React from 'react';
import DecryptedText from '@/components/DecryptedText';

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
  title,
  subtitle,
  badge,
  description,
  children,
  compact = false,
}: HudBoxProps) {
  // =========================================================================
  // Compact HUD Box: EST. 2001 // BIT MESRA (Stepped Header Banner from sheet)
  // =========================================================================
  if (compact) {
    const compactPath = "M 8 40 L 8 16 L 20 4 L 70 4 L 78 0 L 176 0 L 184 4 L 276 4 L 276 40 L 190 40 L 184 36 L 80 36 L 74 40 Z";

    return (
      <div
        className={`relative select-none ${className}`}
        style={{
          filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.25)) drop-shadow(0 0 20px rgba(180, 200, 220, 0.12))',
        }}
      >
        <svg
          className="w-full h-full absolute inset-0 pointer-events-none"
          viewBox="0 0 280 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="silverGradCompact" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.80" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.70" />
            </linearGradient>
            <filter id="whiteGlowCompact" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="scanlineCompact" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.40)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Dark Glass Backdrop Fill */}
          <path d={compactPath} fill="rgba(6, 9, 14, 0.90)" />

          {/* Outer Frame Stroke */}
          <path
            d={compactPath}
            stroke="url(#silverGradCompact)"
            strokeWidth="1.6"
            fill="none"
            filter="url(#whiteGlowCompact)"
          />

          {/* Dual Faint Beams Streaming Through the Border */}
          <path
            d={compactPath}
            stroke="rgba(255, 255, 255, 0.55)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="60 220 60 220"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="560"
              to="0"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>

          {/* Interior Faint Laser Scanline */}
          <line x1="16" y1="10" x2="270" y2="10" stroke="url(#scanlineCompact)" strokeWidth="1" opacity="0.35">
            <animate attributeName="y1" values="8; 36; 8" dur="2.8s" repeatCount="indefinite" />
            <animate attributeName="y2" values="8; 36; 8" dur="2.8s" repeatCount="indefinite" />
          </line>

          {/* Raised Center Accent Plate */}
          <polygon points="78,0 84,4 170,4 176,0" fill="#ffffff" filter="url(#whiteGlowCompact)" />

          {/* Floating Accent Tick on Left Chamfer */}
          <line x1="6" y1="18" x2="18" y2="6" stroke="#ffffff" strokeWidth="1.4" opacity="0.8" />

          {/* Stepped Bottom Accent Bar */}
          <line x1="80" y1="36" x2="184" y2="36" stroke="#ffffff" strokeWidth="1.5" filter="url(#whiteGlowCompact)" />

          {/* Micro Tech Dots */}
          <circle cx="210" cy="36" r="1.6" fill="#ffffff">
            <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.2s" begin="0s" repeatCount="indefinite" />
          </circle>
          <circle cx="220" cy="36" r="1.6" fill="#ffffff">
            <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.2s" begin="0.25s" repeatCount="indefinite" />
          </circle>
          <circle cx="230" cy="36" r="1.6" fill="#ffffff">
            <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.2s" begin="0.5s" repeatCount="indefinite" />
          </circle>
        </svg>

        <div className="relative z-10 w-full h-full flex items-center justify-center px-6 py-2">
          {children ? (
            children
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] animate-pulse" />
              <span className="font-arcade text-[8px] sm:text-[9px] tracking-widest text-slate-100 uppercase">
                <DecryptedText
                  text={title || 'EST. 2001 // BIT MESRA'}
                  animateOn="view"
                  speed={35}
                  maxIterations={12}
                  sequential={true}
                  revealDirection="start"
                  characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
                  className="text-slate-100"
                  encryptedClassName="text-slate-500 opacity-60"
                />
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // Large HUD Boxes:
  // Variation A (Left HUD Box - Bottom-Left Widget in sheet, leader line on right)
  // Variation B (Right HUD Box - Bottom-Right Widget in sheet, leader line on left)
  // =========================================================================
  const isVariationB = variant === 'shape2';

  // Path A (Bottom-Left Widget in reference sheet):
  // Chamfered top-left, stepped raised top tab, chamfered bottom-right with double accent, stepped bottom notch
  const pathA = "M 16 140 L 16 46 L 46 16 L 76 16 L 82 10 L 200 10 L 206 16 L 344 16 L 344 112 L 316 140 L 156 140 L 150 134 L 86 134 L 80 140 Z";

  // Path B (Bottom-Right Widget in reference sheet):
  // Left bracket notch, chamfered top-left, hazard stripes top tab, chamfered right corners, stepped bottom notch
  const pathB = "M 82 140 L 82 104 L 90 104 L 90 64 L 82 64 L 82 50 L 116 16 L 386 16 L 404 34 L 404 122 L 388 140 L 324 140 L 318 134 L 198 134 L 192 140 Z";

  return (
    <div
      className={`relative select-none ${className} w-full h-full`}
      style={{
        filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.22)) drop-shadow(0 0 20px rgba(180, 200, 220, 0.10))',
      }}
    >
      {/* SVG Sci-Fi HUD Frame */}
      <svg
        className="w-full h-full absolute inset-0 pointer-events-none"
        viewBox="0 0 420 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="silverGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.75" />
          </linearGradient>
          <filter id="hudWhiteGlowRef" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="scanlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="25%" stopColor="rgba(255, 255, 255, 0.08)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.40)" />
            <stop offset="75%" stopColor="rgba(255, 255, 255, 0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {!isVariationB ? (
          /* ============================================================= */
          /* VARIATION A: Bottom-Left Widget (Leader Line points RIGHT to Rover) */
          /* ============================================================= */
          <>
            {/* Dark Glass Backdrop Fill */}
            <path d={pathA} fill="rgba(6, 9, 14, 0.90)" />

            {/* Outer Frame Stroke */}
            <path
              d={pathA}
              stroke="url(#silverGradMain)"
              strokeWidth="1.8"
              fill="none"
              filter="url(#hudWhiteGlowRef)"
            />

            {/* Dual Faint Laser Beams Streaming Continuously Through the Border */}
            <path
              d={pathA}
              stroke="rgba(255, 255, 255, 0.55)"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="90 350 90 350"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="880"
                to="0"
                dur="3.8s"
                repeatCount="indefinite"
              />
            </path>

            {/* Interior Faint Holographic Laser Scanline */}
            <line x1="20" y1="24" x2="340" y2="24" stroke="url(#scanlineGrad)" strokeWidth="1.2" opacity="0.35">
              <animate attributeName="y1" values="24; 134; 24" dur="3.8s" repeatCount="indefinite" />
              <animate attributeName="y2" values="24; 134; 24" dur="3.8s" repeatCount="indefinite" />
            </line>

            {/* Floating Outer Accent Line on Top-Left Chamfer (Signature Dual-Shell) */}
            <path
              d="M 100 8 L 42 8 L 10 40 L 10 78"
              stroke="#ffffff"
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />

            {/* Double Accent Line along Bottom-Right Chamfer */}
            <path
              d="M 350 108 L 318 140"
              stroke="#ffffff"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
              filter="url(#hudWhiteGlowRef)"
            />

            {/* Raised Top Solid Accent Bar */}
            <polygon
              points="82,10 88,6 194,6 200,10"
              fill="#ffffff"
              filter="url(#hudWhiteGlowRef)"
            />

            {/* Stepped Bottom Solid Accent Bar */}
            <polygon
              points="86,138 92,134 144,134 150,138"
              fill="#ffffff"
              filter="url(#hudWhiteGlowRef)"
            />

            {/* Bottom-Left 3 Micro Tech Dots */}
            <circle cx="26" cy="130" r="2" fill="#ffffff" />
            <circle cx="36" cy="130" r="2" fill="#ffffff" />
            <circle cx="46" cy="130" r="2" fill="#ffffff" />

            {/* Leader Line (originates right edge, bends down-right towards Rover) */}
            <path
              d="M 344 84 L 372 84 L 406 118"
              stroke="#ffffff"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Terminal Target Reticle */}
            <circle cx="406" cy="118" r="5.5" stroke="#ffffff" strokeWidth="1.4" fill="none" />
            <circle cx="406" cy="118" r="2.2" fill="#ffffff" filter="url(#hudWhiteGlowRef)">
              <animate attributeName="r" values="2; 2.6; 2" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </>
        ) : (
          /* ============================================================= */
          /* VARIATION B: Bottom-Right Widget (Leader Line points LEFT to Rover) */
          /* ============================================================= */
          <>
            {/* Dark Glass Backdrop Fill */}
            <path d={pathB} fill="rgba(6, 9, 14, 0.90)" />

            {/* Outer Frame Stroke */}
            <path
              d={pathB}
              stroke="url(#silverGradMain)"
              strokeWidth="1.8"
              fill="none"
              filter="url(#hudWhiteGlowRef)"
            />

            {/* Dual Faint Laser Beams Streaming Continuously Through the Border */}
            <path
              d={pathB}
              stroke="rgba(255, 255, 255, 0.55)"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="90 350 90 350"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="880"
                to="0"
                dur="3.8s"
                repeatCount="indefinite"
              />
            </path>

            {/* Interior Faint Holographic Laser Scanline */}
            <line x1="90" y1="24" x2="396" y2="24" stroke="url(#scanlineGrad)" strokeWidth="1.2" opacity="0.35">
              <animate attributeName="y1" values="24; 134; 24" dur="3.8s" repeatCount="indefinite" />
              <animate attributeName="y2" values="24; 134; 24" dur="3.8s" repeatCount="indefinite" />
            </line>

            {/* Floating Outer Accent Line on Top-Left Slanted Chamfer */}
            <path
              d="M 76 54 L 112 18 L 170 18"
              stroke="#ffffff"
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />

            {/* Top Accent Tab Plate */}
            <polygon
              points="204,16 212,8 296,8 304,16"
              fill="#ffffff"
              filter="url(#hudWhiteGlowRef)"
            />

            {/* 3 Diagonal Hazard Stripes (///) with Sequential Pulsing Glow */}
            <polygon points="222,15 228,9 236,9 230,15" fill="#ffffff">
              <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.6s" begin="0s" repeatCount="indefinite" />
            </polygon>
            <polygon points="238,15 244,9 252,9 246,15" fill="#ffffff">
              <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.6s" begin="0.3s" repeatCount="indefinite" />
            </polygon>
            <polygon points="254,15 260,9 268,9 262,15" fill="#ffffff">
              <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.6s" begin="0.6s" repeatCount="indefinite" />
            </polygon>

            {/* Inset Bracket Notch Pip on Left Edge */}
            <rect x="84" y="81" width="4" height="6" fill="#ffffff" filter="url(#hudWhiteGlowRef)" />

            {/* Floating Bottom Solid Accent Bar */}
            <polygon
              points="198,138 204,134 312,134 318,138"
              fill="#ffffff"
              filter="url(#hudWhiteGlowRef)"
            />

            {/* Bottom-Right 3 Micro Tech Dots */}
            <circle cx="348" cy="130" r="2" fill="#ffffff" />
            <circle cx="358" cy="130" r="2" fill="#ffffff" />
            <circle cx="368" cy="130" r="2" fill="#ffffff" />

            {/* Leader Line (originates left edge, bends down-left towards Rover) */}
            <path
              d="M 82 84 L 54 84 L 20 118"
              stroke="#ffffff"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Terminal Target Reticle */}
            <circle cx="20" cy="118" r="5.5" stroke="#ffffff" strokeWidth="1.4" fill="none" />
            <circle cx="20" cy="118" r="2.2" fill="#ffffff" filter="url(#hudWhiteGlowRef)">
              <animate attributeName="r" values="2; 2.6; 2" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </svg>

      {/* Content Area Inside the HUD Box - Clean Safe Area Position with rightward text shift */}
      <div
        className={`absolute top-[22px] bottom-[18px] flex flex-col justify-center pointer-events-auto overflow-hidden text-left ${
          !isVariationB
            ? 'left-[36px] sm:left-[42px] right-[76px] sm:right-[88px]'
            : 'left-[102px] sm:left-[114px] xl:left-[120px] right-[16px] sm:right-[22px]'
        }`}
      >
        {badge && (
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] animate-pulse" />
            <span className="font-arcade text-[7px] sm:text-[8px] tracking-widest uppercase text-slate-300">
              <DecryptedText
                text={badge}
                animateOn="view"
                speed={35}
                maxIterations={10}
                sequential={true}
                revealDirection="start"
                characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
                className="text-slate-300"
                encryptedClassName="text-slate-500 opacity-60"
              />
            </span>
          </div>
        )}

        {title && (
          <h3 className="font-arcade text-[9px] sm:text-[10.5px] tracking-wider uppercase text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] leading-snug">
            <DecryptedText
              text={title}
              animateOn="view"
              speed={30}
              maxIterations={14}
              sequential={true}
              revealDirection="start"
              characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
              className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
              encryptedClassName="text-slate-400 opacity-60"
            />
          </h3>
        )}

        {subtitle && (
          <p className="font-arcade text-[7px] sm:text-[8px] tracking-wide text-slate-300 mt-1 leading-snug">
            <DecryptedText
              text={subtitle}
              animateOn="view"
              speed={25}
              maxIterations={12}
              sequential={true}
              revealDirection="start"
              characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
              className="text-slate-300"
              encryptedClassName="text-slate-500 opacity-60"
            />
          </p>
        )}

        {description && (
          <p className="font-arcade text-[6px] sm:text-[7px] tracking-normal text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
            <DecryptedText
              text={description}
              animateOn="view"
              speed={20}
              maxIterations={10}
              sequential={false}
              characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
              className="text-slate-400"
              encryptedClassName="text-slate-600 opacity-50"
            />
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
