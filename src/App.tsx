/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Wallet, Briefcase, Settings, MoreHorizontal } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('search');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const menuItems = [
    { name: 'search', icon: Search, label: 'Search' },
    { name: 'wallet', icon: Wallet, label: 'Wallet' },
    { name: 'gigs', icon: Briefcase, label: 'Gigs' },
    { name: 'settings', icon: Settings, label: 'Settings' },
  ];

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
            className="fixed inset-0 flex items-center justify-center bg-white text-5xl font-extrabold text-blue-600 tracking-tighter"
          >
            TimeGig
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
            <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
              <h1 className="text-xl font-bold">TimeGig</h1>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <MoreHorizontal size={24} />
              </button>
            </header>

            {/* Main Content */}
            <main className="flex-grow p-4">
              <h2 className="text-2xl font-semibold capitalize">{activeTab}</h2>
              <p className="text-gray-600">Content for {activeTab} goes here.</p>
            </main>

            {/* Bottom Navigation */}
            <nav className="sticky bottom-0 flex justify-around p-4 bg-white border-t border-gray-200">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`flex flex-col items-center ${activeTab === item.name ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  <item.icon size={24} />
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
