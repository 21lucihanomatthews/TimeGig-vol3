import React, { useState } from 'react';
import { Settings, BellOff, Bell, UserCheck, UserX, Info, Globe, Languages } from 'lucide-react';
import { T, useLanguage } from './TranslationProvider';

interface SettingsViewProps {
  coins?: number;
  setCoins?: React.Dispatch<React.SetStateAction<number>>;
  glassmorphic?: boolean;
  setGlassmorphic?: (val: boolean) => void;
  currencyForm?: 'symbol' | 'code';
  setCurrencyForm?: (val: 'symbol' | 'code') => void;
  onLoadSamples?: () => void;
  onClearAllData?: () => void;
  isGuest?: boolean;
}

export function SettingsView({
  coins,
  setCoins,
  glassmorphic,
  setGlassmorphic,
  currencyForm,
  setCurrencyForm,
  onLoadSamples,
  onClearAllData,
  isGuest
}: SettingsViewProps) {
  const { language, setLanguage } = useLanguage();

  // Offline notification state
  const [offlineNotifications, setOfflineNotifications] = useState(() => {
    return localStorage.getItem('timegig_offline_notifications') !== 'false';
  });

  // Account status state: 'active' or 'disabled'
  const [accountStatus, setAccountStatus] = useState(() => {
    return localStorage.getItem('timegig_account_status') || 'active';
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [customLanguage, setCustomLanguage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleToggleOfflineNotifications = (checked: boolean) => {
    setOfflineNotifications(checked);
    localStorage.setItem('timegig_offline_notifications', String(checked));
    triggerToast(
      checked
        ? "Offline notifications enabled! You will receive updates of new projects and payments when disconnected."
        : "Offline notifications disabled."
    );
  };

  const handleToggleAccountStatus = () => {
    const isCurrentlyActive = accountStatus === 'active';
    const nextStatus = isCurrentlyActive ? 'disabled' : 'active';
    setAccountStatus(nextStatus);
    localStorage.setItem('timegig_account_status', nextStatus);
    
    // Broadcast storage change or write custom event so that App.tsx knows immediately
    window.dispatchEvent(new Event('storage'));
    
    triggerToast(
      nextStatus === 'active'
        ? "Your account has been enabled. Your profile is now visible."
        : "Your account is now disabled. It will be hidden from searches & public listings."
    );
  };

  const handleTranslateImmediate = (targetLang: string) => {
    if (!targetLang || !targetLang.trim()) return;
    const formattedLang = targetLang.trim().substring(0, 40);
    setLanguage(formattedLang);
    triggerToast(`Translating application to ${formattedLang} immediately...`);
  };

  const presetLanguages = [
    'English', 'isiZulu', 'isiXhosa', 'Afrikaans', 'Sesotho', 
    'Swahili', 'French', 'Spanish', 'Portuguese', 'German'
  ];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-55 bg-slate-900 border border-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Info className="text-zinc-350 shrink-0 animate-pulse" size={16} />
          <span><T>{toastMessage}</T></span>
        </div>
      )}

      {/* Main Settings Header */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-xs">
        <h3 className="text-xl font-bold text-gray-950 tracking-tight flex items-center gap-2">
          <Settings className="text-gray-900" size={24} />
          <T>System Preferences</T>
        </h3>
        <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
          <T>Configure offline messaging capabilities, translate the system interface instantly, and manage your account presence dynamically.</T>
        </p>
      </div>

      <div className="space-y-4">
        {/* Instant AI Translator System section */}
        <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-4">
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <Languages className="text-indigo-600 shrink-0" size={18} />
              <T>AI Real-time Translator</T>
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              <T>Select a preset region language, or type ANY language globally (e.g., Japanese, Greek, Sesotho, Swahili, Italian) to instantly re-translate the entire application client-side & server-side with Gemini AI.</T>
            </p>
          </div>

          {/* Quick preset switches */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <T>Quick English & South African Regional Presets</T>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {presetLanguages.map((lang) => {
                const isActive = language.toLowerCase() === lang.toLowerCase();
                return (
                  <button
                    key={lang}
                    onClick={() => handleTranslateImmediate(lang)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer border ${
                      isActive 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom user translation box */}
          <div className="pt-3 border-t border-gray-100 space-y-2.5">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <T>Translate to any other language immediately</T>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (customLanguage.trim()) {
                  handleTranslateImmediate(customLanguage);
                  setCustomLanguage('');
                }
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Globe size={14} />
                </span>
                <input
                  type="text"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  placeholder="e.g. Japanese, Korean, Italian, Tshivenda, Xitsonga..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-450 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-semibold"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-xs whitespace-nowrap"
              >
                <T>Translate App</T>
              </button>
            </form>
          </div>

          <div className="bg-indigo-50/40 border border-indigo-100/50 rounded-xl p-3 flex items-start gap-2">
            <div className="text-indigo-600 text-sm mt-0.5 animate-pulse">🌍</div>
            <div className="text-[11px] text-indigo-900 leading-relaxed font-semibold">
              <T>Current active language is set to</T> <span className="underline font-black">{language}</span>. <T>Any user interface buttons, card labels, and posted vacancy descriptions will be seamlessly translated onto this style.</T>
            </div>
          </div>
        </div>

        {/* Section 1: Offline Notifications */}
        {!isGuest && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  {offlineNotifications ? (
                    <Bell className="text-indigo-650 shrink-0" size={18} />
                  ) : (
                    <BellOff className="text-gray-400 shrink-0" size={18} />
                  )}
                  <T>Offline Notifications</T>
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                  <T>Decide if you want to receive latest notifications and gig matching alerts from the app when your device is offline or working disconnected.</T>
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  id="offlineNotifToggle"
                  checked={offlineNotifications}
                  onChange={(e) => handleToggleOfflineNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="pt-2 border-t border-gray-50 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${offlineNotifications ? 'bg-indigo-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {offlineNotifications ? <T>Status: Enabled to queue notifications</T> : <T>Status: Notifications disabled offline</T>}
              </span>
            </div>
          </div>
        )}

        {/* Section 2: Account Disable/Enable Toggle */}
        {!isGuest && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  {accountStatus === 'active' ? (
                    <UserCheck className="text-indigo-650 shrink-0" size={18} />
                  ) : (
                    <UserX className="text-amber-500 shrink-0" size={18} />
                  )}
                  <T>Account Status</T>
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                  <T>Disable or enable your workspace profile instantly. While disabled, you are hidden from search engines and cannot bid on live projects or receive chats.</T>
                </p>
              </div>

              <div className="shrink-0">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  accountStatus === 'active' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                    : 'bg-amber-50 text-amber-700 border border-amber-150'
                }`}>
                  {accountStatus === 'active' ? <T>Enabled</T> : <T>Disabled</T>}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-[11px] text-gray-400 font-medium">
                {accountStatus === 'active' ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    ✓ <T>Your profile is fully searchable and visible in the South African workspace list.</T>
                  </span>
                ) : (
                  <span className="text-amber-600 font-semibold flex items-center gap-1">
                    ⚠ <T>Your profile is currently concealed from the main workspace stream.</T>
                  </span>
                )}
              </div>

              <button
                onClick={handleToggleAccountStatus}
                type="button"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs whitespace-nowrap self-end sm:self-auto ${
                  accountStatus === 'active'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                    : 'bg-indigo-600 text-white hover:bg-indigo-750 hover:shadow-md'
                }`}
              >
                {accountStatus === 'active' ? <T>Disable Account</T> : <T>Enable Account</T>}
              </button>
            </div>
          </div>
        )}

        {isGuest && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <Settings size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900"><T>Account Settings Private</T></h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                <T>You are currently viewing Mzanzi as a guest. Register an account to enable workspace configurations, notifications and profile control.</T>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
