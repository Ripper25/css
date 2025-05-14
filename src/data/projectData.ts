
export interface Project {
  id: number;
  name: string;
  description: string;
  date?: string;
  details?: string;
  location?: string;
  attendees?: string;
  planIds?: number[]; // Associated plan IDs from the calendar
  progress?: number; // Overall project progress
}

export interface Plan {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  projectId?: number; // Associated project ID
}

export const projects: Project[] = [
  {
    id: 1,
    name: "Arundel Sabbath",
    description: "Host a Sabbath program at Arundel Hospital.",
    date: "01 February 2025",
    location: "Arundel Hospital",
    attendees: "the sick, beneficiaries with testimonies, nurses and staff",
    details: "This program aims to provide spiritual support and comfort to patients and hospital staff.",
    planIds: [6, 17, 18], // Mental Health Seminar, Arundel Staff Devotions, Arundel Outpatients Devotions
    progress: 45
  },
  {
    id: 2,
    name: "GC/SID CPE&CPO TRAINING",
    description: "To Conduct a CPE & CPO Training seminar at SID Offices.",
    date: "19-24 January 2025",
    location: "SID Offices",
    attendees: "60+ SID pastors. Tutors: CCS & GC Chaplaincy Director",
    details: "This training will equip pastors with chaplaincy skills and knowledge for their ministry.",
    progress: 30
  },
  {
    id: 3,
    name: "SID ENDORSEMENTS",
    description: "To attend and be endorsed during the SID Endorsement Big Sabbath.",
    date: "25 January 2025",
    location: "SID Headquarters",
    attendees: "SID Leadership and Chaplaincy Department",
    details: "This is a formal endorsement of our chaplaincy services by the Southern Africa-Indian Ocean Division, providing official recognition and support for our work.",
    progress: 25
  },
  {
    id: 4,
    name: "Trojan Mine SDA Church building",
    description: "To complete the Church building at Trojan Mine and dedicate it at the end of the Evangelistic Campaign.",
    date: "12 April 2025",
    location: "Trojan Mine",
    attendees: "Church members and community",
    details: "This project involves completing construction of a church building that will serve the Trojan Mine community, providing a place of worship and spiritual growth.",
    planIds: [4], // Evangelistic Campaign - Trojan Mine
    progress: 60
  },
  {
    id: 5,
    name: "ZPCS & BGF RADIO STATION",
    description: "To launch and run a radio station in partnership with ZPCS.",
    date: "17 February 2025",
    location: "At the old death penalty room",
    attendees: "ZPCS staff and BGF team",
    details: "This innovative project will transform a space formerly associated with punishment into one that broadcasts hope, healing, and spiritual support.",
    planIds: [10], // Communication Seminar
    progress: 35
  },
  {
    id: 6,
    name: "ZRP CHAPLAINCY DIPLOMA AT SOLUSI",
    description: "100 ZRP Chaplains to attend their last two semesters at Solusi University.",
    date: "2-31 March and 1-31 July 2025",
    location: "Solusi University",
    attendees: "100 ZRP Chaplains",
    details: "Graduation is in November. This educational program will equip police chaplains with advanced training to better serve officers and the community.",
    progress: 20
  },
  {
    id: 7,
    name: "UNIFORMED FORCES CHAPLAINCY SEMINARS",
    description: "To conduct a 2-day seminar with ZPCS, ZRP & ZNA Chaplains.",
    date: "To be advised",
    location: "Harare Conference Center",
    attendees: "ZPCS, ZRP & ZNA Chaplains",
    details: "This collaborative training will strengthen chaplaincy services across all uniformed forces, promoting best practices and shared resources.",
    planIds: [11], // Spiritualism Seminar
    progress: 15
  },
  {
    id: 8,
    name: "VOCATIONAL TRAINING CENTRES CHAPLAINCY",
    description: "To introduce and provide chaplaincy services to vocational training centres and National Youth Service centres under Ministry of Youth.",
    date: "Throughout 2025",
    location: "Various training centers",
    attendees: "Youth in vocational training",
    details: "This initiative will extend spiritual care and support to young people during their vocational training, helping them develop holistically.",
    planIds: [5, 12, 13, 14], // Evangelistic Campaign - Zimphos, Cancer Awareness Month, Fathers Day Program, Mothers Day Program
    progress: 25
  },
  {
    id: 9,
    name: "ZRP COMMISSIONER DEDICATION PROGRAM",
    description: "To conduct a dedication program for the new commission general of police.",
    date: "19 January 2025",
    location: "ZRP Headquarters",
    attendees: "ZRP leadership and officers",
    details: "This important ceremony will provide spiritual blessing and guidance for the new police leadership, emphasizing ethical service and compassionate policing.",
    planIds: [16], // ZRP Devotions
    progress: 70
  },
  {
    id: 10,
    name: "ACHIEVEMENT CLASSES",
    description: "Introduce achievement classes to all the schools we are providing chaplaincy services to.",
    date: "February 2025",
    location: "Partner schools",
    attendees: "School students and teachers",
    details: "Using the pathfinders and adventurers curriculum. This program will enhance character development and life skills for students through structured, values-based activities.",
    planIds: [7, 8], // Marriage & Family Seminar, Financial Literacy Seminar
    progress: 40
  },
  {
    id: 11,
    name: "GC CHAPLAINCY CONGRESS",
    description: "To attend and present at the GC Chaplaincy world congress in America.",
    date: "29 June-2 July 2025",
    location: "United States of America",
    attendees: "International chaplaincy representatives",
    details: "This international gathering will allow us to share our experiences and learn from chaplains worldwide, bringing back valuable insights to enhance our local services.",
    progress: 10
  },
  {
    id: 12,
    name: "ZITF BOOTH",
    description: "To attend ZITF and have a stand for counselling, prayers and free literature distribution.",
    date: "22-26 April 2025",
    location: "Zimbabwe International Trade Fair, Bulawayo",
    attendees: "Trade fair visitors and exhibitors",
    details: "The Zimbabwe International Trade Fair provides an excellent opportunity to reach the public with our services and resources, increasing awareness of chaplaincy support.",
    progress: 30
  },
  {
    id: 13,
    name: "WHATSAPP AI CHAT BOT",
    description: "Develop an AI WhatsApp chat bot which provides automatic and instant responses to clients.",
    date: "Ongoing development",
    location: "Digital platform",
    attendees: "All clients and chaplains",
    details: "The Bot can link client to a chaplain on a case to case basis. This technology will make spiritual support more accessible, providing immediate response to those in need.",
    progress: 55
  },
  {
    id: 14,
    name: "SPORTS CHAPLAINCY",
    description: "Introduce chaplaincy to sports teams.",
    date: "Throughout 2025",
    location: "Various sports venues",
    attendees: "Athletes and coaching staff",
    details: "We currently are providing such to Trojan Stars FC, Pitch to Scotland FC, etc. This specialized chaplaincy addresses the unique spiritual and emotional needs of athletes and teams.",
    progress: 20
  },
  {
    id: 15,
    name: "BGF REHABILITATION CENTRE",
    description: "Proposal to set up a Rehabilitation Centre which uses the 12 Steps of Recovery.",
    date: "Planning phase",
    location: "To be determined",
    attendees: "Individuals in recovery and support staff",
    details: "This center will provide structured support for individuals recovering from various addictions and challenges, using an established and effective approach.",
    planIds: [9, 15], // Drug Abuse Seminar, Suicide Prevention Month
    progress: 15
  },
  {
    id: 16,
    name: "WOSE Activities",
    description: "Weeks of Spiritual Emphasis across all companies throughout the year.",
    date: "Throughout 2025",
    location: "All partner companies",
    attendees: "Company employees and management",
    details: "This ongoing program provides regular spiritual guidance and support to employees at all partner companies, fostering spiritual growth and well-being in the workplace.",
    planIds: [1, 2, 3], // WOSE Q1, Q2, Q3
    progress: 50
  }
];

export const plans: Plan[] = [
  {
    id: 1,
    name: "WOSE - Q1",
    description: "To conduct physical or online weeks of spiritual emphasis at each company. The online WOSE will be done through the website chatrooms.",
    date: "2025-02-10",
    location: "All Companies",
    projectId: 16 // Link to a project for WOSE activities
  },
  {
    id: 2,
    name: "WOSE - Q2",
    description: "Second quarter weeks of spiritual emphasis at each company.",
    date: "2025-05-12",
    location: "All Companies",
    projectId: 16 // Link to a project for WOSE activities
  },
  {
    id: 3,
    name: "WOSE - Q3",
    description: "Third quarter weeks of spiritual emphasis at each company.",
    date: "2025-08-18",
    location: "All Companies",
    projectId: 16 // Link to a project for WOSE activities
  },
  {
    id: 4,
    name: "EVANGELISTIC CAMPAIGN - Trojan Mine",
    description: "Conduct 1 week evangelistic campaign at Trojan Mine.",
    date: "2025-03-15",
    location: "Trojan Mine",
    projectId: 4 // Link to Trojan Mine Church building project
  },
  {
    id: 5,
    name: "EVANGELISTIC CAMPAIGN - Zimphos",
    description: "Conduct 1 week evangelistic campaign at Zimphos.",
    date: "2025-07-20",
    location: "Zimphos",
    projectId: 8 // Link to Vocational Training project
  },
  {
    id: 6,
    name: "MENTAL HEALTH SEMINAR",
    description: "To conduct seminar with mental health specialists.",
    date: "2025-04-05",
    location: "Arundel Hospital",
    projectId: 1 // Link to Arundel Sabbath project
  },
  {
    id: 7,
    name: "MARRIAGE & FAMILY SEMINAR",
    description: "To conduct seminar with marriage and family specialists.",
    date: "2025-06-14",
    location: "Harare Conference Center",
    projectId: 10 // Link to Achievement Classes project
  },
  {
    id: 8,
    name: "FINANCIAL LITERACY SEMINAR",
    description: "To conduct seminar with financial literacy specialists.",
    date: "2025-09-22",
    location: "Bulawayo Training Center",
    projectId: 10 // Link to Achievement Classes project
  },
  {
    id: 9,
    name: "DRUG ABUSE SEMINAR",
    description: "To conduct seminar with drug abuse specialists.",
    date: "2025-10-11",
    location: "ZRP Headquarters",
    projectId: 15 // Link to BGF Rehabilitation Centre project
  },
  {
    id: 10,
    name: "COMMUNICATION SEMINAR",
    description: "To conduct seminar with communication specialists.",
    date: "2025-11-08",
    location: "ZPCS Training Academy",
    projectId: 5 // Link to ZPCS & BGF Radio Station project
  },
  {
    id: 11,
    name: "SPIRITUALISM SEMINAR",
    description: "To conduct seminar with spiritualism specialists.",
    date: "2025-12-06",
    location: "Harare Conference Center",
    projectId: 7 // Link to Uniformed Forces Chaplaincy Seminars project
  },
  {
    id: 12,
    name: "CANCER AWARENESS MONTH",
    description: "Run targeted campaigns for cancer awareness month.",
    date: "2025-10-15",
    location: "All Companies",
    projectId: 8 // Link to Vocational Training project
  },
  {
    id: 13,
    name: "FATHERS DAY PROGRAM",
    description: "Special program for fathers day.",
    date: "2025-06-15",
    location: "All Companies",
    projectId: 8 // Link to Vocational Training project
  },
  {
    id: 14,
    name: "MOTHERS DAY PROGRAM",
    description: "Special program for mothers day.",
    date: "2025-05-11",
    location: "All Companies",
    projectId: 8 // Link to Vocational Training project
  },
  {
    id: 15,
    name: "SUICIDE PREVENTION MONTH",
    description: "Run targeted campaigns for suicide prevention month.",
    date: "2025-09-10",
    location: "All Companies",
    projectId: 15 // Link to BGF Rehabilitation Centre project
  },
  {
    id: 16,
    name: "ZRP DEVOTIONS",
    description: "To conduct devotions during the morning parade at ZRP HQ.",
    date: "2025-01-15",
    location: "ZRP Headquarters",
    projectId: 9 // Link to ZRP Commissioner Dedication Program project
  },
  {
    id: 17,
    name: "ARUNDEL STAFF DEVOTIONS",
    description: "Conduct staff devotions at Arundel Hospital.",
    date: "2025-02-28",
    location: "Arundel Hospital",
    projectId: 1 // Link to Arundel Sabbath project
  },
  {
    id: 18,
    name: "ARUNDEL OUTPATIENTS DEVOTIONS",
    description: "Conduct outpatients devotions at Arundel Hospital.",
    date: "2025-03-28",
    location: "Arundel Hospital",
    projectId: 1 // Link to Arundel Sabbath project
  }
];

export const operationalNeeds = [
  {
    id: 1,
    title: "Assistant Chaplains",
    description: "We need assistant chaplains to increase our work efficiency and reduce travel and servicing costs."
  },
  {
    id: 2,
    title: "Work Cellphone",
    description: "There is need for a work cellphone for the purposes of the WhatsApp chatbot, web chat and calls."
  },
  {
    id: 3,
    title: "Vehicle",
    description: "Bulawayo region needs a vehicle for its operations."
  },
  {
    id: 4,
    title: "Bulk Literature",
    description: "We need bulk literature to distribute to all of our companies."
  },
  {
    id: 5,
    title: "Rehabilitation Centre",
    description: "There is an urgent need for a Rehabilitation Centre."
  }
];

export const values = [
  { id: 1, name: "INCLUSIVITY" },
  { id: 2, name: "CONFIDENTIALITY" },
  { id: 3, name: "DIVERSITY" },
  { id: 4, name: "INTEGRITY" },
  { id: 5, name: "INCARNATIONAL" }
];

export const clients = [
  "QUEEN ELIZABETH HOME",
  "CURE CHILDREN'S HOSPITAL",
  "BYWORLD MOTORS",
  "HOLIDAY INN BYO",
  "ZIMPHOS PRIMARY",
  "SHAMVA MINE",
  "FREDA REBECCA",
  "SHAMVA PRIMARY SCH",
  "SHAMVA SECONDARY SCH",
  "SWIVEL ENGINEERING",
  "ENGUTSHENI",
  "IDCZ",
  "CHEMPLEX",
  "ZIMPHOS",
  "BNC",
  "WILLOWVALE INDUSTRY",
  "DEVEN ENGINEERING",
  "ALLIED INSURANCE",
  "ARUNDEL",
  "RUSHINGA MINE",
  "CAPH",
  "DOROWA MINE",
  "ZRP",
  "ZPCS",
  "CHEMPLEX BYO",
  "TROJAN STARS FC",
  "TROJAN PRIMARY"
];

export const aboutInfo = {
  description1: "CCS has partnered with Zimbabwean companies, institutions and sports teams to provide care, counsel, and crisis management services to their employees, students and team members from a Christian perspective.",
  description2: "CCS aims to bring about total wellness in the workplace, institution and nationwide. Your mental and spiritual wellness is our ultimate responsibility."
};

export const visionMission = {
  vision: "To champion and become a beacon of spiritual care and wholistic wellness in the workplace, institutions, sport and beyond.",
  mission: "To provide care, counsel, and crisis management services to employees, business leaders, students, team members and their families. Through a wholistic and all inclusive approach."
};
