import React, { useState, useEffect } from 'react';
import {
  MuscleType,
  MuscleRank,
  UserProfile,
  BestLift,
  WorkoutSession,
} from '../types';
import { db } from '../db/dexie';
import {
  MUSCLE_DEFINITIONS,
  computeMuscleRanksFromLifts,
  calculateEstimated1RM,
  calculateScoreAndRank,
} from '../utils/muscleLifts';
import { MuscleBodyMap } from './MuscleBodyMap';
import { useTheme } from '../context/ThemeContext';
import {
  Shield,
  Plus,
  Edit2,
  Trophy,
  Info,
  X,
  Check,
  ChevronDown,
} from 'lucide-react';

interface MuscleRanksViewProps {
  onSelectExerciseToTrain?: (muscleId: string) => void;
}

export const MuscleRanksView: React.FC<MuscleRanksViewProps> = () => {
  const { isDark, colors } = useTheme();
  const [muscleRanks, setMuscleRanks] = useState<MuscleRank[]>([]);
  const [filterCategory, setFilterCategory] = useState<'all' | 'upper' | 'lower' | 'core'>('all');
  const [selectedMuscleId, setSelectedMuscleId] = useState<MuscleType | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [bestLifts, setBestLifts] = useState<Record<string, BestLift>>({});

  // Modal for logging/updating best lift
  const [editingMuscle, setEditingMuscle] = useState<MuscleRank | null>(null);
  const [liftWeight, setLiftWeight] = useState<number>(60);
  const [liftReps, setLiftReps] = useState<number>(8);

  const loadData = async () => {
    try {
      const profile = await db.user_profile.toCollection().first();
      const loadedProfile: UserProfile = profile || {
        id: 'user_default',
        name: 'قيس',
        weight_kg: 75,
        daily_water_target_ml: 2625,
        streak_count: 7,
        equipment: ['barbell', 'dumbbells', 'pullup_bar'],
      };
      setUserProfile(loadedProfile);

      // Load best lifts
      const storedLifts = await db.best_lifts.toArray();
      const liftsMap: Record<string, BestLift> = {};
      storedLifts.forEach((l) => {
        liftsMap[l.muscle_id] = l;
      });
      setBestLifts(liftsMap);

      // Load completed sessions
      const sessions = await db.workout_sessions.where('is_completed').equals(1).toArray();
      const computed = computeMuscleRanksFromLifts(loadedProfile, liftsMap, sessions);
      setMuscleRanks(computed);
    } catch (err) {
      console.error('Failed to load muscle ranks:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openLogModal = (muscle: MuscleRank) => {
    setEditingMuscle(muscle);
    const existing = bestLifts[muscle.muscle_id];
    if (existing) {
      setLiftWeight(existing.weight_kg);
      setLiftReps(existing.reps);
    } else {
      setLiftWeight(muscle.category === 'lower' ? 80 : 50);
      setLiftReps(8);
    }
  };

  const handleSaveBestLift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMuscle || !userProfile) return;

    const muscleDef = MUSCLE_DEFINITIONS.find((m) => m.id === editingMuscle.muscle_id);
    const est1RM = calculateEstimated1RM({
      weight_kg: liftWeight,
      reps: liftReps,
      bodyweight_kg: userProfile.weight_kg || 75,
      inputType: 'weight_reps',
    });

    const { score, rank } = calculateScoreAndRank(
      editingMuscle.muscle_id,
      est1RM,
      userProfile.weight_kg || 75
    );

    const updatedLift: BestLift = {
      id: `lift_${editingMuscle.muscle_id}`,
      muscle_id: editingMuscle.muscle_id,
      exercise_name: muscleDef?.defaultLiftName || 'رفعة القوة المعتمدة',
      input_type: 'weight_reps',
      weight_kg: liftWeight,
      reps: liftReps,
      estimated_1rm: est1RM,
      rank,
      score,
      progress_pct: 0,
      updated_at: new Date().toISOString(),
    };

    await db.best_lifts.put(updatedLift);
    setEditingMuscle(null);
    await loadData();
  };

  const filtered = muscleRanks.filter((m) => {
    if (filterCategory === 'all') return true;
    return m.category === filterCategory;
  });

  const muscleRanksMap = React.useMemo(() => {
    const map: Record<string, MuscleRank> = {};
    muscleRanks.forEach((m) => {
      map[m.muscle_id] = m;
    });
    return map;
  }, [muscleRanks]);

  const rankedCount = muscleRanks.filter((m) => !m.is_unranked && m.rank !== 'UNRANKED').length;

  return (
    <div
      id="azm-muscle-ranks-view"
      className="p-4 sm:p-6 max-w-xl mx-auto space-y-7 pb-28 text-right select-none transition-colors duration-200"
    >
      {/* 1. Header */}
      <div className="space-y-1">
        <span
          className="text-xs font-semibold uppercase tracking-wider block"
          style={{ color: colors.textMuted }}
        >
          نظام Liftoff • خريطة القوة
        </span>
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: colors.textPrimary }}
        >
          رتب العضلات وتطور القوة
        </h1>
        <p className="text-xs" style={{ color: colors.textSecondary }}>
          جميع العضلات تبدأ بدون رتبة (UNRANKED)، وتُمنح الرتبة فور تسجيل أفضل رفعة لك.
        </p>
      </div>

      {/* 2. Anatomical Body Map */}
      <MuscleBodyMap
        muscleRanks={muscleRanksMap}
        selectedMuscleId={selectedMuscleId}
        onSelectMuscle={(id) => {
          setSelectedMuscleId(id);
          const found = muscleRanks.find((m) => m.muscle_id === id);
          if (found) openLogModal(found);
        }}
      />

      {/* 3. Filter Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'all', label: `الكل (${rankedCount}/${muscleRanks.length})` },
          { id: 'upper', label: 'الجزء العلوي' },
          { id: 'lower', label: 'الجزء السفلي' },
          { id: 'core', label: 'الجذع والبطن' },
        ].map((cat) => {
          const isSelected = filterCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id as any)}
              className="px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all"
              style={{
                backgroundColor: isSelected
                  ? isDark
                    ? '#1D1D20'
                    : '#FFFFFF'
                  : 'transparent',
                borderColor: isSelected ? colors.accent : colors.border,
                color: isSelected ? colors.accent : colors.textSecondary,
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 4. Muscle List Cards */}
      <div className="space-y-2">
        {filtered.map((muscle) => {
          const isUnranked = muscle.is_unranked || muscle.rank === 'UNRANKED';
          const lift = bestLifts[muscle.muscle_id];

          return (
            <div
              key={muscle.muscle_id}
              className="p-4 rounded-2xl border transition-all duration-150 flex items-center justify-between"
              style={{
                backgroundColor: colors.card,
                borderColor: selectedMuscleId === muscle.muscle_id ? colors.accent : colors.border,
              }}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4
                    className="text-sm font-bold tracking-tight"
                    style={{ color: colors.textPrimary }}
                  >
                    {muscle.muscle_name}
                  </h4>
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border"
                    style={{
                      backgroundColor: isUnranked
                        ? isDark ? '#111113' : '#F0F4F4'
                        : isDark ? '#2D1B1E' : '#E6F9F6',
                      borderColor: isUnranked ? colors.border : colors.accent,
                      color: isUnranked ? colors.textMuted : colors.accent,
                    }}
                  >
                    {isUnranked ? 'UNRANKED' : `رتبة ${muscle.rank}`}
                  </span>
                </div>

                <div className="text-xs" style={{ color: colors.textSecondary }}>
                  {lift ? (
                    <span className="font-mono">
                      أفضل رفعة: {lift.weight_kg} كجم × {lift.reps} تكرار (1RM تقريبي: {lift.estimated_1rm} كجم)
                    </span>
                  ) : (
                    <span>لم يتم إدخال رفعة قياسية بعد</span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => openLogModal(muscle)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1 transition-all active:scale-95"
                style={{
                  borderColor: isUnranked ? colors.border : colors.accent,
                  color: isUnranked ? colors.textPrimary : colors.accent,
                  backgroundColor: isDark ? '#171719' : '#FFFFFF',
                }}
              >
                {isUnranked ? (
                  <>
                    <Plus className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                    <span>تسجيل رفعة</span>
                  </>
                ) : (
                  <>
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>تعديل</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* 5. Best Lift Input Modal */}
      {editingMuscle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-sm rounded-2xl border p-5 space-y-4 text-right select-none shadow-xl"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span
                  className="text-xs font-mono font-bold uppercase tracking-wider block"
                  style={{ color: colors.accent }}
                >
                  تسجيل الرفعة القياسية
                </span>
                <h3
                  className="text-lg font-bold"
                  style={{ color: colors.textPrimary }}
                >
                  عضلة {editingMuscle.muscle_name}
                </h3>
              </div>
              <button
                onClick={() => setEditingMuscle(null)}
                className="p-1 rounded-lg border hover:opacity-80"
                style={{ borderColor: colors.border, color: colors.textMuted }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBestLift} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  className="text-xs font-medium"
                  style={{ color: colors.textSecondary }}
                >
                  أعلى وزن رفعته (كجم):
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="500"
                  value={liftWeight}
                  onChange={(e) => setLiftWeight(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl border text-sm font-mono font-bold focus:outline-hidden"
                  style={{
                    backgroundColor: isDark ? '#111113' : '#F7F9F9',
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-xs font-medium"
                  style={{ color: colors.textSecondary }}
                >
                  عدد التكرارات النظيفة بهذا الوزن:
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={liftReps}
                  onChange={(e) => setLiftReps(parseInt(e.target.value, 10) || 1)}
                  className="w-full p-2.5 rounded-xl border text-sm font-mono font-bold focus:outline-hidden"
                  style={{
                    backgroundColor: isDark ? '#111113' : '#F7F9F9',
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                  required
                />
              </div>

              <div
                className="p-3 rounded-xl border text-xs space-y-1"
                style={{
                  backgroundColor: isDark ? '#111113' : '#F7F9F9',
                  borderColor: colors.border,
                  color: colors.textSecondary,
                }}
              >
                <div className="flex justify-between font-mono font-bold">
                  <span>الـ 1RM التقريبي المحسوب:</span>
                  <span style={{ color: colors.accent }}>
                    {calculateEstimated1RM({
                      weight_kg: liftWeight,
                      reps: liftReps,
                      bodyweight_kg: userProfile?.weight_kg || 75,
                      inputType: 'weight_reps',
                    })}{' '}
                    كجم
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMuscle(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border"
                  style={{ borderColor: colors.border, color: colors.textSecondary }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-opacity"
                  style={{ backgroundColor: colors.accent }}
                >
                  حساب وحفظ الرتبة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
