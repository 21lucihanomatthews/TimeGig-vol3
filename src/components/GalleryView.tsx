import React, { useState } from 'react';
import { Share, Download, Edit2, Trash2, X, PlusCircle, CheckCircle } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryViewProps {
  items: GalleryItem[];
  setItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
}

export function GalleryView({ items, setItems }: GalleryViewProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');

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
          text: `Check out my upload on TimeGig: ${item.title}`,
          url: item.url,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  const handleDownload = (item: GalleryItem) => {
    // In a real app we would trigger a download. 
    // Here we'll simulate by opening in a new tab or creating an anchor.
    const link = document.createElement('a');
    link.href = item.url;
    link.download = `${item.title.replace(/\s+/g, '_')}.jpg`;
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Your Gallery</h3>
          <p className="text-sm text-gray-500 mt-1">Manage and view all your uploaded photos.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100 text-gray-500">
          <p>No images uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div 
              key={item.id} 
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm cursor-pointer flex flex-col"
              onClick={() => openItem(item)}
            >
              <div className="aspect-square bg-gray-100 w-full relative overflow-hidden">
                {item.url.startsWith('data:video') ? (
                  <video src={item.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
              </div>
              <div className="p-3">
                <h4 className="text-gray-900 font-bold text-sm truncate">{item.title}</h4>
                <p className="text-gray-500 text-xs mt-0.5">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-center items-center p-4 backdrop-blur-md">
          <button 
             onClick={() => setSelectedItem(null)}
             className="absolute top-4 right-4 md:top-8 md:right-8 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur transition-colors z-50"
          >
            <X size={24} />
          </button>
          
          <div className="flex flex-col md:flex-row max-w-5xl w-full h-[80vh] md:h-auto max-h-[90vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl relative">
            {/* Image/Video Section */}
            <div className="flex-1 bg-black flex items-center justify-center min-h-[40vh] md:min-h-[60vh] relative">
              {selectedItem.url.startsWith('data:video') ? (
                <video src={selectedItem.url} controls className="max-w-full max-h-full object-contain" />
              ) : (
                <img src={selectedItem.url} alt={selectedItem.title} className="max-w-full max-h-full object-contain" />
              )}
            </div>
            
            {/* Details Section */}
            <div className="w-full md:w-80 bg-white flex flex-col shrink-0 rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl overflow-y-auto">
              {isEditing ? (
                <div className="p-6 space-y-4">
                  <h3 className="font-bold text-lg mb-2">Edit Details</h3>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Title</label>
                    <input 
                      type="text" 
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:border-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Category</label>
                    <input 
                      type="text" 
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:border-green-500 outline-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg text-sm font-bold">Cancel</button>
                    <button onClick={saveEdit} className="flex-1 bg-green-600 text-white flex justify-center items-center py-2 rounded-lg text-sm font-bold gap-1"><CheckCircle size={16}/> Save</button>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex flex-col h-full">
                  <div className="mb-6 flex-grow">
                     <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">{selectedItem.category}</span>
                     <h3 className="text-xl font-black mt-3 mb-1 text-gray-900">{selectedItem.title}</h3>
                     <p className="text-sm text-gray-400">Uploaded recently</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button onClick={startEdit} className="flex flex-col items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 p-3 rounded-xl transition-colors">
                      <Edit2 size={18} />
                      <span className="text-xs font-bold">Edit</span>
                    </button>
                    <button onClick={() => handleShare(selectedItem)} className="flex flex-col items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 p-3 rounded-xl transition-colors">
                      <Share size={18} />
                      <span className="text-xs font-bold">Share</span>
                    </button>
                    <button onClick={() => handleDownload(selectedItem)} className="flex flex-col items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 p-3 rounded-xl transition-colors">
                      <Download size={18} />
                      <span className="text-xs font-bold">Save</span>
                    </button>
                    <button onClick={() => handleDelete(selectedItem.id)} className="flex flex-col items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-xl transition-colors">
                      <Trash2 size={18} />
                      <span className="text-xs font-bold">Delete</span>
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
