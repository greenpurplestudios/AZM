import { MuscleType, MuscleRankTier, MuscleRank, WorkoutSession, PersonalRecord } from '../types';

export interface MuscleMeta {
  id: MuscleType;
  name_ar: string;
  name_en: string;
  category: 'upper' | 'lower' | 'core';
  description: string;
  primaryExercises: string[];
}

export const ALL_MUSCLES: MuscleMeta[] = [
  {
    id: 'chest',
    name_ar: 'الصدر',
    name_en: 'Chest',
    category: 'upper',
    description: 'عضلات الصدر العلوي والوسطى والسفلي',
    primaryExercises: ['بنش برس مستوي بالبار', 'بنش مائل بالدامبلز', 'تفتيح الصدر بالكيبل', 'المتوازي للصدر', 'ضغط الصدر بالجهاز', 'تمرين الضغط (Push-ups)'],
  },
  {
    id: 'back',
    name_ar: 'الظهر',
    name_en: 'Back',
    category: 'upper',
    description: 'عضلات اللاتس، المجنص، ومنتصف وأعلى الظهر',
    primaryExercises: ['الرفعة الميتة (ديدليفت)', 'سحب علوي عريض (لات بول داون)', 'سحب ظهر بالبار منحنياً', 'سحب جالس للظهر بالكيبل', 'العقلة (وزن الجسم/أوزان)'],
  },
  {
    id: 'shoulders',
    name_ar: 'الأكتاف',
    name_en: 'Shoulders',
    category: 'upper',
    description: 'الدالية الأمامية والجانبية والخلفية',
    primaryExercises: ['ضغط أكتاف عسكري واقف بالبار', 'ضغط أكتاف جالس بالدامبلز', 'رفرفة كتف جانبي بالدامبل', 'فيس بول بالكيبل والحبل'],
  },
  {
    id: 'biceps',
    name_ar: 'البايسبس',
    name_en: 'Biceps',
    category: 'upper',
    description: 'الرأس الطويل والقصير وعضلة البراكياليس',
    primaryExercises: ['مرجحة بايسبس بالبار', 'مرجحة مطرقة بالدامبل', 'مرجحة ارتكاز بالدامبل'],
  },
  {
    id: 'triceps',
    name_ar: 'الترايسبس',
    name_en: 'Triceps',
    category: 'upper',
    description: 'الرؤوس الثلاثة لعضلة الذراع الخلفية',
    primaryExercises: ['دفع ترايسبس بالحبل بالكيبل', 'كسارة الجمجمة للترايسبس EZ', 'المتوازي للصدر والترايسبس'],
  },
  {
    id: 'forearms',
    name_ar: 'السواعد',
    name_en: 'Forearms',
    category: 'upper',
    description: 'عضلات القبضة وثني وبسط المعصم',
    primaryExercises: ['الديدليفت', 'العقلة', 'مرجحة المطرقة', 'مشية المزارع'],
  },
  {
    id: 'abs',
    name_ar: 'البطن والكور',
    name_en: 'Abs & Core',
    category: 'core',
    description: 'عضلات البطن المستقيمة والمائلة والحزام القطني',
    primaryExercises: ['تمرين الثبات (بلانك)', 'طحن البطن راكعاً بالكيبل', 'رفع الأرجل معلقاً', 'كرنش أرضي'],
  },
  {
    id: 'quads',
    name_ar: 'الفخذ الأمامي',
    name_en: 'Quads',
    category: 'lower',
    description: 'العضلات الرباعية الأمامية للفخذ',
    primaryExercises: ['سكوات خلفي بالبار', 'دفع الأرجل بالجهاز 45°', 'مد ركبة أمامي بالجهاز', 'الطعنات (Lunges)'],
  },
  {
    id: 'hamstrings',
    name_ar: 'الفخذ الخلفي',
    name_en: 'Hamstrings',
    category: 'lower',
    description: 'أوتار الركبة وخلفية الفخذ',
    primaryExercises: ['ديدليفت روماني (RDL)', 'مرجحة فخذ خلفي بالجهاز', 'الرفعة الميتة'],
  },
  {
    id: 'glutes',
    name_ar: 'المؤخرة والأرداف',
    name_en: 'Glutes',
    category: 'lower',
    description: 'عضلات الألوية الكبرى والوسطى للثبات والقوة',
    primaryExercises: ['سكوات خلفي بالبار', 'ديدليفت روماني (RDL)', 'دفع الحوض (Hip Thrust)'],
  },
  {
    id: 'calves',
    name_ar: 'السمانة',
    name_en: 'Calves',
    category: 'lower',
    description: 'عضلات الساق الخلفية (الجاستروكنيميوس والسوليوس)',
    primaryExercises: ['رفع السمانة واقفاً', 'رفع السمانة جالساً بالجهاز'],
  },
];

// Tier ranges
export interface TierThreshold {
  tier: MuscleRankTier;
  minScore: number;
  maxScore: number;
  title_ar: string;
  badgeColor: string;
}

export const TIER_THRESHOLDS: TierThreshold[] = [
  { tier: 'D', minScore: 0, maxScore: 29, title_ar: 'مبتدئ', badgeColor: '#64748b' },
  { tier: 'C', minScore: 30, maxScore: 44, title_ar: 'متدرب', badgeColor: '#94a3b8' },
  { tier: 'C+', minScore: 45, maxScore: 54, title_ar: 'صاعد', badgeColor: '#38bdf8' },
  { tier: 'B-', minScore: 55, maxScore: 64, title_ar: 'متمكن', badgeColor: '#34d399' },
  { tier: 'B', minScore: 65, maxScore: 74, title_ar: 'متقدم', badgeColor: '#6BAF8F' },
  { tier: 'B+', minScore: 75, maxScore: 82, title_ar: 'محترف', badgeColor: '#10b981' },
  { tier: 'A-', minScore: 83, maxScore: 89, title_ar: 'بطل', badgeColor: '#C8E6CF' },
  { tier: 'A', minScore: 90, maxScore: 94, title_ar: 'أسطوري', badgeColor: '#f59e0b' },
  { tier: 'A+', minScore: 95, maxScore: 98, title_ar: 'خارق', badgeColor: '#eab308' },
  { tier: 'S', minScore: 99, maxScore: 100, title_ar: 'عزم لا يلين', badgeColor: '#f43f5e' },
];

export function getTierFromScore(score: number): TierThreshold {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  for (let i = TIER_THRESHOLDS.length - 1; i >= 0; i--) {
    if (clamped >= TIER_THRESHOLDS[i].minScore) {
      return TIER_THRESHOLDS[i];
    }
  }
  return TIER_THRESHOLDS[0];
}

export function getProgressToNextTier(score: number): number {
  const currentTier = getTierFromScore(score);
  if (currentTier.tier === 'S') return 100;
  const range = currentTier.maxScore - currentTier.minScore + 1;
  const progress = ((score - currentTier.minScore) / range) * 100;
  return Math.max(0, Math.min(100, Math.round(progress)));
}

// Map exercise IDs/names to targeted muscles
export const EXERCISE_MUSCLE_MAP: Record<string, { primary: MuscleType; secondary?: MuscleType[] }> = {
  // Chest
  ex_bench_press: { primary: 'chest', secondary: ['triceps', 'shoulders'] },
  ex_incline_db_press: { primary: 'chest', secondary: ['shoulders', 'triceps'] },
  ex_cable_fly: { primary: 'chest' },
  ex_chest_dips: { primary: 'chest', secondary: ['triceps', 'shoulders'] },
  ex_machine_press: { primary: 'chest', secondary: ['triceps'] },
  ex_pushups: { primary: 'chest', secondary: ['triceps', 'abs'] },

  // Back
  ex_deadlift: { primary: 'back', secondary: ['hamstrings', 'glutes', 'forearms'] },
  ex_lat_pulldown: { primary: 'back', secondary: ['biceps', 'forearms'] },
  ex_barbell_row: { primary: 'back', secondary: ['biceps', 'forearms'] },
  ex_cable_row: { primary: 'back', secondary: ['biceps'] },
  ex_pullups: { primary: 'back', secondary: ['biceps', 'forearms'] },

  // Shoulders
  ex_overhead_press: { primary: 'shoulders', secondary: ['triceps'] },
  ex_db_shoulder_press: { primary: 'shoulders', secondary: ['triceps'] },
  ex_lateral_raise: { primary: 'shoulders' },
  ex_face_pull: { primary: 'shoulders', secondary: ['back'] },

  // Arms
  ex_barbell_curl: { primary: 'biceps', secondary: ['forearms'] },
  ex_hammer_curl: { primary: 'biceps', secondary: ['forearms'] },
  ex_tricep_pushdown: { primary: 'triceps' },
  ex_skull_crusher: { primary: 'triceps' },

  // Legs
  ex_barbell_squat: { primary: 'quads', secondary: ['glutes', 'hamstrings'] },
  ex_leg_press: { primary: 'quads', secondary: ['glutes'] },
  ex_romanian_deadlift: { primary: 'hamstrings', secondary: ['glutes', 'back'] },
  ex_leg_extension: { primary: 'quads' },
  ex_leg_curl: { primary: 'hamstrings' },
  ex_standing_calf: { primary: 'calves' },

  // Core
  ex_plank: { primary: 'abs' },
  ex_cable_crunch: { primary: 'abs' },
  ex_hanging_leg_raise: { primary: 'abs' },
};

// Default baseline scores for fresh installations so the user has athletic progression
export const BASELINE_MUSCLE_SCORES: Record<MuscleType, { score: number; prevRank: MuscleRankTier; change: number }> = {
  chest: { score: 82, prevRank: 'B', change: 6 },
  back: { score: 76, prevRank: 'B', change: 9 },
  shoulders: { score: 68, prevRank: 'B-', change: 5 },
  biceps: { score: 72, prevRank: 'B-', change: 4 },
  triceps: { score: 74, prevRank: 'B', change: 7 },
  forearms: { score: 60, prevRank: 'C+', change: 3 },
  abs: { score: 65, prevRank: 'B-', change: 4 },
  quads: { score: 71, prevRank: 'B-', change: 4 },
  hamstrings: { score: 67, prevRank: 'B-', change: 5 },
  glutes: { score: 64, prevRank: 'C+', change: 6 },
  calves: { score: 58, prevRank: 'C+', change: 2 },
};

export function calculateMuscleRanks(
  sessions: WorkoutSession[],
  prs: PersonalRecord[]
): MuscleRank[] {
  // Aggregate stats per muscle from real completed sessions
  const stats: Record<
    MuscleType,
    { volume: number; setsCount: number; maxWeight: number; lastTrained?: string }
  > = {
    chest: { volume: 0, setsCount: 0, maxWeight: 0 },
    back: { volume: 0, setsCount: 0, maxWeight: 0 },
    shoulders: { volume: 0, setsCount: 0, maxWeight: 0 },
    biceps: { volume: 0, setsCount: 0, maxWeight: 0 },
    triceps: { volume: 0, setsCount: 0, maxWeight: 0 },
    forearms: { volume: 0, setsCount: 0, maxWeight: 0 },
    abs: { volume: 0, setsCount: 0, maxWeight: 0 },
    quads: { volume: 0, setsCount: 0, maxWeight: 0 },
    hamstrings: { volume: 0, setsCount: 0, maxWeight: 0 },
    glutes: { volume: 0, setsCount: 0, maxWeight: 0 },
    calves: { volume: 0, setsCount: 0, maxWeight: 0 },
  };

  sessions.forEach((s) => {
    if (!s.is_completed) return;
    s.sets?.forEach((set) => {
      if (!set.completed) return;
      const mapping = EXERCISE_MUSCLE_MAP[set.exercise_id];
      const vol = (set.weight_kg || 0) * (set.reps || 0);

      if (mapping) {
        // Primary muscle gets full volume
        const prim = mapping.primary;
        stats[prim].volume += vol;
        stats[prim].setsCount += 1;
        stats[prim].maxWeight = Math.max(stats[prim].maxWeight, set.weight_kg || 0);
        stats[prim].lastTrained = s.started_at;

        // Secondary muscles get 50% volume
        mapping.secondary?.forEach((sec) => {
          stats[sec].volume += Math.round(vol * 0.5);
          stats[sec].setsCount += 1;
          stats[sec].lastTrained = s.started_at;
        });
      }
    });
  });

  return ALL_MUSCLES.map((meta) => {
    const base = BASELINE_MUSCLE_SCORES[meta.id];
    const s = stats[meta.id];

    // Compute dynamic gain from actual recorded workout sets & PRs
    const setsBonus = Math.min(12, Math.floor(s.setsCount * 0.8));
    const volumeBonus = Math.min(8, Math.floor(s.volume / 1000));
    const prCount = prs.filter((p) => {
      const mapping = EXERCISE_MUSCLE_MAP[p.exercise_id];
      return mapping?.primary === meta.id;
    }).length;
    const prBonus = Math.min(6, prCount * 2);

    const calculatedScore = Math.min(100, base.score + setsBonus + volumeBonus + prBonus);
    const tierMeta = getTierFromScore(calculatedScore);
    const progressPct = getProgressToNextTier(calculatedScore);

    return {
      muscle_id: meta.id,
      muscle_name: meta.name_ar,
      muscle_name_en: meta.name_en,
      category: meta.category,
      score: calculatedScore,
      rank: tierMeta.tier,
      previous_rank: base.prevRank,
      progress_percentage: progressPct,
      monthly_improvement_pct: base.change + Math.floor(setsBonus / 2),
      last_trained_date: s.lastTrained ? s.lastTrained.split('T')[0] : undefined,
      total_volume_kg: s.volume,
      total_sets: s.setsCount,
    };
  });
}
