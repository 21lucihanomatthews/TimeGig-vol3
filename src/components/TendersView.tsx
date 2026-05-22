import React, { useState } from 'react';
import { Landmark, Search as SearchIcon, Calendar, ChevronRight, CheckCircle, Download, ExternalLink, PlusCircle, X, Lock } from 'lucide-react';
import { Tender } from '../types';
import { T, useLanguage } from './TranslationProvider';

interface TendersViewProps {
  tenders: Tender[];
  onAddTender?: (tender: Tender) => void;
  onLoadSamples?: () => void;
  isGuest?: boolean;
  onSignUp?: () => void;
}

export function TendersView({ tenders, onAddTender, onLoadSamples, isGuest, onSignUp }: TendersViewProps) {
  const { translateText } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  // Custom tender creation states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTender, setNewTender] = useState({
    title: '',
    department: '',
    value: '',
    description: '',
    closingDate: '',
    documentUrl: ''
  });

  const handleCreateTender = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddTender) return;

    let valueStr = newTender.value.trim();
    if (valueStr && !valueStr.startsWith('R') && !valueStr.toLowerCase().startsWith('rand')) {
      valueStr = `R ${valueStr}`;
    }

    const tenderVal: Tender = {
      id: `tender-${Date.now()}`,
      title: newTender.title,
      department: newTender.department,
      value: valueStr || 'R 0 (Undisclosed)',
      description: newTender.description,
      closingDate: newTender.closingDate || '2026-12-31',
      status: 'Open',
      coinsCost: 15,
      documentUrl: newTender.documentUrl || 'https://www.etenders.gov.za/'
    };

    onAddTender(tenderVal);
    setShowCreateModal(false);
    setNewTender({ title: '', department: '', value: '', description: '', closingDate: '', documentUrl: '' });
  };

  const filteredTenders = tenders.filter(tender =>
    tender.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tender.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenApply = (tender: Tender) => {
    if (isGuest) {
      setShowGuestPrompt(true);
      return;
    }
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
      if (selectedTender.documentUrl) {
        window.open(selectedTender.documentUrl, '_blank', 'noopener,noreferrer');
      }
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight"><T>Government Tenders</T></h3>
            <p className="text-sm text-gray-500 mt-1"><T>Discover latest local and national government tenders and apply externally.</T></p>
          </div>
          {onAddTender && (
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
              <T>Gazette a Tender</T>
            </button>
          )}
        </div>
        
        <div className="relative">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={translateText("Search departments or notice titles...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 text-gray-900 pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTenders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8 space-y-4 shadow-xs">
            <Landmark className="mx-auto text-gray-300" size={48} />
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-gray-800"><T>No active government tenders listed</T></h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                <T>Start by gazetting a public infrastructure tender, medical supply contract, or load municipal samples instantly.</T>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center pt-2">
              {onAddTender && (
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <PlusCircle size={14} />
                  <T>Gazette a Tender Notice</T>
                </button>
              )}
            </div>
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
                    <T>{tender.status}</T>
                  </span>
                  <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                    <Calendar size={12}/> <T>Closes</T> <T>{tender.closingDate}</T>
                  </span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  <T>{tender.title}</T>
                </h4>
                <div className="text-sm font-medium text-gray-600"><T>{tender.department}</T></div>
                
                <div className="flex flex-wrap gap-y-1 gap-x-4 pt-1 text-xs text-gray-500 font-medium">
                  <div className="flex items-center gap-1 font-semibold text-green-600">
                    <T>Est. Value</T>: <T>{tender.value}</T>
                  </div>
                </div>
              </div>

              <div className="md:self-center flex flex-col items-stretch md:items-end gap-2 shrink-0">
                {isGuest ? (
                  <div className="bg-gray-100 text-gray-400 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-dashed border-gray-200">
                    <Lock size={14} />
                    <T>View Locked</T>
                  </div>
                ) : (
                  <button
                    className="bg-green-600 text-white hover:bg-green-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <T>View Details</T>
                    <ChevronRight size={16} />
                  </button>
                )}
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
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${selectedTender.status === 'Open' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'}`}><T>{selectedTender.status}</T></span>
              <h3 className="text-2xl font-black text-gray-900 mt-3 tracking-tight"><T>{selectedTender.title}</T></h3>
              <p className="text-sm font-semibold text-gray-600 mt-1 flex items-center gap-2">
                <Landmark size={16} className="text-gray-400" />
                <T>{selectedTender.department}</T>
              </p>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1"><T>Estimated Value</T></span>
                    <span className="font-bold text-green-600 text-lg"><T>{selectedTender.value}</T></span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1"><T>Closing Date</T></span>
                    <span className="font-bold text-gray-700"><T>{selectedTender.closingDate}</T></span>
                  </div>
              </div>

              <div>
                <h5 className="text-sm font-bold text-gray-800 mb-2"><T>Tender Description</T></h5>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line"><T>{selectedTender.description}</T></p>
              </div>

              {selectedTender.documentUrl && (
                <div className="bg-green-50 border-2 border-green-200/60 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h5 className="text-xs font-black text-green-900 uppercase tracking-widest flex items-center gap-1.5">
                        <Download size={14} className="text-green-600" />
                        <T>Official Tender Specifications</T>
                      </h5>
                      <p className="text-xs text-green-700 font-bold leading-relaxed">
                        <T>Get the PDF bid invitation specs, municipal standard bidding documents (SBD), and site-briefing notes instantly.</T>
                      </p>
                    </div>
                  </div>
                  <a
                    href={selectedTender.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <T>Go to Official Website to Download Documents</T>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}

              {isApplying ? (
                <div className="pt-4 border-t border-gray-100 text-center space-y-3 py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <h4 className="text-md font-bold text-gray-900"><T>Redirecting...</T></h4>
                  <p className="text-xs text-gray-500"><T>Taking you to official gov site...</T></p>
                </div>
              ) : applySuccess ? (
                <div className="pt-4 border-t border-gray-100 text-center space-y-3 py-4">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900"><T>Site Opened!</T></h4>
                  <p className="text-xs text-gray-500 mx-auto max-w-xs"><T>Follow the steps on the government portal to submit your documents and bids.</T></p>
                  <button
                    onClick={() => setSelectedTender(null)}
                    className="mt-2 bg-gray-100 hover:bg-gray-200 font-bold px-5 py-2 rounded-xl text-xs"
                  >
                    <T>Close</T>
                  </button>
                </div>
              ) : isGuest ? (
                <div className="pt-4 border-t border-gray-100 text-center space-y-4 py-4">
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl space-y-2">
                    <Lock className="mx-auto text-indigo-500" size={24} />
                    <h4 className="text-sm font-extrabold text-indigo-900 uppercase"><T>Tenders Feature Locked</T></h4>
                    <p className="text-[11px] text-indigo-700 font-medium"><T>To view official documents and apply for national government tenders, your company must be verified.</T></p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTender(null);
                      if (onSignUp) onSignUp();
                    }}
                    className="w-full py-4 rounded-xl font-bold text-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md"
                  >
                    <T>Verify Company Now</T>
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
                    <T>Apply on Gov Portal</T>
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gazette Tender Overlay Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900"><T>Gazette a New Tender</T></h3>
              <button 
                type="button"
                onClick={() => setShowCreateModal(false)} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-1.5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateTender} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1"><T>Tender Title / Notice</T></label>
                <input required type="text" value={newTender.title} onChange={e => setNewTender({...newTender, title: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500" placeholder={translateText("e.g. Renovation of local primary school")} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1"><T>Department / Municipality</T></label>
                <input required type="text" value={newTender.department} onChange={e => setNewTender({...newTender, department: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500" placeholder={translateText("e.g. City of Johannesburg Municipality")} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1"><T>Estimated Value (Rand)</T></label>
                  <input required type="text" value={newTender.value} onChange={e => setNewTender({...newTender, value: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500" placeholder={translateText("e.g. R4 200 000")} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1"><T>Bidding Closing Date</T></label>
                  <input required type="date" value={newTender.closingDate} onChange={e => setNewTender({...newTender, closingDate: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1"><T>Specification Document Portal Link (URL)</T></label>
                <input required type="url" value={newTender.documentUrl} onChange={e => setNewTender({...newTender, documentUrl: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500" placeholder={translateText("e.g. https://www.etenders.gov.za/")} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1"><T>Scope of Work & Specification Details</T></label>
                <textarea required rows={4} value={newTender.description} onChange={e => setNewTender({...newTender, description: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500" placeholder={translateText("State standard bidding documents requirements, briefing meetings and CIDB grading requirements...")} />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 rounded-xl transition-all shadow-md mt-2 flex justify-center items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle size={16} />
                <T>Publish Tender Notice</T>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Guest Mode Prompt Overlay */}
      {showGuestPrompt && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2"><T>Registration Required</T></h3>
            <p className="text-gray-600 text-sm mb-6">
              <T>You must register your company to view full tender specifications and submit bids.</T>
            </p>
            <div className="space-y-3">
               <button 
                 onClick={() => {
                   setShowGuestPrompt(false);
                   if (onSignUp) onSignUp();
                 }}
                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all"
               >
                 <T>Verify Company</T>
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
