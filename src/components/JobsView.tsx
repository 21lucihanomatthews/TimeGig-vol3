import React, { useState } from 'react';
import { Search as SearchIcon, MapPin, Coins, Calendar, Briefcase, ChevronRight, CheckCircle, AlertTriangle, PlusCircle, X, Lock, Shield, RefreshCw, Globe } from 'lucide-react';
import { Job } from '../types';
import { T } from './TranslationProvider';

interface JobsViewProps {
  jobs: Job[];
  coins: number;
  onApply: (job: Job) => void;
  appliedJobIds: string[];
  onAddJob?: (job: Job) => void;
  onAddJobs?: (jobs: Job[]) => void;
  isGuest?: boolean;
  onSignUp?: () => void;
}

export function JobsView({ jobs, coins, onApply, appliedJobIds, onAddJob, onAddJobs, isGuest, onSignUp }: JobsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', pitch: '', portfolioLink: '' });
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  // Adzuna Integration States
  const [showAdzunaModal, setShowAdzunaModal] = useState(false);
  const [adzunaAppId, setAdzunaAppId] = useState(() => localStorage.getItem('timegig_adzuna_app_id') || '');
  const [adzunaAppKey, setAdzunaAppKey] = useState(() => localStorage.getItem('timegig_adzuna_app_key') || '');
  const [adzunaSyncing, setAdzunaSyncing] = useState(false);
  const [adzunaSuccessCount, setAdzunaSuccessCount] = useState<number | null>(null);
  const [adzunaError, setAdzunaError] = useState<string | null>(null);

  // Job creation state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newJobState, setNewJobState] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    rate: '',
    type: 'Full-time',
    category: 'Technology'
  });

  const [maxDistance, setMaxDistance] = useState<number>(50);

  // Filter Categories
  const categories = ['All', 'Technology', 'Construction', 'Creative', 'Finance', 'Logistics', 'Services'];
  
  // Get unique locations
  const locations = ['All', ...Array.from(new Set(jobs.map(j => j.location)))];

  // Filter Jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All' || job.location === selectedLocation;
    const matchesDistance = (job.distance || 0) <= maxDistance;

    return matchesSearch && matchesCategory && matchesLocation && matchesDistance;
  });

  const handleOpenApply = (job: Job) => {
    if (isGuest) {
       setShowGuestPrompt(true);
       return;
    }
    setSelectedJob(job);
    setApplySuccess(false);
    setApplyForm({ name: 'Lucihano Matthews', email: '21lucihanomatthews@gmail.com', pitch: '', portfolioLink: '' });
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (coins < selectedJob.coinsCost) {
      alert('Insufficient TimeGig coins! Please replenish your coins in the Wallet page.');
      return;
    }

    setIsApplying(true);
    setTimeout(() => {
      onApply(selectedJob);
      setIsApplying(false);
      setApplySuccess(true);
    }, 1200);
  };

  const handleCreateJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddJob) return;

    let rateStr = newJobState.rate.trim();
    if (rateStr && !rateStr.startsWith('R') && !rateStr.toLowerCase().startsWith('rand')) {
      rateStr = `R ${rateStr}`;
    }

    const job: Job = {
      id: `job-${Date.now()}`,
      title: newJobState.title,
      company: newJobState.company,
      description: newJobState.description,
      location: newJobState.location,
      rate: rateStr || 'Undisclosed / Negotiable',
      type: newJobState.type,
      category: newJobState.category,
      postedDate: 'Just now',
      coinsCost: 5
    };

    onAddJob(job);
    setShowCreateModal(false);
    setNewJobState({
      title: '',
      company: '',
      description: '',
      location: '',
      rate: '',
      type: 'Full-time',
      category: 'Technology'
    });
  };

  const handleAdzunaImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adzunaAppId.trim() || !adzunaAppKey.trim()) {
      setAdzunaError("Please supply both your Adzuna App ID and API KEY credentials.");
      return;
    }

    setAdzunaSyncing(true);
    setAdzunaError(null);
    setAdzunaSuccessCount(null);

    // Persist credentials locally
    localStorage.setItem('timegig_adzuna_app_id', adzunaAppId.trim());
    localStorage.setItem('timegig_adzuna_app_key', adzunaAppKey.trim());

    try {
      const queryParam = searchTerm.trim() || "Worker";
      const targetUrl = `/api/adzuna/jobs?app_id=${encodeURIComponent(adzunaAppId.trim())}&app_key=${encodeURIComponent(adzunaAppKey.trim())}&what=${encodeURIComponent(queryParam)}`;
      
      const response = await fetch(targetUrl);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `API returned status code ${response.status}`);
      }

      const data = await response.json();
      const newJobs: Job[] = data.jobs || [];

      if (newJobs.length > 0) {
        if (onAddJobs) {
          onAddJobs(newJobs);
        } else if (onAddJob) {
          newJobs.forEach(j => onAddJob(j));
        }
        setAdzunaSuccessCount(newJobs.length);
      } else {
        setAdzunaError("No live vacancies found matching key search parameters in South Africa.");
      }
    } catch (err: any) {
      console.error("Adzuna sync error:", err);
      setAdzunaError(err?.message || "Failed to contact South African Adzuna servers.");
    } finally {
      setAdzunaSyncing(false);
    }
  };

  const activeJob = selectedJob || (filteredJobs.length > 0 ? filteredJobs[0] : null);

  const handleApplyClick = () => {
    if (isGuest) {
      setShowGuestPrompt(true);
      return;
    }
    if (!activeJob) return;

    if (coins < activeJob.coinsCost) {
      alert('Insufficient TimeGig coins! Please replenish your coins in the Wallet page.');
      return;
    }

    // Process coin transaction and application status synchronously
    onApply(activeJob);
    setApplySuccess(true);
    
    const jobUrl = activeJob.redirectUrl || `https://www.adzuna.co.za/search?q=${encodeURIComponent(activeJob.title + ' ' + activeJob.company)}`;
    try {
      const targetWindow = window.open(jobUrl, '_blank');
      if (!targetWindow) {
        // Fallback: Use direct navigation if popup block prevents opening new tab
        window.location.href = jobUrl;
      }
    } catch (err) {
      console.warn("Auto-redirect blocked or failed:", err);
      window.location.href = jobUrl;
    }
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-slate-50 overflow-hidden font-sans select-none min-h-0">
      
      {/* LEFT PANEL: SEARCH & JOB CARDS LIST */}
      <div className={`w-full md:w-[360px] lg:w-[400px] md:h-full shrink-0 border-r border-gray-200 bg-white flex flex-col min-h-0 ${
        selectedJob ? 'hidden md:flex' : 'flex'
      }`}>
        
        {/* Sticky Search & Profile Headers */}
        <div className="p-4 border-b border-gray-150 space-y-3 shrink-0 bg-white">
          <div className="flex justify-between items-center gap-2">
            <div>
              <h3 className="text-md font-extrabold text-gray-900 uppercase tracking-tight"><T>Job Openings</T></h3>
              <p className="text-[10px] text-gray-400 font-bold"><T>Apply securely with coins</T></p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setAdzunaSuccessCount(null);
                  setAdzunaError(null);
                  setShowAdzunaModal(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 transition-all shadow-xs shrink-0"
              >
                <RefreshCw size={11} className={adzunaSyncing ? "animate-spin" : ""} />
                <T>Sync Adzuna</T>
              </button>
              {onAddJob && (
                <button
                  type="button"
                  onClick={() => {
                    if (isGuest) {
                      setShowGuestPrompt(true);
                    } else {
                      setShowCreateModal(true);
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 transition-all shadow-xs shrink-0"
                >
                  <PlusCircle size={11} />
                  <T>Post a Job</T>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search roles, skills, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:bg-white transition-all font-semibold"
                style={{ color: "#090f1d", backgroundColor: "#f8fafc" }}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-slate-50 px-3 py-2 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-slate-700 font-bold text-xs sm:w-1/3"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc === 'All' ? 'Everywhere' : loc}</option>
                ))}
              </select>

              <div className="flex items-center gap-3 sm:w-2/3 bg-slate-50 px-3 py-2 rounded-xl border border-gray-200">
                <label className="text-xs font-bold text-gray-700 flex flex-col sm:flex-row sm:items-center whitespace-nowrap min-w-max">
                  <T>Distance:</T> <span className="text-green-600 sm:ml-1">{maxDistance} <T>miles</T></span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={maxDistance} 
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
              </div>
            </div>
          </div>

          {/* Horizontal category slider chips */}
          <div className="flex gap-1.5 overflow-x-auto pt-2 pb-1 no-scrollbar scroll-smooth shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-green-600 text-white shadow-xs'
                    : 'bg-slate-100 text-gray-500 hover:bg-slate-200'
                }`}
              >
                <T>{cat}</T>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable job listings list container */}
        <div className="flex-grow overflow-y-auto p-3 space-y-2 bg-slate-50/50 min-h-0">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <Briefcase className="mx-auto text-gray-300" size={36} />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800 uppercase"><T>No dynamic opportunities</T></h4>
                <p className="text-[10px] text-gray-400 max-w-xs mx-auto font-medium">
                  <T>Try adjusting your search query, scanning other locations, or selection categories.</T>
                </p>
              </div>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isSelected = activeJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJob(job);
                    setApplySuccess(false);
                  }}
                  className={`rounded-xl p-3.5 border transition-all duration-250 cursor-pointer flex flex-col gap-2 relative ${
                    isSelected 
                      ? 'border-green-600 bg-emerald-50/40 shadow-xs' 
                      : 'border-slate-200/60 bg-white hover:border-slate-300/80 hover:shadow-xs'
                  }`}
                >
                  <div className="flex justify-between items-start gap-1.5">
                    <span className="bg-green-50 text-green-700 border border-green-100 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                      <T>{job.category}</T>
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold"><T>{job.postedDate}</T></span>
                  </div>
                  
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-950 line-clamp-1">
                      <T>{job.title}</T>
                    </h4>
                    <p className="text-[10px] text-gray-500 font-bold mt-0.5"><T>{job.company}</T></p>
                  </div>

                  <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed font-medium"><T>{job.description}</T></p>
                  
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold border-t border-slate-150/40 pt-2 mt-1">
                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin size={11} className="text-gray-400 shrink-0" />
                      <span className="truncate"><T>{job.location}</T></span>
                      {job.distance && (
                        <span className="text-green-600 font-black ml-1 shrink-0 bg-green-50 px-1 rounded">({job.distance}m)</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 font-extrabold text-green-700 bg-green-50 border border-green-100/50 px-2 py-0.5 rounded text-[10px]">
                      <Coins size={10} className="text-green-600 shrink-0" />
                      <span><T>{job.rate}</T></span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANEL: JOB CARDS DETAIL VIEWER */}
      <div className={`flex-grow h-full bg-slate-50 overflow-hidden flex flex-col min-h-0 ${
        !selectedJob ? 'hidden md:flex' : 'flex'
      }`}>
        
        {/* Mobile-Only Navigation Header with back arrow */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-250 shrink-0">
          <button
            onClick={() => setSelectedJob(null)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-700 font-bold transition-all cursor-pointer flex items-center justify-center border border-gray-200 outline-none"
          >
            <ChevronRight className="rotate-180 text-gray-600" size={17} />
          </button>
          <span className="font-extrabold text-xs text-slate-900 uppercase tracking-tight"><T>Back to Listings</T></span>
        </div>

        {!activeJob ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-3 bg-slate-50 h-full">
            <Briefcase className="text-slate-300 animate-[pulse_2s_infinite]" size={48} />
            <div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight"><T>Select an Opportunity</T></h4>
              <p className="text-[10px] text-gray-400 max-w-xs mt-1 leading-relaxed font-bold">
                <T>Review the jobs list sidebar, or adjust search options to see full detailed requirements, rates & instant portals.</T>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col min-h-0 bg-white md:bg-transparent">
            
            {/* Split layout scrollable core */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6 min-h-0">
              
              {/* Header card banner */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
                <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-10">
                  <Briefcase size={220} className="text-white" />
                </div>
                
                <div className="relative space-y-3 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-green-500/20 text-green-300 border border-green-500/30 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      <T>{activeJob.category}</T>
                    </span>
                    <span className="text-[10px] text-slate-350 font-semibold"><T>Posted on TimeGig</T></span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-black text-white leading-snug tracking-tight">
                    <T>{activeJob.title}</T>
                  </h3>

                  <div className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5 pt-0.5">
                    <T>{activeJob.company}</T>
                  </div>
                </div>
              </div>

              {/* Information metadata widgets */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="bg-white border border-gray-150 p-3 sm:p-4 rounded-xl flex items-center gap-2.5">
                  <Coins className="text-green-600 shrink-0" size={18} />
                  <div className="min-w-0">
                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-wider"><T>Salary Offer</T></span>
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm block truncate"><T>{activeJob.rate}</T></span>
                  </div>
                </div>

                <div className="bg-white border border-gray-150 p-3 sm:p-4 rounded-xl flex items-center gap-2.5">
                  <MapPin className="text-gray-500 shrink-0" size={18} />
                  <div className="min-w-0">
                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-wider"><T>Job Location</T></span>
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm block truncate"><T>{activeJob.location}</T></span>
                  </div>
                </div>
              </div>

              {/* Comprehensive detailed description text block */}
              <div className="bg-white border border-gray-150 p-4 sm:p-5 rounded-xl space-y-3 text-left">
                <h4 className="text-xs font-black text-slate-950 uppercase tracking-widest border-b border-gray-100 pb-2"><T>Role Requirements & Overview</T></h4>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                  <T>{activeJob.description}</T>
                </p>
              </div>

              {/* TimeGig Protection Shield Info */}
              <div className="bg-slate-50 border border-gray-150 p-4 rounded-xl flex items-start gap-2.5 text-left select-none">
                <Shield size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h5 className="font-black text-slate-900 text-xs uppercase tracking-normal"><T>Anti-Fraud Security Escrow</T></h5>
                  <p className="text-[10px] text-gray-500 font-bold leading-normal">
                    <T>TimeGig charges a small 5-coin administrative lock to submit candidate files. This prevents spam, protects South African labor registers, and builds serious FICA candidate pools.</T>
                  </p>
                </div>
              </div>

            </div>

            {/* Flat inline Sticky bottom application action bar */}
            <div className="p-4 bg-white border-t border-gray-150/80 sticky bottom-0 shrink-0 text-left">
              {isApplying ? (
                <div className="flex items-center justify-center gap-3 py-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase"><T>Redirecting SECURE PORTAL</T></h4>
                    <p className="text-[9px] text-gray-400 font-bold"><T>Opening corporate application dashboard...</T></p>
                  </div>
                </div>
              ) : applySuccess ? (
                <div className="flex flex-col gap-3 py-1 text-left">
                  <div className="flex items-start gap-2.5 text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-150">
                    <CheckCircle size={16} className="shrink-0 mt-0.5 text-emerald-600" />
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-slate-950 uppercase"><T>Referral Completed Successfully</T></h4>
                      <p className="text-[10px] text-gray-500 font-bold leading-normal">
                        <T>Fee processed. You can now get official contact details and submit files directly on the vacancy source website.</T>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 font-bold text-[10px]">
                    <a
                      href={activeJob?.redirectUrl || `https://www.adzuna.co.za/search?q=${encodeURIComponent((activeJob?.title || "") + " " + (activeJob?.company || ""))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 px-4 rounded-xl uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
                    >
                      <span><T>Visit Vacancy Website</T></span>
                      <Globe size={11} className="shrink-0" />
                    </a>
                    
                    <button
                      onClick={() => {
                        setApplySuccess(false);
                        setSelectedJob(null);
                      }}
                      className="bg-slate-950 hover:bg-slate-900 text-white font-extrabold py-3 px-4 rounded-xl uppercase tracking-wider transition-all cursor-pointer text-center"
                    >
                      <T>Close Details</T>
                    </button>
                  </div>
                </div>
              ) : isGuest ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[10px] text-gray-500 font-bold">
                    ⚠️ <span className="text-slate-900 font-black uppercase"><T>Identify Verification Locked</T></span>: <T>Register an RSA Citizen profile first to apply.</T>
                  </div>
                  <button
                    onClick={() => {
                      if (onSignUp) onSignUp();
                    }}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 px-5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-98"
                  >
                    <T>Register Credentials</T>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-gray-150 flex items-center justify-center text-slate-600 font-mono text-xs shrink-0">
                      R
                    </div>
                    <div>
                      <span className="block text-[9px] text-gray-400 uppercase font-black tracking-wider"><T>Fee Charged</T></span>
                      <span className="font-extrabold text-slate-950 text-xs sm:text-sm block leading-none">5 <T>Coins</T> <span className="text-[10.5px] font-bold text-gray-400">(Current: {coins} Coins)</span></span>
                    </div>
                  </div>

                  <button
                    onClick={handleApplyClick}
                    className="bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-98 cursor-pointer"
                  >
                    <span><T>Apply for Vacancy</T></span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* CREATE JOB OVERLAY MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs select-none">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-tight"><T>Post a Job Opportunity</T></h3>
              <button 
                type="button"
                onClick={() => setShowCreateModal(false)} 
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-1 border border-gray-200 text-gray-600 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
            
            <form onSubmit={handleCreateJobSubmit} className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto text-left">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block mb-1"><T>Job Title</T></label>
                <input 
                  required 
                  type="text" 
                  value={newJobState.title} 
                  onChange={e => setNewJobState({...newJobState, title: e.target.value})} 
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-green-500 font-semibold" 
                  placeholder="e.g. Senior Handyman Expert" 
                  style={{ color: "#090f1d", backgroundColor: "#f8fafc" }}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block mb-1"><T>Company Name</T></label>
                <input 
                  required 
                  type="text" 
                  value={newJobState.company} 
                  onChange={e => setNewJobState({...newJobState, company: e.target.value})} 
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-green-500 font-semibold" 
                  placeholder="e.g. Randburg Maintenance" 
                  style={{ color: "#090f1d", backgroundColor: "#f8fafc" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block mb-1"><T>Category</T></label>
                  <select 
                    value={newJobState.category} 
                    onChange={e => setNewJobState({...newJobState, category: e.target.value})} 
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-2 py-2 text-xs outline-none focus:border-green-500 font-bold"
                  >
                    <option value="Technology"><T noSpan>Technology</T></option>
                    <option value="Construction"><T noSpan>Construction</T></option>
                    <option value="Creative"><T noSpan>Creative</T></option>
                    <option value="Finance"><T noSpan>Finance</T></option>
                    <option value="Logistics"><T noSpan>Logistics</T></option>
                    <option value="Services"><T noSpan>Services</T></option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block mb-1"><T>Job Type</T></label>
                  <select 
                    value={newJobState.type} 
                    onChange={e => setNewJobState({...newJobState, type: e.target.value})} 
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-2 py-2 text-xs outline-none focus:border-green-500 font-bold"
                  >
                    <option value="Full-time"><T noSpan>Full-time</T></option>
                    <option value="Part-time"><T noSpan>Part-time</T></option>
                    <option value="Contract"><T noSpan>Contract</T></option>
                    <option value="Remote"><T noSpan>Remote</T></option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block mb-1"><T>Remuneration (Rand)</T></label>
                  <input 
                    required 
                    type="text" 
                    value={newJobState.rate} 
                    onChange={e => setNewJobState({...newJobState, rate: e.target.value})} 
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-green-500 font-semibold" 
                    placeholder="e.g. R4500" 
                    style={{ color: "#090f1d", backgroundColor: "#f8fafc" }}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block mb-1"><T>City or Area</T></label>
                  <input 
                    required 
                    type="text" 
                    value={newJobState.location} 
                    onChange={e => setNewJobState({...newJobState, location: e.target.value})} 
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-green-500 font-semibold" 
                    placeholder="e.g. Sandton, JHB" 
                    style={{ color: "#090f1d", backgroundColor: "#f8fafc" }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block mb-1"><T>Description & Terms</T></label>
                <textarea 
                  required 
                  rows={4} 
                  value={newJobState.description} 
                  onChange={e => setNewJobState({...newJobState, description: e.target.value})} 
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-green-500 font-semibold" 
                  placeholder="Duties, qualifications and physical address..." 
                  style={{ color: "#090f1d", backgroundColor: "#f8fafc" }}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 rounded-xl transition-all shadow-md mt-2 flex justify-center items-center gap-1 cursor-pointer text-xs uppercase tracking-wider"
              >
                <PlusCircle size={14} />
                <T>Publish listing</T>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GUEST REGISTER LIGHT MODAL */}
      {showGuestPrompt && (
        <div className="fixed inset-0 z-[60] bg-slate-900/70 flex items-center justify-center p-4 backdrop-blur-xs select-none">
          <div className="bg-white rounded-3xl max-w-xs w-full p-6 text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-md font-black text-gray-900 uppercase tracking-tight"><T>Registration Required</T></h3>
            <p className="text-gray-500 text-[11px] leading-relaxed mt-2 mb-4 font-medium">
              <T>To prevent job-farming scams, we require you to complete a 1-step FICA registration before accessing direct apply methods.</T>
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  setShowGuestPrompt(false);
                  if (onSignUp) onSignUp();
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                <T>Sign Up Now</T>
              </button>
              <button 
                onClick={() => setShowGuestPrompt(false)}
                className="w-full bg-gray-150 hover:bg-slate-200 text-gray-600 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors"
              >
                <T>Cancel</T>
              </button>
            </div>
          </div>
        </div>
      )}

      {showAdzunaModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/70 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs select-none animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 text-left">
            <div className="p-4 border-b flex justify-between items-center bg-indigo-50/50 shrink-0">
              <div className="flex items-center gap-1.5 text-indigo-950">
                <Globe size={16} className="text-indigo-650 shrink-0" />
                <h3 className="font-extrabold text-xs uppercase tracking-tight"><T>Adzuna SA Sync</T></h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowAdzunaModal(false)} 
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-1 border border-gray-200 text-gray-600 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAdzunaImport} className="p-4 sm:p-5 space-y-4">
              <p className="text-[10px] text-gray-500 font-bold leading-normal">
                <T>Connect your personal Adzuna Developer account to stream verified listings directly from RSA registries. If you don't have credentials, leave empty or register at developer.adzuna.com.</T>
              </p>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1"><T>Adzuna App ID</T></label>
                <input 
                  required 
                  type="text" 
                  value={adzunaAppId} 
                  onChange={e => setAdzunaAppId(e.target.value)} 
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 font-semibold" 
                  placeholder="e.g. 1a2b3c4d" 
                  style={{ color: "#090f1d", backgroundColor: "#f8fafc" }}
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1"><T>Adzuna API Key</T></label>
                <input 
                  required 
                  type="password" 
                  value={adzunaAppKey} 
                  onChange={e => setAdzunaAppKey(e.target.value)} 
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 font-semibold" 
                  placeholder="e.g. abc123xyz789..." 
                  style={{ color: "#090f1d", backgroundColor: "#f8fafc" }}
                />
              </div>

              {adzunaError && (
                <div className="bg-red-55/10 border border-red-200/50 p-3 rounded-xl flex items-start gap-2 text-red-700">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span className="text-[10px] font-bold leading-normal"><T>{adzunaError}</T></span>
                </div>
              )}

              {adzunaSuccessCount !== null && (
                <div className="bg-emerald-50 border border-emerald-150 p-3 rounded-xl flex items-start gap-2 text-emerald-700 animate-pulse">
                  <CheckCircle size={14} className="shrink-0 mt-0.5" />
                  <span className="text-[10px] font-bold leading-normal">
                    <T>Successfully imported {adzunaSuccessCount} live vacancies from South Africa!</T>
                  </span>
                </div>
              )}

              <div className="flex gap-2.5 pt-1.5 font-bold">
                <button
                  type="button"
                  onClick={() => setShowAdzunaModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-slate-200 text-gray-500 font-bold py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer text-center"
                >
                  <T>Cancel</T>
                </button>
                <button
                  type="submit"
                  disabled={adzunaSyncing}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer flex justify-center items-center gap-1 shadow-md active:scale-98"
                >
                  {adzunaSyncing ? (
                    <>
                      <RefreshCw size={11} className="animate-spin" />
                      <T>Syncing...</T>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={11} />
                      <T>Connect Sync</T>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

