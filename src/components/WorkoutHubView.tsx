import React, { useState, useEffect } from 'react';
import {
  Routine,
  WorkoutSession,
  UserProfile,
  PersonalRecord,
  MuscleRank,
  BestLift,
  CalendarEvent,
  MuscleType,
} from '../types';
import { db } from '../db/dexie';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Play,
  Dumbbell,
  Shield,
  Trophy,
  History,
  Clock,
  Plus,
  ArrowLeft,
  ChevronLeft,
  Calendar,
  Sparkles,
  ChevronRight,
  Flame,
  CheckCircle2,
  CalendarDays,
  Activity,
  Layers,
  X,
} from 'lucide-react';
import { MuscleBodyMap } from './MuscleBodyMap';
import { MuscleRanksView } from './MuscleRanksView';
import { CreateWorkoutPlanModal } from './CreateWorkoutPlanModal';
import {
  computeMuscleRanksFromLifts,
  getTierConfig,
  TIER_CONFIGS,
} from '../utils/muscleLifts';

interface WorkoutHubViewProps {
  onStartQuickWorkout: () => void;
  onStartRoutine: (routine: Routine) => void;
  userProfile: UserProfile;
  onOpenMuscleRanks?: () => void;
}

export const WorkoutHubView: React.FC<WorkoutHubViewProps> = ({
  onStartQuickWorkout,
  onStartRoutine,
  userProfile,
  onOpenMuscleRanks,
}) => {
  const { isDark, colors } = useTheme();
  const { isRTL, language, t } = useLanguage();

  // Muscle Ranks
  const [muscleRanks, setMuscleRanks] = useState<Record<string, MuscleRank>>({});
  const [muscleRanksList, setMuscleRanksList] = useState<MuscleRank[]>([]);
  const [selectedMuscleId, setSelectedMuscleId] = useState<MuscleType | null>(null);
  const [isRanksModalOpen, setIsRanksModalOpen] = useState(false);

  // Today's Scheduled Workout
  const [todaysWorkoutEvent, setTodaysWorkoutEvent] = useState<CalendarEvent | null>(null);
  const [routines, setRoutines] = useState<Routine[]>([]);

  // Personal Records
  const [personalRecords, setPersonalRecords] = useState<
    { pr: PersonalRecord; exerciseName: string }[]
  >([]);
  const [bestLiftsList, setBestLiftsList] = useState<BestLift[]>([]);
  const [showAllPRs, setShowAllPRs] = useState(false);

  // History
  const [pastSessions, setPastSessions] = useState<WorkoutSession[]>([]);
  const [showAllHistory, setShowAllHistory] = useState(false);

  // Create Workout Plan Modal
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);

  // Load all data
  const loadData = async () => {
    try {
      // 1. Muscle Ranks & Lifts
      const storedLifts = await db.best_lifts.toArray();
      const liftsMap: Record<string, BestLift> = {};
      storedLifts.forEach((l) => {
        liftsMap[l.muscle_id] = l;
      });
      setBestLiftsList(storedLifts);

      const completedSessions = await db.workout_sessions
        .where('is_completed')
        .equals(1)
        .toArray();

      const computed = computeMuscleRanksFromLifts(
        userProfile,
        liftsMap,
        completedSessions
      );
      setMuscleRanksList(computed);

      const mapObj: Record<string, MuscleRank> = {};
      computed.forEach((m) => {
        mapObj[m.muscle_id] = m;
      });
      setMuscleRanks(mapObj);

      // 2. Today's Workout from Calendar
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const d = String(today.getDate()).padStart(2, '0');
      const todayStr = `${y}-${m}-${d}`;

      const todaysEvents = await db.calendar_events
        .where('date')
        .equals(todayStr)
        .toArray();
      const workoutEvent = todaysEvents.find((e) => e.is_workout || e.category === 'workout');
      setTodaysWorkoutEvent(workoutEvent || null);

      // 3. Routines
      const allRoutines = await db.routines.toArray();
      setRoutines(allRoutines);

      // 4. PRs
      const prs = await db.personal_records.toArray();
      const exercises = await db.exercises.toArray();
      const exMap = new Map(exercises.map((e) => [e.id, e.name]));

      const prData = prs.map((pr) => ({
        pr,
        exerciseName: exMap.get(pr.exercise_id) || 'تمرين عام',
      }));
      setPersonalRecords(prData);

      // 5. Past Sessions History
      const sessions = await db.workout_sessions
        .where('is_completed')
        .equals(1)
        .reverse()
        .toArray();
      setPastSessions(sessions);
    } catch (err) {
      console.error('Failed to load training view data:', err);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('azm-routines-updated', handleUpdate);
    window.addEventListener('azm-ranks-updated', handleUpdate);
    window.addEventListener('azm-calendar-updated', handleUpdate);
    window.addEventListener('azm-workout-updated', handleUpdate);

    return () => {
      window.removeEventListener('azm-routines-updated', handleUpdate);
      window.removeEventListener('azm-ranks-updated', handleUpdate);
      window.removeEventListener('azm-calendar-updated', handleUpdate);
      window.removeEventListener('azm-workout-updated', handleUpdate);
    };
  }, [userProfile]);

  // Handle launching today's workout
  const handleStartTodayWorkout = () => {
    if (todaysWorkoutEvent) {
      // Find matching routine by title
      const matched = routines.find(
        (r) =>
          todaysWorkoutEvent.title.includes(r.title) ||
          r.title.includes(todaysWorkoutEvent.title.replace('تمرين:', '').trim())
      );
      if (matched) {
        onStartRoutine(matched);
        return;
      }
    }

    if (routines.length > 0) {
      onStartRoutine(routines[0]);
    } else {
      onStartQuickWorkout();
    }
  };

  const rankedCount = muscleRanksList.filter(
    (m) => !m.is_unranked && m.rank !== 'UNRANKED'
  ).length;

  return (
    <div
      id="azm-workout-hub-view"
      className="p-4 sm:p-6 max-w-xl mx-auto space-y-7 pb-28 select-none transition-colors duration-200"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* 1. Header */}
      <div className="space-y-1">
        <span
          className="text-xs font-semibold uppercase tracking-wider block"
          style={{ color: colors.accent }}
        >
          {language === 'ar' ? 'مركز التدريب والتطور' : 'Training & Progression'}
        </span>
        <h1
          className="text-2xl sm:text-3xl font-black tracking-tight"
          style={{ color: colors.textPrimary }}
        >
          {t('workout.title')}
        </h1>
        <p className="text-xs" style={{ color: colors.textSecondary }}>
          {t('workout.subtitle')}
        </p>
      </div>

      {/* ==========================================================
          SECTION 1: RANKED BODY MAP (الرتب العضلية)
          ========================================================== */}
      <div
        className="rounded-3xl border p-4 sm:p-5 space-y-3.5 shadow-xs transition-colors"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: isDark ? 'rgba(234, 179, 8, 0.15)' : 'rgba(234, 179, 8, 0.1)',
                borderColor: isDark ? 'rgba(234, 179, 8, 0.3)' : 'rgba(234, 179, 8, 0.2)',
                color: '#EAB308',
              }}
            >
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="workout-hub-muscle-rank-title"
                className="text-sm sm:text-base font-black tracking-tight"
                style={{ color: colors.textPrimary }}
              >
                {t('workout.muscle_rank')}
              </h2>
              <span className="text-[11px]" style={{ color: colors.textSecondary }}>
                {language === 'ar'
                  ? `${rankedCount} من ${muscleRanksList.length} عضلات مصنفة حتى الآن`
                  : `${rankedCount} of ${muscleRanksList.length} muscles ranked`}
              </span>
            </div>
          </div>

          <button
            id="workout-hub-view-details-btn"
            onClick={() => {
              if (onOpenMuscleRanks) onOpenMuscleRanks();
              else setIsRanksModalOpen(true);
            }}
            className="text-xs font-bold flex items-center gap-1 transition-opacity hover:opacity-80"
            style={{ color: colors.accent }}
          >
            <span>{t('workout.view_details')}</span>
            <ChevronLeft className={`w-4 h-4 ${!isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Anatomical Interactive Map */}
        <div className="pt-1">
          <MuscleBodyMap
            muscleRanks={muscleRanks}
            selectedMuscleId={selectedMuscleId}
            onSelectMuscle={(id) => {
              setSelectedMuscleId(id);
              if (onOpenMuscleRanks) onOpenMuscleRanks();
              else setIsRanksModalOpen(true);
            }}
          />
        </div>

        {/* SECTION 2: [عرض الرتب العضلية] Button directly underneath map */}
        <button
          id="workout-hub-view-ranks-btn"
          onClick={() => {
            if (onOpenMuscleRanks) onOpenMuscleRanks();
            else setIsRanksModalOpen(true);
          }}
          className="w-full py-3 px-4 rounded-2xl border font-black text-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-xs hover:opacity-90"
          style={{
            borderColor: colors.accent,
            color: colors.accent,
            backgroundColor: isDark ? '#18181C' : '#FFFFFF',
          }}
        >
          <Shield className="w-4 h-4" />
          <span>{t('workout.view_ranks_btn')}</span>
          <ChevronLeft className={`w-4 h-4 ${!isRTL ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* ==========================================================
          SECTION 3: TODAY'S TRAINING SECTION
          ========================================================== */}
      <div
        className="rounded-3xl border p-5 space-y-4 shadow-xs transition-colors"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: todaysWorkoutEvent
                    ? 'rgba(52, 199, 89, 0.15)'
                    : isDark
                    ? '#1E1E22'
                    : '#EEF2F6',
                  color: todaysWorkoutEvent ? '#34C759' : colors.textMuted,
                }}
              >
                {todaysWorkoutEvent
                  ? (language === 'ar' ? 'مجدول اليوم ✓' : 'Scheduled Today ✓')
                  : (language === 'ar' ? 'راحة أو تمرين حر' : 'Rest or Open')}
              </span>
              <span className="text-xs font-bold" style={{ color: colors.textSecondary }}>
                {t('workout.today_session')}
              </span>
            </div>

            <h3
              className="text-lg sm:text-xl font-black tracking-tight pt-1"
              style={{ color: colors.textPrimary }}
            >
              {todaysWorkoutEvent
                ? todaysWorkoutEvent.title.replace('تمرين:', '').trim()
                : routines[0]?.title || (language === 'ar' ? 'لا يوجد تمرين مجدول اليوم' : 'No workout scheduled today')}
            </h3>

            <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
              {todaysWorkoutEvent
                ? todaysWorkoutEvent.notes || (language === 'ar' ? 'جلسة تدريبية مخصصة من جدولك التدريبي.' : 'Scheduled session from your plan.')
                : (language === 'ar'
                  ? 'يمكنك أخذ يوم راحة استشفائي، بدء تمرين حر فوري، أو إنشاء جدولك الأسبوعي.'
                  : 'Take a rest day, launch a quick workout, or build your custom weekly split.')}
            </p>
          </div>
        </div>

        {/* Action Buttons for Today's Training */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            id="workout-hub-start-today-btn"
            onClick={handleStartTodayWorkout}
            className="py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black text-white transition active:scale-[0.98] flex items-center justify-center gap-2 shadow-md hover:opacity-90"
            style={{ backgroundColor: colors.accent }}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t('workout.start_today')}</span>
          </button>

          <button
            id="workout-hub-quick-workout-btn"
            onClick={onStartQuickWorkout}
            className="py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold border transition active:scale-[0.98] flex items-center justify-center gap-2 hover:opacity-80"
            style={{
              borderColor: colors.border,
              color: colors.textPrimary,
              backgroundColor: isDark ? '#18181C' : '#F4F7F7',
            }}
          >
            <Dumbbell className="w-4 h-4" />
            <span>{t('workout.quick_workout')}</span>
          </button>
        </div>

        {/* [إنشاء جدول تدريبي] Button clearly visible under training information */}
        <button
          id="workout-hub-create-schedule-btn"
          onClick={() => setIsCreatePlanOpen(true)}
          className="w-full py-3 px-4 rounded-2xl border border-dashed text-xs font-black transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          style={{
            borderColor: colors.border,
            color: colors.textPrimary,
            backgroundColor: isDark ? '#141417' : '#F8FAFA',
          }}
        >
          <Plus className="w-4 h-4" style={{ color: colors.accent }} />
          <span>{t('workout.create_schedule_btn')}</span>
        </button>
      </div>

      {/* ==========================================================
          SECTION 4: PRs (الأرقام القياسية الشخصية)
          ========================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" style={{ color: colors.accent }} />
            <h3
              id="workout-hub-prs-title"
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: colors.textPrimary }}
            >
              {t('workout.prs_title')}
            </h3>
          </div>

          {(personalRecords.length > 2 || bestLiftsList.length > 2) && (
            <button
              onClick={() => setShowAllPRs(!showAllPRs)}
              className="text-xs font-bold transition-opacity hover:opacity-80"
              style={{ color: colors.accent }}
            >
              {showAllPRs ? (language === 'ar' ? 'إخفاء' : 'Hide') : (language === 'ar' ? 'عرض الكل' : 'View All')}
            </button>
          )}
        </div>

        {bestLiftsList.length > 0 || personalRecords.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5">
            {(showAllPRs ? bestLiftsList : bestLiftsList.slice(0, 4)).map((lift) => {
              const tier = getTierConfig(lift.rank);
              return (
                <div
                  key={lift.id}
                  className="p-3.5 rounded-2xl border transition-all space-y-1.5"
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border"
                      style={{
                        backgroundColor: tier.badgeBg,
                        borderColor: tier.badgeBorder,
                        color: tier.badgeText,
                      }}
                    >
                      {language === 'ar' ? tier.title_ar : tier.title_en}
                    </span>
                    <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>
                      {language === 'ar' ? `تقدير: ${lift.estimated_1rm} كجم` : `1RM: ${lift.estimated_1rm} kg`}
                    </span>
                  </div>

                  <div className="text-xs font-bold line-clamp-1" style={{ color: colors.textPrimary }}>
                    {lift.exercise_name}
                  </div>

                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-base sm:text-lg font-black" style={{ color: colors.textPrimary }}>
                      {lift.weight_kg}
                    </span>
                    <span className="text-[10px]" style={{ color: colors.textMuted }}>
                      {language === 'ar' ? `كجم × ${lift.reps}` : `kg × ${lift.reps}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="p-4 rounded-2xl border text-center text-xs"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.textSecondary,
            }}
          >
            {language === 'ar'
              ? 'لم تسجل أي رفعة قياسية بعد. سجل أفضل رفعة لك في خريطة الرتب لتظهر أرقامك هنا.'
              : 'No personal records logged yet. Log your best lifts to display them here.'}
          </div>
        )}
      </div>

      {/* ==========================================================
          SECTION 5: WORKOUT HISTORY (سجل التمارين)
          ========================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4" style={{ color: colors.textSecondary }} />
            <h3
              id="workout-hub-history-title"
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: colors.textPrimary }}
            >
              {t('workout.history_title')}
            </h3>
          </div>

          {pastSessions.length > 3 && (
            <button
              onClick={() => setShowAllHistory(!showAllHistory)}
              className="text-xs font-bold transition-opacity hover:opacity-80"
              style={{ color: colors.accent }}
            >
              {showAllHistory
                ? (language === 'ar' ? 'إخفاء' : 'Hide')
                : (language === 'ar' ? `عرض الكل (${pastSessions.length})` : `View All (${pastSessions.length})`)}
            </button>
          )}
        </div>

        {pastSessions.length > 0 ? (
          <div
            className="rounded-3xl border divide-y overflow-hidden transition-colors"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            {(showAllHistory ? pastSessions : pastSessions.slice(0, 3)).map((session) => (
              <div
                key={session.id}
                className="p-4 flex items-center justify-between text-xs transition-colors"
              >
                <div className="space-y-0.5">
                  <h4
                    className="font-black text-sm tracking-tight"
                    style={{ color: colors.textPrimary }}
                  >
                    {session.routine_title || (language === 'ar' ? 'تمرين مقاومة' : 'Resistance Training')}
                  </h4>
                  <span className="text-[11px]" style={{ color: colors.textMuted }}>
                    {new Date(session.started_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="text-left font-mono space-y-0.5">
                  <span
                    className="font-bold text-xs block"
                    style={{ color: colors.accent }}
                  >
                    {session.sets?.length || 0} {language === 'ar' ? 'جولات' : 'sets'}
                  </span>
                  <span className="text-[11px]" style={{ color: colors.textSecondary }}>
                    {Math.round((session.duration_seconds || 1800) / 60)} {language === 'ar' ? 'دقيقة' : 'min'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="p-4 rounded-2xl border text-center text-xs"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.textSecondary,
            }}
          >
            {language === 'ar'
              ? 'لم تسجل أي جلسة تمرين بعد. ابدأ أول تدريب لك اليوم!'
              : 'No workout sessions logged yet. Start your first workout today!'}
          </div>
        )}
      </div>

      {/* Create Workout Plan Modal */}
      <CreateWorkoutPlanModal
        isOpen={isCreatePlanOpen}
        onClose={() => setIsCreatePlanOpen(false)}
        onPlanCreated={() => {
          loadData();
        }}
      />

      {/* Full Muscle Ranks Modal if accessed directly */}
      {isRanksModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex justify-center p-2 sm:p-4">
          <div
            className="w-full max-w-xl my-auto rounded-3xl border overflow-hidden shadow-2xl"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <MuscleRanksView onClose={() => setIsRanksModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
