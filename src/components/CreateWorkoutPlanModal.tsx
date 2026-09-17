import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../db/dexie';
import {
  Routine,
  CalendarEvent,
  Exercise,
  UserProfile,
  GymAccessType,
} from '../types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { gymSound, vibratePhone } from '../utils/audio';
import {
  TRAINING_PRESETS,
  TrainingPreset,
} from '../data/trainingPresets';
import {
  X,
  Dumbbell,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  MoveUp,
  MoveDown,
  Layers,
  CalendarDays,
  Flame,
  ArrowRight,
  ArrowLeft,
  Activity,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreateWorkoutPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated?: (routine: Routine, scheduledCount: number) => void;
  onNavigateToCalendar?: () => void;
  initialPresetId?: string;
}

interface CustomDaySchedule {
  weekdayIndex: number; // 6: Sat, 0: Sun, 1: Mon, etc.
  weekdayKey: string;
  dayName: string;
  focus: string;
  notes?: string;
  exercises: {
    id: string;
    exercise_id?: string;
    name: string;
    name_en?: string;
    category?: string;
    sets: number;
    reps: string;
    weight_kg?: number;
    notes?: string;
  }[];
}

const WEEKDAYS_DEF = [
  { dayIndex: 6, key: 'day.saturday', shortKey: 'day.short.sat' },
  { dayIndex: 0, key: 'day.sunday', shortKey: 'day.short.sun' },
  { dayIndex: 1, key: 'day.monday', shortKey: 'day.short.mon' },
  { dayIndex: 2, key: 'day.tuesday', shortKey: 'day.short.tue' },
  { dayIndex: 3, key: 'day.wednesday', shortKey: 'day.short.wed' },
  { dayIndex: 4, key: 'day.thursday', shortKey: 'day.short.thu' },
  { dayIndex: 5, key: 'day.friday', shortKey: 'day.short.fri' },
];

const MUSCLE_FOCUS_OPTIONS = [
  { key: 'chest', ar: 'الصدر والأكتاف', en: 'Chest & Shoulders' },
  { key: 'back', ar: 'الظهر والبايسبس', en: 'Back & Biceps' },
  { key: 'legs', ar: 'الأرجل والسمانة', en: 'Legs & Calves' },
  { key: 'shoulders', ar: 'الأكتاف والترابيس', en: 'Shoulders & Traps' },
  { key: 'arms', ar: 'الذراعين (بايسبس وترايسبس)', en: 'Arms (Biceps & Triceps)' },
  { key: 'upper', ar: 'الجزء العلوي كامل', en: 'Upper Body' },
  { key: 'lower', ar: 'الجزء السفلي كامل', en: 'Lower Body' },
  { key: 'full_body', ar: 'كامل عضلات الجسم', en: 'Full Body' },
  { key: 'core', ar: 'البطن وأسفل الظهر', en: 'Core & Lower Back' },
  { key: 'cardio', ar: 'اللياقة الهوائية والتحمل', en: 'Cardio & Conditioning' },
];

export const CreateWorkoutPlanModal: React.FC<CreateWorkoutPlanModalProps> = ({
  isOpen,
  onClose,
  onPlanCreated,
  onNavigateToCalendar,
  initialPresetId,
}) => {
  const { isDark, colors } = useTheme();
  const { t, language, isRTL } = useLanguage();

  const primaryColor = colors.accent;
  const surfaceColor = colors.card;
  const surfaceHoverColor = colors.bgSecondary;
  const textColor = colors.textPrimary;

  const getCategoryLabel = (cat?: string) => {
    if (!cat) return '';
    if (language !== 'ar') return cat;
    const map: Record<string, string> = {
      chest: 'صدر',
      back: 'ظهر',
      legs: 'أرجل',
      shoulders: 'أكتاف',
      arms: 'ذراعين',
      core: 'بطن',
      cardio: 'كارديو',
      full_body: 'كامل الجسم',
    };
    return map[cat.toLowerCase()] || cat;
  };

  // 4 Steps: 1 = Choose Days, 2 = Customize Days, 3 = Schedule Options, 4 = Review & Activate
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // User Profile
  const [, setUserProfile] = useState<UserProfile | null>(null);

  // Step 1: Selected Weekdays (default: Sat, Sun, Tue, Thu)
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([6, 0, 2, 4]);

  // Step 2: Detailed day-by-day schedules
  const [daySchedules, setDaySchedules] = useState<CustomDaySchedule[]>([]);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);

  // Step 3: Scheduling Options
  const [planTitle, setPlanTitle] = useState(() => (language === 'ar' ? 'جدول التدريب الأسبوعي' : 'Weekly Training Split'));
  const [workoutTime, setWorkoutTime] = useState('17:00');
  const [durationWeeks, setDurationWeeks] = useState<number>(4);
  const [addToCalendar, setAddToCalendar] = useState<boolean>(true);

  // Exercise Picker Modal
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customExerciseName, setCustomExerciseName] = useState('');

  // Submitting / Result
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    title: string;
    scheduledCount: number;
    daysCount: number;
  } | null>(null);

  // Initial load
  useEffect(() => {
    if (isOpen) {
      db.user_profile.toCollection().first().then((p) => {
        if (p) setUserProfile(p);
      });

      db.exercises.toArray().then((list) => {
        setAllExercises(list);
      });

      if (initialPresetId) {
        const found = TRAINING_PRESETS.find((p) => p.id === initialPresetId);
        if (found) {
          loadPresetIntoCustom(found);
        }
      }
    }
  }, [isOpen, initialPresetId]);

  // Sync daySchedules whenever selectedWeekdays changes
  useEffect(() => {
    setDaySchedules((prev) => {
      return selectedWeekdays.map((weekdayIndex) => {
        const def = WEEKDAYS_DEF.find((w) => w.dayIndex === weekdayIndex);
        const existing = prev.find((d) => d.weekdayIndex === weekdayIndex);
        if (existing) return existing;

        const defaultName = language === 'ar' 
          ? `يوم ${t(def?.key || 'day.saturday')}` 
          : `${t(def?.key || 'day.saturday')} Session`;

        const defaultFocus = language === 'ar'
          ? 'تمارين القوة والبناء العضلي'
          : 'Strength & Hypertrophy';

        return {
          weekdayIndex,
          weekdayKey: def?.key || 'day.saturday',
          dayName: defaultName,
          focus: defaultFocus,
          notes: '',
          exercises: [
            {
              id: `ex_${Date.now()}_${weekdayIndex}_1`,
              name: language === 'ar' ? 'بنش برس مستوي بالبار' : 'Barbell Bench Press',
              name_en: 'Barbell Bench Press',
              sets: 4,
              reps: '8-10',
            },
            {
              id: `ex_${Date.now()}_${weekdayIndex}_2`,
              name: language === 'ar' ? 'سحب ظهر بالبار منحنياً' : 'Barbell Bent-over Row',
              name_en: 'Barbell Bent-over Row',
              sets: 4,
              reps: '8-10',
            },
            {
              id: `ex_${Date.now()}_${weekdayIndex}_3`,
              name: language === 'ar' ? 'سكوات حر بالبار' : 'Barbell Squat',
              name_en: 'Barbell Squat',
              sets: 4,
              reps: '8-10',
            },
          ],
        };
      });
    });
  }, [selectedWeekdays, language]);

  // Bound activeDayIndex safely
  useEffect(() => {
    if (activeDayIndex >= daySchedules.length && daySchedules.length > 0) {
      setActiveDayIndex(daySchedules.length - 1);
    }
  }, [daySchedules.length, activeDayIndex]);

  // Calculations for Step 4 & summaries
  const totalWeeklySets = useMemo(() => {
    return daySchedules.reduce((sum, d) => {
      return sum + d.exercises.reduce((exSum, e) => exSum + (Number(e.sets) || 0), 0);
    }, 0);
  }, [daySchedules]);

  const totalWeeklyExercises = useMemo(() => {
    return daySchedules.reduce((sum, d) => sum + d.exercises.length, 0);
  }, [daySchedules]);

  if (!isOpen) return null;

  const toggleWeekday = (dayIndex: number) => {
    setSelectedWeekdays((prev) => {
      const exists = prev.includes(dayIndex);
      if (exists) {
        if (prev.length === 1) return prev; // Keep at least one training day
        return prev.filter((d) => d !== dayIndex);
      } else {
        return [...prev, dayIndex].sort((a, b) => {
          const order = [6, 0, 1, 2, 3, 4, 5];
          return order.indexOf(a) - order.indexOf(b);
        });
      }
    });
  };

  const loadPresetIntoCustom = (preset: TrainingPreset) => {
    setPlanTitle(language === 'ar' ? preset.name : preset.name_en);
    const weekdaysFromPreset = preset.days.map((d) => d.default_weekday);
    setSelectedWeekdays(weekdaysFromPreset);

    const builtDays: CustomDaySchedule[] = preset.days.map((pDay) => {
      const def = WEEKDAYS_DEF.find((w) => w.dayIndex === pDay.default_weekday);
      return {
        weekdayIndex: pDay.default_weekday,
        weekdayKey: def?.key || 'day.saturday',
        dayName: language === 'ar' ? pDay.day_name : (pDay.day_name_en || pDay.day_name),
        focus: language === 'ar' ? pDay.focus : (pDay.focus_en || pDay.focus),
        notes: '',
        exercises: pDay.exercises.map((pEx, idx) => ({
          id: `ex_${Date.now()}_${idx}`,
          name: language === 'ar' ? pEx.name : pEx.name_en,
          name_en: pEx.name_en,
          sets: pEx.sets,
          reps: pEx.reps,
          weight_kg: pEx.weight_kg,
          notes: pEx.notes,
        })),
      };
    });

    setDaySchedules(builtDays);
    setActiveDayIndex(0);
    setStep(2); // Jump to customize
  };

  const updateActiveDayField = (field: 'dayName' | 'focus' | 'notes', val: string) => {
    setDaySchedules((prev) =>
      prev.map((d, i) => (i === activeDayIndex ? { ...d, [field]: val } : d))
    );
  };

  const addExerciseToActiveDay = (exerciseItem: { name: string; name_en?: string; category?: string; id?: string }) => {
    const newEx = {
      id: `ex_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      exercise_id: exerciseItem.id,
      name: exerciseItem.name,
      name_en: exerciseItem.name_en || exerciseItem.name,
      category: exerciseItem.category,
      sets: 3,
      reps: '8-12',
    };

    setDaySchedules((prev) =>
      prev.map((d, i) => {
        if (i !== activeDayIndex) return d;
        return { ...d, exercises: [...d.exercises, newEx] };
      })
    );
  };

  const removeExerciseFromActiveDay = (exIndex: number) => {
    setDaySchedules((prev) =>
      prev.map((d, i) => {
        if (i !== activeDayIndex) return d;
        return {
          ...d,
          exercises: d.exercises.filter((_, idx) => idx !== exIndex),
        };
      })
    );
  };

  const moveExercise = (exIndex: number, direction: 'up' | 'down') => {
    setDaySchedules((prev) =>
      prev.map((d, i) => {
        if (i !== activeDayIndex) return d;
        const list = [...d.exercises];
        const targetIndex = direction === 'up' ? exIndex - 1 : exIndex + 1;
        if (targetIndex < 0 || targetIndex >= list.length) return d;
        const temp = list[exIndex];
        list[exIndex] = list[targetIndex];
        list[targetIndex] = temp;
        return { ...d, exercises: list };
      })
    );
  };

  const updateExerciseField = (
    exIndex: number,
    field: 'sets' | 'reps' | 'weight_kg' | 'notes' | 'name',
    val: string | number
  ) => {
    setDaySchedules((prev) =>
      prev.map((d, i) => {
        if (i !== activeDayIndex) return d;
        const list = d.exercises.map((ex, idx) =>
          idx === exIndex ? { ...ex, [field]: val } : ex
        );
        return { ...d, exercises: list };
      })
    );
  };

  const handleSaveFullPlan = async () => {
    if (daySchedules.length === 0) return;

    setIsSubmitting(true);
    try {
      const createdRoutines: Routine[] = [];
      for (const day of daySchedules) {
        const routine: Routine = {
          id: `routine_${Date.now()}_${day.weekdayIndex}`,
          title: day.dayName || t(day.weekdayKey),
          target_goal: planTitle,
          description: `${day.focus} • ${day.exercises.length} ${language === 'ar' ? 'تمارين' : 'exercises'}`,
          exercises: day.exercises.map((e) => ({
            exercise_id: e.exercise_id || e.id,
            target_sets: e.sets,
            target_reps: e.reps,
            tips: e.notes,
          })),
          created_at: new Date().toISOString(),
        };
        await db.routines.put(routine);
        createdRoutines.push(routine);
      }

      let scheduledCount = 0;
      if (addToCalendar && selectedWeekdays.length > 0) {
        const eventsToInsert: CalendarEvent[] = [];
        const today = new Date();
        const scanWeeks = durationWeeks > 0 ? durationWeeks : 4;
        const totalDaysToScan = scanWeeks * 7;

        for (let i = 0; i < totalDaysToScan; i++) {
          const scanDate = new Date(today);
          scanDate.setDate(today.getDate() + i);

          const dayOfWeek = scanDate.getDay();
          const daySchedule = daySchedules.find((d) => d.weekdayIndex === dayOfWeek);

          if (daySchedule) {
            const y = scanDate.getFullYear();
            const m = String(scanDate.getMonth() + 1).padStart(2, '0');
            const d = String(scanDate.getDate()).padStart(2, '0');
            const dateStr = `${y}-${m}-${d}`;

            const exSummary = daySchedule.exercises
              .map((e) => `${language === 'ar' ? e.name : (e.name_en || e.name)} (${e.sets}×${e.reps})`)
              .join(' • ');

            eventsToInsert.push({
              id: `cal_workout_${Date.now()}_${i}`,
              title: daySchedule.dayName,
              date: dateStr,
              start_time: workoutTime,
              category: 'workout',
              notes: `${daySchedule.focus} | ${exSummary}`,
              is_completed: false,
              is_workout: true,
              created_at: new Date().toISOString(),
            });
          }
        }

        if (eventsToInsert.length > 0) {
          await db.calendar_events.bulkPut(eventsToInsert);
          scheduledCount = eventsToInsert.length;
        }
      }

      gymSound.playWorkoutCompleteSound();
      vibratePhone([50, 80, 100]);
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
      });

      window.dispatchEvent(new CustomEvent('azm-calendar-updated'));
      window.dispatchEvent(new CustomEvent('azm-routines-updated'));
      window.dispatchEvent(new CustomEvent('azm-workout-updated'));

      if (onPlanCreated && createdRoutines[0]) {
        onPlanCreated(createdRoutines[0], scheduledCount);
      }

      setSuccessInfo({
        title: planTitle,
        scheduledCount,
        daysCount: selectedWeekdays.length,
      });
    } catch (err) {
      console.error('Failed to create training schedule:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLibraryExercises = useMemo(() => {
    return allExercises.filter((ex) => {
      const matchesSearch =
        !exerciseSearch ||
        ex.name_ar.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
        ex.name_en.toLowerCase().includes(exerciseSearch.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || ex.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allExercises, exerciseSearch, selectedCategory]);

  const activeDay = daySchedules[activeDayIndex] || daySchedules[0];

  return (
    <div
      id="create-schedule-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        id="create-schedule-modal-card"
        className="w-full max-w-3xl my-6 rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        style={{
          backgroundColor: surfaceColor,
          borderColor: colors.border,
          color: textColor,
        }}
      >
        {/* Header */}
        <div
          className="p-5 border-b flex items-center justify-between"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md"
              style={{ backgroundColor: primaryColor }}
            >
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">
                {t('schedule.modal_title')}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                {t('schedule.modal_subtitle')}
              </p>
            </div>
          </div>

          <button
            id="create-schedule-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl transition hover:opacity-75"
            style={{ backgroundColor: isDark ? '#27272a' : '#f4f4f5' }}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Tabs Indicator */}
        {!successInfo && (
          <div
            className="px-5 py-3 border-b flex items-center justify-between gap-1 overflow-x-auto text-xs"
            style={{
              backgroundColor: isDark ? '#141416' : '#fafafa',
              borderColor: colors.border,
            }}
          >
            {[
              { num: 1, labelKey: 'schedule.step1_tab' },
              { num: 2, labelKey: 'schedule.step2_tab' },
              { num: 3, labelKey: 'schedule.step3_tab' },
              { num: 4, labelKey: 'schedule.step4_tab' },
            ].map((s) => {
              const isCurrent = step === s.num;
              const isPassed = step > s.num;
              return (
                <button
                  key={s.num}
                  id={`schedule-step-tab-${s.num}`}
                  onClick={() => {
                    if (s.num <= 2 || selectedWeekdays.length > 0) {
                      setStep(s.num as 1 | 2 | 3 | 4);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition whitespace-nowrap ${
                    isCurrent
                      ? 'text-white font-bold shadow-sm'
                      : isPassed
                      ? 'hover:opacity-90'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: isCurrent ? primaryColor : 'transparent',
                    color: isCurrent ? '#ffffff' : isPassed ? primaryColor : colors.textSecondary,
                  }}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      isCurrent
                        ? 'bg-white text-black'
                        : isPassed
                        ? 'bg-opacity-20'
                        : 'bg-zinc-700/30'
                    }`}
                    style={isPassed ? { backgroundColor: `${primaryColor}25`, color: primaryColor } : undefined}
                  >
                    {isPassed ? <Check className="w-3 h-3" /> : s.num}
                  </span>
                  <span>{t(s.labelKey)}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Modal Body Container */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {successInfo ? (
            /* Success State */
            <div className="py-8 text-center max-w-md mx-auto space-y-5">
              <div
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
              >
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{t('schedule.activated_success')}</h3>
                <p className="text-sm mt-2 font-medium" style={{ color: colors.textSecondary }}>
                  {successInfo.title}
                </p>
                <div
                  className="mt-4 p-4 rounded-xl border flex items-center justify-around text-center text-xs"
                  style={{ backgroundColor: surfaceHoverColor, borderColor: colors.border }}
                >
                  <div>
                    <span className="block text-lg font-bold" style={{ color: primaryColor }}>
                      {successInfo.daysCount}
                    </span>
                    <span style={{ color: colors.textSecondary }}>{t('schedule.days_selected_label')}</span>
                  </div>
                  {successInfo.scheduledCount > 0 && (
                    <div>
                      <span className="block text-lg font-bold" style={{ color: primaryColor }}>
                        {successInfo.scheduledCount}
                      </span>
                      <span style={{ color: colors.textSecondary }}>
                        {language === 'ar' ? 'جلسة في التقويم' : 'Scheduled Sessions'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {onNavigateToCalendar && successInfo.scheduledCount > 0 && (
                  <button
                    id="schedule-go-calendar-btn"
                    onClick={() => {
                      onClose();
                      onNavigateToCalendar();
                    }}
                    className="flex-1 py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90"
                    style={{ borderColor: colors.border, backgroundColor: surfaceHoverColor, color: textColor }}
                  >
                    <Calendar className="w-4 h-4" />
                    {language === 'ar' ? 'عرض في التقويم' : 'View in Calendar'}
                  </button>
                )}
                <button
                  id="schedule-finish-close-btn"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Check className="w-4 h-4" />
                  {t('common.done')}
                </button>
              </div>
            </div>
          ) : step === 1 ? (
            /* STEP 1: CHOOSE TRAINING DAYS */
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" style={{ color: primaryColor }} />
                  {t('schedule.step1_title')}
                </h3>
                <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                  {t('schedule.step1_desc')}
                </p>
              </div>

              {/* Day selection grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {WEEKDAYS_DEF.map((day) => {
                  const isSelected = selectedWeekdays.includes(day.dayIndex);
                  return (
                    <button
                      key={day.dayIndex}
                      id={`schedule-weekday-toggle-${day.dayIndex}`}
                      type="button"
                      onClick={() => toggleWeekday(day.dayIndex)}
                      className="p-3.5 rounded-xl border flex flex-col items-center justify-center transition text-center relative"
                      style={{
                        backgroundColor: isSelected
                          ? isDark
                            ? 'rgba(233, 75, 75, 0.15)'
                            : 'rgba(53, 201, 184, 0.15)'
                          : surfaceHoverColor,
                        borderColor: isSelected ? primaryColor : colors.border,
                      }}
                    >
                      <span className="text-xs font-bold block mb-1">
                        {t(day.key)}
                      </span>
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: isSelected ? primaryColor : isDark ? '#27272a' : '#e4e4e7',
                          color: isSelected ? '#ffffff' : colors.textSecondary,
                        }}
                      >
                        {isSelected ? t('schedule.day_workout') : t('schedule.day_rest')}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Counter banner */}
              <div
                className="p-4 rounded-xl border flex items-center justify-between text-xs"
                style={{ backgroundColor: surfaceHoverColor, borderColor: colors.border }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                  <span>{t('schedule.selected_count')}: </span>
                  <strong className="text-sm font-bold" style={{ color: primaryColor }}>{selectedWeekdays.length}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                  <span>{t('schedule.rest_count')}: </span>
                  <strong className="text-sm font-bold">{7 - selectedWeekdays.length}</strong>
                </div>
              </div>

              {/* Preset Quick Loader */}
              <div className="pt-2 border-t" style={{ borderColor: colors.border }}>
                <h4 className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ color: colors.textSecondary }}>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {t('schedule.preset_templates')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TRAINING_PRESETS.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl border flex items-center justify-between transition"
                      style={{ backgroundColor: surfaceHoverColor, borderColor: colors.border }}
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold">
                          {language === 'ar' ? p.name : p.name_en}
                        </div>
                        <div className="text-[11px] opacity-70">
                          {p.days_per_week} {language === 'ar' ? 'أيام أسبوعياً' : 'days/week'} • {language === 'ar' ? p.badge : p.badge_en}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => loadPresetIntoCustom(p)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border transition hover:opacity-90"
                        style={{
                          backgroundColor: surfaceColor,
                          borderColor: colors.border,
                          color: textColor,
                        }}
                      >
                        {t('schedule.load_template')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : step === 2 ? (
            /* STEP 2: CUSTOMIZE EACH SELECTED DAY */
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Layers className="w-5 h-5" style={{ color: primaryColor }} />
                  {t('schedule.step2_title')}
                </h3>
                <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                  {t('schedule.step2_desc')}
                </p>
              </div>

              {/* Day selection tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {daySchedules.map((day, idx) => {
                  const isActive = idx === activeDayIndex;
                  return (
                    <button
                      key={day.weekdayIndex}
                      id={`schedule-day-tab-${day.weekdayIndex}`}
                      type="button"
                      onClick={() => setActiveDayIndex(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition ${
                        isActive
                          ? 'shadow-sm text-white'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: isActive ? primaryColor : surfaceHoverColor,
                        borderColor: isActive ? primaryColor : colors.border,
                        color: isActive ? '#ffffff' : textColor,
                      }}
                    >
                      <span>{t(day.weekdayKey)}</span>
                      <span className="opacity-75 text-[10px] mx-1">
                        ({day.exercises.length})
                      </span>
                    </button>
                  );
                })}
              </div>

              {activeDay && (
                <div
                  className="p-4 sm:p-5 rounded-2xl border space-y-4"
                  style={{ backgroundColor: surfaceHoverColor, borderColor: colors.border }}
                >
                  {/* Day Title & Muscle Focus */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5">
                        {t('schedule.day_name_label')}
                      </label>
                      <input
                        type="text"
                        value={activeDay.dayName}
                        onChange={(e) => updateActiveDayField('dayName', e.target.value)}
                        placeholder={t('schedule.day_name_placeholder')}
                        className="w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none focus:ring-1"
                        style={{
                          backgroundColor: surfaceColor,
                          borderColor: colors.border,
                          color: textColor,
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1.5">
                        {t('schedule.muscle_focus_label')}
                      </label>
                      <input
                        type="text"
                        value={activeDay.focus}
                        onChange={(e) => updateActiveDayField('focus', e.target.value)}
                        placeholder={t('schedule.muscle_focus_placeholder')}
                        className="w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none focus:ring-1"
                        style={{
                          backgroundColor: surfaceColor,
                          borderColor: colors.border,
                          color: textColor,
                        }}
                      />
                    </div>
                  </div>

                  {/* Muscle focus chips quick selector */}
                  <div>
                    <span className="block text-[11px] mb-2 opacity-70">
                      {language === 'ar' ? 'اقتراحات سريعة للتركيز:' : 'Quick Focus Suggestions:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {MUSCLE_FOCUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => updateActiveDayField('focus', language === 'ar' ? opt.ar : opt.en)}
                          className="px-2.5 py-1 rounded-lg text-[11px] border transition"
                          style={{
                            backgroundColor: surfaceColor,
                            borderColor: colors.border,
                            color: textColor,
                          }}
                        >
                          {language === 'ar' ? opt.ar : opt.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Exercises List for this day */}
                  <div className="pt-3 border-t space-y-3" style={{ borderColor: colors.border }}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold flex items-center gap-1.5">
                        <Dumbbell className="w-4 h-4" style={{ color: primaryColor }} />
                        {t('schedule.exercises_count')} ({activeDay.exercises.length})
                      </h4>
                      <button
                        type="button"
                        id="schedule-open-picker-btn"
                        onClick={() => setIsExercisePickerOpen(true)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm hover:opacity-90"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {t('schedule.add_exercise_btn')}
                      </button>
                    </div>

                    {activeDay.exercises.length === 0 ? (
                      <div
                        className="p-6 text-center rounded-xl border border-dashed text-xs opacity-75"
                        style={{ borderColor: colors.border }}
                      >
                        {t('schedule.no_exercises_day')}
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {activeDay.exercises.map((ex, exIdx) => (
                          <div
                            key={ex.id}
                            className="p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            style={{
                              backgroundColor: surfaceColor,
                              borderColor: colors.border,
                            }}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              {/* Reordering Controls */}
                              <div className="flex flex-col gap-0.5">
                                <button
                                  type="button"
                                  disabled={exIdx === 0}
                                  onClick={() => moveExercise(exIdx, 'up')}
                                  className="p-1 rounded hover:bg-zinc-500/20 disabled:opacity-25"
                                  title={t('schedule.reorder_up')}
                                >
                                  <MoveUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={exIdx === activeDay.exercises.length - 1}
                                  onClick={() => moveExercise(exIdx, 'down')}
                                  className="p-1 rounded hover:bg-zinc-500/20 disabled:opacity-25"
                                  title={t('schedule.reorder_down')}
                                >
                                  <MoveDown className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="flex-1">
                                <span className="text-xs font-bold block">
                                  {language === 'ar' ? ex.name : (ex.name_en || ex.name)}
                                </span>
                                {ex.category && (
                                  <span className="text-[10px] opacity-60">
                                    {getCategoryLabel(ex.category)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Sets & Reps Inputs */}
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] opacity-70">{t('schedule.sets_label')}:</span>
                                <input
                                  type="number"
                                  min={1}
                                  max={10}
                                  value={ex.sets}
                                  onChange={(e) =>
                                    updateExerciseField(exIdx, 'sets', parseInt(e.target.value) || 1)
                                  }
                                  className="w-12 px-2 py-1 rounded border text-center text-xs"
                                  style={{
                                    backgroundColor: surfaceHoverColor,
                                    borderColor: colors.border,
                                    color: textColor,
                                  }}
                                />
                              </div>

                              <div className="flex items-center gap-1">
                                <span className="text-[11px] opacity-70">{t('schedule.reps_label')}:</span>
                                <input
                                  type="text"
                                  value={ex.reps}
                                  onChange={(e) => updateExerciseField(exIdx, 'reps', e.target.value)}
                                  className="w-16 px-2 py-1 rounded border text-center text-xs"
                                  style={{
                                    backgroundColor: surfaceHoverColor,
                                    borderColor: colors.border,
                                    color: textColor,
                                  }}
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => removeExerciseFromActiveDay(exIdx)}
                                className="p-1.5 text-rose-500 rounded hover:bg-rose-500/10 transition"
                                title={t('schedule.remove_exercise')}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : step === 3 ? (
            /* STEP 3: SCHEDULING OPTIONS */
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5" style={{ color: primaryColor }} />
                  {t('schedule.step3_title')}
                </h3>
                <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                  {t('schedule.step3_desc')}
                </p>
              </div>

              <div className="space-y-4">
                {/* Plan Title */}
                <div>
                  <label className="block text-xs font-bold mb-1.5">
                    {t('schedule.plan_name_label')}
                  </label>
                  <input
                    type="text"
                    value={planTitle}
                    onChange={(e) => setPlanTitle(e.target.value)}
                    placeholder={t('schedule.plan_name_placeholder')}
                    className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none focus:ring-1"
                    style={{
                      backgroundColor: surfaceHoverColor,
                      borderColor: colors.border,
                      color: textColor,
                    }}
                  />
                </div>

                {/* Preferred Workout Time */}
                <div>
                  <label className="block text-xs font-bold mb-1.5">
                    {t('schedule.default_time_label')}
                  </label>
                  <input
                    type="time"
                    value={workoutTime}
                    onChange={(e) => setWorkoutTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none focus:ring-1"
                    style={{
                      backgroundColor: surfaceHoverColor,
                      borderColor: colors.border,
                      color: textColor,
                    }}
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold mb-2">
                    {t('schedule.duration_label')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { weeks: 4, labelKey: 'schedule.duration_4weeks' },
                      { weeks: 8, labelKey: 'schedule.duration_8weeks' },
                      { weeks: 12, labelKey: 'schedule.duration_12weeks' },
                      { weeks: 0, labelKey: 'schedule.duration_ongoing' },
                    ].map((dur) => {
                      const isSelected = durationWeeks === dur.weeks;
                      return (
                        <button
                          key={dur.weeks}
                          type="button"
                          onClick={() => setDurationWeeks(dur.weeks)}
                          className={`p-3 rounded-xl border text-center transition ${
                            isSelected
                              ? 'font-bold'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: isSelected
                              ? isDark
                                ? 'rgba(233, 75, 75, 0.15)'
                                : 'rgba(53, 201, 184, 0.15)'
                              : surfaceHoverColor,
                            borderColor: isSelected ? primaryColor : colors.border,
                            color: isSelected ? primaryColor : textColor,
                          }}
                        >
                          <span className="text-xs block">{t(dur.labelKey)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Auto Add to Calendar */}
                <div
                  className="p-4 rounded-xl border flex items-center justify-between"
                  style={{ backgroundColor: surfaceHoverColor, borderColor: colors.border }}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
                    <div>
                      <span className="text-xs font-bold block">
                        {t('schedule.auto_add_calendar')}
                      </span>
                      <span className="text-[11px] opacity-70">
                        {t('schedule.auto_add_calendar_desc')}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={addToCalendar}
                    onChange={(e) => setAddToCalendar(e.target.checked)}
                    className="w-5 h-5 rounded cursor-pointer"
                    style={{ accentColor: primaryColor }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* STEP 4: REVIEW AND ACTIVATE */
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  {t('schedule.step4_title')}
                </h3>
                <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                  {t('schedule.step4_desc')}
                </p>
              </div>

              {/* Volume summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div
                  className="p-4 rounded-xl border text-center"
                  style={{ backgroundColor: surfaceHoverColor, borderColor: colors.border }}
                >
                  <Activity className="w-5 h-5 mx-auto mb-1" style={{ color: primaryColor }} />
                  <span className="text-lg font-bold block">{selectedWeekdays.length}</span>
                  <span className="text-[11px] opacity-70">{t('schedule.days_selected_label')}</span>
                </div>
                <div
                  className="p-4 rounded-xl border text-center"
                  style={{ backgroundColor: surfaceHoverColor, borderColor: colors.border }}
                >
                  <Award className="w-5 h-5 mx-auto mb-1" style={{ color: primaryColor }} />
                  <span className="text-lg font-bold block">{totalWeeklySets}</span>
                  <span className="text-[11px] opacity-70">{t('schedule.total_weekly_sets')}</span>
                </div>
                <div
                  className="p-4 rounded-xl border text-center col-span-2 sm:col-span-1"
                  style={{ backgroundColor: surfaceHoverColor, borderColor: colors.border }}
                >
                  <Dumbbell className="w-5 h-5 mx-auto mb-1" style={{ color: primaryColor }} />
                  <span className="text-lg font-bold block">{totalWeeklyExercises}</span>
                  <span className="text-[11px] opacity-70">{t('schedule.total_exercises')}</span>
                </div>
              </div>

              {/* Weekly Schedule Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold" style={{ color: colors.textSecondary }}>
                  {t('schedule.weekly_breakdown')}
                </h4>
                <div className="space-y-2.5">
                  {WEEKDAYS_DEF.map((day) => {
                    const scheduled = daySchedules.find((d) => d.weekdayIndex === day.dayIndex);
                    return (
                      <div
                        key={day.dayIndex}
                        className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        style={{
                          backgroundColor: scheduled ? surfaceHoverColor : surfaceColor,
                          borderColor: colors.border,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: scheduled ? primaryColor : '#71717a',
                              opacity: scheduled ? 1 : 0.4,
                            }}
                          />
                          <div>
                            <span className="text-xs font-bold">
                              {t(day.key)}
                            </span>
                            {scheduled ? (
                              <span className="text-xs mx-2 font-medium opacity-90">
                                — {scheduled.dayName} ({scheduled.focus})
                              </span>
                            ) : (
                              <span className="text-xs mx-2 opacity-50">
                                — {t('schedule.day_rest')}
                              </span>
                            )}
                          </div>
                        </div>

                        {scheduled && (
                          <div className="text-[11px] opacity-75 self-start sm:self-auto">
                            {scheduled.exercises.length} {language === 'ar' ? 'تمارين' : 'exercises'} •{' '}
                            {scheduled.exercises.reduce((s, e) => s + (e.sets || 0), 0)}{' '}
                            {language === 'ar' ? 'جولات' : 'sets'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!successInfo && (
          <div
            className="p-4 sm:p-5 border-t flex items-center justify-between gap-3"
            style={{ borderColor: colors.border }}
          >
            {step > 1 ? (
              <button
                type="button"
                id="schedule-prev-step-btn"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
                className="px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition hover:opacity-80"
                style={{ borderColor: colors.border, backgroundColor: surfaceHoverColor, color: textColor }}
              >
                {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                {t('schedule.prev_step')}
              </button>
            ) : (
              <button
                type="button"
                id="schedule-cancel-btn"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium opacity-70 hover:opacity-100"
                style={{ color: colors.textSecondary }}
              >
                {t('common.cancel')}
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                id="schedule-next-step-btn"
                disabled={step === 1 && selectedWeekdays.length === 0}
                onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3 | 4)}
                className="px-5 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: primaryColor }}
              >
                {t('schedule.next_step')}
                {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <button
                type="button"
                id="schedule-confirm-activate-btn"
                disabled={isSubmitting || selectedWeekdays.length === 0}
                onClick={handleSaveFullPlan}
                className="px-6 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-lg transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {t('schedule.activate_plan_btn')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Nested Exercise Picker Modal */}
      {isExercisePickerOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-2xl border p-5 space-y-4 shadow-2xl max-h-[85vh] flex flex-col"
            style={{
              backgroundColor: surfaceColor,
              borderColor: colors.border,
              color: textColor,
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: colors.border }}>
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Dumbbell className="w-4 h-4" style={{ color: primaryColor }} />
                {t('schedule.pick_exercise')}
              </h4>
              <button
                type="button"
                onClick={() => setIsExercisePickerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-500/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search and manual custom creation */}
            <div className="space-y-2">
              <div className="relative">
                <Search className={`w-4 h-4 absolute top-3 text-zinc-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  value={exerciseSearch}
                  onChange={(e) => setExerciseSearch(e.target.value)}
                  placeholder={t('schedule.search_exercise')}
                  className={`w-full py-2 rounded-xl border text-xs outline-none focus:ring-1 ${
                    isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                  style={{
                    backgroundColor: surfaceHoverColor,
                    borderColor: colors.border,
                    color: textColor,
                  }}
                />
              </div>

              {/* Custom Exercise quick input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={customExerciseName}
                  onChange={(e) => setCustomExerciseName(e.target.value)}
                  placeholder={t('schedule.exercise_name_custom')}
                  className="flex-1 px-3 py-1.5 rounded-xl border text-xs outline-none"
                  style={{
                    backgroundColor: surfaceHoverColor,
                    borderColor: colors.border,
                    color: textColor,
                  }}
                />
                <button
                  type="button"
                  disabled={!customExerciseName.trim()}
                  onClick={() => {
                    if (customExerciseName.trim()) {
                      addExerciseToActiveDay({
                        name: customExerciseName.trim(),
                        name_en: customExerciseName.trim(),
                      });
                      setCustomExerciseName('');
                      setIsExercisePickerOpen(false);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl text-white text-xs font-bold disabled:opacity-40"
                  style={{ backgroundColor: primaryColor }}
                >
                  {t('schedule.custom_exercise')}
                </button>
              </div>
            </div>

            {/* Exercise List */}
            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {filteredLibraryExercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => {
                    addExerciseToActiveDay({
                      id: ex.id,
                      name: language === 'ar' ? ex.name_ar : ex.name_en,
                      name_en: ex.name_en,
                      category: ex.category,
                    });
                    setIsExercisePickerOpen(false);
                  }}
                  className="p-3 rounded-xl border cursor-pointer transition flex items-center justify-between"
                  style={{
                    backgroundColor: surfaceHoverColor,
                    borderColor: colors.border,
                  }}
                >
                  <div>
                    <span className="text-xs font-bold block">
                      {language === 'ar' ? ex.name_ar : ex.name_en}
                    </span>
                    <span className="text-[10px] opacity-60">{getCategoryLabel(ex.category)}</span>
                  </div>
                  <Plus className="w-4 h-4" style={{ color: primaryColor }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
