"use client";

import React, { useRef, useCallback } from "react";
import "./holo-card.css";

interface HoloCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const TILT_DIV = 3.5; // Lower = steeper tilt, Higher = subtler tilt

export default function HoloCard({ children, className = "", onClick }: HoloCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Only animate for fine mouse pointers
    if (e.pointerType !== "mouse" || rafRef.current) return;

    const { clientX, clientY } = e;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const el = cardRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const px = ((clientX - rect.left) / rect.width) * 100;
      const py = ((clientY - rect.top) / rect.height) * 100;

      el.style.setProperty("--card-hx", `${px.toFixed(1)}%`);
      el.style.setProperty("--card-hy", `${py.toFixed(1)}%`);
      el.style.setProperty("--card-rx", `${((py - 50) / TILT_DIV).toFixed(2)}deg`);
      el.style.setProperty("--card-ry", `${(-(px - 50) / TILT_DIV).toFixed(2)}deg`);
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    for (const prop of ["--card-hx", "--card-hy", "--card-rx", "--card-ry"]) {
      el.style.removeProperty(prop);
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`holo-card group ${className}`}
    >
      {/* Holographic foil shimmer (follows cursor) */}
      <div className="holo-card__foil" aria-hidden="true" />

      {/* Card Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
