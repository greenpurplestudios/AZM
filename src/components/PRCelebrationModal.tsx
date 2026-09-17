import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Flame, Sparkles, X } from 'lucide-react';
import { gymSound, vibratePhone } from '../utils/audio';

interface PRCelebrationModalProps {
  exerciseName: string;
  weightKg: number;
  reps: number;
  previousBest?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const PRCelebrationModal: React.FC<PRCelebrationModalProps> = ({
  exerciseName,
  weightKg,
  reps,
  previousBest,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      gymSound.playPRCelebrationSound();
      vibratePhone([100, 50, 150, 50, 200]);

      // Fire celebratory gold and emerald confetti
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#06b6d4', '#eab308'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const diff = previousBest && weightKg > previousBest ? (weightKg - previousBest).toFixed(1) : null;

  return (
    <div
      id="pr-celebration-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/40 p-6 text-center shadow-2xl shadow-amber-500/10 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/15 border-2 border-amber-400/50 shadow-inner">
          <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-400 text-xs font-extrabold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>رقم قياسي شخصي جديد (PR)!</span>
          </div>
          <h3 className="text-xl font-black text-white pt-1">{exerciseName}</h3>
          <p className="text-xs text-slate-400">عزم فولاذي وإنجاز يُرفع له القبعة في صالة الحديد</p>
        </div>

        {/* Stats card */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-around">
            <div>
              <span className="text-xs text-slate-400">الوزن الجديد</span>
              <p className="font-mono text-2xl font-black text-emerald-400">{weightKg} <span className="text-xs font-sans text-slate-400">كغ</span></p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-xs text-slate-400">التكرارات</span>
              <p className="font-mono text-2xl font-black text-white">{reps}</p>
            </div>
          </div>

          {diff && (
            <div className="flex items-center justify-center gap-1 text-xs font-semibold text-amber-400 pt-1 border-t border-slate-800/60">
              <Flame className="w-3.5 h-3.5" />
              <span>زيادة بمقدار +{diff} كغ عن رقمك السابق ({previousBest} كغ)</span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:opacity-90 text-slate-950 font-black text-sm transition active:scale-95 shadow-lg shadow-emerald-500/20"
        >
          مستمر في كسر الأرقام!
        </button>
      </div>
    </div>
  );
};
