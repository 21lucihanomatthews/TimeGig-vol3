import React, { useState } from 'react';
import { Search as SearchIcon, MapPin, Coins, Calendar, Briefcase, ChevronRight, CheckCircle, AlertTriangle, PlusCircle, X, Lock } from 'lucide-react';
import { Job } from '../types';
import { T } from './TranslationProvider';

interface JobsViewProps {
  jobs: Job[];
  coins: number;
  onApply: (job: Job) => void;
  appliedJobIds: string[];
  onAddJob?: (job: Job) => void;
  onLoadSamples?: () => void;
  isGuest?: boolean;
  onSignUp?: () => void;
}

export function JobsView({ jobs, coins, onApply, appliedJobIds, onAddJob, onLoadSamples, isGuest, onSignUp }: JobsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', pitch: '', portfolioLink: '' });
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

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

    return matchesSearch && matchesCategory && matchesLocation;
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro & Search Panel */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight"><T>Discover Latest Jobs</T></h3>
            <p className="text-sm text-gray-500 mt-1"><T>Find your next big opportunity and apply directly on the company portal.</T></p>
          </div>
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
              className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs px-4 py-3 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all shadow-xs shrink-0"
            >
              <PlusCircle size={15} />
              <T>Post a Job</T>
            </button>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search roles, skills or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:bg-white transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none text-gray-700 font-medium"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc === 'All' ? 'Everywhere' : loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories Scroller */}
        <div className="flex gap-2 overflow-x-auto pt-4 pb-1 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-green-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <T>{cat}</T>
            </button>
          ))}
        </div>
      </div>

      {/* Main Jobs Listing */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8 space-y-4 shadow-xs">
            <Briefcase className="mx-auto text-gray-300" size={48} />
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-gray-800"><T>No active job vacancies listed</T></h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                <T>Start by posting a corporate job opportunity, full-time search vacancy, or import South African sample configurations instantly.</T>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center pt-2">
              {onAddJob && (
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <PlusCircle size={14} />
                  <T>Post a Job Opportunity</T>
                </button>
              )}
              {onLoadSamples && (
                <button
                  type="button"
                  onClick={onLoadSamples}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all border border-gray-200"
                >
                  <T>Load Sample Job Listings</T>
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const hasApplied = appliedJobIds.includes(job.id);
            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                onClick={() => handleOpenApply(job)}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      <T>{job.category}</T>
                    </span>
                    <span className="text-xs text-gray-400 font-medium"><T>{job.postedDate}</T></span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    <T>{job.title}</T>
                  </h4>
                  <div className="text-sm font-medium text-gray-600"><T>{job.company}</T></div>
                  <p className="text-sm text-gray-500 line-clamp-2 max-w-xl"><T>{job.description}</T></p>
                  
                  <div className="flex flex-wrap gap-y-1 gap-x-4 pt-1 text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-400" />
                      <T>{job.location}</T>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-emerald-600">
                      <Coins size={14} />
                      <T>{job.rate}</T>
                    </div>
                  </div>
                </div>

                <div className="md:self-center flex flex-col items-stretch md:items-end gap-2 shrink-0">
                  {isGuest ? (
                    <div className="bg-gray-100 text-gray-400 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-dashed border-gray-200">
                      <Lock size={14} />
                      Apply Locked
                    </div>
                  ) : (
                    <button
                      className="bg-green-600 text-white hover:bg-green-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      View & Apply
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Detail / Apply Panel */}
      {selectedJob && (
         <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Header */}
            <div className="p-6 pb-4 border-b border-gray-100 bg-gray-50 pt-10">
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">{selectedJob.category}</span>
              <h3 className="text-2xl font-black text-gray-900 mt-3 tracking-tight">{selectedJob.title}</h3>
              <p className="text-sm font-semibold text-gray-600 mt-1 flex items-center gap-2">
                <Briefcase size={16} className="text-gray-400" />
                {selectedJob.company}
              </p>
            </div>

            {/* Content Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1 flex items-center gap-1"><Coins size={14}/> Salary / Rate</span>
                    <span className="font-bold text-emerald-600 text-lg">{selectedJob.rate}</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1 flex items-center gap-1"><MapPin size={14}/> Location</span>
                    <span className="font-bold text-gray-700">{selectedJob.location}</span>
                  </div>
              </div>

              <div>
                <h5 className="text-sm font-bold text-gray-800 mb-2">Job Description</h5>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
              </div>

              {isApplying ? (
                 <div className="pt-4 border-t border-gray-100 text-center space-y-3 py-4">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                   <h4 className="text-md font-bold text-gray-900">Redirecting...</h4>
                   <p className="text-xs text-gray-500">Taking you to {selectedJob.company}'s site to apply.</p>
                 </div>
              ) : applySuccess ? (
                <div className="pt-4 border-t border-gray-100 text-center space-y-3 py-4">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Application Link Opened!</h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    You can complete your application on the external site. Good luck!
                  </p>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-5 py-2 rounded-xl text-xs transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : isGuest ? (
                <div className="pt-4 border-t border-gray-100 text-center space-y-4 py-4">
                   <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl space-y-2">
                     <Lock className="mx-auto text-indigo-500" size={24} />
                     <h4 className="text-sm font-extrabold text-indigo-900 uppercase">Apply Feature Locked</h4>
                     <p className="text-[11px] text-indigo-700 font-medium">To apply for this role and access the hire portal, you must register your personal profile first.</p>
                   </div>
                   <button
                    onClick={() => {
                      setSelectedJob(null);
                      if (onSignUp) onSignUp();
                    }}
                    className="w-full py-4 rounded-xl font-bold text-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md"
                  >
                    Sign Up to Apply
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={handleApplySubmit}
                    className="w-full py-4 rounded-xl font-bold text-lg tracking-tight text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-100 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    View Details & Apply
                    <ChevronRight size={20} />
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-3">You will be redirected to an external site.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Job Overlay Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">Post a Job Opportunity</h3>
              <button 
                type="button"
                onClick={() => setShowCreateModal(false)} 
                className="bg-gray-200 hover:bg-gray-300 rounded-full p-1.5 transition-colors cursor-pointer text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateJobSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Job Title</label>
                <input required type="text" value={newJobState.title} onChange={e => setNewJobState({...newJobState, title: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500" placeholder="e.g. Senior Frontend Engineer" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Company / Organization</label>
                <input required type="text" value={newJobState.company} onChange={e => setNewJobState({...newJobState, company: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500" placeholder="e.g. Vodacom South Africa" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Job Category</label>
                  <select value={newJobState.category} onChange={e => setNewJobState({...newJobState, category: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500">
                    <option value="Technology">Technology</option>
                    <option value="Construction">Construction</option>
                    <option value="Creative">Creative</option>
                    <option value="Finance">Finance</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Services">Services</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Job Type</label>
                  <select value={newJobState.type} onChange={e => setNewJobState({...newJobState, type: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Salary / Remuneration (Rand)</label>
                  <input required type="text" value={newJobState.rate} onChange={e => setNewJobState({...newJobState, rate: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500" placeholder="e.g. R45 000 / month" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Location / City</label>
                  <input required type="text" value={newJobState.location} onChange={e => setNewJobState({...newJobState, location: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500" placeholder="e.g. Sandton, JHB" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Description & Requirements</label>
                <textarea required rows={4} value={newJobState.description} onChange={e => setNewJobState({...newJobState, description: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500" placeholder="State keys skills, duties and qualification parameters..." />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 rounded-xl transition-all shadow-md mt-2 flex justify-center items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle size={16} />
                Activate Job Listing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Guest Mode Prompt Overlay */}
      {showGuestPrompt && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">View-Only Mode</h3>
            <p className="text-gray-600 text-sm mb-6">
              You must register as a member to apply for jobs or view contact details. 
            </p>
            <div className="space-y-3">
               <button 
                 onClick={() => {
                   setShowGuestPrompt(false);
                   if (onSignUp) onSignUp();
                 }}
                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all"
               >
                 Sign Up Now
               </button>
               <button 
                 onClick={() => setShowGuestPrompt(false)}
                 className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-colors"
               >
                 Cancel
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
