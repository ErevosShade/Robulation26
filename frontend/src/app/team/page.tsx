'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import HudBox from '@/components/HudBox';
import MoltenMetal from '@/components/MoltenMetal';
import GlassCard from '@/components/GlassCard';
import IslandButton from '@/components/IslandButton';
import ScrollReveal from '@/components/ScrollReveal';
import {
  Users,
  ChevronRight,
  Mail,
  Phone,
  ExternalLink,
  Shield,
  Cpu,
  Wrench,
  Brain,
  Palette,
  Megaphone,
  Coins,
  Crown,
  Zap,
  Layers,
  Globe,
  Sparkles,
  Award,
  Network,
  GitBranch
} from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  category: 'Presidents' | 'Captains' | 'Secretaries' | 'Treasurers' | 'Domain Heads';
  subCategory?: string;
  image?: string;
  linkedin?: string;
  instagram?: string;
  email?: string;
}

const teamMembers: TeamMember[] = [
  // Presidents
  {
    name: 'Ayush Kumar',
    role: 'President',
    category: 'Presidents',
    image: '/team/AyushKumar_President.webp',
    email: 'pratyunmis@bitmesra.ac.in'
  },
  {
    name: 'Gaurav Kumar',
    role: 'Vice President',
    category: 'Presidents',
    image: '/team/GauravKumar_VicePresident.webp',
    linkedin: 'https://www.linkedin.com/in/gaurav-kumar-818633201',
    instagram: 'https://www.instagram.com/gaurav_.grv',
    email: 'kumargauravk007@gmail.com'
  },
  {
    name: 'Ashutosh Sahu',
    role: 'Vice President',
    category: 'Presidents',
    image: '/team/AshutoshSahu_VicePresident.webp',
    email: 'pratyunmis@bitmesra.ac.in'
  },

  // Captains
  {
    name: 'Prince Raj',
    role: 'Captain',
    category: 'Captains',
    image: '/team/PrinceRaj_Captain.webp',
    linkedin: 'https://www.linkedin.com/in/prince-raj-598440336',
    instagram: 'https://www.instagram.com/_raj.prince_',
    email: 'princerajdgr@gmail.com'
  },
  {
    name: 'Himanshu Prasad',
    role: 'Vice Captain',
    category: 'Captains',
    image: '/team/HimanshuPrasad_ViceCaptain.webp',
    linkedin: 'https://www.linkedin.com/in/himanshu-prasad-90a4b92b9',
    instagram: 'https://www.instagram.com/_himanshu_2831',
    email: '31hp28@gmail.com'
  },
  {
    name: 'Shubham Kujur',
    role: 'Vice Captain',
    category: 'Captains',
    image: '/team/ShubhamKujur_ViceCaptain.webp',
    linkedin: 'https://www.linkedin.com/in/shubham-satya-kujur-a97252330',
    instagram: 'https://www.instagram.com/it.z_shubham_',
    email: 'shubhamskujur@gmail.com'
  },

  // Secretaries
  {
    name: 'Prasun Jha',
    role: 'General Secretary',
    category: 'Secretaries',
    image: '/team/PrasunJha_GeneralSecretary.webp',
    linkedin: 'https://www.linkedin.com/in/prasun-jha-703685216',
    instagram: 'https://www.instagram.com/prasun4812/',
    email: 'prasunjhaofficial@gmail.com'
  },
  {
    name: 'Ishan Shukla',
    role: 'Joint Secretary',
    category: 'Secretaries',
    image: '/team/IshanShukla_JointSecretary.webp',
    linkedin: 'https://www.linkedin.com/in/ishan-shukla-4b56a0312',
    instagram: 'https://www.instagram.com/iamshuklaishan',
    email: 'shuklaishan077@gmail.com'
  },
  {
    name: 'Vishal Kumar',
    role: 'Joint Secretary',
    category: 'Secretaries',
    image: '/team/VishalKumar_JointSecretary.webp',
    linkedin: 'https://www.linkedin.com/in/vishal-kumar-28042234a',
    instagram: 'https://www.instagram.com/_vishal_paswan07',
    email: 'vraj24411@gmail.com'
  },

  // Treasurers
  {
    name: 'Disha Goel',
    role: 'Treasurer',
    category: 'Treasurers',
    image: '/team/DishaGoel_Treasurer.webp',
    linkedin: 'https://linkedin.com/in/disha-goel-666397326',
    email: 'btech10634.24@bitmesra.ac.in'
  },
  {
    name: 'Garima Agarwal',
    role: 'Treasurer',
    category: 'Treasurers',
    image: '/team/GarimaAgarwal_Treasurer.webp',
    linkedin: 'https://www.linkedin.com/in/garima-agarwal-8298a5272',
    instagram: 'https://www.instagram.com/garima_.2210',
    email: 'garima.ag2210@gmail.com'
  },

  // Domain Heads - Embedded
  {
    name: 'Pari Gautam',
    role: 'Embedded Head',
    category: 'Domain Heads',
    subCategory: 'Embedded Systems',
    image: '/team/PariGautam_EmbeddedHead.webp',
    email: 'parigautam102001@gmail.com'
  },
  {
    name: 'Apurbo Roy',
    role: 'Embedded Head',
    category: 'Domain Heads',
    subCategory: 'Embedded Systems',
    image: '/team/ApurboRoy_EmbeddedHead.webp',
    instagram: 'https://www.instagram.com/apurboroy33/',
    email: 'rapurbo938@gmail.com'
  },
  {
    name: 'Vatsalya Brahmatmaj',
    role: 'Embedded Head',
    category: 'Domain Heads',
    subCategory: 'Embedded Systems',
    image: '/team/VatsalyaBrahmatmaj_EmbeddedHead.webp',
    email: 'pratyunmis@bitmesra.ac.in'
  },

  // Domain Heads - Mechanical
  {
    name: 'Jalaj Bhatia',
    role: 'Mechanical Head',
    category: 'Domain Heads',
    subCategory: 'Mechanical & Fabrication',
    image: '/team/JalajBhatia_MechanicalHead.webp',
    instagram: 'https://www.instagram.com/_palindrome.21',
    email: 'jalajbhatia2104@gmail.com'
  },
  {
    name: 'Ayush Jaiswal',
    role: 'Mechanical Head',
    category: 'Domain Heads',
    subCategory: 'Mechanical & Fabrication',
    image: '/team/AyushJaiswal_MechanicalHead.webp',
    email: 'rishujais50@gmail.com'
  },
  {
    name: 'Anisha Rai',
    role: 'Mechanical Head',
    category: 'Domain Heads',
    subCategory: 'Mechanical & Fabrication',
    email: 'btech10948.24@bitmesra.ac.in'
  },

  // Domain Heads - Intelligence & AI
  {
    name: 'Somyadeep Saha',
    role: 'Intelligence Head',
    category: 'Domain Heads',
    subCategory: 'Autonomous Intelligence',
    image: '/team/SomyadeepSaha_IntelligenceHead.webp',
    instagram: 'https://www.instagram.com/somo_man44/',
    email: 'somo14saha@gmail.com'
  },
  {
    name: 'Palash Mendhe',
    role: 'Intelligence Head',
    category: 'Domain Heads',
    subCategory: 'Autonomous Intelligence',
    image: '/team/PalashMendhe_IntelligenceHead.webp',
    instagram: 'https://www.instagram.com/palash.green',
    email: 'palashmendhe20@gmail.com'
  },

  // Management, Design & Web
  {
    name: 'Palak Agarwal',
    role: 'Public Relations Head',
    category: 'Domain Heads',
    subCategory: 'Public Relations',
    image: '/team/PalakAgarwal_PublicRelationHead.webp',
    instagram: 'https://www.instagram.com/palak.agarwala_',
    email: 'btech10956.24@bitmesra.ac.in'
  },
  {
    name: 'Ayushman Gupta',
    role: 'Management Lead',
    category: 'Domain Heads',
    subCategory: 'Management & Ops',
    image: '/team/AyushmanGupta_ManagementLead.webp',
    email: 'pratyunmis@bitmesra.ac.in'
  },
  {
    name: 'Aditi Shankar',
    role: 'Design Lead',
    category: 'Domain Heads',
    subCategory: 'Creative Design',
    instagram: 'https://www.instagram.com/aditii.shankar',
    email: 'aditishreyavsl@gmail.com'
  },
  {
    name: 'Salil Lakra',
    role: 'Web Master',
    category: 'Domain Heads',
    subCategory: 'Web Systems',
    instagram: 'https://instagram.com/officialsalillakra',
    email: 'salillakra.dev@gmail.com'
  }
];

// Helper component for individual member card
function MemberCard({
  member,
  echelonTag,
  isApex = false,
}: {
  member: TeamMember;
  echelonTag: string;
  isApex?: boolean;
}) {
  return (
    <GlassCard
      spotlightColor="rgba(255, 255, 255, 0.08)"
      className="relative flex flex-col items-center text-center p-6 h-full transition-all duration-300 group"
    >
      {/* Top Telemetry Header Notch */}
      <div className="w-full flex items-center justify-between font-mono text-[9px] text-slate-400 mb-3 pb-2 border-b border-white/10 uppercase tracking-widest">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span className="text-slate-300 font-semibold">{echelonTag}</span>
        </span>
      </div>

      {/* Avatar Container with High-Precision Monochrome Frame */}
      <div className="relative mb-4">
        <div
          className={`relative ${
            isApex ? 'w-36 h-36' : 'w-32 h-32'
          } rounded-full p-1 bg-white/10 border border-white/20 shadow-md group-hover:scale-105 group-hover:border-white/40 transition-all duration-500`}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden bg-zinc-950 flex items-center justify-center">
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 768px) 140px, 160px"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-slate-400 font-mono text-sm tracking-wider uppercase">
                <Users className="w-8 h-8 text-slate-400 mb-1" />
                <span className="font-bold text-xs">{member.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Designation Pill */}
      <span className="font-mono text-[9px] tracking-widest uppercase font-bold px-3 py-0.5 rounded-full mb-2.5 text-slate-200 bg-white/[0.06] border border-white/15">
        {member.role}
      </span>

      {/* Member Name */}
      <h3 className="font-modern font-black text-lg sm:text-xl text-white uppercase tracking-tight group-hover:text-slate-200 transition-colors duration-300">
        {member.name}
      </h3>

      {/* Sub-Category Domain */}
      {member.subCategory && (
        <span className="font-mono text-[10px] text-slate-300 tracking-wider uppercase mt-1 block">
          {member.subCategory}
        </span>
      )}

      {/* Social / Contact Links Dock */}
      <div className="mt-auto pt-5 border-t border-white/10 w-full flex items-center justify-center gap-2 text-slate-400">
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20 transition-all p-2 rounded-lg text-slate-300"
            aria-label={`${member.name} LinkedIn Profile`}
            title="LinkedIn Profile"
          >
            <svg
              className="w-4 h-4 fill-none stroke-current stroke-2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        )}
        {member.instagram && (
          <a
            href={member.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20 transition-all p-2 rounded-lg text-slate-300"
            aria-label={`${member.name} Instagram Profile`}
            title="Instagram Profile"
          >
            <svg
              className="w-4 h-4 fill-none stroke-current stroke-2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20 transition-all p-2 rounded-lg text-slate-300"
            aria-label={`Email ${member.name}`}
            title={`Email: ${member.email}`}
          >
            <Mail className="w-4 h-4" />
          </a>
        )}
      </div>
    </GlassCard>
  );
}

// Connector: Vertical Telemetry Trunk Line
function TreeConnectorVertical({
  height = 'h-10 sm:h-14',
  badge,
}: {
  height?: string;
  badge?: string;
}) {
  return (
    <div className={`relative ${height} w-full flex flex-col items-center justify-center pointer-events-none z-10`}>
      {/* Central neutral illuminated conductor */}
      <div className="w-[1.5px] h-full bg-gradient-to-b from-white/20 via-white/40 to-white/20" />
      {/* Central telemetry chip */}
      {badge && (
        <div className="absolute top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#020409] border border-white/20 shadow-lg backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
          <span className="font-mono text-[8px] sm:text-[9px] text-slate-300 uppercase tracking-widest font-bold">
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}

// Connector: Horizontal Bus Splitter Trace
function TreeBranchSplitter({
  label,
  branches = 3,
}: {
  label?: string;
  branches?: number;
}) {
  return (
    <div className="relative w-full max-w-6xl mx-auto py-2 pointer-events-none z-10">
      {/* Incoming Vertical Stem */}
      <div className="w-[1.5px] h-6 bg-gradient-to-b from-white/30 to-white/50 mx-auto" />

      {/* Junction Coupler Node */}
      <div className="flex items-center justify-center my-0.5">
        <div className="px-3.5 py-1 rounded-full bg-[#030612] border border-white/20 text-slate-200 font-mono text-[8.5px] tracking-widest uppercase flex items-center gap-2 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
          <span>{label || 'DISTRIBUTION BUS JUNCTION'}</span>
        </div>
      </div>

      {/* Horizontal Bus Wire */}
      <div className="relative h-[1.5px] w-[86%] sm:w-[92%] mx-auto bg-gradient-to-r from-transparent via-white/40 to-transparent">
        {/* Branch points */}
        <div className="absolute inset-0 flex justify-between items-center">
          <span className="w-2 h-2 rounded-full bg-white/60" />
          {branches >= 3 && <span className="w-2 h-2 rounded-full bg-white/80" />}
          <span className="w-2 h-2 rounded-full bg-white/60" />
        </div>
      </div>

      {/* Outgoing Drop Stems */}
      <div className="w-[86%] sm:w-[92%] mx-auto flex justify-between">
        <div className="w-[1.5px] h-6 bg-gradient-to-b from-white/40 to-transparent" />
        {branches >= 3 && <div className="w-[1.5px] h-6 bg-gradient-to-b from-white/40 to-transparent" />}
        <div className="w-[1.5px] h-6 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </div>
  );
}

export default function TeamPage() {
  const [viewMode, setViewMode] = useState<'tree' | 'roster'>('tree');
  const [filter, setFilter] = useState<string>('All');

  // Breakdown of members by exact organizational hierarchy
  const presidents = teamMembers.filter((m) => m.category === 'Presidents');
  const captains = teamMembers.filter((m) => m.category === 'Captains');
  const secretaries = teamMembers.filter((m) => m.category === 'Secretaries');
  const treasurers = teamMembers.filter((m) => m.category === 'Treasurers');

  // Technical Domain Pods
  const embeddedHeads = teamMembers.filter(
    (m) => m.category === 'Domain Heads' && m.subCategory === 'Embedded Systems'
  );
  const mechanicalHeads = teamMembers.filter(
    (m) => m.category === 'Domain Heads' && m.subCategory === 'Mechanical & Fabrication'
  );
  const intelligenceHeads = teamMembers.filter(
    (m) => m.category === 'Domain Heads' && m.subCategory === 'Autonomous Intelligence'
  );
  const opsHeads = teamMembers.filter(
    (m) =>
      m.category === 'Domain Heads' &&
      !['Embedded Systems', 'Mechanical & Fabrication', 'Autonomous Intelligence'].includes(
        m.subCategory || ''
      )
  );

  const categories = [
    { id: 'All', label: 'All Hierarchy', count: teamMembers.length },
    { id: 'Presidents', label: 'Executive Council', count: presidents.length },
    { id: 'Captains', label: 'Tactical Command', count: captains.length },
    { id: 'Secretaries', label: 'Secretariat', count: secretaries.length },
    { id: 'Treasurers', label: 'Treasury', count: treasurers.length },
    {
      id: 'Domain Heads',
      label: 'Technical Pods',
      count:
        embeddedHeads.length +
        mechanicalHeads.length +
        intelligenceHeads.length +
        opsHeads.length,
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#020307] text-white font-sans selection:bg-cyan-500/30 selection:text-white overflow-x-hidden">
      {/* Background MoltenMetal WebGL Caustics with calibrated calm speed */}
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
        <HudBox compact={true} theme="dark" title="EST. 2001 • BIT MESRA" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 pt-18 sm:pt-28 pb-20 px-4 sm:px-8 md:pl-24 max-w-7xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-slate-400 mb-6 uppercase tracking-widest">
          <Link href="/" className="hover:text-white transition-colors">
            Mission Control
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-300">Organizational Command Tree</span>
        </div>

        {/* Hero Title Section */}
        <ScrollReveal>
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 shadow-xs font-mono text-[9px] sm:text-[10px] tracking-widest text-slate-300 uppercase mb-4 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              <span>COMMAND ARCHITECTURE &bull; TEAM PRATYUMNIS CADRE</span>
            </div>

            <h1 className="font-modern font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-[1.05]">
              ORGANIZATIONAL <br />
              <span>HIERARCHY TREE</span>
            </h1>

            <p className="font-mono text-xs sm:text-sm text-slate-400 max-w-2xl mt-4 uppercase tracking-wider">
              Executive governance, tactical fleet command, and multi-disciplinary engineering divisions &bull; BIT Mesra
            </p>
          </div>
        </ScrollReveal>

        {/* View Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-14 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
          {/* Toggle between Command Tree & Division Roster */}
          <div className="inline-flex items-center p-1 rounded-xl bg-black/40 border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('tree')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === 'tree'
                  ? 'bg-white text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Command Tree View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('roster')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === 'roster'
                  ? 'bg-white text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Division Roster View</span>
            </button>
          </div>

          <div className="font-mono text-[10px] text-slate-400 flex items-center gap-2 pr-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ACTIVE ROSTER: 21 OFFICERS &bull; 4 TECHNICAL DIVISIONS</span>
          </div>
        </div>

        {/* =====================================================================
            VIEW 1: COMMAND TREE HIERARCHY (THE BESPOKE VISUAL TREE)
        ===================================================================== */}
        {viewMode === 'tree' && (
          <div className="relative w-full mb-28">
            {/* EXECUTIVE COUNCIL (PRESIDENTS) */}
            <div className="mb-4">
              <ScrollReveal>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/15 text-slate-200 font-mono text-[10px] tracking-widest uppercase font-bold">
                    <Crown className="w-3.5 h-3.5 text-slate-300" />
                    <span>EXECUTIVE COUNCIL</span>
                  </div>
                  <h2 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-2">
                    PRESIDENTS &amp; VICE PRESIDENTS
                  </h2>
                </div>
              </ScrollReveal>

              {/* Symmetrical Presidential Tree: President in Center, VPs Flanking */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto items-stretch">
                {/* Vice President: Gaurav Kumar (Left) */}
                <div className="order-2 md:order-1 flex flex-col">
                  {presidents[1] && (
                    <MemberCard
                      member={presidents[1]}
                      echelonTag="VICE PRESIDENT"
                    />
                  )}
                </div>

                {/* President: Ayush Kumar (Center - Prominent Apex) */}
                <div className="order-1 md:order-2 flex flex-col md:-translate-y-4">
                  {presidents[0] && (
                    <MemberCard
                      member={presidents[0]}
                      echelonTag="PRESIDENT"
                      isApex={true}
                    />
                  )}
                </div>

                {/* Vice President: Ashutosh Sahu (Right) */}
                <div className="order-3 md:order-3 flex flex-col">
                  {presidents[2] && (
                    <MemberCard
                      member={presidents[2]}
                      echelonTag="VICE PRESIDENT"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Tree Trunk Conductor: Apex to Tactical Command */}
            <TreeConnectorVertical />

            {/* TACTICAL FLEET COMMAND (CAPTAINS) */}
            <div className="mb-4">
              <ScrollReveal>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/15 text-slate-200 font-mono text-[10px] tracking-widest uppercase font-bold">
                    <Shield className="w-3.5 h-3.5 text-slate-300" />
                    <span>TACTICAL COMMAND</span>
                  </div>
                  <h2 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-2">
                    CAPTAIN &amp; VICE CAPTAINS
                  </h2>
                </div>
              </ScrollReveal>

              {/* Symmetrical Captains Tree: Captain in Center, Vice Captains Flanking */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto items-stretch">
                {/* Vice Captain: Himanshu Prasad (Left) */}
                <div className="order-2 md:order-1 flex flex-col">
                  {captains[1] && (
                    <MemberCard
                      member={captains[1]}
                      echelonTag="VICE CAPTAIN"
                    />
                  )}
                </div>

                {/* Captain: Prince Raj (Center - Elevated) */}
                <div className="order-1 md:order-2 flex flex-col md:-translate-y-4">
                  {captains[0] && (
                    <MemberCard
                      member={captains[0]}
                      echelonTag="FLEET CAPTAIN"
                      isApex={true}
                    />
                  )}
                </div>

                {/* Vice Captain: Shubham Kujur (Right) */}
                <div className="order-3 md:order-3 flex flex-col">
                  {captains[2] && (
                    <MemberCard
                      member={captains[2]}
                      echelonTag="VICE CAPTAIN"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Tree Trunk Conductor: Tactical to Secretariat */}
            <TreeConnectorVertical />

            {/* SECRETARIAT & OPERATIONS */}
            <div className="mb-4">
              <ScrollReveal>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/15 text-slate-200 font-mono text-[10px] tracking-widest uppercase font-bold">
                    <Layers className="w-3.5 h-3.5 text-slate-300" />
                    <span>SECRETARIAT</span>
                  </div>
                  <h2 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-2">
                    GENERAL SECRETARY &amp; JOINT SECRETARIES
                  </h2>
                </div>
              </ScrollReveal>

              {/* Symmetrical Secretariat Tree: General Secretary in Center, Joint Secretaries Flanking */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto items-stretch">
                {/* Joint Secretary: Ishan Shukla (Left) */}
                <div className="order-2 md:order-1 flex flex-col">
                  {secretaries[1] && (
                    <MemberCard
                      member={secretaries[1]}
                      echelonTag="JOINT SECRETARY"
                    />
                  )}
                </div>

                {/* General Secretary: Prasun Jha (Center) */}
                <div className="order-1 md:order-2 flex flex-col md:-translate-y-4">
                  {secretaries[0] && (
                    <MemberCard
                      member={secretaries[0]}
                      echelonTag="GENERAL SECRETARY"
                    />
                  )}
                </div>

                {/* Joint Secretary: Vishal Kumar (Right) */}
                <div className="order-3 md:order-3 flex flex-col">
                  {secretaries[2] && (
                    <MemberCard
                      member={secretaries[2]}
                      echelonTag="JOINT SECRETARY"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Tree Trunk Conductor: Command to Treasury */}
            <TreeConnectorVertical />

            {/* TREASURY & CAPITAL GOVERNANCE */}
            <div className="mb-4">
              <ScrollReveal>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/15 text-slate-200 font-mono text-[10px] tracking-widest uppercase font-bold">
                    <Coins className="w-3.5 h-3.5 text-slate-300" />
                    <span>TREASURY</span>
                  </div>
                  <h2 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-2">
                    TREASURERS &amp; CAPITAL DIRECTORS
                  </h2>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {treasurers.map((m) => (
                  <MemberCard key={m.name} member={m} echelonTag="TREASURER" />
                ))}
              </div>
            </div>

            {/* Tree Trunk Conductor: Command to Technical Divisions */}
            <TreeConnectorVertical />

            {/* TECHNICAL DIVISIONS (UNIFIED CONSISTENT ARCHITECTURE) */}
            <div className="mt-6">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/15 text-slate-200 font-mono text-[10px] tracking-widest uppercase font-bold">
                    <Cpu className="w-3.5 h-3.5 text-slate-300" />
                    <span>TECHNICAL DIVISIONS</span>
                  </div>
                  <h2 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-2">
                    DOMAIN HEADS &amp; POD LEADS
                  </h2>
                </div>
              </ScrollReveal>

              {/* POD 01: Embedded Systems & Firmware */}
              <div className="mb-12">
                <div className="text-center mb-6">
                  <h3 className="font-modern font-bold text-lg text-white uppercase tracking-wider">
                    EMBEDDED SYSTEMS &amp; FIRMWARE
                  </h3>
                  <span className="font-mono text-[10px] text-slate-400">
                    ARM Cortex MCUs &bull; Multi-layer PCBs &bull; CAN-Bus Telemetry
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto items-stretch">
                  {embeddedHeads.map((m) => (
                    <MemberCard key={m.name} member={m} echelonTag="EMBEDDED SYSTEMS" />
                  ))}
                </div>
              </div>

              <TreeConnectorVertical height="h-10" />

              {/* POD 02: Mechanical Design & Fabrication */}
              <div className="mb-12">
                <div className="text-center mb-6">
                  <h3 className="font-modern font-bold text-lg text-white uppercase tracking-wider">
                    MECHANICAL DESIGN &amp; FABRICATION
                  </h3>
                  <span className="font-mono text-[10px] text-slate-400">
                    SolidWorks CAD &bull; FEA Stress Validation &bull; CNC Machining
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto items-stretch">
                  {mechanicalHeads.map((m) => (
                    <MemberCard key={m.name} member={m} echelonTag="MECHANICAL CAD" />
                  ))}
                </div>
              </div>

              <TreeConnectorVertical height="h-10" />

              {/* POD 03: Autonomous Intelligence & Perception */}
              <div className="mb-12">
                <div className="text-center mb-6">
                  <h3 className="font-modern font-bold text-lg text-white uppercase tracking-wider">
                    AUTONOMOUS INTELLIGENCE &amp; PERCEPTION
                  </h3>
                  <span className="font-mono text-[10px] text-slate-400">
                    ROS 2 Middleware &bull; OpenCV Vision &bull; LiDAR SLAM
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-2xl mx-auto items-stretch">
                  {intelligenceHeads.map((m) => (
                    <MemberCard key={m.name} member={m} echelonTag="COMPUTER VISION" />
                  ))}
                </div>
              </div>

              <TreeConnectorVertical height="h-10" />

              {/* POD 04: Digital Media, Web & Operations */}
              <div className="mb-12">
                <div className="text-center mb-6">
                  <h3 className="font-modern font-bold text-lg text-white uppercase tracking-wider">
                    DIGITAL SYSTEMS &amp; OPERATIONS
                  </h3>
                  <span className="font-mono text-[10px] text-slate-400">
                    Next.js Systems &bull; Visual Identity &bull; Public Relations
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-stretch">
                  {opsHeads.map((m) => (
                    <MemberCard key={m.name} member={m} echelonTag="OPERATIONS" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            VIEW 2: DIVISION ROSTER VIEW (DETAILED FILTERABLE DOSSIERS)
        ===================================================================== */}
        {viewMode === 'roster' && (
          <div>
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-16">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilter(cat.id)}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer backdrop-blur-md flex items-center gap-2 ${
                    filter === cat.id
                      ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
                      : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      filter === cat.id
                        ? 'bg-black/15 text-black font-mono'
                        : 'bg-white/10 text-slate-300 font-mono'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* EXECUTIVE COUNCIL */}
            {(filter === 'All' || filter === 'Presidents') && (
              <section className="mb-24">
                <ScrollReveal>
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs text-slate-300 font-bold tracking-widest uppercase mb-1">
                        <Crown className="w-4 h-4 text-slate-300" />
                        <span>EXECUTIVE COUNCIL</span>
                      </div>
                      <h2 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                        PRESIDENTS &amp; VICE PRESIDENTS
                      </h2>
                    </div>
                  </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {presidents.map((member, i) => (
                    <ScrollReveal key={member.name} delay={i * 80}>
                      <MemberCard
                        member={member}
                        echelonTag={member.role === 'President' ? 'PRESIDENT' : 'VICE PRESIDENT'}
                        isApex={member.role === 'President'}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              </section>
            )}

            {/* TACTICAL COMMAND */}
            {(filter === 'All' || filter === 'Captains') && (
              <section className="mb-24">
                <ScrollReveal>
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs text-slate-300 font-bold tracking-widest uppercase mb-1">
                        <Shield className="w-4 h-4 text-slate-300" />
                        <span>TACTICAL COMMAND</span>
                      </div>
                      <h2 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                        CAPTAIN &amp; VICE CAPTAINS
                      </h2>
                    </div>
                  </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {captains.map((member, i) => (
                    <ScrollReveal key={member.name} delay={i * 80}>
                      <MemberCard
                        member={member}
                        echelonTag={member.role === 'Captain' ? 'FLEET CAPTAIN' : 'VICE CAPTAIN'}
                        isApex={member.role === 'Captain'}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              </section>
            )}

            {/* SECRETARIAT */}
            {(filter === 'All' || filter === 'Secretaries') && (
              <section className="mb-24">
                <ScrollReveal>
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs text-slate-300 font-bold tracking-widest uppercase mb-1">
                        <Layers className="w-4 h-4 text-slate-300" />
                        <span>SECRETARIAT</span>
                      </div>
                      <h2 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                        GENERAL SECRETARY &amp; JOINT SECRETARIES
                      </h2>
                    </div>
                  </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {secretaries.map((member, i) => (
                    <ScrollReveal key={member.name} delay={i * 80}>
                      <MemberCard
                        member={member}
                        echelonTag={member.role === 'General Secretary' ? 'GENERAL SECRETARY' : 'JOINT SECRETARY'}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              </section>
            )}

            {/* TREASURY */}
            {(filter === 'All' || filter === 'Treasurers') && (
              <section className="mb-24">
                <ScrollReveal>
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs text-slate-300 font-bold tracking-widest uppercase mb-1">
                        <Coins className="w-4 h-4 text-slate-300" />
                        <span>TREASURY</span>
                      </div>
                      <h2 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                        TREASURERS &amp; CAPITAL DIRECTORS
                      </h2>
                    </div>
                  </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto gap-6 sm:gap-8">
                  {treasurers.map((member, i) => (
                    <ScrollReveal key={member.name} delay={i * 80}>
                      <MemberCard member={member} echelonTag="TREASURER" />
                    </ScrollReveal>
                  ))}
                </div>
              </section>
            )}

            {/* TECHNICAL PODS */}
            {(filter === 'All' || filter === 'Domain Heads') && (
              <section className="mb-24">
                <ScrollReveal>
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-white/10 gap-4">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs text-slate-300 font-bold tracking-widest uppercase mb-1">
                        <Zap className="w-4 h-4 text-slate-300" />
                        <span>TECHNICAL PODS</span>
                      </div>
                      <h2 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                        DOMAIN HEADS &amp; POD LEADS
                      </h2>
                    </div>
                  </div>
                </ScrollReveal>

                {/* POD 1: Embedded */}
                <div className="mb-14">
                  <ScrollReveal>
                    <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-300">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-modern font-black text-lg text-white uppercase tracking-tight">
                          EMBEDDED SYSTEMS &amp; FIRMWARE POD
                        </h3>
                        <p className="font-mono text-[11px] text-slate-400">
                          ARM Cortex MCUs &bull; Multi-layer PCB design &bull; Motor ESCs &bull; CAN-Bus real-time telemetry
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {embeddedHeads.map((member, i) => (
                      <ScrollReveal key={member.name} delay={i * 60}>
                        <MemberCard member={member} echelonTag="EMBEDDED SYSTEMS" />
                      </ScrollReveal>
                    ))}
                  </div>
                </div>

                {/* POD 2: Mechanical */}
                <div className="mb-14">
                  <ScrollReveal>
                    <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-300">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-modern font-black text-lg text-white uppercase tracking-tight">
                          MECHANICAL DESIGN &amp; FABRICATION POD
                        </h3>
                        <p className="font-mono text-[11px] text-slate-400">
                          SolidWorks CAD &bull; FEA stress simulation &bull; CNC machining &bull; Planetary drive gearboxes
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {mechanicalHeads.map((member, i) => (
                      <ScrollReveal key={member.name} delay={i * 60}>
                        <MemberCard member={member} echelonTag="MECHANICAL CAD" />
                      </ScrollReveal>
                    ))}
                  </div>
                </div>

                {/* POD 3: Intelligence */}
                <div className="mb-14">
                  <ScrollReveal>
                    <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-300">
                        <Brain className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-modern font-black text-lg text-white uppercase tracking-tight">
                          AUTONOMOUS INTELLIGENCE &amp; COMPUTER VISION POD
                        </h3>
                        <p className="font-mono text-[11px] text-slate-400">
                          ROS 2 middleware &bull; OpenCV ball tracking &bull; LiDAR SLAM mapping &bull; Autonomous path planning
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>

                  <div className="grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto gap-6">
                    {intelligenceHeads.map((member, i) => (
                      <ScrollReveal key={member.name} delay={i * 60}>
                        <MemberCard member={member} echelonTag="COMPUTER VISION" />
                      </ScrollReveal>
                    ))}
                  </div>
                </div>

                {/* POD 4: Operations & Digital Systems */}
                <div className="mb-14">
                  <ScrollReveal>
                    <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-300">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-modern font-black text-lg text-white uppercase tracking-tight">
                          DIGITAL SYSTEMS, MEDIA &amp; PUBLIC OPERATIONS
                        </h3>
                        <p className="font-mono text-[11px] text-slate-400">
                          Next.js web architectures &bull; Brand visual identities &bull; Media production &bull; Event logistics
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {opsHeads.map((member, i) => (
                      <ScrollReveal key={member.name} delay={i * 60}>
                        <MemberCard member={member} echelonTag="OPERATIONS" />
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* Cadre Induction Banner */}
        <ScrollReveal>
          <GlassCard
            badge="CADRE INDUCTION • 2026 INTAKE"
            spotlightColor="rgba(56, 189, 248, 0.2)"
            className="p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 className="font-modern font-black text-2xl text-white uppercase tracking-tight">
                JOIN TEAM PRATYUMNIS CADRE
              </h3>
              <p className="font-mono text-xs text-slate-400 mt-1 uppercase tracking-wider">
                Recruitments open each semester across Hardware, Firmware, Vision &amp; Media.
              </p>
            </div>
            <IslandButton href="/announcements" variant="primary">
              Recruitment Notices
            </IslandButton>
          </GlassCard>
        </ScrollReveal>
      </main>

      {/* Institutional Footer */}
      <footer className="relative z-20 bg-[#04060a]/70 backdrop-blur-xl py-14 px-4 sm:px-8 md:pl-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-modern font-black text-lg text-white uppercase tracking-wider flex items-center gap-2.5">
              <Image
                src="/robolution-icon-bright.png"
                alt="Robolution Logo"
                width={22}
                height={22}
                className="object-contain filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
              />
              <span>ROBOLUTION &bull; BIT MESRA</span>
            </h4>
            <span className="font-mono text-xs text-slate-400 block mt-1">
              Official Robotics Society &bull; Department of Production &amp; Industrial Engg.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-400 font-mono text-xs">
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
              href="tel:+918235494988"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>+91 8235494988</span>
            </a>
            <a
              href="mailto:pratyunmis@bitmesra.ac.in"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 font-semibold"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>pratyunmis@bitmesra.ac.in</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
