'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import HudBox from '@/components/HudBox';
import MoltenMetal from '@/components/MoltenMetal';
import TechText from '@/components/TechText';
import GlassCard from '@/components/GlassCard';
import IslandButton from '@/components/IslandButton';
import DecryptedText from '@/components/DecryptedText';
import ScrollReveal from '@/components/ScrollReveal';
import AnimatedCounter from '@/components/AnimatedCounter';
import {
  ChevronRight,
  Mail,
  Flame,
  Cpu,
  Wrench,
  Trophy
} from 'lucide-react';

const milestones = [
  {
    year: '2001',
    code: 'EXP-01',
    tag: 'INSTITUTIONAL INITIATION',
    title: 'Genesis of Team Pratyumnis',
    detail: 'Founded at Birla Institute of Technology, Mesra under the Department of Production & Industrial Engineering to represent the institute in national robotics competitions.',
    specs: 'DEPT. PIE // SOCIETY CHARTER #01',
    metric: 'FOUNDING COHORT',
    status: 'LEGACY LOGGED',
  },
  {
    year: '2013',
    code: 'EXP-02',
    tag: 'ROBOCON DEBUT',
    title: 'Best Rookie Team at Robocon',
    detail: 'Secured the prestigious Best Rookie Team award during our inaugural national campaign at Balewadi Stadium, Pune, engineering precision arrow-launch mechanisms.',
    specs: 'PUNE ARENA // ARROW LAUNCH',
    metric: 'BEST ROOKIE AWARD',
    status: 'PODIUM VALIDATED',
  },
  {
    year: '2015',
    code: 'EXP-03',
    tag: 'MATHWORKS & IIT BOMBAY',
    title: '₹1.5L MathWorks & Pixelate Laurels',
    detail: 'Clinched the MathWorks National Award with a ₹1,50,000 cash prize (Best Non-Quarterfinalist) and bagged 2nd Prize in Pixelate Vision at Techfest IIT Bombay.',
    specs: '₹1.5L MATHWORKS // PIXELATE 2ND',
    metric: 'DOUBLE NATIONAL LAUREL',
    status: 'RECORD PRIZE',
  },
  {
    year: '2016',
    code: 'EXP-04',
    tag: 'DUAL-BOT & JU VICTORIES',
    title: 'Clean Energy & Srijan 1st Place',
    detail: 'Deployed coordinated dual-robot telemetry for ABU Robocon and clinched 1st Place across multiple competitive robotics categories at Srijan Jadavpur University.',
    specs: 'DUAL-ROBOT TELEMETRY // JU 1ST',
    metric: '1ST PLACE MULTI-EVENT',
    status: 'PODIUM VALIDATED',
  },
  {
    year: '2018',
    code: 'EXP-05',
    tag: 'IIT KGP MAZE & BALLISTICS',
    title: 'Kshitij 2nd Place & Robocon Launch',
    detail: 'Clinched 2nd Place in the autonomous Maze Solver challenge at Kshitij IIT Kharagpur and fielded repeatable ballistic elevation systems for national Robocon.',
    specs: 'IIT KGP KSHITIJ // BALLISTICS',
    metric: '2ND PLACE MAZE SOLVER',
    status: 'PODIUM VALIDATED',
  },
  {
    year: '2019',
    code: 'EXP-06',
    tag: 'IIT GUWAHATI CHAMPION',
    title: '1st Place RoboSoccer at Techniche',
    detail: 'Secured 1st Place in the high-agility autonomous RoboSoccer challenge at Techniche IIT Guwahati, fielding custom differential omni-wheel kinematics.',
    specs: 'TECHNICHE IITG // OMNI-DRIVE',
    metric: '1ST PLACE CHAMPION',
    status: 'GOLD TROPHY',
  },
  {
    year: '2021',
    code: 'EXP-07',
    tag: 'WORLD-RECORD CAD PRECISION',
    title: 'Perfect 100/100 CAD Score',
    detail: 'Achieved an unprecedented 100/100 score in 3D CAD design analysis by national and international judges for kinematic validation and structural optimization.',
    specs: 'SOLIDWORKS FEA // TOP 15 FINALIST',
    metric: '100/100 CAD SCORE',
    status: 'MAX CAD METRIC',
  },
  {
    year: '2022',
    code: 'EXP-08',
    tag: 'NIT TRICHY & DTU EXPEDITION',
    title: '1st Place Roborace & Autonomous Bot',
    detail: 'Secured 1st Place in Roborace at Pragyan NIT Trichy and bagged 2nd Place in Autonomous Bot at Robotryst DTU, validating our high-speed traction chassis.',
    specs: 'NIT TRICHY 1ST // DTU 2ND',
    metric: 'DUAL NATIONAL PODIUM',
    status: 'GOLD & SILVER',
  },
  {
    year: '2023',
    code: 'EXP-09',
    tag: 'IITG & IIT KGP DOUBLE PODIUM',
    title: 'Techniche & Kshitij Double Victory',
    detail: 'Clinched 1st Place in Robowar & Line Follower at Techniche IIT Guwahati, 2nd Place in Autonomous Navigation at Kshitij IIT Kharagpur, and e-Yantra Finalist.',
    specs: 'IITG 1ST // IIT KGP 2ND // E-YANTRA',
    metric: 'TRIPLE NATIONAL HONORS',
    status: 'PODIUM VALIDATED',
  },
  {
    year: '2024',
    code: 'EXP-10',
    tag: 'SIH GRAND FINALE',
    title: 'Smart India Hackathon AgriBot',
    detail: 'Selected for the Grand Finale of Smart India Hackathon Hardware Edition, developing the AgriBot autonomous system with real-time CV seeding and soil analytics.',
    specs: 'SIH HARDWARE // AGRIBOT CV',
    metric: 'SIH GRAND FINALIST',
    status: 'NATIONAL RECOGNITION',
  },
  {
    year: '2025-26',
    code: 'EXP-11',
    tag: 'COMBAT & SWARM EXPEDITION',
    title: 'IITB Robowars & ISRO ASCEND',
    detail: 'Reached Quarter-finals in Heavyweight Robowars at Techfest IIT Bombay, advancing into the ISRO ASCEND autonomous swarm drone expedition and RoboSaga 2027.',
    specs: 'IITB COMBAT QF // ISRO ASCEND UAV',
    metric: 'COMBAT & SWARM FLEET',
    status: 'ACTIVE EXPEDITION',
  },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<'robocon' | 'robosaga'>('robocon');

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
          <span className="text-[#FF9FFC]">About Robolution</span>
        </div>

        {/* Hero Title Section */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 shadow-xs font-mono text-[9px] sm:text-[10px] tracking-widest text-slate-300 uppercase mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9FFC] animate-pulse" />
            <DecryptedText
              text="// OFFICIAL ROBOTICS SOCIETY • BIT MESRA • EST. 2001"
              animateOn="view"
              speed={28}
              sequential={true}
              characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
              className="text-slate-300"
            />
          </div>

          <h1 className="font-modern font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-[1.05]">
            BUILDING THE FUTURE OF <br />
            <span className="animate-text-shimmer">
              AUTONOMOUS MECHATRONICS
            </span>
          </h1>

          <p className="font-modern text-base sm:text-lg text-slate-300 max-w-3xl mt-6 leading-relaxed">
            Robolution is the student-driven robotics and innovation society of Birla Institute of Technology, Mesra.
            We bring together passionate hardware builders, firmware engineers, and software architects to solve real technical challenges
            through collaborative making and national competitive campaigns.
          </p>
        </div>

        {/* Metrics Grid with GlassCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-24">
          <ScrollReveal>
            <GlassCard
              badge="LEGACY // 2001-2026"
              spotlightColor="rgba(255, 159, 252, 0.2)"
              className="p-6"
            >
              <div>
                <AnimatedCounter target={24} suffix="+" className="font-mono text-3xl sm:text-5xl font-black text-[#FF9FFC] block" />
                <span className="font-modern font-bold text-sm text-white uppercase mt-2 block">Years of Legacy</span>
                <p className="font-mono text-[11px] text-slate-400 mt-1">Pioneering robotics at BIT Mesra since 2001.</p>
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <GlassCard
              badge="CAD RECORD"
              spotlightColor="rgba(82, 39, 255, 0.2)"
              className="p-6"
            >
              <div>
                <span className="font-mono text-3xl sm:text-5xl font-black text-[#FF9FFC] block">100/100</span>
                <span className="font-modern font-bold text-sm text-white uppercase mt-2 block">Design Analysis</span>
                <p className="font-mono text-[11px] text-slate-400 mt-1">Historic perfect score achieved at ABU Robocon.</p>
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <GlassCard
              badge="ACTIVE FLEET"
              spotlightColor="rgba(52, 211, 153, 0.2)"
              className="p-6"
            >
              <div>
                <AnimatedCounter target={9} suffix="+" className="font-mono text-3xl sm:text-5xl font-black text-[#FF9FFC] block" />
                <span className="font-modern font-bold text-sm text-white uppercase mt-2 block">Robotics Platforms</span>
                <p className="font-mono text-[11px] text-slate-400 mt-1">Combat bots, autonomous AMRs, and 6-DOF arms.</p>
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <GlassCard
              badge="ARENA HONORS"
              spotlightColor="rgba(251, 191, 36, 0.2)"
              className="p-6"
            >
              <div>
                <AnimatedCounter target={16} suffix="+" className="font-mono text-3xl sm:text-5xl font-black text-[#FF9FFC] block" />
                <span className="font-modern font-bold text-sm text-white uppercase mt-2 block">National Podiums</span>
                <p className="font-mono text-[11px] text-slate-400 mt-1">Verified honors across SIH, Robocon, and Techfests.</p>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>

        {/* =====================================================================
            WHAT WE DO AT ROBOLUTION (Pillars / Disciplines)
        ===================================================================== */}
        <section
          id="disciplines"
          className="mb-24 sm:mb-28 relative"
        >
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
              <div>
                <span className="font-mono text-xs text-[#FF9FFC] font-bold tracking-widest uppercase block mb-1">
                  <DecryptedText
                    text="// INSTITUTIONAL DOMAINS"
                    animateOn="view"
                    speed={30}
                    sequential={true}
                    characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
                    className="text-[#FF9FFC]"
                  />
                </span>
                <h2 className="font-modern font-black text-3xl sm:text-5xl tracking-tight text-white uppercase mt-1">
                  WHAT WE DO AT <span className="animate-text-shimmer">ROBOLUTION</span>
                </h2>
              </div>
              <p className="font-modern text-sm text-slate-400 max-w-md leading-relaxed">
                Bridging foundational theory with competition-ready systems: autonomous navigation, combat robotics, drone technology, and embedded control.
              </p>
            </div>
          </ScrollReveal>

          {/* 3 Pillars Bento Grid with Double-Bezel GlassCard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Pillar 1: Workshops & Training */}
            <GlassCard
              badge="FOUNDATIONAL LAB // 01"
              spotlightColor="rgba(82, 39, 255, 0.25)"
              transparent={true}
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#5227FF]/15 border border-[#5227FF]/30 flex items-center justify-center text-[#FF9FFC] mb-6 shadow-[0_0_15px_rgba(82,39,255,0.3)]">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <h3 className="font-modern text-2xl font-bold text-white uppercase tracking-tight">
                    Workshops &amp; Training
                  </h3>
                  <p className="font-modern text-sm text-slate-300 mt-4 leading-relaxed">
                    Conducting intensive hands-on bootcamps throughout the academic year. From Arduino microcontrollers, sensor integration, and KiCAD PCB layout to advanced 3D printing and SolidWorks mechanical simulation.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/10 font-mono text-[11px] text-slate-400 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10">Microcontrollers</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10">3D Printing</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10">PCB Design</span>
                </div>
              </div>
            </GlassCard>

            {/* Pillar 2: RoboSaga Annual Fest */}
            <GlassCard
              badge="FLAGSHIP ARENA // 02"
              spotlightColor="rgba(244, 63, 94, 0.25)"
              transparent={true}
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                    <Flame className="w-6 h-6" />
                  </div>
                  <h3 className="font-modern text-2xl font-bold text-white uppercase tracking-tight">
                    RoboSaga 3-Day Fest
                  </h3>
                  <p className="font-modern text-sm text-slate-300 mt-4 leading-relaxed">
                    Eastern India&apos;s premier annual techno-management festival organized on the BIT Mesra campus. Featuring high-energy combat robot wars, line-tracking sprints, maze navigators, and multi-disciplinary exhibitions.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/10 font-mono text-[11px] text-slate-400 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10">Robot Wars</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10">Maze Solvers</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10">Flagship Fest</span>
                </div>
              </div>
            </GlassCard>

            {/* Pillar 3: Projects & Research (Team Pratyumnis) */}
            <GlassCard
              badge="COMPETITIVE WING // 03"
              spotlightColor="rgba(52, 211, 153, 0.25)"
              transparent={true}
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="font-modern text-2xl font-bold text-white uppercase tracking-tight">
                    Projects &amp; Robocon
                  </h3>
                  <p className="font-modern text-sm text-slate-300 mt-4 leading-relaxed">
                    Engineering high-precision autonomous mechatronic systems for ABU Robocon and national competitions. Developing holonomic omni-drive chassis, pneumatic ballistic launchers, and vision-guided robotics.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/10 font-mono text-[11px] text-slate-400 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10">ABU Robocon</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10">Autonomous AMR</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10">ROS &bull; Vision</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* =====================================================================
            HALL OF FAME: AUTHENTIC NATIONAL COMPETITION HONORS
        ===================================================================== */}
        <section
          id="arena"
          className="mb-24 sm:mb-28 relative"
        >
          <ScrollReveal>
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-14 gap-6">
              <div>
                <span className="font-mono text-xs text-emerald-400 font-bold tracking-widest uppercase block mb-1">
                  <DecryptedText
                    text="// VERIFIED ARENA HONORS"
                    animateOn="view"
                    speed={30}
                    sequential={true}
                    characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
                    className="text-emerald-400"
                  />
                </span>
                <h2 className="font-modern font-black text-3xl sm:text-5xl tracking-tight text-white uppercase mt-1">
                  COMPETITIVE <span className="animate-text-shimmer">ARENA HONORS</span>
                </h2>
              </div>

              {/* Origin UI Style Segmented Navigation Tabs */}
              <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-inner font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('robocon')}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    activeTab === 'robocon'
                      ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-[#FF9FFC]" />
                  <span>ABU ROBOCON &amp; IITs</span>
                  {activeTab === 'robocon' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF9FFC] animate-pulse" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('robosaga')}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    activeTab === 'robosaga'
                      ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>ROBOSAGA FEST</span>
                  {activeTab === 'robosaga' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  )}
                </button>
              </div>
            </div>
          </ScrollReveal>

          {activeTab === 'robocon' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Honor 1: Robocon 2021 */}
              <GlassCard
                badge="ABU ROBOCON 2021"
                spotlightColor="rgba(52, 211, 153, 0.25)"
                transparent={true}
              >
                <div>
                  <span className="font-mono text-3xl sm:text-4xl font-black text-emerald-400">100 / 100</span>
                  <h3 className="font-modern text-lg font-bold text-white uppercase mt-3">
                    3D CAD Design Score
                  </h3>
                  <p className="font-modern text-xs text-slate-300 mt-2 leading-relaxed">
                    Awarded a perfect 100/100 score in 3D CAD design analysis by national and international judges for virtual kinematics, weight optimization, and stress simulation.
                  </p>
                </div>
              </GlassCard>

              {/* Honor 2: Robocon 2015 */}
              <GlassCard
                badge="ABU ROBOCON 2015"
                spotlightColor="rgba(255, 159, 252, 0.25)"
                transparent={true}
              >
                <div>
                  <span className="font-mono text-3xl sm:text-4xl font-black text-[#FF9FFC]">&#8377;1,50,000</span>
                  <h3 className="font-modern text-lg font-bold text-white uppercase mt-3">
                    MathWorks Award &amp; Rank
                  </h3>
                  <p className="font-modern text-xs text-slate-300 mt-2 leading-relaxed">
                    Bagged the MathWorks National Award accompanied by a cash prize of &#8377;1,50,000, along with the title of Best Non-Quarterfinalist Team.
                  </p>
                </div>
              </GlassCard>

              {/* Honor 3: Robocon 2013 */}
              <GlassCard
                badge="ABU ROBOCON 2013 // PUNE"
                spotlightColor="rgba(251, 191, 36, 0.25)"
                transparent={true}
              >
                <div>
                  <span className="font-mono text-3xl sm:text-4xl font-black text-amber-400">ROOKIE</span>
                  <h3 className="font-modern text-lg font-bold text-white uppercase mt-3">
                    Best Rookie Team
                  </h3>
                  <p className="font-modern text-xs text-slate-300 mt-2 leading-relaxed">
                    Awarded Best Rookie Team at Balewadi Stadium, Pune in our debut Robocon campaign, surpassing established engineering institutions across India.
                  </p>
                </div>
              </GlassCard>

              {/* Honor 4: Techfest IIT Bombay 2015 */}
              <GlassCard
                badge="IIT BOMBAY // 2015"
                spotlightColor="rgba(168, 85, 247, 0.25)"
                transparent={true}
              >
                <div>
                  <span className="font-mono text-3xl sm:text-4xl font-black text-purple-400">2ND PRIZE</span>
                  <h3 className="font-modern text-lg font-bold text-white uppercase mt-3">
                    Pixelate Vision Event
                  </h3>
                  <p className="font-modern text-xs text-slate-300 mt-2 leading-relaxed">
                    Clinched 2nd prize in the flagship image processing and computer-vision robotics event &lsquo;Pixelate&rsquo; at Techfest IIT Bombay.
                  </p>
                </div>
              </GlassCard>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard
                badge="ANNUAL HOSTING"
                spotlightColor="rgba(251, 191, 36, 0.25)"
                transparent={true}
              >
                <div>
                  <span className="font-mono text-3xl sm:text-4xl font-black text-amber-400">3 DAYS</span>
                  <h3 className="font-modern text-lg font-bold text-white uppercase mt-3">
                    Techno-Management Fest
                  </h3>
                  <p className="font-modern text-xs text-slate-300 mt-2 leading-relaxed">
                    Our flagship techno-management festival bringing together collegiate hardware hackers, makers, and innovators across Eastern India.
                  </p>
                </div>
              </GlassCard>

              <GlassCard
                badge="ENCLOSED STEEL CAGE"
                spotlightColor="rgba(244, 63, 94, 0.25)"
                transparent={true}
              >
                <div>
                  <span className="font-mono text-3xl sm:text-4xl font-black text-rose-400">COMBAT</span>
                  <h3 className="font-modern text-lg font-bold text-white uppercase mt-3">
                    Heavy Armor Combat Wars
                  </h3>
                  <p className="font-modern text-xs text-slate-300 mt-2 leading-relaxed">
                    High-kinetic spinner combat bots, wedge flippers, and armored chassis competing in a polycarbonate-reinforced combat arena.
                  </p>
                </div>
              </GlassCard>

              <GlassCard
                badge="ATTENDEES &amp; ARENA"
                spotlightColor="rgba(56, 189, 248, 0.25)"
                transparent={true}
              >
                <div>
                  <span className="font-mono text-3xl sm:text-4xl font-black text-sky-400">1,000+</span>
                  <h3 className="font-modern text-lg font-bold text-white uppercase mt-3">
                    RoboSaga Participants
                  </h3>
                  <p className="font-modern text-xs text-slate-300 mt-2 leading-relaxed">
                    Workshops, autonomous line-tracking sprints, maze solving trials, and technical project exhibitions held on campus.
                  </p>
                </div>
              </GlassCard>
            </div>
          )}
        </section>

        {/* Expedition Timeline: Central Telemetry Bus with Left & Right Alternating Lanes */}
        <section className="mb-28 relative">
          <ScrollReveal>
            <div className="mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 shadow-xs font-mono text-[9px] sm:text-[10px] tracking-widest text-slate-300 uppercase mb-4 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9FFC] animate-pulse" />
                <DecryptedText
                  text="// CHRONO BUS ARCHITECTURE • EXPEDITION TIMELINE"
                  animateOn="view"
                  speed={28}
                  sequential={true}
                  characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
                  className="text-slate-300"
                />
              </div>
              <h2 className="font-modern font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
                OUR <span className="animate-text-shimmer">EXPEDITION TIMELINE</span>
              </h2>
              <p className="font-modern text-sm sm:text-base text-slate-300 max-w-2xl mt-4 leading-relaxed">
                A quarter-century chronicle of collegiate robotics milestones, national podium campaigns, and precision mechatronics evolution at BIT Mesra.
              </p>
            </div>
          </ScrollReveal>

          {/* Central Bus & Lane Container */}
          <div className="relative w-full max-w-6xl mx-auto py-8">
            {/* The Central Middle Bus Spine (Desktop: Center / Mobile: Left side) */}
            <div className="absolute top-0 bottom-0 left-6 md:left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-0">
              {/* Top Bus Intake Reticle */}
              <div className="flex flex-col items-center mb-2">
                <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest bg-[#020408] px-2 py-0.5 rounded border border-white/10 mb-1">
                  BUS INTAKE // 2001
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF9FFC] shadow-[0_0_10px_#FF9FFC]" />
              </div>

              {/* Central Dual Bus Rails */}
              <div className="relative flex-1 w-3.5 flex justify-between">
                {/* Main Illuminated Power Rail */}
                <div className="w-[2px] h-full bg-gradient-to-b from-[#5227FF] via-[#FF9FFC] to-[#38bdf8] shadow-[0_0_12px_rgba(255,159,252,0.8)] opacity-90" />
                {/* Secondary Telemetry Ground Rail */}
                <div className="w-[2px] h-full bg-gradient-to-b from-[#38bdf8] via-[#5227FF] to-[#FF9FFC] opacity-40" />
                {/* Subtle horizontal bus ladder ticks */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'linear-gradient(to bottom, transparent 38px, rgba(255,255,255,0.6) 38px, rgba(255,255,255,0.6) 40px)',
                    backgroundSize: '100% 40px',
                  }}
                />
              </div>

              {/* Bottom Bus Egress Terminal */}
              <div className="flex flex-col items-center mt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
                <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest bg-[#020408] px-2 py-0.5 rounded border border-white/10 mt-1">
                  CONTINUOUS // 2026+
                </span>
              </div>
            </div>

            {/* Milestones Flowing into Left & Right Lanes */}
            <div className="space-y-12 sm:space-y-16">
              {milestones.map((m, i) => {
                const isLeft = i % 2 === 0;

                return (
                  <div
                    key={m.year}
                    className={`relative flex flex-col md:flex-row items-center ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* The Central Bus Coupler Node */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-8 md:top-1/2 md:-translate-y-1/2 z-20 flex items-center justify-center pointer-events-none">
                      <div className="relative w-9 h-9 rounded-full bg-[#020408] border-2 border-[#FF9FFC] shadow-[0_0_18px_rgba(255,159,252,0.6)] flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse" />
                      </div>
                    </div>

                    {/* Milestone Card Container (Anchored Left or Right) */}
                    <div
                      className={`w-full pl-16 md:pl-0 md:w-1/2 ${
                        isLeft ? 'md:pr-14 md:text-right' : 'md:pl-14 md:text-left'
                      }`}
                    >
                      <ScrollReveal direction={isLeft ? 'left' : 'right'} delay={i * 60}>
                        <div className="relative group">
                          {/* Horizontal Circuit Leader Conduit connecting Card to Central Bus */}
                          <div
                            className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[2px] w-14 bg-gradient-to-r ${
                              isLeft
                                ? 'right-[-56px] from-transparent via-[#FF9FFC] to-[#5227FF]'
                                : 'left-[-56px] from-[#5227FF] via-[#FF9FFC] to-transparent'
                            } opacity-70 group-hover:opacity-100 group-hover:shadow-[0_0_12px_#FF9FFC] transition-all`}
                          >
                            <span
                              className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FF9FFC] ${
                                isLeft ? 'right-0' : 'left-0'
                              }`}
                            />
                          </div>

                          <GlassCard
                            spotlightColor="rgba(255, 159, 252, 0.22)"
                            className={`p-6 sm:p-8 relative ${
                              isLeft ? 'md:border-r-2 md:border-r-[#FF9FFC]/40' : 'md:border-l-2 md:border-l-[#5227FF]/40'
                            }`}
                          >
                            {/* Card Telemetry Notch */}
                            <div
                              className={`flex items-center justify-between font-mono text-[9px] text-slate-400 mb-4 pb-2 border-b border-white/10 uppercase tracking-widest ${
                                isLeft ? 'md:flex-row-reverse' : ''
                              }`}
                            >
                              <span className="flex items-center gap-1.5 text-[#FF9FFC] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9FFC] animate-pulse" />
                                {m.code} // {m.tag}
                              </span>
                              <span className="text-slate-300 font-mono text-[8.5px] px-2 py-0.5 rounded bg-white/[0.04] border border-white/10">
                                {m.status}
                              </span>
                            </div>

                            {/* Year & Metric Showcase */}
                            <div
                              className={`flex items-baseline gap-3 mb-3 ${
                                isLeft ? 'md:justify-end' : 'justify-start'
                              }`}
                            >
                              <span className="font-mono text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF9FFC] to-[#5227FF] drop-shadow-[0_0_16px_rgba(255,159,252,0.3)]">
                                {m.year}
                              </span>
                              <span className="font-mono text-[10px] text-sky-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-950/40 border border-sky-400/30">
                                {m.metric}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="font-modern font-black text-lg sm:text-xl text-white uppercase tracking-tight mb-2 group-hover:text-[#FF9FFC] transition-colors">
                              {m.title}
                            </h3>

                            {/* Detail */}
                            <p className="font-modern text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                              {m.detail}
                            </p>

                            {/* Specs Telemetry Tag */}
                            <div
                              className={`pt-3 border-t border-white/10 flex items-center font-mono text-[10px] text-slate-400 ${
                                isLeft ? 'md:justify-end' : 'justify-start'
                              }`}
                            >
                              <span className="text-slate-300 uppercase tracking-wider">
                                {m.specs}
                              </span>
                            </div>
                          </GlassCard>
                        </div>
                      </ScrollReveal>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Banner with GlassCard & IslandButton */}
        <GlassCard
          badge="LAB COLLABORATION // DIRECT ENGAGEMENT"
          spotlightColor="rgba(255, 159, 252, 0.25)"
          className="p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="font-modern font-black text-2xl text-white uppercase tracking-tight">
              COLLABORATE &amp; BUILD WITH US
            </h3>
            <p className="font-mono text-xs text-slate-400 mt-1 uppercase tracking-wider">
              Open to student recruits, industry partners, and collegiate sponsors &bull; BIT Mesra.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <IslandButton
              href="/team"
              variant="primary"
            >
              Command Tree
            </IslandButton>
            <IslandButton
              href="/contact"
              variant="glass"
            >
              Contact Lab
            </IslandButton>
          </div>
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
