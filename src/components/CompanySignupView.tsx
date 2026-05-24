import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Building2,
  UploadCloud,
  CheckCircle,
  XCircle,
  ArrowRight,
  FileText,
  X,
  ShieldCheck,
} from "lucide-react";

import { T } from './TranslationProvider';

interface CompanySignupViewProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function CompanySignupView({
  onComplete,
  onSkip,
}: CompanySignupViewProps) {
  const [step, setStep] = useState(1); // 1: Landing, 2: Form, 3: Success/Failure
  const [isLoginView, setIsLoginView] = useState(() => {
    const saved = localStorage.getItem("timegig_company_login_view") === "true";
    localStorage.removeItem("timegig_company_login_view");
    return saved;
  });
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [documents, setDocuments] = useState<{ name: string; type: string }[]>(
    [],
  );
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "checking" | "approved" | "declined"
  >("idle");
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
        localStorage.setItem("timegig_company_logo", event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyEmail || !password) return;

    setIsLoginLoading(true);
    setTimeout(() => {
      setIsLoginLoading(false);
      onComplete();
    }, 2000);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocs = Array.from(e.target.files).map((file: File) => ({
        name: file.name,
        type: file.name.split(".").pop()?.toLowerCase() || "",
      }));
      setDocuments((prev) => [...prev, ...newDocs]);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || documents.length === 0) return;

    setStatus("checking");

    setTimeout(() => {
      // Simple validation: strictly checks if all docs are pdf, doc, or docx
      const validExtensions = ["pdf", "doc", "docx"];
      const hasInvalidDocs = documents.some(
        (doc) => !validExtensions.includes(doc.type),
      );

      if (hasInvalidDocs || documents.length < 2) {
        setStatus("declined");
      } else {
        setStatus("approved");
      }
    }, 2500); // simulate checking docs
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-slate-900 to-indigo-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <Building2 size={48} className="mx-auto text-white mb-4" />
          <h1 className="text-3xl font-black text-white mb-2">
            <T>Company Portal</T>
          </h1>
          <p className="text-indigo-200 text-sm">
            <T>Join TimeGig's network of vetted businesses</T>
          </p>
        </div>

        <div className="p-8">
          {step === 1 && !isLoginView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
                <div className="space-y-4 text-center mb-8">
                <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold mb-2">
                  <ShieldCheck size={14} />
                  <T>100% Verified & Legitimate Platform</T>
                </div>
                <p className="text-gray-600 font-medium">
                  <T>Register your company to access exclusive tenders, post jobs, and hire verified local professionals securely.</T>
                </p>
                <div className="bg-indigo-50 p-4 rounded-xl text-left border border-indigo-100">
                  <h4 className="font-bold text-indigo-900 text-sm mb-2">
                    <T>Required Documents</T>:
                  </h4>
                  <ul className="text-xs text-indigo-800 space-y-1 ml-4 list-disc font-medium">
                    <li><T>Company Registration (CIPC)</T></li>
                    <li><T>Valid Tax Clearance Certificate</T></li>
                    <li>(<T>PDF, DOC, or DOCX formats only</T>)</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-md shadow-indigo-200"
                >
                  <T>Apply Now</T> <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => setIsLoginView(true)}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3.5 rounded-xl transition-colors border border-indigo-200"
                >
                  <T>Log In to Account</T>
                </button>
                <button
                  onClick={onSkip}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-colors"
                >
                  <T>Skip and Explore App</T>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("timegig_registration_type", "user");
                    window.location.reload();
                  }}
                  className="w-full bg-transparent hover:bg-slate-100 text-slate-500 text-sm font-bold py-3 rounded-xl transition-colors"
                >
                  <T>Back to User Account</T>
                </button>
              </div>
            </motion.div>
          )}

          {isLoginView && step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900"><T>Welcome Back</T></h3>
                <p className="text-sm text-gray-500"><T>Log in to your workspace</T></p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    <T>Company Email</T>
                  </label>
                    <input
                      required
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 font-medium"
                      placeholder="name@company.com"
                    />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    <T>Password</T>
                  </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 font-medium"
                      placeholder="••••••••"
                    />
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoginLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-md shadow-indigo-200 text-sm flex items-center justify-center gap-2"
                  >
                    {isLoginLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <T>Authenticating...</T>
                      </>
                    ) : (
                      <T>Log In</T>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLoginView(false)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-colors text-sm"
                  >
                    <T>Back to Registration</T>
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 2 && status === "idle" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <form onSubmit={handleApply} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    <T>Company Name</T>
                  </label>
                    <input
                      required
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 font-medium"
                      placeholder="e.g. Acme Corp Pty Ltd"
                    />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    <T>Email Address</T>
                  </label>
                    <input
                      required
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 font-medium"
                      placeholder="info@company.co.za"
                    />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    <T>Company Logo</T>
                  </label>
                  <label className="flex items-center gap-4 p-3 bg-slate-50 border border-gray-200 rounded-xl cursor-pointer hover:border-indigo-500">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {logo ? (
                        <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <UploadCloud className="text-gray-400" />
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      <T>Upload logo</T>
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    <T>Upload Documents (Min. 2)</T>
                  </label>

                  {documents.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-3 bg-slate-50 border border-gray-200 rounded-xl"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText
                              size={16}
                              className="text-gray-500 shrink-0"
                            />
                            <span className="text-xs font-medium text-gray-800 truncate">
                              <T>{doc.name}</T>
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocument(idx)}
                            className="p-1 hover:bg-red-100 rounded-full text-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-slate-50 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,image/*"
                      className="hidden"
                      onChange={handleDocumentUpload}
                    />
                    <UploadCloud size={24} className="mb-2 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-600">
                      <T>Tap to upload documents</T>
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      <T>Files supported: PDF, DOCX</T>
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl transition-all active:scale-95"
                  >
                    <T>Back</T>
                  </button>
                  <button
                    type="submit"
                    disabled={!companyName || documents.length < 2}
                    className="bg-slate-900 hover:bg-slate-800 disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-md shadow-slate-300 flex-grow"
                  >
                    <T>Submit Application</T>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("timegig_registration_type", "user");
                    window.location.reload();
                  }}
                  className="w-full bg-transparent hover:bg-slate-100 text-slate-500 text-sm font-bold py-3 rounded-xl transition-colors"
                >
                  <T>Back to User Account</T>
                </button>
              </form>
            </motion.div>
          )}

          {status === "checking" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-bold text-gray-900">
                <T>Verifying Documents...</T>
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                <T>Checking company registration and tax clearance.</T>
              </p>
            </motion.div>
          )}

          {status === "declined" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <XCircle size={64} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                <T>Application Declined</T>
              </h3>
              <p className="text-sm text-gray-600 mb-8">
                <T>Your verification failed. Ensure you have uploaded at least two valid PDF or DOCX documents (e.g. CIPC Registration and Tax Clearance). Unsupported formats like Images will be rejected.</T>
              </p>
              <button
                onClick={() => {
                  setStatus("idle");
                  setDocuments([]);
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-xl transition-colors"
              >
                <T>Try Again</T>
              </button>
            </motion.div>
          )}

          {status === "approved" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                <T>Congratulations!</T>
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                <T>Your company application has been approved. Welcome to the Mzansi TimeGig network!</T>
              </p>
              
              <div className="bg-indigo-50 p-5 rounded-2xl text-left border border-indigo-100 mb-8">
                <h4 className="font-bold text-indigo-900 text-sm mb-3">
                  <T>Next Steps:</T>
                </h4>
                <ul className="text-xs text-indigo-800 space-y-2 list-decimal pl-4 font-medium">
                  <li><T>Complete your Company Profile in Settings.</T></li>
                  <li><T>Post your first job or tender notice.</T></li>
                  <li><T>Browse pro-worker gallery to find talent.</T></li>
                </ul>
              </div>

              <button
                onClick={onComplete}
                className="w-full flex justify-center items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all shadow-md shadow-green-200"
              >
                <T>Enter Workspace</T> <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
