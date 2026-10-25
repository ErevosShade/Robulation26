'use client';

import React from 'react';
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
  Compass,
  Target,
  Sparkles,
  Shield,
  Layers,
  Award,
  Users,
  ChevronRight,
  Mail,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  Cpu
} from 'lucide-react';

const values = [
  {
    icon: Sparkles,
    title: 'Innovation',
    description: 'We experiment rapidly, iterate on real hardware, learn from mechanical failures, and build unconventional mechatronic solutions.',
    tag: 'EXPLORE & EXPERIMENT'
  },
  {
    icon: Users,
    title: 'Teamwork',
    description: 'Robots are complex multi-disciplinary systems. We solve hard cross-engineering challenges through trust, open communication, and shared ownership.',
    tag: 'CROSS-DISCIPLINARY'
  },
  {
    icon: Shield,
    title: 'Discipline',
    description: 'We value consistency, strict CAD documentation, electrical validation, finite-element testing, and high-standard manufacturing practices.',
    tag: 'PRECISION & QA'
  },
  {
    icon: Compass,
    title: 'Growth',
    description: 'Every senior engineer mentors junior recruits. We deliberately build an ecosystem that transforms curious freshmen into national-level builders.',
    tag: 'CONTINUOUS EVOLUTION'
  }
];

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
    year: '2015',
    code: 'EXP-02',
    tag: 'NATIONAL LAURELS',
    title: 'MathWorks National Award',
    detail: 'Won the MathWorks National Award accompanied by an INR 50,000 cash prize at ABU Robocon India, earning the title of Best Non-Quarterfinalist Team.',
    specs: 'ABU ROBOCON // INR 50K PRIZE',
    metric: 'BEST NON-QF TEAM',
    status: 'PODIUM VALIDATED',
  },
  {
    year: '2021',
    code: 'EXP-03',
    tag: 'CAD PRECISION VICTORY',
    title: 'Perfect 100/100 CAD Score',
    detail: 'Achieved an unprecedented 100/100 score in 3D CAD design analysis by national and international judges for kinematic validation and structural optimization.',
    specs: 'SOLIDWORKS FEA // KINEMATICS',
    metric: '100/100 CAD SCORE',
    status: 'MAX CAD METRIC',
  },
  {
    year: '2023',
    code: 'EXP-04',
    tag: 'INFRASTRUCTURE LEAP',
    title: 'Build Culture Acceleration',
    detail: 'Conducted high-density campus workshops, onboarded custom multi-layer PCB fabrication pipelines, and deployed autonomous micro-rover testbeds.',
    specs: 'MULTI-LAYER PCBS // ROVER RIGS',
    metric: '200+ CADRE MENTORED',
    status: 'LAB EXPANSION',
  },
  {
    year: '2024',
    code: 'EXP-05',
    tag: 'AUTONOMOUS VISION FLEET',
    title: 'National Robocon Campaign',
    detail: 'Expanded external competition presence, engineered custom omni-directional drive bases, and deployed ROS 2 computer vision stacks with real-time ball tracking.',
    specs: 'OMNI-DRIVE // ROS 2 PERCEPTION',
    metric: 'ARENA MOBILITY',
    status: 'ACTIVE CAMPAIGN',
  },
  {
    year: '2026',
    code: 'EXP-06',
    tag: 'FLAGSHIP ARENA FEST',
    title: 'RoboSaga & Autonomous Systems',
    detail: 'Launching RoboSaga 2026 flagship 3-day arena fest and transitioning into advanced autonomous planetary exploration mechatronics.',
    specs: '3-DAY COMBAT WARS // PLANETARY ROVER',
    metric: 'FLAGSHIP ARENA',
    status: 'NEXT GENERATION',
  },
];

export default function AboutPage() {
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
              badge="ACTIVE CADRE"
              spotlightColor="rgba(82, 39, 255, 0.2)"
              className="p-6"
            >
              <div>
                <AnimatedCounter target={80} suffix="+" className="font-mono text-3xl sm:text-5xl font-black text-[#FF9FFC] block" />
                <span className="font-modern font-bold text-sm text-white uppercase mt-2 block">Active Members</span>
                <p className="font-mono text-[11px] text-slate-400 mt-1">Undergraduate engineers across mechanical, ECE &amp; CS.</p>
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <GlassCard
              badge="PROTOTYPES"
              spotlightColor="rgba(52, 211, 153, 0.2)"
              className="p-6"
            >
              <div>
                <AnimatedCounter target={25} suffix="+" className="font-mono text-3xl sm:text-5xl font-black text-[#FF9FFC] block" />
                <span className="font-modern font-bold text-sm text-white uppercase mt-2 block">Hardware Projects</span>
                <p className="font-mono text-[11px] text-slate-400 mt-1">Combat bots, autonomous rovers, and delta arms.</p>
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <GlassCard
              badge="BOOTCAMPS"
              spotlightColor="rgba(251, 191, 36, 0.2)"
              className="p-6"
            >
              <div>
                <AnimatedCounter target={15} suffix="+" className="font-mono text-3xl sm:text-5xl font-black text-[#FF9FFC] block" />
                <span className="font-modern font-bold text-sm text-white uppercase mt-2 block">Workshops Hosted</span>
                <p className="font-mono text-[11px] text-slate-400 mt-1">Training hundreds of freshmen in robotics yearly.</p>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>

        {/* Vision & Mission Cards with Double-Bezel GlassCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-24">
          <GlassCard
            badge="INSTITUTIONAL HORIZON // VISION"
            spotlightColor="rgba(255, 159, 252, 0.25)"
            className="p-8 sm:p-10"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#5227FF]/20 border border-[#FF9FFC]/30 flex items-center justify-center text-[#FF9FFC] mb-6 shadow-[0_0_15px_rgba(82,39,255,0.3)]">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                OUR VISION
              </h2>
              <p className="font-modern text-sm sm:text-base text-slate-200 mt-4 leading-relaxed">
                To establish Robolution as one of India&apos;s most respected student robotics communities, known for groundbreaking technical depth, rigorous engineering discipline, and collaborative excellence on the national stage.
              </p>
            </div>
          </GlassCard>

          <GlassCard
            badge="ACTIVE MANDATE // MISSION"
            spotlightColor="rgba(82, 39, 255, 0.25)"
            className="p-8 sm:p-10"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#5227FF]/20 border border-[#FF9FFC]/30 flex items-center justify-center text-[#FF9FFC] mb-6 shadow-[0_0_15px_rgba(82,39,255,0.3)]">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                OUR MISSION
              </h2>
              <p className="font-modern text-sm sm:text-base text-slate-200 mt-4 leading-relaxed">
                To create an ecosystem at BIT Mesra where students learn robotics by building, collaborate seamlessly across disciplines, and convert ambitious concepts into deployed, high-reliability engineering solutions.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Core Values Section */}
        <div className="mb-24">
          <div className="mb-10">
            <span className="font-mono text-xs text-[#FF9FFC] font-bold tracking-widest uppercase block mb-2">
              <DecryptedText
                text="// GUIDING PRINCIPLES • OPERATIONAL CODE"
                animateOn="view"
                speed={28}
                sequential={true}
                characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
                className="text-[#FF9FFC]"
              />
            </span>
            <h2 className="font-modern font-black text-3xl sm:text-4xl text-white uppercase">
              OUR <span className="animate-text-shimmer">CORE VALUES</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <GlassCard
                key={i}
                badge={v.tag}
                spotlightColor="rgba(255, 159, 252, 0.2)"
                className="p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#5227FF]/15 border border-[#5227FF]/30 flex items-center justify-center text-[#FF9FFC] mb-6 group-hover:scale-105 transition-transform shadow-[0_0_10px_rgba(82,39,255,0.2)]">
                    <v.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-modern font-bold text-xl text-white uppercase tracking-tight">
                    {v.title}
                  </h3>
                  <p className="font-modern text-xs text-slate-300 mt-3 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

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
                      className={`w-full pl-10 sm:pl-16 md:pl-0 md:w-1/2 ${
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
