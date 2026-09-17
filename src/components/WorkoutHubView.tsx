import React, { useState, useEffect } from 'react';
import { Routine, WorkoutSession, UserProfile, Exercise, PersonalRecord } from '../types';
import { db } from '../db/dexie';
import { useTheme } from '../context/ThemeContext';
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
} from 'lucide-react';

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
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [pastSessions, setPastSessions] = useState<WorkoutSession[]>([]);
  const [personalRecords, setPersonalRecords] = useState<{ pr: PersonalRecord; exerciseName: string }[]>([]);
  const [featuredExercises, setFeaturedExercises] = useState<{
    id: string;
    name: string;
    targetSets: number;
    currentWeight: number;
    currentReps: number;
    lastPerformance: string;
  }[]>([
    {
      id: 'ex_bench',
      name: 'بنش برس مستوي بالبار (Bench Press)',
      targetSets: 3,
      currentWeight: 80,
      currentReps: 8,
      lastPerformance: '77.5 kg × 8',
    },
    {
      id: 'ex_squat',
      name: 'سكوات حر بالبار (Barbell Squat)',
      targetSets: 4,
      currentWeight: 100,
      currentReps: 6,
      lastPerformance: '95 kg × 6',
    },
    {
      id: 'ex_deadlift',
      name: 'ديدلفت تقليدي (Deadlift)',
      targetSets: 3,
      currentWeight: 120,
      currentReps: 5,
      lastPerformance: '115 kg × 5',
    },
  ]);

  useEffect(() => {
    const load = async () => {
      try {
        const allRoutines = await db.routines.toArray();
        const allSessions = await db.workout_sessions
          .where('is_completed')
          .equals(1)
          .reverse()
          .limit(5)
          .toArray();

        // Load personal records
        const prs = await db.personal_records.limit(4).toArray();
        const exercises = await db.exercises.toArray();
        const exMap = new Map(exercises.map((e) => [e.id, e.name]));

        const prData = prs.map((pr) => ({
          pr,
          exerciseName: exMap.get(pr.exercise_id) || 'تمرين عام',
        }));

        setRoutines(allRoutines);
        setPastSessions(allSessions);
        setPersonalRecords(prData);
      } catch (err) {
        console.error('Error loading workout hub:', err);
      }
    };
    load();
  }, []);

  return (
    <div
      id="azm-workout-hub-view"
      className="p-4 sm:p-6 max-w-xl mx-auto space-y-7 pb-28 text-right select-none transition-colors duration-200"
    >
      {/* 1. Header */}
      <div className="space-y-1">
        <span
          className="text-xs font-semibold uppercase tracking-wider block"
          style={{ color: colors.textMuted }}
        >
          صالة التدريب • Gym Experience
        </span>
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: colors.textPrimary }}
        >
          تمارين المقاومة والأوزان
        </h1>
      </div>

      {/* 2. Today's Workout Hero Card */}
      <div
        className="p-5 rounded-2xl border space-y-4 transition-colors duration-200"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider block"
              style={{ color: colors.accent }}
            >
              التدريب الموصى به اليوم
            </span>
            <h2
              className="text-lg sm:text-xl font-bold tracking-tight mt-0.5"
              style={{ color: colors.textPrimary }}
            >
              {routines[0]?.title || 'تمرين الدفع (Push Day)'}
            </h2>
            <p
              className="text-xs mt-1"
              style={{ color: colors.textSecondary }}
            >
              {routines[0]?.description || 'التركيز على الصدر، الأكتاف الأمامية والجانبية، والترايسبس.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => {
              if (routines[0]) onStartRoutine(routines[0]);
              else onStartQuickWorkout();
            }}
            className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white transition-opacity flex items-center justify-center gap-2 active:scale-98 shadow-xs"
            style={{ backgroundColor: colors.accent }}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>ابدأ التدريب</span>
          </button>

          <button
            onClick={onStartQuickWorkout}
            className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-colors flex items-center justify-center gap-2 active:scale-98"
            style={{
              borderColor: colors.border,
              color: colors.textPrimary,
              backgroundColor: isDark ? '#1D1D20' : '#F0F4F4',
            }}
          >
            <Dumbbell className="w-4 h-4" />
            <span>تمرين حر سريع</span>
          </button>
        </div>
      </div>

      {/* 3. Muscle Rankings & Progression Banner */}
      <div
        onClick={onOpenMuscleRanks}
        className="p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors duration-200 hover:opacity-90 active:scale-99"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl border flex items-center justify-center"
            style={{
              backgroundColor: isDark ? '#1D1D20' : '#F0F4F4',
              borderColor: colors.border,
              color: colors.accent,
            }}
          >
            <Shield className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3
              className="text-sm font-bold"
              style={{ color: colors.textPrimary }}
            >
              خريطة رتب العضلات (Liftoff)
            </h3>
            <p
              className="text-xs"
              style={{ color: colors.textSecondary }}
            >
              كل عضلة تبدأ بدون رتبة (UNRANKED) وترتقي بعد تسجيل أفضل رفعة.
            </p>
          </div>
        </div>

        <ChevronLeft
          className="w-4 h-4 flex-shrink-0"
          style={{ color: colors.textMuted }}
        />
      </div>

      {/* 4. Compact & Information-Dense Exercise Tracking Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: colors.textMuted }}
          >
            التمارين المستهدفة • Exercise Tracking
          </h2>
          <span
            className="text-xs font-mono font-medium"
            style={{ color: colors.textSecondary }}
          >
            أوزان وتكرارات
          </span>
        </div>

        <div className="space-y-2">
          {featuredExercises.map((ex) => (
            <div
              key={ex.id}
              className="p-4 rounded-2xl border transition-colors duration-200 space-y-2.5"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4
                    className="text-sm font-bold tracking-tight"
                    style={{ color: colors.textPrimary }}
                  >
                    {ex.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span
                      className="font-mono font-bold"
                      style={{ color: colors.accent }}
                    >
                      {ex.currentWeight} kg × {ex.currentReps}
                    </span>
                    <span style={{ color: colors.textMuted }}>•</span>
                    <span style={{ color: colors.textSecondary }}>
                      {ex.targetSets} مجموعات
                    </span>
                  </div>
                </div>

                <button
                  onClick={onStartQuickWorkout}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 flex items-center gap-1"
                  style={{
                    borderColor: colors.border,
                    color: colors.textPrimary,
                    backgroundColor: isDark ? '#1D1D20' : '#F0F4F4',
                  }}
                >
                  <Plus className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                  <span>+ إضافة جولة</span>
                </button>
              </div>

              {/* Performance Comparison Row */}
              <div
                className="pt-2 border-t flex items-center justify-between text-xs"
                style={{ borderColor: colors.border }}
              >
                <span style={{ color: colors.textMuted }}>
                  آخر أداء مسجل:
                </span>
                <span
                  className="font-mono font-semibold"
                  style={{ color: colors.textSecondary }}
                >
                  {ex.lastPerformance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Personal Records (PRs) */}
      <div className="space-y-2.5">
        <h2
          className="text-xs font-semibold uppercase tracking-wider px-1"
          style={{ color: colors.textMuted }}
        >
          الأرقام القياسية • Personal Records
        </h2>

        {personalRecords.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5">
            {personalRecords.map(({ pr, exerciseName }) => (
              <div
                key={pr.id}
                className="p-3.5 rounded-2xl border transition-colors"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Trophy
                    className="w-4 h-4"
                    style={{ color: colors.accent }}
                  />
                  <span
                    className="text-[10px] font-mono font-bold"
                    style={{ color: colors.accent }}
                  >
                    PR
                  </span>
                </div>
                <div
                  className="text-xs font-bold line-clamp-1"
                  style={{ color: colors.textPrimary }}
                >
                  {exerciseName}
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span
                    className="text-lg font-black font-mono"
                    style={{ color: colors.textPrimary }}
                  >
                    {pr.weight_kg}
                  </span>
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: colors.textMuted }}
                  >
                    كجم × {pr.reps}
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
            سجل تمارينك باستمرار لتحطيم وحفظ أرقامك القياسية هنا تلقائياً.
          </div>
        )}
      </div>

      {/* 6. Workout History */}
      <div className="space-y-2.5">
        <h2
          className="text-xs font-semibold uppercase tracking-wider px-1"
          style={{ color: colors.textMuted }}
        >
          سجل التمارين السابقة • Workout History
        </h2>

        {pastSessions.length > 0 ? (
          <div
            className="rounded-2xl border divide-y overflow-hidden transition-colors"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            {pastSessions.map((s) => (
              <div
                key={s.id}
                className="p-3.5 flex items-center justify-between text-xs"
              >
                <div>
                  <h4
                    className="font-bold text-sm"
                    style={{ color: colors.textPrimary }}
                  >
                    {s.routine_title || 'تمرين مقاومة'}
                  </h4>
                  <span style={{ color: colors.textMuted }}>
                    {new Date(s.started_at).toLocaleDateString('ar-EG', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="text-left font-mono">
                  <span
                    className="font-bold block"
                    style={{ color: colors.accent }}
                  >
                    {s.sets?.length || 0} جولات
                  </span>
                  <span style={{ color: colors.textMuted }}>
                    {Math.round((s.duration_seconds || 1800) / 60)} دقيقة
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
            لم تسجل أي تمرين مكتمل بعد. ابدأ أول تدريب لك اليوم!
          </div>
        )}
      </div>
    </div>
  );
};
