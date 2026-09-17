import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkoutSession } from '../types';
import { Flame, Trophy, Clock, Dumbbell, CheckCircle2, ChevronLeft, ArrowLeft, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { gymSound, vibratePhone } from '../utils/audio';

interface WorkoutCelebrationModalProps {
  session: WorkoutSession;
  oldStreak: number;
  newStreak: number;
  streakIncremented: boolean;
  onCloseToHome: () => void;
  onCloseToMuscles: () => void;
}

const MOTIVATIONAL_QUOTES = [
  {
    title: 'عاش يا بطل! تم إنهاء التمرين بنجاح 💪',
    subtitle: 'انضباطك اليوم هو الجسر الحقيقي بين ما أنت عليه والنسخة التي تطمح إليها.',
  },
  {
    title: 'عزيمة لا تلين! خطوة جبارة للأمام 🔥',
    subtitle: 'كل تكرار حفر في ذاكرة عضلاتك خطوة جديدة نحو القمة.',
  },
  {
    title: 'وحش في الميدان! أداء يُرفع له القبعة ⚡',
    subtitle: 'الفرق بين البطل وغيره هو حضورك وإتمامك للتمرين حين يتكاسل الآخرون.',
  },
  {
    title: 'إنجاز عظيم! عضلاتك أصبحت أقوى اليوم 🛡️',
    subtitle: 'انتهت الجولة في صالة الحديد، وبدأت الآن مرحلة البناء والاستشفاء والتغذية.',
  },
];

export const WorkoutCelebrationModal: React.FC<WorkoutCelebrationModalProps> = ({
  session,
  oldStreak,
  newStreak,
  streakIncremented,
  onCloseToHome,
  onCloseToMuscles,
}) => {
  // Pick a random quote once on mount
  const quote = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[randomIndex];
  }, []);

  // Trigger celebration effects on mount
  useEffect(() => {
    // Sound & tactile feedback
    gymSound.playWorkoutCompleteSound();
    vibratePhone([60, 40, 100, 40, 120]);

    // Confetti cannons
    const end = Date.now() + 1200;
    const colors = ['#6BAF8F', '#C8E6CF', '#A3E6C5', '#F59E0B', '#10B981'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  // Compute metrics
  const completedSets = (session.sets || []).filter((s) => s.completed);
  const totalVolume = completedSets.reduce(
    (acc, s) => acc + (s.weight_kg || 0) * (s.reps || 0),
    0
  );
  const distinctExercisesCount = new Set(
    (session.sets || []).map((s) => s.exercise_id)
  ).size;

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '30 دقيقة';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} ثانية`;
    return `${mins} دقيقة ${secs > 0 ? `و ${secs} ث` : ''}`;
  };

  return (
    <AnimatePresence>
      <div
        id="azm-workout-celebration-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          id="azm-workout-celebration-card"
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          className="relative w-full max-w-md my-auto rounded-3xl bg-gradient-to-b from-[#132B23] via-[#0B1A15] to-[#070F0C] border border-[#2B5448] p-6 text-center text-[#F4F5F3] shadow-2xl overflow-hidden"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#6BAF8F]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-[#F59E0B]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Animated Trophy & Flame Emblems */}
          <div className="relative mx-auto mb-4 flex items-center justify-center">
            {/* Pulsing ring animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.15, 0.5] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
              className="absolute w-24 h-24 rounded-full bg-[#6BAF8F]/25 border border-[#6BAF8F]/40"
            />

            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.1 }}
              className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1E4336] to-[#0D221B] border border-[#6BAF8F]/50 flex items-center justify-center shadow-lg shadow-[#6BAF8F]/25 text-[#A3E6C5]"
            >
              <Trophy className="w-10 h-10 text-[#A3E6C5] drop-shadow-md" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.35, type: 'spring' }}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400 text-amber-400 flex items-center justify-center shadow-sm"
              >
                <Flame className="w-4 h-4 fill-current animate-bounce" />
              </motion.div>
            </motion.div>
          </div>

          {/* Motivational Congratulatory Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-1.5 mb-5"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16362B] border border-[#6BAF8F]/40 text-[#A3E6C5] text-xs font-black shadow-sm mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>تنبيه إنجاز التمرين</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#F4F5F3] leading-snug">
              {quote.title}
            </h2>
            <p className="text-xs text-[#C8E6CF]/80 leading-relaxed max-w-sm mx-auto">
              {quote.subtitle}
            </p>
          </motion.div>

          {/* Automatic Streak Update Banner with Light Motion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-[#17382D]/90 to-[#102920]/90 border border-[#6BAF8F]/40 mb-4 text-right flex items-center justify-between gap-3 shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Flame className="w-5 h-5 fill-current animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#F4F5F3]">
                    سلسلة الالتزام (Streak)
                  </span>
                  {streakIncremented && (
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono font-bold">
                      +1 يوم
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#C8E6CF]/75">
                  {streakIncremented
                    ? 'تم تحديث عداد الستريك تلقائيًا في ملفك الشخصي'
                    : 'واصلت الانضباط لليوم بنجاح!'}
                </p>
              </div>
            </div>

            <div className="text-center pl-1">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="font-mono text-xl font-black text-amber-400"
              >
                {newStreak}
              </motion.div>
              <span className="text-[10px] text-[#C8E6CF]/60 block -mt-1 font-bold">
                أيام
              </span>
            </div>
          </motion.div>

          {/* Quick Workout Recap Grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-2 mb-6 text-center"
          >
            <div className="p-3 rounded-2xl bg-[#091512]/80 border border-[#1F3A34] space-y-1">
              <Clock className="w-4 h-4 text-[#6BAF8F] mx-auto" />
              <div className="text-[10px] text-[#C8E6CF]/60 font-semibold">المدة</div>
              <div className="font-mono text-xs font-bold text-[#F4F5F3] truncate">
                {formatDuration(session.duration_seconds)}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#091512]/80 border border-[#1F3A34] space-y-1">
              <CheckCircle2 className="w-4 h-4 text-[#6BAF8F] mx-auto" />
              <div className="text-[10px] text-[#C8E6CF]/60 font-semibold">المجموعات</div>
              <div className="font-mono text-xs font-bold text-[#F4F5F3]">
                {completedSets.length} من {(session.sets || []).length}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#091512]/80 border border-[#1F3A34] space-y-1">
              <Dumbbell className="w-4 h-4 text-[#6BAF8F] mx-auto" />
              <div className="text-[10px] text-[#C8E6CF]/60 font-semibold">الحجم الكلي</div>
              <div className="font-mono text-xs font-bold text-[#A3E6C5] truncate">
                {totalVolume > 0 ? `${totalVolume.toLocaleString()} كغ` : 'وزن جسم'}
              </div>
            </div>
          </motion.div>

          {/* Navigation Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-2.5"
          >
            <button
              id="azm-celebration-to-muscles-btn"
              onClick={onCloseToMuscles}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#6BAF8F] to-[#88D4B0] hover:from-[#7BBF9F] hover:to-[#99E3BF] text-[#070B0A] font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-[#6BAF8F]/25 active:scale-[0.98]"
            >
              <span>الانتقال إلى خريطة ورتب العضلات (Liftoff)</span>
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              id="azm-celebration-to-home-btn"
              onClick={onCloseToHome}
              className="w-full py-3 px-4 rounded-2xl bg-[#0B1714] hover:bg-[#132620] border border-[#1F3A34] text-[#C8E6CF] hover:text-[#F4F5F3] font-bold text-xs transition flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>العودة إلى لوحة التحكم الرئيسية</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
