---
trigger: always_on
description: Mandatory frontend design standards to eliminate AI slop and ensure high-craft, bespoke UI.
---

# Anti-AI Slop Frontend Design Rules

## 1. Eliminate "AI Slop" Tropes
- **NEVER** use generic purple-on-black linear gradient cards or centered purple glow blobs with no functional justification.
- **NEVER** build repetitive 3-column feature cards with generic Lucide icons and placeholder buzzwords ("Fast, Secure, Scalable").
- **NEVER** rely on default Tailwind border-radii (`rounded-2xl`) and lazy drop-shadows as a substitute for real art direction.
- **NEVER** create cookie-cutter SaaS landing pages for unique projects. For Robolution / robotics & aerospace, treat the UI like a precision NASA/JPL telemetry console, aerospace HUD, and mission control interface.

## 2. Aesthetic Architecture for Robolution
- **Theme**: Aerospace telemetry, precision mechatronics, CAD wireframe schematics, and deep-space mission control.
- **Palette**: Deep cosmic obsidian/void (`#020408`, `#050a16`), star-white highlights (`#ffffff`), celestial ice-blue/cyan accents (`#38bdf8`, `#bae6fd`), and deep atmospheric indigo/ultraviolet undertones.
- **Form Language**: Stepped chamfers, technical notches, diagonal hazard ticks (`///`), leader lines with targeting reticles, and SVG clip-paths rather than plain rounded rectangles.
- **Typography**: Dual-scale hierarchy. Heavy structural geometric headings paired with high-density monospace telemetry indicators and uppercase tracked labels (`tracking-widest`).

## 3. Motion & Animation Standards
- **Intentional Kinetics**: Animations must feel mechanical and calibrated, not floaty or cartoonish.
- **Layered Depth**: Combine slow celestial background drift (starfield, telemetry rings) with responsive cursor-tracking parallax on focal 3D/CAD elements.
- **Micro-Interactions**: Use decrypt text sequences, laser scanline sweeps, active pip indicators, and tactile button spring states on user interaction.
- **Performance First**: Animate `transform` and `opacity` only. Keep canvas loops at 60fps with devicePixelRatio capping (max 2).

## 4. Component Craftsmanship
- Build bespoke SVG frame overlays with gradient strokes and glow filters (`drop-shadow`, `feGaussianBlur`).
- Avoid bloated third-party template libraries when custom SVG + CSS achieves a unique, high-performance aesthetic.
- Preserve full responsive adaptability: ensure HUD callouts and dock panels reformat cleanly on mobile viewports.
