const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const excelPath = 'c:/Users/Mysha/Downloads/Copy of results_robolution_k26.xlsx';
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['Ranked Students'];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
const rawRows = data.slice(3).filter(r => r && r[0] && String(r[0]).trim().length > 0);

function cleanString(val) {
  return String(val || '').trim();
}

function normalizeBranch(b) {
  const branch = cleanString(b);
  if (!branch || branch.toLowerCase() === 'not found') return 'ENGG';
  if (branch.toUpperCase() === 'MECH') return 'Mechanical';
  if (branch.toUpperCase() === 'IMSC MNC' || branch.toUpperCase() === 'IMSC MN C') return 'IMSc Maths & Computing';
  if (branch.toUpperCase() === 'IMSC MATHS AND COMPUTING' || branch.toLowerCase() === 'mathematics and computing') return 'IMSc Maths & Computing';
  if (branch.toUpperCase() === 'CHEMICAL') return 'Chemical';
  if (branch.toLowerCase() === 'food technology') return 'Food Technology';
  return branch;
}

const cadets = rawRows.map((r, idx) => {
  const name = cleanString(r[0]);
  const rollNo = cleanString(r[1]);
  const branch = normalizeBranch(r[2]);
  const domainRaw = cleanString(r[4]);
  const marks = (r[5] !== undefined && r[5] !== null && String(r[5]).trim() !== '') ? Number(r[5]) : null;
  const remarks = cleanString(r[6]);

  const rawCombined = (domainRaw + ' ' + remarks).toLowerCase();

  const assignedSubTeams = [];

  // Determine subteams
  const hasTech = rawCombined.includes('technical') || 
                  (!rawCombined.includes('sponsorship') && !rawCombined.includes('video') && !rawCombined.includes('graphic') && !rawCombined.includes('design') && !rawCombined.includes('management'));
  const hasSpons = rawCombined.includes('sponsorship') || rawCombined.includes('management') || rawCombined.includes('pr');
  const hasVideo = rawCombined.includes('video');
  const hasDesign = rawCombined.includes('graphic') || rawCombined.includes('design') || rawCombined.includes('photoshop');

  if (hasTech && !rawCombined.includes('management only') && domainRaw !== 'Sponsorship' && domainRaw !== ' Sponsorship' && domainRaw !== 'Video Editing' && domainRaw !== 'Graphic designing, Video editing') {
    assignedSubTeams.push('Technical');
  }

  if (hasSpons) {
    assignedSubTeams.push('Sponsorship');
  }

  if (hasVideo) {
    assignedSubTeams.push('Video Editing');
  }

  if (hasDesign) {
    assignedSubTeams.push('Graphic Design');
  }

  // Safety fallback
  if (assignedSubTeams.length === 0) {
    assignedSubTeams.push('Technical');
  }

  // Primary subteam
  const primarySubTeam = assignedSubTeams[0];

  // Derive specialization
  let specialization = 'Robotics & Hardware Engineering';
  if (assignedSubTeams.includes('Video Editing') && assignedSubTeams.length === 1) {
    specialization = 'Motion Graphics & Video Production';
  } else if (assignedSubTeams.includes('Graphic Design') && assignedSubTeams.length === 1) {
    specialization = 'Visual Identity & Graphic Design';
  } else if (assignedSubTeams.includes('Sponsorship') && assignedSubTeams.length === 1) {
    specialization = 'Corporate Sponsorship & Outreach';
  } else if (assignedSubTeams.includes('Video Editing') && assignedSubTeams.includes('Graphic Design')) {
    specialization = 'Creative Media & Video Production';
  } else if (assignedSubTeams.includes('Technical') && assignedSubTeams.includes('Graphic Design')) {
    specialization = 'Technical Robotics & Graphic Design';
  } else if (assignedSubTeams.includes('Technical') && assignedSubTeams.includes('Sponsorship')) {
    specialization = 'Technical Systems & Sponsorship';
  } else if (['CSE', 'AIML', 'IMSc Maths & Computing'].includes(branch)) {
    specialization = remarks.toLowerCase().includes('ros2') ? 'ROS2 & Kinematic Control' : 
                     remarks.toLowerCase().includes('nlp') ? 'Applied AI & Perception' : 'Software & Algorithmic Systems';
  } else if (['Mechanical', 'PIE'].includes(branch)) {
    specialization = 'Mechanical Kinematics & CAD';
  } else if (['ECE', 'EEE'].includes(branch)) {
    specialization = 'Embedded Firmware & Circuitry';
  }

  return {
    id: 'k26-' + String(idx + 1).padStart(2, '0'),
    rank: idx + 1,
    name,
    rollNo,
    branch,
    primarySubTeam,
    assignedSubTeams,
    specialization,
    domain: domainRaw.replace(/\n/g, ' • ') || 'Technical',
    marks,
    remarks: remarks || undefined
  };
});

const pods = [
  {
    id: 'pod-technical',
    code: 'POD-01 // TECH',
    name: 'Technical',
    shortName: 'Technical',
    iconName: 'Cpu',
    tagline: 'Robotics, Mechatronics, Firmware & Software Engineering',
    description: 'The core engineering foundation of Robolution: building autonomous combat and rover chassis, high-power PCB electronics, embedded firmware microcontrollers, and real-time robotic navigation systems.',
    leadBay: 'Advanced Mechatronics & Embedded Systems Lab',
    focusAreas: [
      'Kinematic CAD & FEA Simulation',
      'ESP32 / STM32 Microcontroller Firmware',
      'Autonomous ROS2 & Computer Vision',
      'Multi-layer PCB & Power Electronics',
      'Robotic Drive Systems & Actuation'
    ]
  },
  {
    id: 'pod-design',
    code: 'POD-02 // DESIGN',
    name: 'Graphic Design',
    shortName: 'Graphic Design',
    iconName: 'Palette',
    tagline: 'Visual Architecture, UI/UX Systems & Brand Identity',
    description: 'Crafting precision graphics, telemetry aesthetics, promotional posters, event merchandise, club apparel, and digital design collateral that shape Robolution’s aerospace-grade brand identity.',
    leadBay: 'Visual Architecture & Creative Design Bay',
    focusAreas: [
      'Adobe Photoshop & Illustrator',
      'Figma & UI/UX System Guidelines',
      'Event Posters & Vector Artworks',
      'Merchandise & Apparel Design',
      'HUD & Telemetry Asset Design'
    ]
  },
  {
    id: 'pod-video',
    code: 'POD-03 // VIDEO',
    name: 'Video Editing',
    shortName: 'Video Editing',
    iconName: 'Film',
    tagline: 'Cinematics, Motion Graphics & Visual Storytelling',
    description: 'Capturing, editing, and directing Robolution’s cinematic launch trailers, competition recap documentaries, technical explainer animations, and high-impact social motion graphics.',
    leadBay: 'Creative Studio & Cinema Post-Production Lab',
    focusAreas: [
      'Adobe Premiere Pro & DaVinci Resolve',
      'After Effects Motion Graphics',
      'Cinematography & Sound Design',
      'High-Energy Tech Launch Reels',
      'Documentary & Event Coverage'
    ]
  },
  {
    id: 'pod-sponsorship',
    code: 'POD-04 // SPONS',
    name: 'Sponsorship',
    shortName: 'Sponsorship',
    iconName: 'Shield',
    tagline: 'Corporate Partnerships, Club Outreach & Strategic Funding',
    description: 'Leading industrial corporate alliances, managing competition sponsorships, alumni relations, official pitch presentations, and driving financial operations for Robolution’s national campaigns.',
    leadBay: 'Strategic Operations & Corporate Outreach Wing',
    focusAreas: [
      'Corporate Pitch Decks & Deliverables',
      'Industry Sponsorship Acquisition',
      'Brand Alliances & Financial Planning',
      'Public Relations & Campus Outreach',
      'Event Operations & Logistics'
    ]
  }
];

const tsContent = `// AUTO-GENERATED FROM results_robolution_k26.xlsx
// Robolution K26 Induction Results Data Structure

export type SubTeamType = 'Technical' | 'Graphic Design' | 'Video Editing' | 'Sponsorship';

export interface CadetResult {
  id: string;
  rank: number;
  name: string;
  rollNo: string;
  branch: string;
  primarySubTeam: SubTeamType;
  assignedSubTeams: SubTeamType[];
  specialization: string;
  domain: string;
  marks: number | null;
  remarks?: string;
}

export interface PodMeta {
  id: string;
  code: string;
  name: SubTeamType;
  shortName: string;
  iconName: 'Cpu' | 'Shield' | 'Film' | 'Palette';
  tagline: string;
  description: string;
  leadBay: string;
  focusAreas: string[];
}

export const PODS_METADATA: PodMeta[] = ${JSON.stringify(pods, null, 2)};

export const K26_CADETS: CadetResult[] = ${JSON.stringify(cadets, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'data', 'inductionResultsK26.ts');
fs.writeFileSync(outputPath, tsContent, 'utf8');
console.log('Successfully generated inductionResultsK26.ts with ' + cadets.length + ' cadets across 4 sub-teams!');
