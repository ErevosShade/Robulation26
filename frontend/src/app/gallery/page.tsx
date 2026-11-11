'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import HudBox from '@/components/HudBox';
import MoltenMetal from '@/components/MoltenMetal';
import GlassCard from '@/components/GlassCard';
import IslandButton from '@/components/IslandButton';
import {
  ChevronRight,
  Maximize2,
  X,
  ChevronLeft,
  Mail,
  Phone,
  Camera,
  Sparkles,
  Bot
} from 'lucide-react';

export type GalleryCategory =
  | 'ALL'
  | 'ROBOSAGA'
  | 'PANTHEON'
  | 'ROBOCON'
  | 'ROBOWARS'
  | 'WORKSHOPS'
  | 'ACHIEVEMENTS'
  | 'PROJECTS';

export interface GalleryPhoto {
  id: string;
  title: string;
  category: GalleryCategory;
  categories?: GalleryCategory[];
  year: string;
  venueOrContext: string;
  image: string;
  description: string;
  featured?: boolean;
  aspectClass: string;
  tags: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE CURATED ARCHIVE (ALL NEW PHOTOS + STANDALONE BOTS IN PROJECTS)
// ─────────────────────────────────────────────────────────────────────────────
const curatedGalleryPhotos: GalleryPhoto[] = [
  // ── 1. STANDALONE BOTS & BOT PROJECTS (PROJECTS CATEGORY) ──
  {
    id: 'bot-standalone-prototype',
    title: 'Autonomous Mobile Robot Platform',
    category: 'PROJECTS',
    year: '2024',
    venueOrContext: 'Robolution Prototyping Lab • BIT Mesra',
    image: encodeURI('/gallery/BOT.jpeg'),
    description: 'Custom fabricated autonomous robotics chassis prototype featuring dual heavy-duty planetary gear motors, modular payload mounting rails, and high-traction drive assemblies.',
    aspectClass: 'aspect-[16/9]',
    tags: ['Standalone Bot', 'Projects', 'Autonomous Chassis', 'Custom Fabrication']
  },
  {
    id: 'bot-roborace-sprint',
    title: 'High-Speed Roborace Differential Sprint Bots',
    category: 'PROJECTS',
    year: '2023',
    venueOrContext: 'National Roborace Arenas',
    image: encodeURI('/gallery/BOTS FOR ROBORACE.jpg'),
    description: 'Ultra-low center of gravity high-speed differential drive robots engineered for competitive roborace circuits with tuned high-C LiPo discharge packs and agile steering response.',
    aspectClass: 'aspect-[4/3]',
    tags: ['Roborace', 'Projects', 'High-Speed Sprint', 'Differential Drive']
  },
  {
    id: 'bot-custom-pcb-controllers',
    title: 'Autonomous Robots Powered by In-House PCBs',
    category: 'PROJECTS',
    year: '2024',
    venueOrContext: 'Embedded Mechatronics Bench',
    image: encodeURI('/gallery/BOTS USING OWN PCBS.jpg'),
    description: 'Competitive robotic systems running exclusively on custom in-house designed microcontroller breakout boards, H-bridge motor drivers, and opto-isolated sensor routing PCBs.',
    aspectClass: 'aspect-[4/3]',
    tags: ['Custom PCBs', 'Projects', 'In-House Hardware', 'Motor Drivers']
  },
  {
    id: 'bot-droid-trooper-platform',
    title: 'Heavyweight Droid Trooper Exploration Rover',
    category: 'PROJECTS',
    year: '2024',
    venueOrContext: 'Autonomous Rover Division',
    image: encodeURI('/gallery/DROIDTROPPER.jpg'),
    description: 'Rugged all-terrain tracked exploration rover equipped with multi-channel ultrasonic ranging sensors, high-torque dual drivetrains, and dynamic obstacle traversal algorithms.',
    aspectClass: 'aspect-[16/10]',
    tags: ['Droid Trooper', 'Projects', 'Tracked Rover', 'Autonomous Navigation']
  },
  {
    id: 'bot-hexapod-18dof',
    title: 'Bio-Inspired 18-DOF Articulated Hexapod Robot',
    category: 'PROJECTS',
    year: '2024',
    venueOrContext: 'Bio-Robotics Research Cell',
    image: encodeURI('/gallery/HEXAPOD.jpg'),
    description: '18 degrees-of-freedom bio-inspired walking hexapod robot utilizing inverse kinematics solvers, wave and ripple gait sequences, and adaptive multi-terrain clearance.',
    aspectClass: 'aspect-[16/10]',
    tags: ['Hexapod', 'Projects', '18-DOF Kinematics', 'Bio-Inspired Robotics']
  },
  {
    id: 'bot-hexacopter-flight-working',
    title: 'Autonomous Hexacopter UAV in Active Flight Test',
    category: 'PROJECTS',
    year: '2024',
    venueOrContext: 'BIT Mesra Ground Flight Arena',
    image: encodeURI('/gallery/HEXACOPTER WORKING.jpg'),
    description: 'Heavy-lift autonomous hexacopter UAV conducting flight stability trials: testing GPS waypoint guidance, auto-leveling PID loops, and real-time aerial telemetry transmission.',
    aspectClass: 'aspect-[4/3]',
    tags: ['Hexacopter', 'Projects', 'Aerial Robotics', 'UAV Flight Trials']
  },
  {
    id: 'bot-hexacopter-assembly-bench',
    title: 'Carbon-Composite Hexacopter Aerial Drone Frame',
    category: 'PROJECTS',
    year: '2024',
    venueOrContext: 'Aero-Robotics Assembly Bay',
    image: encodeURI('/gallery/HEXACOPTER.jpg'),
    description: 'Multi-rotor drone platform featuring 6 brushless outrunner motors, carbon-composite arms, power distribution hubs, and modular gimbal stabilization payload mounts.',
    aspectClass: 'aspect-[4/3]',
    tags: ['Hexacopter Frame', 'Projects', 'Multirotor UAV', 'Brushless Propulsion']
  },
  {
    id: 'bot-self-balancing-robot',
    title: 'Two-Wheeled Inverted Pendulum Self-Balancing Bot',
    category: 'PROJECTS',
    year: '2024',
    venueOrContext: 'Control Systems Testbed',
    image: encodeURI('/gallery/SELF BALANCING BOT.jpg'),
    description: 'Dynamic upright stabilization robot implementing 6-axis IMU sensor fusion, complementary filtering, and closed-loop PID tilt correction for seamless upright teleoperation.',
    aspectClass: 'aspect-[4/3]',
    tags: ['Self-Balancing', 'Projects', 'Inverted Pendulum', 'IMU Fusion']
  },
  {
    id: 'bot-pid-line-follower',
    title: 'High-Speed Precision PID Line Follower Bot',
    category: 'PROJECTS',
    year: '2024',
    venueOrContext: 'National Sprint Competitions',
    image: encodeURI('/gallery/LINE FOLLOWER BOT.jpg'),
    description: 'High-velocity line tracking robot engineered with an 8-channel optical reflectance array, ultra-high RPM coreless motors, and finely calibrated digital PID trajectory algorithms.',
    aspectClass: 'aspect-[4/3]',
    tags: ['Line Follower', 'Projects', 'PID Tracking', 'Optical Array']
  },
  {
    id: 'bot-custom-hoverboard',
    title: 'Custom Electric Mobility Mechatronic Hoverboard',
    category: 'PROJECTS',
    year: '2023',
    venueOrContext: 'Power Electronics & Mobility Bay',
    image: encodeURI('/gallery/HOWERBOARD.jpg'),
    description: 'Custom personal electric vehicle built using high-torque brushless hub motors, custom dual-channel motor driver integration, and high-current Li-ion battery pack telemetry.',
    aspectClass: 'aspect-[16/10]',
    tags: ['Hoverboard', 'Projects', 'Electric Mobility', 'Brushless Hubs']
  },
  {
    id: 'bot-invention-mechanism',
    title: 'Novel Mechanical Linkage & Actuation Prototype',
    category: 'PROJECTS',
    year: '2024',
    venueOrContext: 'Kinematic Prototyping Workshop',
    image: encodeURI('/gallery/INVENTION.jpg'),
    description: 'Experimental mechatronic linkage assembly designed for non-linear force multiplication, compact mechanical reduction, and custom robotic gripper integration.',
    aspectClass: 'aspect-[16/10]',
    tags: ['Invention', 'Projects', 'Mechanical Linkage', 'Kinematic Mechanism']
  },
  {
    id: 'project-rover-chassis-original',
    title: 'Autonomous Rocker-Bogie Exploration Rover Testbed',
    category: 'PROJECTS',
    categories: ['PROJECTS', 'ACHIEVEMENTS'],
    year: '2023 – 2024',
    venueOrContext: 'Advanced Autonomous Systems Bay',
    image: '/timeline/rover-2023.jpg',
    description: 'Six-wheel articulated rocker-bogie planetary exploration rover equipped with stereo depth vision, ROS 2 navigation stack, and rough-terrain articulation. Winner of 2nd Place at Kshitij IIT Kharagpur.',
    aspectClass: 'aspect-[3/4]',
    tags: ['Rocker-Bogie', 'Projects', 'Achievements', 'ROS 2', 'Planetary Rover']
  },

  // ── 2. ROBOSAGA FESTIVAL ARENAS & SESSIONS ──
  {
    id: 'robosaga-droidtrooper-action',
    title: 'Droid Trooper Robot in RoboSaga \'24 Arena',
    category: 'ROBOSAGA',
    year: '2024',
    venueOrContext: 'RoboSaga \'24 Arena • BIT Mesra',
    image: encodeURI('/gallery/DROIDTROPPER ROBOSAGA\'24.jpg'),
    description: 'Autonomous crawler robot navigating elevated obstacles, steep ramps, and blind chicanes during the intense Droid Trooper tournament rounds at RoboSaga \'24.',
    aspectClass: 'aspect-[3/4]',
    tags: ['RoboSaga 2024', 'Droid Trooper', 'Arena Action', 'Obstacles']
  },
  {
    id: 'robosaga-arena-track-layout',
    title: 'Official Droid Trooper Obstacle Arena Track',
    category: 'ROBOSAGA',
    year: '2024',
    venueOrContext: 'RoboSaga Flagship Competition Arena',
    image: encodeURI('/gallery/DROIDTROPPER TRACK ROBOSAGA .jpg'),
    description: 'Panoramic view of the custom engineered RoboSaga competition track, testing spatial awareness, teleoperated precision, and chassis climbing limits.',
    aspectClass: 'aspect-[16/10]',
    tags: ['RoboSaga', 'Arena Track', 'Obstacle Course', 'BIT Mesra']
  },
  {
    id: 'robosaga-hexapod-live-demo',
    title: 'Live Hexapod Robot Demonstration • RoboSaga \'24',
    category: 'ROBOSAGA',
    year: '2024',
    venueOrContext: 'RoboSaga Innovation Pavilion',
    image: encodeURI('/gallery/ROBOSAGA 2024 (HEXAPOD).jpg'),
    description: 'Robolution engineers demonstrating bio-inspired multi-legged robotics, wireless telemetry, and real-time inverse kinematics to visiting fest participants.',
    aspectClass: 'aspect-[16/10]',
    tags: ['RoboSaga 2024', 'Hexapod Demo', 'Live Exhibition']
  },
  {
    id: 'robosaga-festival-arena-inaugural',
    title: 'RoboSaga 2024 Annual Festival Arena Assembly',
    category: 'ROBOSAGA',
    year: '2024',
    venueOrContext: 'BIT Mesra Central Sports Arena',
    image: encodeURI('/gallery/ROBOSAGA 2024.jpg'),
    description: 'The inaugural assembly of Eastern India\'s premier collegiate robotics fest, uniting dozens of competing colleges and technical universities.',
    featured: true,
    aspectClass: 'aspect-[16/10]',
    tags: ['RoboSaga 2024', 'Annual Assembly', 'Inaugural Launch']
  },
  {
    id: 'robosaga-speaker-session-keynote',
    title: 'RoboSaga \'25 Industry Expert Keynote Address',
    category: 'ROBOSAGA',
    year: '2025',
    venueOrContext: 'Golden Jubilee Auditorium • BIT Mesra',
    image: encodeURI('/gallery/ROBOSAGA 2025 SPEAKERSESSION.JPG'),
    description: 'Leading industrial automation and mechatronics visionaries addressing aspiring roboticists on commercial robotics, autonomous systems, and manufacturing AI.',
    aspectClass: 'aspect-[16/10]',
    tags: ['RoboSaga 2025', 'Keynote Session', 'Industry Leaders']
  },
  {
    id: 'robosaga-speaker-session-insights',
    title: 'RoboSaga \'25 Tech Perspectives & Colloquium',
    category: 'ROBOSAGA',
    year: '2025',
    venueOrContext: 'BIT Mesra Seminar Hall',
    image: encodeURI('/gallery/ROBOSAGA25 SPEAKER SESSION INSIGHTS.JPG'),
    description: 'Interactive panel discussion exploring next-gen robotic kinematics, planetary exploration challenges, and student-driven innovation ecosystems.',
    aspectClass: 'aspect-[16/10]',
    tags: ['RoboSaga 2025', 'Technical Insights', 'Colloquium']
  },
  {
    id: 'robosaga-speaker-auditorium-assembly',
    title: 'RoboSaga \'25 Auditorium Technical Assembly',
    category: 'ROBOSAGA',
    year: '2025',
    venueOrContext: 'Main Auditorium • RoboSaga \'25',
    image: encodeURI('/gallery/SPEAKER SESSION ROBOSAGA25.JPG'),
    description: 'Packed auditorium of tech enthusiasts and university builders during the keynote technical symposium of RoboSaga 2025.',
    aspectClass: 'aspect-[16/9]',
    tags: ['RoboSaga 2025', 'Auditorium Assembly', 'Technical Fest']
  },

  // ── 3. ABU ROBOCON CAMPAIGNS (ALL ROBOCON ARCHIVES & AWARDS) ──
  {
    id: 'robocon-2015-vc-sendoff',
    title: 'Robocon 2015 Squad with Vice Chancellor',
    category: 'ROBOCON',
    year: '2015',
    venueOrContext: 'Vice Chancellor Secretariat • BIT Mesra',
    image: encodeURI('/gallery/ROBOCON 2015 (WITH OUR VICE CHANCELLOR).jpg'),
    description: 'Team Pratyumnis national squad receiving official institutional felicitations and blessings from the honorable Vice Chancellor of BIT Mesra.',
    aspectClass: 'aspect-[16/10]',
    tags: ['Robocon 2015', 'Vice Chancellor', 'BIT Mesra Squad']
  },
  {
    id: 'robocon-2015-arena-bot',
    title: 'Robocon 2015: Robominton Dual Playing Robot',
    category: 'ROBOCON',
    categories: ['ROBOCON', 'PROJECTS'],
    year: '2015',
    venueOrContext: 'Balewadi Sports Complex, Pune',
    image: encodeURI('/gallery/ROBOCON 2015.jpg'),
    description: 'The competition badminton robot engineered with pneumatic intercept actuators and optical trajectory prediction deployed on the national court.',
    aspectClass: 'aspect-[16/10]',
    tags: ['Robocon 2015', 'Robominton', 'National Finals', 'Projects']
  },
  {
    id: 'robocon-2015-award-trophy',
    title: 'ABU Robocon 2015 National Award Trophy',
    category: 'ROBOCON',
    categories: ['ROBOCON', 'ACHIEVEMENTS'],
    year: '2015',
    venueOrContext: 'Balewadi Sports Complex, Pune',
    image: encodeURI('/gallery/ROBOCON 2015 AWARD.jpg'),
    description: 'Team Pratyumnis hoisting national honors on the ABU Robocon podium celebrating outstanding engineering and tactical performance.',
    aspectClass: 'aspect-[4/3]',
    tags: ['Robocon 2015', 'Achievements', 'National Trophy']
  },
  {
    id: 'robocon-2015-best-nonquarter',
    title: 'Robocon 2015: Best Non-Quarterfinalist Award',
    category: 'ROBOCON',
    categories: ['ROBOCON', 'ACHIEVEMENTS'],
    year: '2015',
    venueOrContext: 'ABU Robocon India National Finals',
    image: encodeURI('/gallery/ROBOCON 2015 BEST NON QUATERFINALIST.jpg'),
    description: 'Prestigious national recognition and ₹150,000 MathWorks award awarded to BIT Mesra for exemplary technical score, high autonomous reliability, and field precision.',
    aspectClass: 'aspect-[4/3]',
    tags: ['Best Non-Quarterfinalist', 'MathWorks Award', 'National Recognition', 'Achievements']
  },
  {
    id: 'robocon-2016-arena-action',
    title: 'Robocon 2016: Clean Energy Transfer Match',
    category: 'ROBOCON',
    year: '2016',
    venueOrContext: 'National Arena • Pune',
    image: encodeURI('/gallery/Robocon 2016 (Arena).jpeg'),
    description: 'Team Pratyumnis guided robot negotiating the arena ramp during the clean energy transfer mission at Balewadi Sports Complex.',
    aspectClass: 'aspect-[16/10]',
    tags: ['Robocon 2016', 'Arena Action', 'Clean Energy Transfer']
  },
  {
    id: 'robocon-2026-kungfu-cad',
    title: 'ABU Robocon 2026: Kung Fu Quest',
    category: 'ROBOCON',
    categories: ['ROBOCON', 'PROJECTS'],
    year: '2026',
    venueOrContext: 'National Finals • ABU Robocon India',
    image: '/timeline/robocon-2026-cad-black.jpg',
    description: 'Holonomic omni-wheel drive base engineered with custom rack-and-pinion weapon assembly mechanisms, securing an outstanding 89/100 Stage 1 score.',
    aspectClass: 'aspect-[4/3]',
    tags: ['ABU Robocon', 'Kung Fu Quest', 'Stage 1 Benchmark', 'Projects']
  },
  {
    id: 'robocon-2021-cad-history',
    title: 'ABU Robocon 2021: Perfect 100/100 CAD Score',
    category: 'ROBOCON',
    categories: ['ROBOCON', 'ACHIEVEMENTS'],
    year: '2021',
    venueOrContext: 'National Finals (Virtual)',
    image: '/timeline/cad-100-2021.png',
    description: 'Made history by securing a perfect score of 100 in 3D Design and Kinematics Analysis, setting an unprecedented benchmark on the world stage.',
    aspectClass: 'aspect-[16/9]',
    tags: ['ABU Robocon', '100/100 CAD', 'World Benchmark', 'Achievements']
  },
  {
    id: 'robocon-2018-pot-throwing',
    title: 'Robocon 2018: Throwing Arrow into Pot (Nem Con)',
    category: 'ROBOCON',
    categories: ['ROBOCON', 'PROJECTS'],
    year: '2018',
    venueOrContext: 'Balewadi Sports Complex, Pune',
    image: '/timeline/robocon-2018-raw.png',
    description: 'National campaign robot equipped with a high-repeatability pneumatic throwing actuator engineered for precision projectile parabolic arcs.',
    aspectClass: 'aspect-[3/4]',
    tags: ['ABU Robocon', 'Nem Con Theme', 'Pneumatic Launcher', 'Projects']
  },
  {
    id: 'robocon-2016-clean-energy-bot',
    title: 'Robocon 2016: Clean Energy Recharging Robot',
    category: 'ROBOCON',
    categories: ['ROBOCON', 'PROJECTS'],
    year: '2016',
    venueOrContext: 'Balewadi Sports Complex, Pune',
    image: '/timeline/robocon-2016-raw.png',
    description: 'Dual-robot kinematic interaction: powered robot guiding a non-powered follower through arena obstacles via precision RF synchronization.',
    aspectClass: 'aspect-[3/4]',
    tags: ['ABU Robocon', 'Clean Energy', 'Kinematic Interaction', 'Projects']
  },
  {
    id: 'robocon-2015-national-team-squad',
    title: 'Robocon 2015: Team Pratyumnis National Squad',
    category: 'ROBOCON',
    year: '2015',
    venueOrContext: 'Balewadi Sports Complex, Pune',
    image: '/timeline/robocon-2015-team.jpg',
    description: 'Full contingent of student engineers, fabricators, and pilots representing BIT Mesra at the national ABU Robocon championship.',
    aspectClass: 'aspect-[16/9]',
    tags: ['ABU Robocon', 'Team Pratyumnis', 'National Contingent']
  },
  {
    id: 'robocon-2013-rookie-team',
    title: 'Inaugural National Debut • Best Rookie Team Trophy',
    category: 'ROBOCON',
    categories: ['ROBOCON', 'ACHIEVEMENTS'],
    year: '2013',
    venueOrContext: 'MIT AOE, Pune • Inaugural Campaign',
    image: '/timeline/robocon-2013-team.jpg',
    description: 'The historic first ABU Robocon team of BIT Mesra, capturing the Best Rookie Team Trophy nationwide with custom arrow-shooting kinematics.',
    aspectClass: 'aspect-[16/10]',
    tags: ['Inaugural Debut', 'Best Rookie Trophy', 'Heritage Squad', 'Achievements']
  },
  {
    id: 'robocon-2013-arrow-mechanism',
    title: 'Robocon 2013: Arrow Shooting Mechanism Prototype',
    category: 'ROBOCON',
    categories: ['ROBOCON', 'PROJECTS'],
    year: '2013',
    venueOrContext: 'MIT AOE, Pune // Inaugural Campaign',
    image: '/timeline/robocon-2013-bot-clean.jpg',
    description: 'The inaugural competition robot equipped with stable elevation mechanics and repeatable projectile arrow launcher assembly.',
    aspectClass: 'aspect-[4/3]',
    tags: ['ABU Robocon', 'Inaugural Bot', 'Arrow Shooting', 'Projects']
  },

  // ── 4. ROBOWARS & COMBAT MECHATRONICS (ALL ROBOWARS IMAGES & U-15KG 2025 BOT) ──
  {
    id: 'robowars-2025-iitb-combat',
    title: 'RoboWars 2025: IIT Bombay Techfest (U-15kg)',
    category: 'ROBOWARS',
    categories: ['ROBOWARS', 'PROJECTS', 'ACHIEVEMENTS'],
    year: '2025',
    venueOrContext: 'IIT Bombay Techfest • RoboWars • Under 15 kg Category',
    image: encodeURI('/gallery/ROBOWARS 2025 IITB TECHFEST.jpg'),
    description: 'Robolution combat squad with the Under-15kg combat bot at IIT Bombay Techfest 2025, reaching the Quarter-Finals with a hardened chassis, 6,000 RPM kinetic weapon, and aggressive arena mobility.',
    aspectClass: 'aspect-[4/3]',
    tags: ['IIT Bombay', 'RoboWars', 'U-15kg Category', 'Techfest 2025', 'Achievements', 'Projects']
  },
  {
    id: 'robowars-flagship-clash',
    title: 'ROBO WARS 2025 – Quarter-Finalist (U-15 KG)',
    category: 'ROBOWARS',
    categories: ['ROBOWARS', 'PROJECTS', 'ACHIEVEMENTS'],
    year: '2025',
    venueOrContext: 'IIT Bombay Techfest • 15 kg Category',
    image: '/timeline/robowars-2025.jpg',
    description: 'Advanced to the Quarter-Finals in the Under-15kg category at IIT Bombay Techfest 2025, showcasing a robust combat robot with high-torque drivetrain, hardened armor plating, and kinetic drum spinner weapon.',
    featured: true,
    aspectClass: 'aspect-[4/3]',
    tags: ['RoboWars', 'U-15kg Category', 'Quarter-Finalist', 'IIT Bombay', 'Achievements', 'Projects']
  },
  {
    id: 'robowars-portfolio-2025',
    title: 'U-15kg Combat Robot Engineering Portfolio',
    category: 'ROBOWARS',
    categories: ['ROBOWARS', 'PROJECTS'],
    year: '2025',
    venueOrContext: 'Techfest 2025 • Combat Engineering Bay',
    image: '/timeline/robowars-2025-portfolio.jpg',
    description: 'Detailed engineering breakdown of the 2025 Under-15kg combat platform: low-profile invertible frame, weapon motor mounts, high-drain battery telemetry, and impact-resistant drive pods.',
    aspectClass: 'aspect-[16/9]',
    tags: ['RoboWars', 'U-15kg Architecture', 'Engineering Portfolio', 'Projects']
  },
  {
    id: 'robowars-bits-quark-podium',
    title: '3rd Place – RoboWar (BITS Pilani Quark)',
    category: 'ROBOWARS',
    categories: ['ROBOWARS', 'PROJECTS', 'ACHIEVEMENTS'],
    year: '2021',
    venueOrContext: 'BITS Pilani • Quark Combat Arena',
    image: '/timeline/robowars-bits-pilani-2021.jpg',
    description: 'Engineered a resilient combat robot to claim 3rd place in RoboWar at Quark, BITS Pilani, featuring high-torque planetary drivetrains and defensive wedge dynamics.',
    aspectClass: 'aspect-[16/10]',
    tags: ['BITS Pilani', 'Quark Robowars', '3rd Place Podium', 'Achievements', 'Projects']
  },

  // ── 5. WORKSHOPS & LAB FABRICATION (REFERENCED FROM WORKSHOP SESSIONS) ──
  {
    id: 'workshop-active-lab-bay',
    title: 'Robolution Mechatronics Lab • Active Fabrication Bay',
    category: 'WORKSHOPS',
    year: '2025',
    venueOrContext: 'Central Robotics Lab • BIT Mesra',
    image: encodeURI('/gallery/LAB IMAGES.jpg'),
    description: 'Inside the bustling hardware workstations at BIT Mesra: students testing circuitry, assembling chassis members, and debugging autonomous sensor stacks.',
    aspectClass: 'aspect-[4/3]',
    tags: ['Lab Bay', 'Workshops', 'Hardware Prototyping', 'BIT Mesra']
  },
  {
    id: 'workshop-solidworks-cad-model',
    title: 'Workshop 1: SolidWorks 3D CAD Modeling',
    category: 'WORKSHOPS',
    year: '2026',
    venueOrContext: 'CAD Lab • BIT Mesra',
    image: '/timeline/workshop-solidworks-cad-model.jpg',
    description: 'Conducted for K25 batch: practical hands-on Computer-Aided Design (CAD), assembly constraints, and parametric modeling essential for national competitions including Robocon and Robowars.',
    aspectClass: 'aspect-[16/10]',
    tags: ['SolidWorks 3D', 'Workshop 1', 'CAD Clinic', 'DFM']
  },
  {
    id: 'workshop-solidworks-k25-session',
    title: 'Parametric 3D Modeling & Kinematics Clinic',
    category: 'WORKSHOPS',
    year: '2025',
    venueOrContext: 'CAD Workstation Lab • BIT Mesra',
    image: '/timeline/workshop-solidworks-k25.jpg',
    description: 'Teaching parametric sketches, assembly mating constraints, and structural kinematics for competitive robotics platforms.',
    aspectClass: 'aspect-[16/9]',
    tags: ['SolidWorks', 'Kinematics', 'CAD Workstation']
  },
  {
    id: 'workshop-embedded-testing-bench',
    title: 'Workshop 2: Embedded Systems & Microcontrollers',
    category: 'WORKSHOPS',
    year: '2026',
    venueOrContext: 'Seminar Hall • BIT Mesra',
    image: '/timeline/workshop-embedded-k26.jpg',
    description: 'Gateway To Robotics 2026 for K26s: ESP32 architectures, GPIO logic levels, sensor interfacing, and motor driver control circuits for mobile robot platforms.',
    featured: true,
    aspectClass: 'aspect-[4/3]',
    tags: ['Embedded Systems', 'Workshop 2', 'ESP32', 'K26 Masterclass']
  },
  {
    id: 'workshop-mechanical-pneumatic-k26',
    title: 'Workshop 3: Mechanical & Pneumatic Systems',
    category: 'WORKSHOPS',
    year: '2026',
    venueOrContext: 'Seminar Hall • BIT Mesra',
    image: '/timeline/workshop-mechanical-k26.jpg',
    description: 'Gateway To Robotics 2026: pneumatic cylinders, directional control solenoid valves, compressor reservoirs, and high-pressure fluid power integration.',
    aspectClass: 'aspect-[4/3]',
    tags: ['Pneumatics', 'Workshop 3', 'Mechanical Systems', 'Fluid Power']
  },
  {
    id: 'workshop-cad-screen-lab',
    title: 'Heavy Machining & Precision Fabrication Clinic',
    category: 'WORKSHOPS',
    year: '2026',
    venueOrContext: 'Production Engineering Central Workshop',
    image: '/timeline/workshop-cad-k26.jpg',
    description: 'Students turning 6061 aluminum motor hubs on manual lathes, drill presses, and bandsaws during the hands-on chassis fabrication week.',
    aspectClass: 'aspect-[4/3]',
    tags: ['Machining', 'Lathe Operations', 'Chassis Fabrication']
  },
  {
    id: 'workshop-opencv-vision-clinic',
    title: 'Real-Time OpenCV & Autonomous Navigation Clinic',
    category: 'WORKSHOPS',
    year: '2026',
    venueOrContext: 'Embedded Systems & AI Lab • BIT Mesra',
    image: '/timeline/workshop-opencv-nlp-k26.jpg',
    description: 'Coding live color segmentation, Hough circle transforms, contour detection, and visual servoing for autonomous obstacle avoidance.',
    aspectClass: 'aspect-[4/3]',
    tags: ['OpenCV', 'Computer Vision', 'Autonomous Navigation']
  },
  {
    id: 'workshop-gateway-robotics-2026',
    title: 'Gateway to Robotics 2026 Orientation & Masterclass',
    category: 'WORKSHOPS',
    year: '2026',
    venueOrContext: 'Robolution Mechatronics Lab • BIT Mesra',
    image: encodeURI('/gallery/GateWay To Robotics Workshop 2026.jpg'),
    description: 'Comprehensive orientation and foundational mechatronics bootcamp introducing the K26 batch to microcontroller architectures, actuators, and robotics prototyping.',
    aspectClass: 'aspect-[3/4]',
    tags: ['Gateway to Robotics', 'Workshops', 'K26 Masterclass', 'Microcontrollers']
  },
  {
    id: 'workshop-recruitment-quiz-hall',
    title: 'Annual Society Recruitment & Technical Screening',
    category: 'WORKSHOPS',
    year: '2026',
    venueOrContext: 'Lecture Hall Complex • BIT Mesra',
    image: encodeURI('/gallery/Recruitment Quiz 2026.jpg'),
    description: 'First-year engineering aspirants participating in Robolution\'s rigorous written aptitude, mechanics, and electronics screening assessment.',
    aspectClass: 'aspect-[4/3]',
    tags: ['Recruitment Quiz', 'Workshops', 'Technical Screening', 'BIT Mesra']
  },
  {
    id: 'workshop-induction-quiz-mechatronics',
    title: 'Robolution Induction & Mechatronics Screening Quiz',
    category: 'WORKSHOPS',
    year: '2026',
    venueOrContext: 'Lecture Hall Complex • BIT Mesra',
    image: encodeURI('/gallery/Robolution Recruitment Quiz 2026.jpg'),
    description: 'Prospective student inductees solving applied mechanics, circuit design, and algorithmic logic questions during the annual recruitment drive.',
    aspectClass: 'aspect-[4/3]',
    tags: ['Induction Quiz', 'Workshops', 'Aptitude Test', 'K26 Induction']
  },

  // ── 6. ACHIEVEMENTS & NATIONAL PODIUM HONORS ──
  {
    id: 'achieve-society-felicitation',
    title: 'Robolution Society Annual Honors & Felicitation',
    category: 'ACHIEVEMENTS',
    categories: ['ACHIEVEMENTS'],
    year: '2024',
    venueOrContext: 'BIT Mesra Departmental Auditorium',
    image: encodeURI('/gallery/FELICITATION.JPG'),
    description: 'Departmental leadership and faculty advisors felicitating Robolution builders for exceptional achievements in inter-collegiate and national competitions.',
    aspectClass: 'aspect-[16/10]',
    tags: ['Felicitation', 'Achievements', 'Department Honors', 'BIT Mesra']
  },
  {
    id: 'achieve-pragyan-roborace-trophy',
    title: '1st Place Champion – National High-Speed Roborace',
    category: 'ACHIEVEMENTS',
    categories: ['ACHIEVEMENTS'],
    year: '2022',
    venueOrContext: 'Pragyan NIT Trichy • National Stage',
    image: '/timeline/pragyan-2022.jpg',
    description: 'Securing top podium finish with custom ultra-low CG aluminum chassis, high-C discharge LiPo telemetry, and precision differential steering.',
    featured: true,
    aspectClass: 'aspect-[16/9]',
    tags: ['1st Place Podium', 'NIT Trichy', 'Pragyan Fest', 'Roborace', 'Achievements']
  },
  {
    id: 'achieve-maze-solver-iitkgp',
    title: '2nd Place – Autonomous Maze Solver Trophy',
    category: 'ACHIEVEMENTS',
    categories: ['ACHIEVEMENTS'],
    year: '2018',
    venueOrContext: 'Kshitij • IIT Kharagpur',
    image: '/timeline/maze-solver-2018.jpg',
    description: 'Rapid micromouse maze-solving bot deploying custom infrared proximity arrays and optimized flood-fill pathfinding algorithm.',
    aspectClass: 'aspect-[16/9]',
    tags: ['IIT Kharagpur', 'Kshitij Fest', '2nd Place Podium', 'Maze Solver', 'Achievements']
  },
  {
    id: 'achieve-pixelate-techfest-iitb',
    title: '2nd Prize • Pixelate Vision Challenge',
    category: 'ACHIEVEMENTS',
    categories: ['ACHIEVEMENTS'],
    year: '2015',
    venueOrContext: 'Techfest • IIT Bombay',
    image: '/timeline/pixelate-2015.jpg',
    description: 'National second prize honors in the premier computer vision and image processing challenge at IIT Bombay Techfest.',
    aspectClass: 'aspect-[16/9]',
    tags: ['IIT Bombay', 'Techfest', '2nd Prize', 'Computer Vision', 'Achievements']
  },

  // ── 7. PANTHEON TECH FEST ──
  {
    id: 'pantheon-core-syndicate',
    title: 'Robolution Engineering Syndicate & Core Crew',
    category: 'PANTHEON',
    year: '2025 – 2026',
    venueOrContext: 'BIT Mesra Campus • Flagship Council',
    image: '/timeline/society-team-cover.jpg',
    description: 'The collective minds of Robolution — uniting mechanical fabricators, embedded specialists, computer vision developers, and operations leads.',
    aspectClass: 'aspect-[16/9]',
    tags: ['Pantheon Showcase', 'Society Assembly', 'BIT Mesra Robotics']
  },
  {
    id: 'pantheon-maze-solver-2026',
    title: 'Autonomous Maze Solver Bot • Pantheon 2026',
    category: 'PANTHEON',
    categories: ['PANTHEON', 'PROJECTS'],
    year: '2026',
    venueOrContext: 'Pantheon 2026 Arena • BIT Mesra',
    image: encodeURI('/gallery/Maze Solver Pantheon 2026.jpg'),
    description: 'Autonomous micromouse maze solver navigating the complex labyrinth arena utilizing optimized flood-fill routing and precision infrared proximity arrays.',
    aspectClass: 'aspect-[16/9]',
    tags: ['Pantheon 2026', 'Maze Solver', 'Projects', 'Autonomous Bot']
  },
  {
    id: 'pantheon-roborumble-combat-2026',
    title: 'RoboRumble Combat Arena Challenge • Pantheon 2026',
    category: 'PANTHEON',
    categories: ['PANTHEON', 'ROBOWARS', 'PROJECTS'],
    year: '2026',
    venueOrContext: 'Pantheon 2026 Combat Arena • BIT Mesra',
    image: encodeURI('/gallery/RoboRumble Pantheon 2026.jpg'),
    description: 'High-energy lightweight combat robotics tournament at Pantheon 2026: armored robots engaging in head-to-head destruction inside the safety cage.',
    aspectClass: 'aspect-[16/9]',
    tags: ['Pantheon 2026', 'RoboRumble', 'RoboWars', 'Projects', 'Combat Arena']
  }
];

const CATEGORIES: GalleryCategory[] = [
  'ALL',
  'ROBOSAGA',
  'PANTHEON',
  'ROBOCON',
  'ROBOWARS',
  'WORKSHOPS',
  'ACHIEVEMENTS',
  'PROJECTS'
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('ALL');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [dynamicUploads, setDynamicUploads] = useState<GalleryPhoto[]>([]);

  // Dynamically discover any additional photos in public/gallery-uploads
  useEffect(() => {
    fetch('/api/gallery-uploads')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.photos) && data.photos.length > 0) {
          setDynamicUploads(data.photos);
        }
      })
      .catch(() => {});
  }, []);

  // Combined photo collection
  const allPhotos = useMemo(() => {
    return [...dynamicUploads, ...curatedGalleryPhotos];
  }, [dynamicUploads]);

  // Filter items smoothly by category
  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'ALL') {
      return allPhotos;
    }
    return allPhotos.filter(item => {
      if (item.categories && item.categories.length > 0) {
        return item.categories.includes(selectedCategory);
      }
      return item.category === selectedCategory;
    });
  }, [selectedCategory, allPhotos]);

  // Featured items for the compact Bento section
  const featuredBento = useMemo(() => {
    return allPhotos.filter(item => item.featured).slice(0, 4);
  }, [allPhotos]);

  // Photos displayed in the masonry gallery:
  // When 'ALL' is active, exclude the items already prominently featured in the Bento section above
  // so no photograph is ever repeated on screen.
  const masonryPhotos = useMemo(() => {
    if (selectedCategory === 'ALL' && featuredBento.length > 0) {
      const bentoIds = new Set(featuredBento.map(b => b.id));
      return filteredPhotos.filter(item => !bentoIds.has(item.id));
    }
    return filteredPhotos;
  }, [selectedCategory, filteredPhotos, featuredBento]);

  // Lightbox navigation
  const currentIndex = activePhoto
    ? filteredPhotos.findIndex(p => p.id === activePhoto.id)
    : -1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setActivePhoto(filteredPhotos[currentIndex - 1]);
    } else {
      setActivePhoto(filteredPhotos[filteredPhotos.length - 1]);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < filteredPhotos.length - 1) {
      setActivePhoto(filteredPhotos[currentIndex + 1]);
    } else {
      setActivePhoto(filteredPhotos[0]);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#020307] text-white font-sans selection:bg-cyan-500/30 selection:text-white overflow-x-hidden">
      {/* Background MoltenMetal WebGL Caustics */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <MoltenMetal
          color1="#020408"
          color2="#0c1322"
          color3="#FFFFFF"
          speed={0.15}
          scale={4.2}
          detail={3}
          glow={1.4}
          coreSize={0.1}
          swirl={1}
          fold={-0.22}
          blackPoint={0.14}
          brightness={0.42}
          colorMode="molten"
          grain={true}
          grainIntensity={0.04}
          mouseInteraction={true}
          mouseStrength={0.25}
          opacity={0.92}
        />
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_35%,#020307_92%] opacity-65" />
      </div>

      {/* Global Society Sidebar */}
      <Sidebar theme="dark" />

      {/* Top Right Tech Box */}
      <div className="hidden sm:block absolute top-0 right-0 z-30 w-[240px] sm:w-[270px] xl:w-[290px] h-[44px] sm:h-[48px] opacity-95 hover:opacity-100 transition-opacity pointer-events-auto">
        <HudBox compact={true} theme="dark" title="EST. 2001 • BIT MESRA" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 pt-16 sm:pt-24 pb-24 px-4 sm:px-8 md:pl-24 max-w-7xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-slate-400 mb-6 uppercase tracking-widest">
          <Link href="/" className="hover:text-white transition-colors">Mission Control</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-cyan-400 font-semibold">Visual Archives</span>
        </div>

        {/* ── 1. HERO SECTION ── */}
        <section className="mb-12 sm:mb-16">
          {/* Technical Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-400/30 font-sans font-bold text-[11px] sm:text-xs text-cyan-300 tracking-[0.25em] uppercase mb-5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>ROBOLUTION &bull; VISUAL ARCHIVES</span>
          </div>

          {/* Main Heading: Exactly 2 lines */}
          <h1 className="font-modern font-black text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-white uppercase leading-[0.98]">
            BUILT TO INNOVATE.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-white">
              ENGINEERED TO DOMINATE
            </span>
          </h1>

          {/* Supporting Description */}
          <p className="font-sans text-sm sm:text-base lg:text-lg text-slate-300 max-w-3xl mt-6 leading-relaxed">
            A visual archive of Robolution&apos;s engineering journey — documenting our competitions, prototypes, technical workshops, achievements and the people behind every build.
          </p>
        </section>

        {/* ── 2. MINIMAL CATEGORY NAVIGATION ── */}
        <section className="mb-12 border-b border-white/10 pb-4">
          <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-hide py-1">
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-3.5 sm:px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-white font-bold bg-white/10 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent font-medium'
                  }`}
                >
                  <span>{cat}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyan-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </section>

        {/* ── 3. FEATURED MOMENTS (COMPACT ASYMMETRIC BENTO SECTION) ── */}
        {selectedCategory === 'ALL' && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-4 font-mono text-xs text-slate-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Featured Moments</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Primary Large Hero Card (Spanning 2 columns & 2 rows) */}
              {featuredBento[0] && (
                <div
                  onClick={() => setActivePhoto(featuredBento[0])}
                  className="md:col-span-2 md:row-span-2 relative min-h-[340px] sm:min-h-[420px] rounded-2xl overflow-hidden bg-black/80 border border-white/15 hover:border-cyan-400/60 shadow-2xl transition-all duration-300 group cursor-pointer"
                >
                  <Image
                    src={featuredBento[0].image}
                    alt={featuredBento[0].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    priority
                  />
                  {/* Bottom ~20% gradient scrim */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                  {/* Corner Badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-black/70 border border-cyan-400/40 font-mono text-[10px] text-cyan-300 uppercase font-bold tracking-wider backdrop-blur-md">
                      FEATURED MOMENT
                    </span>
                    <span className="px-2.5 py-1 rounded bg-black/60 border border-white/10 font-mono text-[10px] text-slate-300 uppercase tracking-wider backdrop-blur-md">
                      {featuredBento[0].year}
                    </span>
                  </div>

                  {/* Ultra-Clean Bottom Caption (Takes hardly 15-20% of card) */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10">
                    <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest font-semibold block mb-0.5">
                      {featuredBento[0].category} &bull; {featuredBento[0].year}
                    </span>
                    <h3 className="font-modern font-black text-base sm:text-xl text-white uppercase tracking-tight leading-snug truncate">
                      {featuredBento[0].title}
                    </h3>
                  </div>
                </div>
              )}

              {/* Companion Card 1 */}
              {featuredBento[1] && (
                <div
                  onClick={() => setActivePhoto(featuredBento[1])}
                  className="md:col-span-1 lg:col-span-2 relative min-h-[220px] rounded-2xl overflow-hidden bg-black/80 border border-white/15 hover:border-cyan-400/60 shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <Image
                    src={featuredBento[1].image}
                    alt={featuredBento[1].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                  <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 z-10">
                    <span className="font-mono text-[9px] text-cyan-400 uppercase tracking-widest font-semibold block mb-0.5">
                      {featuredBento[1].category} &bull; {featuredBento[1].year}
                    </span>
                    <h4 className="font-modern font-black text-xs sm:text-sm text-white uppercase tracking-tight leading-snug truncate">
                      {featuredBento[1].title}
                    </h4>
                  </div>
                </div>
              )}

              {/* Companion Card 2 */}
              {featuredBento[2] && (
                <div
                  onClick={() => setActivePhoto(featuredBento[2])}
                  className="relative min-h-[200px] rounded-2xl overflow-hidden bg-black/80 border border-white/15 hover:border-cyan-400/60 shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <Image
                    src={featuredBento[2].image}
                    alt={featuredBento[2].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

                  <div className="absolute bottom-0 inset-x-0 p-3 z-10">
                    <span className="font-mono text-[9px] text-cyan-400 uppercase tracking-widest font-semibold block mb-0.5">
                      {featuredBento[2].category} &bull; {featuredBento[2].year}
                    </span>
                    <h4 className="font-modern font-black text-xs text-white uppercase tracking-tight leading-snug truncate">
                      {featuredBento[2].title}
                    </h4>
                  </div>
                </div>
              )}

              {/* Companion Card 3 */}
              {featuredBento[3] && (
                <div
                  onClick={() => setActivePhoto(featuredBento[3])}
                  className="relative min-h-[200px] rounded-2xl overflow-hidden bg-black/80 border border-white/15 hover:border-cyan-400/60 shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <Image
                    src={featuredBento[3].image}
                    alt={featuredBento[3].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

                  <div className="absolute bottom-0 inset-x-0 p-3 z-10">
                    <span className="font-mono text-[9px] text-cyan-400 uppercase tracking-widest font-semibold block mb-0.5">
                      {featuredBento[3].category} &bull; {featuredBento[3].year}
                    </span>
                    <h4 className="font-modern font-black text-xs text-white uppercase tracking-tight leading-snug truncate">
                      {featuredBento[3].title}
                    </h4>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── 4. MAIN MASONRY GALLERY (PHOTO-CENTRIC, TEXT HARDLY 15-20%) ── */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400 uppercase tracking-widest">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {selectedCategory === 'ALL'
                  ? `All Images (${allPhotos.length})`
                  : `${selectedCategory} (${filteredPhotos.length})`}
              </span>
            </div>
          </div>

          {/* Pure Fluid Masonry Grid (4 Columns Desktop, 3 Tablet, 2 Mobile) */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
            {masonryPhotos.map(photo => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="break-inside-avoid relative rounded-2xl overflow-hidden bg-black/70 border border-white/10 hover:border-cyan-400/50 shadow-xl transition-all duration-300 group cursor-pointer"
              >
                {/* Photo Display */}
                <div className={`relative w-full ${photo.aspectClass || 'aspect-[4/3]'} overflow-hidden`}>
                  <Image
                    src={photo.image}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient Scrim ONLY on the bottom ~20% of the image */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                  {/* Top-Right Maximize Icon on Hover */}
                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-7 h-7 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white/80 group-hover:text-cyan-300 backdrop-blur-md">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Ultra-Minimal Metadata: Strictly under 20% of the image at the bottom */}
                  <div className="absolute bottom-0 inset-x-0 p-3 sm:p-3.5 z-10">
                    {/* Category & Year Tag */}
                    <span className="font-mono text-[9px] text-cyan-400 uppercase tracking-widest font-semibold block mb-0.5">
                      {photo.category} &bull; {photo.year}
                    </span>

                    {/* Single-Line Concise Title */}
                    <h3 className="font-modern font-black text-xs sm:text-sm text-white uppercase tracking-tight leading-tight truncate group-hover:text-cyan-200 transition-colors">
                      {photo.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {masonryPhotos.length === 0 && (
            <div className="py-20 text-center text-slate-400 font-mono text-sm">
              // NO PHOTOGRAPHS RECORDED FOR THIS CATEGORY ARCHIVE.
            </div>
          )}
        </section>

        {/* ── 5. FULL-SCREEN LIGHTBOX MODAL (Houses Full Details & Descriptions) ── */}
        {activePhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 transition-all"
            onClick={() => setActivePhoto(null)}
          >
            {/* Top Toolbar */}
            <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-20 pointer-events-auto">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                <span className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 uppercase font-bold">
                  {activePhoto.category}
                </span>
                <span>&bull;</span>
                <span className="text-white font-medium">{activePhoto.year}</span>
              </div>

              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Previous Arrow */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 sm:left-6 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-cyan-400 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 sm:right-6 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-cyan-400 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image & Caption Container */}
            <div
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative w-full h-[55vh] sm:h-[68vh] rounded-2xl overflow-hidden bg-black/80 border border-white/15 shadow-2xl flex items-center justify-center">
                <Image
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  fill
                  sizes="100vw"
                  className="object-contain p-2"
                  priority
                />
              </div>

              {/* Full Description & Context inside Lightbox */}
              <div className="w-full mt-4 p-4 sm:p-5 rounded-xl bg-black/80 border border-white/10 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-modern font-black text-lg sm:text-xl text-white uppercase tracking-tight">
                    {activePhoto.title}
                  </h3>
                  <span className="font-mono text-xs text-cyan-400 shrink-0">
                    {activePhoto.venueOrContext}
                  </span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {activePhoto.description}
                </p>
                {activePhoto.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {activePhoto.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 font-mono text-[10px] text-slate-300"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── 6. LAB VISIT & CONTRIBUTIONS CTA ── */}
        <GlassCard
          badge="FACILITY ACCESS • CAMPUS TOURS"
          spotlightColor="rgba(255, 255, 255, 0.08)"
          className="p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              WANT TO VISIT OUR MECHATRONICS LAB?
            </h3>
            <p className="font-sans text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              We welcome prospective BIT Mesra students, visiting alumni, and research collaborators to tour our active hardware workstations and robotics bays.
            </p>
          </div>
          <IslandButton
            href="/contact"
            variant="primary"
          >
            Request Lab Tour
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