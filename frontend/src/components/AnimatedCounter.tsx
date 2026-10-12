'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  /** Target value to count to */
  target: number;
  /** Suffix to display after the number (e.g. '+', '%') */
  suffix?: string;
  /** Prefix to display before the number (e.g. '₹', '$') */
  prefix?: string;
  /** Duration of the count animation in ms */
  duration?: number;
  /** Extra className for the number span */
  className?: string;
}

/**
 * Animated counter that counts from 0 to `target` when it scrolls into view.
 * Uses requestAnimationFrame for smooth digit roll, and triggers once via
 * IntersectionObserver.
 */
export default function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 1800,
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Trigger on scroll into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  // Animate count
  useEffect(() => {
    if (!started) return;

    let startTime: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      setCount(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [started, target, duration]);

  return (
    <span
      ref={ref}
      className={`tabular-nums ${className}`}
    >
      {prefix}{started ? count.toLocaleString() : '0'}{suffix}
    </span>
  );
}
