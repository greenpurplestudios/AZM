import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Routine,
  DailyObjective,
  AppTab,
} from '../types';
import { db } from '../db/dexie';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { AzmLogo } from './AzmLogo';
import { Check, Play, ArrowLeft, Plus, Trash2, Target, Trophy } from 'lucide-react';

interface DashboardViewProps {
  userProfile: UserProfile;
  onNavigateTab: (tab: AppTab) => void;
  onStartRoutine: (routine: Routine) => void;
  onQuickStartWorkout: () => void;
  onAddWater: (amountMl: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  onNavigateTab,
  onStartRoutine,
  onQuickStartWorkout,
}) => {
  const { colors } = useTheme();
  const { t, language, isRTL } = useLanguage();
  const [objectives, setObjectives] = useState<DailyObjective[]>([]);
  const [todayRoutine, setTodayRoutine] = useState<Routine | null>(null);
  const [quickTitle, setQuickTitle] = useState('');
  const [isAddingQuick, setIsAddingQuick] = useState(false);
  const todayStr = new Date().toISOString().split('T')[0];

  // Load today's objectives & workouts
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        // Clean up legacy default seeded objectives so user starts clean with 0
        const defaultIds = ['obj_workout', 'obj_study', 'obj_read', 'obj_walk', 'obj_water', 'obj_plan'];
        await db.daily_objectives.bulkDelete(defaultIds);

        const allForToday = await db.daily_objectives.where('date').equals(todayStr).toArray();
        const legacySeeded = allForToday.filter(o => 
          o.id.startsWith('obj_workout_') ||
          o.id.startsWith('obj_study_') ||
          o.id.startsWith('obj_read_') ||
          o.id.startsWith('obj_walk_') ||
          o.id.startsWith('obj_water_') ||
          o.id.startsWith('obj_plan_') ||
          o.title.includes('(Workout)') ||
          o.title.includes('(Study') ||
          o.title.includes('(Read') ||
          o.title.includes('(Walk') ||
          o.title.includes('(Drink') ||
          o.title.includes('(Plan tomorrow)')
        );
        if (legacySeeded.length > 0) {
          await db.daily_objectives.bulkDelete(legacySeeded.map(o => o.id));
        }

        const validUserObjectives = allForToday.filter(o => !legacySeeded.some(l => l.id === o.id));
        if (isMounted) {
          setObjectives(validUserObjectives);
        }

        // 2. Routines for today
        const allRoutines = await db.routines.toArray();
        if (allRoutines.length > 0 && isMounted) {
          setTodayRoutine(allRoutines[0]);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [todayStr]);

  const toggleObjective = async (id: string, currentCompleted: boolean) => {
    const nextVal = !currentCompleted;
    setObjectives((prev) =>
      prev.map((o) => (o.id === id ? { ...o, completed: nextVal } : o))
    );
    try {
      await db.daily_objectives.update(id, { completed: nextVal });
    } catch (err) {
      console.error('Failed to toggle objective:', err);
    }
  };

  const handleAddQuickObjective = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const title = quickTitle.trim();
    if (!title) return;

    const newObj: DailyObjective = {
      id: `obj_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title,
      date: todayStr,
      completed: false,
      category: 'general',
      created_at: new Date().toISOString(),
    };

    setObjectives((prev) => [newObj, ...prev]);
    setQuickTitle('');
    setIsAddingQuick(false);

    try {
      await db.daily_objectives.put(newObj);
    } catch (err) {
      console.error('Failed to add objective:', err);
    }
  };

  const handleDeleteObjective = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setObjectives((prev) => prev.filter((o) => o.id !== id));
    try {
      await db.daily_objectives.delete(id);
    } catch (err) {
      console.error('Failed to delete objective:', err);
    }
  };

  const completedCount = objectives.filter((o) => o.completed).length;
  const totalCount = objectives.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Determine greeting based on time of day
  const hour = new Date().getHours();
  const greeting = language === 'ar'
    ? (hour < 12 ? 'صباح الخير،' : hour < 17 ? 'طاب يومك،' : 'مساء الخير،')
    : (hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,');

  return (
    <div
      id="azm-dashboard-view"
      className="relative w-full min-h-[calc(100vh-60px)] overflow-hidden select-none"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Seamless edge-to-edge Night background with atmospheric gradient overlay */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-0 select-none overflow-hidden" aria-hidden="true">
        <img
          src="/bg-night.jpg"
          alt=""
          loading="eager"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#0B0B0C]/82 via-[#0B0B0C]/90 to-[#0B0B0C]/98" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 p-4 sm:p-6 max-w-xl mx-auto space-y-6 pb-28 select-none">
        
        {/* Top User Greeting & Streak Status */}
        <div className="flex items-center justify-between px-1 pt-1">
          <div>
            <span className="text-xs font-medium text-[#8E8E93] block">
              {greeting}
            </span>
            <h1
              className="text-xl sm:text-2xl font-bold text-[#F5F5F5] tracking-tight mt-0.5"
              style={{ fontFamily: "'Readex Pro', sans-serif" }}
            >
              {userProfile.name || (language === 'ar' ? 'بطل عزم' : 'AZM Athlete')}
            </h1>
          </div>

          {/* Leaderboard Shortcut Button */}
          <button
            id="dashboard-leaderboard-shortcut-btn"
            type="button"
            onClick={() => onNavigateTab('leaderboards')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16161A] border border-[#2A2A30] hover:border-[#F59E0B]/50 hover:bg-[#1C1C22] transition-all cursor-pointer shadow-sm active:scale-95 group select-none"
            title={language === 'ar' ? 'لوائح الصدارة' : 'Leaderboards'}
          >
            <Trophy className="w-4 h-4 text-[#F59E0B] transition-transform duration-200 group-hover:scale-110" />
            <span className="text-xs font-bold text-[#F5F5F5] tracking-tight">
              {language === 'ar' ? 'لوائح الصدارة' : 'Leaderboards'}
            </span>
          </button>
        </div>

        {/* Brand Logo Section */}
        <div className="relative py-4 sm:py-5 flex flex-col items-center justify-center text-center select-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-36 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <AzmLogo size={88} showText={false} />

            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight mt-3 text-[#F5F5F5]"
              style={{ fontFamily: "'Readex Pro', sans-serif" }}
            >
              {language === 'ar' ? 'عَــزْم' : 'AZM'}
            </h2>
          </div>
        </div>

        {/* 2. Today's Targets Section */}
        <div className="space-y-3">
          {/* Targets Header with Actions */}
          <div className="flex items-center justify-between px-1">
            <div>
              <h3
                className="text-sm font-bold tracking-tight"
                style={{ color: colors.textPrimary }}
              >
                {language === 'ar' ? 'أهداف اليوم' : "Today's Targets"}
              </h3>
              <span
                className="text-xs font-mono font-medium"
                style={{ color: colors.textSecondary }}
              >
                {totalCount > 0
                  ? language === 'ar'
                    ? `${completedCount} من ${totalCount} أهداف مكتملة (${progressPercent}%)`
                    : `${completedCount} of ${totalCount} targets completed (${progressPercent}%)`
                  : language === 'ar'
                  ? 'لا توجد أهداف مضافة لليوم'
                  : 'No targets added for today'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddingQuick((prev) => !prev)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: isAddingQuick ? colors.accent : 'rgba(233, 75, 75, 0.12)',
                  borderColor: 'rgba(233, 75, 75, 0.35)',
                  color: isAddingQuick ? '#FFFFFF' : colors.accent,
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إضافة هدف' : 'Add Target'}</span>
              </button>
              <button
                onClick={() => onNavigateTab('goals')}
                className="text-xs font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
                style={{ color: colors.textMuted }}
              >
                <span>{language === 'ar' ? 'كل الأهداف' : 'All Targets'}</span>
                <ArrowLeft className={`w-3.5 h-3.5 ${!isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Minimal Progress Bar (only if objectives exist) */}
          {totalCount > 0 && (
            <div
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: '#222226' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: colors.accent,
                }}
              />
            </div>
          )}

          {/* Quick Add Objective Input */}
          {isAddingQuick && (
            <form
              onSubmit={handleAddQuickObjective}
              className="p-2.5 rounded-xl border bg-[#17171A] border-[#2E282B] flex items-center gap-2 shadow-md"
            >
              <input
                type="text"
                autoFocus
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'اكتب هدفك لليوم (مثال: شرب لترين ماء، تمرين صدر...)'
                    : 'Enter target (e.g., Drink 2L water, Chest workout...)'
                }
                className="flex-1 bg-transparent px-2.5 py-1.5 text-sm text-[#F5F5F5] placeholder-[#6F7075] outline-none"
              />
              <button
                type="submit"
                disabled={!quickTitle.trim()}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#E94B4B] text-white disabled:opacity-40 transition-opacity cursor-pointer"
              >
                {t('common.save')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingQuick(false);
                  setQuickTitle('');
                }}
                className="px-2 py-1.5 text-xs text-[#A1A1A6] hover:text-[#F5F5F5] cursor-pointer"
              >
                {t('common.cancel')}
              </button>
            </form>
          )}

          {/* Targets Checklist or Clean Empty State */}
          <div
            className="rounded-2xl border divide-y overflow-hidden transition-colors duration-200 backdrop-blur-md shadow-xs"
            style={{
              backgroundColor: 'rgba(23, 23, 25, 0.88)',
              borderColor: colors.border,
            }}
          >
            {objectives.length === 0 ? (
              <div className="py-8 px-4 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E94B4B]/10 border border-[#E94B4B]/20 mx-auto flex items-center justify-center text-[#E94B4B]">
                  <Target className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#F5F5F5]">
                    {language === 'ar' ? 'لا توجد أهداف مضافة لليوم' : 'No targets added for today'}
                  </p>
                  <p className="text-xs text-[#A1A1A6] max-w-xs mx-auto">
                    {language === 'ar'
                      ? 'ابدأ يومك بإضافة أهدافك وتحدياتك لتتبع إنجازك وانضباطك'
                      : 'Start your day by adding goals to track your discipline'}
                  </p>
                </div>
                {!isAddingQuick && (
                  <button
                    onClick={() => setIsAddingQuick(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E94B4B] hover:bg-[#C93636] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'ar' ? 'أضف أول هدف لليوم' : 'Add First Target'}</span>
                  </button>
                )}
              </div>
            ) : (
              objectives.slice(0, 6).map((obj) => (
                <div
                  key={obj.id}
                  onClick={() => toggleObjective(obj.id, obj.completed)}
                  className="group flex items-center justify-between p-3.5 sm:p-4 cursor-pointer transition-all duration-150 hover:bg-[#202024]/50 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5 select-none flex-1">
                    {/* Checkbox indicator */}
                    <div
                      className="w-5 h-5 rounded-md border flex items-center justify-center transition-colors flex-shrink-0"
                      style={{
                        borderColor: obj.completed ? colors.accent : colors.border,
                        backgroundColor: obj.completed ? colors.accent : 'transparent',
                      }}
                    >
                      {obj.completed && (
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      )}
                    </div>

                    <span
                      className={`text-sm font-medium transition-colors ${
                        obj.completed ? 'line-through' : ''
                      }`}
                      style={{
                        color: obj.completed ? colors.textMuted : colors.textPrimary,
                      }}
                    >
                      {obj.title}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteObjective(obj.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-[#E94B4B]/15 text-[#6F7075] hover:text-[#E94B4B] transition-opacity cursor-pointer"
                    title={t('common.delete')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      {/* 4. Featured Today's Workout Highlight */}
      <div className="pt-1">
        {/* Workout Card */}
        <div
          className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-200 backdrop-blur-md shadow-xs"
          style={{
            backgroundColor: 'rgba(23, 23, 25, 0.88)',
            borderColor: colors.border,
          }}
        >
          <div className="space-y-1">
            <span
              className="text-[10px] font-mono font-bold uppercase tracking-wider block"
              style={{ color: colors.accent }}
            >
              {language === 'ar' ? 'تدريب اليوم الموصى به' : "Today's Recommended Workout"}
            </span>
            <h4
              className="text-base font-bold tracking-tight"
              style={{ color: colors.textPrimary }}
            >
              {todayRoutine?.title || (language === 'ar' ? 'تمرين الدفع الأول' : 'Push Day Session')}
            </h4>
          </div>

          <button
            onClick={() => {
              if (todayRoutine) {
                onStartRoutine(todayRoutine);
              } else {
                onQuickStartWorkout();
              }
            }}
            className="py-2.5 px-6 rounded-xl font-bold text-xs transition-all duration-150 flex items-center justify-center gap-2 active:scale-98 shadow-xs text-white cursor-pointer"
            style={{ backgroundColor: colors.accent }}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{language === 'ar' ? 'ابدأ التمرين' : 'Start Workout'}</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};
