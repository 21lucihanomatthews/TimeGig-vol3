import { Job, Tender, Gig, GalleryItem } from './types';

// Standard fallback/preseeded datasets for Mzansi Worker Network so the app is never empty
export const dummyJobs: Job[] = [
  {
    id: "seed_job_1",
    title: "Front-End React Web Developer",
    company: "Silicon Cape Solutions",
    description: "Build crisp, highly responsive custom components, web dashboards and customer portals for South African startups. Experience in TypeScript, React, and Tailwind CSS represents strict advantage.",
    location: "Cape Town, Western Cape",
    rate: "R 480,000 - R 650,000 / yr",
    type: "Full-time",
    category: "Technology",
    postedDate: "2 days ago",
    coinsCost: 5,
    redirectUrl: "https://www.adzuna.co.za/search?q=Developer",
    distance: 4.2
  },
  {
    id: "seed_job_2",
    title: "Registered ICU Emergency Nurse",
    company: "MediClinic South Africa Ltd",
    description: "Provide comprehensive and specialized high-care nursing service to trauma ward ICU patients. Competent patient charting and critical monitor skills required. SANC licensing is essential.",
    location: "Sandton, Gauteng",
    rate: "R 420,000 - R 490,000 / yr",
    type: "Full-time",
    category: "Care",
    postedDate: "3 days ago",
    coinsCost: 5,
    redirectUrl: "https://www.adzuna.co.za/search?q=Nurse",
    distance: 12.5
  },
  {
    id: "seed_job_3",
    title: "Commercial Site Supervisor Assistant",
    company: "Zululand Builders Group",
    description: "Coordinate general sub-contractor activities, safety signs, site logs, hand over specifications and inventory supply lists on construction sites across Umhlanga and Durban North areas.",
    location: "Durban, KwaZulu-Natal",
    rate: "R 240,000 - R 310,000 / yr",
    type: "Contract",
    category: "Construction",
    postedDate: "1 day ago",
    coinsCost: 5,
    redirectUrl: "https://www.adzuna.co.za/search?q=Supervisor",
    distance: 18.0
  },
  {
    id: "seed_job_4",
    title: "Mid-Weight Graphic & UI Designer",
    company: "Vuma Creative Digital Agency",
    description: "We are seeking a versatile creative for drafting marketing campaigns, user interfaces and digital collateral materials. Must be proficient in Figma and Adobe Photoshop.",
    location: "Soweto, Gauteng",
    rate: "R 18,000 - R 25,050 / month",
    type: "Part-time",
    category: "Creative",
    postedDate: "Just now",
    coinsCost: 5,
    redirectUrl: "https://www.adzuna.co.za/search?q=Designer",
    distance: 2.1
  }
];

export const dummyTenders: Tender[] = [
  {
    id: "seed_tender_1",
    title: "Commercial Solar PV & Retrofitting Procurement",
    department: "City of Cape Town Metro Municipality",
    value: "R 12,450,000",
    description: "Tender specifications request proposals for the engineering design, turnkey installation, and 12-month post-handover maintenance of grid-tied solar photovoltaic (PV) setups at civic energy hubs in Bellville, Khayelitsha, and central Metro head offices.",
    closingDate: "2026-06-25",
    status: "Open",
    coinsCost: 15,
    documentUrl: "https://www.capetown.gov.za/City-Connect/Apply/bids-and-tenders/tender-opportunities",
    distance: 8.5
  },
  {
    id: "seed_tender_2",
    title: "National School Nutrition foodstuff Sourcing",
    department: "Gauteng Department of Education (GDE)",
    value: "R 3,850,000",
    description: "Procurement of fresh farm produce, core dry ingredients, and nutritional grains for primary schools across Hammanskraal, Soshanguve and Pretoria Central. Subject to SBD 4 and SBD 6.1 preference scoring.",
    closingDate: "2026-06-18",
    status: "Open",
    coinsCost: 15,
    documentUrl: "https://www.gauteng.gov.za/",
    distance: 25.0
  },
  {
    id: "seed_tender_3",
    title: "Infrastructure Security Patrols & Access Controls",
    department: "Eskom Holdings SOC Ltd (Power Utility)",
    value: "R 8,200,000",
    description: "Provision of active and elite physical guarding, access control, technical alarm installation and perimeter backup response patrols at vital electrical substations in Mpumalanga Province.",
    closingDate: "2026-07-02",
    status: "Open",
    coinsCost: 15,
    documentUrl: "https://www.eskom.co.za/tenders/tender-bulletin/",
    distance: 45.2
  },
  {
    id: "seed_tender_4",
    title: "Rural Access Road Rehabilitation (Gravel to Tar)",
    department: "KwaZulu-Natal Department of Transport",
    value: "R 24,500,000",
    description: "Comprehensive civil construction contract including soil stabilization, hydraulic culvert additions, concrete curbs, and asphalt pavement overlay of arterial transport road D403 (Zululand region). CIDB grade 7CE or greater is mandated.",
    closingDate: "2026-06-30",
    status: "Open",
    coinsCost: 15,
    documentUrl: "https://www.kzntransport.gov.za/",
    distance: 31.8
  },
  {
    id: "seed_tender_5",
    title: "Structured Network Cabling and Server Rack Upgrade",
    department: "South African Police Service (SAPS Procurement)",
    value: "R 1,980,000",
    description: "Bids are invited for structured Category 6 network LAN wiring, heavy-duty server cabinets, core network switch configuration, and central UPS backup supply deployment at high-volume metropolitan stations.",
    closingDate: "2026-06-12",
    status: "Open",
    coinsCost: 15,
    documentUrl: "https://www.saps.gov.za/services/tenders.php",
    distance: 5.6
  }
];

export const initialGigs: Gig[] = [
  {
    id: "seed_gig_1",
    creatorName: "Sipho Ndlovu",
    title: "Solar Geyser Installation Assistance",
    description: "Need a trade-certified assistant plumber to help commission high-pressure solar geyser setups on standard residential tile rooftops. Bringing own hand wrench is useful.",
    price: "R 2,500",
    location: "Soweto, Gauteng",
    imageUrl: "https://images.unsplash.com/photo-1542013936693-8848e5740a7a?w=400&auto=format&fit=crop&q=60",
    postedDate: "2026-05-24",
    distance: 3.4
  },
  {
    id: "seed_gig_2",
    creatorName: "Chloe van der Merwe",
    title: "Smart TV Mounting & Dual Decoder Alignment",
    description: "Help secure mount a heavy 65-inch flat screen to a hard brick wall. Run decorative concealment cable ducts and configure high-definition extra view decoders.",
    price: "R 850",
    location: "Stellenbosch, Western Cape",
    imageUrl: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&auto=format&fit=crop&q=60",
    postedDate: "2026-05-23",
    distance: 14.1
  },
  {
    id: "seed_gig_3",
    creatorName: "Babalwa Dlamini",
    title: "Traditional Catering Specialist for Private Event",
    description: "Seeking a gourmet boutique team to assist in high-end braai selections, South African traditional sides (Chakalaka, Pap, artisan dumpings) for an intimate family group.",
    price: "R 6,550",
    location: "Umhlanga, KwaZulu-Natal",
    imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&auto=format&fit=crop&q=60",
    postedDate: "2026-05-22",
    distance: 7.9
  }
];

export const initialGalleryItems: GalleryItem[] = [
  {
    id: "seed_gal_1",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60",
    title: "Precision Foundation Pouring at Sandton Office",
    category: "Construction",
    likes: 38
  },
  {
    id: "seed_gal_2",
    url: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=500&auto=format&fit=crop&q=60",
    title: "Substation Transformer Overhaul Completed",
    category: "Electrical",
    likes: 29
  },
  {
    id: "seed_gal_3",
    url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&auto=format&fit=crop&q=60",
    title: "Structured Category 6 Server Rack Patching",
    category: "Networking",
    likes: 41
  }
];

// Sample datasets for any loader helpers
export const sampleJobs: Job[] = dummyJobs;
export const sampleTenders: Tender[] = dummyTenders;
export const sampleGigs: Gig[] = initialGigs;
export const sampleGalleryItems: GalleryItem[] = initialGalleryItems;
