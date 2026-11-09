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
        lerp: 0.055,           // Calibrated low lerp for heavy physical inertia & extended deceleration glide
        wheelMultiplier: 0.68, // Controlled scroll travel per wheel notch so content is easily read
        touchMultiplier: 0.95,
        smoothWheel: true,
        infinite: false,
        autoResize: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
