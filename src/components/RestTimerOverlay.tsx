import React, { useEffect, useState } from 'react';
import { gymSound, vibratePhone } from '../utils/audio';
import { Timer, Plus, Minus, X, Minimize2, Maximize2, Volume2, VolumeX } from 'lucide-react';

interface RestTimerOverlayProps {
  initialSeconds?: number;
  isOpen: boolean;
  onClose: () => void;
  exerciseName?: string;
}

export const RestTimerOverlay: React.FC<RestTimerOverlayProps> = ({
  initialSeconds = 90,
  isOpen,
  onClose,
  exerciseName,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [totalTime, setTotalTime] = useState(initialSeconds);
  const [isMinimized, setIsMinimized] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(initialSeconds);
      setTotalTime(initialSeconds);
      setIsMinimized(false);
    }
  }, [isOpen, initialSeconds]);

  // Timer interval countdown
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;

        // Audio and vibration cues
        if (soundEnabled) {
          if (next === 3 || next === 2 || next === 1) {
            gymSound.playWarningBeep();
            vibratePhone(40);
          } else if (next === 0) {
            gymSound.playRestFinishedSound();
            vibratePhone([150, 80, 200]);
          }
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, soundEnabled]);

  if (!isOpen) return null;

  const progress = totalTime > 0 ? Math.max(0, (timeLeft / totalTime) * 100) : 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const addTime = (secs: number) => {
    setTimeLeft((prev) => Math.max(5, prev + secs));
    setTotalTime((prev) => Math.max(prev, timeLeft + secs));
  };

  // Minimized Floating Pill
  if (isMinimized) {
    return (
      <div
        id="rest-timer-minimized"
        className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/95 border border-emerald-500/50 shadow-xl backdrop-blur-md cursor-pointer animate-pulse"
        onClick={() => setIsMinimized(false)}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        <span className="text-xs text-slate-400 font-medium">راحة:</span>
        <span className="font-mono font-bold text-emerald-400 text-sm">{formattedTime}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(false);
          }}
          className="p-1 text-slate-400 hover:text-white"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      id="rest-timer-modal"
      className="fixed inset-x-0 bottom-0 top-auto md:inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-sm transition-all"
    >
      <div className="w-full max-w-md rounded-t-3xl md:rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-6 animate-in slide-in-from-bottom-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">مؤقت الراحة التلقائي</h4>
              {exerciseName && (
                <p className="text-xs text-slate-400 truncate max-w-[200px]">{exerciseName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl transition ${
                soundEnabled
                  ? 'bg-slate-800 text-emerald-400'
                  : 'bg-slate-800/50 text-slate-500'
              }`}
              title={soundEnabled ? 'كتم الصوت' : 'تفعيل التنبيه الصوتي'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              title="تصغير"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              title="إغلاق وتخطي"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Circular Dial / Big Time Display */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative flex items-center justify-center w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="84"
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="96"
                cy="96"
                r="84"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 84}
                strokeDashoffset={2 * Math.PI * 84 * (1 - progress / 100)}
                strokeLinecap="round"
                className={`transition-all duration-1000 ${
                  timeLeft <= 5 ? 'text-amber-500' : 'text-emerald-500'
                }`}
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-4xl font-extrabold tracking-tight text-white">
                {formattedTime}
              </span>
              <span className="text-xs font-semibold text-slate-400 mt-1">
                {timeLeft === 0 ? 'انتهت الراحة! ابدأ مجموعتك' : 'ثواني متبقية'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Adjustment Controls */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => addTime(-15)}
            className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition active:scale-95"
          >
            <Minus className="w-3.5 h-3.5" /> 15 ث
          </button>
          <button
            onClick={() => addTime(15)}
            className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> 15 ث
          </button>
          <button
            onClick={() => addTime(30)}
            className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> 30 ث
          </button>
          <button
            onClick={onClose}
            className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition active:scale-95 shadow-md shadow-emerald-500/20"
          >
            جاهز الآن!
          </button>
        </div>
      </div>
    </div>
  );
};
