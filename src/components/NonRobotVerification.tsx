import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, RefreshCw, AlertCircle, ShieldCheck, X, Volume2, HelpCircle } from 'lucide-react';

interface NonRobotVerificationProps {
  isVerified: boolean;
  onVerify: (verified: boolean, token?: string) => void;
  language?: 'id' | 'en' | 'zh';
  className?: string;
  id?: string;
}

// 3x3 Challenge dataset
const CHALLENGES = [
  {
    target: 'mie',
    title: {
      id: 'Pilih semua gambar yang memuat MIE atau BAKMIE',
      en: 'Select all squares with NOODLES',
      zh: '选择所有包含面条的方块'
    },
    hint: 'Klik verifikasi setelah semua gambar yang cocok dipilih',
    items: [
      { id: 1, label: 'Bakmie Keriting', emoji: '🍜', category: 'mie' },
      { id: 2, label: 'Kwetiao Goreng', emoji: '🍝', category: 'mie' },
      { id: 3, label: 'Es Teh Manis', emoji: '🧋', category: 'minuman' },
      { id: 4, label: 'Bakmie Kepiting', emoji: '🍲', category: 'mie' },
      { id: 5, label: 'Nasi Capcay', emoji: '🍚', category: 'nasi' },
      { id: 6, label: 'Liang Teh', emoji: '🍵', category: 'minuman' },
      { id: 7, label: 'Bihun Bebek', emoji: '🥣', category: 'mie' },
      { id: 8, label: 'Pangsit Goreng', emoji: '🥟', category: 'snack' },
      { id: 9, label: 'Es Jeruk Pontianak', emoji: '🍊', category: 'minuman' },
    ]
  },
  {
    target: 'minuman',
    title: {
      id: 'Pilih semua gambar yang memuat MINUMAN SEGAR',
      en: 'Select all squares with BEVERAGES / DRINKS',
      zh: '选择所有包含清凉饮品的方块'
    },
    hint: 'Klik verifikasi setelah semua gambar yang cocok dipilih',
    items: [
      { id: 1, label: 'Liang Teh Medan', emoji: '🍵', category: 'minuman' },
      { id: 2, label: 'Bakmie Ayam Jamur', emoji: '🍜', category: 'mie' },
      { id: 3, label: 'Es Sonkit Kasturi', emoji: '🍹', category: 'minuman' },
      { id: 4, label: 'Nasi Goreng Yang Chow', emoji: '🍛', category: 'nasi' },
      { id: 5, label: 'Es Cincau Hitam', emoji: '🥤', category: 'minuman' },
      { id: 6, label: 'Bakso Ikan Kuah', emoji: '🍲', category: 'sup' },
      { id: 7, label: 'Es Jeruk Pontianak', emoji: '🍊', category: 'minuman' },
      { id: 8, label: 'Kwetiao Siram Sapi', emoji: '🍝', category: 'mie' },
      { id: 9, label: 'Badak Sarsaparilla', emoji: '🧃', category: 'minuman' },
    ]
  },
  {
    target: 'nasi',
    title: {
      id: 'Pilih semua gambar yang memuat OLAHAN NASI',
      en: 'Select all squares with RICE DISHES',
      zh: '选择所有包含米饭料理的方块'
    },
    hint: 'Klik verifikasi setelah semua gambar yang cocok dipilih',
    items: [
      { id: 1, label: 'Nasi Goreng Spesial', emoji: '🍛', category: 'nasi' },
      { id: 2, label: 'Es Teh Manis', emoji: '🧋', category: 'minuman' },
      { id: 3, label: 'Nasi Capcay Seafood', emoji: '🍚', category: 'nasi' },
      { id: 4, label: 'Bakmie Pangsit', emoji: '🍜', category: 'mie' },
      { id: 5, label: 'Nasi Hainam Bebek', emoji: '🍱', category: 'nasi' },
      { id: 6, label: 'Kwetiao Bun Sapi', emoji: '🍝', category: 'mie' },
      { id: 7, label: 'Nasi Tim Ayam', emoji: '🍲', category: 'nasi' },
      { id: 8, label: 'Es Sonkit Jeruk', emoji: '🍹', category: 'minuman' },
      { id: 9, label: 'Siomay Dimsum', emoji: '🥟', category: 'snack' },
    ]
  }
];

export const NonRobotVerification: React.FC<NonRobotVerificationProps> = ({
  isVerified,
  onVerify,
  language = 'id',
  className = '',
  id = 'login-captcha-verification'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [challengeError, setChallengeError] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // When user clicks the checkbox
  const handleCheckboxClick = () => {
    if (isVerified || isLoading) return;

    setIsLoading(true);
    // Simulate natural verification check before challenge popup
    setTimeout(() => {
      setIsLoading(false);
      setShowChallengeModal(true);
    }, 450);
  };

  // Toggle tile selection inside the 3x3 modal
  const toggleTile = (itemId: number) => {
    setChallengeError(false);
    setSelectedIds(prev => 
      prev.includes(itemId) ? prev.filter(x => x !== itemId) : [...prev, itemId]
    );
  };

  // Evaluate puzzle answers
  const handleVerifyPuzzle = () => {
    setIsEvaluating(true);
    setChallengeError(false);

    const challenge = CHALLENGES[activeChallengeIdx];
    const correctIds = challenge.items
      .filter(it => it.category === challenge.target)
      .map(it => it.id);

    const isCorrect = 
      correctIds.length === selectedIds.length &&
      correctIds.every(id => selectedIds.includes(id));

    setTimeout(() => {
      setIsEvaluating(false);
      if (isCorrect) {
        if (navigator.vibrate) navigator.vibrate([30, 20, 30]);
        setShowChallengeModal(false);
        onVerify(true, 'recaptcha-verified-token');
      } else {
        if (navigator.vibrate) navigator.vibrate(100);
        setChallengeError(true);
        // Switch challenge after momentary delay
        setTimeout(() => {
          setActiveChallengeIdx(prev => (prev + 1) % CHALLENGES.length);
          setSelectedIds([]);
          setChallengeError(false);
        }, 850);
      }
    }, 600);
  };

  const reloadChallenge = () => {
    setActiveChallengeIdx(prev => (prev + 1) % CHALLENGES.length);
    setSelectedIds([]);
    setChallengeError(false);
  };

  const curChallenge = CHALLENGES[activeChallengeIdx];

  return (
    <div id={id} className={`w-full max-w-[304px] select-none ${className}`}>
      {/* Autentik Google reCAPTCHA Card (304px × 76px) */}
      <div 
        onClick={handleCheckboxClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-full h-[76px] px-3.5 py-2.5 rounded-[4px] border transition-all duration-200 flex items-center justify-between cursor-pointer ${
          isVerified 
            ? 'bg-[#f9f9f9] border-[#d3d3d3] shadow-none' 
            : 'bg-[#f9f9f9] hover:bg-[#f5f5f5] border-[#d3d3d3] hover:border-[#b0b0b0] shadow-[0_0_4px_rgba(0,0,0,0.08)]'
        }`}
      >
        {/* Left: Checkbox + Label */}
        <div className="flex items-center gap-3">
          <div 
            className={`w-7 h-7 rounded-[2px] flex items-center justify-center transition-all duration-150 ${
              isVerified 
                ? 'bg-transparent border-0' 
                : isLoading 
                ? 'bg-white border-2 border-[#1a73e8]' 
                : isHovered 
                ? 'bg-white border-2 border-[#b0b0b0]' 
                : 'bg-white border-2 border-[#c1c1c1]'
            }`}
          >
            {isVerified ? (
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              >
                <Check className="w-7 h-7 text-[#0f9d58] stroke-[3.5]" />
              </motion.div>
            ) : isLoading ? (
              <RefreshCw className="w-4 h-4 text-[#1a73e8] animate-spin" />
            ) : null}
          </div>

          <span className="text-[13px] font-roboto font-normal text-[#222222]">
            {language === 'en' 
              ? "I'm not a robot" 
              : language === 'zh' 
              ? '我不是机器人' 
              : 'Saya bukan robot'}
          </span>
        </div>

        {/* Right: Official Google reCAPTCHA Brand Logo */}
        <div className="flex flex-col items-center justify-center pl-2 shrink-0">
          <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
            <path d="M42 24c0 9.94-8.06 18-18 18S6 33.94 6 24 14.06 6 24 6c4.97 0 9.47 2.01 12.73 5.27L32 16h14V2l-5.66 5.66C35.91 3.55 30.28 1 24 1 11.3 1 1 11.3 1 24s10.3 23 23 23 23-10.3 23-23h-5z" fill="#4285F4"/>
            <path d="M42 24c0 9.94-8.06 18-18 18-3.32 0-6.42-.9-9.08-2.47l-3.66 3.66C15.01 45.45 19.28 47 24 47c12.7 0 23-10.3 23-23h-5z" fill="#34A853"/>
            <path d="M14.84 39.53C9.43 35.89 6 29.84 6 24c0-4.04 1.43-7.75 3.84-10.66l-3.66-3.66C2.65 13.56 1 18.57 1 24c0 8.01 4.12 15.08 10.34 19.19l3.5-3.66z" fill="#FBBC05"/>
            <path d="M24 6c4.97 0 9.47 2.01 12.73 5.27L32 16h14V2l-5.66 5.66C35.91 3.55 30.28 1 24 1 18.57 1 13.56 2.65 9.68 6.18l3.66 3.66C16.25 7.43 19.96 6 24 6z" fill="#EA4335"/>
          </svg>
          <span className="text-[9px] text-[#555555] font-sans tracking-tight font-medium mt-0.5">
            reCAPTCHA
          </span>
          <div className="flex items-center gap-1 text-[7px] text-[#888888] tracking-tighter">
            <span>Privasi</span>
            <span>-</span>
            <span>Persyaratan</span>
          </div>
        </div>
      </div>

      {/* Google-Style Image Challenge Popup Modal */}
      <AnimatePresence>
        {showChallengeModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="w-full max-w-[340px] bg-white rounded-md shadow-2xl overflow-hidden border border-stone-300"
            >
              {/* Google Blue Header */}
              <div className="bg-[#1a73e8] p-4 text-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold tracking-wider uppercase opacity-90">
                    Google reCAPTCHA Challenge
                  </span>
                  <button 
                    type="button"
                    onClick={() => setShowChallengeModal(false)}
                    className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <h3 className="text-base font-extrabold leading-snug">
                  {curChallenge.title[language] || curChallenge.title.id}
                </h3>
                <p className="text-[11px] text-blue-100 mt-1 opacity-90">
                  {curChallenge.hint}
                </p>
              </div>

              {/* 3x3 Grid Image Tiles */}
              <div className="p-3 bg-stone-100">
                <div className="grid grid-cols-3 gap-1.5 bg-stone-300 p-1 rounded-md">
                  {curChallenge.items.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleTile(item.id)}
                        className={`relative aspect-square rounded-sm flex flex-col items-center justify-center p-1 transition-all cursor-pointer select-none ${
                          isSelected 
                            ? 'bg-blue-50 ring-4 ring-[#1a73e8] scale-[0.93]' 
                            : 'bg-white hover:bg-stone-50 active:scale-95'
                        }`}
                      >
                        <span className="text-3xl filter drop-shadow-xs">{item.emoji}</span>
                        <span className="text-[9px] font-semibold text-stone-700 text-center leading-tight mt-1 line-clamp-1">
                          {item.label}
                        </span>

                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-[#1a73e8] text-white rounded-full flex items-center justify-center shadow-xs">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {challengeError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-600 font-bold text-center mt-2.5 flex items-center justify-center gap-1"
                  >
                    <AlertCircle size={13} />
                    <span>Jawaban belum tepat. Coba gambar baru berikut:</span>
                  </motion.p>
                )}
              </div>

              {/* Footer ala Google reCAPTCHA */}
              <div className="px-4 py-3 bg-white flex items-center justify-between border-t border-stone-200">
                <div className="flex items-center gap-3 text-stone-500">
                  <button 
                    type="button"
                    onClick={reloadChallenge}
                    title="Ganti Gambar Tantangan"
                    className="hover:text-[#1a73e8] transition-colors p-1"
                  >
                    <RefreshCw size={17} />
                  </button>
                  <button 
                    type="button" 
                    title="Bantuan Audio" 
                    onClick={() => alert('Fitur verifikasi visual Google reCAPTCHA aktif.')}
                    className="hover:text-[#1a73e8] transition-colors p-1"
                  >
                    <Volume2 size={17} />
                  </button>
                  <button 
                    type="button" 
                    title="Informasi reCAPTCHA" 
                    onClick={() => alert('Google reCAPTCHA melindungi formulir ini dari bot dan spam.')}
                    className="hover:text-[#1a73e8] transition-colors p-1"
                  >
                    <HelpCircle size={17} />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={selectedIds.length === 0 || isEvaluating}
                  onClick={handleVerifyPuzzle}
                  className={`px-5 py-2 rounded font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedIds.length > 0 && !isEvaluating
                      ? 'bg-[#1a73e8] hover:bg-blue-700 text-white shadow-md'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      <span>MEMERIKSA...</span>
                    </>
                  ) : (
                    <span>VERIFIKASI</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NonRobotVerification;
