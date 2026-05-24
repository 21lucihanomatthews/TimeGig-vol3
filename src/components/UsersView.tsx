import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Star, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Briefcase, 
  Filter,
  Zap,
  Droplet,
  Sparkles,
  Paintbrush,
  Wrench,
  Grid,
  Layers,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { T, useLanguage } from './TranslationProvider';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  role: string;
  location: string;
  rating: number;
  completedJobs: number;
  hourlyRate: string;
  bio: string;
  skills: string[];
  online: boolean;
  verified: boolean;
  coins?: number;
  lookingForJobs?: boolean;
}

const CATEGORIES = [
  { id: 'electrical', name: 'Electrical & Solar', description: 'Certified single-phase & solar inverter technicians', icon: Zap, color: 'text-amber-500 bg-amber-50 border-amber-100' },
  { id: 'plumbing', name: 'Plumbing & Drainage', description: 'Emergency geyser installations & heavy pipelines', icon: Droplet, color: 'text-blue-500 bg-blue-50 border-blue-100' },
  { id: 'cleaning', name: 'Home & Cleaning Services', description: 'Residential deep sanitizing & organization experts', icon: Sparkles, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
  { id: 'painting', name: 'Painting & Construction Decor', description: 'Premium decorative coats, sanding & plastering', icon: Paintbrush, color: 'text-purple-500 bg-purple-50 border-purple-100' },
  { id: 'other', name: 'General Handyman Support', description: 'Vetted multi-service freelancers & repairs', icon: Wrench, color: 'text-slate-500 bg-slate-50 border-slate-100' }
];

function getCategoryForUser(user: UserProfile): string {
  const text = `${user.role} ${user.skills.join(' ')} ${user.bio}`.toLowerCase();
  
  if (text.includes('inverter') || text.includes('wiring') || text.includes('solar') || text.includes('electric') || text.includes('distribution') || text.includes('board') || text.includes('voltage')) {
    return 'electrical';
  }
  if (text.includes('plumb') || text.includes('geyser') || text.includes('drain') || text.includes('leak') || text.includes('pipe') || text.includes('water')) {
    return 'plumbing';
  }
  if (text.includes('paint') || text.includes('wallpaper') || text.includes('sand') || text.includes('plaster')) {
    return 'painting';
  }
  if (text.includes('clean') || text.includes('organiz') || text.includes('laundry') || text.includes('iron') || text.includes('domestic') || text.includes('home')) {
    return 'cleaning';
  }
  return 'other';
}

interface UsersViewProps {
  onStartChat: (userId: string) => void;
  users?: UserProfile[];
  isGuest?: boolean;
  onSignUp?: () => void;
}

export function UsersView({ onStartChat, users = [], isGuest, onSignUp }: UsersViewProps) {
  const { translateText, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  const filteredUsers = users.filter((user) => {
    // Only show candidates active and looking for jobs
    if (user.lookingForJobs === false) return false;

    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase());
    
    const userCat = getCategoryForUser(user);
    const matchesCategory = selectedCategory ? userCat === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Search and Category Filter Section */}
      <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-gray-200/50 shadow-xs space-y-4">
        <div className="flex flex-col gap-4">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder={t("Search certified professionals, handymen, skills...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 text-gray-950 rounded-2xl py-3.5 pl-11 pr-4 text-sm outline-none border border-gray-200/80 focus:border-green-600/70 focus:bg-white transition-all font-semibold shadow-xs"
            />
          </div>
        </div>

        {/* Categories selection pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 shrink-0">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 text-xs font-black rounded-full transition-all cursor-pointer border shrink-0 ${
              selectedCategory === null
                ? 'bg-green-600 text-white border-green-600 shadow-xs'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <T>All Categories</T>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-black rounded-full transition-all whitespace-nowrap cursor-pointer border shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-green-600 text-white border-green-600 shadow-xs'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <T>{cat.name}</T>
            </button>
          ))}
        </div>
      </div>

      {/* Network stats or info header */}
      <div className="flex justify-between items-center px-2">
        <p className="text-xs font-black uppercase text-gray-400 tracking-widest">
          {filteredUsers.length} <T>active vetted candidates found</T>
        </p>
        <div className="flex items-center gap-1.5 text-xs text-green-600 font-extrabold bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
          <ShieldCheck size={14} />
          <span><T>Biometric Checked Vetting</T></span>
        </div>
      </div>

      {/* Output list grouped by Category */}
      <div className="space-y-12 pb-24">
        {CATEGORIES.map((cat) => {
          // If a category is selected and doesn't match this one, skip it
          if (selectedCategory && cat.id !== selectedCategory) return null;

          const catUsers = filteredUsers.filter(u => getCategoryForUser(u) === cat.id);
          const CatIcon = cat.icon;

          if (catUsers.length === 0) return null; // Hide empty categories elegantly

          return (
            <div key={cat.id} className="space-y-4">
              <div className="flex items-start gap-3 border-b border-gray-200 pb-3">
                <div className={`p-2.5 rounded-2xl border ${cat.color} shrink-0`}>
                  <CatIcon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950 flex items-center gap-2">
                    <T>{cat.name}</T>
                    <span className="bg-slate-100 text-[10px] text-gray-500 font-extrabold px-2 py-0.5 rounded-full shrink-0">
                      {catUsers.length} <T>{catUsers.length === 1 ? 'provider' : 'providers'}</T>
                    </span>
                  </h3>
                  <p className="text-xs text-gray-450 font-semibold"><T>{cat.description}</T></p>
                </div>
              </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {catUsers.map((user) => (
                  <UserCard key={user.id} user={user} isGuest={isGuest} onStartChat={() => {
                    if (isGuest) {
                      setShowGuestPrompt(true);
                    } else {
                      onStartChat(user.id);
                    }
                  }} />
                ))}
            </div>
            </div>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-200/80 p-8">
            <p className="text-gray-500 font-bold"><T>No certified professionals found matching filters.</T></p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
              className="text-green-600 font-black text-xs underline mt-2 hover:opacity-80 block mx-auto"
            >
              <T>Reset Filters</T>
            </button>
          </div>
        )}
      </div>
      
      {/* Guest Mode Prompt Overlay */}
      {showGuestPrompt && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2"><T>Registration Required</T></h3>
            <p className="text-gray-600 text-sm mb-6">
              <T>You must register to contact professionals and view their contact details.</T>
            </p>
            <div className="space-y-3">
               <button 
                 onClick={() => {
                   setShowGuestPrompt(false);
                   if (onSignUp) onSignUp();
                 }}
                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all"
               >
                 <T>Sign Up Now</T>
               </button>
               <button 
                 onClick={() => setShowGuestPrompt(false)}
                 className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-colors"
               >
                 <T>Cancel</T>
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// User Card component extracted cleanly as described in modularity principles
function UserCard({ user, onStartChat, isGuest }: { user: UserProfile, onStartChat: (userId: string) => void, isGuest?: boolean, key?: React.Key }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl overflow-hidden border border-gray-150 shadow-xs flex flex-col hover:border-green-500/20 hover:shadow-xs transition-all duration-300"
    >
      {/* Square Avatar Container like Facebook Marketplace */}
      <div className="aspect-square w-full bg-gray-200 relative overflow-hidden group">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
          referrerPolicy="no-referrer" 
        />
        
        {isGuest && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/20">
              <Lock size={24} className="text-white" />
            </div>
          </div>
        )}
        
        {/* Rating Overlay on top right */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
          <Star size={10} className="fill-amber-400 stroke-amber-400" />
          <span>{user.rating}</span>
        </div>

        {/* Online Status overlay on top left */}
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs">
          <span className="relative flex h-1.5 w-1.5">
            {user.online && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${user.online ? 'bg-green-450' : 'bg-gray-450'}`} />
          </span>
          <span><T>{user.online ? 'Online' : 'Offline'}</T></span>
        </div>

        {/* Verified Badge overlay at bottom left */}
        {user.verified && (
          <div className="absolute bottom-2 left-2 bg-emerald-600/95 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
            <CheckCircle2 size={10} className="stroke-[3]" />
            <span><T>Verified</T></span>
          </div>
        )}
      </div>

      {/* Info Sections underneath */}
      <div className="p-2.5 flex flex-col flex-grow justify-between gap-1.5">
        <div>
          {/* Rate first, highly prominent style */}
          <span className="block font-black text-slate-950 text-sm sm:text-base leading-none">
            <T>{user.hourlyRate}</T>
          </span>

          {/* Name & Title */}
          <h4 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-1 leading-snug mt-1" title={user.name}>
            <T>{user.name}</T>
          </h4>

          {/* Role text */}
          <p className="text-[10px] text-gray-500 font-bold truncate line-clamp-1 leading-normal" title={user.role}>
            <T>{user.role}</T>
          </p>

          {/* Location & jobs done */}
          <div className="flex flex-col gap-0.5 mt-1 text-[9px] sm:text-[10px] text-gray-400 font-bold">
            <div className="flex items-center gap-0.5 text-gray-450 truncate">
              <MapPin size={10} className="text-gray-400 shrink-0" />
              <span className="truncate"><T>{user.location}</T></span>
            </div>
            <span>{user.completedJobs} <T>jobs completed</T></span>
          </div>
        </div>

        {/* Compact action button */}
        {isGuest ? (
          <div className="mt-1 p-1.5 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-1.5 text-gray-400">
            <Lock size={12} />
            <span className="text-[10px] font-bold"><T>Contact Locked</T></span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onStartChat(user.id)}
            className="w-full bg-gray-900 hover:bg-green-600 text-white font-extrabold py-1.5 rounded-lg text-xs transition-colors shadow-xs cursor-pointer active:scale-95 shrink-0 mt-1 flex items-center justify-center gap-1.5"
          >
            <MessageSquare size={13} />
            <span><T>Hire Pro</T></span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

