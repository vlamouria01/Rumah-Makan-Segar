import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, CheckCircle2, RefreshCw, X, ShieldAlert, Check } from 'lucide-react';

interface NonRobotVerificationProps {
  isVerified: boolean;
  onVerify: (verified: boolean) => void;
  language?: 'id' | 'en';
  className?: string;
  id?: string;
}

export const NonRobotVerification: React.FC<NonRobotVerificationProps> = ({
  isVerified,
  onVerify,
  language = 'id',
  className = '',
  id = 'non-robot-captcha'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  
  // Challenge states: Image puzzle / Food icon selector
  const [challengeType, setChallengeType] = useState<'math' | 'images'>('images');
  const [mathProblem, setMathProblem] = useState<{ num1: number; num2: number; answer: number }>({ num1: 3, num2: 4, answer: 7 });
  const [mathInput, setMathInput] = useState('');
  const [mathError, setMathError] = useState(false);

  // Food selection challenge
  const challengeImages = [
    { id: 1, isTarget: true, emoji: '🍲', label: 'Rawon' },
    { id: 2, isTarget: true, emoji: '🥣', label: 'Soto Ayam' },
    { id: 3, isTarget: false, emoji: '🚗', label: 'Mobil' },
    { id: 4, isTarget: true, emoji: '🍛', label: 'Nasi Goreng' },
    { id: 5, isTarget: false, emoji: '✈️', label: 'Pesawat' },
    { id: 6, isTarget: true, emoji: '🍹', label: 'Es Jeruk' },
    { id: 7, isTarget: false, emoji: '📱', label: 'Ponsel' },
    { id: 8, isTarget: true, emoji: '🍢', label: 'Sate' },
    { id: 9, isTarget: false, emoji: '⚽', label: 'Bola' },
  ];

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [challengeError, setChallengeError] = useState(false);

  // Generate math problem
  const generateNewMath = () => {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    setMathProblem({ num1: n1, num2: n2, answer: n1 + n2 });
    setMathInput('');
    setMathError(false);
  };

  const handleCheckboxClick = () => {
    if (isVerified) return;
    setIsLoading(true);
    
    // Simulate quick human behavior evaluation
    setTimeout(() => {
      // 80% direct success, or prompt challenge
      const needsChallenge = Math.random() < 0.25;
      setIsLoading(false);
      
      if (needsChallenge) {
        generateNewMath();
        setSelectedItems([]);
        setChallengeError(false);
        setShowChallengeModal(true);
      } else {
        if (navigator.vibrate) navigator.vibrate(50);
        onVerify(true);
      }
    }, 700);
  };

  const handleToggleItem = (itemId: number) => {
    setChallengeError(false);
    setSelectedItems(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleVerifyImageChallenge = () => {
    const targetIds = challengeImages.filter(img => img.isTarget).map(img => img.id);
    const correctCount = selectedItems.filter(id => targetIds.includes(id)).length;
    const incorrectCount = selectedItems.filter(id => !targetIds.includes(id)).length;

    if (correctCount >= 3 && incorrectCount === 0) {
      setShowChallengeModal(false);
      if (navigator.vibrate) navigator.vibrate(50);
      onVerify(true);
    } else {
      setChallengeError(true);
      if (navigator.vibrate) navigator.vibrate([80, 50, 80]);
    }
  };

  const handleVerifyMathChallenge = () => {
    if (parseInt(mathInput.trim(), 10) === mathProblem.answer) {
      setShowChallengeModal(false);
      if (navigator.vibrate) navigator.vibrate(50);
      onVerify(true);
    } else {
      setMathError(true);
      if (navigator.vibrate) navigator.vibrate([80, 50, 80]);
    }
  };

  const t = {
    notRobot: language === 'en' ? "I'm not a robot" : "Saya bukan robot",
    verifying: language === 'en' ? "Verifying..." : "Memverifikasi...",
    verified: language === 'en' ? "Verified" : "Terverifikasi",
    securityBadge: language === 'en' ? "RM Segar Security Protection" : "Proteksi Keamanan RM Segar",
    challengeTitle: language === 'en' ? "Human Verification Challenge" : "Verifikasi Manusia (Non-Robot)",
    challengeSubtitle: language === 'en' ? "Select all delicious food & drink items" : "Pilih semua gambar makanan atau minuman RM Segar",
    mathSubtitle: language === 'en' ? "Solve the simple arithmetic:" : "Jawab pertanyaan matematika sederhana:",
    verifyBtn: language === 'en' ? "Verify" : "Verifikasi Sekarang",
    errorMsg: language === 'en' ? "Please choose all correct items." : "Pilihan belum tepat, silakan coba lagi.",
    mathErrorMsg: language === 'en' ? "Incorrect answer, try again." : "Jawaban salah, silakan hitung kembali.",
  };

  return (
    <div id={id} className={`w-full ${className}`}>
      {/* Turnstile / reCAPTCHA Style Container */}
      <div 
        onClick={handleCheckboxClick}
        className={`p-3 sm:p-3.5 rounded-2xl border transition-all select-none flex items-center justify-between gap-3 cursor-pointer ${
          isVerified 
            ? 'bg-emerald-50/80 border-emerald-300 shadow-xs' 
            : 'bg-stone-50/90 hover:bg-stone-100/90 border-stone-200 shadow-2xs hover:border-stone-300'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Checkbox Box */}
          <div 
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all ${
              isVerified 
                ? 'bg-emerald-500 text-white shadow-xs' 
                : isLoading 
                ? 'bg-white border-2 border-orange-400' 
                : 'bg-white border-2 border-stone-300 hover:border-orange-500'
            }`}
          >
            {isVerified ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}>
                <Check className="w-5 h-5 stroke-[3]" />
              </motion.div>
            ) : isLoading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
                <RefreshCw className="w-4 h-4 text-orange-500" />
              </motion.div>
            ) : null}
          </div>

          <div className="text-left truncate">
            <p className={`text-xs sm:text-sm font-bold ${isVerified ? 'text-emerald-900 font-extrabold' : 'text-stone-800'}`}>
              {isVerified ? t.verified : isLoading ? t.verifying : t.notRobot}
            </p>
            <p className="text-[10px] text-stone-400 font-medium truncate">
              {isVerified ? 'Tervalidasi Aman' : 'Klik kotak untuk verifikasi'}
            </p>
          </div>
        </div>

        {/* Security Brand Logo */}
        <div className="flex flex-col items-end shrink-0 pl-2">
          <div className="flex items-center gap-1 text-stone-400">
            <ShieldCheck size={16} className={isVerified ? 'text-emerald-600' : 'text-orange-500'} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">CAPTCHA</span>
          </div>
          <span className="text-[8px] text-stone-400">{t.securityBadge}</span>
        </div>
      </div>

      {/* Interactive Verification Modal Challenge */}
      <AnimatePresence>
        {showChallengeModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChallengeModal(false)}
              className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-[9999]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-sm bg-white rounded-3xl shadow-2xl z-[9999] overflow-hidden border border-stone-100 text-left"
            >
              {/* Header */}
              <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">{t.challengeTitle}</h4>
                    <p className="text-[10px] text-stone-400 font-sans">RM Segar Bot Protection</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowChallengeModal(false)}
                  className="w-7 h-7 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Challenge Body */}
              <div className="p-5 space-y-4">
                {/* Challenge Switcher tabs */}
                <div className="flex bg-stone-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => { setChallengeType('images'); setChallengeError(false); }}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                      challengeType === 'images' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
                    }`}
                  >
                    Pilih Makanan 🍲
                  </button>
                  <button
                    type="button"
                    onClick={() => { setChallengeType('math'); setMathError(false); generateNewMath(); }}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                      challengeType === 'math' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
                    }`}
                  >
                    Hitung Cepat 🔢
                  </button>
                </div>

                {challengeType === 'images' ? (
                  <div className="space-y-3">
                    <div className="bg-orange-50 p-2.5 rounded-xl border border-orange-100">
                      <p className="text-xs font-bold text-orange-950">
                        {t.challengeSubtitle}
                      </p>
                    </div>

                    {/* 3x3 Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {challengeImages.map((img) => {
                        const isSelected = selectedItems.includes(img.id);
                        return (
                          <button
                            key={img.id}
                            type="button"
                            onClick={() => handleToggleItem(img.id)}
                            className={`h-20 rounded-2xl flex flex-col items-center justify-center p-2 relative transition-all border ${
                              isSelected 
                                ? 'bg-orange-100/90 border-orange-500 shadow-sm ring-2 ring-orange-500/20' 
                                : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-4 h-4 bg-orange-500 rounded-full text-white flex items-center justify-center">
                                <Check size={10} strokeWidth={3} />
                              </div>
                            )}
                            <span className="text-2xl mb-1 select-none">{img.emoji}</span>
                            <span className="text-[10px] font-bold text-stone-700 truncate w-full text-center">{img.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {challengeError && (
                      <p className="text-[11px] text-red-600 font-bold flex items-center gap-1">
                        <ShieldAlert size={12} />
                        <span>{t.errorMsg}</span>
                      </p>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedItems([])}
                        className="p-2.5 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 transition-all text-xs font-bold"
                        title="Reset pilihan"
                      >
                        <RefreshCw size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={handleVerifyImageChallenge}
                        className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all"
                      >
                        {t.verifyBtn}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-stone-100 p-3 rounded-2xl text-center space-y-2">
                      <p className="text-xs text-stone-600">{t.mathSubtitle}</p>
                      <div className="text-2xl font-black text-stone-900 tracking-wider font-mono">
                        {mathProblem.num1} + {mathProblem.num2} = ?
                      </div>
                    </div>

                    <input 
                      type="number"
                      placeholder="Ketik hasil perhitungan"
                      value={mathInput}
                      onChange={(e) => { setMathInput(e.target.value); setMathError(false); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleVerifyMathChallenge(); }}
                      className="w-full text-center bg-stone-50 border border-stone-200 rounded-xl py-2.5 text-base font-bold text-stone-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />

                    {mathError && (
                      <p className="text-[11px] text-red-600 font-bold flex items-center justify-center gap-1">
                        <ShieldAlert size={12} />
                        <span>{t.mathErrorMsg}</span>
                      </p>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={generateNewMath}
                        className="p-2.5 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 transition-all text-xs font-bold"
                        title="Soal baru"
                      >
                        <RefreshCw size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={handleVerifyMathChallenge}
                        className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all"
                      >
                        {t.verifyBtn}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
