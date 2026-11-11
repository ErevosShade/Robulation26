'use client';

import React from 'react';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

interface SmoothScrollProps {
  children: React.ReactNode;
}

/**
 * Premium Inertial Smooth Scrolling Wrapper (Powered by Lenis).
 * Delivers weighted momentum scrolling with exponential easing across modern viewports.
 */
export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,             // Responsive silky lerp with no dragging or input latency
        wheelMultiplier: 1.0,  // Natural 1:1 wheel pacing
        touchMultiplier: 1.0,
        smoothWheel: true,
        infinite: false,
        autoResize: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
