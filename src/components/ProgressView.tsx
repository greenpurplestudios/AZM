import React, { useState, useEffect } from 'react';
import { MuscleType, MuscleRank, UserProfile, BestLift, PersonalRecord, WorkoutSession } from '../types';
import { db } from '../db/dexie';
import {
  MUSCLE_DEFINITIONS,
  computeMuscleRanksFromLifts,
  getTierConfig,
  TIER_CONFIGS,
} from '../utils/muscleLifts';
import { MuscleBodyMap } from './MuscleBodyMap';
import { SetBestLiftModal } from './SetBestLiftModal';
import { useTheme } from '../context/ThemeContext';
import {
  Trophy,
  Shield,
  TrendingUp,
  Dumbbell,
  Sparkles,
  ChevronRight,
  Activity,
  Plus,
  Info,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

interface ProgressViewProps {
  userProfile: UserProfile;
  onNavigateTrain?: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ userProfile, onNavigateTrain }) => {
  const { isDark, colors } = useTheme();
  const [muscleRanksMap, setMuscleRanksMap] = useState<Record<string, MuscleRank>>({});
  const [bestLiftsMap, setBestLiftsMap] = useState<Record<string, BestLift>>({});
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [selectedMuscleId, setSelectedMuscleId] = useState<MuscleType>('chest');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'upper' | 'lower' | 'core'>('all');
  const [activeTabSubView, setActiveTabSubView] = useState<'ranks' | 'prs' | 'analytics'>('ranks');

  // Modal State for setting best lift
  const [muscleToSetLift, setMuscleToSetLift] = useState<MuscleType | null>(null);
  const [showTierModal, setShowTierModal] = useState(false);

  // Load Best Lifts, PRs, and compute Muscle Ranks
  const loadData = async () => {
    const rawLifts = await db.best_lifts.toArray();
    const liftsObj: Record<string, BestLift> = {};
    rawLifts.forEach((l) => {
      liftsObj[l.muscle_id] = l;
    });
    setBestLiftsMap(liftsObj);

    const prs = await db.personal_records.toArray();
    setPersonalRecords(prs);

    const completedSessions = await db.workout_sessions.filter((s) => Boolean(s.is_completed)).toArray();
    setSessions(completedSessions);

    const computedList = computeMuscleRanksFromLifts(userProfile, liftsObj, completedSessions);
    const ranksObj: Record<string, MuscleRank> = {};
    computedList.forEach((m) => {
      ranksObj[m.muscle_id] = m;
    });
    setMuscleRanksMap(ranksObj);
  };

  useEffect(() => {
    loadData();
  }, [userProfile]);

  const muscleList = MUSCLE_DEFINITIONS.map((def) => {
    return (
      muscleRanksMap[def.id] || {
        muscle_id: def.id,
        muscle_name: def.name_ar,
        muscle_name_en: def.name_en,
        category: def.category,
        score: 0,
        rank: 'UNRANKED' as const,
        progress_percentage: 0,
        monthly_improvement_pct: 0,
        total_volume_kg: 0,
        total_sets: 0,
        is_unranked: true,
      }
    );
  });

  const filteredMuscles = muscleList.filter((m) => {
    if (activeCategoryFilter === 'all') return true;
    return m.category === activeCategoryFilter;
  });

  // Calculate overall stats
  const rankedMuscles = muscleList.filter((m) => !m.is_unranked && m.rank !== 'UNRANKED');
  const unrankedCount = muscleList.length - rankedMuscles.length;
  const isFullyUnranked = rankedMuscles.length === 0;

  const overallAvgScore = rankedMuscles.length
    ? Math.round(rankedMuscles.reduce((acc, m) => acc + m.score, 0) / rankedMuscles.length)
    : 0;

  const topMuscle = rankedMuscles.length
    ? [...rankedMuscles].sort((a, b) => b.score - a.score)[0]
    : null;

  // Selected muscle details
  const selectedMuscleData = muscleRanksMap[selectedMuscleId] || muscleList.find((m) => m.muscle_id === selectedMuscleId);
  const selectedDefinition = MUSCLE_DEFINITIONS.find((m) => m.id === selectedMuscleId) || MUSCLE_DEFINITIONS[0];

  const handleOpenSetLift = (mId: MuscleType) => {
    setMuscleToSetLift(mId);
  };

  const handleLiftSaved = async (savedLift: BestLift) => {
    setMuscleToSetLift(null);
    await loadData();
    setSelectedMuscleId(savedLift.muscle_id);
  };

  return (
    <div
      id="progress-view"
      className="p-4 sm:p-6 max-w-xl mx-auto space-y-6 pb-28 text-right select-none transition-colors duration-200"
    >
      {/* Top Banner with Score */}
      <div
        className="p-5 rounded-2xl border space-y-4 transition-colors"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span
              className="text-xs font-semibold uppercase tracking-wider block"
              style={{ color: colors.textMuted }}
            >
              مؤشرات القوة والتطور (Progress)
            </span>
            <h2
              className="text-xl sm:text-2xl font-bold tracking-tight"
              style={{ color: colors.textPrimary }}
            >
              رتب العضلات والتشريح
            </h2>
            <p
              className="text-xs leading-relaxed"
              style={{ color: colors.textSecondary }}
            >
              تقييم علمي دقيق مبني على أفضل أرقامك التدريبية وأوزانك قياساً بوزن جسمك.
            </p>
          </div>

          {/* Score Pill */}
          <div
            className="flex flex-col items-center justify-center p-3 rounded-2xl border text-center min-w-[80px]"
            style={{
              backgroundColor: isDark ? '#111113' : '#F0F4F4',
              borderColor: colors.border,
            }}
          >
            <span
              className="text-[10px] font-bold block"
              style={{ color: colors.textSecondary }}
            >
              معدل القوة
            </span>
            <span
              className="font-mono text-2xl font-black"
              style={{ color: colors.accent }}
            >
              {isFullyUnranked ? '--' : overallAvgScore}
            </span>
            <span
              className="text-[10px] font-mono"
              style={{ color: colors.textMuted }}
            >
              {isFullyUnranked ? 'غير مصنف' : 'من 100'}
            </span>
          </div>
        </div>

        {/* Quick Status Bar */}
        <div
          className="grid grid-cols-2 gap-2 pt-2 border-t text-xs"
          style={{ borderColor: colors.border }}
        >
          <div
            className="flex items-center gap-2 p-2.5 rounded-xl border"
            style={{
              backgroundColor: isDark ? '#111113' : '#F7F9F9',
              borderColor: colors.border,
            }}
          >
            <Trophy className="w-4 h-4 flex-shrink-0" style={{ color: colors.accent }} />
            <div className="truncate">
              <span
                className="text-[10px] block"
                style={{ color: colors.textMuted }}
              >
                أعلى رتبة مكتسبة
              </span>
              <span
                className="font-bold text-xs"
                style={{ color: colors.textPrimary }}
              >
                {topMuscle ? `${topMuscle.muscle_name} (${topMuscle.rank})` : 'لم تُحدد بعد'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowTierModal(true)}
            className="flex items-center justify-between p-2.5 rounded-xl border text-right transition hover:opacity-85"
            style={{
              backgroundColor: isDark ? '#111113' : '#F7F9F9',
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
          >
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#6BAF8F]" />
                <span className="text-[11px] font-bold text-[#C8E6CF]">سلم الرتب (D → S)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#6BAF8F] rotate-180" />
            </button>
          </div>
        </div>

      {/* Sub-Navigation Tabs: [رتب العضلات] | [الأرقام القياسية PR] | [الحجم والتحليل] */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#0E1A17] border border-[#1F3A34]">
        <button
          onClick={() => setActiveTabSubView('ranks')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
            activeTabSubView === 'ranks'
              ? 'bg-[#1F3A34] text-[#F4F5F3] shadow-md border border-[#6BAF8F]/40'
              : 'text-[#C8E6CF]/60 hover:text-[#C8E6CF]'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>خريطة الرتب</span>
        </button>

        <button
          onClick={() => setActiveTabSubView('prs')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
            activeTabSubView === 'prs'
              ? 'bg-[#1F3A34] text-[#F4F5F3] shadow-md border border-[#6BAF8F]/40'
              : 'text-[#C8E6CF]/60 hover:text-[#C8E6CF]'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>الأرقام القياسية ({personalRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSubView('analytics')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
            activeTabSubView === 'analytics'
              ? 'bg-[#1F3A34] text-[#F4F5F3] shadow-md border border-[#6BAF8F]/40'
              : 'text-[#C8E6CF]/60 hover:text-[#C8E6CF]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>تحليل الأحجام</span>
        </button>
      </div>

      {/* MAIN VIEW: RANKS & BODY VISUALIZATION */}
      {activeTabSubView === 'ranks' && (
        <div className="space-y-6">
          {/* UNRANKED INTENTIONAL EMPTY STATE / ONBOARDING BANNER */}
          {isFullyUnranked && (
            <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-[#1F3A34]/60 via-[#0E1A17] to-[#070B0A] border border-[#6BAF8F]/40 shadow-xl space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-[#1F3A34] text-[#6BAF8F] border border-[#6BAF8F]/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-[#F4F5F3]">
                    رحلتك نحو القوة تبدأ هنا (Your Strength Journey)
                  </h4>
                  <p className="text-xs text-[#C8E6CF]/80 leading-relaxed">
                    جميع العضلات تبدأ كـ <strong className="text-[#F4F5F3] font-bold">غير مصنفة (Unranked)</strong>.
                    أدخل أفضل أداء حققته في التمارين الأساسية لتفعيل رتبتك وحساب نقاطك الرياضية بناءً على وزنك ومعداتك.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleOpenSetLift('chest')}
                className="w-full py-2.5 rounded-2xl bg-[#6BAF8F] text-[#070B0A] font-black text-xs shadow-lg shadow-[#6BAF8F]/20 hover:bg-[#A3E6C5] transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>حدّد أفضل أرقامك التدريبية (Set Your Best Lifts)</span>
              </button>
            </div>
          )}

          {/* SIGNATURE FEATURE: Human Body Muscle Map (Front & Back) */}
          <div className="space-y-2">
            <MuscleBodyMap
              muscleRanks={muscleRanksMap}
              selectedMuscleId={selectedMuscleId}
              onSelectMuscle={(mId) => setSelectedMuscleId(mId)}
            />
          </div>

          {/* ACTIVE SELECTED MUSCLE DETAIL CARD */}
          {selectedMuscleData && (
            <div className="p-4 rounded-3xl bg-[#0E1A17] border-2 border-[#1F3A34] shadow-2xl space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-[#F4F5F3]">
                      {selectedMuscleData.muscle_name}
                    </h3>
                    <span className="text-xs font-mono text-[#C8E6CF]/60 font-bold">
                      {selectedMuscleData.muscle_name_en}
                    </span>
                  </div>
                  <p className="text-xs text-[#C8E6CF]/70">{selectedDefinition.description}</p>
                </div>

                {/* Tier Emblem */}
                <div
                  className="px-3.5 py-1.5 rounded-2xl font-mono font-black text-sm border flex flex-col items-center justify-center min-w-[70px] shadow-inner"
                  style={{
                    backgroundColor: getTierConfig(selectedMuscleData.rank).badgeBg,
                    borderColor: getTierConfig(selectedMuscleData.rank).badgeBorder,
                    color: getTierConfig(selectedMuscleData.rank).badgeText,
                  }}
                >
                  <span>{selectedMuscleData.rank}</span>
                  <span className="text-[9px] opacity-80 font-normal">
                    {getTierConfig(selectedMuscleData.rank).title_ar.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Lift Info or Unranked prompt */}
              {selectedMuscleData.is_unranked || selectedMuscleData.rank === 'UNRANKED' ? (
                <div className="p-3.5 rounded-2xl bg-[#070B0A] border border-[#1F3A34] space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-[#C8E6CF]/80">
                    <AlertCircle className="w-4 h-4 text-[#6BAF8F] flex-shrink-0" />
                    <span>هذه العضلة غير مصنفة حالياً. أدخل أفضل رقم مسجل لها لتفعيل الرتبة.</span>
                  </div>
                  <button
                    onClick={() => handleOpenSetLift(selectedMuscleId)}
                    className="w-full py-2.5 rounded-xl bg-[#1F3A34] hover:bg-[#6BAF8F] text-[#C8E6CF] hover:text-[#070B0A] font-black text-xs transition flex items-center justify-center gap-1.5 border border-[#6BAF8F]/40"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>حدّد أفضل رفعة (Set Best Lift)</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Detailed metrics grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-[#070B0A] border border-[#1F3A34]">
                      <span className="text-[10px] text-[#C8E6CF]/60 block">النقاط الرياضية</span>
                      <span className="font-mono font-black text-base text-[#6BAF8F]">
                        {selectedMuscleData.score}/100
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#070B0A] border border-[#1F3A34]">
                      <span className="text-[10px] text-[#C8E6CF]/60 block">القوة المقدرة (1RM)</span>
                      <span className="font-mono font-black text-base text-[#F4F5F3]">
                        {selectedMuscleData.best_lift?.input_type === 'time_seconds'
                          ? `${selectedMuscleData.best_lift?.weight_kg} ث`
                          : `${selectedMuscleData.best_lift?.estimated_1rm || 0} كغ`}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#070B0A] border border-[#1F3A34]">
                      <span className="text-[10px] text-[#C8E6CF]/60 block">التقدم منذ البدء</span>
                      <span className="font-mono font-black text-base text-emerald-400 flex items-center justify-center gap-0.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +{selectedMuscleData.monthly_improvement_pct}%
                      </span>
                    </div>
                  </div>

                  {/* Best Lift Details */}
                  {selectedMuscleData.best_lift && (
                    <div className="p-3 rounded-2xl bg-[#070B0A] border border-[#1F3A34] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-[#6BAF8F]" />
                        <div>
                          <span className="text-[10px] text-[#C8E6CF]/70 block">أفضل رفعة مسجلة:</span>
                          <span className="font-black text-[#F4F5F3]">
                            {selectedMuscleData.best_lift.exercise_name} —{' '}
                            {selectedMuscleData.best_lift.input_type === 'time_seconds'
                              ? `${selectedMuscleData.best_lift.weight_kg} ثانية`
                              : `${selectedMuscleData.best_lift.weight_kg} كغ × ${selectedMuscleData.best_lift.reps} تكرار`}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenSetLift(selectedMuscleId)}
                        className="px-2.5 py-1.5 rounded-xl bg-[#1F3A34] hover:bg-[#6BAF8F] text-[#C8E6CF] hover:text-[#070B0A] font-bold text-[11px] transition"
                      >
                        تحديث
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ALL 11 MUSCLES CARDS LIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#F4F5F3] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#6BAF8F]" />
                <span>قائمة العضلات التفصيلية ({rankedMuscles.length}/11 مصنفة)</span>
              </h3>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 text-[11px]">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'upper', label: 'العلوي' },
                  { id: 'lower', label: 'السفلي' },
                  { id: 'core', label: 'الكور' },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setActiveCategoryFilter(pill.id as any)}
                    className={`px-2 py-0.5 rounded-lg font-bold transition ${
                      activeCategoryFilter === pill.id
                        ? 'bg-[#6BAF8F] text-[#070B0A]'
                        : 'bg-[#070B0A] text-[#C8E6CF]/60 hover:text-[#F4F5F3]'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {filteredMuscles.map((muscle) => {
                const isSelected = selectedMuscleId === muscle.muscle_id;
                const isUnranked = muscle.is_unranked || muscle.rank === 'UNRANKED';
                const tier = getTierConfig(muscle.rank);

                return (
                  <div
                    key={muscle.muscle_id}
                    onClick={() => setSelectedMuscleId(muscle.muscle_id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 text-xs ${
                      isSelected
                        ? 'bg-[#1F3A34]/50 border-[#6BAF8F] shadow-lg'
                        : 'bg-[#0E1A17] border-[#1F3A34] hover:border-[#6BAF8F]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Tier Badge */}
                      <div
                        className="w-11 h-11 rounded-xl flex flex-col items-center justify-center font-mono font-black border transition"
                        style={{
                          backgroundColor: tier.badgeBg,
                          borderColor: tier.badgeBorder,
                          color: tier.badgeText,
                        }}
                      >
                        <span className="text-xs leading-none">{muscle.rank}</span>
                        <span className="text-[7px] tracking-tight opacity-70 mt-0.5">
                          {isUnranked ? 'NEW' : 'RANK'}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-[#F4F5F3]">{muscle.muscle_name}</h4>
                          <span className="text-[10px] text-[#C8E6CF]/60 font-mono">
                            {muscle.muscle_name_en}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#C8E6CF]/80">
                          {isUnranked ? (
                            <span className="text-[10px] text-[#94a3b8]">غير مصنفة بعد</span>
                          ) : (
                            <>
                              <span className="font-mono font-bold text-[#6BAF8F]">{muscle.score}/100</span>
                              <span>•</span>
                              <span className="font-mono text-[10px] text-[#C8E6CF]">
                                {muscle.best_lift?.exercise_name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {isUnranked ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSetLift(muscle.muscle_id);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-[#6BAF8F] text-[#070B0A] font-black text-[11px] shadow-sm hover:bg-[#A3E6C5] transition flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3 stroke-[3]" />
                          <span>تحديد الرقم</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSetLift(muscle.muscle_id);
                          }}
                          className="px-2 py-1 rounded-lg bg-[#070B0A] border border-[#1F3A34] text-[#C8E6CF]/80 hover:text-[#F4F5F3] text-[10px] font-bold"
                        >
                          تعديل
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW: PERSONAL RECORDS (PR) */}
      {activeTabSubView === 'prs' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-[#0E1A17] border border-[#1F3A34] space-y-2">
            <h3 className="text-sm font-black text-[#F4F5F3] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#6BAF8F]" />
              <span>سجل الأرقام القياسية الشخصية (Personal Records)</span>
            </h3>
            <p className="text-xs text-[#C8E6CF]/70">
              يتم رصد هذه الأرقام تلقائياً عند تسجيل جلسات التمارين في الصالة أو تحديث أفضل أداء للعضلة.
            </p>
          </div>

          {personalRecords.length === 0 ? (
            <div className="p-6 rounded-3xl bg-[#0E1A17] border border-[#1F3A34] text-center space-y-3">
              <Trophy className="w-8 h-8 text-[#6BAF8F]/40 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-black text-[#F4F5F3]">لا توجد أرقام قياسية مسجلة بعد</h4>
                <p className="text-xs text-[#C8E6CF]/70">
                  سجل تمارينك أثناء جلسات التدريب وسيقوم عزم برصد أعلى وزن وتكرار تلقائياً.
                </p>
              </div>
              {onNavigateTrain && (
                <button
                  onClick={onNavigateTrain}
                  className="px-4 py-2 rounded-2xl bg-[#6BAF8F] text-[#070B0A] font-black text-xs transition"
                >
                  ابدأ تمريناً الآن
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {personalRecords.map((pr) => (
                <div
                  key={pr.id}
                  className="p-3.5 rounded-2xl bg-[#0E1A17] border border-[#1F3A34] flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-black text-[#F4F5F3] block">{pr.exercise_name}</span>
                    <span className="text-[10px] text-[#C8E6CF]/60 font-mono">
                      تاريخ التحقيق: {pr.achieved_at?.split('T')[0]}
                    </span>
                  </div>

                  <div className="text-left font-mono">
                    <span className="text-sm font-black text-[#6BAF8F]">
                      {pr.weight_kg} كغ × {pr.reps}
                    </span>
                    <span className="text-[10px] text-[#C8E6CF]/60 block">
                      1RM مقدر: {pr.estimated_1rm} كغ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBVIEW: TRAINING VOLUME & ANALYTICS */}
      {activeTabSubView === 'analytics' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-[#0E1A17] border border-[#1F3A34] space-y-3">
            <h3 className="text-sm font-black text-[#F4F5F3] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#6BAF8F]" />
              <span>إحصائيات التدريب والأحجام الإجمالية</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#070B0A] border border-[#1F3A34] space-y-1">
                <span className="text-[10px] text-[#C8E6CF]/60 block">جلسات التمارين المكتملة</span>
                <span className="font-mono text-xl font-black text-[#6BAF8F]">
                  {sessions.length}
                </span>
                <span className="text-[9px] text-[#C8E6CF]/50 block">جلسة مسجلة في عزم</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#070B0A] border border-[#1F3A34] space-y-1">
                <span className="text-[10px] text-[#C8E6CF]/60 block">العضلات المصنفة</span>
                <span className="font-mono text-xl font-black text-[#C8E6CF]">
                  {rankedMuscles.length} / 11
                </span>
                <span className="text-[9px] text-[#C8E6CF]/50 block">مجموعة عضلية رئيسية</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TIER SYSTEM MODAL */}
      {showTierModal && (
        <div className="fixed inset-0 z-50 bg-[#070B0A]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0E1A17] border border-[#1F3A34] p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#1F3A34]">
              <div className="flex items-center gap-2 text-[#6BAF8F] font-bold">
                <Shield className="w-5 h-5" />
                <h3 className="text-base text-[#F4F5F3]">سلم رتب العضلات</h3>
              </div>
              <button
                onClick={() => setShowTierModal(false)}
                className="w-8 h-8 rounded-xl bg-[#070B0A] text-[#C8E6CF] flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#C8E6CF]/80 leading-relaxed">
              تحسب الرتبة بدقة رياضية تقارن قوة رفعاتك بوزن جسمك ومستوى الرياضيين المعياري:
            </p>

            <div className="space-y-2">
              {TIER_CONFIGS.map((t) => (
                <div
                  key={t.tier}
                  className="p-2.5 rounded-xl bg-[#070B0A] border border-[#1F3A34] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-9 h-9 rounded-xl font-black font-mono flex items-center justify-center text-sm border"
                      style={{
                        backgroundColor: t.badgeBg,
                        borderColor: t.badgeBorder,
                        color: t.badgeText,
                      }}
                    >
                      {t.tier}
                    </span>
                    <div>
                      <h5 className="font-bold text-[#F4F5F3]">{t.title_ar}</h5>
                      <span className="text-[10px] text-[#C8E6CF]/60 font-mono">
                        {t.tier === 'UNRANKED' ? 'لم يُسجل رقم بعد' : `النقاط: ${t.minScore} - ${t.maxScore}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SET BEST LIFT MODAL */}
      {muscleToSetLift && (
        <SetBestLiftModal
          muscleId={muscleToSetLift}
          userProfile={userProfile}
          currentBestLift={bestLiftsMap[muscleToSetLift]}
          onClose={() => setMuscleToSetLift(null)}
          onSaved={handleLiftSaved}
        />
      )}
    </div>
  );
};
