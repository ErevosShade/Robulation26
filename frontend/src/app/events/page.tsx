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
  Trophy,
  Flame,
  Wrench,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  ExternalLink,
  Award,
  Zap,
  Shield,
  Activity,
  Cpu,
  Mail
} from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  category: 'Flagship Fest' | 'Competitions' | 'Workshops';
  badge: string;
  status: 'Upcoming' | 'Annual' | 'Completed';
  date: string;
  venue: string;
  prizePool?: string;
  description: string;
  highlights: string[];
}

const events: EventItem[] = [
  {
    id: 'robosaga-wars',
    title: 'RoboSaga 2026: RoboWars Arena (30kg & 15kg)',
    category: 'Flagship Fest',
    badge: 'COMBAT MECHATRONICS',
    status: 'Annual',
    date: 'Spring 2026 (Annual 3-Day Fest)',
    venue: 'Main Arena Enclosure // BIT Mesra Campus',
    prizePool: '₹75,000+',
    description: 'Eastern India\'s premier combat robotics championship. High-torque brushless drum spinners, pneumatic flippers, and hardened Hardox armor clash in an engineered bulletproof Lexan arena.',
    highlights: ['30kg Combat Class', '15kg Lightweight Class', 'Safety & Weapon Interlock Inspection', 'National College Teams']
  },
  {
    id: 'robosaga-maze',
    title: 'RoboSaga 2026: Autonomous Maze Solver',
    category: 'Flagship Fest',
    badge: 'AUTONOMOUS NAVIGATION',
    status: 'Annual',
    date: 'Spring 2026 (Day 2 of RoboSaga)',
    venue: 'Mechatronics Lab Arena // BIT Mesra',
    prizePool: '₹30,000+',
    description: 'Autonomous micromouse labyrinth navigation challenge. Bots must autonomously map, calculate optimal paths using modified flood-fill algorithms, and sprint through an unseen maze.',
    highlights: ['Zero Remote Intervention', 'LiDAR & Ultrasonic Ranging', 'Path Optimization Score', 'High Speed Sprint Runs']
  },
  {
    id: 'robosaga-line',
    title: 'RoboSaga 2026: High-Speed Line Follower',
    category: 'Flagship Fest',
    badge: 'EMBEDDED CONTROL',
    status: 'Annual',
    date: 'Spring 2026 (Day 1 of RoboSaga)',
    venue: 'R&D Center Hall // BIT Mesra',
    prizePool: '₹25,000+',
    description: 'High-frequency PID closed-loop speed challenge across sharp hairpin turns, inverted elevations, and discontinuous trajectory marks with millisecond timing gates.',
    highlights: ['Precision Optical Sensor Arrays', 'PID Loop Tuning', 'Coreless Motor Sprints', 'High Banked Curves']
  },
  {
    id: 'robocon-campaign',
    title: 'ABU Robocon India National Campaign',
    category: 'Competitions',
    badge: 'TEAM PRATYUMNIS',
    status: 'Upcoming',
    date: 'Qualifiers & National Finals',
    venue: 'National Stadium Arena // ABU Robocon India',
    prizePool: 'International Representation',
    description: 'Representing BIT Mesra on the national collegiate stage. Cooperative autonomous and manual robots engineered for rapid object manipulation, omni-drive kinematics, and precision projectile trajectory.',
    highlights: ['100/100 CAD Score Heritage', 'MathWorks National Award', 'Omnidirectional Mechatronics', 'Multi-Robot Telemetry']
  },
  {
    id: 'firmware-bootcamp',
    title: 'Hands-on Embedded Firmware & ESP32 Bootcamp',
    category: 'Workshops',
    badge: 'FOUNDATIONAL LAB',
    status: 'Upcoming',
    date: 'Upcoming Technical Cycle',
    venue: 'Robolution Workstation // BIT Mesra',
    description: 'Intensive weekend boot camp covering bare-metal microcontrollers, FreeRTOS multitasking, I2C/SPI bus sensors, and motor driver H-bridges for fresh college engineers.',
    highlights: ['FreeRTOS Task Scheduling', 'Hardware Debugging with Logic Analyzers', 'Custom PCB Interfacing', 'Individual Kit Access']
  },
  {
    id: 'cad-prototyping-workshop',
    title: 'SolidWorks Kinematics & 3D Prototyping Workshop',
    category: 'Workshops',
    badge: 'CAD & FABRICATION',
    status: 'Completed',
    date: 'Recent Semester Cycle',
    venue: 'CAD Computer Lab // Production Dept',
    description: 'Practical training on parametric 3D CAD modeling, generative design, weight reduction pocketing, finite element stress analysis, and rapid 3D printing slicing.',
    highlights: ['Kinematic Motion Simulation', 'FEA Stress Testing', 'DFM (Design for Manufacturing)', '3D Printing Lab Sprints']
  }
];

export default function EventsPage() {
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Flagship Fest', 'Competitions', 'Workshops'];

  const filteredEvents = filter === 'All'
    ? events
    : events.filter(e => e.category === filter);

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
          <span className="text-[#FF9FFC]">Events &amp; Competitions</span>
        </div>

        {/* Hero Title Section */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 shadow-xs font-mono text-[9px] sm:text-[10px] tracking-widest text-slate-300 uppercase mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9FFC] animate-pulse" />
            <DecryptedText
              text="// ROBOSAGA • ABU ROBOCON • BIT MESRA ARENAS"
              animateOn="view"
              speed={28}
              sequential={true}
              characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
              className="text-slate-300"
            />
          </div>

          <h1 className="font-modern font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-[1.05]">
            ARENAS, COMBAT WARS &amp; <br />
            <span className="animate-text-shimmer">
              TECHNICAL WORKSHOPS
            </span>
          </h1>

          <p className="font-modern text-base sm:text-lg text-slate-300 max-w-3xl mt-6 leading-relaxed">
            From the high-octane 30kg bulletproof combat robot arena of RoboSaga to national ABU Robocon campaigns and hands-on hardware training cycles.
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

        {/* Events Grid with Double-Bezel GlassCards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-24">
          {filteredEvents.map(event => (
            <GlassCard
              key={event.id}
              spotlightColor="rgba(255, 159, 252, 0.22)"
              className="p-8 flex flex-col justify-between"
            >
              <div>
                {/* Header row: Badge and Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[9px] text-[#FF9FFC] tracking-widest uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#5227FF]/20 border border-[#FF9FFC]/30 shadow-[0_0_8px_rgba(255,159,252,0.2)]">
                    {event.badge}
                  </span>
                  <span className={`font-mono text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${
                    event.status === 'Upcoming'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : event.status === 'Annual'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-zinc-800 text-slate-400 border border-zinc-700'
                  }`}>
                    {event.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-modern font-black text-xl text-white uppercase tracking-tight mt-2">
                  {event.title}
                </h3>

                {/* Metadata */}
                <div className="mt-4 space-y-1.5 font-mono text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#FF9FFC]" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#FF9FFC]" />
                    <span>{event.venue}</span>
                  </div>
                  {event.prizePool && (
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Prize: {event.prizePool}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="font-modern text-xs text-slate-300 mt-4 leading-relaxed">
                  {event.description}
                </p>

                {/* Highlights tags */}
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {event.highlights.map((h, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 font-mono text-[9px] text-slate-300 uppercase tracking-wide"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action / Learn More */}
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                  BIT MESRA ROBOTICS
                </span>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 font-mono text-xs text-[#FF9FFC] hover:text-white font-bold uppercase transition-colors"
                >
                  <span>Inquire</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* RoboSaga Fest Banner with GlassCard & IslandButton */}
        <GlassCard
          badge="ROBOSAGA 2026 // ARENA INTAKE"
          spotlightColor="rgba(82, 39, 255, 0.25)"
          className="p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="font-modern font-black text-2xl text-white uppercase tracking-tight">
              ROBOSAGA &apos;26 ARENA REGISTRATION
            </h3>
            <p className="font-mono text-xs text-slate-400 mt-1 uppercase tracking-wider">
              3 days of robot wars, micromouse maze algorithms, and autonomous sprints &bull; BIT Mesra.
            </p>
          </div>
          <IslandButton
            href="/contact"
            variant="primary"
          >
            Register Team
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
