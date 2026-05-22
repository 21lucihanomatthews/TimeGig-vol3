import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Coins, 
  Check, 
  X, 
  TrendingUp, 
  Users, 
  Clock, 
  Banknote, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  MapPin, 
  Sparkles,
  Search,
  CheckCircle,
  Briefcase,
  Image,
  Upload,
  Trash2
} from 'lucide-react';

import { T, useLanguage } from './TranslationProvider';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  role: string;
  location: string;
  rating: number;
  completedJobs: number;
  hourlyRate: string;
  bio: string;
  skills: string[];
  online: boolean;
  verified: boolean;
  coins: number;
  lookingForJobs?: boolean;
}

export interface AdminPayment {
  id: string;
  userRef: string;
  userName: string;
  userAvatar: string;
  coinsAmount: number;
  priceZAR: number;
  reference: string;
  popUrl?: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AdminDashboardViewProps {
  transactions: AdminPayment[];
  onApprovePayment: (paymentId: string) => void;
  onRejectPayment: (paymentId: string) => void;
  users: UserProfile[];
  onAddUser: (newUser: UserProfile) => void;
  wallpaper: string | null;
  onSetWallpaper: (imageUrl: string | null) => void;
  onToggleLookingForJobs?: (userId: string) => void;
}

export function AdminDashboardView({ transactions, onApprovePayment, onRejectPayment, users, onAddUser, wallpaper, onSetWallpaper, onToggleLookingForJobs }: AdminDashboardViewProps) {
  const { translateText } = useLanguage();
  const [successToast, setSuccessToast] = useState<string | null>(null);
  
  // Search filter
  const [searchUserQuery, setSearchUserQuery] = useState('');
  
  // Handlers
  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onSetWallpaper(base64String);
      setSuccessToast("Beautiful! Custom wallpaper uploaded and applied successfully!");
      setTimeout(() => setSuccessToast(null), 4000);
    };
    reader.readAsDataURL(file);
  };

  // Stats calculations
  const totalProfit = transactions
    .filter(tx => tx.status === 'approved')
    .reduce((sum, tx) => sum + tx.priceZAR, 0);

  const totalCoinsApproved = transactions
    .filter(tx => tx.status === 'approved')
    .reduce((sum, tx) => sum + tx.coinsAmount, 0);

  const activeUsersCount = users.filter(usr => usr.online).length;

  const pendingPayments = transactions.filter(tx => tx.status === 'pending');
  const processedPayments = transactions.filter(tx => tx.status !== 'pending');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 pb-24">
      
      {/* Admin Panel Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-slate-700/50 shadow-md">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl block" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="text-emerald-400" size={24} />
            <span className="text-xs bg-emerald-400/20 text-emerald-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-400/20">
              <T>System Admin</T>
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-1"><T>Mzansi Gig Network Controller</T></h2>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            <T>Manage biometric vetting credentials, approve incoming Capitec deposits, review proof sheets, and seed verified local contractors instantly.</T>
          </p>
        </div>
      </div>

      {/* Success Notifications Popups */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-emerald-950 font-bold text-xs"
          >
            <CheckCircle className="text-emerald-600 shrink-0 animate-bounce" size={18} />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Core Operational Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Profit Stat */}
        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-1.5 w-full bg-emerald-500" />
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
              <T>Accumulated Revenue (Profit)</T>
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Banknote size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-black text-gray-950">
              R {totalProfit.toFixed(2)}
            </h4>
            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-500" />
              <T>Direct Capitec EFT and cash receipts net</T>
            </p>
          </div>
        </div>

        {/* Total Coins Approved */}
        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-1.5 w-full bg-yellow-400" />
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
              <T>Minted Coins Liquidity</T>
            </span>
            <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <Coins size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-black text-gray-950">
              <T>{totalCoinsApproved} Coins</T>
            </h4>
            <p className="text-[10px] font-bold text-slate-400">
              <T>Approved token volume supplied to handymen</T>
            </p>
          </div>
        </div>

        {/* Active Users Stat */}
        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-1.5 w-full bg-indigo-500" />
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
              <T>Broadband Network Active</T>
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-black text-gray-950">
              <T>{activeUsersCount} Online</T>
            </h4>
            <p className="text-[10px] font-bold text-slate-400">
              <T>Active verified candidate threads & online profiles</T>
            </p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Payments & Roster */}
        <div className="lg:col-span-2 space-y-8 animate-in slide-in-from-left-2 duration-300">
          
          {/* Pending Proofs Section */}
          <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-black text-lg text-gray-950 flex items-center gap-2">
                  <Banknote size={20} className="text-emerald-600" />
                  <T>Receive & Review Payments</T>
                </h3>
                <p className="text-xs text-gray-500"><T>Approve or reject Capitec proof of payments</T></p>
              </div>
              <span className="bg-orange-50 text-orange-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                <T>{pendingPayments.length} Pending</T>
              </span>
            </div>

            {pendingPayments.length > 0 ? (
              <div className="space-y-4 divide-y divide-gray-50">
                {pendingPayments.map((pm, idx) => (
                  <div key={pm.id} className={`${idx > 0 ? 'pt-4' : ''} flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
                    
                    <div className="flex items-start gap-3">
                      <img 
                        src={pm.userAvatar} 
                        alt={pm.userName} 
                        className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0" 
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-sm text-gray-950">{pm.userName}</h4>
                          <span className="bg-slate-100 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded text-gray-500"><T>Ref</T>: <T>{pm.reference}</T></span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          <T>Applied package</T>: <strong><T>{pm.coinsAmount} Coins</T></strong> (<T>ZAR Price</T>: <T>R{pm.priceZAR.toFixed(2)}</T>)
                        </p>
                        <time className="text-[10px] text-gray-400 mt-1 block font-semibold"><T>{pm.date}</T></time>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto self-end md:self-center">
                      <button
                        onClick={() => onRejectPayment(pm.id)}
                        className="flex-1 md:flex-none border border-red-200 hover:border-red-300 text-red-600 font-extrabold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer hover:bg-red-50 active:scale-95"
                        type="button"
                      >
                        <T>Reject</T>
                      </button>
                      <button
                        onClick={() => onApprovePayment(pm.id)}
                        className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1"
                        type="button"
                      >
                        <Check size={14} strokeWidth={3} />
                        <T>Approve Deposit</T>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6 space-y-2">
                <CheckCircle2 className="text-emerald-500 mx-auto" size={32} />
                <p className="text-xs font-bold text-slate-800"><T>All Deposit Slips Processed</T></p>
                <p className="text-[10px] text-slate-400"><T>No pending Capitec file transfers to verify at this stage.</T></p>
              </div>
            )}
          </div>

          {/* Active Users / Balance Management Directory */}
          <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-black text-lg text-gray-950 flex items-center gap-2">
                  <Users size={20} className="text-indigo-600" />
                  <T>Active Users Registry</T> (<T>{filteredUsers.length}</T>)
                </h3>
                <p className="text-xs text-gray-500"><T>Track and manage balance sheets of vetted members</T></p>
              </div>

              {/* Minimal filter search */}
              <div className="relative shrink-0 w-full sm:w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={translateText("Filter name...")}
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  className="w-full bg-slate-50 text-xs py-2 pl-8 pr-3 rounded-lg outline-none border border-gray-200 focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredUsers.map(user => (
                <div key={user.id} className="border border-gray-150/60 p-4 rounded-2xl flex flex-col justify-between hover:border-indigo-400/20 transition-all bg-slate-50/40">
                  <div className="flex items-start gap-3">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-sm text-gray-950 truncate">{user.name}</h4>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.online ? 'bg-green-500 animate-pulse' : 'bg-gray-350'}`} />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate flex items-center gap-1">
                        <Briefcase size={10} /> <T>{user.role}</T>
                      </p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin size={10} /> <T>{user.location}</T>
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center bg-white/70 px-2 py-1.5 rounded-xl">
                    <div className="flex items-center gap-1">
                      <Coins size={12} className="text-yellow-500" />
                      <span className="text-xs font-black text-slate-800"><T>{user.coins} Coins</T></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleLookingForJobs?.(user.id)}
                      className={`text-[9px] px-2 py-1 rounded-md font-black uppercase transition-all select-none cursor-pointer ${
                        user.lookingForJobs !== false
                          ? 'bg-green-100 text-green-800 hover:bg-green-250 border border-green-200/50'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-250 border border-amber-200/50'
                      }`}
                      title={user.lookingForJobs !== false ? "Toggle to 'Not looking'" : "Toggle to 'Looking for jobs'"}
                    >
                      {user.lookingForJobs !== false ? <T>🔎 Core Candidate</T> : <T>💤 Secured/Passive</T>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Processed History Log */}
          {processedPayments.length > 0 && (
            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400"><T>Archived Payment Audits</T></h4>
              <div className="divide-y divide-gray-50">
                {processedPayments.map(p => (
                  <div key={p.id} className="py-2.5 flex justify-between items-center text-xs text-slate-600">
                    <span className="font-medium">{p.userName} <T>ref</T>: "<T>{p.reference}</T>"</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900"><T>{p.coinsAmount} Coins</T></span>
                      <span className={`font-black text-[9px] uppercase px-2 py-0.5 rounded ${
                        p.status === 'approved' ? 'bg-green-55 bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        <T>{p.status}</T>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right 1 Column: Only Wallpaper left */}
        <div className="animate-in slide-in-from-right-2 duration-300">
          {/* Wallpaper Settings Card */}
          <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-primary font-black text-lg text-slate-950 flex items-center gap-2">
                <Image className="text-indigo-600" size={20} />
                <T>Portal Wallpaper</T>
              </h3>
              <p className="text-xs text-gray-400 font-bold leading-relaxed mt-1">
                <T>Customize the global network background wallpaper. Upload an image from your device or select an elegant preset.</T>
              </p>
            </div>

            <div className="space-y-4">
              {/* Current wallpaper preview or state */}
              {wallpaper ? (
                <div className="relative rounded-2xl overflow-hidden h-28 border border-gray-250 shadow-xs group">
                  <img 
                    src={wallpaper} 
                    alt="Current background preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs p-2 flex justify-between items-center">
                    <span className="text-[10px] text-white font-bold truncate max-w-[130px]"><T>Active Custom Wallpaper</T></span>
                    <button
                      type="button"
                      onClick={() => {
                        onSetWallpaper(null);
                        setSuccessToast("Backdrop reset to standard system theme.");
                        setTimeout(() => setSuccessToast(null), 3000);
                      }}
                      className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all cursor-pointer"
                      title="Reset wallpaper"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-gray-250 rounded-2xl p-5 text-center bg-gray-50/50 flex flex-col items-center justify-center min-h-[112px]">
                  <Image className="text-gray-450 mb-1" size={24} />
                  <p className="text-[11px] font-bold text-gray-500"><T>No custom background active</T></p>
                  <p className="text-[10px] text-gray-450 mt-0.5"><T>Using standard gradient backdrop</T></p>
                </div>
              )}

              {/* Upload input button */}
              <div className="relative">
                <label className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 hover:border-indigo-500/50 bg-slate-50 hover:bg-slate-100/50 rounded-xl cursor-pointer text-xs font-extrabold text-gray-700 transition-all">
                  <Upload size={14} className="text-indigo-600" />
                  <span><T>Upload Image File</T></span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleWallpaperUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Presets */}
              <div className="space-y-2 pt-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block"><T>Or Select a Preset Wallpaper</T></label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Jozi Skyline', url: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=1200' },
                    { name: 'Table Mountain', url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1200' },
                    { name: 'Modern Wave', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200' },
                    { name: 'Veld Nature', url: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?q=80&w=1200' }
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        onSetWallpaper(preset.url);
                        setSuccessToast(`Wallpaper set to "${preset.name}" successfully!`);
                        setTimeout(() => setSuccessToast(null), 3500);
                      }}
                      className="group relative h-12 rounded-xl overflow-hidden text-left border border-gray-150 hover:border-indigo-500 cursor-pointer transition-all"
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all scroll-smooth" />
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white text-center px-1 drop-shadow-md"><T>{preset.name}</T></span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
