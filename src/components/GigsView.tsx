import React, { useState } from 'react';
import { Search as SearchIcon, MapPin, Camera, CheckCircle, PlusCircle, X, Info, ClipboardList } from 'lucide-react';
import { Gig, GalleryItem } from '../types';

interface GigsViewProps {
  gigs: Gig[];
  onAddGig: (gig: Gig) => void;
  onAddMediaToGallery: (item: GalleryItem) => void;
  onLoadSamples?: () => void;
}

export function GigsView({ gigs, onAddGig, onAddMediaToGallery, onLoadSamples }: GigsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create Gig State
  const [showCreateGig, setShowCreateGig] = useState(false);
  const [newGig, setNewGig] = useState({ title: '', description: '', price: '', location: '', imageUrl: 'https://images.unsplash.com/photo-1598520106830-8c45c2035420?w=400&q=80' });
  const [successNotification, setSuccessNotification] = useState<string | null>(null);

  // Apply State
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [applyStep, setApplyStep] = useState<'info' | 'capture' | 'success'>('info');
  const [capturedLeft, setCapturedLeft] = useState(false);
  const [capturedRight, setCapturedRight] = useState(false);

  const filteredGigs = gigs.filter(gig => 
    gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gig.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gig.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    setSelectedGig(gig);
    setApplyStep('info');
    setCapturedLeft(false);
    setCapturedRight(false);
  };

  const submitApplication = () => {
    // In a real app we would send the image data to backend
    setApplyStep('success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Community Gigs</h3>
          <p className="text-sm text-gray-500 mt-1">Short-term tasks and casual jobs around you.</p>
        </div>
        <button 
          onClick={() => setShowCreateGig(true)}
          className="bg-green-600 text-white hover:bg-green-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
        >
          <PlusCircle size={18} />
          Create a Gig
        </button>
      </div>

      {successNotification && (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 flex gap-3 items-start relative shadow-xs animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-emerald-600 text-white p-1 rounded-full shrink-0 flex items-center justify-center mt-0.5">
            <CheckCircle size={16} className="text-white" />
          </div>
          <div className="flex-grow pr-8">
            <h4 className="font-black text-emerald-900 text-sm">Gig Posted Successfully!</h4>
            <p className="text-xs text-emerald-700 font-bold mt-0.5 leading-relaxed">
              {successNotification}
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

      <div className="relative">
        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search for odd jobs, tasks, or area..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white text-gray-900 pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-500 transition-colors shadow-xs"
        />
      </div>

      {filteredGigs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8 space-y-4 shadow-xs">
          <ClipboardList className="mx-auto text-gray-300" size={48} />
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-gray-800">No active local gigs found</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              Be the first to post a handyman repair, furniture moving, or tech support gig in your area, or seed the workspace with sample Rand gigs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center pt-2">
            <button
              onClick={() => setShowCreateGig(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
            >
              <PlusCircle size={14} />
              Post Your First Gig
            </button>
            {onLoadSamples && (
              <button
                onClick={onLoadSamples}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all border border-gray-200"
              >
                Load Sample Mzanzi Gigs
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGigs.map((gig) => (
            <div key={gig.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs flex flex-col hover:shadow-md transition-all duration-300">
              <div className="h-48 w-full bg-gray-200 relative">
                <img src={gig.imageUrl} alt={gig.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-900 text-xs font-bold px-2 py-1 rounded-md">
                  {gig.postedDate}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-gray-900 line-clamp-1">{gig.title}</h4>
                  <span className="font-extrabold text-emerald-600 shrink-0 ml-2">{gig.price}</span>
                </div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Posted by {gig.creatorName}</p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">{gig.description}</p>
                
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                    <MapPin size={14} /> {gig.location}
                  </div>
                  <button 
                    onClick={() => handleApplyStart(gig)}
                    className="bg-gray-900 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                  >
                    I Can Do This
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Gig Modal */}
      {showCreateGig && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Post a New Gig</h3>
              <button onClick={() => setShowCreateGig(false)} className="bg-gray-200 rounded-full p-1"><X size={18}/></button>
            </div>
            <form onSubmit={handleCreateGig} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Gig Title</label>
                <input required type="text" value={newGig.title} onChange={e => setNewGig({...newGig, title: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500" placeholder="e.g., Help moving boxes" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Description</label>
                <textarea required rows={3} value={newGig.description} onChange={e => setNewGig({...newGig, description: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500" placeholder="Describe the task..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Price Offer (Rand)</label>
                  <input required type="text" value={newGig.price} onChange={e => setNewGig({...newGig, price: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500" placeholder="e.g. R450" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Location</label>
                  <input required type="text" value={newGig.location} onChange={e => setNewGig({...newGig, location: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500" placeholder="City or Area" />
                </div>
              </div>
              <div>
                 <label className="text-xs font-bold text-gray-600 block mb-1">Upload Photo from Device</label>
                 <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors flex flex-col items-center justify-center relative group min-h-[120px]">
                   {newGig.imageUrl && !newGig.imageUrl.startsWith('https://images.unsplash.com') ? (
                     <div className="relative w-full h-24 rounded-lg overflow-hidden">
                       <img src={newGig.imageUrl} alt="Uploaded gig" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-xs text-white font-semibold">Change Photo</span>
                       </div>
                     </div>
                   ) : (
                     <>
                       <Camera className="mx-auto text-gray-400 mb-2 group-hover:text-green-600 transition-colors" size={24} />
                       <span className="text-xs font-semibold text-gray-500">Tap to select device picture</span>
                       <span className="text-[10px] text-gray-400 mt-0.5">Supports PNG, JPG, WEBP</span>
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
              <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-xl mt-2 hover:bg-green-700">Save & Publish Gig</button>
            </form>
          </div>
        </div>
      )}

      {/* Apply to Gig Modal */}
      {selectedGig && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex flex-col justify-end md:items-center md:justify-center md:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-sm overflow-hidden p-6 relative pb-10 md:pb-6">
            {applyStep !== 'success' && (
              <button onClick={() => setSelectedGig(null)} className="absolute top-4 right-4 text-gray-400 bg-gray-100 rounded-full p-1.5"><X size={20}/></button>
            )}

            {applyStep === 'info' && (
              <div className="space-y-5 text-center mt-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex flex-col items-center justify-center mx-auto text-green-600 mb-2">
                  <Info size={32} />
                </div>
                <h3 className="text-xl font-bold">Identity Verification</h3>
                <p className="text-sm text-gray-600 text-justify">
                  To maintain trust on TimeGig, we need your permission to share your profile details with <strong>{selectedGig.creatorName}</strong>. 
                  You will also need to capture two live pictures (Turn Left & Turn Right) for identity verification.
                </p>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setSelectedGig(null)} className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-xl">Cancel</button>
                  <button onClick={() => setApplyStep('capture')} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl">Agree & Continue</button>
                </div>
              </div>
            )}

            {applyStep === 'capture' && (
              <div className="space-y-6 text-center mt-2">
                <h3 className="text-lg font-bold">Face Verification</h3>
                <p className="text-xs text-gray-500">Follow the prompts to capture your face.</p>
                
                <div className="flex justify-center gap-4 py-4">
                  <div className={`w-32 h-40 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${capturedLeft ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-gray-300 text-gray-400 hover:border-green-500'}`} onClick={() => setCapturedLeft(true)}>
                    {capturedLeft ? <CheckCircle size={32} /> : <Camera size={24} />}
                    <span className="text-xs font-bold mt-2">{capturedLeft ? 'Captured!' : 'Turn Left'}</span>
                  </div>
                  <div className={`w-32 h-40 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${capturedRight ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-gray-300 text-gray-400 hover:border-green-500'}`} onClick={() => setCapturedRight(true)}>
                    {capturedRight ? <CheckCircle size={32} /> : <Camera size={24} />}
                     <span className="text-xs font-bold mt-2">{capturedRight ? 'Captured!' : 'Turn Right'}</span>
                  </div>
                </div>

                <button 
                  onClick={submitApplication}
                  disabled={!capturedLeft || !capturedRight}
                  className={`w-full font-bold py-3.5 rounded-xl transition-all ${capturedLeft && capturedRight ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'}`}
                >
                  Apply Now
                </button>
              </div>
            )}

            {applyStep === 'success' && (
              <div className="space-y-5 text-center mt-4">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex flex-col items-center justify-center mx-auto text-emerald-600 mb-2">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold">Congratulations!</h3>
                <p className="text-sm text-gray-600">Your application has been sent securely. You can chat with the creator if they accept!</p>
                <button 
                  onClick={() => setSelectedGig(null)} 
                  className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl mt-4"
                >
                  Back to Gigs
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
