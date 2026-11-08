'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import HudBox from '@/components/HudBox';
import MoltenMetal from '@/components/MoltenMetal';
import TechText from '@/components/TechText';
import GlassCard from '@/components/GlassCard';
import IslandButton from '@/components/IslandButton';
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
    year: '2013',
    code: 'EXP-02',
    tag: 'ROBOCON DEBUT',
    title: 'Best Rookie Team',
    detail: 'Recognised as the Best Newcomer Team during our inaugural participation in ABU Robocon, marking an exceptional debut and establishing our presence on an international platform.',
    specs: 'ABU ROBOCON 2013 // NATIONAL STAGE',
    metric: 'BEST ROOKIE',
    status: 'LAUREL VALIDATED',
    image: '/timeline/robocon-2013-team.jpg',
  },
  {
    year: '2015',
    code: 'EXP-03',
    tag: 'ROBOCON DUAL PODIUM',
    title: 'Best Non-Quarterfinalist & ₹150,000 MathWorks Award',
    detail: 'Awarded Best Non-Quarterfinalist for exceptional innovation, and won the prestigious ₹150,000 MathWorks Award for best use of simulation tools in robot development.',
    specs: 'ABU ROBOCON 2015 // ₹150,000 AWARD',
    metric: '₹150K MATHWORKS',
    status: 'PODIUM VALIDATED',
    image: '/timeline/robocon-2015.jpg',
  },
  {
    year: '2015',
    code: 'EXP-04',
    tag: 'IIT BOMBAY TECHFEST',
    title: '2nd Prize • Pixelate',
    detail: 'Secured Second Place in Pixelate at IIT Bombay Techfest, demonstrating exceptional technical expertise in image processing and computer vision challenges.',
    specs: 'IIT BOMBAY // PIXELATE CHALLENGE',
    metric: '2ND PRIZE',
    status: 'PODIUM VALIDATED',
    image: '/timeline/pixelate-2015.jpg',
  },
  {
    year: '2016',
    code: 'EXP-05',
    tag: 'SRIJAN JADAVPUR',
    title: '1st Place – Multiple Events',
    detail: 'Dominated the robotics arena at Srijan, Jadavpur University, clinching first place across multiple competitive technical events.',
    specs: 'JADAVPUR UNIVERSITY // MULTIPLE EVENTS',
    metric: '1ST PLACE',
    status: 'ARENA VICTORY',
  },
  {
    year: '2018',
    code: 'EXP-06',
    tag: 'KSHITIJ IIT KHARAGPUR',
    title: '2nd Place – Maze Solver',
    detail: 'Constructed an agile autonomous maze solver robot to secure 2nd place at Kshitij, the annual techno-management fest of IIT Kharagpur.',
    specs: 'IIT KHARAGPUR // MAZE SOLVER',
    metric: '2ND PLACE',
    status: 'PODIUM VALIDATED',
    image: '/timeline/maze-solver-2018.jpg',
  },
  {
    year: '2019',
    code: 'EXP-07',
    tag: 'TECHNICHE IIT GUWAHATI',
    title: '1st Place – RoboSoccer',
    detail: 'Secured 1st place in RoboSoccer at Techniche IIT Guwahati with a high-mobility omni-directional tactical platform.',
    specs: 'IIT GUWAHATI // ROBOSOCCER',
    metric: '1ST PLACE',
    status: 'CHAMPIONS',
  },
  {
    year: '2021',
    code: 'EXP-08',
    tag: 'ABU ROBOCON HISTORY',
    title: 'Perfect Score 100/100 (3D Design Analysis)',
    detail: 'Made history by achieving a flawless 100/100 in 3D design and kinematic analysis on the global stage, while also ranking as National Finalists (Top 15).',
    specs: 'ABU ROBOCON 2021 // 100/100 IN CAD',
    metric: '100/100 CAD SCORE',
    status: 'HISTORY BENCHMARK',
    image: '/timeline/cad-100-2021.png',
  },
  {
    year: '2021',
    code: 'EXP-09',
    tag: 'BITS PILANI QUARK',
    title: '3rd Place – Robowar',
    detail: 'Engineered a resilient combat robot to claim 3rd place in Robowar at Quark, BITS Pilani.',
    specs: 'BITS PILANI // ROBOWAR COMBAT',
    metric: '3RD PLACE',
    status: 'PODIUM VALIDATED',
    image: '/timeline/robowars-bits-pilani-2021.jpg',
  },
  {
    year: '2022',
    code: 'EXP-10',
    tag: 'PRAGYAN NIT TRICHY & DTU',
    title: '1st Place Roborace & 2nd Place Autonomous Bot',
    detail: 'Captured 1st Place in Roborace at Pragyan NIT Trichy, and 2nd Place in Autonomous Bot at Robotryst DTU.',
    specs: 'NIT TRICHY & DTU // DUAL LAURELS',
    metric: '1ST & 2ND PODIUM',
    status: 'PODIUM VALIDATED',
    image: '/timeline/pragyan-2022.jpg',
  },
  {
    year: '2023',
    code: 'EXP-11',
    tag: 'IIT GUWAHATI, KGP & BOMBAY',
    title: 'Techniche Double Gold, Kshitij 2nd, e-Yantra Finalists',
    detail: 'Won 1st in Robowar & Line Follower at IIT Guwahati, 2nd in Autonomous Navigation at IIT Kharagpur, and reached National Finalists at e-Yantra IIT Bombay.',
    specs: 'IIT GUWAHATI • IIT KGP • IIT BOMBAY',
    metric: 'DUAL GOLD & FINALISTS',
    status: 'TRIPLE CAMPAIGN',
    image: '/timeline/rover-2023.jpg',
  },
  {
    year: '2024',
    code: 'EXP-12',
    tag: 'SMART INDIA HACKATHON',
    title: 'Grand Finale – Hardware Edition (AgriBot)',
    detail: 'Advanced to the Grand Finale of Smart India Hackathon (Hardware Edition) with the AgriBot mechatronics system, while deploying ROS 2 autonomous vision stacks.',
    specs: 'SIH 2024 // AGRIBOT HARDWARE // ROS 2',
    metric: 'GRAND FINALE',
    status: 'NATIONAL IMPACT',
  },
  {
    year: '2025',
    code: 'EXP-13',
    tag: 'IIT BOMBAY TECHFEST',
    title: 'ROBO WARS 2025 – QUARTER-FINALIST (UNDER 15 KG)',
    detail: 'Advanced to the Quarter-Finals at IIT Bombay Techfest 2025, showcasing a robust combat robot with powerful weapon integration, durability, and manoeuvrability.',
    specs: 'IIT BOMBAY TECHFEST // ROBO WARS // 15 KG CATEGORY',
    metric: 'QUARTER-FINALIST (U15KG)',
    status: 'ARENA TESTED',
    image: '/timeline/robowars-2025.jpg',
  },
  {
    year: '2026',
    code: 'EXP-14',
    tag: 'FLAGSHIP ARENA FEST',
    title: 'RoboSaga & Autonomous Systems',
    detail: 'Launching RoboSaga 2026 flagship 3-day arena fest and transitioning into advanced autonomous planetary exploration mechatronics.',
    specs: '3-DAY COMBAT WARS // PLANETARY ROVER',
    metric: 'FLAGSHIP ARENA',
    status: 'NEXT GENERATION',
  },
];

const otherAchievements = [
  {
    year: '2016',
    venue: 'SRIJAN JADAVPUR UNIVERSITY',
    title: '1st Place – Multiple Events',
    badge: 'MULTIPLE VICTORIES',
  },
  {
    year: '2018',
    venue: 'KSHITIJ IIT KHARAGPUR',
    title: '2nd Place – Maze Solver',
    badge: 'AUTONOMOUS NAVIGATION',
    image: '/timeline/maze-solver-2018.jpg',
  },
  {
    year: '2019',
    venue: 'TECHNICHE IIT GUWAHATI',
    title: '1st Place – RoboSoccer',
    badge: 'TACTICAL MOBILITY',
  },
  {
    year: '2021',
    venue: 'BITS PILANI QUARK FEST',
    title: '3rd Place – Robowar',
    badge: 'COMBAT ROBOTICS',
    image: '/timeline/robowars-bits-pilani-2021.jpg',
  },
  {
    year: '2021',
    venue: 'ABU ROBOCON 2021 (VIRTUAL)',
    title: 'National Finalists – Top 15',
    badge: 'NATIONAL FINALISTS',
  },
  {
    year: '2022',
    venue: 'PRAGYAN NIT TRICHY',
    title: '1st Place – Roborace',
    badge: 'HIGH-SPEED DRIVETRAIN',
    image: '/timeline/pragyan-2022.jpg',
  },
  {
    year: '2022',
    venue: 'ROBOTRYST DTU',
    title: '2nd Place – Autonomous Bot',
    badge: 'AUTONOMOUS SENSING',
  },
  {
    year: '2023',
    venue: 'TECHNICHE IIT GUWAHATI',
    title: '1st Place – Robowar & Line Follower',
    badge: 'DUAL CHAMPIONSHIP',
  },
  {
    year: '2023',
    venue: 'KSHITIJ IIT KHARAGPUR',
    title: '2nd Place – Autonomous Navigation',
    badge: 'LIDAR & SLAM',
    image: '/timeline/rover-2023.jpg',
  },
  {
    year: '2023',
    venue: 'E-YANTRA IIT BOMBAY',
    title: 'National Finalists – Theme Completion',
    badge: 'SYSTEM INTEGRATION',
  },
  {
    year: '2024',
    venue: 'SMART INDIA HACKATHON ‘24',
    title: 'Grand Finale – Hardware Edition',
    badge: 'AGRIBOT PLATFORM',
  },
  {
    year: '2025',
    venue: 'IIT BOMBAY TECHFEST',
    title: 'ROBO WARS 2025 – QUARTER-FINALIST (UNDER 15 KG)',
    badge: 'UNDER 15 KG COMBAT',
    image: '/timeline/robowars-2025.jpg',
  },
];

export default function AboutPage() {
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
      <div className="absolute top-0 right-0 z-30 w-[240px] sm:w-[270px] xl:w-[290px] h-[44px] sm:h-[48px] opacity-95 hover:opacity-100 transition-opacity pointer-events-auto">
        <HudBox compact={true} theme="dark" title="EST. 2001 // BIT MESRA" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 pt-20 sm:pt-28 pb-24 px-6 sm:px-12 pl-16 sm:pl-24 max-w-7xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-slate-400 mb-6 uppercase tracking-widest">
          <Link href="/" className="hover:text-white transition-colors">Mission Control</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-300">About Robolution</span>
        </div>

        {/* Hero Title & Cover Image Section */}
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 shadow-xs font-mono text-[9px] sm:text-[10px] tracking-widest text-slate-300 uppercase mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>// OFFICIAL ROBOTICS SOCIETY &bull; BIT MESRA &bull; EST. 2001</span>
          </div>

          <h1 className="font-modern font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-[1.05]">
            BUILDING THE FUTURE OF <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              AUTONOMOUS MECHATRONICS
            </span>
          </h1>

          <p className="font-modern text-base sm:text-lg text-slate-300 max-w-3xl mt-6 leading-relaxed">
            Robolution is the student-driven robotics and innovation society of Birla Institute of Technology, Mesra.
            We bring together passionate hardware builders, firmware engineers, and software architects to solve real technical challenges
            through collaborative making and national competitive campaigns.
          </p>

          {/* Cover Hero Showcase: Robowars Combat Robot */}
          <ScrollReveal delay={150}>
            <div className="relative w-full h-[280px] xs:h-[340px] sm:h-[440px] md:h-[500px] lg:h-[560px] rounded-2xl overflow-hidden mt-10 border border-white/15 bg-black/40 shadow-2xl group">
              <Image
                src="/timeline/robowars-cover.jpg"
                alt="Robolution Robowars Heavyweight Combat Robot"
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out filter contrast-110 brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020307] via-transparent to-black/30 pointer-events-none" />
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 font-mono text-[9px] sm:text-[10px] text-cyan-400 uppercase tracking-widest font-bold">
                  // FLAGSHIP HARDWARE • ROBOWARS COMBAT
                </span>
              </div>
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] sm:text-xs text-sky-400 font-bold uppercase tracking-widest block">
                    IIT BOMBAY TECHFEST // HEAVYWEIGHT ARENA
                  </span>
                  <h3 className="font-modern font-black text-xl sm:text-3xl text-white uppercase tracking-tight">
                    KRATOS COMBAT DRUM SPINNER
                  </h3>
                </div>
                <div className="font-mono text-[10px] sm:text-xs text-slate-300 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 shrink-0 self-start sm:self-auto">
                  HIGH-KINETIC IMPACT WEAPONRY
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Metrics Grid with GlassCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-24">
          <ScrollReveal>
            <GlassCard
              badge="LEGACY // 2001-2026"
              spotlightColor="rgba(255, 255, 255, 0.08)"
              className="p-6"
            >
              <div>
                <AnimatedCounter target={24} suffix="+" className="font-mono text-3xl sm:text-5xl font-black text-white block" />
                <span className="font-modern font-bold text-sm text-white uppercase mt-2 block">Years of Legacy</span>
                <p className="font-mono text-[11px] text-slate-400 mt-1">Pioneering robotics at BIT Mesra since 2001.</p>
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <GlassCard
              badge="ACTIVE CADRE"
              spotlightColor="rgba(255, 255, 255, 0.08)"
              className="p-6"
            >
              <div>
                <AnimatedCounter target={80} suffix="+" className="font-mono text-3xl sm:text-5xl font-black text-white block" />
                <span className="font-modern font-bold text-sm text-white uppercase mt-2 block">Active Members</span>
                <p className="font-mono text-[11px] text-slate-400 mt-1">Undergraduate engineers across mechanical, ECE &amp; CS.</p>
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <GlassCard
              badge="PROTOTYPES"
              spotlightColor="rgba(255, 255, 255, 0.08)"
              className="p-6"
            >
              <div>
                <AnimatedCounter target={25} suffix="+" className="font-mono text-3xl sm:text-5xl font-black text-white block" />
                <span className="font-modern font-bold text-sm text-white uppercase mt-2 block">Hardware Projects</span>
                <p className="font-mono text-[11px] text-slate-400 mt-1">Combat bots, autonomous rovers, and delta arms.</p>
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <GlassCard
              badge="BOOTCAMPS"
              spotlightColor="rgba(255, 255, 255, 0.08)"
              className="p-6"
            >
              <div>
                <AnimatedCounter target={15} suffix="+" className="font-mono text-3xl sm:text-5xl font-black text-white block" />
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
            spotlightColor="rgba(255, 255, 255, 0.08)"
            className="p-8 sm:p-10"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/20 flex items-center justify-center text-white mb-6 shadow-sm">
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
            spotlightColor="rgba(255, 255, 255, 0.08)"
            className="p-8 sm:p-10"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/20 flex items-center justify-center text-white mb-6 shadow-sm">
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
            <span className="font-mono text-xs text-slate-400 font-bold tracking-widest uppercase block mb-2">
              // GUIDING PRINCIPLES &bull; OPERATIONAL CODE
            </span>
            <h2 className="font-modern font-black text-3xl sm:text-4xl text-white uppercase">
              OUR CORE VALUES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <GlassCard
                key={i}
                badge={v.tag}
                spotlightColor="rgba(255, 255, 255, 0.08)"
                className="p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform shadow-sm">
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
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>// CHRONO BUS ARCHITECTURE &bull; EXPEDITION TIMELINE</span>
              </div>
              <h2 className="font-modern font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
                OUR EXPEDITION TIMELINE
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
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              </div>

              {/* Central Dual Bus Rails */}
              <div className="relative flex-1 w-3.5 flex justify-between">
                {/* Main Illuminated Power Rail */}
                <div className="w-[2px] h-full bg-gradient-to-b from-cyan-400 via-white to-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)] opacity-90" />
                {/* Secondary Telemetry Ground Rail */}
                <div className="w-[2px] h-full bg-gradient-to-b from-sky-400 via-slate-500 to-cyan-300 opacity-40" />
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
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
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
                    key={m.code}
                    className={`relative flex flex-col md:flex-row items-center ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* The Central Bus Coupler Node */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-8 md:top-1/2 md:-translate-y-1/2 z-20 flex items-center justify-center pointer-events-none">
                      <div className="relative w-9 h-9 rounded-full bg-[#020408] border-2 border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.2)] flex items-center justify-center">
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
                                ? 'right-[-56px] from-transparent via-cyan-400/50 to-white/30'
                                : 'left-[-56px] from-white/30 via-cyan-400/50 to-transparent'
                            } opacity-70 group-hover:opacity-100 group-hover:shadow-[0_0_8px_rgba(56,189,248,0.6)] transition-all`}
                          >
                            <span
                              className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 ${
                                isLeft ? 'right-0' : 'left-0'
                              }`}
                            />
                          </div>

                          <GlassCard
                            spotlightColor="rgba(255, 255, 255, 0.08)"
                            className={`p-6 sm:p-8 relative ${
                              isLeft ? 'md:border-r-2 md:border-r-cyan-400/30' : 'md:border-l-2 md:border-l-cyan-400/30'
                            }`}
                          >
                            {/* Card Telemetry Notch */}
                            <div
                              className={`flex items-center justify-between font-mono text-[9px] text-slate-400 mb-4 pb-2 border-b border-white/10 uppercase tracking-widest ${
                                isLeft ? 'md:flex-row-reverse' : ''
                              }`}
                            >
                              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
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
                              <span className="font-mono text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-sm">
                                {m.year}
                              </span>
                              <span className="font-mono text-[10px] text-sky-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-950/40 border border-sky-400/30">
                                {m.metric}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="font-modern font-black text-lg sm:text-xl text-white uppercase tracking-tight mb-2 group-hover:text-cyan-300 transition-colors">
                              {m.title}
                            </h3>

                            {/* Detail */}
                            <p className="font-modern text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                              {m.detail}
                            </p>

                            {/* Milestone Photo Showcase (if available) */}
                            {m.image && (
                              <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden mb-4 border border-white/15 bg-black/40 shadow-inner group/img">
                                <Image
                                  src={m.image}
                                  alt={m.title}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 500px"
                                  className="object-contain p-2 group-hover/img:scale-105 transition-transform duration-500 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between font-mono text-[9px] text-slate-300 tracking-wider">
                                  <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 uppercase">
                                    // ARCHIVE CAPTURE
                                  </span>
                                  <span className="text-cyan-400 font-bold">
                                    {m.year}
                                  </span>
                                </div>
                              </div>
                            )}

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

        {/* ========================================================================= */}
        {/* OTHER ACHIEVEMENTS: Podium Archive Across IITs, NITs & National Hackathons */}
        {/* ========================================================================= */}
        <section className="mb-28 relative">
          <ScrollReveal>
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 shadow-xs font-mono text-[9px] sm:text-[10px] tracking-widest text-slate-300 uppercase mb-4 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>// ARENA PODIUM ARCHIVE &bull; NATIONAL MERIT</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h2 className="font-modern font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
                    OTHER ACHIEVEMENTS
                  </h2>
                  <p className="font-modern text-sm sm:text-base text-slate-300 max-w-2xl mt-3 leading-relaxed">
                    National competition records, robot combat podiums, and championship finishes across premier technology festivals in India.
                  </p>
                </div>
                <div className="font-mono text-xs text-cyan-400 uppercase tracking-widest border border-cyan-400/30 px-3 py-1.5 rounded-lg bg-cyan-950/20 shrink-0 self-start sm:self-auto">
                  11 // NATIONAL HONORS
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {otherAchievements.map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 35}>
                <GlassCard
                  badge={item.badge}
                  spotlightColor="rgba(255, 255, 255, 0.08)"
                  className="p-5 sm:p-6 group hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 mb-2.5">
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 font-bold text-white">
                        {item.year}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
                        {item.badge}
                      </span>
                    </div>

                    <h4 className="font-modern font-bold text-xs sm:text-sm text-slate-300 uppercase tracking-wider mb-2">
                      {item.venue}
                    </h4>

                    <p className="font-modern font-black text-sm sm:text-base text-white uppercase tracking-tight group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </p>

                    {/* Archive Photo if available */}
                    {item.image && (
                      <div className="relative w-full h-32 sm:h-36 rounded-lg overflow-hidden mt-3 border border-white/10 bg-black/40 shadow-inner group/img">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 350px"
                          className="object-cover group-hover/img:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-slate-400">
                    <span className="uppercase tracking-widest text-cyan-400/80">Podium Validated</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* CTA Banner with GlassCard & IslandButton */}
        <GlassCard
          badge="LAB COLLABORATION // DIRECT ENGAGEMENT"
          spotlightColor="rgba(255, 255, 255, 0.08)"
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
              className="hover:text-white transition-colors"
            >
              @robolution.bitm
            </a>
            <a
              href="https://www.linkedin.com/company/robolution-bit-mesra/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:pratyumnis@bitmesra.ac.in"
              className="hover:text-white transition-colors flex items-center gap-1.5 font-semibold"
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
