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
  Loader2
} from "lucide-react";

import { T } from './TranslationProvider';

interface UserRegistrationViewProps {
  onComplete: (email: string) => void;
  onSkip: () => void;
}

export default function UserRegistrationView({ 
  onComplete, 
  onSkip
}: UserRegistrationViewProps) {
  const [step, setStep] = useState(1); // 1: Signup/Login Form, 2: PIN Verification, 3: Congratulations
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [pin, setPin] = useState(["", "", "", ""]);
  const [generatedPin, setGeneratedPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [showPinNotification, setShowPinNotification] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'signup') {
      if (!email || !password || !acceptTerms) return;

      setIsLoading(true);
      
      // Generate a random 4-pin
      const newPin = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedPin(newPin);

      // Simulate network delay
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
        // Simulate receiving the code "from the app" as requested
        setTimeout(() => {
          setShowPinNotification(true);
        }, 1000);
      }, 1500);
    } else {
      // Login mode
      if (!email || !password) return;
      setIsLoading(true);
      
      setTimeout(() => {
        setIsLoading(false);
        setStep(3);
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

    // Auto-focus next input
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
        onComplete(email);
      }, 1500);
    } else {
      setPinError("Invalid verification code. Please try again.");
      setPin(["", "", "", ""]);
      document.getElementById("pin-0")?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative">
      {/* Mock SMS/Notification for PIN */}
      <AnimatePresence>
        {showPinNotification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 mx-auto max-w-xs z-50 px-4"
          >
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 flex items-start gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <MessageSquare size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-indigo-300"><T>New Message</T></h4>
                <p className="text-sm font-medium mt-1"><T>Your TimeGig verification code is:</T> <span className="font-black text-lg tracking-widest text-indigo-400">{generatedPin}</span></p>
              </div>
              <button 
                onClick={() => setShowPinNotification(false)}
                className="text-white/40 hover:text-white"
              >
                <ShieldCheck size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <User size={48} className="mx-auto text-white mb-4" />
          <h1 className="text-3xl font-black text-white mb-2">
            <T>{mode === 'signup' ? 'User Signup' : 'User Login'}</T>
          </h1>
          <p className="text-indigo-200 text-sm">
            <T>{mode === 'signup' ? 'Create your local worker profile' : 'Welcome back to your local gig.'}</T>
          </p>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                      <T>Email Address</T>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium transition-all"
                        placeholder="yourname@gmail.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                      <T>Password</T>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium transition-all"
                        placeholder="Min. 8 characters"
                        minLength={8}
                      />
                    </div>
                  </div>
                </div>

                {mode === 'signup' && (
                    <div className="flex items-start gap-3 p-1">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 accent-indigo-600"
                        required
                      />
                      <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                        <T>I accept the</T> <span className="text-indigo-600 font-bold underline cursor-pointer"><T>Terms and Conditions</T></span> <T>and understand that my identity will be vetted for trust and safety.</T>
                      </label>
                    </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || (mode === 'signup' && !acceptTerms)}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-md shadow-indigo-100 mt-2"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <><T>{mode === 'signup' ? 'Sign Up' : 'Login'}</T> <ArrowRight size={18} /></>
                  )}
                </button>
              </form>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                  className="w-full text-indigo-600 font-bold text-xs uppercase tracking-wider py-2 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <T>{mode === 'signup' ? 'Already have an account? Login' : 'Need an account? Sign Up'}</T>
                </button>
                {mode === 'signup' && (
                    <>
                        <div className="flex items-center gap-4 py-2">
                          <div className="h-px flex-grow bg-gray-100"></div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"><T>Or</T></span>
                          <div className="h-px flex-grow bg-gray-100"></div>
                        </div>
                        <button
                          onClick={onSkip}
                          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors text-sm"
                        >
                          <T>Continue as Guest</T>
                        </button>
                    </>
                )}
              </div>
            </motion.div>
          ) : step === 2 ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 text-center"
            >
              <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2 text-indigo-600">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900"><T>Verify your identity</T></h3>
                <p className="text-sm text-gray-500 mt-1 px-4">
                  <T>We've sent a 4-digit code to your mobile device via the app.</T>
                </p>
              </div>

              <div className="flex justify-center gap-3">
                {pin.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`pin-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className="w-14 h-16 text-center text-3xl font-black bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none transition-all"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {pinError && (
                <p className="text-xs font-bold text-red-500"><T>{pinError}</T></p>
              )}

              <div className="space-y-4 pt-4">
                <button
                  onClick={verifyPin}
                  disabled={pin.some(d => d === "") || isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <T>Verify and Continue</T>}
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-gray-500 hover:text-indigo-600 font-bold text-sm transition-colors"
                >
                  <ChevronLeft size={16} /> <T>Change Email</T>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 text-center py-10"
            >
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle size={48} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900"><T>Congratulations!</T></h3>
                <p className="text-gray-500"><T>You have successfully logged in.</T></p>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      <div className="mt-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
        <T>Trusted by 5,000+ local South African professionals</T>
      </div>
    </div>
  );
}
