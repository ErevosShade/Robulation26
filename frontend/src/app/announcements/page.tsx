'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import HudBox from '@/components/HudBox';
import GlassCard from '@/components/GlassCard';
import IslandButton from '@/components/IslandButton';
import MoltenMetal from '@/components/MoltenMetal';
import {
  Radio,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Bell,
  Mail
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  type: 'Flagship Fest' | 'Recruitment' | 'Competition' | 'Workshop';
  date: string;
  status: string;
  description: string;
  bulletPoints: string[];
  actionLabel?: string;
  actionHref?: string;
}

const announcements: Announcement[] = [
  {
    id: 'ann-spring-k26',
    title: 'Spring K26 Induction Results',
    type: 'Recruitment',
    date: 'Spring 2026',
    status: 'In Progress • Awaiting Publication',
    description: 'Technical task submissions, lab hardware interviews, and domain evaluations for the Spring K26 induction drive are currently under active evaluation. Results are not yet published and the selection process is still ongoing.',
    bulletPoints: [
      'Evaluation of Mechanical CAD/FEA, Embedded Firmware, and Autonomous Navigation tasks is in progress.',
      'Candidate shortlists and interview scores are being compiled by pod leads and faculty advisors.',
      'Results are NOT yet released — official roll lists will be published once the review process concludes.'
    ],
    actionLabel: 'Contact For Inquiries',
    actionHref: '/contact'
  },
  {
    id: 'ann-gateway-certificates',
    title: 'Gateway to Robotics: Workshop Certificates',
    type: 'Workshop',
    date: 'November 2026',
    status: 'In Process • Not Yet Published',
    description: 'Certificates of completion for participants of the 3-day "Gateway to Robotics 2026" hands-on workshop for the K26 freshman batch are currently being processed and prepared. They have not yet been published or issued.',
    bulletPoints: [
      'Attendance records across Embedded ESP32, 3D CAD modeling, Pneumatics, and Computer Vision modules are being verified.',
      'Digital certificate templates and verification credentials are in final administrative preparation.',
      'Official dispatch notification and download links will be released here once certificates are published.'
    ],
    actionLabel: 'Check Status',
    actionHref: '/contact'
  }
];

export default function AnnouncementsPage() {
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Flagship Fest', 'Recruitment', 'Competition', 'Workshop'];

  const filtered = filter === 'All'
    ? announcements
    : announcements.filter(a => a.type === filter);

  return (
    <div className="relative w-full min-h-screen bg-[#020307] text-white font-sans selection:bg-cyan-500/30 selection:text-white overflow-x-hidden">
      {/* Background MoltenMetal WebGL Caustics */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <MoltenMetal
          color1="#020408"
          color2="#0f172a"
          color3="#FFFFFF"
          speed={0.18}
          scale={4.3}
          detail={3}
          glow={1.55}
          coreSize={0.1}
          swirl={1}
          fold={-0.22}
          blackPoint={0.13}
          brightness={0.45}
          colorMode="molten"
          grain={true}
          grainIntensity={0.05}
          mouseInteraction={true}
          mouseStrength={0.3}
          opacity={0.95}
        />
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_35%,#020307_92%] opacity-60" />
      </div>

      {/* Left Smooth Sidebar */}
      <Sidebar theme="dark" />

      {/* Top Right Corner Tech Box */}
      <div className="hidden sm:block absolute top-0 right-0 z-30 w-[240px] sm:w-[270px] xl:w-[290px] h-[44px] sm:h-[48px] opacity-95 hover:opacity-100 transition-opacity pointer-events-auto">
        <HudBox compact={true} theme="dark" title="EST. 2001 // BIT MESRA" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 pt-18 sm:pt-28 pb-20 px-4 sm:px-8 md:pl-24 max-w-7xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-slate-400 mb-6 uppercase tracking-widest">
          <Link href="/" className="hover:text-white transition-colors">Mission Control</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-300">Official Transmissions &amp; Updates</span>
        </div>

        {/* Hero Title Section */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 shadow-xs font-mono text-[9px] sm:text-[10px] tracking-widest text-slate-300 uppercase mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>// COMMUNICATION FEED &bull; OFFICIAL TRANSMISSIONS &bull; BIT MESRA</span>
          </div>

          <h1 className="font-modern font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-[1.05]">
            OFFICIAL TRANSMISSIONS &amp; <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              ANNOUNCEMENTS
            </span>
          </h1>

          <p className="font-modern text-base sm:text-lg text-slate-300 max-w-3xl mt-6 leading-relaxed">
            Stay updated with verified notices, recruitment schedules, RoboSaga competition guidelines, and technical workshop announcements from Robolution.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer backdrop-blur-md ${
                filter === cat
                  ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
                  : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Announcements Stack with Double-Bezel GlassCards */}
        <div className="space-y-6 mb-24">
          {filtered.length > 0 ? (
            filtered.map(item => (
              <GlassCard
                key={item.id}
                spotlightColor="rgba(255, 255, 255, 0.08)"
                className="p-8 sm:p-10"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] text-slate-200 tracking-widest uppercase font-bold px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/15">
                      {item.type}
                    </span>
                    <span className="font-mono text-[10px] text-amber-300 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                      <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
                      <span>{item.status}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <h2 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                  {item.title}
                </h2>

                <p className="font-modern text-sm text-slate-200 mt-4 max-w-4xl leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-6 space-y-2">
                  {item.bulletPoints.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 font-modern text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                {item.actionLabel && (
                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-end">
                    <IslandButton
                      href={item.actionHref || '/contact'}
                      variant="glass"
                    >
                      {item.actionLabel}
                    </IslandButton>
                  </div>
                )}
              </GlassCard>
            ))
          ) : (
            <div className="text-center py-16 text-slate-500 font-mono text-sm border border-white/5 rounded-2xl bg-white/[0.01]">
              NO ACTIVE TRANSMISSIONS IN THIS CATEGORY.
            </div>
          )}
        </div>

        {/* Subscribe Banner with GlassCard & IslandButton */}
        <GlassCard
          badge="TELEMETRY FEED // DISPATCHES"
          spotlightColor="rgba(255, 255, 255, 0.08)"
          className="p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              SUBSCRIBE TO OFFICIAL LAB DISPATCHES
            </h3>
            <p className="font-modern text-sm text-slate-300 mt-2 max-w-xl">
              Get notified immediately via campus broadcast and telemetry email when new competition guidelines, festival dates, and recruitment rounds go live.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <IslandButton href="/contact" variant="primary">
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span>Join Broadcast Feed</span>
              </span>
            </IslandButton>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
