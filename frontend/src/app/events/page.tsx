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
  Trophy,
  Flame,
  Wrench,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Award,
  Zap,
  Shield,
  Activity,
  Cpu,
  Mail,
  CheckCircle2,
  Users,
  Compass,
  Layers,
  Sparkles,
  ArrowUpRight,
  Crosshair,
  Radio,
  Swords,
  Binary,
  Bot
} from 'lucide-react';

interface EventCardItem {
  id: string;
  section: 'robosaga' | 'robocon' | 'robowars' | 'workshops';
  title: string;
  yearOrCycle: string;
  badge: string;
  status: 'Upcoming' | 'Annual' | 'Completed' | 'COMPLETED' | 'Campaign Active' | 'Historical Milestone';
  venue: string;
  specs?: string;
  metric?: string;
  allocationOrPrize?: string;
  image?: string;
  description: string;
  problem?: string;
  teamPov?: string;
  highlights: string[];
}

// -----------------------------------------------------------------------------
// 1. ROBOSAGA ARENA INITIATIVES (ROBOSAGA 2026 OFFICIAL ARCHIVE)
// -----------------------------------------------------------------------------
const robosagaCards: EventCardItem[] = [
  {
    id: 'robosaga-arena-hackaway',
    section: 'robosaga',
    title: 'ROBOSAGA ARENA: HACKAWAY',
    yearOrCycle: 'DAY 01 – DAY 02',
    badge: 'INNOVATION & HACKATHON',
    status: 'COMPLETED',
    venue: 'BIT MESRA, RANCHI',
    specs: 'ROBOTICS & AI // SIMULATION',
    metric: '48 TEAMS',
    allocationOrPrize: '48 PARTICIPATING TEAMS',
    description: 'An overnight hackathon bringing together innovative minds to develop solutions around Robotics, Artificial Intelligence and Simulation. Teams worked through an intensive development challenge, transforming ideas into practical technological solutions.',
    problem: 'Developing rapid functional software and hardware simulation solutions around Robotics, Artificial Intelligence and Simulation during an intensive overnight hackathon.',
    teamPov: '48 participating teams worked through an intensive development sprint, translating conceptual designs into demonstrable engineering prototypes.',
    highlights: ['48 PARTICIPATING TEAMS', 'ROBOTICS & AI', 'SIMULATION', 'OVERNIGHT HACKATHON']
  },
  {
    id: 'robosaga-arena-roborunway',
    section: 'robosaga',
    title: 'ROBOSAGA ARENA: ROBO RUNWAY',
    yearOrCycle: 'DAY 01',
    badge: 'ROBOTICS & COMPETITION',
    status: 'COMPLETED',
    venue: 'BIT MESRA',
    specs: 'ENGINEERING & CREATIVITY',
    metric: 'CHALLENGE',
    allocationOrPrize: 'ROBOTICS CHALLENGE',
    description: 'An engaging robotics activity that brought engineering, creativity and competitive spirit together. Robo Runway added an interactive dimension to the festival, encouraging participants to demonstrate their robotic creations and technical capabilities.',
    problem: 'Demonstrating custom robotic creations, chassis aesthetics, mechanism kinematics, and agile control under competition conditions.',
    teamPov: 'Robo Runway encouraged participants to combine solid engineering principles with creativity and live teleoperation skill on the runway track.',
    highlights: ['ROBOTICS CHALLENGE', 'ENGINEERING', 'CREATIVITY', 'COMPETITIVE SPIRIT']
  },
  {
    id: 'robosaga-arena-burst-n-brawl',
    section: 'robosaga',
    title: 'ROBOSAGA ARENA: BURST N BRAWL',
    yearOrCycle: 'DAY 02',
    badge: 'ROBOTICS & COMPETITION',
    status: 'COMPLETED',
    venue: 'BIT MESRA',
    specs: 'ROBOTICS & COMPETITION',
    metric: 'COMPETITION',
    allocationOrPrize: 'ROBOTICS COMPETITION',
    description: 'A competitive robotics activity that brought excitement and technical engagement to RoboSaga\'26. Participants experienced the thrill of robotics-driven challenges while showcasing their engineering and problem-solving abilities.',
    problem: 'Dynamic head-to-head robot clashes testing drive agility, tactical offensive maneuvers, and structural resilience in the arena.',
    teamPov: 'Robots faced aggressive competition conditions, testing durable chassis construction, quick steering response, and real-time operator tactics.',
    highlights: ['ROBOTICS', 'COMPETITION', 'ENGINEERING', 'TECHNICAL CHALLENGE']
  },
  {
    id: 'robosaga-arena-blindfold-droid-trooper',
    section: 'robosaga',
    title: 'ROBOSAGA ARENA: BLINDFOLD DROID TROOPER',
    yearOrCycle: 'DAY 02',
    badge: 'AUTONOMOUS ROBOTICS',
    status: 'COMPLETED',
    venue: 'BIT MESRA',
    specs: 'NAVIGATION & CONTROL SYSTEMS',
    metric: 'AUTONOMOUS',
    allocationOrPrize: 'AUTONOMOUS ROBOTICS',
    description: 'A robotics challenge featured during RoboSaga\'26, bringing an interesting dimension to robotic navigation and control. The activity tested participants\' ability to approach robotics challenges through technical understanding and creative problem-solving.',
    problem: 'Navigating an obstacle-filled course under blindfolded control and teleoperation constraints, testing spatial awareness and control precision.',
    teamPov: 'Tested participants\' command-and-control communication, calibrated motor drive response, and tactical navigation without direct visual line-of-sight.',
    highlights: ['ROBOTICS', 'NAVIGATION', 'CONTROL SYSTEMS', 'PROBLEM SOLVING']
  }
];

// -----------------------------------------------------------------------------
// BEYOND THE ARENA & HACKAWAY PODIUM DATA
// -----------------------------------------------------------------------------
interface BeyondArenaItem {
  id: string;
  badge: string;
  title: string;
  description: string;
}

const beyondArenaCards: BeyondArenaItem[] = [
  {
    id: 'beyond-exhibition',
    badge: 'PROJECT SHOWCASE',
    title: 'ROBOTICS EXHIBITION',
    description: 'A platform for students to showcase their robotics projects, working prototypes and engineering innovations.'
  },
  {
    id: 'beyond-speakers',
    badge: 'INDUSTRY PERSPECTIVES',
    title: 'EXPERT SPEAKER SESSIONS',
    description: 'Interactive sessions featuring Prabhas Raj Panigrahi and G. Om Prasad Dora, sharing industry perspectives and insights into robotics.'
  },
  {
    id: 'beyond-workshop',
    badge: 'PRAYOG INDIA // 25 JAN',
    title: 'TECHNICAL WORKSHOP',
    description: 'A hands-on robotics workshop conducted by Prayog India on 25 January 2026.'
  }
];

interface HackawayWinner {
  position: string;
  placeTitle: string;
  teamName: string;
  rankBadge: string;
  orderClass: string;
  podiumHeight: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  accentClass: string;
  glowColor: string;
}

const hackawayWinners: HackawayWinner[] = [
  {
    position: '2ND PLACE',
    placeTitle: '1ST RUNNER-UP',
    teamName: 'TEAM SENSOR SQUAD',
    rankBadge: '1ST RUNNER-UP',
    orderClass: 'order-2 lg:order-1',
    podiumHeight: 'lg:h-64',
    borderColor: 'border-slate-300/40 hover:border-slate-300/80',
    badgeBg: 'bg-slate-300/15 border-slate-300/40',
    badgeText: 'text-slate-200',
    accentClass: 'text-slate-200',
    glowColor: 'rgba(203, 213, 225, 0.15)'
  },
  {
    position: '1ST PLACE',
    placeTitle: 'WINNER',
    teamName: 'TEAM BONES',
    rankBadge: 'CHAMPION',
    orderClass: 'order-1 lg:order-2 lg:-translate-y-4',
    podiumHeight: 'lg:h-72',
    borderColor: 'border-amber-400/50 hover:border-amber-400/90 shadow-lg shadow-amber-500/10',
    badgeBg: 'bg-amber-400/20 border-amber-400/50',
    badgeText: 'text-amber-300',
    accentClass: 'text-amber-400',
    glowColor: 'rgba(251, 191, 36, 0.25)'
  },
  {
    position: '3RD PLACE',
    placeTitle: '2ND RUNNER-UP',
    teamName: 'TEAM FURIOUS FOUR',
    rankBadge: '2ND RUNNER-UP',
    orderClass: 'order-3 lg:order-3',
    podiumHeight: 'lg:h-60',
    borderColor: 'border-amber-700/40 hover:border-amber-600/80',
    badgeBg: 'bg-amber-700/20 border-amber-600/40',
    badgeText: 'text-amber-400',
    accentClass: 'text-amber-500',
    glowColor: 'rgba(217, 119, 6, 0.15)'
  }
];

// -----------------------------------------------------------------------------
// 2. ROBOCON CAMPAIGNS (TEAM PRATYUMNIS) - 6 BALANCED CARDS (3 PER ROW)
// -----------------------------------------------------------------------------
const roboconFeaturedCards: EventCardItem[] = [
  {
    id: 'robocon-2026-campaign',
    section: 'robocon',
    title: 'ABU Robocon 2026: Kung Fu Quest (89/100 Stage 1)',
    yearOrCycle: '2026 Campaign',
    badge: 'STAGE 1 BENCHMARK // 89/100 CAD SCORE',
    status: 'Campaign Active',
    venue: 'National Finals // ABU Robocon India',
    specs: 'CAD & KINEMATICS SCORE: 89/100',
    metric: '89/100 CAD SCORE',
    allocationOrPrize: '89/100 Score in Stage 1 Evaluation',
    image: '/timeline/robocon-2026-cad-black.jpg',
    description: 'Team Pratyumnis secured an outstanding 89/100 in Stage 1 evaluation. Competing in "Kung Fu Quest" with custom holonomic omni-wheel drive bases and high-precision martial weapon assembly actuators.',
    problem: 'Theme "Kung Fu Quest": R1 manual and R2 autonomous robots must collaborate to assemble martial weapons, navigate Meihua elevated pathways to collect Kung Fu Scrolls, and execute strategic Tic-Tac-Toe showdown placement.',
    teamPov: 'Engineered custom omni-directional chassis with dual-rack gripper mechanisms and precision stepper lifts, securing 89/100 in Stage 1 3D CAD kinematic analysis and simulation.',
    highlights: ['89/100 Stage 1 Score', 'Holonomic Omni-Drive Base', 'Precision Stepper Lift', 'Kung Fu Quest Theme']
  },
  {
    id: 'robocon-2021-cad-history',
    section: 'robocon',
    title: 'ABU Robocon 2021: Perfect 100/100 CAD Score',
    yearOrCycle: '2021 Campaign',
    badge: 'GLOBAL BENCHMARK // 100/100 CAD SCORE',
    status: 'Historical Milestone',
    venue: 'National Finals (Virtual)',
    specs: '3D DESIGN & KINEMATICS ANALYSIS',
    metric: 'PERFECT 100/100',
    allocationOrPrize: 'National Finalists (Top 15)',
    image: '/timeline/cad-100-2021.png',
    description: 'Made history by securing a perfect score of 100 in 3D Design and Kinematics Analysis, setting an unprecedented benchmark on the world stage.',
    problem: 'Rigorous digital twin verification of automated kinematic mechanisms, deflection limits, and weight-to-payload optimization.',
    teamPov: 'Full multi-body dynamic simulation in SolidWorks, stress finite element analysis, and parameterised generative modeling scored an unprecedented perfect 100/100.',
    highlights: ['100/100 Score in 3D CAD Analysis', 'Kinematic & Stress FEA Studies', 'National Finalists (Top 15)', 'Digital Twin Verification']
  },
  {
    id: 'robocon-2018-campaign',
    section: 'robocon',
    title: 'Robocon 2018: Throwing Arrow into Pot',
    yearOrCycle: '2018 Campaign',
    badge: 'NATIONAL REPRESENTATION // ABU ROBOCON',
    status: 'Historical Milestone',
    venue: 'Balewadi Sports Complex, Pune',
    specs: 'THEME: THROWING ARROW INTO POT',
    metric: 'NATIONAL FINALS',
    allocationOrPrize: 'National Representation',
    image: '/timeline/robocon-2018-bot-black.jpg',
    description: 'Robots had to collect and accurately throw arrows into pots placed at different heights and distances in the arena.',
    problem: 'Robots had to collect and accurately throw arrows into pots placed at different heights and distances.',
    teamPov: 'Success depended on precise aiming, stable launching mechanisms, and repeatable shooting accuracy rather than just speed.',
    highlights: ['Precision Azimuth Aiming', 'Stable Launching Mechanisms', 'Repeatable Shooting Accuracy', 'National Stage Representation']
  },
  {
    id: 'robocon-2016-clean-energy',
    section: 'robocon',
    title: 'Robocon 2016: Clean Energy Recharging',
    yearOrCycle: '2016 Campaign',
    badge: 'DUAL-ROBOT KINEMATIC INTERACTION',
    status: 'Historical Milestone',
    venue: 'Balewadi Sports Complex, Pune',
    specs: 'THEME: CLEAN ENERGY TRANSFER',
    metric: 'DUAL ROBOT PLATFORM',
    allocationOrPrize: 'National Representation',
    image: '/timeline/robocon-2016-bot-black.jpg',
    description: 'A powered robot had to assist and guide a non-powered robot through various arena tasks inspired by clean energy transfer.',
    problem: 'A powered robot had to assist and guide a non-powered robot through various arena tasks inspired by clean energy transfer.',
    teamPov: 'The biggest challenge was coordination between two robots, requiring reliable communication, synchronization, and innovative mechanical interaction.',
    highlights: ['Two-Robot Interlocking Guidance', 'Reliable RF Synchronization', 'Innovative Mechanical Coupling', 'Clean Energy Transfer Theme']
  },
  {
    id: 'robocon-2015-mathworks',
    section: 'robocon',
    title: 'Robocon 2015: Best Non-Quarterfinalist & ₹1.5L',
    yearOrCycle: '2015 Campaign',
    badge: 'THEME: ROBOMINTON // LAUREL PODIUM',
    status: 'Historical Milestone',
    venue: 'Balewadi Sports Complex, Pune',
    specs: '₹150,000 MATHWORKS AWARD',
    metric: 'DOUBLE HONORS',
    allocationOrPrize: '₹150,000 MathWorks Award & Trophy',
    image: '/timeline/robocon-2015-bot-black.jpg',
    description: 'Robots had to play a badminton-inspired game by launching shuttlecocks into target areas across the net.',
    problem: 'Robots had to play a badminton-inspired game by launching shuttlecocks into target areas.',
    teamPov: 'Focus was on designing an accurate launcher, controlling shot trajectory, and ensuring consistent performance under match conditions.',
    highlights: ['Best Non-Quarterfinalist', '₹150,000 MathWorks Award', 'Accurate Badminton Launcher', 'MATLAB / Simulink Trajectory']
  },
  {
    id: 'robocon-2013-rookie',
    section: 'robocon',
    title: 'Robocon 2013: Best Rookie Team Debut',
    yearOrCycle: '2013 Campaign',
    badge: 'INAUGURAL DEBUT // BEST ROOKIE TEAM',
    status: 'Historical Milestone',
    venue: 'MIT Academy of Engineering, Pune',
    specs: 'THEME: THROWING ARROW INTO POT',
    metric: 'BEST ROOKIE',
    allocationOrPrize: 'Best Rookie Team Award',
    image: '/timeline/robocon-2013-bot-black.jpg',
    description: 'Inaugural participation in ABU Robocon. Recognized as Best Newcomer Team nationwide, marking an exceptional national debut.',
    problem: 'Robots had to collect and accurately throw arrows into pots placed at different heights and distances.',
    teamPov: 'Success depended on precise aiming, stable launching mechanisms, and repeatable shooting accuracy rather than just speed.',
    highlights: ['Best Rookie Team Nationwide', 'Inaugural ABU Robocon Campaign', 'Aiming & Stable Elevation', 'Repeatable Arrow Shooting']
  }
];

// -----------------------------------------------------------------------------
// 3. ROBOWARS & NATIONAL COMPETITIONS (VERBATIM HERITAGE DATA)
// -----------------------------------------------------------------------------
const robowarsVisualCards: EventCardItem[] = [
  {
    id: 'robowars-techfest-2025',
    section: 'robowars',
    title: 'ROBO WARS 2025 – Quarter-Finalist (U-15 KG)',
    yearOrCycle: '2025',
    badge: 'IIT BOMBAY TECHFEST',
    status: 'Completed',
    venue: 'IIT BOMBAY TECHFEST // ROBO WARS // 15 KG CATEGORY',
    specs: 'IIT BOMBAY TECHFEST // 15 KG CATEGORY',
    metric: 'QUARTER-FINALIST',
    allocationOrPrize: 'Quarter-Finalist (Under 15 kg)',
    image: '/timeline/robowars-2025.jpg',
    description: 'Advanced to the Quarter-Finals at IIT Bombay Techfest 2025, showcasing a robust combat robot with powerful weapon integration, durability, and manoeuvrability.',
    highlights: ['Under 15 kg Quarter-Finalist', 'Kinetic Drum Spinner Weapon', 'Hardened Armor Plating', 'High-Speed Arena Mobility']
  },
  {
    id: 'robowar-quark-2021',
    section: 'robowars',
    title: '3rd Place – Robowar',
    yearOrCycle: '2021',
    badge: 'BITS PILANI QUARK',
    status: 'Historical Milestone',
    venue: 'BITS PILANI // ROBOWAR COMBAT',
    specs: 'BITS PILANI // ROBOWAR COMBAT',
    metric: '3RD PLACE PODIUM',
    allocationOrPrize: '3rd Place – Robowar',
    image: '/timeline/robowars-bits-pilani-2021.jpg',
    description: 'Engineered a resilient combat robot to claim 3rd place in Robowar at Quark, BITS Pilani.',
    highlights: ['3rd Place Arena Finish', 'High-Torque Planetary Drivetrain', 'Reinforced Shock Mounting', 'Defensive Wedge Dynamics']
  },
  {
    id: 'kshitij-autonomous-rover-2023',
    section: 'robowars',
    title: '2nd Place – Autonomous Navigation',
    yearOrCycle: '2023',
    badge: 'KSHITIJ IIT KHARAGPUR',
    status: 'Historical Milestone',
    venue: 'IIT KHARAGPUR // AUTONOMOUS ROVER',
    specs: 'IIT KHARAGPUR // AUTONOMOUS ROVER',
    metric: '2ND PLACE',
    allocationOrPrize: '2nd Place – Autonomous Navigation',
    image: '/timeline/rover-2023.jpg',
    description: 'Designed an autonomous rover with multi-sensor obstacle detection and real-time path planning to claim 2nd place at Kshitij IIT Kharagpur.',
    highlights: ['2nd Place Podium Finish', 'Multi-Sensor Obstacle Avoidance', 'Real-Time Path Planning', 'Autonomous Rover Platform']
  },
  {
    id: 'pragyan-roborace-2022',
    section: 'robowars',
    title: '1st Place – Roborace',
    yearOrCycle: '2022',
    badge: 'PRAGYAN NIT TRICHY',
    status: 'Historical Milestone',
    venue: 'NIT TRICHY // HIGH-SPEED ROBORACE',
    specs: 'NIT TRICHY // HIGH-SPEED ROBORACE',
    metric: '1ST PLACE PODIUM',
    allocationOrPrize: '1st Place – Roborace',
    image: '/timeline/pragyan-2022.jpg',
    description: 'Captured 1st Place in Roborace at Pragyan NIT Trichy with a high-speed custom drivetrain and precision steering.',
    highlights: ['1st Place Champion Finish', 'Differential Steering Dynamics', 'Low-Center-of-Gravity Chassis', 'NIT Trichy Pragyan Laurels']
  },
  {
    id: 'kshitij-maze-solver-2018',
    section: 'robowars',
    title: '2nd Place – Maze Solver',
    yearOrCycle: '2018',
    badge: 'KSHITIJ IIT KHARAGPUR',
    status: 'Historical Milestone',
    venue: 'IIT KHARAGPUR // MAZE SOLVER',
    specs: 'IIT KHARAGPUR // MAZE SOLVER',
    metric: '2ND PLACE',
    allocationOrPrize: '2nd Place – Maze Solver',
    image: '/timeline/maze-solver-2018.jpg',
    description: 'Constructed an agile autonomous maze solver robot to secure 2nd place at Kshitij, the annual techno-management fest of IIT Kharagpur.',
    highlights: ['2nd Place Podium Trophy', 'Wall-Tracing Sensor Arrays', 'Rapid Velocity Runs', 'IIT Kharagpur Kshitij Laurels']
  },
  {
    id: 'techfest-pixelate-2015',
    section: 'robowars',
    title: '2nd Prize • Pixelate',
    yearOrCycle: '2015',
    badge: 'IIT BOMBAY TECHFEST',
    status: 'Historical Milestone',
    venue: 'IIT BOMBAY // PIXELATE CHALLENGE',
    specs: 'IIT BOMBAY // PIXELATE CHALLENGE',
    metric: '2ND PRIZE',
    allocationOrPrize: '2nd Prize • Pixelate',
    image: '/timeline/pixelate-2015.jpg',
    description: 'Secured Second Place in Pixelate at IIT Bombay Techfest, demonstrating exceptional technical expertise in image processing and computer vision challenges.',
    highlights: ['2nd Prize Podium Finish', 'Real-Time OpenCV Image Processing', 'Precise Color & Contour Tracking', 'IIT Bombay Techfest Laurels']
  }
];

// Verbatim achievements from the About / Heritage page (otherAchievements)
interface HeritageRecordItem {
  year: string;
  venue: string;
  title: string;
  badge: string;
}

const otherHeritageAchievements: HeritageRecordItem[] = [
  {
    year: '2016',
    venue: 'SRIJAN JADAVPUR UNIVERSITY',
    title: '1st Place – Multiple Events',
    badge: 'MULTIPLE VICTORIES',
  },
  {
    year: '2019',
    venue: 'TECHNICHE IIT GUWAHATI',
    title: '1st Place – RoboSoccer',
    badge: 'TACTICAL MOBILITY',
  },
  {
    year: '2021',
    venue: 'ABU ROBOCON 2021 (VIRTUAL)',
    title: 'National Finalists – Top 15',
    badge: 'NATIONAL FINALISTS',
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
];

// -----------------------------------------------------------------------------
// 4. TECHNICAL WORKSHOPS & CAD CLINICS (GATEWAY TO ROBOTICS & DEDICATED TRACKS)
// -----------------------------------------------------------------------------
const workshopCards: EventCardItem[] = [
  {
    id: 'workshop-1-solidworks',
    section: 'workshops',
    title: 'Workshop 1: SolidWorks 3D CAD Modeling',
    yearOrCycle: 'October 2026',
    badge: 'K25 CAD TRACK // 3.5 HOURS',
    status: 'Completed',
    venue: 'CAD Lab // BIT Mesra',
    specs: 'SOLIDWORKS // DFM // ASSEMBLY',
    metric: '3.5 HRS DURATION',
    allocationOrPrize: 'For K25 Batch',
    image: '/timeline/workshop-solidworks-cad-model.jpg',
    description: 'Conducted for K25s to impart comprehensive practical knowledge of Computer-Aided Design (CAD), assembly constraints, and parametric modeling essential for national competitions including Robocon and Robowars.',
    problem: 'Preparing the K25 cohort with industry-grade mechanical design, structural kinematics, and manufacturing tolerance practices required for competitive robot engineering.',
    teamPov: 'Hands-on CAD session covering part creation, 3D assemblies, motion analysis, and DFM principles to empower upcoming builders for Robocon and Robowars chassis fabrication.',
    highlights: ['SolidWorks 3D Modeling', 'Robocon & Robowar Prep', 'Assemblies & Mates', 'DFM & Kinematics']
  },
  {
    id: 'workshop-2-embedded-systems',
    section: 'workshops',
    title: 'Workshop 2: Embedded Systems & Microcontrollers',
    yearOrCycle: '28th October, 2026',
    badge: 'GATEWAY TO ROBOTICS // 3.0 HOURS',
    status: 'Completed',
    venue: 'Seminar Hall // BIT Mesra',
    specs: 'ESP32 // GPIO // SENSORS & UART',
    metric: '3.0 HRS DURATION',
    allocationOrPrize: 'Gateway To Robotics 2026 (K26s)',
    image: '/timeline/workshop-embedded-k26.jpg',
    description: 'Conducted under "Gateway To Robotics 2026" to introduce K26 freshmen to embedded systems architectures, microcontrollers (ESP32/Arduino), GPIO interfacing, and sensor telemetry.',
    problem: 'Bridging high-level logic with hardware by teaching microcontroller pinouts, communication protocols (UART, I2C), and sensor acquisition to first-year robotics enthusiasts.',
    teamPov: 'Interactive live hardware demonstrations exploring 3.3V logic levels, ESP32 DevKit pin configurations, and motor driver control circuits for mobile robot platforms.',
    highlights: ['ESP32 Architecture', 'GPIO & Logic Levels', 'Sensor Interfacing', 'Gateway To Robotics']
  },
  {
    id: 'workshop-3-mechanical-systems',
    section: 'workshops',
    title: 'Workshop 3: Mechanical & Pneumatic Systems',
    yearOrCycle: '29th October, 2026',
    badge: 'GATEWAY TO ROBOTICS // 1.5 HOURS',
    status: 'Completed',
    venue: 'Seminar Hall // BIT Mesra',
    specs: 'PNEUMATICS // COMPRESSORS // ACTUATORS',
    metric: '1.5 HRS DURATION',
    allocationOrPrize: 'Gateway To Robotics 2026 (K26s)',
    image: '/timeline/workshop-mechanical-k26.jpg',
    description: 'Conducted under "Gateway To Robotics 2026" to introduce K26 students to mechanical systems, pneumatic circuits, solenoid valves, and real-world mechanisms used in robotics.',
    problem: 'Understanding pneumatic power transmission, air compression cycles, double-acting cylinders, and mechanical force delivery in competitive mechatronic mechanisms.',
    teamPov: 'Live pneumatic testbench rig demonstrations showcasing regulators, buffer tanks, solenoid valves, and cylinder actuation integrated into robot chassis designs.',
    highlights: ['Pneumatic System Circuits', 'Double-Acting Cylinders', 'Compressors & Regulators', 'Robotics Mechanisms']
  },
  {
    id: 'workshop-4-cad',
    section: 'workshops',
    title: 'Workshop 4: Computer-Aided Design (CAD)',
    yearOrCycle: '28th October, 2026',
    badge: 'GATEWAY TO ROBOTICS // 1.5 HOURS',
    status: 'Completed',
    venue: 'Seminar Hall // BIT Mesra',
    specs: 'CAD MODELING // 3D PROTOTYPING',
    metric: '1.5 HRS DURATION',
    allocationOrPrize: 'Gateway To Robotics 2026 (K26s)',
    image: '/timeline/workshop-cad-k26.jpg',
    description: 'Conducted under "Gateway To Robotics 2026" providing K26 students with an essential introduction to 3D CAD modeling, sketching geometry, and mechanical visualization for robotics projects.',
    problem: 'Introducing first-year students to parametric sketches, geometric constraints, 3D feature extrusions, and translating conceptual ideas into precise digital models.',
    teamPov: 'Live walkthrough of foundational CAD tools and feature trees, demonstrating how mechanical parts are modeled and prepared for rapid prototyping and 3D printing.',
    highlights: ['Parametric 3D Modeling', 'Sketching & Constraints', 'Rapid Prototyping', 'Gateway To Robotics']
  },
  {
    id: 'workshop-5-opencv-nlp',
    section: 'workshops',
    title: 'Workshop 5: OpenCV & Natural Language Processing',
    yearOrCycle: '30th October, 2026',
    badge: 'GATEWAY TO ROBOTICS // 3.0 HOURS',
    status: 'Completed',
    venue: 'Seminar Hall // BIT Mesra',
    specs: 'COMPUTER VISION // OPENCV // NLP',
    metric: '3.0 HRS DURATION',
    allocationOrPrize: 'Gateway To Robotics 2026 (K26s)',
    image: '/timeline/workshop-opencv-nlp-v2.jpg',
    description: 'Conducted under "Gateway To Robotics 2026" introducing K26 students to fundamental Computer Vision with OpenCV and practical concepts in Natural Language Processing (NLP).',
    problem: 'Demystifying robot perception, real-time image filtering, contour detection, and text/speech processing pipelines for modern intelligent robotics.',
    teamPov: 'Detailed interactive presentation on camera feed acquisition, color space segmentation, edge detection, and machine intelligence models for autonomous decision-making.',
    highlights: ['OpenCV Computer Vision', 'Image Filtering & Contours', 'NLP Fundamentals', 'Autonomous Perception']
  }
];

// Reusable Consistent Interactive Event Card with Pitch-Black Backdrop for Bot Cutouts
function UniformEventCard({ card, accentColor = 'cyan' }: { card: EventCardItem; accentColor?: 'cyan' | 'sky' | 'red' | 'emerald' }) {
  const [expanded, setExpanded] = useState(false);

  const getBorderHover = () => {
    switch (accentColor) {
      case 'sky': return 'hover:border-sky-400/50 hover:shadow-sky-500/10';
      case 'red': return 'hover:border-red-400/50 hover:shadow-red-500/10';
      case 'emerald': return 'hover:border-emerald-400/50 hover:shadow-emerald-500/10';
      default: return 'hover:border-cyan-400/50 hover:shadow-cyan-500/10';
    }
  };

  const getAccentText = () => {
    switch (accentColor) {
      case 'sky': return 'text-sky-300';
      case 'red': return 'text-red-300';
      case 'emerald': return 'text-emerald-300';
      default: return 'text-cyan-300';
    }
  };

  const getSpotlightColor = () => {
    switch (accentColor) {
      case 'sky': return 'rgba(56, 189, 248, 0.15)';
      case 'red': return 'rgba(239, 68, 68, 0.15)';
      case 'emerald': return 'rgba(16, 185, 129, 0.15)';
      default: return 'rgba(6, 182, 212, 0.15)';
    }
  };

  return (
    <GlassCard
      badge={card.badge}
      spotlightColor={getSpotlightColor()}
      className={`p-5 flex flex-col justify-between h-full group ${getBorderHover()} transition-all duration-300 shadow-lg`}
    >
      <div className="flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`font-mono text-[9px] ${getAccentText()} tracking-widest uppercase font-bold truncate`}>
            {card.yearOrCycle}
          </span>
          <span className="font-mono text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/15 shrink-0">
            {card.status}
          </span>
        </div>

        {/* Title: fixed height for grid uniformity */}
        <h4 className="font-modern font-black text-base text-white uppercase tracking-tight group-hover:text-white transition-colors h-11 flex items-center line-clamp-2">
          {card.title}
        </h4>

        {/* Venue metadata */}
        <div className="mt-1 space-y-1 font-mono text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPin className={`w-3 h-3 ${getAccentText()} shrink-0`} />
            <span className="truncate">{card.venue}</span>
          </div>
          {card.allocationOrPrize && (
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <Trophy className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">{card.allocationOrPrize}</span>
            </div>
          )}
        </div>

        {/* Image enclosure: pure pitch-black background with subtle ambient radial glow */}
        {card.image && (
          <div className="relative w-full h-44 rounded-lg overflow-hidden mt-3 border border-white/10 bg-[#000000] shadow-inner group/img flex items-center justify-center p-2">
            <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(255,255,255,0.03)_0%,#000000_80%] pointer-events-none" />
            <Image
              src={card.image}
              alt={card.title}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain p-2 group-hover/img:scale-105 transition-transform duration-500 ease-out z-10"
            />
          </div>
        )}

        {/* Description: consistent preview */}
        <p className="font-modern text-xs text-slate-300 mt-3 leading-relaxed line-clamp-2">
          {card.description}
        </p>

        {/* Highlights tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {card.highlights.slice(0, 3).map((h, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 font-mono text-[9px] text-slate-300 uppercase tracking-wide truncate max-w-[170px]"
            >
              {h}
            </span>
          ))}
          {card.highlights.length > 3 && (
            <span className="px-1.5 py-0.5 rounded bg-white/[0.04] font-mono text-[9px] text-slate-400">
              +{card.highlights.length - 3}
            </span>
          )}
        </div>

        {/* Expandable "Read More" Drawer */}
        {expanded && (
          <div className="mt-4 pt-3 border-t border-white/10 space-y-2 animate-in fade-in duration-200">
            {card.problem && (
              <div className="p-2.5 rounded-md bg-white/[0.03] border border-white/10 font-mono text-[10px]">
                <span className="text-cyan-400 font-bold uppercase tracking-wider block mb-0.5">
                  // PROBLEM STATEMENT
                </span>
                <span className="text-slate-300 leading-relaxed font-sans text-xs">
                  {card.problem}
                </span>
              </div>
            )}

            {card.teamPov && (
              <div className="p-2.5 rounded-md bg-sky-950/20 border border-sky-400/20 font-mono text-[10px]">
                <span className="text-sky-300 font-bold uppercase tracking-wider block mb-0.5">
                  // TEAM POV &amp; TACTICAL SOLUTION
                </span>
                <span className="text-slate-300 leading-relaxed font-sans text-xs">
                  {card.teamPov}
                </span>
              </div>
            )}

            <div className="p-2 rounded bg-black/40 border border-white/10 font-mono text-[10px] text-slate-300 flex items-center justify-between">
              <span className="text-slate-400">BENCHMARK:</span>
              <span className="font-bold text-white uppercase">{card.specs}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer controls: Read More toggle button only */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className={`inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase transition-colors cursor-pointer ${getAccentText()} hover:text-white`}
        >
          <span>{expanded ? 'Show Less' : 'Read More'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
          {card.yearOrCycle}
        </span>
      </div>
    </GlassCard>
  );
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'robosaga' | 'robocon' | 'robowars' | 'workshops'>('all');

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
      <div className="hidden sm:block absolute top-0 right-0 z-30 w-[240px] sm:w-[270px] xl:w-[290px] h-[44px] sm:h-[48px] opacity-95 hover:opacity-100 transition-opacity pointer-events-auto">
        <HudBox compact={true} theme="dark" title="EST. 2001 // BIT MESRA" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 pt-16 sm:pt-24 pb-20 px-4 sm:px-8 md:pl-24 max-w-7xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-slate-400 mb-5 uppercase tracking-widest">
          <Link href="/" className="hover:text-white transition-colors">Mission Control</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-300">Events &amp; Arenas</span>
        </div>

        {/* Hero Title Section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/[0.04] border border-white/10 shadow-xs font-mono text-[9px] tracking-widest text-slate-300 uppercase mb-3 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>// ARENAS &bull; ROBOSAGA &bull; ROBOCON &bull; ROBOWARS &bull; WORKSHOPS</span>
          </div>

          <h1 className="font-modern font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase leading-[1.08]">
            ARENAS, CAMPAIGNS &amp; <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              TECHNICAL WORKSHOPS
            </span>
          </h1>

          <p className="font-modern text-sm sm:text-base text-slate-300 max-w-3xl mt-4 leading-relaxed">
            The operational front of Robolution at BIT Mesra. Explore four dedicated sections spanning our annual flagship fest <strong className="text-white">RoboSaga</strong>, continental <strong className="text-white">ABU Robocon</strong> campaigns, battle-tested <strong className="text-white">Robowars &amp; National Arenas</strong>, and practical <strong className="text-white">Technical Workshops</strong>.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* EDITORIAL NAVIGATION — CATEGORY FILTER */}
        {/* ========================================================================= */}
        {(() => {
          const tabs: { key: typeof activeTab; label: string }[] = [
            { key: 'all', label: 'All Activities' },
            { key: 'robosaga', label: 'RoboSaga' },
            { key: 'robocon', label: 'Robocon' },
            { key: 'robowars', label: 'Robowars' },
            { key: 'workshops', label: 'Workshops' },
          ];

          return (
            <div className="mb-12">
              {/* Nav row */}
              <div className="flex items-center justify-between gap-6">
                {/* Tabs */}
                <nav className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-hide -mb-px">
                  {tabs.map(t => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setActiveTab(t.key)}
                      className={`relative pb-3 font-sans text-xs sm:text-sm tracking-wider uppercase whitespace-nowrap transition-colors duration-250 cursor-pointer ${
                        activeTab === t.key
                          ? 'text-white font-medium'
                          : 'text-slate-400 hover:text-slate-200 font-normal'
                      }`}
                    >
                      {t.label}
                      {/* Cyan underline indicator */}
                      <span
                        className={`absolute left-0 right-0 bottom-0 h-[2px] bg-cyan-400 transition-all duration-300 ${
                          activeTab === t.key
                            ? 'opacity-100 scale-x-100'
                            : 'opacity-0 scale-x-0'
                        }`}
                        style={{ transformOrigin: 'left center' }}
                      />
                    </button>
                  ))}
                </nav>
              </div>

              {/* 1px divider */}
              <div className="h-px bg-white/[0.08]" />
            </div>
          );
        })()}

        {/* ========================================================================= */}
        {/* SECTION 1: ROBOSAGA SPOTLIGHT & ARENAS */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'robosaga') && (
          <section className="mb-20 relative" id="robosaga">
            <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-white/10">
              <div className="flex flex-col gap-1">
                <h2 className="font-modern font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                  ROBOSAGA // ANNUAL FLAGSHIP FESTIVAL
                </h2>
                <span className="font-sans text-xs tracking-normal text-cyan-400 font-normal">
                  EASTERN INDIA&apos;S PREMIER ARENA &bull; BIT MESRA CAMPUS
                </span>
              </div>
            </div>

            {/* RoboSaga Featured Mega Card */}
            <ScrollReveal>
              <div className="relative rounded-xl overflow-hidden border border-cyan-400/30 bg-gradient-to-br from-cyan-950/20 via-[#04060c]/90 to-[#020307] p-6 sm:p-8 shadow-xl backdrop-blur-xl mb-8">
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 font-mono text-[9px] text-cyan-300 uppercase tracking-widest font-bold mb-3">
                      <Sparkles className="w-3 h-3" />
                      <span>NATIONAL-LEVEL ROBOTICS FESTIVAL</span>
                    </div>

                    <h3 className="font-modern font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
                      ROBOSAGA 2026
                    </h3>

                    <p className="font-modern text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
                      RoboSaga&apos;26 was a three-day national-level robotics festival organised by Robolution at Birla Institute of Technology, Mesra. Bringing together robotics enthusiasts, innovators and engineering minds through competitions, hackathons, exhibitions, expert interactions and hands-on technical workshops.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-white/10 font-mono">
                      <div>
                        <span className="text-xl sm:text-2xl font-black text-white block">3 DAYS</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider">Festival Duration</span>
                      </div>
                      <div>
                        <span className="text-xl sm:text-2xl font-black text-cyan-400 block">5,000+</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider">Participation</span>
                      </div>
                      <div>
                        <span className="text-xl sm:text-2xl font-black text-sky-400 block">48 TEAMS</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider">Hackaway Teams</span>
                      </div>
                      <div>
                        <span className="text-xl sm:text-2xl font-black text-amber-300 block">EXHIBITIONS</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider">&amp; Workshops</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-72 shrink-0 flex flex-col gap-2.5">
                    <div className="p-4 rounded-lg bg-white/[0.04] border border-white/10 backdrop-blur-md">
                      <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-widest block mb-0.5">
                        // FESTIVAL LOCATION &amp; DATE
                      </span>
                      <h4 className="font-modern font-black text-base text-white uppercase">
                        MAIN CAMPUS, BIT MESRA
                      </h4>
                      <p className="font-mono text-[11px] text-cyan-300 font-semibold mt-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>23–25 JANUARY 2026</span>
                      </p>
                    </div>

                    <IslandButton
                      href="/contact"
                      variant="primary"
                      className="w-full justify-center text-xs py-2"
                    >
                      Connect / Enquire
                    </IslandButton>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Individual RoboSaga Track Cards Grid: Exactly 4 cards in 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 mb-14">
              {robosagaCards.map(card => (
                <ScrollReveal key={card.id}>
                  <UniformEventCard card={card} accentColor="cyan" />
                </ScrollReveal>
              ))}
            </div>

            {/* Section: BEYOND THE ARENA (3 Visually Consistent Cards) */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-5 font-mono text-xs text-slate-400 uppercase tracking-widest border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>// BEYOND THE ARENA</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  EXHIBITIONS &bull; SESSIONS &bull; CLINICS
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {beyondArenaCards.map(item => (
                  <ScrollReveal key={item.id}>
                    <GlassCard
                      badge={item.badge}
                      spotlightColor="rgba(6, 182, 212, 0.12)"
                      className="p-5 flex flex-col justify-between h-full group hover:border-cyan-400/50 hover:shadow-cyan-500/10 transition-all duration-300"
                    >
                      <div>
                        <h4 className="font-modern font-black text-base text-white uppercase tracking-tight group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </h4>
                        <p className="font-modern text-xs text-slate-300 mt-2.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-slate-400">
                        <span className="uppercase tracking-widest text-cyan-400">RoboSaga &apos;26 Feature</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                    </GlassCard>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: ROBOCON CAMPAIGNS (TEAM PRATYUMNIS) - 6 BALANCED CARDS (3x2) */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'robocon') && (
          <section className="mb-20 relative" id="robocon">
            <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-white/10">
              <div className="flex flex-col gap-1">
                <h2 className="font-modern font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                  ABU ROBOCON // NATIONAL CAMPAIGNS
                </h2>
                <span className="font-sans text-xs tracking-normal text-sky-400 font-normal">
                  TEAM PRATYUMNIS &bull; 6 RECORDED CAMPAIGNS &bull; 2026 KUNG FU QUEST (89/100) TO 2013 ROOKIE
                </span>
              </div>
            </div>

            {/* Clean 3-Column Grid for All 6 Robocon Cards (Perfect 3x2 Matrix) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {roboconFeaturedCards.map(card => (
                <ScrollReveal key={card.id}>
                  <UniformEventCard card={card} accentColor="sky" />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: ROBOWARS & NATIONAL ARENA PODIUMS */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'robowars') && (
          <section className="mb-20 relative" id="robowars">
            <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-white/10">
              <div className="flex flex-col gap-1">
                <h2 className="font-modern font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                  ROBO WARS &amp; NATIONAL PODIUMS
                </h2>
                <span className="font-sans text-xs tracking-normal text-red-400 font-normal">
                  IIT BOMBAY TECHFEST &bull; IIT GUWAHATI &bull; NIT TRICHY &bull; BITS PILANI &bull; SIH &bull; E-YANTRA
                </span>
              </div>
            </div>

            {/* Part 1: Visual Cards with Genuine Captured Bot Photos (6 cards: 3 per row evenly) */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4 font-mono text-xs text-slate-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span>// COMPETITION CAMPAIGNS &amp; COMBAT PLATFORMS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {robowarsVisualCards.map(card => (
                  <ScrollReveal key={card.id}>
                    <UniformEventCard card={card} accentColor="red" />
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Part 2: Identical to the Our Heritage Cards Design (otherAchievements - 7 items, 7th CENTERED) */}
            <div>
              <div className="flex items-center justify-between mb-5 font-mono text-xs text-slate-400 uppercase tracking-widest border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>// OTHER DOCUMENTED ACHIEVEMENTS</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {otherHeritageAchievements.length} // NATIONAL HONORS
                </span>
              </div>

              {/* 3 columns: First 6 cards (2 rows of 3), 7th card centered in the 3rd row via col-start-2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {otherHeritageAchievements.map((item, idx) => {
                  const centerClass = idx === 6 ? 'lg:col-start-2' : '';
                  return (
                    <div key={idx} className={centerClass}>
                      <ScrollReveal>
                        <GlassCard
                          badge={item.badge}
                          spotlightColor="rgba(6, 182, 212, 0.12)"
                          className="p-5 flex flex-col justify-between h-full group hover:border-cyan-400/40 transition-colors"
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

                            <h4 className="font-modern font-bold text-xs text-slate-400 uppercase tracking-wider mb-1.5">
                              {item.venue}
                            </h4>

                            <p className="font-modern font-black text-sm sm:text-base text-white uppercase tracking-tight group-hover:text-cyan-300 transition-colors">
                              {item.title}
                            </p>
                          </div>

                          <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-slate-400">
                            <span className="uppercase tracking-widest text-cyan-400/80">Podium Validated</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          </div>
                        </GlassCard>
                      </ScrollReveal>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: TECHNICAL WORKSHOPS & CAD CLINICS */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'workshops') && (
          <section className="mb-20 relative" id="workshops">
            <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-white/10">
              <div className="flex flex-col gap-1">
                <h2 className="font-modern font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                  TECHNICAL WORKSHOPS // CLINICS &amp; BOOTCAMPS
                </h2>
                <span className="font-sans text-xs tracking-normal text-emerald-400 font-normal">
                  GATEWAY TO ROBOTICS 2026 &bull; SOLIDWORKS CAD &bull; EMBEDDED ESP32 &bull; PNEUMATICS &bull; OPENCV &amp; NLP
                </span>
              </div>
            </div>

            {/* Responsive grid for 5 cards: Row 1 has 3 cards, Row 2 centers the remaining 2 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
              {workshopCards.map((card, idx) => {
                // First 3 cards take 2 columns each out of 6 (Row 1: 2+2+2 = 6)
                // 4th card starts at column 2 and spans 2 cols, 5th card spans 2 cols (Row 2: col 2-3 & col 4-5, perfectly centered!)
                const colSpanClass =
                  idx < 3
                    ? 'lg:col-span-2'
                    : idx === 3
                    ? 'lg:col-span-2 lg:col-start-2'
                    : 'lg:col-span-2';

                return (
                  <div key={card.id} className={colSpanClass}>
                    <ScrollReveal>
                      <UniformEventCard card={card} accentColor="emerald" />
                    </ScrollReveal>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* CALL TO ACTION: ROBOSAGA & SPONSORSHIP */}
        {/* ========================================================================= */}
        <ScrollReveal>
          <GlassCard
            badge="LAB COLLABORATION // DIRECT ENGAGEMENT"
            spotlightColor="rgba(255, 255, 255, 0.08)"
            className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-5"
          >
            <div>
              <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-widest block mb-0.5">
                // PARTNER &bull; COMPETE &bull; SPONSOR
              </span>
              <h3 className="font-modern font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                COMPETE AT ROBOSAGA OR SPONSOR OUR EXPEDITIONS
              </h3>
              <p className="font-modern text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
                Connect directly with collegiate builders, register your team for the next RoboSaga fest, or partner with Robolution across our national robotics campaigns.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <IslandButton
                href="/contact"
                variant="primary"
                className="text-xs py-2"
              >
                Register / Partner
              </IslandButton>
              <IslandButton
                href="/about"
                variant="glass"
                className="text-xs py-2"
              >
                Our Heritage
              </IslandButton>
            </div>
          </GlassCard>
        </ScrollReveal>
      </main>

      {/* Institutional Footer */}
      <footer className="relative z-20 bg-[#04060a]/70 backdrop-blur-xl py-12 px-4 sm:px-8 md:pl-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-modern font-black text-base text-white uppercase tracking-wider">
              ROBOLUTION &bull; BIT MESRA
            </h4>
            <span className="font-mono text-[11px] text-slate-400 block mt-0.5">
              Official Robotics Society &bull; Department of Production &amp; Industrial Engg.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-slate-400 font-mono text-xs">
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
