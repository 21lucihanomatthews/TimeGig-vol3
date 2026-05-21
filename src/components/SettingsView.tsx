import React, { useState } from 'react';
import { Settings, ShieldCheck, CreditCard, Bell, Key, RefreshCcw, Eye, Smile, Volume2, Globe, Heart } from 'lucide-react';

interface SettingsViewProps {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  glassmorphic: boolean;
  setGlassmorphic: (val: boolean) => void;
  currencyForm: 'symbol' | 'code';
  setCurrencyForm: (val: 'symbol' | 'code') => void;
  onLoadSamples?: () => void;
  onClearAllData?: () => void;
}

export function SettingsView({
  coins,
  setCoins,
  glassmorphic,
  setGlassmorphic,
  currencyForm,
  setCurrencyForm,
  onLoadSamples,
  onClearAllData
}: SettingsViewProps) {
  // Notification states
  const [notifyTenders, setNotifyTenders] = useState(true);
  const [notifyGigs, setNotifyGigs] = useState(true);
  const [notifyJobs, setNotifyJobs] = useState(false);

  // Regional language
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [idVerified, setIdVerified] = useState(true);
  const [idNumber, setIdNumber] = useState('941012 5084 08 3'); // Sample SA ID format

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleResetCoins = () => {
    setCoins(150);
    if (onClearAllData) {
      onClearAllData();
    }
    triggerToast("Coins wallet reset to 150 and all local listings cleared!");
  };

  const handleToggleVerification = () => {
    setIdVerified(!idVerified);
    triggerToast(idVerified ? "ID Verification revoked." : "South African ID verified successfully via Home Affairs terminal!");
  };

  const localLanguages = [
    'English',
    'isiZulu',
    'isiXhosa',
    'Afrikaans',
    'Sesotho',
    'Setswana',
    'Sepedi',
    'Xitsonga',
    'siSwati',
    'Tshivenda',
    'isiNdebele'
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-top-4 duration-200">
          <Smile className="text-yellow-400 shrink-0" size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Settings Header */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Settings className="text-indigo-600 animate-spin-slow" size={26} />
            System Control Center
          </h3>
          <p className="text-sm text-gray-700 font-medium mt-1 leading-relaxed">
            Configure South African regional localizations, user interface styling, security access layers, and notification schedules.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. South African Localization & Currency preferences */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-5">
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-gray-100">
            <Globe className="text-indigo-600" size={18} />
            Mzanzi Localization & Rand Settings
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Preferred local language */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-600 uppercase tracking-wider block">Local Language (Official SA)</label>
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  triggerToast(`App system language set to ${e.target.value}!`);
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-extrabold text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-300 transition-all cursor-pointer"
              >
                {localLanguages.map(lng => (
                  <option key={lng} value={lng}>{lng}</option>
                ))}
              </select>
            </div>

            {/* Currency layout preference */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-600 uppercase tracking-wider block">Rand Formatting Style</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrencyForm('symbol');
                    triggerToast("Currency formatted to Standard Symbol format (e.g. R 450)");
                  }}
                  className={`py-3 rounded-xl text-xs font-extrabold border-2 transition-all cursor-pointer ${
                    currencyForm === 'symbol'
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  R Symbol (R450)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrencyForm('code');
                    triggerToast("Currency formatted to ISO Code format (e.g. 450 ZAR)");
                  }}
                  className={`py-3 rounded-xl text-xs font-extrabold border-2 transition-all cursor-pointer ${
                    currencyForm === 'code'
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ZAR Code (450 ZAR)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Frosted Glass visual theme toggle */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <Eye className="text-indigo-600" size={18} />
              Visual Styling Prefs
            </h4>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded-md uppercase">Cape Glass Effect</span>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h5 className="font-bold text-sm text-gray-900">Translucent Glassmorphic Mode</h5>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Applies an elegant frosted glass panel overlay with hardware-accelerated background blur for a futuristic translucent dashboard.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={glassmorphic}
                onChange={(e) => {
                  setGlassmorphic(e.target.checked);
                  triggerToast(e.target.checked ? "Dynamic Frosted Glass Layer activated!" : "Standard solid layouts restored.");
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {/* 3. National ID Home Affairs checking */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-gray-100">
            <ShieldCheck className="text-indigo-600" size={18} />
            South African Verification System (SAVS)
          </h4>

          <div className="space-y-3">
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <div className="w-full relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-wider">SA ID</span>
                <input
                  type="text"
                  maxLength={15}
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-16 pr-4 text-xs font-extrabold text-gray-950 tracking-widest outline-none focus:bg-white focus:border-indigo-600"
                  placeholder="ID Number"
                />
              </div>
              <button
                type="button"
                onClick={handleToggleVerification}
                className={`w-full md:w-auto px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ease-in cursor-pointer flex items-center justify-center gap-1 leading-none ${
                  idVerified 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {idVerified ? '✓ ID Verified' : 'Verify via DHS'}
              </button>
            </div>
            
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
              Verifying your profile ID via DHS (Department of Home Affairs) unlocks higher daily biddings on national municipal building tenders, verified status badges on community freelance gigs, and trusted chat ratings.
            </p>
          </div>
        </div>

        {/* 4. Notification preferences */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-gray-100">
            <Bell className="text-indigo-600" size={18} />
            Instant Mzanzi Notifications Setup
          </h4>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-sm block text-gray-900">National Government Tenders</span>
                <span className="text-xs text-gray-500 font-medium">Notify immediately whenever new multi-million Rand tenders are gazetted.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                <input
                  type="checkbox"
                  checked={notifyTenders}
                  onChange={(e) => {
                    setNotifyTenders(e.target.checked);
                    triggerToast(e.target.checked ? "Gov tender email alerts turned on!" : "Gov tender emails muted.");
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-sm block text-gray-900">Local Handyman & Delivery Gigs</span>
                <span className="text-xs text-gray-500 font-medium">Get phone alerts for immediate bakkie moves, plumbing repairs, or home installations.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                <input
                  type="checkbox"
                  checked={notifyGigs}
                  onChange={(e) => {
                    setNotifyGigs(e.target.checked);
                    triggerToast(e.target.checked ? "Freelance gig alerts enabled!" : "Gigs alerts muted.");
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-sm block text-gray-900">Technology & Corporate Fulltime Jobs</span>
                <span className="text-xs text-gray-500 font-medium">Weekly digest for senior and intermediate engineering vacancies in Johannesburg, Cape Town, and Durban.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                <input
                  type="checkbox"
                  checked={notifyJobs}
                  onChange={(e) => {
                    setNotifyJobs(e.target.checked);
                    triggerToast(e.target.checked ? "Job vacancies alerts enabled!" : "Job digest paused.");
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 5. Wallet support resetting & clear cache */}
        <div className="bg-red-50/50 border border-red-200/60 rounded-3xl p-6 space-y-4">
          <h4 className="text-sm font-black text-red-900 uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-red-100">
            <RefreshCcw className="text-red-600" size={18} />
            Administrative System Control Center
          </h4>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h5 className="font-bold text-sm text-red-900">Manage App Data & Wallet Balances</h5>
              <p className="text-xs text-red-700/80 font-semibold leading-relaxed">
                Start with a clean slate or restore realistic South African samples anytime. Resets your South African Coins wallet back to 150 Coins.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {onLoadSamples && (
                <button
                  type="button"
                  onClick={() => {
                    onLoadSamples();
                    triggerToast("Seeded South African sample datasets successfully!");
                  }}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl whitespace-nowrap transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  Load Sample Data
                </button>
              )}
              <button
                type="button"
                onClick={handleResetCoins}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl whitespace-nowrap transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCcw size={13} className="animate-spin-slow" />
                Reset App Data
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Proudly South African stamp */}
        <div className="flex justify-center items-center gap-2 text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">
          <Heart size={12} className="text-red-500 fill-red-500" />
          Proudly Made in South Africa • TimeGig Mzanzi Gateway v2.8.2
        </div>
      </div>
    </div>
  );
}
