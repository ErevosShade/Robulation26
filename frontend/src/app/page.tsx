'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import TechText from '@/components/TechText';
import RoverWireframe3D from '@/components/RoverWireframe3D';
import HudBox from '@/components/HudBox';
import BottomDock from '@/components/BottomDock';
import StarBorder from '@/components/StarBorder';
import MoltenMetal from '@/components/MoltenMetal';
import GlassCard from '@/components/GlassCard';
import IslandButton from '@/components/IslandButton';
import DecryptedText from '@/components/DecryptedText';
import ScrollReveal from '@/components/ScrollReveal';
import AnimatedCounter from '@/components/AnimatedCounter';
import {
  Wrench,
  Cpu,
  Compass,
  Trophy,
  Flame,
  ArrowUpRight,
  ChevronDown,
  Terminal,
  Shield,
  Layers,
  MapPin,
  Mail,
  Activity,
  Zap,
  Gauge,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Award,
  Users,
  Target,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'robocon' | 'robosaga'>('robocon');

  return (
    <div className="relative w-full min-h-screen bg-[#020307] text-white font-sans selection:bg-[#5227FF]/40 selection:text-[#FF9FFC] overflow-x-hidden">
      {/* =====================================================================
          FULL-PAGE BACKGROUND: <MoltenMetal /> REACT BITS WEBGL CAUSTICS
      ===================================================================== */}
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
        {/* Subtle vignette overlay to keep text ultra-crisp and readable */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_35%,#020307_92%] opacity-60" />
      </div>

      {/* =====================================================================
          1. LEFT SMOOTH TRAPEZOID GLASSMORPHIC SIDEBAR (From spark Branch)
      ===================================================================== */}
      <Sidebar theme="dark" />

      {/* =====================================================================
          2. HERO CENTERSTAGE: THE ELEVATED SPARK ARCHITECTURAL COMPOSITION
      ===================================================================== */}
      <section
        id="hero"
        className="relative w-full h-[100dvh] min-h-[700px] flex flex-col justify-between overflow-hidden select-none z-10 group/hero"
      >
        {/* Top Right Corner Tech Box: EST. 2001 // BIT MESRA */}
        <div className="absolute top-0 right-0 z-30 w-[240px] sm:w-[270px] xl:w-[290px] h-[44px] sm:h-[48px] opacity-95 hover:opacity-100 transition-opacity pointer-events-auto">
          <HudBox compact={true} theme="dark" title="EST. 2001 // BIT MESRA" />
        </div>

        {/* Top Header: Heavy Structural Architectural Title with TechText */}
        <header className="relative z-20 w-full pt-8 sm:pt-12 flex flex-col items-center pointer-events-none pl-14 sm:pl-0">
          <div className="inline-flex items-center px-4 py-1.5 rounded-[2px] bg-white/[0.04] border border-white/20 shadow-xs font-mono text-[9px] sm:text-[10px] tracking-widest uppercase mb-2 pointer-events-auto backdrop-blur-md">
            <span className="bg-gradient-to-r from-slate-200 via-white to-slate-400 bg-clip-text text-transparent font-semibold">
              OFFICIAL ROBOTICS SOCIETY // TEAM PRATYUMNIS // BIT MESRA
            </span>
          </div>

          <div className="w-full max-w-3xl h-[60px] sm:h-[74px] px-4 pointer-events-auto flex items-center justify-center">
            <TechText
              text="ROBOLUTION"
              fontFamily="'Space Grotesk', 'Arial Black', sans-serif"
              fontWeight={900}
              fontSize={64}
              letterSpacing={-0.03}
              strokeWidth={2}
              gradient={true}
              color="#ffffff"
              accentColor="#FF9FFC"
              className="w-full h-full"
            />
          </div>

          <p className="relative font-mono text-[10px] sm:text-[11.5px] font-bold tracking-[0.25em] uppercase mt-1">
            <span className="text-slate-400 transition-opacity duration-700 ease-out group-hover/hero:opacity-0">
              AUTONOMOUS MECHATRONICS &bull; ABU ROBOCON &bull; ROBOSAGA FEST
            </span>
            <span
              className="absolute inset-0 bg-gradient-to-r from-[#FF9FFC] via-white to-[#5227FF] bg-clip-text text-transparent drop-shadow-[0_0_14px_rgba(255,159,252,0.85)] opacity-0 transition-opacity duration-700 ease-out group-hover/hero:opacity-100 pointer-events-none select-none text-center"
              aria-hidden="true"
            >
              AUTONOMOUS MECHATRONICS &bull; ABU ROBOCON &bull; ROBOSAGA FEST
            </span>
          </p>
        </header>

        {/* 3D CAD Wireframe Rover Flanked by Sci-Fi HUD Callout Boxes */}
        <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-center -mt-2 sm:-mt-4 pointer-events-none px-4 pl-14 sm:pl-20">
          {/* Subtle Ambient Glow Spotlight matching MoltenMetal Palette */}
          <div
            className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[380px] sm:w-[680px] sm:h-[500px] pointer-events-none z-0 opacity-70"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(255, 159, 252, 0.22) 0%, rgba(82, 39, 255, 0.18) 40%, rgba(82, 39, 255, 0.03) 70%, transparent 80%)',
              filter: 'blur(22px)',
            }}
          />

          {/* Center Container holding Rover & Flanking Desktop HUD Boxes */}
          <div className="relative w-full max-w-[1400px] h-full flex items-center justify-center">
            {/* Left HUD Callout Box (Lower) */}
            <div className="hidden md:block absolute left-2 xl:left-8 top-[55%] -translate-y-1/2 w-[320px] lg:w-[350px] xl:w-[390px] h-[124px] lg:h-[128px] xl:h-[138px] z-20 pointer-events-auto">
              <HudBox
                variant="shape1"
                theme="dark"
                leaderSide="right"
                badge="INSTITUTIONAL RECORD"
                title="BIT MESRA"
                subtitle="OFFICIAL ROBOTICS SOCIETY"
                description="TEAM PRATYUMNIS: ABU ROBOCON 100/100 CAD DESIGN SCORE & MATHWORKS NATIONAL AWARD."
              />
            </div>

            {/* Center 3D NASA Curiosity Rover Wireframe with Smooth Cursor Tracking */}
            <div className="relative z-10 w-full max-w-4xl sm:max-w-5xl h-[380px] sm:h-[440px] lg:h-[490px] flex items-center justify-center pointer-events-none -translate-y-6 sm:-translate-y-8">
              <RoverWireframe3D modelPath="/curiosity.glb" />
            </div>

            {/* Right HUD Callout Box (Upper Right) */}
            <div className="hidden md:block absolute right-2 xl:right-8 top-[36%] -translate-y-1/2 w-[320px] lg:w-[350px] xl:w-[390px] h-[124px] lg:h-[128px] xl:h-[138px] z-20 pointer-events-auto">
              <HudBox
                variant="shape2"
                theme="dark"
                leaderSide="left"
                badge="FLAGSHIP FESTIVAL"
                title="ROBOSAGA '26"
                subtitle="EASTERN INDIA'S ARENA"
                description="3-DAY HARDWARE CARNIVAL: 30KG COMBAT BOTS, AUTONOMOUS MAZE SOLVERS & 1000+ MENTORED."
              />
            </div>
          </div>

          {/* Mobile / Tablet HUD Boxes (< md) */}
          <div className="md:hidden w-full max-w-md flex flex-col sm:flex-row gap-3 pointer-events-auto mt-[-10px] mb-2 px-2 z-20">
            <div className="w-full sm:w-1/2 h-[120px]">
              <HudBox
                variant="shape1"
                theme="dark"
                leaderSide="right"
                badge="CAMPUS SOCIETY"
                title="BIT MESRA"
                subtitle="OFFICIAL ROBOTICS SOCIETY"
              />
            </div>
            <div className="w-full sm:w-1/2 h-[120px]">
              <HudBox
                variant="shape2"
                theme="dark"
                leaderSide="left"
                badge="ANNUAL CARNIVAL"
                title="ROBOSAGA '26"
                subtitle="EASTERN INDIA ARENA"
              />
            </div>
          </div>
        </div>

        {/* Bottom Smooth Trapezoid Dock with Action Buttons */}
        <BottomDock theme="dark" />

        {/* Bottom Status Telemetry Bar */}
        <div className="relative z-20 pb-4 px-6 flex items-center justify-between pointer-events-none pl-14 sm:pl-20">
          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-slate-400 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9FFC] animate-pulse" />
            <span>ROBOLUTION TELEMETRY // BIT MESRA // PRATYUMNIS LAB 01</span>
          </div>

          <a
            href="#legacy"
            className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 hover:text-white transition-colors pointer-events-auto ml-auto"
            aria-label="Navigate to Legacy section"
          >
            <span>LEGACY ARCHIVE</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </section>

      {/* =====================================================================
          3. A LEGACY OF EXCELLENCE & AUTHENTIC STATS (robolutionbitm.in truth)
      ===================================================================== */}
      <section
        id="legacy"
        className="relative z-20 py-24 sm:py-32 px-6 sm:px-12 pl-14 sm:pl-20 max-w-7xl mx-auto"
      >
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <span className="font-mono text-xs text-[#FF9FFC] font-bold tracking-widest uppercase block mb-1">
                <DecryptedText
                  text="// CLUB HERITAGE • EST. 2001"
                  animateOn="view"
                  speed={30}
                  sequential={true}
                  characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
                  className="text-[#FF9FFC]"
                />
              </span>
              <h2 className="font-modern font-black text-3xl sm:text-5xl tracking-tight text-white uppercase mt-1">
                A LEGACY OF <span className="animate-text-shimmer">EXCELLENCE &amp; INNOVATION</span>
              </h2>
            </div>
            <p className="font-modern text-sm text-slate-400 max-w-md leading-relaxed">
              Founded over two decades ago at Birla Institute of Technology, Mesra, Robolution (Team Pratyumnis) has grown into Eastern India&apos;s most formidable collegiate robotics collective.
            </p>
          </div>
        </ScrollReveal>

        {/* Verified Club Track Record Metrics (Double-Bezel GlassCard with Dynamic Cursor Spotlight) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 reveal-stagger">
          <ScrollReveal>
            <GlassCard
              badge="RECORD // 2001-2026"
              spotlightColor="rgba(255, 159, 252, 0.25)"
            >
              <div>
                <AnimatedCounter target={24} suffix="+" className="font-mono text-4xl sm:text-5xl font-black text-[#FF9FFC] tracking-tight block" />
                <span className="font-modern font-bold text-sm sm:text-base text-white uppercase mt-3 block">
                  Years of Excellence
                </span>
                <p className="font-mono text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Continuous collegiate engineering research and mechatronic design since our founding in 2001.
                </p>
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <GlassCard
              badge="TALENT // ALUMNI"
              spotlightColor="rgba(52, 211, 153, 0.25)"
            >
              <div>
                <AnimatedCounter target={1000} suffix="+" className="font-mono text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight block" />
                <span className="font-modern font-bold text-sm sm:text-base text-white uppercase mt-3 block">
                  Students Trained
                </span>
                <p className="font-mono text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Empowering undergraduates across mechanical, electronics, and CS with hands-on hardware training.
                </p>
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <GlassCard
              badge="ARENA // PODIUMS"
              spotlightColor="rgba(251, 191, 36, 0.25)"
            >
              <div>
                <AnimatedCounter target={50} suffix="+" className="font-mono text-4xl sm:text-5xl font-black text-amber-400 tracking-tight block" />
                <span className="font-modern font-bold text-sm sm:text-base text-white uppercase mt-3 block">
                  Competitions Won
                </span>
                <p className="font-mono text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Podiums at ABU Robocon India, Techfest IIT Bombay, Kshitij IIT Kharagpur, and national robot combat arenas.
                </p>
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <GlassCard
              badge="NETWORK // LABS"
              spotlightColor="rgba(168, 85, 247, 0.25)"
            >
              <div>
                <AnimatedCounter target={500} suffix="+" className="font-mono text-4xl sm:text-5xl font-black text-purple-400 tracking-tight block" />
                <span className="font-modern font-bold text-sm sm:text-base text-white uppercase mt-3 block">
                  Community Reach
                </span>
                <p className="font-mono text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Active engineering network across robotics research labs, tech startups, and leading automotive firms.
                </p>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* =====================================================================
          4. WHAT WE DO: WORKSHOPS, ROBOSAGA & RESEARCH PROJECTS
      ===================================================================== */}
      <section
        id="disciplines"
        className="relative z-20 py-24 sm:py-32 px-6 sm:px-12 pl-14 sm:pl-20 max-w-7xl mx-auto"
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
              Bridging foundational theory with battlefield-ready hardware: custom CAD kinematics, PCB manufacturing, and embedded control.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Pillars Bento Grid with Double-Bezel GlassCard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Pillar 1: Workshops & Training */}
          <GlassCard
            badge="FOUNDATIONAL LAB // 01"
            spotlightColor="rgba(82, 39, 255, 0.25)"
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
                  Eastern India&apos;s premier annual techno-mechatronics extravaganza organized on the BIT Mesra campus. Featuring high-energy combat robot wars, line-tracking sprints, maze navigators, and design exhibitions.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 font-mono text-[11px] text-slate-400 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10">Robot Wars</span>
                <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10">Maze Solvers</span>
                <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10">Tech Carnival</span>
              </div>
            </div>
          </GlassCard>

          {/* Pillar 3: Projects & Research (Team Pratyumnis) */}
          <GlassCard
            badge="COMPETITIVE WING // 03"
            spotlightColor="rgba(52, 211, 153, 0.25)"
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
                  Engineering high-precision autonomous mechatronic systems for the prestigious ABU Robocon competition. Developing 4-wheel holonomic omni-drive bases, pneumatic projectile launchers, and computer vision guidance.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 font-mono text-[11px] text-slate-400 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10">ABU Robocon</span>
                <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10">Holonomic Drive</span>
                <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10">ROS &bull; Vision</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* =====================================================================
          5. HALL OF FAME: AUTHENTIC NATIONAL COMPETITION HONORS
      ===================================================================== */}
      <section
        id="arena"
        className="relative z-20 py-24 sm:py-32 px-6 sm:px-12 pl-14 sm:pl-20 max-w-7xl mx-auto"
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
            >
              <div>
                <span className="font-mono text-3xl sm:text-4xl font-black text-[#FF9FFC]">&#8377;50,000</span>
                <h3 className="font-modern text-lg font-bold text-white uppercase mt-3">
                  MathWorks Award &amp; Rank
                </h3>
                <p className="font-modern text-xs text-slate-300 mt-2 leading-relaxed">
                  Bagged the MathWorks National Award accompanied by a cash prize of &#8377;50,000, along with the title of Best Non-Quarterfinalist Team.
                </p>
              </div>
            </GlassCard>

            {/* Honor 3: Robocon 2013 */}
            <GlassCard
              badge="ABU ROBOCON 2013 // PUNE"
              spotlightColor="rgba(251, 191, 36, 0.25)"
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
            >
              <div>
                <span className="font-mono text-3xl sm:text-4xl font-black text-amber-400">3 DAYS</span>
                <h3 className="font-modern text-lg font-bold text-white uppercase mt-3">
                  Carnival of Mechatronics
                </h3>
                <p className="font-modern text-xs text-slate-300 mt-2 leading-relaxed">
                  Our flagship techno-management festival bringing together collegiate hardware hackers, makers, and innovators across Eastern India.
                </p>
              </div>
            </GlassCard>

            <GlassCard
              badge="ENCLOSED STEEL CAGE"
              spotlightColor="rgba(244, 63, 94, 0.25)"
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

      {/* =====================================================================
          6. ROBOSAGA '26 FEATURE BANNER WITH GLASSMORPHISM & ISLAND BUTTONS
      ===================================================================== */}
      <section
        id="robosaga"
        className="relative z-20 py-24 sm:py-32 px-6 sm:px-12 pl-14 sm:pl-20 max-w-7xl mx-auto"
      >
        <GlassCard
          badge="ANNUAL TECHNO-MECHATRONICS FESTIVAL // BIT MESRA"
          spotlightColor="rgba(255, 159, 252, 0.2)"
          className="p-8 sm:p-14"
        >
          <div className="relative z-10 max-w-3xl">
            <h2 className="font-modern font-black text-4xl sm:text-6xl text-white uppercase tracking-tight">
              ROBOSAGA &apos;26
            </h2>
            <p className="font-modern text-sm sm:text-base text-slate-200 mt-4 leading-relaxed">
              Eastern India&apos;s premier collegiate robotics arena. 3 days of heavy-armor combat wars, autonomous maze navigators, high-speed line followers, and CAD fabrication hackathons hosted at Birla Institute of Technology, Mesra.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <IslandButton
                href="https://www.facebook.com/TeamRobolution"
                external={true}
                variant="primary"
              >
                Register for RoboSaga
              </IslandButton>

              <IslandButton
                href="https://www.instagram.com/robolution.bitm/"
                external={true}
                variant="glass"
              >
                Follow @robolution.bitm
              </IslandButton>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* =====================================================================
          7. HARDWARE MANIFESTO: NO AI SLOP, JUST REAL HARDWARE
      ===================================================================== */}
      <section
        id="manifesto"
        className="relative z-20 py-28 sm:py-36 px-6 sm:px-12 pl-14 sm:pl-20 max-w-5xl mx-auto"
      >
        <GlassCard
          badge="OUR ENGINEERING CREED // HARDWARE PRIMACY"
          spotlightColor="rgba(255, 159, 252, 0.25)"
          className="text-center p-8 sm:p-14"
        >
          <blockquote className="font-modern font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase leading-tight">
            &ldquo;Software is easy until it has to push <span className="animate-text-shimmer">30 kilograms of steel at 40 kilometers an hour</span>.&rdquo;
          </blockquote>
          <p className="mt-8 font-modern text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            At Robolution, we do not build mockups. We mill structural aluminum, design custom multi-layer circuit boards, debug interrupt routines at 3 AM, and torture-test every robot until it survives the arena.
          </p>
          <div className="mt-8 flex justify-center">
            <IslandButton href="/about" variant="glass">
              Read Our Full Heritage &amp; Vision
            </IslandButton>
          </div>
        </GlassCard>
      </section>

      {/* =====================================================================
          8. INSTITUTIONAL FOOTER & AUTHENTIC CONTACT
      ===================================================================== */}
      <footer id="contact" className="relative z-20 bg-[#04060a]/70 backdrop-blur-xl border-t border-white/5 py-16 px-6 sm:px-12 pl-14 sm:pl-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col">
            <span className="font-modern font-black text-xl text-white uppercase tracking-tight flex items-center gap-2">
              <Image
                src="/robolution-icon-bright.png"
                alt="Robolution Logo"
                width={24}
                height={24}
                className="object-contain filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
              />
              <span>ROBOLUTION // BIT MESRA</span>
            </span>
            <span className="font-mono text-xs text-slate-400 mt-2">
              Birla Institute of Technology, Mesra, Ranchi, Jharkhand 835215
            </span>
            <span className="font-mono text-[11px] text-slate-500 mt-1">
              Team Pratyumnis &bull; Founded 2001 &bull; Department of Production &amp; Industrial Engg.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <a
              href="https://www.instagram.com/robolution.bitm/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF9FFC] transition-colors flex items-center gap-1.5 font-mono text-xs"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>@robolution.bitm</span>
            </a>

            <a
              href="https://www.linkedin.com/company/robolution-bit-mesra/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF9FFC] transition-colors flex items-center gap-1.5 font-mono text-xs"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              <span>LinkedIn</span>
            </a>

            <a
              href="https://www.facebook.com/TeamRobolution"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF9FFC] transition-colors flex items-center gap-1.5 font-mono text-xs"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              <span>Facebook</span>
            </a>

            <a
              href="mailto:pratyumnis@bitmesra.ac.in"
              className="hover:text-[#FF9FFC] transition-colors flex items-center gap-1.5 font-mono text-xs font-semibold"
            >
              <Mail className="w-4 h-4" />
              <span>pratyumnis@bitmesra.ac.in</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[10px] text-slate-500">
          <span>&copy; {new Date().getFullYear()} ROBOLUTION &bull; TEAM PRATYUMNIS &bull; BIT MESRA</span>
          <span>AUTONOMOUS SYSTEMS &bull; MECHATRONICS LAB</span>
        </div>
      </footer>
    </div>
  );
}
