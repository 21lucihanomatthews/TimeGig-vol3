import React, { useState } from 'react';
import { Landmark, Search as SearchIcon, Calendar, DollarSign, ChevronRight, CheckCircle } from 'lucide-react';
import { Tender } from '../types';

interface TendersViewProps {
  tenders: Tender[];
}

export function TendersView({ tenders }: TendersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  const filteredTenders = tenders.filter(tender =>
    tender.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tender.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenApply = (tender: Tender) => {
    setSelectedTender(tender);
    setApplySuccess(false);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTender) return;

    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setApplySuccess(true);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Government Tenders</h3>
        <p className="text-sm text-gray-500 mb-4 mt-1">Discover latest local and national government tenders and apply externally.</p>
        
        <div className="relative">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search departments or notice titles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 text-gray-900 pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTenders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <Landmark className="mx-auto text-gray-300 mb-3" size={48} />
            <h4 className="text-lg font-bold text-gray-800">No active tenders found</h4>
          </div>
        ) : (
          filteredTenders.map((tender) => (
            <div
              key={tender.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
              onClick={() => handleOpenApply(tender)}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${tender.status === 'Open' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
                    {tender.status}
                  </span>
                  <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                    <Calendar size={12}/> Closes {tender.closingDate}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  {tender.title}
                </h4>
                <div className="text-sm font-medium text-gray-600">{tender.department}</div>
                
                <div className="flex flex-wrap gap-y-1 gap-x-4 pt-1 text-xs text-gray-500 font-medium">
                  <div className="flex items-center gap-1 font-semibold text-green-600">
                    Est. Value: {tender.value}
                  </div>
                </div>
              </div>

              <div className="md:self-center flex flex-col items-stretch md:items-end gap-2 shrink-0">
                <button
                  className="bg-green-600 text-white hover:bg-green-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  View Details
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedTender && (
         <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setSelectedTender(null)}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="p-6 pb-4 border-b border-gray-100 bg-gray-50 pt-10">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${selectedTender.status === 'Open' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'}`}>{selectedTender.status}</span>
              <h3 className="text-2xl font-black text-gray-900 mt-3 tracking-tight">{selectedTender.title}</h3>
              <p className="text-sm font-semibold text-gray-600 mt-1 flex items-center gap-2">
                <Landmark size={16} className="text-gray-400" />
                {selectedTender.department}
              </p>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1">Estimated Value</span>
                    <span className="font-bold text-green-600 text-lg">{selectedTender.value}</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1">Closing Date</span>
                    <span className="font-bold text-gray-700">{selectedTender.closingDate}</span>
                  </div>
              </div>

              <div>
                <h5 className="text-sm font-bold text-gray-800 mb-2">Tender Description</h5>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{selectedTender.description}</p>
              </div>

              {isApplying ? (
                 <div className="pt-4 border-t border-gray-100 text-center space-y-3 py-4">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                   <h4 className="text-md font-bold text-gray-900">Redirecting...</h4>
                   <p className="text-xs text-gray-500">Taking you to official gov site...</p>
                 </div>
              ) : applySuccess ? (
                <div className="pt-4 border-t border-gray-100 text-center space-y-3 py-4">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Site Opened!</h4>
                  <p className="text-xs text-gray-500 mx-auto max-w-xs">Follow the steps on the government portal to submit your documents and bids.</p>
                  <button
                    onClick={() => setSelectedTender(null)}
                    className="mt-2 bg-gray-100 hover:bg-gray-200 font-bold px-5 py-2 rounded-xl text-xs"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={handleApplySubmit}
                    disabled={selectedTender.status !== 'Open'}
                    className={`w-full py-4 rounded-xl font-bold text-lg tracking-tight text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
                      selectedTender.status === 'Open' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Apply on Gov Portal
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
