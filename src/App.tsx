/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  ClipboardList,
  MessageSquare,
  Landmark,
  FolderOpen,
  Wallet,
  Settings,
  MoreHorizontal,
  User,
  CheckCircle,
  ArrowLeft,
  Users,
  Shield,
  Bell,
  FileText,
  UploadCloud,
  X,
  Download,
  LogOut,
  Check,
} from "lucide-react";
import {
  dummyJobs,
  dummyTenders,
  initialGigs,
  initialGalleryItems,
  sampleJobs,
  sampleTenders,
  sampleGigs,
  sampleGalleryItems,
} from "./data";
import { Job, Tender, Gig, GalleryItem } from "./types";
import { JobsView } from "./components/JobsView";
import { TendersView } from "./components/TendersView";
import { GigsView } from "./components/GigsView";
import { GalleryView } from "./components/GalleryView";
import { ChatView } from "./components/ChatView";
import { SettingsView } from "./components/SettingsView";
import { WalletView } from "./components/WalletView";
import { UsersView } from "./components/UsersView";
import { AdminDashboardView } from "./components/AdminDashboardView";
import { T } from "./components/TranslationProvider";
import CompanySignupView from "./components/CompanySignupView";
import UserRegistrationView from "./components/UserRegistrationView";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isRegistered, setIsRegistered] = useState(() => {
    return localStorage.getItem("timegig_company_registered") === "true";
  });
  const [hasSkippedRegistration, setHasSkippedRegistration] = useState(() => {
    return (
      localStorage.getItem("timegig_company_skipped_registration") === "true"
    );
  });
  const [registrationType, setRegistrationType] = useState<"company" | "user">("user");
  const isGuest = !isRegistered && hasSkippedRegistration;
  const [activeTab, setActiveTab] = useState("home");
  const [activeChatContactId, setActiveChatContactId] = useState<string | null>(
    null,
  );

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("timegig_is_admin") === "true";
  });
  const [isUserRegistered, setIsUserRegistered] = useState(() => {
    return localStorage.getItem("timegig_user_registered") === "true";
  });
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [adminPinError, setAdminPinError] = useState("");

  const [profileName, setProfileName] = useState(
    () => localStorage.getItem("timegig_profile_name") || "",
  );
  const [profileEmail, setProfileEmail] = useState(
    () => localStorage.getItem("timegig_profile_email") || "",
  );
  const [profileBio, setProfileBio] = useState(
    () => localStorage.getItem("timegig_profile_bio") || "",
  );
  const [userDocuments, setUserDocuments] = useState<
    { id: string; name: string; url: string; type: string }[]
  >([]);
  const [showProfileVisibilityModal, setShowProfileVisibilityModal] =
    useState(false);

  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: string; title: string; message: string; read: boolean; tab: string }[]
  >([
    {
      id: "1",
      title: "Welcome to TimeGig!",
      message: "Setup your profile to get started.",
      read: false,
      tab: "profile",
    },
  ]);

  // Sync account active status across system
  const [accountStatus, setAccountStatus] = useState(() => {
    return localStorage.getItem("timegig_account_status") || "active";
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setAccountStatus(
        localStorage.getItem("timegig_account_status") || "active",
      );
    };
    window.addEventListener("storage", handleStorageChange);
    // Standard storage events fire on other windows, so we can also listen to custom local event
    window.addEventListener("timegig_account_change", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("timegig_account_change", handleStorageChange);
    };
  }, []);

  // All new users will receive exactly 10 coins
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem("timegig_coins");
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem("timegig_coins", coins.toString());
  }, [coins]);

  const handleLogout = () => {
    setHasSkippedRegistration(false);
    setIsUserRegistered(false);
    setIsAdmin(false);
    setIsRegistered(false);
    setProfileName("");
    setProfileEmail("");
    setProfileBio("");
    setProfileImage(null);
    setUserDocuments([]);
    
    // Clear ONLY account and identity related keys
    const keysToClear = [
      "timegig_company_registered",
      "timegig_company_skipped_registration",
      "timegig_user_registered",
      "timegig_is_admin",
      "timegig_profile_name",
      "timegig_profile_email",
      "timegig_profile_bio",
      "timegig_profile_image",
      "timegig_account_status"
    ];
    
    keysToClear.forEach(key => localStorage.removeItem(key));
    
    setShowTopMenu(false);
    setActiveTab("home");
  };

  const [glassmorphic, setGlassmorphic] = useState(false);
  const [currencyForm, setCurrencyForm] = useState<"symbol" | "code">("symbol");

  // Dynamic tables (completely 100% empty of mock data upon initial page load)
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem("timegig_jobs");
    return saved ? JSON.parse(saved) : [];
  });
  const [tenders, setTenders] = useState<Tender[]>(() => {
    const saved = localStorage.getItem("timegig_tenders");
    return saved ? JSON.parse(saved) : [];
  });
  const [gigs, setGigs] = useState<Gig[]>(() => {
    const saved = localStorage.getItem("timegig_gigs");
    return saved ? JSON.parse(saved) : [];
  });
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem("timegig_gallery");
    return saved ? JSON.parse(saved) : [];
  });

  // Sync back to local storage automatically
  useEffect(() => {
    localStorage.setItem("timegig_jobs", JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem("timegig_tenders", JSON.stringify(tenders));
  }, [tenders]);

  useEffect(() => {
    localStorage.setItem("timegig_gigs", JSON.stringify(gigs));
  }, [gigs]);

  useEffect(() => {
    localStorage.setItem("timegig_gallery", JSON.stringify(galleryItems));
  }, [galleryItems]);

  const [users, setUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem("timegig_users");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "1",
        name: "John Doe",
        avatar:
          "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80",
        role: "Plumbing & Repairs Specialist",
        location: "Soweto, Johannesburg",
        rating: 4.9,
        completedJobs: 42,
        hourlyRate: "R150 - R200/hr",
        bio: "Dedicated master plumber with 8+ years experience solving emergency blockages, geyser installations, and general home pipeline refitting across Gauteng.",
        skills: ["Geysers", "Drainage", "Leak Detection", "Pipes"],
        online: true,
        verified: true,
        coins: 10,
        lookingForJobs: true,
      },
      {
        id: "2",
        name: "Nhlanhla Ndlovu",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
        role: "Interior Designer & Painter",
        location: "Green Point, Cape Town",
        rating: 4.8,
        completedJobs: 29,
        hourlyRate: "R220/hr",
        bio: "Experienced color consultant and interior wall designer specializing in premium textured coatings, residential paint-effects, and sanding.",
        skills: ["Painting", "Wallpapers", "Sanding", "Plastering"],
        online: false,
        verified: true,
        coins: 10,
        lookingForJobs: true,
      },
      {
        id: "3",
        name: "Tshepo Mokwena",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
        role: "Certified Electrician",
        location: "Sandton, Johannesburg",
        rating: 4.95,
        completedJobs: 56,
        hourlyRate: "R250/hr",
        bio: "High and low voltage commercial technician. Board certified for Eskom connection upgrades, single-phase wiring patterns, and inverter setups.",
        skills: ["Inverters", "Wiring", "Distribution Boards", "Solar"],
        online: true,
        verified: true,
        coins: 10,
        lookingForJobs: false,
      },
      {
        id: "4",
        name: "Aphiwe Cele",
        avatar:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
        role: "Home Organization & Cleaning Pro",
        location: "Umhlanga, Durban",
        rating: 4.7,
        completedJobs: 18,
        hourlyRate: "R110/hr",
        bio: "Professional organizer specializing in large-scale residential decluttering, post-move cleanups, and regular domestic maintenance.",
        skills: ["Deep Cleaning", "Organization", "Laundry", "Ironing"],
        online: true,
        verified: false,
        coins: 10,
        lookingForJobs: true,
      },
    ];
  });

  const [adminPayments, setAdminPayments] = useState<any[]>(() => {
    const saved = localStorage.getItem("timegig_admin_payments");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "tx-initial",
        userRef: "usr-lucihano",
        userName: "Lucihano Matthews",
        userAvatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
        coinsAmount: 150,
        priceZAR: 34.99,
        reference: "150 coins signup reward",
        date: "2026-05-21 12:00",
        status: "approved",
        type: "deposit",
        amount: 150,
        description: "New account signup reward tokens",
      },
      {
        id: "tx-pending-1",
        userRef: "usr-nhlanhla",
        userName: "Nhlanhla Ndlovu",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
        coinsAmount: 100,
        priceZAR: 24.99,
        reference: "100 coins deposit",
        date: "2026-05-22 07:15",
        status: "pending",
        type: "deposit",
        amount: 100,
        description: "Refill Package: 100 Coins",
      },
      {
        id: "tx-pending-2",
        userRef: "usr-tshepo",
        userName: "Tshepo Mokwena",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
        coinsAmount: 200,
        priceZAR: 34.99,
        reference: "200 solar task refill",
        date: "2026-05-22 07:35",
        status: "pending",
        type: "deposit",
        amount: 200,
        description: "Refill Package: 200 Coins",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("timegig_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(
      "timegig_admin_payments",
      JSON.stringify(adminPayments),
    );
  }, [adminPayments]);

  const [wallpaper, setWallpaper] = useState<string | null>(() => {
    return localStorage.getItem("timegig_wallpaper");
  });

  useEffect(() => {
    if (wallpaper) {
      localStorage.setItem("timegig_wallpaper", wallpaper);
    } else {
      localStorage.removeItem("timegig_wallpaper");
    }
  }, [wallpaper]);

  const handleApprovePayment = (paymentId: string) => {
    setAdminPayments((prev) =>
      prev.map((p) => {
        if (p.id === paymentId) {
          if (p.userRef === "usr-lucihano") {
            setCoins((current) => current + p.coinsAmount);
          } else {
            setUsers((currentUsers) =>
              currentUsers.map((u) => {
                if (
                  u.id === p.userRef ||
                  (p.userName && u.name === p.userName)
                ) {
                  return { ...u, coins: (u.coins || 0) + p.coinsAmount };
                }
                return u;
              }),
            );
          }
          return { ...p, status: "approved" };
        }
        return p;
      }),
    );
  };

  const handleRejectPayment = (paymentId: string) => {
    setAdminPayments((prev) =>
      prev.map((p) => {
        if (p.id === paymentId) {
          return { ...p, status: "rejected" };
        }
        return p;
      }),
    );
  };

  const handleToggleLookingForJobs = (userId: string) => {
    setUsers((curr) =>
      curr.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            lookingForJobs: u.lookingForJobs === false ? true : false,
          };
        }
        return u;
      }),
    );
  };

  const loadDemoData = () => {
    setJobs(sampleJobs);
    setTenders(sampleTenders);
    setGigs(sampleGigs);
    setGalleryItems(sampleGalleryItems);
  };

  const clearAllData = () => {
    setJobs([]);
    setTenders([]);
    setGigs([]);
    setGalleryItems([]);
    setCoins(0); // Resetting coins balance
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const menuItems = [
    { name: "gigs", icon: ClipboardList, label: "Find Work" },
    ...(!isGuest ? [{ name: "chat", icon: MessageSquare, label: "Inbox" }] : []),
    { name: "users", icon: Users, label: "Hire Pros" },
  ];

  const topMenuItems = [
    { name: "profile", icon: User, label: "User Profile" },
    { name: "jobs", icon: Briefcase, label: "Jobs" },
    { name: "tenders", icon: Landmark, label: "Tenders" },
    { name: "gallery", icon: FolderOpen, label: "Gallery" },
    { name: "settings", icon: Settings, label: "Settings" },
    ...(isAdmin ? [{ name: "admin", icon: Shield, label: "Admin Panel" }] : []),
  ];

  const [showTopMenu, setShowTopMenu] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(() =>
    localStorage.getItem("timegig_profile_image"),
  );
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem("timegig_profile_name", profileName);
    localStorage.setItem("timegig_profile_email", profileEmail);
    localStorage.setItem("timegig_profile_bio", profileBio);
    if (profileImage) {
      localStorage.setItem("timegig_profile_image", profileImage);
    } else {
      localStorage.removeItem("timegig_profile_image");
    }
  }, [profileName, profileEmail, profileBio, profileImage]);

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setProfileImage(url);

        setGalleryItems((prev) => [
          {
            id: `profile_pic_${Date.now()}`,
            url: url,
            title: "Profile Picture",
            category: "Profile",
            likes: 0,
          },
          ...prev,
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocs = Array.from(e.target.files).map((file: File) => ({
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
      }));
      setUserDocuments((prev) => [...prev, ...newDocs]);
    }
  };

  const handleSaveProfile = () => {
    if (profileEmail === "21lucihanomatthews@gmail.com" && !isAdmin) {
      setShowAdminPinModal(true);
      return;
    }

    const isComplete =
      profileName.trim().length > 0 &&
      profileEmail.trim().length > 0 &&
      profileBio.trim().length > 0 &&
      profileImage !== null &&
      userDocuments.length > 0;

    if (isComplete) {
      setIsUserRegistered(true);
      localStorage.setItem("timegig_user_registered", "true");
    }

    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      setShowProfileVisibilityModal(true);
    }, 1000);
  };

  const handleAdminPinSubmit = () => {
    if (adminPin === "1019") {
      localStorage.setItem("timegig_is_admin", "true");
      setIsAdmin(true);
      setShowAdminPinModal(false);
      setAdminPin("");
      setAdminPinError("");

      const isComplete =
        profileName.trim().length > 0 &&
        profileEmail.trim().length > 0 &&
        profileBio.trim().length > 0 &&
        profileImage !== null &&
        userDocuments.length > 0;

      if (isComplete) {
        setIsUserRegistered(true);
        localStorage.setItem("timegig_user_registered", "true");
      }

      // Continue with profile save
      setIsSavingProfile(true);
      setTimeout(() => {
        setIsSavingProfile(false);
        setShowProfileVisibilityModal(true);
      }, 1000);
    } else {
      setAdminPinError("Invalid PIN");
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        glassmorphic
          ? "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-slate-100"
          : "bg-gray-50 text-gray-900"
      }`}
      style={
        wallpaper
          ? {
              backgroundImage: glassmorphic
                ? `linear-gradient(rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.82)), url(${wallpaper})`
                : `linear-gradient(rgba(249, 250, 251, 0.72), rgba(249, 250, 251, 0.72)), url(${wallpaper})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
    >
      {glassmorphic && (
        <style>{`
          .bg-white {
            background-color: rgba(15, 23, 42, 0.45) !important;
            backdrop-filter: blur(20px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            color: #f8fafc !important;
          }
          .bg-gray-50 {
            background-color: rgba(255, 255, 255, 0.05) !important;
            color: #f8fafc !important;
          }
          .bg-gray-100 {
            background-color: rgba(255, 255, 255, 0.08) !important;
            color: #f1f5f9 !important;
          }
          header {
            background-color: rgba(15, 23, 42, 0.65) !important;
            backdrop-filter: blur(24px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            color: #ffffff !important;
          }
          header h1 {
            color: #ffffff !important;
          }
          nav {
            background-color: rgba(15, 23, 42, 0.65) !important;
            backdrop-filter: blur(24px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            color: #ffffff !important;
          }
          .text-gray-900, .text-gray-800, .text-gray-700, .text-zinc-900, .text-slate-900 {
            color: #f8fafc !important;
          }
          .text-gray-600, .text-gray-500, .text-gray-400 {
            color: #94a3b8 !important;
          }
          input, textarea, select {
            background-color: rgba(255, 255, 255, 0.06) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            color: #ffffff !important;
          }
          input::placeholder, textarea::placeholder {
            color: #64748b !important;
          }
          .border, .border-b, .border-t, .border-r, .border-l {
            border-color: rgba(255, 255, 255, 0.12) !important;
          }
        `}</style>
      )}
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
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-green-600 via-yellow-400 to-red-600 inline-block text-transparent bg-clip-text text-5xl font-extrabold tracking-tighter drop-shadow-sm relative">
                TimeGig
                <div className="absolute -top-3 -right-12 flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider rotate-6 transform">
                  <Shield size={12} />
                  <span>Legit</span>
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm font-bold text-gray-500 tracking-wide uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              South Africa
            </div>
          </motion.div>
        ) : !isRegistered && !hasSkippedRegistration ? (
          <motion.div
            key="signup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white overflow-y-auto"
          >
            {registrationType === "company" ? (
              <CompanySignupView
                onComplete={() => {
                  localStorage.setItem("timegig_company_registered", "true");
                  setIsRegistered(true);
                }}
                onSkip={() => {
                  setHasSkippedRegistration(true);
                }}
                onSwitchType={() => setRegistrationType("user")}
              />
            ) : (
              <UserRegistrationView
                onComplete={(email) => {
                  localStorage.setItem("timegig_profile_email", email);
                  localStorage.setItem("timegig_company_registered", "true");
                  setIsRegistered(true);
                  // Auto-fill profile name if possible or let user complete it later
                }}
                onSkip={() => {
                  setHasSkippedRegistration(true);
                }}
                onBackToCompany={() => setRegistrationType("company")}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`flex flex-col min-h-screen ${isAdmin ? "pt-24 bg-slate-50" : "pt-16"}`}
          >
            {isAdmin ? (
              <>
                <header className="fixed top-0 left-0 right-0 h-16 flex justify-between items-center px-6 bg-slate-900 border-b border-slate-800 z-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                      <Shield size={20} className="text-emerald-400" />
                    </div>
                    <div>
                      <h1 className="text-sm font-black text-white tracking-widest uppercase">Admin Controller</h1>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">System Live</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95"
                    >
                      <LogOut size={16} />
                      <T>Logout Admin</T>
                    </button>
                  </div>
                </header>
                <main className="flex-grow w-full max-w-7xl mx-auto p-4 pb-12">
                  <AdminDashboardView
                    transactions={adminPayments}
                    onApprovePayment={handleApprovePayment}
                    onRejectPayment={handleRejectPayment}
                    users={users}
                    onAddUser={(newUser) => setUsers((prev) => [newUser, ...prev])}
                    wallpaper={wallpaper}
                    onSetWallpaper={setWallpaper}
                    onToggleLookingForJobs={handleToggleLookingForJobs}
                  />
                </main>
              </>
            ) : (
              <>
                {/* Top Header */}
                <header className="fixed top-0 left-0 right-0 h-16 flex justify-between items-center px-4 bg-white/70 backdrop-blur-md border-b border-gray-200/50 z-50">
                  <div className="flex items-center gap-2">
                    {activeTab !== "home" && (
                      <button
                        onClick={() => setActiveTab("home")}
                        className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                        aria-label="Back to Home"
                      >
                        <ArrowLeft size={24} />
                      </button>
                    )}
                    <div className="flex items-end gap-1.5">
                      <button
                        onClick={() => setActiveTab("home")}
                        className="text-xl font-black bg-gradient-to-r from-green-600 to-indigo-900 bg-clip-text text-transparent focus:outline-none hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        TimeGig
                      </button>
                      <div className="flex items-center gap-1 mb-1 bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                        <Shield size={10} />
                        <span>Verified Legit</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setShowNotificationsMenu(!showNotificationsMenu)
                      }
                      className={`p-2 rounded-full hover:bg-gray-100/55 transition-colors relative ${showNotificationsMenu ? "text-indigo-600 bg-indigo-50/50" : "text-gray-600"}`}
                      aria-label="Notifications"
                    >
                      <Bell size={24} />
                      {notifications.filter((n) => !n.read).length > 0 && (
                        <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-white animate-pulse" />
                      )}
                    </button>
                    
                    {!isGuest && (
                      <button
                        onClick={() => setActiveTab("wallet")}
                        className={`p-2 rounded-full hover:bg-gray-100/55 transition-colors ${activeTab === "wallet" ? "text-green-600 bg-green-50/50" : "text-gray-600"}`}
                        aria-label="Wallet"
                      >
                        <Wallet size={24} />
                      </button>
                    )}
                    
                    {isGuest ? (
                      <button
                        onClick={() => {
                          setHasSkippedRegistration(false);
                          setIsRegistered(false);
                        }}
                        className="bg-indigo-600 text-white text-[10px] font-black px-3 py-2 rounded-xl uppercase tracking-tighter shadow-sm active:scale-95 transition-transform"
                      >
                        Sign In
                      </button>
                    ) : (
                      <button
                        className={`rounded-full hover:bg-gray-100/55 flex items-center justify-center transition-colors relative ${profileImage ? "p-1" : "p-2"}`}
                        style={{ width: "40px", height: "40px" }}
                        onClick={() => setShowTopMenu(!showTopMenu)}
                      >
                        {profileImage ? (
                          <div className="relative">
                            <img
                              src={profileImage}
                              alt="Profile"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            {isUserRegistered && (
                              <div
                                className="absolute -top-1 -right-1 bg-black text-white rounded-full p-0.5 border-2 border-white z-10 shadow-sm"
                                title="Verified Complete Profile"
                              >
                                <Check size={10} strokeWidth={4} />
                              </div>
                            )}
                          </div>
                        ) : (
                          <MoreHorizontal size={24} />
                        )}
                      </button>
                    )}
                  </div>
                  {showNotificationsMenu && (
                    <div className="fixed top-16 right-16 mt-1 w-80 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                      <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h4 className="font-bold text-gray-900 text-sm">
                          Notifications
                        </h4>
                        <button
                          onClick={() =>
                            setNotifications((prev) =>
                              prev.map((n) => ({ ...n, read: true })),
                            )
                          }
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-500 text-sm">
                            No new notifications
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!notif.read ? "bg-indigo-50/30" : ""}`}
                              onClick={() => {
                                setNotifications((prev) =>
                                  prev.map((n) =>
                                    n.id === notif.id ? { ...n, read: true } : n,
                                  ),
                                );
                                setShowNotificationsMenu(false);
                                setActiveTab(notif.tab);
                              }}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <h5
                                  className={`text-sm ${!notif.read ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
                                >
                                  {notif.title}
                                </h5>
                                {!notif.read && (
                                  <span className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5 shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-2">
                                {notif.message}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                  {showTopMenu && (
                    <div className="fixed top-16 right-4 mt-1 w-48 bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg shadow-lg z-50">
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
                          <T>{item.label}</T>
                        </button>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 hover:bg-red-50 text-red-600 border-t border-gray-100"
                      >
                        <LogOut className="mr-2" size={20} />
                        <T>Logout</T>
                      </button>
                    </div>
                  )}
                </header>


            {/* Main Content */}
            <main
              className={`flex-grow w-full ${activeTab === "chat" ? "max-w-none p-0 h-[calc(100vh-64px)] overflow-hidden" : "max-w-7xl mx-auto p-4 pb-12"}`}
            >
              {accountStatus === "disabled" && (
                <div className="mb-4 max-w-4xl mx-auto bg-amber-50 border border-amber-250/60 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs animate-in slide-in-from-top duration-200">
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-600 text-lg mt-0.5">⚠️</span>
                    <div>
                      <h4 className="font-extrabold text-xs text-amber-900 tracking-wide uppercase">
                        <T>Your Mzanzi Profile is Disabled</T>
                      </h4>
                      <p className="text-xs text-amber-700 font-medium">
                        <T>
                          Your account is currently disabled. Active clients
                          cannot view your details in searches. Re-enable it to
                          restore visibility.
                        </T>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.setItem("timegig_account_status", "active");
                      setAccountStatus("active");
                      // Dispatch both storage events for sync
                      window.dispatchEvent(new Event("storage"));
                      window.dispatchEvent(new Event("timegig_account_change"));
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap active:scale-95"
                  >
                    <T>Enable My Account</T>
                  </button>
                </div>
              )}

              {activeTab === "home" ? (
                <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
                  {/* Hero Welcoming Banner */}
                  <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-indigo-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-yellow-400/20 rounded-full blur-2xl block" />
                    <div className="relative z-10 space-y-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] bg-yellow-400/30 text-yellow-100 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest border border-yellow-300/20">
                          Mzansi Worker Network
                        </span>
                        <h2 className="text-3xl font-black tracking-tight mt-1">
                          {isGuest ? "Welcome to Mzansi" : `Sanibonani, ${profileName.trim().split(' ')[0] || "User"}`}!
                        </h2>
                        <p className="text-sm text-green-100/90 max-w-lg leading-relaxed">
                          Welcome to your secure local jobs, gigs and government
                          tenders registry. Navigate using the launcher icons
                          below.
                        </p>
                      </div>

                      {/* Summary quick cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        {isGuest ? (
                          <div className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
                            <span className="text-[10px] text-indigo-200 uppercase font-black tracking-wider block">
                              Guest Mode
                            </span>
                            <span className="text-lg font-black block mt-1 uppercase tracking-tighter">
                              Viewing
                            </span>
                          </div>
                        ) : (
                          <div className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
                            <span className="text-[10px] text-green-200 uppercase font-black tracking-wider block">
                              Your Wallet
                            </span>
                            <span className="text-lg font-black block mt-1">
                              {coins} Coins
                            </span>
                          </div>
                        )}
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
                          <span className="text-[10px] text-green-200 uppercase font-black tracking-wider block">
                            Jobs Listed
                          </span>
                          <span className="text-lg font-black block mt-1">
                            {jobs.length} Active
                          </span>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
                          <span className="text-[10px] text-green-200 uppercase font-black tracking-wider block">
                            Gigs Found
                          </span>
                          <span className="text-lg font-black block mt-1">
                            {gigs.length} Gigs
                          </span>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
                          <span className="text-[10px] text-green-200 uppercase font-black tracking-wider block">
                            Tenders Open
                          </span>
                          <span className="text-lg font-black block mt-1">
                            {tenders.length} Notices
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature Launcher Grid */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase text-center sm:text-left">
                      Activate Feature Modules
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {/* 1. Jobs Card */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("jobs")}
                        className="bg-white border border-gray-150 hover:border-green-500/50 rounded-2xl p-5 text-left transition-all hover:shadow-md cursor-pointer group space-y-3"
                      >
                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <div className="flex justify-between items-center">
                            <h4 className="font-extrabold text-base text-gray-950">
                              Jobs Portal
                            </h4>
                            <span className="text-[10px] font-black bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              {jobs.length} listed
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Search full-time & contracts or publish corporate
                            job specs instantly.
                          </p>
                        </div>
                      </button>

                      {/* 2. Gigs Card */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("gigs")}
                        className="bg-white border border-gray-150 hover:border-yellow-500/50 rounded-2xl p-5 text-left transition-all hover:shadow-md cursor-pointer group space-y-3"
                      >
                        <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ClipboardList size={20} />
                        </div>
                        <div>
                          <div className="flex justify-between items-center">
                            <h4 className="font-extrabold text-base text-gray-950">
                              Handyman Gigs
                            </h4>
                            <span className="text-[10px] font-black bg-yellow-100 text-yellow-900 px-2 py-0.5 rounded-full">
                              {gigs.length} open
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Find local micro-jobs: repairs, moving flats,
                            plumbing and mounting.
                          </p>
                        </div>
                      </button>

                      {/* 3. Tenders Card */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("tenders")}
                        className="bg-white border border-gray-150 hover:border-blue-500/50 rounded-2xl p-5 text-left transition-all hover:shadow-md cursor-pointer group space-y-3"
                      >
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Landmark size={20} />
                        </div>
                        <div>
                          <div className="flex justify-between items-center">
                            <h4 className="font-extrabold text-base text-gray-950">
                              Gov Tenders
                            </h4>
                            <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              {tenders.length} active
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Browse official municipality contract tenders,
                            gazettes & bid details.
                          </p>
                        </div>
                      </button>

                      {/* 4. Chat Card */}
                      <button
                        type="button"
                        onClick={() => {
                          if (isGuest) {
                            setHasSkippedRegistration(false);
                            setIsRegistered(false);
                          } else {
                            setActiveTab("chat");
                          }
                        }}
                        className={`bg-white border rounded-2xl p-5 text-left transition-all hover:shadow-md cursor-pointer group space-y-3 ${isGuest ? 'border-gray-150 opacity-60' : 'border-gray-150 hover:border-amber-500/50'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${isGuest ? 'bg-gray-100 text-gray-400' : 'bg-amber-50 text-amber-600'}`}>
                          <MessageSquare size={20} />
                        </div>
                        <div>
                          <div className="flex justify-between items-center">
                            <h4 className="font-extrabold text-base text-gray-950">
                              Local Channels
                            </h4>
                            {isGuest && (
                              <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                LOCKED
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {isGuest ? 'Register to join local chatrooms and message service providers directly.' : 'Secure micro-chat and chatrooms with document upload integrations.'}
                          </p>
                        </div>
                      </button>

                      {/* 5. Gallery Card */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("gallery")}
                        className="bg-white border border-gray-150 hover:border-purple-500/50 rounded-2xl p-5 text-left transition-all hover:shadow-md cursor-pointer group space-y-3"
                      >
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FolderOpen size={20} />
                        </div>
                        <div>
                          <div className="flex justify-between items-center">
                            <h4 className="font-extrabold text-base text-gray-950">
                              Work Gallery
                            </h4>
                            <span className="text-[10px] font-black bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                              {galleryItems.length} files
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Secure workplace verification: upload certificates &
                            licenses.
                          </p>
                        </div>
                      </button>

                      {/* 6. Wallet Card */}
                      <button
                        type="button"
                        onClick={() => {
                          if (isGuest) {
                            setHasSkippedRegistration(false);
                            setIsRegistered(false);
                          } else {
                            setActiveTab("wallet");
                          }
                        }}
                        className={`bg-white border rounded-2xl p-5 text-left transition-all hover:shadow-md cursor-pointer group space-y-3 ${isGuest ? 'border-gray-150 opacity-60' : 'border-gray-150 hover:border-indigo-500/50'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${isGuest ? 'bg-gray-100 text-gray-400' : 'bg-indigo-50 text-indigo-600'}`}>
                          <Wallet size={20} />
                        </div>
                        <div>
                          <div className="flex justify-between items-center">
                            <h4 className="font-extrabold text-base text-gray-950">
                              Coin Wallet
                            </h4>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isGuest ? 'bg-gray-100 text-gray-500' : 'bg-indigo-100 text-indigo-900'}`}>
                              {isGuest ? 'LOCKED' : `${coins} coins`}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {isGuest ? 'Only verified members can access the coin wallet and transaction history.' : 'Manage your tokens, top-up balance, Capitec deposits & transactions.'}
                          </p>
                        </div>
                      </button>

                      {/* 7. Profile Card */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("profile")}
                        className="bg-white border border-gray-150 hover:border-red-500/50 rounded-2xl p-5 text-left transition-all hover:shadow-md cursor-pointer group space-y-3"
                      >
                        <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <User size={20} />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-base text-gray-950">
                            User Profile
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Configure job seeker CVs, personal biographies and
                            upload avatar photos.
                          </p>
                        </div>
                      </button>

                      {/* 8. Settings Card */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("settings")}
                        className="bg-white border border-gray-150 hover:border-slate-500/50 rounded-2xl p-5 text-left transition-all hover:shadow-md cursor-pointer group space-y-3 col-span-1 sm:col-span-2 md:col-span-1"
                      >
                        <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Settings size={20} />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-base text-gray-950">
                            Settings
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Adjust layout styling, glassmorphism UI toggles &
                            cache resets.
                          </p>
                        </div>
                      </button>
                    </div>

                    {/* Demonstration Seeder Ribbon */}
                    {jobs.length === 0 && (
                      <div className="bg-indigo-50 border border-indigo-150 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 text-center sm:text-left">
                        <div>
                          <p className="text-xs font-bold text-indigo-950">
                            Database Cache is Empty
                          </p>
                          <p className="text-[10px] text-indigo-700 font-semibold mt-0.5">
                            Seed demo Mzansi data sets or post individual items
                            to preview features.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={loadDemoData}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all shrink-0 shadow-xs"
                        >
                          Load South African Samples
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : activeTab === "profile" ? (
                <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <h2 className="text-2xl font-semibold">User Profile</h2>

                  <div className="flex flex-col items-center gap-4 border-b pb-6">
                    <label className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden text-gray-400 border-4 border-dashed border-yellow-400 hover:border-green-600 cursor-pointer transition-colors relative group">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover group-hover:opacity-50"
                        />
                      ) : (
                        <User size={48} className="group-hover:opacity-50" />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-white font-medium text-center">
                          Tap to Change
                          <br />
                          Photo
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageUpload}
                      />
                    </label>
                    <div className="text-center">
                      <h3 className="font-bold text-lg">{profileName}</h3>
                      <p className="text-gray-500 text-sm">
                        {profileBio.substring(0, 30)}...
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none focus:border-green-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none focus:border-green-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Experience & Bio
                      </label>
                      <textarea
                        rows={4}
                        value={profileBio}
                        onChange={(e) => setProfileBio(e.target.value)}
                        className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none focus:border-green-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        CV & Certificates
                      </label>

                      {userDocuments.length > 0 && (
                        <div className="mb-3 space-y-2">
                          {userDocuments.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-xl"
                            >
                              <div className="flex items-center gap-2">
                                <FileText size={18} className="text-gray-500" />
                                <span className="text-sm font-medium text-gray-800">
                                  {doc.name}
                                </span>
                              </div>
                              <a
                                href={doc.url}
                                download={doc.name}
                                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-semibold px-3 py-1 bg-indigo-50 rounded-lg transition-colors"
                              >
                                <Download size={14} /> Download
                              </a>
                            </div>
                          ))}
                        </div>
                      )}

                      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-slate-50 transition-colors">
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleDocumentUpload}
                        />
                        <UploadCloud size={24} className="mb-2 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-600">
                          Tap to upload your CV and certificates
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          PDF, DOCX, JPG, PNG (Max 5MB)
                        </span>
                      </label>
                    </div>

                    <button
                      type="button"
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
                        "Save Profile Information"
                      )}
                    </button>
                  </div>
                </div>
              ) : activeTab === "jobs" ? (
                <JobsView
                  jobs={jobs}
                  coins={coins}
                  onApply={() => {}}
                  appliedJobIds={[]}
                  onAddJob={(newJob) => setJobs((prev) => [newJob, ...prev])}
                  onLoadSamples={loadDemoData}
                  isGuest={isGuest}
                  onSignUp={() => setHasSkippedRegistration(false)}
                />
              ) : activeTab === "tenders" ? (
                <TendersView
                  tenders={tenders}
                  onAddTender={(newTender) =>
                    setTenders((prev) => [newTender, ...prev])
                  }
                  onLoadSamples={loadDemoData}
                  isGuest={isGuest}
                  onSignUp={() => setHasSkippedRegistration(false)}
                />
              ) : activeTab === "gigs" ? (
                <GigsView
                  gigs={gigs}
                  onAddGig={(newGig) => setGigs((prev) => [newGig, ...prev])}
                  onAddMediaToGallery={(item) =>
                    setGalleryItems((prev) => [item, ...prev])
                  }
                  onLoadSamples={loadDemoData}
                  isGuest={isGuest}
                  onSignUp={() => setHasSkippedRegistration(false)}
                />
              ) : activeTab === "chat" ? (
                <ChatView
                  onAddMediaToGallery={(item) =>
                    setGalleryItems((prev) => [item, ...prev])
                  }
                  onCloseChat={() => setActiveTab("jobs")}
                  initialContactId={activeChatContactId}
                  onSelectContact={setActiveChatContactId}
                  isGuest={isGuest}
                  onSignUp={() => setHasSkippedRegistration(false)}
                />
              ) : activeTab === "users" ? (
                <UsersView
                  users={users}
                  onStartChat={(userId) => {
                    setActiveChatContactId(userId);
                    setActiveTab("chat");
                  }}
                  isGuest={isGuest}
                  onSignUp={() => setHasSkippedRegistration(false)}
                />
              ) : activeTab === "gallery" ? (
                <GalleryView
                  items={galleryItems}
                  setItems={setGalleryItems}
                  isGuest={isGuest}
                  onSignUp={() => setHasSkippedRegistration(false)}
                />
              ) : activeTab === "wallet" ? (
                <WalletView
                  coins={coins}
                  setCoins={setCoins}
                  transactions={
                    isAdmin
                      ? adminPayments
                      : adminPayments.filter(
                          (tx) => tx.userName === profileName,
                        )
                  }
                  onAddTransaction={(tx) => {
                    setAdminPayments((prev) => [tx, ...prev]);
                  }}
                />
              ) : activeTab === "admin" ? (
                <AdminDashboardView
                  transactions={adminPayments}
                  onApprovePayment={handleApprovePayment}
                  onRejectPayment={handleRejectPayment}
                  users={users}
                  onAddUser={(newUser) => {
                    setUsers((prev) => [newUser, ...prev]);
                  }}
                  wallpaper={wallpaper}
                  onSetWallpaper={setWallpaper}
                  onToggleLookingForJobs={handleToggleLookingForJobs}
                />
              ) : activeTab === "settings" ? (
                <SettingsView
                  coins={coins}
                  setCoins={setCoins}
                  glassmorphic={glassmorphic}
                  setGlassmorphic={setGlassmorphic}
                  currencyForm={currencyForm}
                  setCurrencyForm={setCurrencyForm}
                  onLoadSamples={loadDemoData}
                  onClearAllData={clearAllData}
                  isGuest={isGuest}
                />
              ) : (
                <>
                  <h2 className="text-2xl font-semibold capitalize">
                    {activeTab}
                  </h2>
                  <p className="text-gray-600">
                    Content for {activeTab} goes here.
                  </p>
                </>
              )}
            </main>

            {/* Bottom Navigation (Floating Cinematic Dock) */}
            {activeTab === "home" && !isAdmin && (
              <div className="fixed bottom-5 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
                <nav className="pointer-events-auto h-14 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-full px-2 flex justify-between items-center gap-1.5 shadow-[0_12px_35px_-6px_rgba(0,0,0,0.3)] max-w-[340px] w-full border-b-2 border-b-zinc-800/80">
                  {menuItems.map((item) => {
                    const isActive = activeTab === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setActiveTab(item.name)}
                        className={`relative flex items-center justify-center gap-2 px-3.5 py-2 rounded-full cursor-pointer h-10 w-full transition-all duration-300 select-none outline-none ${
                          isActive
                            ? "text-green-400 font-extrabold"
                            : "text-zinc-400 hover:text-zinc-100"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTabBackground"
                            className="absolute inset-0 bg-gradient-to-tr from-green-500/15 to-emerald-500/5 border border-green-500/20 rounded-full -z-10 shadow-inner"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 30,
                            }}
                          />
                        )}

                        <motion.div
                          animate={
                            isActive
                              ? { scale: [1, 1.15, 1], rotate: [0, -3, 3, 0] }
                              : {}
                          }
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-center shrink-0"
                        >
                          <item.icon
                            size={18}
                            className={isActive ? "stroke-[2.5px]" : "stroke-2"}
                          />
                        </motion.div>

                        <span className="text-xs font-bold tracking-tight capitalize leading-none">
                          <T>{item.label}</T>
                        </span>

                        {/* Premium indicator dot */}
                        {isActive && (
                          <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-400 rounded-full shadow-xs" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Profile Visibility Modal */}
            <AnimatePresence>
              {showProfileVisibilityModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10" />
                    <button
                      onClick={() => setShowProfileVisibilityModal(false)}
                      className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <X size={20} className="text-gray-600" />
                    </button>

                    <div className="relative text-center mt-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-200/50 shadow-sm">
                        <Users size={32} className="text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">
                        Join "Hire Pros"
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed mb-6">
                        Display your profile in the Users feature to be
                        discovered by clients and contractors.
                      </p>

                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-200/40 rounded-full -mr-8 -mt-8" />
                        <h4 className="font-bold text-amber-900 text-sm mb-1 flex items-center gap-1.5">
                          <CheckCircle size={16} className="text-amber-600" />{" "}
                          15 Days Free
                        </h4>
                        <p className="text-xs text-amber-800">
                          As a new user, you receive your first 15 days of
                          visibility completely free! After that, it costs 15
                          coins per 30 days.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            const newProfileUser = {
                              id: `usr-${Date.now()}`,
                              name: profileName,
                              avatar:
                                profileImage ||
                                `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?w=200&q=80`,
                              role: "New Member",
                              location: "South Africa",
                              rating: 5.0,
                              completedJobs: 0,
                              hourlyRate: "Negotiable",
                              bio: profileBio,
                              skills: ["Newly Joined"],
                              online: true,
                              verified: true,
                              coins: 15,
                              lookingForJobs: true,
                            };
                            setUsers((prev) => [newProfileUser, ...prev]);

                            setShowProfileVisibilityModal(false);
                            setProfileSaved(true);
                            setTimeout(() => {
                              setProfileSaved(false);
                              setActiveTab("users");
                            }, 2500);
                          }}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 rounded-xl transition-all active:scale-95 text-sm shadow-md shadow-indigo-600/20"
                        >
                          Activate Profile Visibility
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileVisibilityModal(false);
                            setProfileSaved(true);
                            setTimeout(() => setProfileSaved(false), 3000);
                          }}
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-all active:scale-95 text-sm"
                        >
                          Cancel, Maybe Later
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Admin PIN Modal */}
            <AnimatePresence>
              {showAdminPinModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        setShowAdminPinModal(false);
                        setAdminPin("");
                        setAdminPinError("");
                      }}
                      className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <X size={20} className="text-gray-600" />
                    </button>
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Shield size={32} />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900">
                        Admin Access
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">
                        Enter PIN to authorize elevated permissions for this
                        profile.
                      </p>

                      <div className="pt-2">
                        <input
                          type="password"
                          maxLength={4}
                          value={adminPin}
                          onChange={(e) => {
                            setAdminPin(e.target.value);
                            setAdminPinError("");
                          }}
                          placeholder="Enter PIN"
                          className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 rounded-xl p-4 text-center font-mono text-2xl tracking-[0.5em] outline-none transition-colors"
                        />
                        {adminPinError && (
                          <p className="text-red-500 text-xs font-bold mt-2">
                            {adminPinError}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={handleAdminPinSubmit}
                        disabled={adminPin.length < 4}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold py-4 rounded-xl transition-all active:scale-95 text-sm mt-4 shadow-md"
                      >
                        Authorize
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    )}
  </AnimatePresence>
</div>
);
}
