// AUTO-GENERATED FROM results_robolution_k26.xlsx
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

export const PODS_METADATA: PodMeta[] = [
  {
    "id": "pod-technical",
    "code": "POD-01 // TECH",
    "name": "Technical",
    "shortName": "Technical",
    "iconName": "Cpu",
    "tagline": "Robotics, Mechatronics, Firmware & Software Engineering",
    "description": "The core engineering foundation of Robolution: building autonomous combat and rover chassis, high-power PCB electronics, embedded firmware microcontrollers, and real-time robotic navigation systems.",
    "leadBay": "Advanced Mechatronics & Embedded Systems Lab",
    "focusAreas": [
      "Kinematic CAD & FEA Simulation",
      "ESP32 / STM32 Microcontroller Firmware",
      "Autonomous ROS2 & Computer Vision",
      "Multi-layer PCB & Power Electronics",
      "Robotic Drive Systems & Actuation"
    ]
  },
  {
    "id": "pod-design",
    "code": "POD-02 // DESIGN",
    "name": "Graphic Design",
    "shortName": "Graphic Design",
    "iconName": "Palette",
    "tagline": "Visual Architecture, UI/UX Systems & Brand Identity",
    "description": "Crafting precision graphics, telemetry aesthetics, promotional posters, event merchandise, club apparel, and digital design collateral that shape Robolution’s aerospace-grade brand identity.",
    "leadBay": "Visual Architecture & Creative Design Bay",
    "focusAreas": [
      "Adobe Photoshop & Illustrator",
      "Figma & UI/UX System Guidelines",
      "Event Posters & Vector Artworks",
      "Merchandise & Apparel Design",
      "HUD & Telemetry Asset Design"
    ]
  },
  {
    "id": "pod-video",
    "code": "POD-03 // VIDEO",
    "name": "Video Editing",
    "shortName": "Video Editing",
    "iconName": "Film",
    "tagline": "Cinematics, Motion Graphics & Visual Storytelling",
    "description": "Capturing, editing, and directing Robolution’s cinematic launch trailers, competition recap documentaries, technical explainer animations, and high-impact social motion graphics.",
    "leadBay": "Creative Studio & Cinema Post-Production Lab",
    "focusAreas": [
      "Adobe Premiere Pro & DaVinci Resolve",
      "After Effects Motion Graphics",
      "Cinematography & Sound Design",
      "High-Energy Tech Launch Reels",
      "Documentary & Event Coverage"
    ]
  },
  {
    "id": "pod-sponsorship",
    "code": "POD-04 // SPONS",
    "name": "Sponsorship",
    "shortName": "Sponsorship",
    "iconName": "Shield",
    "tagline": "Corporate Partnerships, Club Outreach & Strategic Funding",
    "description": "Leading industrial corporate alliances, managing competition sponsorships, alumni relations, official pitch presentations, and driving financial operations for Robolution’s national campaigns.",
    "leadBay": "Strategic Operations & Corporate Outreach Wing",
    "focusAreas": [
      "Corporate Pitch Decks & Deliverables",
      "Industry Sponsorship Acquisition",
      "Brand Alliances & Financial Planning",
      "Public Relations & Campus Outreach",
      "Event Operations & Logistics"
    ]
  }
];

export const K26_CADETS: CadetResult[] = [
  {
    "id": "k26-01",
    "rank": 1,
    "name": "Ankit Raj",
    "rollNo": "BTECH/10091/26",
    "branch": "CSE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Software & Algorithmic Systems",
    "domain": "Technical",
    "marks": 38,
    "remarks": "taken by panel 3"
  },
  {
    "id": "k26-02",
    "rank": 2,
    "name": "Rounak Kumar",
    "rollNo": "BTECH/10097/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 38,
    "remarks": "taken by panel -1 (Aacha hai kaam krega)   (ROS2 aata hai)"
  },
  {
    "id": "k26-03",
    "rank": 3,
    "name": "Sushruth K Sarvessh",
    "rollNo": "BT/10683/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 38,
    "remarks": "Lena Padega bahaut aacha hai (Cotre ECE) oppppppp  (Panel 1 and Panel-2 combined)"
  },
  {
    "id": "k26-04",
    "rank": 4,
    "name": "Arnav Sinha",
    "rollNo": "BTECH/10669/26",
    "branch": "Mechanical",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Mechanical Kinematics & CAD",
    "domain": "Technical",
    "marks": 37,
    "remarks": "should recruit him!!!"
  },
  {
    "id": "k26-05",
    "rank": 5,
    "name": "Puneet Kuldeep",
    "rollNo": "BTECH/10693/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 37,
    "remarks": "good knowldege"
  },
  {
    "id": "k26-06",
    "rank": 6,
    "name": "Rudranil Bhattacharya",
    "rollNo": "IMH/10059/26",
    "branch": "IMSc Maths & Computing",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Software & Algorithmic Systems",
    "domain": "Technical",
    "marks": 37,
    "remarks": "Lena hi hai essko !"
  },
  {
    "id": "k26-07",
    "rank": 7,
    "name": "Rachit Aryan Asthana",
    "rollNo": "BTECH/10688/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 36
  },
  {
    "id": "k26-08",
    "rank": 8,
    "name": "Sangam Kumar",
    "rollNo": "BTECH/10505/26",
    "branch": "Chemical",
    "primarySubTeam": "Sponsorship",
    "assignedSubTeams": [
      "Sponsorship"
    ],
    "specialization": "Corporate Sponsorship & Outreach",
    "domain": "Management: Sponsorship",
    "marks": 36,
    "remarks": "Note: from panel-7, changegd due to time issue , good knowledge about management"
  },
  {
    "id": "k26-09",
    "rank": 9,
    "name": "Abhinav Kumar Pandit",
    "rollNo": "BTECH/10417/26",
    "branch": "EEE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 35
  },
  {
    "id": "k26-10",
    "rank": 10,
    "name": "Harshit Raj",
    "rollNo": "BTECH/10732/26",
    "branch": "Mechanical",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Mechanical Kinematics & CAD",
    "domain": "Technical",
    "marks": 35,
    "remarks": "Taken by panel 3 (Sahi hai , lelo)"
  },
  {
    "id": "k26-11",
    "rank": 11,
    "name": "Nimesh Kumar",
    "rollNo": "BTECH/10205/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical",
      "Sponsorship"
    ],
    "specialization": "Technical Systems & Sponsorship",
    "domain": "Technical",
    "marks": 35,
    "remarks": "taken by panel 6,( first priority mechanical and very knowledgeable)"
  },
  {
    "id": "k26-12",
    "rank": 12,
    "name": "Tijil Govil",
    "rollNo": "BTECH/10513/26",
    "branch": "EEE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical",
      "Video Editing",
      "Graphic Design"
    ],
    "specialization": "Creative Media & Video Production",
    "domain": "Technical • Graphic Design Video Editing",
    "marks": 34.5,
    "remarks": "Note: Changed due to medical reasons"
  },
  {
    "id": "k26-13",
    "rank": 13,
    "name": "Aditya Chandna",
    "rollNo": "BTECH/10148/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical",
      "Graphic Design"
    ],
    "specialization": "Technical Robotics & Graphic Design",
    "domain": "Technical",
    "marks": 34,
    "remarks": "knows photoshop and is great one by other panel"
  },
  {
    "id": "k26-14",
    "rank": 14,
    "name": "Anisha Raj",
    "rollNo": "BTECH/10461/26",
    "branch": "Chemical",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical",
      "Sponsorship",
      "Graphic Design"
    ],
    "specialization": "Technical Robotics & Graphic Design",
    "domain": "Technical • Graphic Design",
    "marks": 34,
    "remarks": "Knows pretty much about club, has designed for fas, learning programming (taken by other panel)"
  },
  {
    "id": "k26-15",
    "rank": 15,
    "name": "Anurag Das",
    "rollNo": "BTECH/10958/26",
    "branch": "Mechanical",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical",
      "Video Editing",
      "Graphic Design"
    ],
    "specialization": "Creative Media & Video Production",
    "domain": "Technical • Graphic DesignVideo Editing",
    "marks": 34,
    "remarks": "embedded and video"
  },
  {
    "id": "k26-16",
    "rank": 16,
    "name": "Archisman Mishra",
    "rollNo": "BTECH/10370/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical",
      "Sponsorship"
    ],
    "specialization": "Technical Systems & Sponsorship",
    "domain": "Technical • Sponsorship",
    "marks": 34,
    "remarks": "taken by panel 3"
  },
  {
    "id": "k26-17",
    "rank": 17,
    "name": "Navya saxena",
    "rollNo": "BTECH/10339/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 34,
    "remarks": "Good knowledge, jitna padhaya gaya tha aata hai"
  },
  {
    "id": "k26-18",
    "rank": 18,
    "name": "Ninad Ravindra Patil",
    "rollNo": "BTECH/10811/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 34,
    "remarks": "Panel-1 conducted"
  },
  {
    "id": "k26-19",
    "rank": 19,
    "name": "Siddhant Prakash",
    "rollNo": "BTECH/10376/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 34,
    "remarks": "confident and keen. has knowledge too"
  },
  {
    "id": "k26-20",
    "rank": 20,
    "name": "Vishesh Malav",
    "rollNo": "BTECH/10576/26",
    "branch": "Mechanical",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Mechanical Kinematics & CAD",
    "domain": "Technical",
    "marks": 34
  },
  {
    "id": "k26-21",
    "rank": 21,
    "name": "Bhaskar Krishnan",
    "rollNo": "BTECH/10521/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 33
  },
  {
    "id": "k26-22",
    "rank": 22,
    "name": "Manan Nigam",
    "rollNo": "BTECH/10282/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical",
      "Sponsorship"
    ],
    "specialization": "Technical Systems & Sponsorship",
    "domain": "Technical",
    "marks": 33,
    "remarks": "projects h simple simple wale, embedded ka thik knowledge h and papa ke paas kaafi components h"
  },
  {
    "id": "k26-23",
    "rank": 23,
    "name": "Ritkriti Roy",
    "rollNo": "BTECH/11188/26",
    "branch": "Food Technology",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Robotics & Hardware Engineering",
    "domain": "Technical",
    "marks": 33,
    "remarks": "her nlp knowledge was good"
  },
  {
    "id": "k26-24",
    "rank": 24,
    "name": "Anish Kachhap",
    "rollNo": "BTECH/10955/26",
    "branch": "Mechanical",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Mechanical Kinematics & CAD",
    "domain": "Technical",
    "marks": 32,
    "remarks": "theek thak knowledge"
  },
  {
    "id": "k26-25",
    "rank": 25,
    "name": "Naman Sagar",
    "rollNo": "BTECH/10043/26",
    "branch": "CSE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Software & Algorithmic Systems",
    "domain": "Technical",
    "marks": 32
  },
  {
    "id": "k26-26",
    "rank": 26,
    "name": "Palak Gupta",
    "rollNo": "BTECH/11139/26",
    "branch": "Mechanical",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical",
      "Graphic Design"
    ],
    "specialization": "Technical Robotics & Graphic Design",
    "domain": "Technical • Graphic Design",
    "marks": 32,
    "remarks": "knows basics clearly and is confident too"
  },
  {
    "id": "k26-27",
    "rank": 27,
    "name": "Shubham Kumar",
    "rollNo": "BTECH/10167/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 32
  },
  {
    "id": "k26-28",
    "rank": 28,
    "name": "Soutrik Banerjee",
    "rollNo": "BTECH/10918/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical",
      "Sponsorship"
    ],
    "specialization": "Technical Systems & Sponsorship",
    "domain": "Technical",
    "marks": 32,
    "remarks": "taken by panel 6, build some bot previously"
  },
  {
    "id": "k26-29",
    "rank": 29,
    "name": "Krishna N Gujjar",
    "rollNo": "BTECH/10637/26",
    "branch": "AIML",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical",
      "Sponsorship"
    ],
    "specialization": "Technical Systems & Sponsorship",
    "domain": "Technical",
    "marks": 31.5,
    "remarks": "Embedded. Worked on some basic projects. was sure in what sub team he wants.(reverified by abhishek )"
  },
  {
    "id": "k26-30",
    "rank": 30,
    "name": "Soumya Prasad",
    "rollNo": "BTECH/11120/26",
    "branch": "EEE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 31.5,
    "remarks": "Embedded only"
  },
  {
    "id": "k26-31",
    "rank": 31,
    "name": "Akshara",
    "rollNo": "BTECH/11125/26",
    "branch": "Mechanical",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Mechanical Kinematics & CAD",
    "domain": "Technical",
    "marks": 31,
    "remarks": "took by panel 6."
  },
  {
    "id": "k26-32",
    "rank": 32,
    "name": "Anubhab Goswami",
    "rollNo": "BTECH/10153/26",
    "branch": "CSE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Software & Algorithmic Systems",
    "domain": "Technical",
    "marks": 31,
    "remarks": "active in workshop, should take...he can learn, lelo"
  },
  {
    "id": "k26-33",
    "rank": 33,
    "name": "Aditya Kharkwal",
    "rollNo": "BTECH/10239/26",
    "branch": "AIML",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Software & Algorithmic Systems",
    "domain": "Technical",
    "marks": 30,
    "remarks": "Participated in EEESOC & Robolution Pantheon Event 2nd in ROBO - RUMBLE"
  },
  {
    "id": "k26-34",
    "rank": 34,
    "name": "Aman Kumar",
    "rollNo": "BTECH/10090/26",
    "branch": "CSE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Software & Algorithmic Systems",
    "domain": "Technical",
    "marks": 30,
    "remarks": "keen to learn, is interted in club"
  },
  {
    "id": "k26-35",
    "rank": 35,
    "name": "Aprajita Srivastava",
    "rollNo": "IMH/10054/26",
    "branch": "IMSc Maths & Computing",
    "primarySubTeam": "Sponsorship",
    "assignedSubTeams": [
      "Sponsorship",
      "Graphic Design"
    ],
    "specialization": "Software & Algorithmic Systems",
    "domain": "Sponsorship, Graphic Design",
    "marks": 30,
    "remarks": "Management only"
  },
  {
    "id": "k26-36",
    "rank": 36,
    "name": "Prachi",
    "rollNo": "BTECH/10338/26",
    "branch": "AIML",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical",
      "Sponsorship"
    ],
    "specialization": "Technical Systems & Sponsorship",
    "domain": "Technical",
    "marks": 30,
    "remarks": "10/10 Embedded 6/10 Programming , already doing robotics project"
  },
  {
    "id": "k26-37",
    "rank": 37,
    "name": "Pratuysh Mishra",
    "rollNo": "BTECH/10538/26",
    "branch": "ENGG",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Robotics & Hardware Engineering",
    "domain": "Technical",
    "marks": 30
  },
  {
    "id": "k26-38",
    "rank": 38,
    "name": "Ritik Gupta",
    "rollNo": "BTECH/10327/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 30
  },
  {
    "id": "k26-39",
    "rank": 39,
    "name": "Shashwat Chandra",
    "rollNo": "BTECH/10005/26",
    "branch": "Mechanical",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical",
      "Video Editing"
    ],
    "specialization": "Mechanical Kinematics & CAD",
    "domain": "Technical,Video Editing",
    "marks": 30,
    "remarks": "thora confidence kam tha..but poora workshop ka pdf chaat k aaya tha"
  },
  {
    "id": "k26-40",
    "rank": 40,
    "name": "Swastika Mukhopadhyay",
    "rollNo": "BTECH/10424/26",
    "branch": "EEE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 30,
    "remarks": "acha knowledge h , thinking capacity h, theory acha h , pehle se research kra h khud se"
  },
  {
    "id": "k26-41",
    "rank": 41,
    "name": "Tanushka Arya",
    "rollNo": "BTECH/10399/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 30,
    "remarks": "in no other club, decent knowledge"
  },
  {
    "id": "k26-42",
    "rank": 42,
    "name": "Vipin Mishra",
    "rollNo": "BTECH/10645/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 30,
    "remarks": "he was curious...porbably acha karna chayiye. not in any club, lelo"
  },
  {
    "id": "k26-43",
    "rank": 43,
    "name": "Aparajita Karmakar",
    "rollNo": "IMH/10029/26",
    "branch": "IMSc Maths & Computing",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Software & Algorithmic Systems",
    "domain": "Technical",
    "marks": 29,
    "remarks": "Lelo krlegi kch na kch...."
  },
  {
    "id": "k26-44",
    "rank": 44,
    "name": "Khushi Kumari",
    "rollNo": "BTECH/11183/26",
    "branch": "Mechanical",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical",
      "Sponsorship"
    ],
    "specialization": "Technical Systems & Sponsorship",
    "domain": "Technical",
    "marks": 29,
    "remarks": "lE SAKTE HAI MANAGEMENT MAI KAAM KRLEGI AAB KYA BOLE"
  },
  {
    "id": "k26-45",
    "rank": 45,
    "name": "Manan Gupta",
    "rollNo": "BTECH/10476/26",
    "branch": "PIE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Mechanical Kinematics & CAD",
    "domain": "Technical",
    "marks": 29
  },
  {
    "id": "k26-46",
    "rank": 46,
    "name": "Srija Majumdar",
    "rollNo": "BTECH/10657/26",
    "branch": "Mechanical",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Mechanical Kinematics & CAD",
    "domain": "Technical",
    "marks": 29,
    "remarks": "Note: Changed from panel-6 due to fever"
  },
  {
    "id": "k26-47",
    "rank": 47,
    "name": "Anushri",
    "rollNo": "IMH/10077/26",
    "branch": "IMSc Maths & Computing",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Software & Algorithmic Systems",
    "domain": "Technical",
    "marks": 28.5,
    "remarks": "Taken by other panel"
  },
  {
    "id": "k26-48",
    "rank": 48,
    "name": "Naman Shrivastava",
    "rollNo": "BTECH/10397/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 28,
    "remarks": "visualisation was very good of this person ..but knowledge utni nhi hai...loooking very interested for this club"
  },
  {
    "id": "k26-49",
    "rank": 49,
    "name": "Saumya Singh Shakya",
    "rollNo": "BTECH/11155/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 28,
    "remarks": "a bit less confident but good knowledge, considerable"
  },
  {
    "id": "k26-50",
    "rank": 50,
    "name": "Tanish Mhatre",
    "rollNo": "BTECH/10802/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical",
      "Sponsorship"
    ],
    "specialization": "Technical Systems & Sponsorship",
    "domain": "Technical • Sponsorship,",
    "marks": 28,
    "remarks": "management experience and keen to work"
  },
  {
    "id": "k26-51",
    "rank": 51,
    "name": "Ashish kumar",
    "rollNo": "BTECH/10543/26",
    "branch": "AIML",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Software & Algorithmic Systems",
    "domain": "Technical",
    "marks": 26
  },
  {
    "id": "k26-52",
    "rank": 52,
    "name": "Bhaskar Pratap Singh",
    "rollNo": "BTECH/10667/26",
    "branch": "EEE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 26,
    "remarks": "yapper"
  },
  {
    "id": "k26-53",
    "rank": 53,
    "name": "Debashrit Padhihari",
    "rollNo": "BTECH/11128/26",
    "branch": "EEE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 26,
    "remarks": "keen to learn and work, knows basics"
  },
  {
    "id": "k26-54",
    "rank": 54,
    "name": "Nausheen Aliya",
    "rollNo": "BTECH/11113/26",
    "branch": "BIOTECH",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical",
      "Sponsorship"
    ],
    "specialization": "Technical Systems & Sponsorship",
    "domain": "—",
    "marks": 24,
    "remarks": "MARKED BY AAYUSH AND PRATHAM ....KUCH EXTRADORIDNARY NHI THA...BASIC KNOWELDGE BETTER THAN  CROWD"
  },
  {
    "id": "k26-55",
    "rank": 55,
    "name": "Ishika",
    "rollNo": "BTECH/10929/26",
    "branch": "Chemical",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical",
      "Sponsorship"
    ],
    "specialization": "Technical Systems & Sponsorship",
    "domain": "Technical",
    "marks": 23,
    "remarks": "Management Lena padega , Head girl thi pura management dekh legi"
  },
  {
    "id": "k26-56",
    "rank": 56,
    "name": "Shourya Kashyap",
    "rollNo": "BTECH/10970/26",
    "branch": "EEE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": 32,
    "remarks": "by panel-6, no knowledge, hardworking hai jante hai isko personally  best recruit hoga ye"
  },
  {
    "id": "k26-57",
    "rank": 57,
    "name": "Dhrubi Gandhi",
    "rollNo": "BTECH/11062/26",
    "branch": "ECE",
    "primarySubTeam": "Video Editing",
    "assignedSubTeams": [
      "Video Editing",
      "Graphic Design"
    ],
    "specialization": "Creative Media & Video Production",
    "domain": "Graphic designing, Video editing",
    "marks": null,
    "remarks": "Lelo isko (DESIGNERS KA NEED HAI)"
  },
  {
    "id": "k26-58",
    "rank": 58,
    "name": "Jay Kawelka",
    "rollNo": "BTECH/10827/26",
    "branch": "EEE",
    "primarySubTeam": "Sponsorship",
    "assignedSubTeams": [
      "Sponsorship"
    ],
    "specialization": "Corporate Sponsorship & Outreach",
    "domain": "Sponsorship",
    "marks": null,
    "remarks": "PR karlega, Mangement, pura management"
  },
  {
    "id": "k26-59",
    "rank": 59,
    "name": "Rishav Raj",
    "rollNo": "BTECH/10613/26",
    "branch": "EEE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical",
      "Graphic Design"
    ],
    "specialization": "Technical Robotics & Graphic Design",
    "domain": "Technical, Graphic Design",
    "marks": null
  },
  {
    "id": "k26-60",
    "rank": 60,
    "name": "Navneet Kumar",
    "rollNo": "BTECH/10804/26",
    "branch": "EEE",
    "primarySubTeam": "Video Editing",
    "assignedSubTeams": [
      "Video Editing"
    ],
    "specialization": "Motion Graphics & Video Production",
    "domain": "Video Editing",
    "marks": null,
    "remarks": "video editing ke liye lelunga video edit krke bhj diya toh"
  },
  {
    "id": "k26-61",
    "rank": 61,
    "name": "P Jai Charan",
    "rollNo": "BTech/10919/26",
    "branch": "ECE",
    "primarySubTeam": "Sponsorship",
    "assignedSubTeams": [
      "Sponsorship"
    ],
    "specialization": "Corporate Sponsorship & Outreach",
    "domain": "Sponsorship",
    "marks": null
  },
  {
    "id": "k26-62",
    "rank": 62,
    "name": "Ayush Kumar",
    "rollNo": "BTECH/10686/26",
    "branch": "Mechanical",
    "primarySubTeam": "Video Editing",
    "assignedSubTeams": [
      "Video Editing"
    ],
    "specialization": "Motion Graphics & Video Production",
    "domain": "Video Editing",
    "marks": null
  },
  {
    "id": "k26-63",
    "rank": 63,
    "name": "Sankalp",
    "rollNo": "BTECH/11169/26",
    "branch": "Chemical",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Robotics & Hardware Engineering",
    "domain": "Technical",
    "marks": null
  },
  {
    "id": "k26-64",
    "rank": 64,
    "name": "Vedant Mishra",
    "rollNo": "BTECH/10612/26",
    "branch": "Mechanical",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Mechanical Kinematics & CAD",
    "domain": "Technical",
    "marks": null,
    "remarks": "good with mechanical knowledge"
  },
  {
    "id": "k26-65",
    "rank": 65,
    "name": "Ronit Kumar Deo",
    "rollNo": "BTECH/10876/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": null
  },
  {
    "id": "k26-66",
    "rank": 66,
    "name": "Akshat Goyal",
    "rollNo": "BTECH/10539/26",
    "branch": "ECE",
    "primarySubTeam": "Technical",
    "assignedSubTeams": [
      "Technical"
    ],
    "specialization": "Embedded Firmware & Circuitry",
    "domain": "Technical",
    "marks": null
  }
];
