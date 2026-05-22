import React, { useState } from 'react';
import { 
  Wallet, 
  Coins, 
  PlusCircle, 
  Copy, 
  Check, 
  Upload, 
  FileCheck, 
  AlertCircle, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  X
} from 'lucide-react';
import { T } from './TranslationProvider';

interface WalletViewProps {
  coins: number;
  setCoins: (coins: number | ((prev: number) => number)) => void;
  transactions: any[];
  onAddTransaction: (tx: any) => void;
}

interface TopupPackage {
  id: string;
  coins: number;
  price: string;
  expiry: string;
}

export function WalletView({ coins, setCoins, transactions, onAddTransaction }: WalletViewProps) {
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TopupPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'paystack'>('bank');
  
  // File upload state for Proof of Payment (PoP)
  const [popFile, setPopFile] = useState<File | null>(null);
  const [popPreview, setPopPreview] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Success flow state
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const topupPackages: TopupPackage[] = [
    { id: 'pkg-20', coins: 20, price: 'R5,00', expiry: '30 days' },
    { id: 'pkg-50', coins: 50, price: 'R14,99', expiry: '30 days' },
    { id: 'pkg-100', coins: 100, price: 'R24,99', expiry: '30 days' },
    { id: 'pkg-200', coins: 200, price: 'R34,99', expiry: '30 days' },
    { id: 'pkg-500', coins: 500, price: 'R55,99', expiry: '2 months' },
    { id: 'pkg-1000', coins: 1000, price: 'R149,55', expiry: '2 months' }
  ];

  const handleCopyText = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPopFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPopPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPopPreview(null);
      }
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !popFile) return;

    setIsSubmitting(true);

    const priceZAR = selectedPackage.id === 'pkg-20' ? 5.00 
                   : selectedPackage.id === 'pkg-50' ? 14.99 
                   : selectedPackage.id === 'pkg-100' ? 24.99 
                   : selectedPackage.id === 'pkg-200' ? 34.99 
                   : selectedPackage.id === 'pkg-500' ? 55.99 
                   : selectedPackage.id === 'pkg-1000' ? 149.55 
                   : 0;

    // Simulate process
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessMessage(true);

      // Create a pending Admin Payment
      const newTx = {
        id: `tx-${Date.now()}`,
        userRef: 'usr-lucihano',
        userName: 'Lucihano Matthews',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
        coinsAmount: selectedPackage.coins,
        priceZAR: priceZAR,
        reference: `${selectedPackage.coins} coins`,
        popUrl: popPreview || undefined,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        status: 'pending' as const,
        type: 'deposit' as const,
        amount: selectedPackage.coins,
        description: `Refill Package: ${selectedPackage.coins} Coins`,
      };

      onAddTransaction(newTx);
    }, 1500);
  };

  const resetModalState = () => {
    setShowTopupModal(false);
    setSelectedPackage(null);
    setPaymentMethod('bank');
    setPopFile(null);
    setPopPreview(null);
    setShowSuccessMessage(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Coin Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-slate-800 to-indigo-950 p-6 md:p-8 text-white shadow-xl border border-white/10">
        
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-xs font-black tracking-widest text-emerald-400 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <T>Verified Secure Wallet</T>
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black tracking-tight">{coins}</span>
              <span className="text-lg font-bold text-gray-300"><T>South African Coins (ZAR)</T></span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-md">
              <T>Apply to jobs and buy corporate tenders instantly in Mzansi. Get 100% money back if your bids or job applications are unsuccessful.</T>
            </p>
          </div>

          <button
            onClick={() => setShowTopupModal(true)}
            className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-extrabold text-sm px-6 py-4 rounded-2xl shadow-lg hover:shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle size={18} />
            <T>Top Up Coins Balance</T>
          </button>
        </div>

        {/* Security badges */}
        <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            <T>Capitec Bank Certified</T>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-yellow-400" />
            <T>24h verification turn-around</T>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <Wallet size={18} className="text-indigo-600" />
            <T>Transaction History</T>
          </h3>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            <T>Local Device Cache</T>
          </span>
        </div>

        <div className="divide-y divide-gray-50">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-4 flex justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${
                  tx.type === 'deposit' 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-rose-50 text-rose-600'
                }`}>
                  {tx.type === 'deposit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900"><T>{tx.description}</T></h4>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={12} /> <T>{tx.date}</T>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className={`font-black text-sm block ${
                  tx.type === 'deposit' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {tx.type === 'deposit' ? '+' : '-'}{tx.amount}
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                  <T>{tx.status}</T>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topup Main Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-gray-150 animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Coins className="text-yellow-500 animate-bounce" size={22} />
                <div>
                  <h3 className="font-extrabold text-lg text-gray-900"><T>Buy Coins Wallet Refills</T></h3>
                  <p className="text-xs text-gray-500"><T>Pick a secure Rand package below & continue to payment</T></p>
                </div>
              </div>
              <button 
                type="button"
                onClick={resetModalState} 
                className="bg-gray-200/60 hover:bg-gray-300/80 rounded-full p-2 transition-colors cursor-pointer text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            {!showSuccessMessage ? (
              <div className="p-6 space-y-6">
                
                {/* Step 1: Select Package */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase block">
                    <T>Step 1: Choose Your Pack</T>
                  </span>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {topupPackages.map((pkg) => {
                      const isSelected = selectedPackage?.id === pkg.id;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setSelectedPackage(pkg)}
                          className={`relative border-2 rounded-2xl p-4 text-left transition-all ${
                            isSelected 
                              ? 'border-emerald-600 bg-emerald-50/40 text-gray-900 shadow-sm' 
                              : 'border-gray-100 hover:border-gray-200 bg-white text-gray-700'
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute top-2 right-2 bg-emerald-600 text-white rounded-full p-0.5">
                              <Check size={10} strokeWidth={4} />
                            </span>
                          )}
                          <div className="text-lg font-black tracking-tight"><T>{pkg.coins} Coins</T></div>
                          <div className="text-emerald-700 font-extrabold text-xs mt-1"><T>{pkg.price}</T></div>
                          <div className="text-[10px] font-semibold text-gray-400 mt-2 flex items-center gap-1">
                            <Clock size={10} /> <T>Exp</T>: <T>{pkg.expiry}</T>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Payment Provider Tab */}
                {selectedPackage && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase block mb-3">
                        <T>Step 2: Choose Payment Gateway</T>
                      </span>
                      
                      <div className="grid grid-cols-2 gap-3">
                        
                        {/* Bank Transfer */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('bank')}
                          className={`border-2 rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-all ${
                            paymentMethod === 'bank'
                              ? 'border-emerald-600 bg-emerald-50/30'
                              : 'border-gray-100 bg-white hover:border-gray-200'
                          }`}
                        >
                          <CreditCard className={paymentMethod === 'bank' ? 'text-emerald-600' : 'text-gray-400'} size={24} />
                          <div>
                            <div className="font-bold text-sm"><T>Capitec Bank EFT</T></div>
                            <div className="text-[10px] text-gray-400 font-semibold"><T>Immediate POP Upload</T></div>
                          </div>
                        </button>

                        {/* Paystack */}
                        <div className="relative border border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 text-center bg-gray-50/50 cursor-not-allowed opacity-70">
                          <span className="absolute -top-2.5 bg-yellow-400 text-yellow-950 px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase border border-white">
                            <T>In Process</T>
                          </span>
                          <CreditCard className="text-gray-300" size={24} />
                          <div>
                            <div className="font-bold text-sm text-gray-400"><T>Paystack Card Pay</T></div>
                            <div className="text-[10px] text-gray-400 font-semibold"><T>Integration pending approval</T></div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Step 3: Action and Bank Info */}
                    {paymentMethod === 'bank' && (
                      <div className="bg-slate-50 rounded-2xl p-4 md:p-5 border border-slate-100 space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-xs shrink-0">
                            C
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-800"><T>Direct Deposit Instructions</T></h4>
                            <p className="text-[10px] font-semibold text-gray-500"><T>Cape Town & Johannesburg Branch</T></p>
                          </div>
                        </div>

                        {/* Capitec parameters box */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-700 font-medium">
                          <div className="bg-white border rounded-xl p-3 flex justify-between items-center gap-2">
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 block uppercase"><T>Bank Name</T></span>
                              <strong className="text-slate-800 font-extrabold text-sm"><T>Capitec</T></strong>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyText('Capitec', 'bank')}
                              className="text-slate-400 hover:text-slate-600 p-1"
                            >
                              {copiedField === 'bank' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                            </button>
                          </div>

                          <div className="bg-white border rounded-xl p-3 flex justify-between items-center gap-2">
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 block uppercase"><T>Account Number</T></span>
                              <strong className="text-slate-800 font-extrabold text-sm">1334067366</strong>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyText('1334067366', 'account')}
                              className="text-slate-400 hover:text-slate-600 p-1"
                            >
                              {copiedField === 'account' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                            </button>
                          </div>

                          <div className="bg-white border rounded-xl p-3 flex justify-between items-center gap-2 col-span-1">
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 block uppercase"><T>Account Holder</T></span>
                              <strong className="text-slate-800 font-extrabold text-sm"><T>Matthews</T></strong>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyText('Matthews', 'name')}
                              className="text-slate-400 hover:text-slate-600 p-1"
                            >
                              {copiedField === 'name' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                            </button>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex justify-between items-center gap-2 col-span-1">
                            <div>
                              <span className="text-[9px] font-bold text-yellow-700 block uppercase"><T>Required Reference</T></span>
                              <strong className="text-yellow-900 font-extrabold text-sm"><T>{selectedPackage.coins} coins</T></strong>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyText(`${selectedPackage.coins} coins`, 'ref')}
                              className="text-yellow-600 hover:text-yellow-800 p-1"
                            >
                              {copiedField === 'ref' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>

                        {/* File Upload Box */}
                        <form onSubmit={handleSubmitProof} className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-800 block">
                              <T>Upload Proof of Payment (PoP)</T>
                            </label>
                            
                            <div className="border-2 border-dashed border-gray-200 bg-white rounded-2xl p-4 text-center hover:bg-slate-50/50 transition-colors relative cursor-pointer group">
                              <input 
                                type="file" 
                                required
                                accept="image/*,application/pdf" 
                                onChange={handleFileChange} 
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                              
                              {popFile ? (
                                <div className="space-y-2 py-2 flex flex-col items-center">
                                  {popPreview ? (
                                    <img src={popPreview} alt="Receipt preview" className="w-16 h-16 object-cover rounded-xl border" />
                                  ) : (
                                    <FileCheck className="text-green-600 mx-auto" size={32} />
                                  )}
                                  <div>
                                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{popFile.name}</p>
                                    <p className="text-[10px] text-gray-400 font-semibold">{(popFile.size / 1024).toFixed(1)} KB — <T>Tap to replace</T></p>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-1.5 py-4">
                                  <Upload className="text-gray-400 mx-auto group-hover:scale-110 transition-transform" size={28} />
                                  <div className="text-xs">
                                    <T>Choose a receipt file or drag & drop here</T>
                                  </div>
                                  <p className="text-[10px] text-gray-400 font-medium">JPEG, PNG <T>or</T> PDF (<T>Max 10MB</T>)</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting || !popFile}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 cursor-pointer text-sm"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <T>Uploading Receipt & Validating...</T>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={16} />
                                <T>Submit Proof of Payment</T>
                              </>
                            )}
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              // Success Screen Tab
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-200">
                  <CheckCircle2 className="text-green-600" size={36} />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xl font-extrabold text-gray-900"><T>Proof Submitted Successfully!</T></h4>
                  <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                     <T>Your Capitec bank transfer receipt for</T> <strong className="text-slate-800"><T>{selectedPackage?.coins}</T> <T>Coins refill</T> (<T>{selectedPackage?.price}</T>)</strong> <T>with reference</T> <strong className="text-slate-800">"<T>{selectedPackage?.coins} coins</T>"</strong> <T>is queued for admin review.</T>
                  </p>
                  <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl text-xs font-bold border border-emerald-200/50 max-w-md mx-auto mt-4 leading-normal">
                    💡 <strong><T>Test Drive Admin Flow:</T></strong> <T>To approve or reject this payment immediately, click **More (or your avatar photo) ➔ Admin Panel** in the top menu bar! You can see full accounting statistics there.</T>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={resetModalState}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl transition-all px-6 text-sm"
                  >
                    <T>Got it, Thank You</T>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
