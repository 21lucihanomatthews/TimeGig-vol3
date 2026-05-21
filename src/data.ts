import { Job, Tender, Gig, GalleryItem } from './types';

// Standard default exports are empty arrays now that mock data has been removed
export const dummyJobs: Job[] = [];
export const dummyTenders: Tender[] = [];
export const initialGigs: Gig[] = [];
export const initialGalleryItems: GalleryItem[] = [];

// Sample datasets for the "Load South African Samples" feature
export const sampleJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer (React)',
    company: 'Standard Bank South Africa',
    description: 'We are seeking an experienced React Developer to build next-generation mobile-first banking terminals. Experience with Tailwind CSS, state management, and banking APIs required.',
    location: 'Rosebank, Johannesburg',
    rate: 'R55 000 - R75 000 / month',
    type: 'Full-time',
    category: 'Technology',
    postedDate: '2 days ago',
    coinsCost: 5
  },
  {
    id: 'job-2',
    title: 'Construction Site Supervisor',
    company: 'Murray & Roberts Ltd',
    description: 'Looking for a certified site supervisor for a new commercial construction development initiative. Must have SACPCMP registration and at least 5 years of commercial build safety experience.',
    location: 'Sandton, Johannesburg',
    rate: 'R35 000 - R48 000 / month',
    type: 'Contract',
    category: 'Construction',
    postedDate: '1 day ago',
    coinsCost: 5
  },
  {
    id: 'job-3',
    title: 'Digital UX/UI Designer',
    company: 'Capitec Bank',
    description: 'Join our design powerhouse to refine the mobile banking experience for millions of citizens. Experience with high-fidelity prototypes and user testing in local communities highly valued.',
    location: 'Stellenbosch, Western Cape',
    rate: 'R42 000 / month',
    type: 'Full-time',
    category: 'Creative',
    postedDate: '3 days ago',
    coinsCost: 5
  },
  {
    id: 'job-4',
    title: 'Logistics Operations Coordinator',
    company: 'Imperial Logistics',
    description: 'Coordinate heavy-haul freights and local deliveries from Durban harbour terminals to inland distribution hubs. Strong analytical and scheduling skills required.',
    location: 'Durban Harbour, KwaZulu-Natal',
    rate: 'R28 000 / month',
    type: 'Full-time',
    category: 'Logistics',
    postedDate: 'Today',
    coinsCost: 5
  }
];

export const sampleTenders: Tender[] = [
  {
    id: 'tender-1',
    title: 'Build and Refurbish Khayelitsha Community Centre',
    department: 'City of Cape Town Municipality',
    value: 'R12 400 000 est.',
    description: 'Comprehensive construction and landscaping tender to revitalize the existing multi-purpose community hall and surrounding educational precincts in Khayelitsha.',
    closingDate: '2026-06-15',
    status: 'Open',
    coinsCost: 15,
    documentUrl: 'https://web1.capetown.gov.za/web1/TenderPortal/Tender'
  },
  {
    id: 'tender-2',
    title: 'Supply and Delivery of Medical Equipment',
    department: 'Gauteng Department of Health',
    value: 'R8 750 000 est.',
    description: 'Procurement of critical diagnostic imaging consumables and modern laboratory analyzers to support hospitals across Johannesburg and Tshwane districts.',
    closingDate: '2026-06-08',
    status: 'Open',
    coinsCost: 15,
    documentUrl: 'https://www.etenders.gov.za/'
  },
  {
    id: 'tender-3',
    title: 'Eskom Wind Power Grid Integration Interface',
    department: 'Eskom Holdings SOC Ltd',
    value: 'R45 000 000 est.',
    description: 'Specialist engineering and design tender to implement grid tie-in subsystems for new clean energy initiatives in the Eastern and Northern Cape provinces.',
    closingDate: '2026-06-30',
    status: 'Open',
    coinsCost: 15,
    documentUrl: 'https://tenderbulletin.eskom.co.za/'
  }
];

export const sampleGigs: Gig[] = [
  {
    id: 'gig-1',
    creatorName: 'Aphiwe Cele',
    title: 'Need help moving flat furniture',
    description: 'Moving from a second-floor studio apartment to a townhouse. Need 2 strong people with a bakkie or large trailer to load and transport couches, a double bed, and about 10 heavy boxes.',
    price: 'R1 200',
    location: 'Green Point, Cape Town',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
    postedDate: '2 hours ago'
  },
  {
    id: 'gig-2',
    creatorName: 'Duran Naidoo',
    title: 'DSTV dish installation and TV mounting',
    description: 'Need a technician or experienced handyman to install a DSTV satellite dish outside the backyard cottage, route the cabling inside, and mount a brand new 55-inch smart TV to the living room wall.',
    price: 'R850',
    location: 'Umhlanga, Durban',
    imageUrl: 'https://images.unsplash.com/photo-1595248646595-f3748a44a802?w=400&q=80',
    postedDate: '5 hours ago'
  },
  {
    id: 'gig-3',
    creatorName: 'Tshepo Mokwena',
    title: 'Washing machine repair & plumbing check',
    description: 'My front-loader Samsung washing machine is throwing a drainage error. Need someone to inspect the filter, clear any blockages, and check if the drainage connection is properly sealed.',
    price: 'R600',
    location: 'Soweto, Johannesburg',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80',
    postedDate: 'Yesterday'
  }
];

export const sampleGalleryItems: GalleryItem[] = [
  {
    id: 'gal-1',
    url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80',
    title: 'SACPCMP Safety Certification Certificate',
    category: 'Work Certificates',
    likes: 12
  },
  {
    id: 'gal-2',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
    title: 'Professional Driver Permit (PrDP)',
    category: 'Drivers Licenses',
    likes: 8
  }
];
