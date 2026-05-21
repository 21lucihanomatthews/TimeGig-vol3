/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, ClipboardList, MessageSquare, Landmark, FolderOpen, Wallet, Settings, MoreHorizontal, User, CheckCircle } from 'lucide-react';
import { dummyJobs, dummyTenders, initialGigs, initialGalleryItems } from './data';
import { JobsView } from './components/JobsView';
import { TendersView } from './components/TendersView';
import { GigsView } from './components/GigsView';
import { GalleryView } from './components/GalleryView';
import { ChatView } from './components/ChatView';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');
  const [coins, setCoins] = useState(150);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const menuItems = [
    { name: 'jobs', icon: Briefcase, label: 'Jobs' },
    { name: 'gigs', icon: ClipboardList, label: 'Gigs' },
    { name: 'chat', icon: MessageSquare, label: 'Chat' },
    { name: 'tenders', icon: Landmark, label: 'Tenders' },
    { name: 'gallery', icon: FolderOpen, label: 'Gallery' },
  ];

  const topMenuItems = [
    { name: 'profile', icon: User, label: 'User Profile' },
    { name: 'settings', icon: Settings, label: 'Settings' },
  ];

  const [showTopMenu, setShowTopMenu] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [galleryItems, setGalleryItems] = useState(initialGalleryItems);

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setProfileImage(url);
        
        setGalleryItems(prev => [{
          id: `profile_pic_${Date.now()}`,
          url: url,
          title: 'Profile Picture',
          category: 'Profile',
          likes: 0
        }, ...prev]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-white"
          >
            <div className="bg-gradient-to-r from-green-600 via-yellow-400 to-red-600 inline-block text-transparent bg-clip-text text-5xl font-extrabold tracking-tighter drop-shadow-sm">
              TimeGig
            </div>
            <div className="mt-2 text-sm font-bold text-gray-500 tracking-wide uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              South Africa
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col min-h-screen"
          >
            {/* Top Header */}
            <header className="relative flex justify-between items-center p-4 bg-white border-b border-gray-200">
              <h1 className="text-xl font-bold">TimeGig</h1>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveTab('wallet')}
                  className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${activeTab === 'wallet' ? 'text-green-600 bg-green-50' : 'text-gray-600'}`}
                  aria-label="Wallet"
                >
                  <Wallet size={24} />
                </button>
                <button 
                  className={`rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors ${profileImage ? 'p-1' : 'p-2'}`}
                  style={{ width: '40px', height: '40px' }}
                  onClick={() => setShowTopMenu(!showTopMenu)}
                >
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <MoreHorizontal size={24} />
                  )}
                </button>
              </div>
              {showTopMenu && (
                <div className="absolute top-full right-4 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {topMenuItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveTab(item.name);
                        setShowTopMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                    >
                      <item.icon className="mr-2" size={20} />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </header>

            {/* Main Content */}
            <main className={`flex-grow w-full max-w-7xl mx-auto ${activeTab === 'chat' ? 'p-4 pb-0' : 'p-4 pb-24'}`}>
              {activeTab === 'profile' ? (
                <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <h2 className="text-2xl font-semibold">User Profile</h2>
                  
                  <div className="flex flex-col items-center gap-4 border-b pb-6">
                    <label className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden text-gray-400 border-4 border-dashed border-yellow-400 hover:border-green-600 cursor-pointer transition-colors relative group">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover group-hover:opacity-50" />
                      ) : (
                        <User size={48} className="group-hover:opacity-50" />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-white font-medium text-center">Tap to Change<br/>Photo</span>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                    </label>
                    <div className="text-center">
                      <h3 className="font-bold text-lg">Lucihano Matthews</h3>
                      <p className="text-gray-500 text-sm">Design & Engineering</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">Full Name</label>
                      <input type="text" defaultValue="Lucihano Matthews" className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none focus:border-green-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">Email Address</label>
                      <input type="email" defaultValue="21lucihanomatthews@gmail.com" className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none focus:border-green-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">Experience & Bio</label>
                      <textarea rows={4} defaultValue="Experienced software engineer focused on building robust full-stack applications with React and Node.js." className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none focus:border-green-600" />
                    </div>
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-75 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2"
                    >
                      {isSavingProfile ? (
                        <>
                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                           Saving...
                        </>
                      ) : profileSaved ? (
                         <>
                           <CheckCircle size={20} />
                           Congratulations, Profile Saved!
                         </>
                      ) : (
                        'Save Profile Information'
                      )}
                    </button>
                  </div>
                </div>
              ) : activeTab === 'jobs' ? (
                <JobsView 
                  jobs={dummyJobs} 
                  coins={coins} 
                  onApply={() => {}} 
                  appliedJobIds={[]} 
                />
              ) : activeTab === 'tenders' ? (
                <TendersView tenders={dummyTenders} />
              ) : activeTab === 'gigs' ? (
                <GigsView initialGigs={initialGigs} />
              ) : activeTab === 'chat' ? (
                <ChatView 
                  onAddMediaToGallery={(item) => setGalleryItems(prev => [item, ...prev])} 
                  onCloseChat={() => setActiveTab('jobs')}
                />
              ) : activeTab === 'gallery' ? (
                <GalleryView items={galleryItems} setItems={setGalleryItems} />
              ) : (
                <>
                  <h2 className="text-2xl font-semibold capitalize">{activeTab}</h2>
                  <p className="text-gray-600">Content for {activeTab} goes here.</p>
                </>
              )}
            </main>

            {/* Bottom Navigation */}
            {activeTab !== 'chat' && (
              <nav className="sticky bottom-0 flex justify-around items-center p-2 bg-white border-t border-gray-200 pb-safe z-50">
                {menuItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={`flex flex-col items-center justify-center w-full transition-colors ${
                      item.name === 'chat' 
                          ? 'bg-yellow-400 text-black p-4 rounded-full -mt-10 shadow-lg border-4 border-white' 
                          : activeTab === item.name ? 'text-green-600 font-bold' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <item.icon size={item.name === 'chat' ? 28 : 24} />
                    {item.name !== 'chat' && <span className="text-[10px] mt-1 capitalize font-semibold">{item.label}</span>}
                  </button>
                ))}
              </nav>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
