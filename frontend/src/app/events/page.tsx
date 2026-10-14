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
    id: 'robosaga-annual-fest',
    title: 'RoboSaga 2027: Annual 3-Day Techno-Management Fest',
    category: 'Flagship Fest',
    badge: 'FLAGSHIP FESTIVAL',
    status: 'Annual',
    date: 'Annual 3-Day Techno-Management Extravaganza',
    venue: 'Main Arena Enclosure // BIT Mesra Campus',
    prizePool: '₹75,000 Total Arena Budget',
    description: 'Eastern India\'s premier annual techno-management festival organized on the BIT Mesra campus. Unites collegiate hardware hackers and makers across combat robot wars, autonomous line followers, maze solvers, and multi-disciplinary tech exhibitions.',
    highlights: ['Heavyweight Combat Wars', 'Autonomous Maze Solvers', 'High-Speed Line Trackers', '1,000+ Participants']
  },
  {
    id: 'robocon-national',
    title: 'ABU Robocon 2027: National Robotics Campaign',
    category: 'Competitions',
    badge: 'TEAM PRATYUMNIS',
    status: 'Upcoming',
    date: 'Annual Continental Robotics Championship',
    venue: 'National Indoor Stadium // DD & ABU Robocon India',
    prizePool: '₹7,00,000 Season Allocation',
    description: 'Representing BIT Mesra in Asia\'s most prestigious collegiate robotics competition. Deploying 4-wheel holonomic omni-drive bases, pneumatic ballistic launchers, and synchronized autonomous multi-robot telemetry.',
    highlights: ['100/100 CAD Design Score', '₹1.5L MathWorks Laurels', 'Holonomic Omni-Drive', 'Cooperative Multi-Bot']
  },
  {
    id: 'robowars-iitb',
    title: 'Robowars IIT Bombay Techfest 2026',
    category: 'Competitions',
    badge: 'HEAVYWEIGHT COMBAT',
    status: 'Upcoming',
    date: 'Techfest 2026 // Asia\'s Largest Science Fest',
    venue: 'Gymkhana Grounds // IIT Bombay',
    prizePool: '₹2,20,000 Season Allocation',
    description: 'Engineering a high-kinetic heavyweight combat bot designed to withstand heavy arena impacts while delivering devastating weapon attacks. Features hardened armor, custom weapon rotor machining, and high-traction drive systems.',
    highlights: ['Techfest Quarter-Finalist', 'Custom Hardox Armour', 'High-RPM Kinetic Weapon', 'Extreme Durability DFM']
  },
  {
    id: 'isro-ascend-drone',
    title: 'ISRO Robotics 2027: ASCEND Swarm Expedition',
    category: 'Competitions',
    badge: 'AUTONOMOUS SWARM UAV',
    status: 'Upcoming',
    date: 'National Space Robotics Challenge',
    venue: 'ISRO Space Applications Centre Arena',
    prizePool: '₹1,25,000 Season Allocation',
    description: 'Autonomous Surveyor Challenge for Exploration, Navigation and Dynamics. Inspired by future Martian planetary exploration, developing autonomous aerial swarm robotics operating completely without GPS or external navigational aids.',
    highlights: ['GPS-Denied Navigation', 'Autonomous Swarm Dynamics', 'Optical Flow & LiDAR SLAM', 'Planetary Aerial Survey']
  },
  {
    id: 'sih-agribot',
    title: 'Smart India Hackathon: Hardware Edition (AgriBot)',
    category: 'Competitions',
    badge: 'AI & EMBEDDED AUTONOMY',
    status: 'Completed',
    date: 'SIH Hardware Grand Finale',
    venue: 'National Nodal Center // Ministry of Education',
    prizePool: 'National Grand Finalist',
    description: 'Engineered AgriBot, an autonomous agricultural robotics system designed for automated precision seeding, mechanical weeding, and crop health monitoring using integrated computer vision and multi-spectrum soil sensors.',
    highlights: ['SIH Grand Finalist', 'Real-Time CV Seeding', 'Multi-Sensor Soil Matrix', 'Autonomous Field Navigation']
  },
  {
    id: 'solidworks-cad-workshop',
    title: 'SolidWorks Kinematics & 3D Prototyping Workshop',
    category: 'Workshops',
    badge: 'CAD & FABRICATION',
    status: 'Annual',
    date: 'Semester Technical Training Cycle',
    venue: 'CAD Computer Lab // Production Dept, BIT Mesra',
    description: 'Practical training in 3D CAD modeling, generative design, kinematic motion simulation, and finite element stress analysis—grounded in Robolution\'s historic 100/100 3D CAD analysis benchmark.',
    highlights: ['100/100 CAD Benchmark', 'Kinematic Motion Studies', 'FEA Stress Simulation', 'Rapid 3D Print Slicing']
  },
  {
    id: 'firmware-bootcamp',
    title: 'Hands-On Embedded Systems, KiCad PCB & Firmware Bootcamp',
    category: 'Workshops',
    badge: 'FOUNDATIONAL LAB',
    status: 'Upcoming',
    date: 'Weekend Engineering Intensive',
    venue: 'Robolution Workstation // BIT Mesra Campus',
    description: 'Intensive boot camp covering microcontroller firmware, sensor integration, FreeRTOS task scheduling, motor driver H-bridges, and custom multi-layer PCB layout using KiCad.',
    highlights: ['Microcontroller Architectures', 'Custom KiCad PCB Layout', 'FreeRTOS Multitasking', 'Hands-On Hardware Kits']
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
      <div className="absolute top-0 right-0 z-30 w-[240px] sm:w-[270px] xl:w-[290px] h-[44px] sm:h-[48px] opacity-95 hover:opacity-100 transition-opacity pointer-events-auto">
        <HudBox compact={true} theme="dark" title="EST. 2001 // BIT MESRA" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 pt-20 sm:pt-28 pb-24 px-6 sm:px-12 pl-16 sm:pl-24 max-w-7xl mx-auto">
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
              text="// ROBOSAGA • ABU ROBOCON • ISRO ASCEND • NATIONAL ARENAS"
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
            From our flagship 3-day annual festival RoboSaga and heavyweight combat battles at IIT Bombay to ABU Robocon, ISRO Swarm Expeditions, and hands-on hardware bootcamps.
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
          badge="ROBOSAGA 2027 // ARENA INTAKE"
          spotlightColor="rgba(82, 39, 255, 0.25)"
          className="p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="font-modern font-black text-2xl text-white uppercase tracking-tight">
              ROBOSAGA &apos;27 ARENA REGISTRATION
            </h3>
            <p className="font-mono text-xs text-slate-400 mt-1 uppercase tracking-wider">
              3 days of combat robot wars, micromouse maze algorithms, and autonomous sprints &bull; BIT Mesra.
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
      <footer className="relative z-20 bg-[#04060a]/70 backdrop-blur-xl py-14 px-6 sm:px-12 pl-16 sm:pl-24">
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
