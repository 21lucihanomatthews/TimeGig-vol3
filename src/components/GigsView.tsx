import React, { useState } from 'react';
import { 
  Search as SearchIcon, 
  MapPin, 
  Camera, 
  CheckCircle, 
  PlusCircle, 
  X, 
  Info, 
  ClipboardList,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  MessageSquare,
  Sparkles,
  Lock
} from 'lucide-react';
import { Gig, GalleryItem } from '../types';
import { T, useLanguage } from './TranslationProvider';
import { CameraCapture } from './CameraCapture';

interface GigsViewProps {
  gigs: Gig[];
  onAddGig: (gig: Gig) => void;
  onAddMediaToGallery: (item: GalleryItem) => void;
  onLoadSamples?: () => void;
  isGuest?: boolean;
  onSignUp?: () => void;
}

export function GigsView({ gigs, onAddGig, onAddMediaToGallery, onLoadSamples, isGuest, onSignUp }: GigsViewProps) {
  const { translateText, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Instruction Guide State (Persistent in local storage)
  const [showGuide, setShowGuide] = useState(() => {
    return localStorage.getItem('timegig_hide_gigs_guide') !== 'true';
  });
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  const [isGuideDismissed, setIsGuideDismissed] = useState(() => {
    return localStorage.getItem('timegig_gigs_guide_dismissed') === 'true';
  });

  const toggleGuide = () => {
    const nextVal = !showGuide;
    setShowGuide(nextVal);
    localStorage.setItem('timegig_hide_gigs_guide', String(!nextVal));
  };

  const dismissGuide = () => {
    setIsGuideDismissed(true);
    localStorage.setItem('timegig_gigs_guide_dismissed', 'true');
  };

  const unhideGuide = () => {
    setIsGuideDismissed(false);
    setShowGuide(true);
    localStorage.setItem('timegig_gigs_guide_dismissed', 'false');
    localStorage.setItem('timegig_hide_gigs_guide', 'false');
  };

  // Create Gig State
  const [showCreateGig, setShowCreateGig] = useState(false);
  const [newGig, setNewGig] = useState({ title: '', description: '', price: '', location: '', imageUrl: 'https://images.unsplash.com/photo-1598520106830-8c45c2035420?w=400&q=80' });
  const [successNotification, setSuccessNotification] = useState<string | null>(null);

  // Apply State
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [applyStep, setApplyStep] = useState<'details' | 'info' | 'capture' | 'success'>('details');
  const [photoLeft, setPhotoLeft] = useState<string | null>(null);
  const [photoRight, setPhotoRight] = useState<string | null>(null);
  const [showCameraFor, setShowCameraFor] = useState<'left' | 'right' | null>(null);

  // Distance filter
  const [maxDistance, setMaxDistance] = useState<number>(50);

  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          gig.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          gig.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistance = (gig.distance || 0) <= maxDistance;
    return matchesSearch && matchesDistance;
  });

  const handleGigImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setNewGig(prev => ({ ...prev, imageUrl: url }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateGig = (e: React.FormEvent) => {
    e.preventDefault();
    const gigId = `g${Date.now()}`;
    
    // Ensure price starts with South African Rand currency symbol
    let formattedPrice = newGig.price.trim();
    if (!formattedPrice.startsWith('R')) {
      formattedPrice = `R ${formattedPrice}`;
    }

    const gig: Gig = {
      id: gigId,
      creatorName: 'Lucihano Matthews', // Current user
      title: newGig.title,
      description: newGig.description,
      price: formattedPrice,
      location: newGig.location,
      imageUrl: newGig.imageUrl,
      postedDate: 'Just now'
    };

    onAddGig(gig);

    // Save newly uploaded gig cover images directly to the Secure Gallery View!
    if (newGig.imageUrl && (newGig.imageUrl.startsWith('data:') || newGig.imageUrl.startsWith('blob:'))) {
      onAddMediaToGallery({
        id: `gig_upload_${Date.now()}`,
        url: newGig.imageUrl,
        title: `${newGig.title} - Gig Cover`,
        category: 'Gig Attachments',
        likes: 0
      });
    }

    setSuccessNotification(`Successfully posted: "${gig.title}" for ${formattedPrice} inside ${gig.location}! Check the Secure Gallery View tab to see any associated media files you've uploaded.`);
    setShowCreateGig(false);
    setNewGig({ title: '', description: '', price: '', location: '', imageUrl: 'https://images.unsplash.com/photo-1598520106830-8c45c2035420?w=400&q=80' });
  };

  const handleApplyStart = (gig: Gig) => {
    if (isGuest) {
       setShowGuestPrompt(true);
       return;
    }
    setSelectedGig(gig);
    setApplyStep('details');
  };

  const submitApplication = () => {
    // In a real app we would send the image data to backend
    setApplyStep('success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight"><T>Community Gigs</T></h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
            <span><T>Short-term tasks and casual jobs around you.</T></span>
            {isGuideDismissed && (
              <button 
                onClick={unhideGuide}
                className="text-xs text-green-600 font-extrabold hover:text-white hover:bg-green-600 transition-all cursor-pointer select-none inline-flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-lg border border-green-100/80 animate-pulse"
              >
                <HelpCircle size={13} />
                <span><T>Show Instructions Guide</T></span>
              </button>
            )}
          </p>
        </div>
        <button 
          onClick={() => {
            if (isGuest) {
              setShowGuestPrompt(true);
            } else {
              setShowCreateGig(true);
            }
          }}
          className="bg-green-600 text-white hover:bg-green-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
        >
          <PlusCircle size={18} />
          <T>Create a Gig</T>
        </button>
      </div>

      {/* Gig Feature Quick Instructions Guide for Dummies (Collapsible & Auto-persisted) */}
      {!isGuideDismissed && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden transition-all duration-300">
          <div 
            onClick={toggleGuide}
            className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-100/50 text-left cursor-pointer transition-all select-none focus:outline-none gap-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-green-50 text-green-600 rounded-xl border border-green-100/40">
                <HelpCircle size={18} />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-950">💡 <T>How Do Gigs Work?</T></h4>
                <p className="text-[10px] text-gray-450 font-bold"><T>Unlocking South Africa's casual workspace in 4 easy steps</T></p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <div 
                className="flex items-center gap-1.5 text-xs font-black text-green-700 bg-green-50/50 border border-green-100/50 px-2.5 py-1.5 rounded-lg transition-all"
              >
                <span>{showGuide ? <T>Collapse Info</T> : <T>Expand Info</T>}</span>
                {showGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
              
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dismissGuide();
                }}
                className="flex items-center gap-1 text-xs text-red-600 font-extrabold hover:bg-red-50 border border-transparent hover:border-red-100 px-2 py-1.5 rounded-lg transition-all cursor-pointer"
                title="Hide instructions panel completely"
              >
                <X size={14} className="stroke-[2.5]" />
                <span><T>Hide Guide</T></span>
              </button>
            </div>
          </div>

        {showGuide && (
          <div className="p-5 border-t border-gray-150 space-y-4 bg-white animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Step 1 */}
              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-gray-100/80 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-600 text-white font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0">1</span>
                  <h5 className="font-extrabold text-xs text-slate-900"><T>Post a Casual Job</T></h5>
                </div>
                <p className="text-[11px] font-bold text-gray-550 leading-relaxed">
                  <T>Anyone can publish a small, casual job (moving furniture, sanding, basic plumbing) and quote an instant price offer in South African Rand (R).</T>
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-gray-100/80 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-600 text-white font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0">2</span>
                  <h5 className="font-extrabold text-xs text-slate-900"><T>Apply Instantly</T></h5>
                </div>
                <p className="text-[11px] font-bold text-gray-550 leading-relaxed">
                  <T>Notice a task you can handle?</T> <T>Tap</T> <strong className="text-green-600">"<T>I Can Do This</T>"</strong> <T>to initiate your application seamlessly.</T>
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-gray-100/80 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-600 text-white font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0">3</span>
                  <div className="flex items-center gap-1">
                    <Shield size={12} className="text-indigo-600" />
                    <h5 className="font-extrabold text-xs text-slate-900"><T>Face Scan Check</T></h5>
                  </div>
                </div>
                <p className="text-[11px] font-bold text-gray-550 leading-relaxed">
                  <T>For safety, applicants complete a live face-angle verification (Turn Left & Turn Right) to verify your real identity and build trust.</T>
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-gray-100/80 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-600 text-white font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0">4</span>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={12} className="text-indigo-600" />
                    <h5 className="font-extrabold text-xs text-slate-900"><T>Chat & Work</T></h5>
                  </div>
                </div>
                <p className="text-[11px] font-bold text-gray-550 leading-relaxed">
                  <T>Once details are shared, connected pairs unlock a direct messaging line in the</T> <strong className="text-green-600"><T>Inbox</T></strong> <T>to align, complete the task, and earn!</T>
                </p>
              </div>

            </div>

            <div className="bg-amber-50/80 border border-amber-150 p-3.5 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-900 font-semibold leading-relaxed">
              <Sparkles size={14} className="text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong><T>System Feature Tip:</T></strong> <T>Any job photos uploaded when publishing a Gig are automatically safely saved to the central</T> <strong><T>Media Portals & Gallery</T></strong>! <T>Give it a try.</T>
              </span>
            </div>
          </div>
        )}
      </div>
      )}

      {successNotification && (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 flex gap-3 items-start relative shadow-xs animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-emerald-600 text-white p-1 rounded-full shrink-0 flex items-center justify-center mt-0.5">
            <CheckCircle size={16} className="text-white" />
          </div>
          <div className="flex-grow pr-8">
            <h4 className="font-black text-emerald-900 text-sm"><T>Gig Posted Successfully!</T></h4>
            <p className="text-xs text-emerald-700 font-bold mt-0.5 leading-relaxed">
              <T>{successNotification}</T>
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setSuccessNotification(null)}
            className="absolute top-3.5 right-3.5 text-emerald-500 hover:text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-full p-1 transition-colors"
            title="Dismiss success message"
          >
            <X size={14} className="stroke-[3]" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl p-4 border border-gray-150 shadow-xs mb-4">
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t("Search for odd jobs, tasks, or area...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-green-500 transition-colors bg-gray-50 font-medium"
            style={{ color: "#090f1d" }}
          />
        </div>
        
        {/* Distance Range Slider */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-xs font-bold text-gray-700 whitespace-nowrap">
            <T>Max Distance:</T> <span className="text-green-600 ml-1">{maxDistance} <T>miles</T></span>
          </label>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={maxDistance} 
            onChange={(e) => setMaxDistance(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
        </div>
      </div>

      {filteredGigs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8 space-y-4 shadow-xs">
          <ClipboardList className="mx-auto text-gray-300" size={48} />
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-gray-800"><T>No active local gigs found</T></h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              <T>Be the first to post a handyman repair, furniture moving, or tech support gig in your area to find local workers.</T>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center pt-2">
            <button
              onClick={() => setShowCreateGig(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
            >
              <PlusCircle size={14} />
              <T>Post Your First Gig</T>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredGigs.map((gig) => (
            <div 
              key={gig.id} 
              onClick={() => handleApplyStart(gig)}
              className="bg-white rounded-xl overflow-hidden border border-gray-150 shadow-xs flex flex-col hover:shadow-md hover:border-green-500/30 transition-all duration-300 cursor-pointer group"
            >
              {/* Square Image container like Facebook Marketplace */}
              <div className="aspect-square w-full bg-gray-200 relative overflow-hidden group-hover:shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                <img 
                  src={gig.imageUrl} 
                  alt={gig.title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
                  <div className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm border border-white/10">
                    <T>{gig.postedDate}</T>
                  </div>
                  {gig.distance && (
                    <div className="bg-green-600/90 backdrop-blur-xs text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm border border-white/10 animate-pulse flex items-center gap-0.5 w-fit">
                      <MapPin size={8} /> {gig.distance}m
                    </div>
                  )}
                </div>
                {isGuest && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div className="bg-black/30 backdrop-blur-md p-2.5 rounded-full border border-white/20">
                      <Lock size={20} className="text-white" />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Product Information under image */}
              <div className="p-2.5 flex flex-col flex-grow justify-between gap-1.5">
                <div>
                  {/* Price first, highly prominent */}
                  <span className="block font-black text-slate-950 text-sm sm:text-base leading-none">
                    <T>{gig.price}</T>
                  </span>
                  
                  {/* Title under the price */}
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-1 leading-snug mt-1 group-hover:text-green-600 transition-colors" title={gig.title}>
                    <T>{gig.title}</T>
                  </h4>
                  
                  {/* Mini-details and Location */}
                  <div className="flex flex-col gap-0.5 mt-1 text-[10px] text-gray-400 font-bold">
                    <span className="truncate">By <T>{gig.creatorName}</T></span>
                    <div className="flex items-center gap-0.5 text-gray-450 truncate">
                      <MapPin size={10} className="text-gray-400 shrink-0" />
                      <span className="truncate"><T>{gig.location}</T></span>
                    </div>
                  </div>
                </div>

                {/* Compact button exactly for dummies */}
                {isGuest ? (
                  <div className="mt-1 p-1.5 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-1.5 text-gray-400">
                    <Lock size={12} />
                    <span className="text-[10px] font-bold"><T>Gig Locked</T></span>
                  </div>
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleApplyStart(gig); }}
                    className="w-full bg-gray-900 group-hover:bg-green-600 text-white font-extrabold py-1.5 rounded-lg text-xs transition-colors shadow-xs cursor-pointer active:scale-95 shrink-0 mt-1"
                  >
                    <T>I Can Do This</T>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Gig Modal */}
      {showCreateGig && (() => {
        let previewPrice = newGig.price.trim() || 'R0.00';
        if (newGig.price.trim() && !previewPrice.startsWith('R')) {
          previewPrice = `R ${previewPrice}`;
        }
        return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 p-3 md:p-4 backdrop-blur-xs flex justify-center items-start md:items-center">
            <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative my-4 md:my-0 border border-gray-150 animate-in fade-in slide-in-from-bottom-4 duration-200">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                  <h3 className="font-bold text-lg text-slate-900"><T>Post a New Gig</T></h3>
                </div>
                <button onClick={() => setShowCreateGig(false)} className="bg-gray-200 hover:bg-gray-300 rounded-full p-1.5 transition-colors cursor-pointer text-gray-700 shadow-xs"><X size={18}/></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-150">
                
                {/* Form Inputs */}
                <form onSubmit={handleCreateGig} className="p-5 space-y-4 md:col-span-7 col-span-12">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1"><T>Gig Title</T></label>
                    <input 
                      required 
                      type="text" 
                      value={newGig.title} 
                      onChange={e => setNewGig({...newGig, title: e.target.value})} 
                      className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-semibold" 
                      placeholder={t("e.g., Help moving boxes")}
                      style={{ color: "#090f1d", backgroundColor: "#ffffff" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1"><T>Description</T></label>
                    <textarea 
                      required 
                      rows={3} 
                      value={newGig.description} 
                      onChange={e => setNewGig({...newGig, description: e.target.value})} 
                      className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-semibold" 
                      placeholder={t("Describe the task...")}
                      style={{ color: "#090f1d", backgroundColor: "#ffffff" }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1"><T>Price Offer (Rand)</T></label>
                      <input 
                        required 
                        type="text" 
                        value={newGig.price} 
                        onChange={e => setNewGig({...newGig, price: e.target.value})} 
                        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-semibold" 
                        placeholder={t("e.g. R450")}
                        style={{ color: "#090f1d", backgroundColor: "#ffffff" }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1"><T>Location</T></label>
                      <input 
                        required 
                        type="text" 
                        value={newGig.location} 
                        onChange={e => setNewGig({...newGig, location: e.target.value})} 
                        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-semibold" 
                        placeholder={t("City or Area")}
                        style={{ color: "#090f1d", backgroundColor: "#ffffff" }}
                      />
                    </div>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-gray-600 block mb-1"><T>Upload Photo from Device</T></label>
                     <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors flex flex-col items-center justify-center relative group min-h-[120px]">
                       {newGig.imageUrl && !newGig.imageUrl.startsWith('https://images.unsplash.com') ? (
                         <div className="relative w-full h-24 rounded-lg overflow-hidden">
                           <img src={newGig.imageUrl} alt="Uploaded gig" className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-xs text-white font-semibold"><T>Change Photo</T></span>
                           </div>
                         </div>
                       ) : (
                         <>
                           <Camera className="mx-auto text-gray-400 mb-2 group-hover:text-green-600 transition-colors" size={24} />
                           <span className="text-xs font-semibold text-gray-500"><T>Tap to select device picture</T></span>
                           <span className="text-[10px] text-gray-400 mt-0.5"><T>Supports PNG, JPG, WEBP</T></span>
                         </>
                       )}
                       <input 
                         type="file" 
                         accept="image/*" 
                         className="hidden" 
                         onChange={handleGigImageUpload} 
                       />
                     </label>
                  </div>
                  <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors cursor-pointer shadow-md"><T>Save & Publish Gig</T></button>
                </form>

                {/* Always-Visible Live Preview Column */}
                <div className="md:col-span-5 col-span-12 bg-gray-50/70 p-5 flex flex-col justify-center items-center gap-4 transition-all select-none">
                  <div className="w-full text-center">
                    <span className="text-[10px] font-black tracking-wider uppercase text-green-700 bg-green-50 border border-green-100/60 px-2.5 py-1 rounded-full"><T>Live Card Preview</T></span>
                  </div>
                  
                  {/* The Gig card box itself */}
                  <div className="w-48 bg-white rounded-xl overflow-hidden border border-gray-150 shadow-md flex flex-col hover:shadow-lg transition-all duration-300 select-none">
                    <div className="aspect-square w-full bg-gray-200 relative overflow-hidden">
                      <img 
                        src={newGig.imageUrl} 
                        alt="Preview cover" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                      />
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                        <T>Just now</T>
                      </div>
                    </div>
                    
                    <div className="p-2.5 flex flex-col flex-grow justify-between gap-1.5">
                      <div>
                        {/* Price */}
                        <span className="block font-black text-slate-950 text-sm leading-none">
                          <T>{previewPrice}</T>
                        </span>
                        
                        {/* Title */}
                        <h4 className="text-xs font-semibold text-gray-805 line-clamp-1 leading-snug mt-1 text-left" title={newGig.title || 'Untitled Gig'}>
                          <T>{newGig.title || 'Untitled Gig'}</T>
                        </h4>

                        {/* Description */}
                        <p className="text-[10px] text-gray-550 line-clamp-2 mt-1 leading-normal text-left break-words bg-gray-50 p-1.5 rounded-lg border border-gray-150 font-medium" title={newGig.description || 'Task details...'}>
                          <T>{newGig.description || 'Task details will show here...'}</T>
                        </p>
                        
                        {/* Mini-details and Location */}
                        <div className="flex flex-col gap-0.5 mt-1 text-[9px] text-gray-400 font-bold text-left">
                          <span className="truncate">By Lucihano Matthews</span>
                          <div className="flex items-center gap-0.5 text-gray-450 truncate">
                            <MapPin size={9} className="text-gray-400 shrink-0" />
                            <span className="truncate"><T>{newGig.location || 'City or Area'}</T></span>
                          </div>
                        </div>
                      </div>

                      {/* Button mockup */}
                      <button 
                        type="button" 
                        className="w-full bg-gray-900 text-white font-extrabold py-1.5 rounded-lg text-[10px] transition-colors shrink-0 mt-1 cursor-not-allowed opacity-80"
                        disabled
                      >
                        <T>I Can Do This</T>
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-gray-450 font-bold text-center">
                    <T>This preview box automatically updates in real-time as you type!</T>
                  </p>
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* Apply to Gig Modal */}
      {selectedGig && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex flex-col justify-end md:items-center md:justify-center md:p-4 backdrop-blur-sm">
          <div className={`bg-white rounded-t-3xl md:rounded-3xl w-full transition-all duration-300 overflow-hidden p-6 relative pb-10 md:pb-6 ${
            applyStep === 'details' ? 'max-w-md md:max-w-lg' : 'max-w-sm'
          }`}>
            {applyStep !== 'success' && (
              <button onClick={() => setSelectedGig(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-650 bg-gray-100/80 hover:bg-gray-200 transition-colors rounded-full p-1.5 z-10 cursor-pointer"><X size={20}/></button>
            )}

            {applyStep === 'capture' && showCameraFor && (
              <CameraCapture 
                label={showCameraFor === 'left' ? 'Turn Left' : 'Turn Right'}
                onClose={() => setShowCameraFor(null)}
                onCapture={(photo) => {
                  if (showCameraFor === 'left') setPhotoLeft(photo);
                  else setPhotoRight(photo);
                  setShowCameraFor(null);
                }}
              />
            )}

            {applyStep === 'details' && (
              <div className="space-y-4 text-left animate-in fade-in duration-200">
                {/* Header title */}
                <div className="border-b pb-3 mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-600 bg-green-50 border border-green-150 px-2.5 py-1 rounded-md">
                    <T>Local Gig Opportunities</T>
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-2 leading-snug"><T>{selectedGig.title}</T></h3>
                </div>

                {/* Cover Photo */}
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-150 border border-gray-150 relative">
                  <img
                    src={selectedGig.imageUrl}
                    alt={selectedGig.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-xs font-black px-3 py-1.5 rounded-lg border border-white/20">
                    <T>{selectedGig.price}</T>
                  </div>
                </div>

                {/* Info row */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-50 border border-gray-150 p-2.5 rounded-xl flex items-center gap-2">
                    <MapPin size={16} className="text-green-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider"><T>Location</T></span>
                      <span className="font-extrabold text-slate-800 block truncate"><T>{selectedGig.location}</T></span>
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-150 p-2.5 rounded-xl flex items-center gap-2">
                    <Shield size={16} className="text-indigo-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider"><T>Posted Date</T></span>
                      <span className="font-extrabold text-slate-800 block truncate"><T>{selectedGig.postedDate}</T></span>
                    </div>
                  </div>
                </div>

                {/* Description Segment */}
                <div className="space-y-1.5 bg-gray-50/50 p-3 rounded-xl border border-gray-150/60">
                  <span className="text-[10px] font-black text-gray-450 uppercase tracking-widest block"><T>Description</T></span>
                  <p className="text-sm text-gray-700 font-semibold leading-relaxed break-words whitespace-pre-line max-h-40 overflow-y-auto pr-1">
                    <T>{selectedGig.description}</T>
                  </p>
                </div>

                {/* Poster info */}
                <div className="flex items-center justify-between border-t border-b py-3 text-xs text-gray-500 font-bold bg-gray-50/20 px-1 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-600 to-emerald-500 text-white flex items-center justify-center font-black uppercase shadow-xs shrink-0">
                      {selectedGig.creatorName.charAt(0)}
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase font-black"><T>Posted By</T></span>
                      <span className="font-bold text-slate-800 text-sm"><T>{selectedGig.creatorName}</T></span>
                    </div>
                  </div>

                  <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded-full shrink-0"><T>Verified Issuer</T></span>
                </div>

                {/* Trust and Safety callout */}
                <p className="text-[10px] text-gray-400 leading-snug font-semibold">
                  💡 <T>Note: To secure contracts and build community trust, applying for this gig requires quick identity verification steps (live Left-face and Right-face photo capture).</T>
                </p>

                {/* Bottom prompt action */}
                <div className="flex gap-2.5 pt-2">
                  <button 
                    type="button"
                    onClick={() => setSelectedGig(null)} 
                    className="flex-1 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 text-gray-800 transition-colors font-extrabold py-3 rounded-xl text-center text-sm cursor-pointer border border-gray-200"
                  >
                    <T>Cancel</T>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setApplyStep('info')} 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-all hover:shadow-md font-extrabold py-3 rounded-xl text-center text-sm cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span><T>I Can Do This</T></span>
                    <Sparkles size={14} className="animate-pulse" />
                  </button>
                </div>
              </div>
            )}

            {applyStep === 'info' && (
              <div className="space-y-5 text-center mt-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex flex-col items-center justify-center mx-auto text-green-600 mb-2">
                  <Info size={32} />
                </div>
                <h3 className="text-xl font-bold"><T>Identity Verification</T></h3>
                <p className="text-sm text-gray-600 text-justify">
                  <T>To maintain trust on TimeGig, we need your permission to share your profile details with</T> <strong><T>{selectedGig.creatorName}</T></strong>. 
                  <T>You will also need to capture two live pictures (Turn Left & Turn Right) for identity verification.</T>
                </p>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setApplyStep('details')} className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-xl"><T>Back to Gig</T></button>
                  <button onClick={() => setApplyStep('capture')} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl"><T>Agree & Continue</T></button>
                </div>
              </div>
            )}

            {applyStep === 'capture' && (
              <div className="space-y-6 text-center mt-2">
                <h3 className="text-lg font-bold"><T>Face Verification</T></h3>
                <p className="text-xs text-gray-500"><T>Follow the prompts to capture your face.</T></p>
                
                <div className="flex justify-center gap-4 py-4">
                  <div className={`w-32 h-40 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${photoLeft ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-gray-300 text-gray-400 hover:border-green-500'}`} onClick={() => setShowCameraFor('left')}>
                    {photoLeft ? <img src={photoLeft} className="w-full h-full object-cover rounded-xl" alt="Left" /> : <Camera size={24} />}
                    {!photoLeft && <span className="text-xs font-bold mt-2"><T>Turn Left</T></span>}
                  </div>
                  <div className={`w-32 h-40 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${photoRight ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-gray-300 text-gray-400 hover:border-green-500'}`} onClick={() => setShowCameraFor('right')}>
                    {photoRight ? <img src={photoRight} className="w-full h-full object-cover rounded-xl" alt="Right" /> : <Camera size={24} />}
                    {!photoRight && <span className="text-xs font-bold mt-2"><T>Turn Right</T></span>}
                  </div>
                </div>

                <button 
                  onClick={submitApplication}
                  disabled={!photoLeft || !photoRight}
                  className={`w-full font-bold py-3.5 rounded-xl transition-all ${photoLeft && photoRight ? 'bg-green-600 text-white cursor-pointer hover:bg-green-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                  <T>Apply Now</T>
                </button>
              </div>
            )}

            {applyStep === 'success' && (
              <div className="space-y-5 text-center mt-4">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex flex-col items-center justify-center mx-auto text-emerald-600 mb-2">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold"><T>Congratulations!</T></h3>
                <p className="text-sm text-gray-600"><T>Your application has been sent securely. You can chat with the creator if they accept!</T></p>
                <button 
                  onClick={() => setSelectedGig(null)} 
                  className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl mt-4 cursor-pointer hover:bg-green-700"
                >
                  <T>Back to Gigs</T>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Guest Mode Prompt Overlay */}
      {showGuestPrompt && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2"><T>Registration Required</T></h3>
            <p className="text-gray-600 text-sm mb-6">
              <T>You must register to interact with Gigs (create or apply).</T>
            </p>
            <div className="space-y-3">
               <button 
                 onClick={() => {
                   setShowGuestPrompt(false);
                   if (onSignUp) onSignUp();
                 }}
                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all"
               >
                 <T>Register Now</T>
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
