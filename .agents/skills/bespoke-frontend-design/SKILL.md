---
name: bespoke-frontend-design
description: >-
  Expert guidelines and workflows for crafting bespoke, award-winning frontend interfaces
  free of AI slop, featuring aerospace/HUD aesthetics, custom canvas animations, and precision typography.
---

# Bespoke Frontend Design Skill

Use this skill when designing or modifying frontend components, landing pages, interactive 3D stages, and animations to ensure exceptional craft, artistic cohesion, and zero generic "AI template" aesthetics.

## Core Workflows

### 1. Visual Hierarchy & Art Direction
- Establish a unique visual metaphor rooted in the project's domain (e.g. aerospace telemetry HUD, cyberpunk terminal, luxury editorial, scientific instrumentation).
- Establish high contrast ratios: deep background voids with ultra-sharp vector/wireframe focal elements.
- Construct bespoke bounding frames using SVG vectors, stepped chamfers, and precise border gradients rather than uniform `rounded-md` boxes.

### 2. Kinetic Animation & Canvas Techniques
- **Particle & Starfield Systems**: Use optimized HTML5 Canvas with pre-allocated arrays, delta-time interpolation, and mouse parallax offsets.
- **HUD Telemetry Animations**: Implement synchronized SVG dash-offsets (`stroke-dashoffset`), continuous laser sweep scanlines, and stepped blinking reticle indicators.
- **Three.js / WebGL Integration**: Use wireframe edges (`EdgesGeometry` with angle thresholding) over dark occluding meshes (`polygonOffset`) to eliminate messy interior back-face clutter.

### 3. Typography & Information Density
- Pair structural display typography with precision monospace telemetry data.
- Integrate interactive text decrypters on hover or viewport reveal.
- Use uppercase, micro-tracked metric labels with contextual icon glyphs.

### 4. Verification Checklist
- [ ] Is the design free of generic purple card templates and centered blobs?
- [ ] Do animations run smoothly at 60fps without layout shifts (CLS)?
- [ ] Does the UI degrade gracefully on mobile screens (< 768px)?
- [ ] Are all interactive elements accessible with clear focus and hover states?
