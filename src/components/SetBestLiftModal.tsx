import React, { useState, useEffect } from 'react';
import { MuscleType, UserProfile, BestLift } from '../types';
import {
  MUSCLE_DEFINITIONS,
  calculateEstimated1RM,
  calculateScoreAndRank,
  getTierConfig,
} from '../utils/muscleLifts';
import { db } from '../db/dexie';
import { X, Dumbbell, Trophy, Sparkles, TrendingUp, Check } from 'lucide-react';

interface SetBestLiftModalProps {
  muscleId: MuscleType;
  userProfile: UserProfile;
  currentBestLift?: BestLift;
  onClose: () => void;
  onSaved: (lift: BestLift) => void;
}

export const SetBestLiftModal: React.FC<SetBestLiftModalProps> = ({
  muscleId,
  userProfile,
  currentBestLift,
  onClose,
  onSaved,
}) => {
  const definition = MUSCLE_DEFINITIONS.find((m) => m.id === muscleId) || MUSCLE_DEFINITIONS[0];

  // Available lifts tailored by user equipment or defaults
  const availableLifts = definition.equipmentLifts;

  // Selected lift option
  const [selectedLiftOption, setSelectedLiftOption] = useState(
    currentBestLift?.exercise_name
      ? availableLifts.find((l) => l.name_ar === currentBestLift.exercise_name) || availableLifts[0]
      : availableLifts[0]
  );

  // Input States
  const [weightKg, setWeightKg] = useState<number>(
    currentBestLift?.weight_kg || (selectedLiftOption.inputType === 'weight_reps' ? 60 : 0)
  );
  const [reps, setReps] = useState<number>(currentBestLift?.reps || 8);
  const [addedWeightKg, setAddedWeightKg] = useState<number>(
    currentBestLift?.added_weight_kg || 0
  );
  const [timeSeconds, setTimeSeconds] = useState<number>(
    currentBestLift?.time_seconds || 60
  );

  // When selected lift changes, adapt default inputs
  const handleLiftChange = (liftItem: typeof availableLifts[0]) => {
    setSelectedLiftOption(liftItem);
    if (liftItem.inputType === 'time_seconds') {
      setTimeSeconds(60);
    } else if (liftItem.inputType === 'bodyweight_reps') {
      setReps(15);
      setWeightKg(0);
    } else if (liftItem.inputType === 'bodyweight_plus_weight') {
      setAddedWeightKg(0);
      setReps(8);
    } else {
      if (weightKg === 0) setWeightKg(60);
      if (reps === 0) setReps(8);
    }
  };

  // Live calculation of Estimated 1RM, Rank and Score
  const inputType = selectedLiftOption.inputType;
  const effectiveWeight =
    inputType === 'time_seconds'
      ? timeSeconds
      : inputType === 'bodyweight_plus_weight'
      ? (userProfile.weight_kg || 75) + addedWeightKg
      : weightKg;

  const estimated1RM = calculateEstimated1RM({
    weight_kg: inputType === 'time_seconds' ? timeSeconds : weightKg,
    reps: inputType === 'time_seconds' ? 1 : reps,
    bodyweight_kg: userProfile.weight_kg || 75,
    added_weight_kg: addedWeightKg,
    inputType,
  });

  const { score, rank } = calculateScoreAndRank(
    muscleId,
    estimated1RM,
    userProfile.weight_kg || 75
  );

  const tierConfig = getTierConfig(rank);

  // Calculate progress vs previous baseline
  let progressPct = 0;
  if (currentBestLift && currentBestLift.estimated_1rm > 0) {
    progressPct = Math.round(
      ((estimated1RM - currentBestLift.estimated_1rm) / currentBestLift.estimated_1rm) * 100
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const newBestLift: BestLift = {
      id: currentBestLift?.id || `best_${muscleId}_${Date.now()}`,
      muscle_id: muscleId,
      exercise_id: selectedLiftOption.exercise_id,
      exercise_name: selectedLiftOption.name_ar,
      exercise_name_en: selectedLiftOption.name_en,
      input_type: selectedLiftOption.inputType,
      weight_kg: inputType === 'time_seconds' ? timeSeconds : weightKg,
      reps: inputType === 'time_seconds' ? 1 : reps,
      bodyweight_kg: userProfile.weight_kg || 75,
      added_weight_kg: inputType === 'bodyweight_plus_weight' ? addedWeightKg : undefined,
      time_seconds: inputType === 'time_seconds' ? timeSeconds : undefined,
      estimated_1rm: estimated1RM,
      score,
      rank,
      initial_estimated_1rm: currentBestLift?.initial_estimated_1rm || estimated1RM,
      progress_pct: progressPct,
      updated_at: new Date().toISOString(),
    };

    // Save to Dexie table best_lifts
    await db.best_lifts.put(newBestLift);

    onSaved(newBestLift);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070B0A]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-[#0E1A17] border border-[#1F3A34] p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1F3A34]">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#6BAF8F]">
              تحديد أفضل رقم تدريبي (Best Lift)
            </span>
            <h3 className="text-lg font-black text-[#F4F5F3] flex items-center gap-2">
              <span>{definition.name_ar}</span>
              <span className="text-xs font-mono text-[#C8E6CF]/60 font-semibold">
                ({definition.name_en})
              </span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#070B0A] text-[#C8E6CF] hover:text-[#F4F5F3] flex items-center justify-center border border-[#1F3A34]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Step 1: Select Exercise */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#C8E6CF] block">
              اختر التمرين الأساسي لقياس قوة هذه العضلة:
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-0.5">
              {availableLifts.map((lift) => {
                const isSelected = selectedLiftOption.exercise_id === lift.exercise_id;
                return (
                  <button
                    key={lift.exercise_id}
                    type="button"
                    onClick={() => handleLiftChange(lift)}
                    className={`p-2.5 rounded-xl border text-right transition flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-[#1F3A34] border-[#6BAF8F] text-[#F4F5F3]'
                        : 'bg-[#070B0A] border-[#1F3A34] text-[#C8E6CF]/80 hover:border-[#6BAF8F]/40'
                    }`}
                  >
                    <div>
                      <span className="font-black block">{lift.name_ar}</span>
                      <span className="text-[10px] text-[#C8E6CF]/60 font-mono">
                        {lift.name_en} ({lift.unitLabel})
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#6BAF8F]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Performance Inputs */}
          <div className="p-3.5 rounded-2xl bg-[#070B0A] border border-[#1F3A34] space-y-3">
            <span className="text-xs font-black text-[#F4F5F3] block">
              أدخل أفضل أداء حققته في هذا التمرين:
            </span>

            {/* Standard Weight + Reps */}
            {inputType === 'weight_reps' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-[#C8E6CF]/70 font-semibold block">
                    الوزن (كغ)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    step="0.5"
                    required
                    value={weightKg || ''}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E1A17] border border-[#1F3A34] text-center font-mono text-lg font-black text-[#F4F5F3] focus:border-[#6BAF8F] outline-none"
                    placeholder="80"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#C8E6CF]/70 font-semibold block">
                    التكرارات (Reps)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={reps || ''}
                    onChange={(e) => setReps(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E1A17] border border-[#1F3A34] text-center font-mono text-lg font-black text-[#F4F5F3] focus:border-[#6BAF8F] outline-none"
                    placeholder="8"
                  />
                </div>
              </div>
            )}

            {/* Bodyweight + Added Weight */}
            {inputType === 'bodyweight_plus_weight' && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#C8E6CF]/70 font-semibold block">
                      وزن إضافي بالحزام (كغ)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="150"
                      step="0.5"
                      value={addedWeightKg}
                      onChange={(e) => setAddedWeightKg(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1A17] border border-[#1F3A34] text-center font-mono text-lg font-black text-[#F4F5F3] focus:border-[#6BAF8F] outline-none"
                      placeholder="0 (وزن الجسم فقط)"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-[#C8E6CF]/70 font-semibold block">
                      التكرارات (Reps)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      required
                      value={reps || ''}
                      onChange={(e) => setReps(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1A17] border border-[#1F3A34] text-center font-mono text-lg font-black text-[#F4F5F3] focus:border-[#6BAF8F] outline-none"
                      placeholder="8"
                    />
                  </div>
                </div>
                <span className="text-[10px] text-[#C8E6CF]/60 block text-center">
                  * وزن جسمك المعتمد في الحساب: {userProfile.weight_kg || 75} كغ
                </span>
              </div>
            )}

            {/* Pure Bodyweight Reps */}
            {inputType === 'bodyweight_reps' && (
              <div className="space-y-1">
                <label className="text-[11px] text-[#C8E6CF]/70 font-semibold block">
                  أقصى تكرارات متتالية بدون توقف (Reps)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  required
                  value={reps || ''}
                  onChange={(e) => setReps(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E1A17] border border-[#1F3A34] text-center font-mono text-xl font-black text-[#F4F5F3] focus:border-[#6BAF8F] outline-none"
                  placeholder="20"
                />
              </div>
            )}

            {/* Time in Seconds */}
            {inputType === 'time_seconds' && (
              <div className="space-y-1">
                <label className="text-[11px] text-[#C8E6CF]/70 font-semibold block">
                  مدة الثبات المستمر (بالثواني)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="5"
                    max="600"
                    step="5"
                    required
                    value={timeSeconds || ''}
                    onChange={(e) => setTimeSeconds(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E1A17] border border-[#1F3A34] text-center font-mono text-xl font-black text-[#F4F5F3] focus:border-[#6BAF8F] outline-none"
                    placeholder="60"
                  />
                  <span className="text-xs text-[#C8E6CF]/70 font-mono">
                    ({Math.floor(timeSeconds / 60)} د و {timeSeconds % 60} ث)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Live Dynamic Preview Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1F3A34]/50 via-[#0E1A17] to-[#070B0A] border border-[#1F3A34] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-[#6BAF8F] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>النتيجة والرتبة المحسوبة فورياً</span>
              </span>

              {/* Tier Badge */}
              <div
                className="px-3 py-1 rounded-xl font-mono font-black text-sm border flex items-center gap-1 shadow-md"
                style={{
                  backgroundColor: tierConfig.badgeBg,
                  borderColor: tierConfig.badgeBorder,
                  color: tierConfig.badgeText,
                }}
              >
                <span>{tierConfig.tier}</span>
                <span className="text-[10px] opacity-80">({tierConfig.title_ar})</span>
              </div>
            </div>

            {/* Metrics breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-[#070B0A]/70 border border-[#1F3A34]/60">
                <span className="text-[10px] text-[#C8E6CF]/60 block">القوة المقدرة</span>
                <span className="font-mono font-black text-sm text-[#F4F5F3]">
                  {inputType === 'time_seconds' ? `${timeSeconds} ث` : `${estimated1RM} كغ`}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-[#070B0A]/70 border border-[#1F3A34]/60">
                <span className="text-[10px] text-[#C8E6CF]/60 block">النقاط الرياضية</span>
                <span className="font-mono font-black text-sm text-[#6BAF8F]">
                  {score}/100
                </span>
              </div>

              <div className="p-2 rounded-xl bg-[#070B0A]/70 border border-[#1F3A34]/60">
                <span className="text-[10px] text-[#C8E6CF]/60 block">التطور والتقدم</span>
                <span className="font-mono font-black text-xs text-emerald-400">
                  {currentBestLift ? (progressPct >= 0 ? `+${progressPct}%` : `${progressPct}%`) : 'خط الأساس'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-[#070B0A] border border-[#1F3A34] text-[#C8E6CF] text-xs font-bold hover:bg-[#1F3A34]/40 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 rounded-2xl bg-[#6BAF8F] text-[#070B0A] text-xs font-black shadow-lg shadow-[#6BAF8F]/25 hover:bg-[#A3E6C5] transition flex items-center justify-center gap-1.5"
            >
              <Trophy className="w-4 h-4 stroke-[2.5]" />
              <span>حفظ وتثبيت الرتبة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
