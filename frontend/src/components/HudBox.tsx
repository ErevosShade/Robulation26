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
  theme?: 'light' | 'dark';
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
  theme = 'dark',
}: HudBoxProps) {
  const isLight = theme === 'light';

  // =========================================================================
  // Compact HUD Box: EST. 2001 // BIT MESRA
  // =========================================================================
  if (compact) {
    const compactPath = "M 8 40 L 8 16 L 20 4 L 70 4 L 78 0 L 176 0 L 184 4 L 276 4 L 276 40 L 190 40 L 184 36 L 80 36 L 74 40 Z";

    return (
      <div
        className={`relative select-none ${className}`}
        style={{
          filter: isLight
            ? 'drop-shadow(0 4px 14px rgba(15, 23, 42, 0.08)) drop-shadow(0 1px 2px rgba(15, 23, 42, 0.05))'
            : 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.25)) drop-shadow(0 0 20px rgba(180, 200, 220, 0.12))',
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
              <stop offset="0%" stopColor={isLight ? "#0284c7" : "#ffffff"} stopOpacity={isLight ? "0.9" : "0.95"} />
              <stop offset="50%" stopColor={isLight ? "#94a3b8" : "#e2e8f0"} stopOpacity="0.80" />
              <stop offset="100%" stopColor={isLight ? "#cbd5e1" : "#94a3b8"} stopOpacity="0.70" />
            </linearGradient>
            <filter id="glowCompact" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation={isLight ? "1" : "1.5"} result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="scanlineCompact" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor={isLight ? "rgba(2, 132, 199, 0.4)" : "rgba(255, 255, 255, 0.40)"} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Glass Backdrop Fill */}
          <path d={compactPath} fill={isLight ? "rgba(255, 255, 255, 0.92)" : "rgba(6, 9, 14, 0.65)"} />

          {/* Outer Frame Stroke */}
          <path
            d={compactPath}
            stroke="url(#silverGradCompact)"
            strokeWidth="1.6"
            fill="none"
            filter="url(#glowCompact)"
          />

          {/* Dual Beams Streaming Through the Border */}
          <path
            d={compactPath}
            stroke={isLight ? "rgba(2, 132, 199, 0.75)" : "rgba(255, 255, 255, 0.55)"}
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
          <line x1="16" y1="10" x2="270" y2="10" stroke="url(#scanlineCompact)" strokeWidth="1" opacity="0.45">
            <animate attributeName="y1" values="8; 36; 8" dur="2.8s" repeatCount="indefinite" />
            <animate attributeName="y2" values="8; 36; 8" dur="2.8s" repeatCount="indefinite" />
          </line>

          {/* Raised Center Accent Plate */}
          <polygon
            points="78,0 84,4 170,4 176,0"
            fill={isLight ? "#0284c7" : "#ffffff"}
            filter="url(#glowCompact)"
          />

          {/* Floating Accent Tick on Left Chamfer */}
          <line
            x1="6"
            y1="18"
            x2="18"
            y2="6"
            stroke={isLight ? "#0284c7" : "#ffffff"}
            strokeWidth="1.4"
            opacity="0.9"
          />

          {/* Stepped Bottom Accent Bar */}
          <line
            x1="80"
            y1="36"
            x2="184"
            y2="36"
            stroke={isLight ? "#0284c7" : "#ffffff"}
            strokeWidth="1.5"
            filter="url(#glowCompact)"
          />

          {/* Micro Tech Dots */}
          <circle cx="210" cy="36" r="1.6" fill={isLight ? "#0284c7" : "#ffffff"}>
            <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.2s" begin="0s" repeatCount="indefinite" />
          </circle>
          <circle cx="220" cy="36" r="1.6" fill={isLight ? "#0284c7" : "#ffffff"}>
            <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.2s" begin="0.25s" repeatCount="indefinite" />
          </circle>
          <circle cx="230" cy="36" r="1.6" fill={isLight ? "#0284c7" : "#ffffff"}>
            <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.2s" begin="0.5s" repeatCount="indefinite" />
          </circle>
        </svg>

        <div className="relative z-10 w-full h-full flex items-center justify-center px-6 py-2">
          {children ? (
            children
          ) : (
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]' : 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]'} animate-pulse`} />
              <span className={`font-modern text-[9.5px] sm:text-[10.5px] font-bold tracking-widest ${isLight ? 'text-slate-800' : 'text-slate-100'} uppercase`}>
                <DecryptedText
                  text={title || 'EST. 2001 // BIT MESRA'}
                  animateOn="view"
                  speed={35}
                  maxIterations={12}
                  sequential={true}
                  revealDirection="start"
                  characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
                  className={isLight ? "text-slate-800" : "text-slate-100"}
                  encryptedClassName={isLight ? "text-slate-400 opacity-60" : "text-slate-500 opacity-60"}
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
  // Variation A (Left HUD Box - Leader Line points RIGHT to Robot)
  // Variation B (Right HUD Box - Leader Line points LEFT to Robot)
  // =========================================================================
  const isVariationB = variant === 'shape2';

  const pathA = "M 16 140 L 16 46 L 46 16 L 76 16 L 82 10 L 200 10 L 206 16 L 344 16 L 344 112 L 316 140 L 156 140 L 150 134 L 86 134 L 80 140 Z";
  const pathB = "M 82 140 L 82 104 L 90 104 L 90 64 L 82 64 L 82 50 L 116 16 L 386 16 L 404 34 L 404 122 L 388 140 L 324 140 L 318 134 L 198 134 L 192 140 Z";

  const accentColor = isLight ? "#0284c7" : "#ffffff";

  return (
    <div
      className={`relative select-none ${className} w-full h-full`}
      style={{
        filter: isLight
          ? 'drop-shadow(0 10px 25px rgba(15, 23, 42, 0.08)) drop-shadow(0 2px 5px rgba(15, 23, 42, 0.04))'
          : 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.22)) drop-shadow(0 0 20px rgba(180, 200, 220, 0.10))',
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
          <linearGradient id="hudGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? "#0284c7" : "#ffffff"} stopOpacity={isLight ? "0.9" : "0.95"} />
            <stop offset="50%" stopColor={isLight ? "#94a3b8" : "#e2e8f0"} stopOpacity="0.85" />
            <stop offset="100%" stopColor={isLight ? "#cbd5e1" : "#94a3b8"} stopOpacity="0.75" />
          </linearGradient>
          <filter id="hudGlowRef" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={isLight ? "1" : "2"} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="scanlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="25%" stopColor={isLight ? "rgba(2, 132, 199, 0.1)" : "rgba(255, 255, 255, 0.08)"} />
            <stop offset="50%" stopColor={isLight ? "rgba(2, 132, 199, 0.35)" : "rgba(255, 255, 255, 0.40)"} />
            <stop offset="75%" stopColor={isLight ? "rgba(2, 132, 199, 0.1)" : "rgba(255, 255, 255, 0.08)"} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {!isVariationB ? (
          /* ============================================================= */
          /* VARIATION A: Bottom-Left Widget (Leader Line points RIGHT)    */
          /* ============================================================= */
          <>
            {/* Glass Backdrop Fill */}
            <path d={pathA} fill={isLight ? "rgba(255, 255, 255, 0.94)" : "rgba(6, 9, 14, 0.65)"} />

            {/* Outer Frame Stroke */}
            <path
              d={pathA}
              stroke="url(#hudGradMain)"
              strokeWidth="1.8"
              fill="none"
              filter="url(#hudGlowRef)"
            />

            {/* Dual Laser Beams Streaming Continuously Through Border */}
            <path
              d={pathA}
              stroke={isLight ? "rgba(2, 132, 199, 0.75)" : "rgba(255, 255, 255, 0.55)"}
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

            {/* Interior Laser Scanline */}
            <line x1="20" y1="24" x2="340" y2="24" stroke="url(#scanlineGrad)" strokeWidth="1.2" opacity="0.45">
              <animate attributeName="y1" values="24; 134; 24" dur="3.8s" repeatCount="indefinite" />
              <animate attributeName="y2" values="24; 134; 24" dur="3.8s" repeatCount="indefinite" />
            </line>

            {/* Floating Outer Accent Line on Top-Left Chamfer */}
            <path
              d="M 100 8 L 42 8 L 10 40 L 10 78"
              stroke={accentColor}
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />

            {/* Double Accent Line along Bottom-Right Chamfer */}
            <path
              d="M 350 108 L 318 140"
              stroke={accentColor}
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
              filter="url(#hudGlowRef)"
            />

            {/* Raised Top Solid Accent Bar */}
            <polygon
              points="82,10 88,6 194,6 200,10"
              fill={accentColor}
              filter="url(#hudGlowRef)"
            />

            {/* Stepped Bottom Solid Accent Bar */}
            <polygon
              points="86,138 92,134 144,134 150,138"
              fill={accentColor}
              filter="url(#hudGlowRef)"
            />

            {/* Bottom-Left 3 Micro Tech Dots */}
            <circle cx="26" cy="130" r="2" fill={accentColor} />
            <circle cx="36" cy="130" r="2" fill={accentColor} />
            <circle cx="46" cy="130" r="2" fill={accentColor} />

            {/* Leader Line (points right to Robot) */}
            <path
              d="M 344 84 L 372 84 L 406 118"
              stroke={accentColor}
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Terminal Target Reticle */}
            <circle cx="406" cy="118" r="5.5" stroke={accentColor} strokeWidth="1.4" fill="none" />
            <circle cx="406" cy="118" r="2.2" fill={accentColor} filter="url(#hudGlowRef)">
              <animate attributeName="r" values="2; 2.6; 2" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </>
        ) : (
          /* ============================================================= */
          /* VARIATION B: Bottom-Right Widget (Leader Line points LEFT)     */
          /* ============================================================= */
          <>
            {/* Glass Backdrop Fill */}
            <path d={pathB} fill={isLight ? "rgba(255, 255, 255, 0.94)" : "rgba(6, 9, 14, 0.65)"} />

            {/* Outer Frame Stroke */}
            <path
              d={pathB}
              stroke="url(#hudGradMain)"
              strokeWidth="1.8"
              fill="none"
              filter="url(#hudGlowRef)"
            />

            {/* Dual Laser Beams Streaming Continuously Through Border */}
            <path
              d={pathB}
              stroke={isLight ? "rgba(2, 132, 199, 0.75)" : "rgba(255, 255, 255, 0.55)"}
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

            {/* Interior Laser Scanline */}
            <line x1="90" y1="24" x2="396" y2="24" stroke="url(#scanlineGrad)" strokeWidth="1.2" opacity="0.45">
              <animate attributeName="y1" values="24; 134; 24" dur="3.8s" repeatCount="indefinite" />
              <animate attributeName="y2" values="24; 134; 24" dur="3.8s" repeatCount="indefinite" />
            </line>

            {/* Floating Outer Accent Line on Top-Left Slanted Chamfer */}
            <path
              d="M 76 54 L 112 18 L 170 18"
              stroke={accentColor}
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />

            {/* Top Accent Tab Plate */}
            <polygon
              points="204,16 212,8 296,8 304,16"
              fill={accentColor}
              filter="url(#hudGlowRef)"
            />

            {/* 3 Diagonal Hazard Stripes (///) */}
            <polygon points="222,15 228,9 236,9 230,15" fill={accentColor}>
              <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.6s" begin="0s" repeatCount="indefinite" />
            </polygon>
            <polygon points="238,15 244,9 252,9 246,15" fill={accentColor}>
              <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.6s" begin="0.3s" repeatCount="indefinite" />
            </polygon>
            <polygon points="254,15 260,9 268,9 262,15" fill={accentColor}>
              <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.6s" begin="0.6s" repeatCount="indefinite" />
            </polygon>

            {/* Inset Bracket Notch Pip on Left Edge */}
            <rect x="84" y="81" width="4" height="6" fill={accentColor} filter="url(#hudGlowRef)" />

            {/* Floating Bottom Solid Accent Bar */}
            <polygon
              points="198,138 204,134 312,134 318,138"
              fill={accentColor}
              filter="url(#hudGlowRef)"
            />

            {/* Bottom-Right 3 Micro Tech Dots */}
            <circle cx="348" cy="130" r="2" fill={accentColor} />
            <circle cx="358" cy="130" r="2" fill={accentColor} />
            <circle cx="368" cy="130" r="2" fill={accentColor} />

            {/* Leader Line (points left to Robot) */}
            <path
              d="M 82 84 L 54 84 L 20 118"
              stroke={accentColor}
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Terminal Target Reticle */}
            <circle cx="20" cy="118" r="5.5" stroke={accentColor} strokeWidth="1.4" fill="none" />
            <circle cx="20" cy="118" r="2.2" fill={accentColor} filter="url(#hudGlowRef)">
              <animate attributeName="r" values="2; 2.6; 2" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </svg>

      {/* Content Area Inside HUD Box */}
      <div
        className={`absolute top-[22px] bottom-[18px] flex flex-col justify-center pointer-events-auto overflow-visible text-left ${
          !isVariationB
            ? 'left-[36px] sm:left-[42px] right-[76px] sm:right-[88px]'
            : 'left-[102px] sm:left-[114px] xl:left-[120px] right-[16px] sm:right-[22px]'
        }`}
      >
        {badge && (
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-cyan-600 shadow-[0_0_6px_rgba(2,132,199,0.7)]' : 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]'} animate-pulse`} />
            <span className={`font-modern text-[8px] sm:text-[9px] font-bold tracking-widest uppercase ${isLight ? 'text-cyan-700' : 'text-slate-300'}`}>
              <DecryptedText
                text={badge}
                animateOn="view"
                speed={35}
                maxIterations={10}
                sequential={true}
                revealDirection="start"
                characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
                className={isLight ? "text-cyan-700" : "text-slate-300"}
                encryptedClassName={isLight ? "text-slate-400 opacity-60" : "text-slate-500 opacity-60"}
              />
            </span>
          </div>
        )}

        {title && (
          <h3 className={`font-modern text-[12px] sm:text-[13.5px] font-extrabold tracking-wider uppercase ${isLight ? 'text-slate-950' : 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.45)]'} leading-snug`}>
            <DecryptedText
              text={title}
              animateOn="view"
              speed={30}
              maxIterations={14}
              sequential={true}
              revealDirection="start"
              characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
              className={isLight ? "text-slate-950" : "text-white"}
              encryptedClassName={isLight ? "text-slate-400 opacity-60" : "text-slate-400 opacity-60"}
            />
          </h3>
        )}

        {subtitle && (
          <p className={`font-modern text-[9px] sm:text-[10px] font-bold tracking-wider ${isLight ? 'text-cyan-600' : 'text-slate-300'} uppercase mt-0.5 leading-snug`}>
            <DecryptedText
              text={subtitle}
              animateOn="view"
              speed={25}
              maxIterations={12}
              sequential={true}
              revealDirection="start"
              characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
              className={isLight ? "text-cyan-600" : "text-slate-300"}
              encryptedClassName={isLight ? "text-slate-400 opacity-60" : "text-slate-500 opacity-60"}
            />
          </p>
        )}

        {description && (
          <p className={`font-modern text-[8.5px] sm:text-[9.5px] font-medium tracking-wide ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1 leading-relaxed line-clamp-2`}>
            <DecryptedText
              text={description}
              animateOn="view"
              speed={20}
              maxIterations={10}
              sequential={false}
              characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
              className={isLight ? "text-slate-600" : "text-slate-400"}
              encryptedClassName={isLight ? "text-slate-400 opacity-50" : "text-slate-600 opacity-50"}
            />
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
