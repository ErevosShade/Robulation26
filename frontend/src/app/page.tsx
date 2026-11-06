'use client';

import React from 'react';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import TechText from '@/components/TechText';
import RoverWireframe3D from '@/components/RoverWireframe3D';
import HudBox from '@/components/HudBox';
import AboutHeroSection from '@/components/AboutHeroSection';
import BottomDock from '@/components/BottomDock';
import StarBorder from '@/components/StarBorder';
import MoltenMetal from '@/components/MoltenMetal';
import GlassCard from '@/components/GlassCard';
import IslandButton from '@/components/IslandButton';
import ScrollReveal from '@/components/ScrollReveal';
import AnimatedCounter from '@/components/AnimatedCounter';
import DecryptedText from '@/components/DecryptedText';
import UnfurlingGallery from '@/components/ui/3d-parallax-unfurling-gallery';
import {
  Wrench,
  Cpu,
  Flame,
  ChevronDown,
  Mail,
  Crosshair,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-[#020307] text-white font-sans selection:bg-cyan-500/30 selection:text-white overflow-x-clip">
      {/* =====================================================================
          FULL-PAGE BACKGROUND: <MoltenMetal /> REACT BITS WEBGL CAUSTICS
      ===================================================================== */}
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
        <div className="hidden sm:block absolute top-0 right-0 z-30 w-[240px] sm:w-[270px] xl:w-[290px] h-[44px] sm:h-[48px] opacity-95 hover:opacity-100 transition-opacity pointer-events-auto">
          <HudBox compact={true} theme="dark" title="EST. 2001 // BIT MESRA" />
        </div>

        {/* Top Header: Heavy Structural Architectural Title with TechText */}
        <header className="relative z-20 w-full pt-2 sm:pt-4 flex flex-col items-center pointer-events-none px-4 md:pl-20">
          <div className="inline-flex items-center px-3.5 py-1 rounded-[2px] bg-white/[0.04] border border-white/20 shadow-xs font-mono text-[9px] sm:text-[10px] tracking-widest uppercase mb-2 pointer-events-auto backdrop-blur-md">
            <span className="bg-gradient-to-r from-zinc-300 via-white to-zinc-400 bg-clip-text text-transparent font-semibold">
              OFFICIAL ROBOTICS SOCIETY // TEAM PRATYUMNIS // BIT MESRA
            </span>
          </div>

          <div className="w-full max-w-4xl h-[76px] sm:h-[94px] md:h-[106px] px-4 pointer-events-auto flex items-center justify-center">
            <TechText
              text="ROBOLUTION"
              fontFamily="'Space Grotesk', 'Arial Black', sans-serif"
              fontWeight={900}
              fontSize={86}
              letterSpacing={-0.03}
              strokeWidth={2}
              gradient={true}
              color="#ffffff"
              accentColor="#38bdf8"
              className="w-full h-full"
            />
          </div>

          <p className="relative font-mono text-[9px] xs:text-[10px] sm:text-[11.5px] font-bold tracking-[0.16em] sm:tracking-[0.25em] uppercase mt-1 px-2">
            <span className="text-slate-400 transition-opacity duration-700 ease-out group-hover/hero:opacity-0">
              AUTONOMOUS MECHATRONICS &bull; ABU ROBOCON &bull; ROBOSAGA FEST
            </span>
            <span
              className="absolute inset-0 bg-gradient-to-r from-sky-300 via-white to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(56,189,248,0.5)] opacity-0 transition-opacity duration-700 ease-out group-hover/hero:opacity-100 pointer-events-none select-none text-center"
              aria-hidden="true"
            >
              AUTONOMOUS MECHATRONICS &bull; ABU ROBOCON &bull; ROBOSAGA FEST
            </span>
          </p>
        </header>

        {/* 3D CAD Wireframe Rover Flanked by Sci-Fi HUD Callout Boxes */}
        <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-center -mt-2 sm:-mt-4 pointer-events-none px-4 md:pl-20">
          {/* Subtle Ambient Cosmic Glow Spotlight */}
          <div
            className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[380px] sm:w-[680px] sm:h-[500px] pointer-events-none z-0 opacity-40"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.15) 0%, rgba(14, 165, 233, 0.05) 50%, transparent 75%)',
              filter: 'blur(24px)',
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
                badge="ARENA CONTINGENT"
                title="TEAM PRATYUMNIS"
                subtitle="ABU ROBOCON & NATIONALS"
                description="ABU ROBOCON 100/100 CAD DESIGN SCORE & &#8377;1.5L MATHWORKS NATIONAL AWARD."
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
                badge="FLAGSHIP FEST"
                title="ROBOSAGA '27"
                subtitle="TECHNO-MANAGEMENT ARENA"
                description="3-DAY HARDWARE CARNIVAL: COMBAT BOTS, AUTONOMOUS MAZE SOLVERS & 1000+ PARTICIPANTS."
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
                badge="ARENA CONTINGENT"
                title="TEAM PRATYUMNIS"
                subtitle="ABU ROBOCON & NATIONALS"
              />
            </div>
            <div className="w-full sm:w-1/2 h-[120px]">
              <HudBox
                variant="shape2"
                theme="dark"
                leaderSide="left"
                badge="FLAGSHIP FEST"
                title="ROBOSAGA '27"
                subtitle="TECHNO-MANAGEMENT ARENA"
              />
            </div>
          </div>
        </div>

        {/* Bottom Smooth Trapezoid Dock with Action Buttons (Minimizes to Sticky Ball on Scroll) */}
        <BottomDock theme="dark" />

        {/* Bottom Navigation Link */}
        <div className="relative z-20 pb-4 px-4 sm:px-6 flex items-center justify-end pointer-events-none md:pl-20">
          <a
            href="#about"
            className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 hover:text-white transition-colors pointer-events-auto"
            aria-label="Navigate to About Us section"
          >
            <span>ABOUT US</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </section>

      {/* =====================================================================
          2B. ABOUT US // TEAM PRATYUMNIS (Editorial 3-Part Composition)
      ===================================================================== */}
      <AboutHeroSection />

      {/* =====================================================================
          3. INSTITUTIONAL DOMAINS // WHAT WE DO AT ROBOLUTION
      ===================================================================== */}
      <section
        id="disciplines"
        className="relative z-20 py-24 sm:py-32 px-6 sm:px-12 pl-14 sm:pl-20 max-w-7xl mx-auto"
      >
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <span className="font-mono text-xs text-slate-400 font-bold tracking-widest uppercase block mb-1">
                // INSTITUTIONAL DOMAINS
              </span>
              <h2 className="font-modern font-black text-3xl sm:text-5xl tracking-tight text-white uppercase mt-1">
                WHAT WE DO AT ROBOLUTION
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
            spotlightColor="rgba(255, 255, 255, 0.08)"
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-white mb-6 shadow-sm">
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
            spotlightColor="rgba(255, 255, 255, 0.08)"
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-rose-400 mb-6 shadow-sm">
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
            spotlightColor="rgba(255, 255, 255, 0.08)"
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-emerald-400 mb-6 shadow-sm">
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
          3B. 3D PARALLAX UNFURLING GALLERY // HARDWARE IN MOTION
      ===================================================================== */}
      <section id="gallery-unfurl" className="relative z-20 w-full">
        {/* Aerospace HUD Section Header */}
        <div className="pt-24 pb-8 px-6 sm:px-12 pl-14 sm:pl-20 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-[#FF9FFC] font-bold tracking-widest uppercase block mb-1">
              <DecryptedText
                text="// 3D MATRIX TELEMETRY • LIVE CAPTURES"
                animateOn="view"
                speed={30}
                sequential={true}
                characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
                className="text-[#FF9FFC]"
              />
            </span>
            <h2 className="font-modern font-black text-3xl sm:text-5xl tracking-tight text-white uppercase mt-1">
              HARDWARE <span className="animate-text-shimmer">IN MOTION</span>
            </h2>
          </div>
          <p className="font-modern text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed font-mono">
            // SCROLL DOWN TO UNFURL: 3D UNROLLING HARDWARE FLIGHT-DECK &amp; ARENA COMBAT CAPTURES.
          </p>
        </div>

        {/* 3D Parallax Unfurling Matrix */}
        <UnfurlingGallery embedded={true} />
      </section>

      {/* =====================================================================
          4. ROBOSAGA '26 FEATURE BANNER WITH GLASSMORPHISM & ISLAND BUTTONS
      ===================================================================== */}
      <section
        id="robosaga"
        className="relative z-20 py-20 sm:py-32 px-4 sm:px-8 md:pl-20 max-w-7xl mx-auto"
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
        className="relative z-20 py-20 sm:py-36 px-4 sm:px-8 md:pl-20 max-w-5xl mx-auto"
      >
        <GlassCard
          badge="OUR ENGINEERING CREED // HARDWARE PRIMACY"
          spotlightColor="rgba(255, 159, 252, 0.25)"
          className="text-center p-6 sm:p-14"
        >
          <blockquote className="font-modern font-black text-2xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase leading-tight">
            &ldquo;Software is easy until it has to push <span className="animate-text-shimmer">30 kilograms of steel at 40 kilometers an hour</span>.&rdquo;
          </blockquote>
          <p className="mt-6 sm:mt-8 font-modern text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
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
      <footer id="contact" className="relative z-20 bg-[#04060a]/70 backdrop-blur-xl border-t border-white/5 py-14 px-4 sm:px-8 md:pl-20">
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
