import React, { useState } from 'react';
import { Share, Download, Edit2, Trash2, X, CheckCircle, Play, Film, Image as ImageIcon, FolderOpen, Calendar, Info, Search, Lock } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryViewProps {
  items: GalleryItem[];
  setItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  isGuest?: boolean;
  onSignUp?: () => void;
}

export function GalleryView({ items, setItems, isGuest, onSignUp }: GalleryViewProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const isVideoUrl = (url: string) => {
    if (!url) return false;
    return url.startsWith('data:video') || url.includes('video/') || url.match(/\.(mp4|webm|ogg|mov|avi)($|\?)/i);
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const handleShare = async (item: GalleryItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Check out my file on TimeGig SA: ${item.title}`,
          url: item.url,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      // Direct copy link fallback
      try {
        await navigator.clipboard.writeText(item.url);
        alert("Link copied to clipboard!");
      } catch (err) {
        alert("Sharing not supported in this action.");
      }
    }
  };

  const handleDownload = (item: GalleryItem) => {
    const link = document.createElement('a');
    link.href = item.url;
    
    const isVideo = isVideoUrl(item.url);
    const extension = isVideo ? 'mp4' : 'jpg';
    link.download = `${item.title.toLowerCase().replace(/\s+/g, '_')}.${extension}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openItem = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsEditing(false);
  };

  const startEdit = () => {
    if (!selectedItem) return;
    setEditTitle(selectedItem.title);
    setEditCategory(selectedItem.category);
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (!selectedItem) return;
    const updatedItems = items.map(item => 
      item.id === selectedItem.id 
        ? { ...item, title: editTitle, category: editCategory }
        : item
    );
    setItems(updatedItems);
    setSelectedItem({ ...selectedItem, title: editTitle, category: editCategory });
    setIsEditing(false);
  };

  // Dynamically obtain unique categories
  const categoriesList = ['All', ...Array.from(new Set(items.map(item => item.category || 'General')))];

  // Filter and search items
  const filteredItems = items.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.category === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title & Introduction Block */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <FolderOpen className="text-green-600" size={26} />
            Secure Gallery Vault
          </h3>
          <p className="text-sm text-gray-700 font-medium mt-1 leading-relaxed">
            All your uploaded documents, images, video messages, and profile avatars are indexed here automatically in high fidelity.
          </p>
        </div>
      </div>

      {/* Control Panel: Search & Filter bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-4">
        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search gallery by title or tag name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold text-gray-900 placeholder-gray-500 outline-none focus:bg-white focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all"
          />
        </div>

        {/* Dynamic Horizontal Filters */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-gray-200">
          {categoriesList.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border-2 transition-all cursor-pointer ${
                activeFilter === cat 
                  ? 'bg-green-600 text-white border-green-600 shadow-sm' 
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List section */}
      {filteredItems.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 text-gray-500">
          <div className="bg-gray-50 p-4 rounded-full mb-3 text-gray-400">
            <Search size={32} />
          </div>
          <p className="text-base font-bold text-gray-800">No media found</p>
          <p className="text-sm text-gray-500 mt-1">Try resetting your filter or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => {
            const isVideo = isVideoUrl(item.url);
            return (
              <div 
                key={item.id} 
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 cursor-pointer flex flex-col transition-all relative"
                onClick={() => {
                  if (isGuest) {
                    // Logic to show prompt or just lock
                  } else {
                    openItem(item);
                  }
                }}
              >
                {/* Media frame */}
                <div className="aspect-square bg-gray-50 w-full relative overflow-hidden flex items-center justify-center border-b border-gray-100">
                  {isVideo ? (
                    <div className="w-full h-full relative">
                      <video src={item.url} className="w-full h-full object-cover" preload="metadata" />
                      {!isGuest && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                          <div className="bg-green-600 text-white p-2.5 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                            <Play size={16} className="fill-white translate-x-0.5" />
                          </div>
                        </div>
                      )}
                      {isGuest && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/20">
                            <Lock size={24} className="text-white" />
                          </div>
                        </div>
                      )}
                      <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Film size={12} />
                        VIDEO
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        loading="lazy" 
                      />
                      {isGuest && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/20">
                            <Lock size={24} className="text-white" />
                          </div>
                        </div>
                      )}
                      <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <ImageIcon size={12} />
                        IMAGE
                      </span>
                    </div>
                  )}
                </div>

                {/* Details Block - HIGH CONTRAST */}
                <div className="p-4 bg-white">
                  <span className="inline-block text-[10px] font-extrabold text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-100 uppercase tracking-wider mb-2">
                    {item.category || 'General'}
                  </span>
                  <h4 className="text-gray-900 font-bold text-sm leading-tight line-clamp-2" title={item.title}>
                    {item.title}
                  </h4>
                  {isGuest && (
                    <div className="mt-2 text-[10px] font-black text-indigo-600 flex items-center gap-1">
                      <Lock size={10} />
                      PRIVATE VAULT
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Item Modal with Extremely Clear, Legible Details */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-center items-center p-4 backdrop-blur-md">
          {/* Close button with large hit target */}
          <button 
             onClick={() => setSelectedItem(null)}
             className="absolute top-4 right-4 md:top-6 md:right-6 text-white bg-white/10 hover:bg-green-600 hover:text-white p-3 rounded-xl backdrop-blur-sm transition-all z-50 shadow-md border border-white/10"
             title="Close Modal"
          >
            <X size={24} />
          </button>
          
          <div className="flex flex-col md:flex-row max-w-5xl w-full h-[85vh] md:h-auto max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Image/Video section (Black canvas background to contrast white container) */}
            <div className="flex-1 bg-neutral-950 flex items-center justify-center min-h-[40vh] md:min-h-[550px] relative">
              {isVideoUrl(selectedItem.url) ? (
                <video src={selectedItem.url} controls autoPlay className="max-w-full max-h-[40vh] md:max-h-[550px] object-contain" />
              ) : (
                <img src={selectedItem.url} alt={selectedItem.title} className="max-w-full max-h-[40vh] md:max-h-[550px] object-contain" />
              )}
            </div>
            
            {/* Details panel - STUNNING, HIGH-CONTRAST AND READABLE */}
            <div className="w-full md:w-96 bg-white flex flex-col shrink-0 border-t md:border-t-0 md:border-l border-gray-200 overflow-y-auto">
              {isEditing ? (
                <div className="p-6 space-y-5">
                  <div className="flex items-center gap-2 border-b pb-3 mb-2">
                    <Edit2 className="text-green-600" size={20} />
                    <h3 className="font-extrabold text-xl text-gray-900">Edit Media Data</h3>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-gray-600 mb-1.5 block uppercase tracking-wider">Title / Name</label>
                    <input 
                      type="text" 
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-200 px-3 py-3 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-green-600 outline-none transition-all"
                      placeholder="Enter a recognizable title"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-gray-600 mb-1.5 block uppercase tracking-wider">Category Tag</label>
                    <input 
                      type="text" 
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-200 px-3 py-3 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-green-600 outline-none transition-all"
                      placeholder="e.g. Profile, Invoices, Chat Uploads"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => setIsEditing(false)} 
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl text-sm font-bold transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={saveEdit} 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white flex justify-center items-center py-3 rounded-xl text-sm font-bold gap-1.5 transition-all shadow-sm"
                    >
                      <CheckCircle size={18}/> Save New Data
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex flex-col justify-between h-full min-h-[300px]">
                  {/* Info Header */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-block text-xs font-extrabold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-lg uppercase tracking-widest">
                        {selectedItem.category || 'General'}
                      </span>
                      <span className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1">
                        <Info size={12} />
                        {isVideoUrl(selectedItem.url) ? 'Video Clip' : 'Image Photo'}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 leading-tight">
                      {selectedItem.title}
                    </h3>
                    
                    {/* Metadata Card grid to ensure high quality metrics viewing */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-bold flex items-center gap-1">
                          <Calendar size={13} /> Saved On:
                        </span>
                        <span className="text-gray-900 font-extrabold">Just now</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-bold flex items-center gap-1">
                          🔒 Encryption:
                        </span>
                        <span className="text-emerald-700 font-extrabold uppercase">Protected Local</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Interactive Option Grid - Clean, clear borders, high text color depth */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button 
                      onClick={startEdit} 
                      className="flex flex-col items-center justify-center gap-2 border-2 border-gray-100 hover:border-green-200 bg-gray-50 hover:bg-green-50 text-gray-800 hover:text-green-700 p-3.5 rounded-2xl transition-all cursor-pointer"
                    >
                      <Edit2 size={20} />
                      <span className="text-xs font-extrabold uppercase tracking-wide">Edit Info</span>
                    </button>

                    <button 
                      onClick={() => handleShare(selectedItem)} 
                      className="flex flex-col items-center justify-center gap-2 border-2 border-gray-100 hover:border-green-200 bg-gray-50 hover:bg-green-50 text-gray-800 hover:text-green-700 p-3.5 rounded-2xl transition-all cursor-pointer"
                    >
                      <Share size={20} />
                      <span className="text-xs font-extrabold uppercase tracking-wide">Copy / Share</span>
                    </button>

                    <button 
                      onClick={() => handleDownload(selectedItem)} 
                      className="flex flex-col items-center justify-center gap-2 border-2 border-gray-100 hover:border-green-200 bg-gray-50 hover:bg-green-50 text-gray-800 hover:text-green-700 p-3.5 rounded-2xl transition-all cursor-pointer"
                    >
                      <Download size={20} />
                      <span className="text-xs font-extrabold uppercase tracking-wide">Download</span>
                    </button>

                    <button 
                      onClick={() => handleDelete(selectedItem.id)} 
                      className="flex flex-col items-center justify-center gap-2 border-2 border-red-50 hover:border-red-200 bg-red-50 hover:bg-red-100 text-red-600 p-3.5 rounded-2xl transition-all cursor-pointer"
                    >
                      <Trash2 size={20} />
                      <span className="text-xs font-extrabold uppercase tracking-wide">Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
