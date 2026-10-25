'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import HudBox from '@/components/HudBox';
import MoltenMetal from '@/components/MoltenMetal';
import GlassCard from '@/components/GlassCard';
import IslandButton from '@/components/IslandButton';
import DecryptedText from '@/components/DecryptedText';
import {
  Bell,
  ChevronRight,
  Calendar,
  AlertCircle,
  FileText,
  ExternalLink,
  Tag,
  Radio,
  CheckCircle2,
  Mail
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  type: 'Flagship Fest' | 'Recruitment' | 'Competition' | 'Workshop';
  date: string;
  status: 'Active Transmission' | 'Scheduled' | 'Archived';
  description: string;
  bulletPoints: string[];
  actionLabel?: string;
  actionHref?: string;
}

const announcements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'RoboSaga 2026 Rulebook & Arena Dimensions Released',
    type: 'Flagship Fest',
    date: 'February 2026',
    status: 'Active Transmission',
    description: 'The official technical guidelines and safety regulations for the 30kg & 15kg RoboWars combat arena, Micromouse Maze, and High-Speed Line Follower are officially released.',
    bulletPoints: [
      'Standard 30kg weapon cutoff & active fail-safe interlocks required.',
      'Maze arena dimensions: 16x16 cell unit with 18cm wall spacing.',
      'Registration portals open for external collegiate engineering teams across India.'
    ],
    actionLabel: 'Contact For Rulebook',
    actionHref: '/contact'
  },
  {
    id: 'ann-2',
    title: 'Team Pratyumnis: Spring Induction Drive 2026',
    type: 'Recruitment',
    date: 'Upcoming Cycle',
    status: 'Active Transmission',
    description: 'Robolution opens recruitment rounds for first and second-year BIT Mesra undergraduates looking to master hardware, firmware, and autonomous robotics.',
    bulletPoints: [
      'Domains: Mechanical Design (CAD/FEA), Embedded Firmware (STM32/ESP32), Computer Vision (ROS 2), and PR/Sponsorship.',
      'Hands-on task round followed by technical interviews with pod leads.',
      'Prior robotics experience is welcomed, but a builder mindset and dedication are required.'
    ],
    actionLabel: 'Inquire In Lab',
    actionHref: '/contact'
  },
  {
    id: 'ann-3',
    title: 'ABU Robocon 2026 Phase-1 Kinematics Validation Complete',
    type: 'Competition',
    date: 'January 2026',
    status: 'Active Transmission',
    description: 'Our mechanical engineering pod has concluded multi-axis motion studies and generative stress testing for the 2026 national competition bot, clearing the way for CNC machining.',
    bulletPoints: [
      'Finite element analysis validated on 6061-T6 aluminum chassis ribs.',
      'Custom omni-wheel planetary gearbox assembly undergoing torque tests.',
      'Firmware team conducting encoder velocity loop calibration.'
    ]
  },
  {
    id: 'ann-4',
    title: 'Upcoming Hardware & ROS 2 Workshop for BIT Mesra Students',
    type: 'Workshop',
    date: 'March 2026',
    status: 'Scheduled',
    description: 'A 2-day intensive weekend workshop hosted by senior leads on robotic operating system fundamentals, LiDAR SLAM, and autonomous path tracking.',
    bulletPoints: [
      'Individual development boards and sensor packs provided during lab sessions.',
      'Practical obstacle avoidance algorithms executed on real 4-wheel mobile rovers.',
      'Certificate of completion issued by Robolution BIT Mesra.'
    ],
    actionLabel: 'Pre-Register',
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
    <div className="relative w-full min-h-screen bg-[#020307] text-white font-sans selection:bg-[#5227FF]/40 selection:text-[#FF9FFC] overflow-x-hidden">
      {/* Background MoltenMetal WebGL Caustics */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <MoltenMetal
          color1="#5227FF"
          color2="#FF9FFC"
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
          <span className="text-[#FF9FFC]">Official Transmissions &amp; Updates</span>
        </div>

        {/* Hero Title Section */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 shadow-xs font-mono text-[9px] sm:text-[10px] tracking-widest text-slate-300 uppercase mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9FFC] animate-pulse" />
            <DecryptedText
              text="// COMMUNICATION FEED • OFFICIAL TRANSMISSIONS • BIT MESRA"
              animateOn="view"
              speed={28}
              sequential={true}
              characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
              className="text-slate-300"
            />
          </div>

          <h1 className="font-modern font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-[1.05]">
            OFFICIAL TRANSMISSIONS &amp; <br />
            <span className="animate-text-shimmer">
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
          {filtered.map(item => (
            <GlassCard
              key={item.id}
              spotlightColor="rgba(255, 159, 252, 0.22)"
              className="p-8 sm:p-10"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px] text-[#FF9FFC] tracking-widest uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#5227FF]/20 border border-[#FF9FFC]/30 shadow-[0_0_8px_rgba(255,159,252,0.2)]">
                    {item.type}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>{item.status}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-[#FF9FFC]" />
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
                    <CheckCircle2 className="w-4 h-4 text-[#FF9FFC] shrink-0 mt-0.5" />
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
          ))}
        </div>

        {/* Subscribe Banner with GlassCard & IslandButton */}
        <GlassCard
          badge="TELEMETRY FEED // DISPATCHES"
          spotlightColor="rgba(82, 39, 255, 0.25)"
          className="p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              SUBSCRIBE TO OFFICIAL LAB DISPATCHES
            </h3>
            <p className="font-modern text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              Never miss a workshop registration window, RoboSaga tournament deadline, or recruitment notice.
            </p>
          </div>
          <IslandButton
            href="/contact"
            variant="primary"
          >
            Get In Touch
          </IslandButton>
        </GlassCard>
      </main>

      {/* Institutional Footer */}
      <footer className="relative z-20 bg-[#04060a]/70 backdrop-blur-xl py-14 px-4 sm:px-8 md:pl-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-modern font-black text-lg text-white uppercase tracking-wider">
              ROBOLUTION &bull; BIT MESRA
            </h4>
            <span className="font-mono text-xs text-slate-400 block mt-1">
              Official Robotics Society &bull; Department of Production &amp; Industrial Engg.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400 font-mono text-xs">
            <a
              href="https://www.instagram.com/robolution.bitm/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF9FFC] transition-colors"
            >
              @robolution.bitm
            </a>
            <a
              href="https://www.linkedin.com/company/robolution-bit-mesra/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF9FFC] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:pratyumnis@bitmesra.ac.in"
              className="hover:text-[#FF9FFC] transition-colors flex items-center gap-1.5 font-semibold"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>pratyumnis@bitmesra.ac.in</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
