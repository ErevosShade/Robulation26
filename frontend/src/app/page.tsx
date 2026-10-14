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
import DecryptedText from '@/components/DecryptedText';
import ScrollReveal from '@/components/ScrollReveal';
import AnimatedCounter from '@/components/AnimatedCounter';
import UnfurlingGallery from '@/components/ui/3d-parallax-unfurling-gallery';
import {
  ChevronDown,
  Mail,
  Crosshair,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-[#020307] text-white font-sans selection:bg-[#5227FF]/40 selection:text-[#FF9FFC] overflow-x-clip">
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
        <header className="relative z-20 w-full pt-2 sm:pt-4 flex flex-col items-center pointer-events-none pl-14 sm:pl-0">
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
            href="#about"
            className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 hover:text-white transition-colors pointer-events-auto ml-auto"
            aria-label="Navigate to About Us section"
          >
            <span>ABOUT US</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </section>

      {/* =====================================================================
          2B. ABOUT US // TEAM PRATYUMNIS (Left HUD + Right Combat Bot Wireframe)
      ===================================================================== */}
      <AboutHeroSection />

      {/* =====================================================================
          3. A LEGACY OF EXCELLENCE & AUTHENTIC STATS (robolutionbitm.in truth)
      ===================================================================== */}
      <section
        id="legacy"
        className="relative z-20 py-20 sm:py-28 px-4 sm:px-8 lg:px-12 pl-14 sm:pl-20 max-w-7xl mx-auto overflow-hidden select-none"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          {/* =================================================================
              LEFT HALF: DEDICATED GAP & VIEWPORT FOR UPCOMING USER PNG
              (Sticky on desktop so CAD wireframe stays in view alongside telemetry)
          ================================================================= */}
          <div className="lg:col-span-6 xl:col-span-5 relative order-2 lg:order-1 lg:sticky lg:top-24 self-start">
            <ScrollReveal>
              <div className="relative group rounded-[4px] bg-transparent border border-white/20 p-2 sm:p-3 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
                {/* Outer Framing Aerospace Chamfers */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/70 z-20 pointer-events-none" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/70 z-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/70 z-20 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/70 z-20 pointer-events-none" />

                {/* Top Telemetry Bar */}
                <div className="relative z-20 flex items-center justify-between px-3 py-1.5 bg-transparent border-b border-white/10 text-[9px] font-mono text-slate-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-3 h-3 text-[#FF9FFC] animate-spin" style={{ animationDuration: '10s' }} />
                    <span className="tracking-widest uppercase font-bold text-white">
                      DWG: ROB-ROBOCON-TRACK // ARTICULATED MANIPULATOR
                    </span>
                  </div>
                  <span className="text-[#FF9FFC] font-mono text-[8.5px] uppercase font-bold">[ ABU ROBOCON ]</span>
                </div>

                {/* Tracked Manipulator Robot Image (Watermark Erased, 100% Alpha Transparent) */}
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] bg-transparent overflow-hidden flex items-center justify-center">
                  <Image
                    src="/tracked-bot-transparent.png"
                    alt="Robolution Tracked Manipulator Robot CAD Wireframe"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 45vw"
                    className="object-contain filter contrast-125 brightness-115 drop-shadow-[0_0_16px_rgba(255,255,255,0.22)] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                {/* Bottom Status Bar */}
                <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 bg-transparent border-t border-white/10 text-[9px] font-mono text-slate-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#FF9FFC] font-bold">// ARCHITECTURE:</span>
                    <span className="text-slate-100">CONTINUOUS TREAD CHASSIS &bull; END-EFFECTOR CLAW</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>BIT MESRA ROBOTICS</span>
                    <span className="text-white">&bull;</span>
                    <span className="text-[#FF9FFC]">TEAM PRATYUMNIS</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* =================================================================
              RIGHT HALF: EVERYTHING ALIGNED TO THE RIGHT SIDE (Header + 3 Cards + Mission + Honors)
          ================================================================= */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center order-1 lg:order-2 space-y-6">
            <ScrollReveal>
              <div className="space-y-4">
                <span className="font-mono text-xs text-[#FF9FFC] font-bold tracking-widest uppercase block drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  <DecryptedText
                    text="// CLUB HERITAGE &amp; INSTITUTIONAL RECORD • EST. 2001"
                    animateOn="view"
                    speed={30}
                    sequential={true}
                    characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
                    className="text-[#FF9FFC]"
                  />
                </span>
                <h2 className="font-modern font-black text-2xl sm:text-4xl xl:text-5xl tracking-tight text-white uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  A LEGACY OF <span className="animate-text-shimmer">EXCELLENCE &amp; INNOVATION</span>
                </h2>

                <p className="font-sans text-xs sm:text-sm text-slate-200 leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  Headquartered at BIT Mesra, <strong className="text-white font-semibold">Robolution (Team Pratyumnis)</strong> unites mechanical design, electronics, and AI to build autonomous systems and heavyweight combat robots. Beyond representing the institute at <strong className="text-white font-semibold">ABU ROBOCON</strong> and national arenas, we mentor future engineers through hands-on workshops and <strong className="text-[#FF9FFC] font-semibold">RoboSaga</strong>, our flagship annual techno-management festival.
                </p>
              </div>
            </ScrollReveal>

            {/* 3 Verified Metrics Cards - 100% Transparent Cyber-Glass */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 reveal-stagger pt-1">
              <ScrollReveal>
                <GlassCard
                  badge="VISION // 5 PILLARS"
                  spotlightColor="rgba(255, 159, 252, 0.25)"
                  transparent={true}
                  className="p-4 sm:p-5"
                >
                  <div>
                    <span className="font-mono text-2xl sm:text-3xl xl:text-4xl font-black text-[#FF9FFC] tracking-tight block drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                      5 DOMAINS
                    </span>
                    <span className="font-modern font-bold text-xs sm:text-sm text-white uppercase mt-2 block drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      Interdisciplinary R&amp;D
                    </span>
                    <p className="font-mono text-[10px] text-slate-300 mt-1 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      Uniting mechanical CAD, embedded electronics, computer vision, control, and AI.
                    </p>
                  </div>
                </GlassCard>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <GlassCard
                  badge="ECOSYSTEM // PARTNERS"
                  spotlightColor="rgba(52, 211, 153, 0.25)"
                  transparent={true}
                  className="p-4 sm:p-5"
                >
                  <div>
                    <span className="font-mono text-2xl sm:text-3xl xl:text-4xl font-black text-emerald-400 tracking-tight block drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                      6+ BRANDS
                    </span>
                    <span className="font-modern font-bold text-xs sm:text-sm text-white uppercase mt-2 block drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      Industry &amp; Alumni Backing
                    </span>
                    <p className="font-mono text-[10px] text-slate-300 mt-1 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      Supported by NVIDIA, Texas Instruments, Gilbert Rugby, HRS, and BITOSA.
                    </p>
                  </div>
                </GlassCard>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <GlassCard
                  badge="OPERATIONS // 2026–27"
                  spotlightColor="rgba(251, 191, 36, 0.25)"
                  transparent={true}
                  className="p-4 sm:p-5"
                >
                  <div>
                    <span className="font-mono text-2xl sm:text-3xl xl:text-4xl font-black text-amber-400 tracking-tight block drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                      &#8377;11.8L
                    </span>
                    <span className="font-modern font-bold text-xs sm:text-sm text-white uppercase mt-2 block drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      Annual R&amp;D Scale
                    </span>
                    <p className="font-mono text-[10px] text-slate-300 mt-1 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      Powering Robocon, IITB Robowars, ISRO ASCEND UAVs, and RoboSaga.
                    </p>
                  </div>
                </GlassCard>
              </ScrollReveal>
            </div>

            {/* High-Density Aerospace Telemetry Strip (Brochure Records & Fleet in Short) */}
            <ScrollReveal delay={250}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1 font-mono text-[9px] text-slate-300">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-white/[0.03] border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF9FFC] shadow-[0_0_6px_#FF9FFC]" />
                  <span className="text-[#FF9FFC] font-bold uppercase tracking-wider">ROBOCON:</span>
                  <span className="text-slate-200">
                    &apos;13 Rookie Award &bull; &apos;15 MathWorks Award &bull; &apos;16 &amp; &apos;18 National Rep &bull; &apos;21 Perfect CAD
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-white/[0.03] border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                  <span className="text-cyan-400 font-bold uppercase tracking-wider">FLEET:</span>
                  <span className="text-slate-200">
                    Robowars Combat &bull; Turtle Bot AMR &bull; Synapse 6-DOF &bull; Hexapod
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
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
