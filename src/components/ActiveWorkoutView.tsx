import React, { useState, useEffect } from 'react';
import {
  WorkoutSession,
  WorkoutSet,
  Exercise,
  SetType,
  PersonalRecord,
  UserProfile,
} from '../types';
import { db } from '../db/dexie';
import { gymSound, vibratePhone } from '../utils/audio';
import { RestTimerOverlay } from './RestTimerOverlay';
import { PRCelebrationModal } from './PRCelebrationModal';
import { AddExerciseModal } from './AddExerciseModal';
import {
  Clock,
  Dumbbell,
  Plus,
  Trash2,
  Check,
  Trophy,
  Flame,
  ChevronDown,
  X,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActiveWorkoutViewProps {
  session: WorkoutSession;
  onFinishSession: (
    completedSession: WorkoutSession,
    updatedProfile: UserProfile,
    streakIncremented: boolean
  ) => void;
  onDiscardSession: () => void;
  userProfile: UserProfile;
}

export const ActiveWorkoutView: React.FC<ActiveWorkoutViewProps> = ({
  session,
  onFinishSession,
  onDiscardSession,
  userProfile,
}) => {
  const [sets, setSets] = useState<WorkoutSet[]>(session.sets || []);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Modals state
  const [isRestTimerOpen, setIsRestTimerOpen] = useState(false);
  const [restTimerExercise, setRestTimerExercise] = useState<string>('');
  const [isAddExModalOpen, setIsAddExModalOpen] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // PR Celebration Modal
  const [celebratingPR, setCelebratingPR] = useState<{
    exerciseName: string;
    weightKg: number;
    reps: number;
    previousBest?: number;
  } | null>(null);

  // Load exercises list from Dexie
  useEffect(() => {
    const loadExercises = async () => {
      const all = await db.exercises.toArray();
      setExercises(all);
    };
    loadExercises();
  }, []);

  // Elapsed time ticker
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatElapsedTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Group sets by exercise_id
  const exerciseIdsInSession: string[] = Array.from(new Set(sets.map((s) => s.exercise_id)));

  // Add a new set to an exercise
  const handleAddSet = (exerciseId: string) => {
    const exerciseSets = sets.filter((s) => s.exercise_id === exerciseId);
    const lastSet = exerciseSets[exerciseSets.length - 1];

    const newSet: WorkoutSet = {
      id: `set_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      session_id: session.id,
      exercise_id: exerciseId,
      set_number: exerciseSets.length + 1,
      set_type: lastSet ? lastSet.set_type : 'normal',
      weight_kg: lastSet ? lastSet.weight_kg : 20,
      reps: lastSet ? lastSet.reps : 10,
      completed: false,
    };

    setSets((prev) => [...prev, newSet]);
    gymSound.playSetCheckedSound();
  };

  // Update a specific set's values
  const handleUpdateSet = (setId: string, updates: Partial<WorkoutSet>) => {
    setSets((prev) =>
      prev.map((s) => (s.id === setId ? { ...s, ...updates } : s))
    );
  };

  // Remove a set
  const handleRemoveSet = (setId: string) => {
    setSets((prev) => prev.filter((s) => s.id !== setId));
  };

  // Toggle set completion + trigger local PR check & auto rest timer
  const handleToggleCompleteSet = async (set: WorkoutSet, exerciseName: string) => {
    const isNowCompleted = !set.completed;
    const updatedSet: WorkoutSet = {
      ...set,
      completed: isNowCompleted,
      completed_at: isNowCompleted ? new Date().toISOString() : undefined,
    };

    // If marked completed
    if (isNowCompleted) {
      gymSound.playSetCheckedSound();
      vibratePhone(45);

      // 1. Local PR Check (Offline-First Calculation)
      // Check previous personal record for this exercise in Dexie
      const previousPR = await db.personal_records
        .where('exercise_id')
        .equals(set.exercise_id)
        .first();

      const isNewPR =
        set.weight_kg > 0 &&
        (!previousPR || set.weight_kg > previousPR.weight_kg);

      if (isNewPR) {
        updatedSet.is_pr = true;

        // Save PR in Dexie
        const newRecord: PersonalRecord = {
          id: `pr_${set.exercise_id}`,
          exercise_id: set.exercise_id,
          exercise_name: exerciseName,
          weight_kg: set.weight_kg,
          reps: set.reps,
          estimated_1rm: Math.round(set.weight_kg * (1 + set.reps / 30)),
          achieved_at: new Date().toISOString(),
          session_id: session.id,
        };
        await db.personal_records.put(newRecord);

        // Show celebratory PR fanfare & confetti modal
        setCelebratingPR({
          exerciseName,
          weightKg: set.weight_kg,
          reps: set.reps,
          previousBest: previousPR?.weight_kg,
        });
      }

      // 2. Launch Auto Rest Timer (unless PR modal takes precedence first)
      if (!isNewPR) {
        setRestTimerExercise(exerciseName);
        setIsRestTimerOpen(true);
      }
    }

    setSets((prev) =>
      prev.map((s) => (s.id === set.id ? updatedSet : s))
    );
  };

  // Add a new exercise to the active session
  const handleAddExerciseToWorkout = (exercise: Exercise) => {
    // Add default first set
    const newSet: WorkoutSet = {
      id: `set_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      session_id: session.id,
      exercise_id: exercise.id,
      set_number: 1,
      set_type: 'normal',
      weight_kg: 20,
      reps: 10,
      completed: false,
    };
    setSets((prev) => [...prev, newSet]);
  };

  // Remove entire exercise from session
  const handleRemoveExercise = (exerciseId: string) => {
    setSets((prev) => prev.filter((s) => s.exercise_id !== exerciseId));
  };

  // Finish session
  const handleFinishWorkoutConfirmed = async () => {
    const endedAt = new Date().toISOString();
    const completedSets = sets.filter((s) => s.completed);

    const completedSession: WorkoutSession = {
      ...session,
      ended_at: endedAt,
      is_completed: true,
      duration_seconds: elapsedSeconds,
      sets,
    };

    // Save session in Dexie
    await db.workout_sessions.put(completedSession);
    await db.workout_sets.bulkPut(sets);

    // Update streak if today was not already active or ensure streak >= 1
    const todayStr = new Date().toISOString().split('T')[0];
    let updatedProfile = { ...userProfile };
    let streakIncremented = false;

    if (userProfile.last_active_date !== todayStr) {
      updatedProfile = {
        ...userProfile,
        streak_count: (userProfile.streak_count || 0) + 1,
        last_active_date: todayStr,
      };
      streakIncremented = true;
      await db.user_profile.put(updatedProfile);
    } else if (!userProfile.streak_count || userProfile.streak_count < 1) {
      updatedProfile = {
        ...userProfile,
        streak_count: 1,
        last_active_date: todayStr,
      };
      streakIncremented = true;
      await db.user_profile.put(updatedProfile);
    }

    onFinishSession(completedSession, updatedProfile, streakIncremented);
  };

  // Calculate volume & sets count
  const completedSetsCount = sets.filter((s) => s.completed).length;
  const totalVolume = sets
    .filter((s) => s.completed)
    .reduce((acc, s) => acc + (s.weight_kg || 0) * (s.reps || 0), 0);

  const SET_TYPE_LABELS: Record<SetType, { label: string; short: string; color: string }> = {
    normal: { label: 'عادية', short: 'ع', color: 'bg-slate-800 text-slate-300' },
    warmup: { label: 'إحماء', short: 'إ', color: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' },
    drop: { label: 'دروب سيت', short: 'د', color: 'bg-purple-500/15 text-purple-400 border border-purple-500/30' },
    failure: { label: 'فشل عضلي', short: 'ف', color: 'bg-rose-500/15 text-rose-400 border border-rose-500/30' },
  };

  return (
    <div id="workout-isolation-view" className="relative isolate min-h-screen pb-28 bg-[#070B0A] text-white">
      {/* Dedicated Live Workout Execution Background Layer */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <img
          src="https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1600&auto=format&fit=crop"
          alt="جلسة التدريب الحية"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-105 filter contrast-125 brightness-90 opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070B0A]/95 via-[#070B0A]/85 to-[#070B0A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15),_transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(22,46,39,0.4),_transparent_75%)]" />
      </div>

      {/* Top Fixed Isolation Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <h2 className="text-sm font-extrabold text-white truncate max-w-[180px] sm:max-w-xs">
                {session.routine_title || 'تمرين حر سريع'}
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatElapsedTime(elapsedSeconds)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDiscardConfirm(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition"
            >
              إلغاء
            </button>
            <button
              onClick={() => setShowFinishConfirm(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-emerald-500/20 active:scale-95"
            >
              إنهاء التمرين
            </button>
          </div>
        </div>

        {/* Mini stats summary */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Dumbbell className="w-3 h-3 text-slate-500" />
            <span>المجموعات المنجزة: <strong className="text-white font-mono">{completedSetsCount}</strong> / {sets.length}</span>
          </span>
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-500" />
            <span>الحجم الإجمالي: <strong className="text-emerald-400 font-mono">{totalVolume.toLocaleString()}</strong> كغ</span>
          </span>
        </div>
      </header>

      {/* Main Exercises Container */}
      <main className="p-3 sm:p-4 space-y-4 max-w-2xl mx-auto">
        {exerciseIdsInSession.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">الجلسة خالية حالياً</h3>
              <p className="text-xs text-slate-400 mt-1">ابدأ بإضافة أول تمرين لتسجيل المجموعات والأوزان</p>
            </div>
            <button
              onClick={() => setIsAddExModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" /> إضافة تمرين الآن
            </button>
          </div>
        ) : (
          exerciseIdsInSession.map((exId, exIndex) => {
            const currentEx = exercises.find((e) => e.id === exId);
            const exSets = sets.filter((s) => s.exercise_id === exId);
            const exName = currentEx?.name || 'تمرين مخصص';

            return (
              <div
                key={exId}
                className="rounded-2xl bg-slate-900/90 border border-slate-800/90 overflow-hidden shadow-lg transition"
              >
                {/* Exercise Header */}
                <div className="p-3 sm:p-3.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-800 font-mono text-xs font-bold text-emerald-400">
                      {exIndex + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white">{exName}</h3>
                      {currentEx?.name_en && (
                        <p className="text-[11px] text-slate-500 font-sans">{currentEx.name_en}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleRemoveExercise(exId)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                      title="حذف التمرين بالكامل"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sets Table Header */}
                <div className="grid grid-cols-12 gap-1 px-3 py-2 text-[11px] font-semibold text-slate-400 bg-slate-950/30 border-b border-slate-800/40 text-center">
                  <span className="col-span-2">المجموعة</span>
                  <span className="col-span-2">النوع</span>
                  <span className="col-span-3">الوزن (كغ)</span>
                  <span className="col-span-3">التكرار</span>
                  <span className="col-span-2">إنجاز</span>
                </div>

                {/* Sets List */}
                <div className="divide-y divide-slate-800/40">
                  {exSets.map((set) => (
                    <div
                      key={set.id}
                      className={`grid grid-cols-12 gap-1 items-center px-3 py-2.5 transition ${
                        set.completed ? 'bg-emerald-950/20' : 'hover:bg-slate-800/30'
                      }`}
                    >
                      {/* Set Number */}
                      <div className="col-span-2 flex items-center justify-center gap-1 font-mono text-xs font-bold text-slate-300">
                        <span>{set.set_number}</span>
                        {set.is_pr && (
                          <span title="رقم قياسي">
                            <Trophy className="w-3 h-3 text-amber-400" />
                          </span>
                        )}
                      </div>

                      {/* Set Type Selector */}
                      <div className="col-span-2 flex justify-center">
                        <select
                          value={set.set_type}
                          onChange={(e) =>
                            handleUpdateSet(set.id, { set_type: e.target.value as SetType })
                          }
                          className={`text-[10px] font-bold px-1.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 cursor-pointer focus:outline-none`}
                        >
                          <option value="normal">عادي</option>
                          <option value="warmup">إحماء</option>
                          <option value="drop">دروب</option>
                          <option value="failure">فشل</option>
                        </select>
                      </div>

                      {/* Weight (kg) */}
                      <div className="col-span-3 flex items-center justify-center">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={set.weight_kg || ''}
                          onChange={(e) =>
                            handleUpdateSet(set.id, {
                              weight_kg: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0"
                          className="w-16 text-center py-1 font-mono text-xs font-bold rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* Reps */}
                      <div className="col-span-3 flex items-center justify-center">
                        <input
                          type="number"
                          min="0"
                          value={set.reps || ''}
                          onChange={(e) =>
                            handleUpdateSet(set.id, {
                              reps: parseInt(e.target.value, 10) || 0,
                            })
                          }
                          placeholder="0"
                          className="w-14 text-center py-1 font-mono text-xs font-bold rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* Complete Checkbox */}
                      <div className="col-span-2 flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleToggleCompleteSet(set, exName)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition active:scale-90 ${
                            set.completed
                              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 hover:border hover:border-slate-600'
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Set to this exercise */}
                <div className="p-2.5 bg-slate-950/40 border-t border-slate-800/60 flex items-center justify-between">
                  <button
                    onClick={() => handleAddSet(exId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>إضافة مجموعة</span>
                  </button>

                  {exSets.length > 1 && (
                    <button
                      onClick={() => handleRemoveSet(exSets[exSets.length - 1].id)}
                      className="text-[11px] text-slate-500 hover:text-rose-400 transition"
                    >
                      حذف آخر مجموعة
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Add Another Exercise Button */}
        {exerciseIdsInSession.length > 0 && (
          <button
            onClick={() => setIsAddExModalOpen(true)}
            className="w-full py-3 rounded-2xl border border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/40 hover:bg-slate-900/80 text-slate-300 hover:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> إضافة تمرين آخر للجلسة
          </button>
        )}
      </main>

      {/* Floating Add Exercise Modal */}
      <AddExerciseModal
        isOpen={isAddExModalOpen}
        onClose={() => setIsAddExModalOpen(false)}
        onSelectExercise={handleAddExerciseToWorkout}
        existingExercises={exercises}
      />

      {/* Auto Rest Timer Overlay */}
      <RestTimerOverlay
        isOpen={isRestTimerOpen}
        onClose={() => setIsRestTimerOpen(false)}
        exerciseName={restTimerExercise}
      />

      {/* Personal Record Modal */}
      {celebratingPR && (
        <PRCelebrationModal
          isOpen={!!celebratingPR}
          onClose={() => {
            setCelebratingPR(null);
            // Open rest timer after celebrating PR
            setRestTimerExercise(celebratingPR.exerciseName);
            setIsRestTimerOpen(true);
          }}
          exerciseName={celebratingPR.exerciseName}
          weightKg={celebratingPR.weightKg}
          reps={celebratingPR.reps}
          previousBest={celebratingPR.previousBest}
        />
      )}

      {/* Confirm Finish Workout Modal */}
      {showFinishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#132B23] via-[#0E1A17] to-[#070B0A] border border-[#1F3A34] p-6 space-y-5 shadow-2xl text-right">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#1F3A34] text-[#6BAF8F]">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F4F5F3]">إنهاء وتوثيق الجلسة</h3>
                <p className="text-xs text-[#C8E6CF]/70">هل أنت مستعد لحفظ أرقامك وتحديث الستريك؟</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#070B0A]/80 border border-[#1F3A34]/70 space-y-2 text-xs">
              <div className="flex justify-between text-[#C8E6CF]/70">
                <span>الوقت الإجمالي:</span>
                <span className="font-mono font-bold text-[#F4F5F3]">{formatElapsedTime(elapsedSeconds)}</span>
              </div>
              <div className="flex justify-between text-[#C8E6CF]/70">
                <span>المجموعات المكتملة:</span>
                <span className="font-mono font-bold text-[#6BAF8F]">{completedSetsCount} مجموعة</span>
              </div>
              <div className="flex justify-between text-[#C8E6CF]/70">
                <span>الحجم الإجمالي:</span>
                <span className="font-mono font-bold text-[#A3E6C5]">{totalVolume.toLocaleString()} كغ</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleFinishWorkoutConfirmed}
                className="flex-1 py-3 rounded-xl bg-[#6BAF8F] hover:bg-[#85C4A6] text-[#070B0A] font-black text-xs transition shadow-lg shadow-[#6BAF8F]/20 active:scale-95"
              >
                تأكيد وإنهاء
              </button>
              <button
                onClick={() => setShowFinishConfirm(false)}
                className="px-4 py-3 rounded-xl bg-[#1F3A34]/50 border border-[#1F3A34] text-[#C8E6CF]/70 hover:text-[#F4F5F3] text-xs font-semibold"
              >
                متابعة التمرين
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discard Session Modal */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#0E1A17] border border-[#1F3A34] p-6 space-y-4 shadow-2xl text-right">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F4F5F3]">إلغاء التمرين؟</h3>
                <p className="text-xs text-[#C8E6CF]/70">سيتم تجاهل الجلسة الحالية ولن يتم حفظها.</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onDiscardSession}
                className="flex-1 py-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30 font-bold text-xs transition"
              >
                نعم، إلغاء الجلسة
              </button>
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1F3A34]/50 border border-[#1F3A34] text-[#C8E6CF]/80 hover:text-[#F4F5F3] text-xs font-semibold"
              >
                تراجع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
