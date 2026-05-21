import React, { useState } from 'react';
import { Search as SearchIcon, MapPin, DollarSign, Calendar, Briefcase, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { Job } from '../types';

interface JobsViewProps {
  jobs: Job[];
  coins: number;
  onApply: (job: Job) => void;
  appliedJobIds: string[];
}

export function JobsView({ jobs, coins, onApply, appliedJobIds }: JobsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', pitch: '', portfolioLink: '' });
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro & Search Panel */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Discover Latest Jobs</h3>
        <p className="text-sm text-gray-500 mb-4 mt-1">Find your next big opportunity and apply directly on the company portal.</p>
        
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
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Jobs Listing */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <Briefcase className="mx-auto text-gray-300 mb-3" size={48} />
            <h4 className="text-lg font-bold text-gray-800">No jobs fit those tags</h4>
            <p className="text-sm text-gray-500 mt-1">Try resetting search or filters to see more listings.</p>
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
                      {job.category}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{job.postedDate}</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {job.title}
                  </h4>
                  <div className="text-sm font-medium text-gray-600">{job.company}</div>
                  <p className="text-sm text-gray-500 line-clamp-2 max-w-xl">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-y-1 gap-x-4 pt-1 text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-emerald-600">
                      <DollarSign size={14} />
                      {job.rate}
                    </div>
                  </div>
                </div>

                <div className="md:self-center flex flex-col items-stretch md:items-end gap-2 shrink-0">
                  <button
                    className="bg-green-600 text-white hover:bg-green-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    View & Apply
                    <ChevronRight size={16} />
                  </button>
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
                    <span className="text-xs text-gray-500 block mb-1 flex items-center gap-1"><DollarSign size={14}/> salary/rate</span>
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
    </div>
  );
}
