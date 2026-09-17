import React, { useState, useEffect } from 'react';
import { db } from '../db/dexie';
import { WaterLog, UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';
import { gymSound, vibratePhone } from '../utils/audio';
import {
  Droplets,
  Plus,
  Trash2,
  Sparkles,
  Dumbbell,
  CheckCircle2,
  Clock,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoalsHydrationSectionProps {
  userProfile?: UserProfile;
}

export const GoalsHydrationSection: React.FC<GoalsHydrationSectionProps> = ({
  userProfile,
}) => {
  const { isDark, colors } = useTheme();
  const todayDateStr = new Date().toISOString().split('T')[0];

  const [todayLog, setTodayLog] = useState<WaterLog | null>(null);
  const [isWorkoutDay, setIsWorkoutDay] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfile | null>(userProfile || null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Load profile if not provided
  useEffect(() => {
    if (!profile) {
      db.user_profile.toCollection().first().then((p) => {
        if (p) {
          setProfile(p);
          setIsWorkoutDay(p.is_workout_day ?? true);
        }
      });
    } else {
      setIsWorkoutDay(profile.is_workout_day ?? true);
    }
  }, [profile]);

  // Load today's log
  useEffect(() => {
    const loadLog = async () => {
      let current = await db.water_logs.where('date').equals(todayDateStr).first();
      if (!current) {
        current = {
          id: `water_${todayDateStr}`,
          date: todayDateStr,
          total_ml: 0,
          logs: [],
        };
        await db.water_logs.put(current);
      }
      setTodayLog(current);
    };
    loadLog();
  }, [todayDateStr]);

  const weight = profile?.weight_kg || 75;
  const baseTarget = Math.round(weight * 35);
  const targetMl = isWorkoutDay ? baseTarget + 500 : baseTarget;

  const totalConsumed = todayLog?.total_ml || 0;
  const progressPercent = Math.min(100, Math.round((totalConsumed / targetMl) * 100));
  const remainingMl = Math.max(0, targetMl - totalConsumed);
  const isTargetAchieved = totalConsumed >= targetMl;

  const handleToggleWorkoutDay = async () => {
    const nextVal = !isWorkoutDay;
    setIsWorkoutDay(nextVal);
    if (profile) {
      const updated = { ...profile, is_workout_day: nextVal };
      setProfile(updated);
      await db.user_profile.put(updated);
    }
  };

  const addWater = async (amount: number) => {
    if (!todayLog) return;

    gymSound.playWaterChime();
    vibratePhone(40);

    const now = new Date();
    const timeStr = now.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newLogs = [...todayLog.logs, { timestamp: timeStr, amount }];
    const newTotal = todayLog.total_ml + amount;

    const updatedLog: WaterLog = {
      ...todayLog,
      total_ml: newTotal,
      logs: newLogs,
    };

    await db.water_logs.put(updatedLog);
    setTodayLog(updatedLog);

    if (totalConsumed < targetMl && newTotal >= targetMl) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#38bdf8', '#10b981'],
      });
    }
  };

  const removeLogItem = async (index: number) => {
    if (!todayLog) return;
    const removedItem = todayLog.logs[index];
    const newLogs = todayLog.logs.filter((_, i) => i !== index);
    const newTotal = Math.max(0, todayLog.total_ml - removedItem.amount);

    const updatedLog: WaterLog = {
      ...todayLog,
      total_ml: newTotal,
      logs: newLogs,
    };

    await db.water_logs.put(updatedLog);
    setTodayLog(updatedLog);
    vibratePhone(30);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customAmount, 10);
    if (parsed && parsed > 0) {
      addWater(parsed);
      setCustomAmount('');
      setShowCustomInput(false);
    }
  };

  return (
    <div
      id="goals-hydration-card"
      className="p-5 rounded-3xl border shadow-lg space-y-4 transition-all duration-200 select-none overflow-hidden relative"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
    >
      {/* Background Subtle Hydration Glow */}
      <div
        className="absolute -top-12 -left-12 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: '#06B6D4' }}
      />

      {/* 1. Header & Target */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-cyan-400 border"
            style={{
              backgroundColor: isDark ? '#0C2028' : '#E0F2FE',
              borderColor: isDark ? '#164E63' : '#BAE6FD',
            }}
          >
            <Droplets className="w-5 h-5 fill-cyan-400/30" />
          </div>

          <div>
            <h3
              className="text-sm sm:text-base font-bold tracking-tight"
              style={{ color: colors.textPrimary }}
            >
              هدف الارتواء والماء اليومي
            </h3>
            <span
              className="text-xs flex items-center gap-1.5"
              style={{ color: colors.textSecondary }}
            >
              <span>محسوب لوزن جسمك ({weight} كجم)</span>
            </span>
          </div>
        </div>

        {/* Workout Day Switcher Badge */}
        <button
          onClick={handleToggleWorkoutDay}
          className="px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95"
          style={{
            borderColor: isWorkoutDay ? '#06B6D4' : colors.border,
            backgroundColor: isWorkoutDay
              ? isDark
                ? '#082F49'
                : '#E0F2FE'
              : 'transparent',
            color: isWorkoutDay ? '#0284C7' : colors.textMuted,
          }}
          title="تفعيل يوم تمرين لإضافة 500 مل للهدف تعويضاً للتعرق"
        >
          <Dumbbell className="w-3.5 h-3.5" />
          <span>{isWorkoutDay ? '+500 مل تمرين' : 'يوم راحة'}</span>
        </button>
      </div>

      {/* 2. Hydration Progress Stats */}
      <div
        className="p-4 rounded-2xl border space-y-3 relative z-10"
        style={{
          backgroundColor: isDark ? '#13191E' : '#F0F9FF',
          borderColor: isDark ? '#164E63' : '#BAE6FD',
        }}
      >
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-2xl sm:text-3xl font-black font-mono tracking-tight"
              style={{ color: isTargetAchieved ? '#10B981' : '#0284C7' }}
            >
              {totalConsumed.toLocaleString()}
            </span>
            <span className="text-xs font-semibold" style={{ color: colors.textSecondary }}>
              / {targetMl.toLocaleString()} مل
            </span>
          </div>

          <span
            className="text-sm font-bold font-mono px-2.5 py-0.5 rounded-full border"
            style={{
              backgroundColor: isTargetAchieved
                ? isDark
                  ? '#064E3B'
                  : '#D1FAE5'
                : isDark
                ? '#082F49'
                : '#E0F2FE',
              borderColor: isTargetAchieved ? '#10B981' : '#0284C7',
              color: isTargetAchieved ? '#10B981' : '#0284C7',
            }}
          >
            {progressPercent}%
          </span>
        </div>

        {/* Liquid Progress Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden bg-slate-800/40 p-0.5">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progressPercent}%`,
              background: isTargetAchieved
                ? 'linear-gradient(90deg, #10B981, #059669)'
                : 'linear-gradient(90deg, #06B6D4, #3B82F6)',
            }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span style={{ color: colors.textSecondary }}>
            {isTargetAchieved
              ? '🎉 رائع! تم إنجاز هدف الماء المطلوب لليوم بالكامل.'
              : `متبقي ${remainingMl.toLocaleString()} مل للوصول إلى هدفك اليومي.`}
          </span>
          {isTargetAchieved && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
        </div>
      </div>

      {/* 3. Quick Sips Action Buttons */}
      <div className="space-y-2 relative z-10">
        <span
          className="text-xs font-semibold block px-1"
          style={{ color: colors.textSecondary }}
        >
          تسجيل شرب الماء السريع:
        </span>

        <div className="grid grid-cols-4 gap-2">
          {[
            { ml: 250, label: 'كوب', desc: '250 مل' },
            { ml: 500, label: 'قارورة', desc: '500 مل' },
            { ml: 750, label: 'مطارة', desc: '750 مل' },
            { ml: 1000, label: 'لتر', desc: '1000 مل' },
          ].map((item) => (
            <button
              key={item.ml}
              onClick={() => addWater(item.ml)}
              className="p-2.5 rounded-2xl border text-center transition-all active:scale-95 flex flex-col items-center justify-center gap-0.5 hover:border-cyan-500/50"
              style={{
                backgroundColor: isDark ? '#161618' : '#F8FAFA',
                borderColor: colors.border,
              }}
            >
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span
                className="text-xs font-bold block"
                style={{ color: colors.textPrimary }}
              >
                +{item.ml}
              </span>
              <span
                className="text-[10px]"
                style={{ color: colors.textMuted }}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Custom Input Toggle */}
        <div className="pt-1 flex items-center justify-between px-1">
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="text-xs font-bold text-cyan-500 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة كمية مخصصة</span>
          </button>

          {todayLog?.logs && todayLog.logs.length > 0 && (
            <span className="text-[11px]" style={{ color: colors.textMuted }}>
              تم تسجيل {todayLog.logs.length} مرات اليوم
            </span>
          )}
        </div>

        {/* Custom Input Form */}
        {showCustomInput && (
          <form
            onSubmit={handleCustomSubmit}
            className="flex items-center gap-2 p-2.5 rounded-2xl border transition-all mt-1"
            style={{
              backgroundColor: isDark ? '#161618' : '#F9FBFB',
              borderColor: colors.border,
            }}
          >
            <input
              type="number"
              min={50}
              max={3000}
              step={50}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="الكمية بالمليلتر (مثال: 350)..."
              autoFocus
              className="flex-1 px-3 py-1.5 rounded-xl border text-xs font-mono focus:outline-none"
              style={{
                backgroundColor: isDark ? '#1C1C1F' : '#FFFFFF',
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition"
            >
              إضافة
            </button>
          </form>
        )}
      </div>

      {/* 4. Today's Sips Chips */}
      {todayLog?.logs && todayLog.logs.length > 0 && (
        <div
          className="pt-2 border-t space-y-2 relative z-10"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center justify-between text-[11px] px-1" style={{ color: colors.textMuted }}>
            <span>سجل الشرب اليوم:</span>
            <span>انقر للحذف إذا أخطأت</span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {todayLog.logs.map((log, idx) => (
              <div
                key={idx}
                className="px-2.5 py-1 rounded-xl border text-[11px] font-mono flex items-center gap-1.5 transition hover:border-red-400 group"
                style={{
                  backgroundColor: isDark ? '#18181A' : '#F1F5F5',
                  borderColor: colors.border,
                  color: colors.textSecondary,
                }}
              >
                <Clock className="w-3 h-3 text-cyan-400" />
                <span className="font-bold text-cyan-400">+{log.amount} مل</span>
                <span className="text-[10px]" style={{ color: colors.textMuted }}>
                  ({log.timestamp})
                </span>
                <button
                  onClick={() => removeLogItem(idx)}
                  className="opacity-60 hover:opacity-100 hover:text-red-400 p-0.5"
                  title="حذف هذا الإدخال"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
