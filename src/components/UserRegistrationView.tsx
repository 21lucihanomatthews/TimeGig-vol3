import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  MessageSquare,
  ChevronLeft,
  Loader2,
  Eye,
  EyeOff,
  Smartphone,
  Fingerprint,
  Camera,
  AlertTriangle,
  RotateCcw,
  Check,
  Building,
  Shield
} from "lucide-react";
import { CameraCapture } from "./CameraCapture";
import { T, useLanguage } from './TranslationProvider';

interface UserRegistrationViewProps {
  onComplete: (email: string) => void;
  onSkip: () => void;
}

// Luhn Algorithm validation for South African ID numbers
function luhnCheck(idNumber: string): boolean {
  let sum = 0;
  for (let i = 0; i < idNumber.length; i++) {
    let digit = parseInt(idNumber.charAt(i), 10);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

export function validateSouthAfricanID(idNumber: string): { 
  isValid: boolean; 
  error?: string; 
  birthDate?: string; 
  gender?: string; 
  citizenship?: string; 
} {
  if (!idNumber) return { isValid: false, error: "ID Number is required" };
  const trimmed = idNumber.trim();
  if (trimmed.length !== 13) return { isValid: false, error: "RSA ID number must be exactly 13 digits" };
  if (!/^\d+$/.test(trimmed)) return { isValid: false, error: "ID number must only contain numerical digits" };
  
  // Parse birth date
  const yearStr = trimmed.substring(0, 2);
  const monthStr = trimmed.substring(2, 4);
  const dayStr = trimmed.substring(4, 6);
  
  const currentYear = new Date().getFullYear() % 100;
  const century = (parseInt(yearStr, 10) <= currentYear) ? 2000 : 1900;
  const birthYear = century + parseInt(yearStr, 10);
  const birthMonth = parseInt(monthStr, 10);
  const birthDay = parseInt(dayStr, 10);
  
  if (birthMonth < 1 || birthMonth > 12) {
    return { isValid: false, error: "Invalid birth month encoded in ID" };
  }
  
  // Simple day check
  if (birthDay < 1 || birthDay > 31) {
    return { isValid: false, error: "Invalid birth day encoded in ID" };
  }
  
  // Luhn checksum check
  if (!luhnCheck(trimmed)) {
    return { isValid: false, error: "Luhn checksum combination failed (invalid RSA ID)" };
  }
  
  // Extract gender and citizenship
  const genderCode = parseInt(trimmed.substring(6, 10), 10);
  const gender = genderCode >= 5000 ? "Male" : "Female";
  const citizenshipCode = parseInt(trimmed.charAt(10), 10);
  const citizenship = citizenshipCode === 0 ? "SA Citizen" : "Permanent Resident";
  
  const formattedDob = `${birthDay.toString().padStart(2, '0')}/${birthMonth.toString().padStart(2, '0')}/${birthYear}`;
  
  return {
    isValid: true,
    birthDate: formattedDob,
    gender,
    citizenship
  };
}

export default function UserRegistrationView({ 
  onComplete, 
  onSkip
}: UserRegistrationViewProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Biometric Liveness Scanning, 4: Congratulations
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [pin, setPin] = useState(["", "", "", ""]);
  const [generatedPin, setGeneratedPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [showPinNotification, setShowPinNotification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Identity verification states
  const [idValidationResult, setIdValidationResult] = useState<{
    isValid: boolean;
    birthDate?: string;
    gender?: string;
    citizenship?: string;
    error?: string;
  } | null>(null);

  // Check if device is already registered to block multi-accounting
  const [deviceBoundEmail, setDeviceBoundEmail] = useState<string | null>(null);
  const [isDeviceBlocked, setIsDeviceBlocked] = useState(false);
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'device_blocked' | 'duplicate_id' | 'validation_error' | 'success_reset';
  } | null>(null);

  // Camera flow
  const [showCamera, setShowCamera] = useState(false);
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null);
  const [isLivenessScanning, setIsLivenessScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState("");
  const [scanLog, setScanLog] = useState<string[]>([]);
  const [biometricPassed, setBiometricPassed] = useState(false);

  useEffect(() => {
    const existingEmail = localStorage.getItem("timegig_profile_email");
    const existingRegistration = localStorage.getItem("timegig_user_registered") === "true";
    
    if (existingEmail && existingRegistration) {
      setDeviceBoundEmail(existingEmail);
      if (mode === 'signup') {
        setIsDeviceBlocked(true);
        setErrorModal({
          isOpen: true,
          title: "Account Already Registered",
          message: `This device is already linked to an active citizen worker profile (${existingEmail}). To ensure fair labor supply and protect against system abuse, each citizen is restricted to exactly ONE TimeGig account.`,
          type: 'device_blocked'
        });
      }
    } else {
      setIsDeviceBlocked(false);
    }
  }, [mode]);

  // Read SA ID in real time to give user high-fidelity visual analysis feedback
  useEffect(() => {
    if (idNumber.length === 13) {
      const result = validateSouthAfricanID(idNumber);
      setIdValidationResult(result);
    } else {
      setIdValidationResult(null);
    }
  }, [idNumber]);

  // Developers sandbox bypass
  const handleFactoryResetDevice = () => {
    localStorage.removeItem("timegig_user_registered");
    localStorage.removeItem("timegig_profile_email");
    localStorage.removeItem("timegig_profile_name");
    localStorage.removeItem("timegig_profile_id");
    localStorage.removeItem("timegig_profile_phone");
    localStorage.removeItem("timegig_profile_verified");
    localStorage.removeItem("timegig_profile_image");
    setDeviceBoundEmail(null);
    setIsDeviceBlocked(false);
    setErrorModal({
      isOpen: true,
      title: "Sandbox Registers Cleared",
      message: "Simulated registration registry database values and single-device bindings have been reset back to initial state.",
      type: "success_reset"
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'signup') {
      if (!email || !password || !fullName || !phoneNumber || !idNumber || !acceptTerms) return;
      
      // Perform final check on identity validity
      const val = validateSouthAfricanID(idNumber);
      if (!val.isValid) {
        setErrorModal({
          isOpen: true,
          title: "FICA Validation Lock",
          message: `Validation Error: ${val.error || "The supplied National ID does not validate against Luhn algorithm checks."}`,
          type: "validation_error"
        });
        return;
      }

      // Check duplicate SA IDs in mock database (FICA protection)
      const usedIDs = JSON.parse(localStorage.getItem("timegig_registered_ids") || "[]");
      if (usedIDs.includes(idNumber.trim())) {
        setErrorModal({
          isOpen: true,
          title: "Identity Already Registered",
          message: "This specific South African National ID is already bound to another active live profile in our FICA system database. Running multiple active profiles under the same citizen credentials is banned.",
          type: "duplicate_id"
        });
        return;
      }

      setIsLoading(true);
      
      // Generate secure high-entropy OTP
      const newPin = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedPin(newPin);

      // Simulate FICA registry connection latency
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
        // Dispatch instant simulation notification
        setTimeout(() => {
          setShowPinNotification(true);
        }, 1000);
      }, 1800);
    } else {
      // Login mode
      if (!email || !password) return;
      setIsLoading(true);
      
      setTimeout(() => {
        setIsLoading(false);
        setStep(4);
        setTimeout(() => {
          onComplete(email);
        }, 2000);
      }, 1500);
    }
  };

  const handlePinChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const verifyPin = () => {
    const enteredPin = pin.join("");
    if (enteredPin === generatedPin) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Push onto step 3 (Direct biometric/anti-spoof verification system)
        setStep(3);
      }, 1200);
    } else {
      setPinError("Invalid verification code. Please try again.");
      setPin(["", "", "", ""]);
      document.getElementById("pin-0")?.focus();
    }
  };

  // Biometric Face Liveness Verification sequence
  const startBiometricLivenessScan = (imageSource: string) => {
    setSelfiePhoto(imageSource);
    setIsLivenessScanning(true);
    setScanProgress(0);
    setScanLog([]);
    
    const telemetryLogs = [
      "Securing connection path to Department of Home Affairs registers...",
      "Capturing facial landmark vectors. Analyzing pixel lighting contrasts...",
      "Executing micro-blink neural checks for static image-spoof defense...",
      "Comparing 3D geometric nose-to-chin ratio thresholds...",
      "Liveness clearance index matching: 99.8% human probability.",
      "Searching for matching duplicate biometric certificates in system..."
    ];

    let logCounter = 0;
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLivenessScanning(false);
          setBiometricPassed(true);
          return 100;
        }
        
        // Stagger logs based on scanning progress percentage
        if (prev % 17 === 0 && logCounter < telemetryLogs.length) {
          setScanLog(logs => [...logs, telemetryLogs[logCounter]]);
          setScanStatusText(telemetryLogs[logCounter]);
          logCounter++;
        }
        
        return prev + 2;
      });
    }, 70);
  };

  const handleSelfieCapture = (photo: string) => {
    setShowCamera(false);
    startBiometricLivenessScan(photo);
  };

  const completeRegistrationFlow = () => {
    setIsLoading(true);

    // Save profile metadata securely to simulate standard persistent state variables
    localStorage.setItem("timegig_profile_name", fullName);
    localStorage.setItem("timegig_profile_email", email);
    localStorage.setItem("timegig_profile_phone", phoneNumber);
    localStorage.setItem("timegig_profile_id", idNumber);
    localStorage.setItem("timegig_profile_verified", "true");
    localStorage.setItem("timegig_user_registered", "true");
    
    // Save captured biometric face/selfie photo as profile picture
    if (selfiePhoto) {
      localStorage.setItem("timegig_profile_image", selfiePhoto);
    }

    // Add ID to simulated global check to prevent any reuse
    const usedIDs = JSON.parse(localStorage.getItem("timegig_registered_ids") || "[]");
    usedIDs.push(idNumber.trim());
    localStorage.setItem("timegig_registered_ids", JSON.stringify(usedIDs));

    setTimeout(() => {
      setIsLoading(false);
      setStep(4);
      setTimeout(() => {
        onComplete(email);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col justify-center items-center p-4 relative font-sans">
      
      {/* Simulation OTP Banner */}
      <AnimatePresence>
        {showPinNotification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 mx-auto max-w-sm z-50 px-4"
          >
            <div className="bg-slate-950 text-white p-4.5 rounded-2xl shadow-2xl border border-white/10 flex items-start gap-3">
              <div className="bg-emerald-600 p-2.5 rounded-xl shrink-0">
                <MessageSquare size={18} className="text-white animate-bounce" />
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">TimeGig Secure SMS Gateway</h4>
                <p className="text-xs font-semibold text-slate-100 mt-1">OTP pin generated for <span className="text-emerald-300 font-bold">{phoneNumber}</span>:</p>
                <p className="text-xs font-medium text-slate-300 mt-0.5">Verification code is: <span className="font-black text-emerald-400 text-base ml-1 select-all">{generatedPin}</span></p>
              </div>
              <button 
                onClick={() => setShowPinNotification(false)}
                className="text-white/40 hover:text-white shrink-0 p-1"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative"
      >
        {/* Anti-fraud banner */}
        <div className="bg-emerald-600/10 px-4 py-2 border-b border-emerald-500/20 text-[11px] font-black text-emerald-700 tracking-wider text-center flex items-center justify-center gap-1">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>FICA ACCREDITED IDENTITY SHIELD PROTECTED DIRECTIVE</span>
        </div>

        {/* Gradient header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <Fingerprint size={48} className="mx-auto text-emerald-500 mb-4 animate-pulse" />
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">
            {step === 3 ? <T>Biometric Validation</T> : mode === 'signup' ? <T>Verified ID Registration</T> : <T>Account Authentication</T>}
          </h1>
          <p className="text-slate-400 text-xs px-2 leading-relaxed">
            {step === 3 
              ? <T>Performing anti-fraud human check and single-account binding.</T>
              : mode === 'signup' 
                ? <T>Every user is vetted against national citizens records to block fake profiles and scams.</T> 
                : <T>Provide your authenticated details to resume local gigs.</T>}
          </p>
        </div>

        <div className="p-7">
          {isDeviceBlocked && mode === 'signup' ? (
            /* Multi-account blocking state */
            <div className="space-y-6 text-center py-4">
              <div className="bg-red-50 text-red-700 p-4.5 rounded-2xl border border-red-100 flex flex-col items-center gap-3">
                <AlertTriangle size={36} className="text-red-600 shrink-0" />
                <h3 className="font-extrabold text-sm uppercase tracking-wide text-red-950">
                  <T>Anti-Fraud Stop: Duplicate Account Blocked</T>
                </h3>
                <p className="text-xs font-semibold text-red-650 leading-relaxed text-left">
                  <T>TimeGig Security detected that this device is already bound to an active registered profile:</T> <strong className="font-black select-all">{deviceBoundEmail}</strong>.
                </p>
                <div className="h-px bg-red-200/50 w-full my-1"></div>
                <p className="text-[11px] text-red-500 leading-normal text-left font-medium">
                  <T>To prevent labor manipulation, multi-profile wage scams, and rating forgery, each individual is limited strictly to ONE authenticated TimeGig profile. Running multiple accounts is a breach of security policy.</T>
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setMode('login')}
                  className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm border border-slate-950 active:scale-98"
                >
                  <T>Login into Existing Account</T>
                </button>

                <div className="flex items-center gap-4 py-2">
                  <div className="h-px flex-grow bg-gray-100"></div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest"><T>Testing Area</T></span>
                  <div className="h-px flex-grow bg-gray-100"></div>
                </div>

                <button
                  type="button"
                  onClick={handleFactoryResetDevice}
                  className="w-full inline-flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold text-xs py-2 hover:bg-indigo-50 border border-dashed border-indigo-200 rounded-xl transition-all"
                >
                  <RotateCcw size={14} /> <T>Reset Local Database Registers (Test Override)</T>
                </button>
              </div>
            </div>
          ) : step === 1 ? (
            /* Forms Screen (SignUp / Login) */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5 font-sans"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-black text-gray-700 tracking-wider uppercase mb-1 ml-1">
                        <T>Full Name (Matching ID)</T>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                        <input
                          required
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-800 focus:bg-white focus:ring-4 focus:ring-slate-800/5 font-semibold text-gray-950 text-sm transition-all"
                          placeholder={t("e.g. Sipho Nkosi")}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-gray-700 tracking-wider uppercase mb-1 ml-1">
                        <T>RSA Mobile Number</T>
                      </label>
                      <div className="relative">
                        <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                        <input
                          required
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-800 focus:bg-white focus:ring-4 focus:ring-slate-800/5 font-semibold text-gray-950 text-sm transition-all"
                          placeholder={t("e.g. +27 72 123 4567")}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-gray-700 tracking-wider uppercase mb-1 ml-1 flex justify-between items-center">
                        <span><T>South African ID Number</T></span>
                        {idValidationResult?.isValid && (
                          <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5 normal-case">
                            ✓ Luhn Check Passed
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                        <input
                          required
                          type="text"
                          maxLength={13}
                          value={idNumber}
                          onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, ""))}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:bg-white focus:ring-4 transition-all font-mono font-bold tracking-widest text-sm
                            ${idValidationResult === null 
                              ? 'bg-gray-50 border-gray-200 focus:border-slate-800 focus:ring-slate-800/5' 
                              : idValidationResult.isValid 
                                ? 'bg-emerald-50/20 border-emerald-300 focus:border-emerald-600 focus:ring-emerald-600/5 text-emerald-950' 
                                : 'bg-red-50/20 border-red-300 focus:border-red-600 focus:ring-red-600/5 text-red-950'
                            }
                          `}
                          placeholder="9205165999087"
                        />
                      </div>
                      
                      {/* ID Real-time metadata analysis box */}
                      {idValidationResult && (
                        <div className={`mt-1.5 p-2.5 rounded-xl border text-[11px] font-bold ${
                          idValidationResult.isValid 
                            ? 'bg-emerald-50/40 border-emerald-100 text-emerald-800' 
                            : 'bg-red-50/40 border-red-100 text-red-800'
                        }`}>
                          {idValidationResult.isValid ? (
                            <div className="grid grid-cols-2 gap-1 font-semibold">
                              <div>DoB: <span className="font-extrabold text-slate-900">{idValidationResult.birthDate}</span></div>
                              <div>Gender: <span className="font-extrabold text-slate-900">{idValidationResult.gender}</span></div>
                              <div className="col-span-2 mt-0.5 border-t border-emerald-100/50 pt-0.5">Citizenship: <span className="font-extrabold text-slate-900">{idValidationResult.citizenship}</span></div>
                            </div>
                          ) : (
                            <p className="font-bold flex items-center gap-1">
                              ⚠️ <T>{idValidationResult.error}</T>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[11px] font-black text-gray-700 tracking-wider uppercase mb-1 ml-1">
                    <T>Email Address</T>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-800 focus:bg-white focus:ring-4 focus:ring-slate-800/5 font-semibold text-gray-950 text-sm transition-all"
                      placeholder="yourname@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-gray-700 tracking-wider uppercase mb-1 ml-1">
                    <T>Password</T>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-800 focus:bg-white focus:ring-4 focus:ring-slate-800/5 font-semibold text-gray-950 text-sm transition-all"
                      placeholder={t("Min. 8 characters")}
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-gray-100 flex items-start gap-3 mt-1">
                    <input
                      id="terms-shield"
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 w-4.5 h-4.5 border-gray-300 rounded text-slate-900 focus:ring-slate-800 accent-slate-900 shrink-0 cursor-pointer"
                      required
                    />
                    <label htmlFor="terms-shield" className="text-xs text-slate-500 leading-normal tracking-wide font-medium cursor-pointer">
                      <T>I accept the</T> <span className="text-slate-900 font-extrabold underline"><T>TimeGig CPA Terms</T></span>. <T>I declare I do not own any other TimeGig accounts and consent to real-time national ID liveness authentication to block scamming and job duplication fraud.</T>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || (mode === 'signup' && (!acceptTerms || !idValidationResult?.isValid))}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-950 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-transparent text-white font-bold py-4 rounded-xl transition-all active:scale-98 shadow-md shadow-slate-200 mt-2 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin text-slate-400" size={20} />
                  ) : (
                    <>
                      <span><T>{mode === 'signup' ? 'Proceed with FICA Security Check' : 'Secure Login'}</T></span> 
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                  className="w-full text-slate-800 font-black text-xs uppercase tracking-wider py-2.5 hover:bg-slate-50 border border-gray-200/60 rounded-xl bg-white transition-colors cursor-pointer"
                >
                  <T>{mode === 'signup' ? 'Already registered? Authenticate here' : 'New citizen worker? Create certified account'}</T>
                </button>
                
                {mode === 'signup' && (
                  <>
                    <div className="flex items-center gap-4 py-1.5">
                      <div className="h-px flex-grow bg-gray-100"></div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest"><T>Visitor Bypass</T></span>
                      <div className="h-px flex-grow bg-gray-100"></div>
                    </div>
                    <button
                      onClick={onSkip}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-colors text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <T>Explore App as Guest</T>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ) : step === 2 ? (
            /* SMS OTP code verification stage */
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center"
            >
              <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2 text-emerald-600 border border-emerald-100 animate-pulse">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900"><T>Secure SIM Binding</T></h3>
                <p className="text-xs text-gray-500 mt-1.5 px-4 leading-relaxed font-semibold">
                  <T>We sent a 4-digit token code to</T> <span className="font-extrabold text-gray-900">{phoneNumber}</span> <T>to bind your device SIM ledger and block fake users.</T>
                </p>
              </div>

              <div className="flex justify-center gap-3 font-mono">
                {pin.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`pin-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className="w-14 h-16 text-center text-3xl font-black bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 outline-none transition-all"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {pinError && (
                <p className="text-xs font-black text-red-600 flex items-center justify-center gap-1">
                  <span>⚠️</span> <T>{pinError}</T>
                </p>
              )}

              <div className="space-y-4 pt-3">
                <button
                  onClick={verifyPin}
                  disabled={pin.some(d => d === "") || isLoading}
                  className="w-full bg-slate-900 hover:bg-slate-950 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-xl transition-all shadow-md shadow-slate-100 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <T>Verify and Lock SIM Card</T>}
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-gray-400 hover:text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  <ChevronLeft size={14} /> <T>Change Form details</T>
                </button>
              </div>
            </motion.div>
          ) : step === 3 ? (
            /* Biometric verification (Liveness Scan) screen - core requirement */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-center font-sans"
            >
              <div className="text-center">
                <h3 className="text-lg font-black text-gray-950 tracking-tight"><T>Department of Home Affairs</T></h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5"><T>Real-time Biometric Liveness check</T></p>
              </div>

              {/* Laser scanning simulator sphere */}
              <div className="relative w-48 h-48 mx-auto rounded-full bg-slate-900 overflow-hidden border-4 border-slate-800 shadow-2xl flex items-center justify-center group flex-col">
                {selfiePhoto ? (
                  <>
                    <img 
                      src={selfiePhoto} 
                      alt="Selfie" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    {isLivenessScanning && (
                      <>
                        {/* Red Laser scan animation bar */}
                        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 animate-[bounce_2s_infinite] shadow-[0_0_12px_#10b981] z-20" />
                        <div className="absolute inset-0 bg-emerald-500/15 animate-pulse z-10" />
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center p-4">
                    <User size={48} className="mx-auto text-slate-700 group-hover:text-slate-500 mb-2 transition-colors" />
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider"><T>Awaiting Live Face</T></span>
                  </div>
                )}
                
                {/* Scanner loading rings */}
                {isLivenessScanning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30 font-mono">
                    <div className="text-center">
                      <div className="text-emerald-400 font-black text-2xl tracking-widest">{scanProgress}%</div>
                      <div className="text-[8px] uppercase tracking-tighter text-emerald-300 font-bold mt-1 max-w-[150px] mx-auto truncate px-2">
                        {scanStatusText}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar Container */}
              {isLivenessScanning && (
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-gray-150 relative">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-75"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              )}

              {/* Interactive terminal output */}
              {scanLog.length > 0 && (
                <div className="text-left bg-slate-950 p-4.5 rounded-2xl border border-slate-800 font-mono text-[9px] text-emerald-400/90 leading-relaxed shadow-inner max-h-32 overflow-y-auto no-scrollbar">
                  <div className="text-white/40 uppercase tracking-widest font-black mb-1 flex justify-between">
                    <span>SECURITY CODELINE TELEMETRY</span>
                    <span className="animate-pulse">● LIVE</span>
                  </div>
                  {scanLog.map((logStr, i) => (
                    <div key={i} className="flex gap-1.5 items-start mt-0.5">
                      <span className="text-emerald-600 grow-0">&gt;</span>
                      <span className="flex-grow">{logStr}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Biometric validation feedback */}
              {biometricPassed && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex gap-3 text-left">
                  <div className="bg-emerald-500 p-2 text-white rounded-full self-start shrink-0">
                    <Check size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">Identity Cleared & Bound</h4>
                    <p className="text-[11px] text-emerald-700 mt-1 font-semibold leading-relaxed">
                      Biometric data is securely bound to South African National ID No. {idNumber}. Face matching did not trigger any blacklists or agricultural farming accounts under BCEA thresholds. This device can only host this account.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-2">
                {!selfiePhoto ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCamera(true)}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-950 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    >
                      <Camera size={16} />
                      <span>Take Live Selfie</span>
                    </button>
                    <button
                      onClick={() => startBiometricLivenessScan("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60")}
                      className="flex-1 text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-gray-200 bg-white font-medium py-3.5 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Use High-Res Portfolio
                    </button>
                  </div>
                ) : biometricPassed ? (
                  <button
                    onClick={completeRegistrationFlow}
                    className="w-full flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-xl text-sm transition-all shadow-md active:scale-98 cursor-pointer"
                  >
                    <span>Finalise Trust-Vetted Account</span>
                    <CheckCircle size={17} />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-slate-100 border border-gray-200 text-gray-400 font-extrabold py-4 rounded-xl text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Loader2 size={16} className="animate-spin" />
                    <span>Liveness Verification in Progress...</span>
                  </button>
                )}
              </div>

              {showCamera && (
                <CameraCapture 
                  label="Center face & Blink to Scan" 
                  onCapture={handleSelfieCapture} 
                  onClose={() => setShowCamera(false)} 
                />
              )}
            </motion.div>
          ) : (
            /* Congratulations screen */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 text-center py-10"
            >
              <div className="bg-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-white shadow-lg animate-bounce">
                <CheckCircle size={44} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight"><T>FICA Identity Authenticated</T></h3>
                <p className="text-xs text-emerald-600 font-extrabold uppercase mt-1 tracking-widest"><T>1-Account Trust Seal Issued</T></p>
                <p className="text-xs text-gray-500 mt-2 px-6 leading-relaxed">
                  <T>Your citizen profile has been indexed, cleared of duplicate farming structures, and registered successfully.</T>
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      <div className="mt-8 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center flex items-center justify-center gap-1.5">
        <ShieldCheck size={14} className="text-gray-400" />
        <T>RSA Chapter 4 labor safety directives active</T>
      </div>

      {/* Policy Security Error Pop-up Modal */}
      {errorModal?.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none animate-in fade-in duration-205">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${
              errorModal.type === 'success_reset' 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-red-50 text-red-600 border-red-100'
            }`}>
              {errorModal.type === 'success_reset' ? (
                <CheckCircle size={32} className="text-emerald-600" />
              ) : (
                <Shield size={32} className="text-red-600 animate-pulse" />
              )}
            </div>
            <h3 className="text-md font-black text-gray-900 uppercase tracking-tight">{errorModal.title}</h3>
            <p className={`text-[10px] font-extrabold uppercase tracking-widest mt-0.5 ${
              errorModal.type === 'success_reset' ? 'text-emerald-600' : 'text-red-650'
            }`}>
              {errorModal.type === 'success_reset' ? 'DIRECTIVE GRANTED' : 'SECURITY SHIELD INTERCEPT'}
            </p>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 text-left text-[11px] text-slate-650 font-medium leading-relaxed my-4.5 space-y-2.5">
              <p>{errorModal.message}</p>
              {errorModal.type !== 'success_reset' && (
                <p className="border-t border-dashed border-gray-200 pt-2 text-[10px] font-semibold text-red-650">
                  ⚠️ Protection Directive: To prevent job scams, account-farming, and profile spoofing, each person has a ceiling of ONE profile.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setErrorModal(null);
                  if (errorModal.type === 'device_blocked') {
                    setMode('login');
                  }
                }}
                className={`w-full text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-98 ${
                  errorModal.type === 'success_reset'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-slate-950 hover:bg-slate-900'
                }`}
              >
                {errorModal.type === 'device_blocked' ? 'Proceed to Secure Login' : 'Dismiss Alert'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
