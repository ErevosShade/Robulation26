'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface IslandButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'primary' | 'secondary' | 'glass';
  className?: string;
  external?: boolean;
}

export default function IslandButton({
  href,
  onClick,
  children,
  icon: Icon = ArrowUpRight,
  variant = 'primary',
  className = '',
  external = false,
}: IslandButtonProps) {
  const isPrimary = variant === 'primary';
  const isGlass = variant === 'glass';

  const baseClasses = `group relative inline-flex items-center gap-3.5 pl-5 pr-2 py-2 rounded-full font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] cursor-pointer select-none ${className}`;

  let variantClasses = '';
  if (isPrimary) {
    variantClasses =
      'bg-white text-black hover:bg-slate-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] border border-white';
  } else if (isGlass) {
    variantClasses =
      'bg-white/[0.05] hover:bg-white/[0.12] text-white border border-white/20 hover:border-white/40 backdrop-blur-xl hover:shadow-[0_0_25px_rgba(255,159,252,0.25)]';
  } else {
    variantClasses =
      'bg-[#060913]/90 hover:bg-[#0c1222] text-white border border-white/15 hover:border-[#FF9FFC]/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]';
  }

  const iconClasses = `w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
    isPrimary
      ? 'bg-black text-white group-hover:bg-[#5227FF] group-hover:text-white'
      : 'bg-white/10 group-hover:bg-[#FF9FFC] group-hover:text-black text-white'
  } group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105`;

  const content = (
    <>
      <span className="tracking-widest">{children}</span>
      <div className={iconClasses}>
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:rotate-12" />
      </div>
    </>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${baseClasses} ${variantClasses}`}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={`${baseClasses} ${variantClasses}`}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      {content}
    </button>
  );
}
