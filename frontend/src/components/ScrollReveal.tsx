'use client';

import React, { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  /** 'up' (default) | 'left' | 'right' | 'scale' */
  direction?: 'up' | 'left' | 'right' | 'scale';
  /** Extra delay in ms on top of CSS stagger */
  delay?: number;
  /** IntersectionObserver threshold (0–1) */
  threshold?: number;
  /** Additional class names */
  className?: string;
  /** If true, wraps children in a stagger container */
  stagger?: boolean;
  /** HTML tag to render (defaults to 'div') */
  as?: 'div' | 'section' | 'article' | 'span' | 'header' | 'footer' | 'main' | 'aside';
}

/**
 * Scroll-reveal wrapper. Applies `reveal`, `reveal-left`, `reveal-right`, or
 * `reveal-scale` CSS class and toggles `revealed` when the element enters the
 * viewport via IntersectionObserver. Uses GPU-only `transform` + `opacity` for
 * 60fps on mobile.
 */
export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  threshold = 0.15,
  className = '',
  stagger = false,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const revealClass = {
    up: 'reveal',
    left: 'reveal-left',
    right: 'reveal-right',
    scale: 'reveal-scale',
  }[direction];

  const staggerClass = stagger ? 'reveal-stagger' : '';

  return (
    <Tag
      ref={ref as any}
      className={`${revealClass} ${visible ? 'revealed' : ''} ${staggerClass} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
