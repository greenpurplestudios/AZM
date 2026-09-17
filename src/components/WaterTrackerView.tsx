import React, { useState, useEffect } from 'react';
import { WaterLog, UserProfile } from '../types';
import { db } from '../db/dexie';
import { gymSound, vibratePhone } from '../utils/audio';
import {
  Droplets,
  Plus,
  Trash2,
  Sparkles,
  Calendar,
  Activity,
  Dumbbell,
  CheckCircle2,
  Clock,
  History,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WaterTrackerViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const WaterTrackerView: React.FC<WaterTrackerViewProps> = ({
  userProfile,
  onUpdateProfile,
}) => {
  const todayDateStr = new Date().toISOString().split('T')[0];
  const [todayLog, setTodayLog] = useState<WaterLog | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<WaterLog[]>([]);
  const [isWorkoutDay, setIsWorkoutDay] = useState<boolean>(userProfile.is_workout_day ?? true);

  // Dynamic daily target calculation based on weight and workout day
  const baseTarget = Math.round((userProfile.weight_kg || 75) * 35);
  const dynamicTarget = isWorkoutDay ? baseTarget + 500 : baseTarget;

  // Load today's water log & archive past days
  useEffect(() => {
    const loadWaterData = async () => {
      // Find today's log
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

      // Load past 7 days logs for history
      const allPast = await db.water_logs.orderBy('date').reverse().limit(7).toArray();
      setHistoryLogs(allPast);
    };

    loadWaterData();
  }, [todayDateStr]);

  const handleToggleWorkoutDay = async () => {
    const nextVal = !isWorkoutDay;
    setIsWorkoutDay(nextVal);
    const updated = { ...userProfile, is_workout_day: nextVal };
    await db.user_profile.put(updated);
    onUpdateProfile(updated);
  };

  const addWater = async (amount: number) => {
    if (!todayLog) return;

    gymSound.playWaterChime();
    vibratePhone(40);

    const now = new Date();
    const timeStr = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

    const newLogs = [...todayLog.logs, { timestamp: timeStr, amount }];
    const newTotal = todayLog.total_ml + amount;

    const updatedLog: WaterLog = {
      ...todayLog,
      total_ml: newTotal,
      logs: newLogs,
    };

    await db.water_logs.put(updatedLog);
    setTodayLog(updatedLog);

    // Goal reached celebration
    if (todayLog.total_ml < dynamicTarget && newTotal >= dynamicTarget) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#38bdf8', '#10b981'],
      });
    }
  };

  const removeLogEntry = async (index: number) => {
    if (!todayLog) return;
    const itemToRemove = todayLog.logs[index];
    const newLogs = todayLog.logs.filter((_, i) => i !== index);
    const newTotal = Math.max(0, todayLog.total_ml - itemToRemove.amount);

    const updatedLog: WaterLog = {
      ...todayLog,
      total_ml: newTotal,
      logs: newLogs,
    };

    await db.water_logs.put(updatedLog);
    setTodayLog(updatedLog);
  };

  const currentTotal = todayLog?.total_ml || 0;
  const progressPercent = Math.min(100, Math.round((currentTotal / dynamicTarget) * 100));
  const remainingMl = Math.max(0, dynamicTarget - currentTotal);

  return (
    <div
      id="water-tracker-view"
      className="relative isolate min-h-[calc(100vh-76px)] overflow-hidden p-4 space-y-6 max-w-xl mx-auto pb-28 text-[#F4F5F3]"
    >
      {/* Dedicated Hydration Atmosphere Background Layer */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <img
          src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1600&auto=format&fit=crop"
          alt="الارتواء والماء النقي"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-105 filter contrast-125 brightness-90 opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070B0A]/92 via-[#070B0A]/80 to-[#070B0A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.15),_transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(22,46,39,0.35),_transparent_75%)]" />
      </div>

      {/* Top Banner & Dynamic Target Control */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Droplets className="w-6 h-6 text-sky-400" />
            <span>سجل الارتواء اليومي</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            الماء وقود العضلات، حماية المفاصل، ومحفز الاستشفاء
          </p>
        </div>

        {/* Workout Day Toggle */}
        <button
          onClick={handleToggleWorkoutDay}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
            isWorkoutDay
              ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5" />
          <span>{isWorkoutDay ? 'يوم تمرين (+500 مل)' : 'يوم راحة'}</span>
        </button>
      </div>

      {/* Main Hydration Progress Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-sky-500/20 p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Progress Circular Gauge */}
          <div className="relative flex items-center justify-center w-40 h-40 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="68"
                stroke="currentColor"
                strokeWidth="12"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="68"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 68}
                strokeDashoffset={2 * Math.PI * 68 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                className="text-sky-400 transition-all duration-700 ease-out"
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-3xl font-black text-white">{progressPercent}%</span>
              <span className="text-[11px] font-semibold text-sky-400 mt-0.5">
                {currentTotal.toLocaleString()} مل
              </span>
            </div>
          </div>

          {/* Hydration Details */}
          <div className="space-y-3 text-right flex-1 w-full">
            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">الهدف اليومي المحسوب:</span>
                <span className="font-mono font-bold text-white text-sm">
                  {dynamicTarget.toLocaleString()} مل
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">المتبقي للوصول:</span>
                <span className="font-mono font-bold text-sky-400 text-sm">
                  {remainingMl === 0 ? 'تم إنجاز الهدف! 🎉' : `${remainingMl.toLocaleString()} مل`}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed">
              المعادلة الذكية: <strong className="text-slate-200">{userProfile.weight_kg} كغ × 35 مل</strong>
              {isWorkoutDay && <span className="text-sky-400"> + 500 مل إضافية لتعويض التعرق</span>}
            </div>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <label className="text-xs font-bold text-slate-300 block">إضافة سريعة بنقرة واحدة:</label>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => addWater(250)}
              className="py-3 px-2 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 font-bold text-xs flex flex-col items-center gap-1 transition active:scale-95 shadow-sm"
            >
              <Droplets className="w-4 h-4 text-sky-400" />
              <span>+250 مل</span>
              <span className="text-[10px] text-slate-400 font-normal">كوب</span>
            </button>

            <button
              onClick={() => addWater(500)}
              className="py-3 px-2 rounded-2xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-200 font-bold text-xs flex flex-col items-center gap-1 transition active:scale-95 shadow-sm"
            >
              <Droplets className="w-4 h-4 text-sky-400" />
              <span>+500 مل</span>
              <span className="text-[10px] text-slate-400 font-normal">قارورة</span>
            </button>

            <button
              onClick={() => addWater(750)}
              className="py-3 px-2 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 font-bold text-xs flex flex-col items-center gap-1 transition active:scale-95 shadow-sm"
            >
              <Droplets className="w-4 h-4 text-sky-400" />
              <span>+750 مل</span>
              <span className="text-[10px] text-slate-400 font-normal">مطارة</span>
            </button>

            <button
              onClick={() => setShowCustomModal(true)}
              className="py-3 px-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex flex-col items-center gap-1 transition active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>مخصص</span>
              <span className="text-[10px] text-slate-400 font-normal">أدخل كمية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Logged Entries */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>سجل جرعات اليوم ({todayLog?.logs.length || 0})</span>
          </span>
          <span className="text-xs font-mono text-slate-400 font-normal">
            التصفير التلقائي منتصف الليل
          </span>
        </h3>

        {!todayLog?.logs.length ? (
          <div className="text-center py-8 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-slate-500 text-xs">
            لم تسجل أي جرعة ماء حتى الآن اليوم. اضغط على أحد الأزرار بالأعلى!
          </div>
        ) : (
          <div className="space-y-2">
            {todayLog.logs.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-sky-400" />
                  <span className="font-mono font-bold text-white text-sm">+{entry.amount} مل</span>
                  <span className="text-slate-400 text-[11px]">في تمام {entry.timestamp}</span>
                </div>
                <button
                  onClick={() => removeLogEntry(index)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition"
                  title="حذف الجرعة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past 7 Days History Mini-strip */}
      {historyLogs.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <History className="w-4 h-4 text-slate-400" />
            <span>سجل الأيام السابقة</span>
          </h3>
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {historyLogs.slice(0, 7).reverse().map((hLog) => {
              const isTargetMet = hLog.total_ml >= dynamicTarget;
              const dateObj = new Date(hLog.date);
              const dayName = dateObj.toLocaleDateString('ar-SA', { weekday: 'narrow' });

              return (
                <div
                  key={hLog.id}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                    isTargetMet
                      ? 'bg-sky-500/10 border-sky-500/40 text-sky-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-semibold">{dayName}</span>
                  <span className="font-mono text-xs font-bold">
                    {(hLog.total_ml / 1000).toFixed(1)}L
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isTargetMet ? 'bg-sky-400' : 'bg-slate-600'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Amount Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-xs rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-2xl text-right">
            <h4 className="text-sm font-bold text-white">إدخال كمية مخصصة</h4>
            <div>
              <label className="text-xs text-slate-400">الكمية بالميلليتر (ml)</label>
              <input
                type="number"
                step="50"
                min="50"
                max="5000"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="مثال: 330 أو 600"
                className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono font-bold text-white focus:outline-none focus:border-sky-500 text-center"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const val = parseInt(customAmount, 10);
                  if (val > 0) {
                    addWater(val);
                    setCustomAmount('');
                    setShowCustomModal(false);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition"
              >
                إضافة
              </button>
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
