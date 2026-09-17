import {
  MuscleType,
  MuscleRankTier,
  MuscleRank,
  BestLift,
  EquipmentType,
  UserProfile,
  WorkoutSession,
} from '../types';

export interface MuscleDefinition {
  id: MuscleType;
  name_ar: string;
  name_en: string;
  category: 'upper' | 'lower' | 'core';
  description: string;
  defaultLiftName: string;
  defaultLiftNameEn: string;
  // Exercises tailored by equipment
  equipmentLifts: {
    equipment: EquipmentType | 'all';
    exercise_id: string;
    name_ar: string;
    name_en: string;
    inputType: 'weight_reps' | 'bodyweight_reps' | 'bodyweight_plus_weight' | 'time_seconds';
    unitLabel: string;
  }[];
}

export const MUSCLE_DEFINITIONS: MuscleDefinition[] = [
  {
    id: 'chest',
    name_ar: 'الصدر',
    name_en: 'Chest',
    category: 'upper',
    description: 'عضلات الصدر العلوي والوسطى والسفلي',
    defaultLiftName: 'بنش برس مستوي بالبار',
    defaultLiftNameEn: 'Barbell Bench Press',
    equipmentLifts: [
      {
        equipment: 'barbell',
        exercise_id: 'ex_bench_press',
        name_ar: 'بنش برس مستوي بالبار',
        name_en: 'Barbell Bench Press',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'dumbbells',
        exercise_id: 'ex_incline_db_press',
        name_ar: 'بنش برس بالدامبلز',
        name_en: 'Dumbbell Bench Press',
        inputType: 'weight_reps',
        unitLabel: 'كغ لكل دامبل',
      },
      {
        equipment: 'pullup_bar',
        exercise_id: 'ex_chest_dips',
        name_ar: 'المتوازي للصدر',
        name_en: 'Chest Dips',
        inputType: 'bodyweight_plus_weight',
        unitLabel: 'تكرار / وزن إضافي',
      },
      {
        equipment: 'machines',
        exercise_id: 'ex_machine_press',
        name_ar: 'ضغط الصدر بالجهاز',
        name_en: 'Chest Press Machine',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'bodyweight',
        exercise_id: 'ex_pushups',
        name_ar: 'تمرين الضغط الكلاسيكي',
        name_en: 'Push-ups',
        inputType: 'bodyweight_reps',
        unitLabel: 'أقصى تكرارات متتالية',
      },
    ],
  },
  {
    id: 'back',
    name_ar: 'الظهر',
    name_en: 'Back',
    category: 'upper',
    description: 'عضلات الظهر العريض ومنتصف وأعلى الظهر والقطنية',
    defaultLiftName: 'الرفعة الميتة بالبار',
    defaultLiftNameEn: 'Deadlift / Pull-ups',
    equipmentLifts: [
      {
        equipment: 'barbell',
        exercise_id: 'ex_deadlift',
        name_ar: 'الرفعة الميتة بالبار',
        name_en: 'Barbell Deadlift',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'pullup_bar',
        exercise_id: 'ex_pullups',
        name_ar: 'العقلة بوزن الجسم',
        name_en: 'Pull-ups',
        inputType: 'bodyweight_plus_weight',
        unitLabel: 'تكرار / وزن إضافي',
      },
      {
        equipment: 'barbell',
        exercise_id: 'ex_barbell_row',
        name_ar: 'سحب ظهر بالبار منحنياً',
        name_en: 'Barbell Bent-over Row',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'dumbbells',
        exercise_id: 'ex_db_row',
        name_ar: 'سحب منشار بالدامبل',
        name_en: 'Dumbbell Row',
        inputType: 'weight_reps',
        unitLabel: 'كغ للدامبل',
      },
      {
        equipment: 'machines',
        exercise_id: 'ex_lat_pulldown',
        name_ar: 'سحب علوي عريض بالكيبل',
        name_en: 'Lat Pulldown',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
    ],
  },
  {
    id: 'shoulders',
    name_ar: 'الأكتاف',
    name_en: 'Shoulders',
    category: 'upper',
    description: 'الدالية الأمامية والجانبية والخلفية',
    defaultLiftName: 'ضغط أكتاف عسكري بالبار',
    defaultLiftNameEn: 'Overhead Press',
    equipmentLifts: [
      {
        equipment: 'barbell',
        exercise_id: 'ex_overhead_press',
        name_ar: 'ضغط أكتاف عسكري بالبار',
        name_en: 'Overhead Press (OHP)',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'dumbbells',
        exercise_id: 'ex_db_shoulder_press',
        name_ar: 'ضغط أكتاف جالس بالدامبلز',
        name_en: 'Dumbbell Shoulder Press',
        inputType: 'weight_reps',
        unitLabel: 'كغ لكل دامبل',
      },
      {
        equipment: 'machines',
        exercise_id: 'ex_machine_shoulder',
        name_ar: 'ضغط أكتاف بالجهاز',
        name_en: 'Machine Shoulder Press',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'bodyweight',
        exercise_id: 'ex_pike_pushup',
        name_ar: 'ضغط البايك المرتفع للأكتاف',
        name_en: 'Pike Push-ups',
        inputType: 'bodyweight_reps',
        unitLabel: 'أقصى تكرارات',
      },
    ],
  },
  {
    id: 'biceps',
    name_ar: 'البايسبس',
    name_en: 'Biceps',
    category: 'upper',
    description: 'الرأس الطويل والقصير وعضلة البراكياليس',
    defaultLiftName: 'مرجحة بايسبس بالبار',
    defaultLiftNameEn: 'Barbell Curl',
    equipmentLifts: [
      {
        equipment: 'barbell',
        exercise_id: 'ex_barbell_curl',
        name_ar: 'مرجحة بايسبس بالبار الأولمبي',
        name_en: 'Barbell Bicep Curl',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'dumbbells',
        exercise_id: 'ex_hammer_curl',
        name_ar: 'مرجحة بايسبس بالدامبلز',
        name_en: 'Dumbbell Bicep Curl',
        inputType: 'weight_reps',
        unitLabel: 'كغ لكل دامبل',
      },
      {
        equipment: 'pullup_bar',
        exercise_id: 'ex_chinups',
        name_ar: 'العقلة بقبضة معكوسة',
        name_en: 'Chin-ups',
        inputType: 'bodyweight_plus_weight',
        unitLabel: 'تكرارات / وزن إضافي',
      },
      {
        equipment: 'cable',
        exercise_id: 'ex_cable_curl',
        name_ar: 'مرجحة بايسبس بالكيبل',
        name_en: 'Cable Curl',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
    ],
  },
  {
    id: 'triceps',
    name_ar: 'الترايسبس',
    name_en: 'Triceps',
    category: 'upper',
    description: 'الرؤوس الثلاثة لعضلة الذراع الخلفية',
    defaultLiftName: 'دفع ترايسبس بالحبل بالكيبل',
    defaultLiftNameEn: 'Tricep Pushdown / Dips',
    equipmentLifts: [
      {
        equipment: 'cable',
        exercise_id: 'ex_tricep_pushdown',
        name_ar: 'دفع ترايسبس بالحبل بالكيبل',
        name_en: 'Tricep Rope Pushdown',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'barbell',
        exercise_id: 'ex_skull_crusher',
        name_ar: 'مد ترايسبس بالبار الزجزاج',
        name_en: 'Skull Crusher',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'dumbbells',
        exercise_id: 'ex_db_overhead_tricep',
        name_ar: 'مد ترايسبس خلف الرأس بالدامبل',
        name_en: 'Overhead DB Tricep Extension',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'bodyweight',
        exercise_id: 'ex_diamond_pushups',
        name_ar: 'تمرين الضغط الماسي',
        name_en: 'Diamond Push-ups',
        inputType: 'bodyweight_reps',
        unitLabel: 'أقصى تكرارات',
      },
    ],
  },
  {
    id: 'quads',
    name_ar: 'الفخذ الأمامي',
    name_en: 'Quads',
    category: 'lower',
    description: 'العضلات الرباعية الأمامية للفخذ',
    defaultLiftName: 'سكوات خلفي بالبار',
    defaultLiftNameEn: 'Barbell Back Squat',
    equipmentLifts: [
      {
        equipment: 'barbell',
        exercise_id: 'ex_barbell_squat',
        name_ar: 'سكوات خلفي بالبار',
        name_en: 'Barbell Back Squat',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'machines',
        exercise_id: 'ex_leg_press',
        name_ar: 'دفع الأرجل بالجهاز',
        name_en: 'Leg Press Machine',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'dumbbells',
        exercise_id: 'ex_goblet_squat',
        name_ar: 'سكوات كأسي بالدامبل',
        name_en: 'Goblet Squat',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'bodyweight',
        exercise_id: 'ex_bodyweight_squat',
        name_ar: 'سكوات حر بوزن الجسم',
        name_en: 'Bodyweight Squats',
        inputType: 'bodyweight_reps',
        unitLabel: 'تكرار متتالي',
      },
    ],
  },
  {
    id: 'hamstrings',
    name_ar: 'الفخذ الخلفي',
    name_en: 'Hamstrings',
    category: 'lower',
    description: 'أوتار الركبة والعضلات الخلفية للفخذ',
    defaultLiftName: 'الرفعة الرومانية بالبار',
    defaultLiftNameEn: 'Romanian Deadlift (RDL)',
    equipmentLifts: [
      {
        equipment: 'barbell',
        exercise_id: 'ex_romanian_deadlift',
        name_ar: 'الرفعة الرومانية بالبار',
        name_en: 'Barbell Romanian Deadlift',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'dumbbells',
        exercise_id: 'ex_db_rdl',
        name_ar: 'الرفعة الرومانية بالدامبلز',
        name_en: 'Dumbbell RDL',
        inputType: 'weight_reps',
        unitLabel: 'كغ للدامبل الواحد',
      },
      {
        equipment: 'machines',
        exercise_id: 'ex_leg_curl',
        name_ar: 'ثني فخذ خلفي بالجهاز',
        name_en: 'Lying Leg Curl',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'bodyweight',
        exercise_id: 'ex_nordic_curl',
        name_ar: 'جسر الفخذ الخلفي الأرضي',
        name_en: 'Hamstring Glute Bridge',
        inputType: 'bodyweight_reps',
        unitLabel: 'تكرارات',
      },
    ],
  },
  {
    id: 'glutes',
    name_ar: 'الأرداف وعضلات الحوض',
    name_en: 'Glutes',
    category: 'lower',
    description: 'عضلات الألوية الكبرى والوسطى للثبات والقوة',
    defaultLiftName: 'دفع الحوض بالبار',
    defaultLiftNameEn: 'Hip Thrust / Squat',
    equipmentLifts: [
      {
        equipment: 'barbell',
        exercise_id: 'ex_hip_thrust',
        name_ar: 'دفع الحوض بالبار',
        name_en: 'Barbell Hip Thrust',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'dumbbells',
        exercise_id: 'ex_db_hip_thrust',
        name_ar: 'دفع الحوض بالدامبل أو الطعن البلغاري',
        name_en: 'Bulgarian Split Squat / DB Thrust',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'bodyweight',
        exercise_id: 'ex_single_leg_bridge',
        name_ar: 'جسر الحوض الفردي',
        name_en: 'Single Leg Glute Bridge',
        inputType: 'bodyweight_reps',
        unitLabel: 'تكرار لكل رجل',
      },
    ],
  },
  {
    id: 'calves',
    name_ar: 'السمانة',
    name_en: 'Calves',
    category: 'lower',
    description: 'عضلات الساق الخلفية والتحمل',
    defaultLiftName: 'رفع السمانة واقفاً',
    defaultLiftNameEn: 'Standing Calf Raise',
    equipmentLifts: [
      {
        equipment: 'machines',
        exercise_id: 'ex_standing_calf',
        name_ar: 'رفع السمانة واقفاً بالجهاز',
        name_en: 'Standing Calf Raise Machine',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'dumbbells',
        exercise_id: 'ex_db_calf_raise',
        name_ar: 'رفع السمانة بالدامبلز',
        name_en: 'Dumbbell Calf Raise',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'bodyweight',
        exercise_id: 'ex_single_leg_calf',
        name_ar: 'رفع السمانة الفردي بوزن الجسم',
        name_en: 'Single Leg Calf Raise',
        inputType: 'bodyweight_reps',
        unitLabel: 'تكرارات متتالية',
      },
    ],
  },
  {
    id: 'abs',
    name_ar: 'البطن والجذع',
    name_en: 'Abs & Core',
    category: 'core',
    description: 'عضلات البطن المستقيمة والمائلة والحزام القطني',
    defaultLiftName: 'رفع الأرجل معلقاً أو البلانك',
    defaultLiftNameEn: 'Hanging Leg Raise / Plank',
    equipmentLifts: [
      {
        equipment: 'pullup_bar',
        exercise_id: 'ex_hanging_leg_raise',
        name_ar: 'رفع الأرجل معلقاً بالعقلة',
        name_en: 'Hanging Leg Raise',
        inputType: 'bodyweight_reps',
        unitLabel: 'تكرار نظيف',
      },
      {
        equipment: 'cable',
        exercise_id: 'ex_cable_crunch',
        name_ar: 'طحن البطن راكعاً بالكيبل',
        name_en: 'Cable Crunch',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'bodyweight',
        exercise_id: 'ex_plank',
        name_ar: 'تمرين الثبات بلانك بالثواني',
        name_en: 'Plank Hold',
        inputType: 'time_seconds',
        unitLabel: 'ثواني ثبات مستمر',
      },
    ],
  },
  {
    id: 'forearms',
    name_ar: 'السواعد',
    name_en: 'Forearms',
    category: 'upper',
    description: 'عضلات القبضة والتحمل وثني وبسط المعصم',
    defaultLiftName: 'التعلق الحر بالعقلة',
    defaultLiftNameEn: 'Dead Hang / Wrist Curls',
    equipmentLifts: [
      {
        equipment: 'pullup_bar',
        exercise_id: 'ex_dead_hang',
        name_ar: 'التعلق الحر بالعقلة للقبضة',
        name_en: 'Dead Hang (Grip)',
        inputType: 'time_seconds',
        unitLabel: 'ثواني ثبات',
      },
      {
        equipment: 'dumbbells',
        exercise_id: 'ex_farmers_walk',
        name_ar: 'مشية المزارع بالدامبلز',
        name_en: 'Farmer’s Walk',
        inputType: 'weight_reps',
        unitLabel: 'كغ لكل يد',
      },
      {
        equipment: 'barbell',
        exercise_id: 'ex_wrist_curl',
        name_ar: 'ثني المعصم بالبار',
        name_en: 'Barbell Wrist Curl',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
    ],
  },
];

export interface TierConfig {
  tier: MuscleRankTier;
  title_ar: string;
  title_en: string;
  minScore: number;
  maxScore: number;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export const TIER_CONFIGS: TierConfig[] = [
  {
    tier: 'UNRANKED',
    title_ar: 'غير مصنف',
    title_en: 'Unranked',
    minScore: 0,
    maxScore: 0,
    color: '#64748B',
    badgeBg: 'rgba(100, 116, 139, 0.15)',
    badgeBorder: '#475569',
    badgeText: '#94A3B8',
  },
  {
    tier: 'BRONZE',
    title_ar: 'برونزي',
    title_en: 'Bronze',
    minScore: 1,
    maxScore: 35,
    color: '#CD7F32',
    badgeBg: 'rgba(205, 127, 50, 0.16)',
    badgeBorder: 'rgba(205, 127, 50, 0.45)',
    badgeText: '#E6A36E',
  },
  {
    tier: 'SILVER',
    title_ar: 'فضي',
    title_en: 'Silver',
    minScore: 36,
    maxScore: 55,
    color: '#CBD5E1',
    badgeBg: 'rgba(203, 213, 225, 0.16)',
    badgeBorder: 'rgba(203, 213, 225, 0.45)',
    badgeText: '#F1F5F9',
  },
  {
    tier: 'GOLD',
    title_ar: 'ذهبي',
    title_en: 'Gold',
    minScore: 56,
    maxScore: 72,
    color: '#F59E0B',
    badgeBg: 'rgba(245, 158, 11, 0.16)',
    badgeBorder: 'rgba(245, 158, 11, 0.45)',
    badgeText: '#FDE68A',
  },
  {
    tier: 'PLATINUM',
    title_ar: 'بلاتيني',
    title_en: 'Platinum',
    minScore: 73,
    maxScore: 84,
    color: '#38BDF8',
    badgeBg: 'rgba(56, 189, 248, 0.16)',
    badgeBorder: 'rgba(56, 189, 248, 0.45)',
    badgeText: '#BAE6FD',
  },
  {
    tier: 'DIAMOND',
    title_ar: 'ماسي',
    title_en: 'Diamond',
    minScore: 85,
    maxScore: 92,
    color: '#06B6D4',
    badgeBg: 'rgba(6, 182, 212, 0.16)',
    badgeBorder: 'rgba(6, 182, 212, 0.45)',
    badgeText: '#67E8F9',
  },
  {
    tier: 'UNREAL',
    title_ar: 'أسطوري',
    title_en: 'Unreal',
    minScore: 93,
    maxScore: 97,
    color: '#A855F7',
    badgeBg: 'rgba(168, 85, 247, 0.18)',
    badgeBorder: 'rgba(168, 85, 247, 0.45)',
    badgeText: '#D8B4FE',
  },
  {
    tier: 'TOP_50',
    title_ar: 'أفضل 50',
    title_en: 'Top 50',
    minScore: 98,
    maxScore: 100,
    color: '#E11D48',
    badgeBg: 'rgba(225, 29, 72, 0.2)',
    badgeBorder: 'rgba(225, 29, 72, 0.5)',
    badgeText: '#FDA4AF',
  },
];

export function getTierConfig(tier: MuscleRankTier | string): TierConfig {
  // Direct match
  const found = TIER_CONFIGS.find((c) => c.tier === tier);
  if (found) return found;

  // Legacy mappings for backward compatibility
  if (tier === 'D' || tier === 'C') return TIER_CONFIGS[1]; // BRONZE
  if (tier === 'C+' || tier === 'B-') return TIER_CONFIGS[2]; // SILVER
  if (tier === 'B' || tier === 'B+') return TIER_CONFIGS[3]; // GOLD
  if (tier === 'A-' || tier === 'A') return TIER_CONFIGS[4]; // PLATINUM
  if (tier === 'A+') return TIER_CONFIGS[5]; // DIAMOND
  if (tier === 'S') return TIER_CONFIGS[6]; // UNREAL

  return TIER_CONFIGS[0]; // UNRANKED
}

export function getNextTier(tier: MuscleRankTier | string): TierConfig | null {
  const currentConfig = getTierConfig(tier);
  const currentIndex = TIER_CONFIGS.findIndex((c) => c.tier === currentConfig.tier);
  if (currentIndex === -1 || currentIndex === TIER_CONFIGS.length - 1) {
    return null; // Already max rank
  }
  return TIER_CONFIGS[currentIndex + 1];
}

// Consistent Epley formula for 1RM: Weight * (1 + Reps/30)
export function calculateEstimated1RM(params: {
  weight_kg: number;
  reps: number;
  bodyweight_kg: number;
  added_weight_kg?: number;
  inputType: 'weight_reps' | 'bodyweight_reps' | 'bodyweight_plus_weight' | 'time_seconds';
}): number {
  const { weight_kg, reps, bodyweight_kg, added_weight_kg, inputType } = params;

  if (inputType === 'time_seconds') {
    // Time in seconds e.g. plank
    return weight_kg; // Represents seconds
  }

  if (inputType === 'bodyweight_reps') {
    // e.g. 25 pushups: equivalent to lifting ~65% of bodyweight for 25 reps
    const effectiveLoad = bodyweight_kg * 0.65;
    return Math.round(effectiveLoad * (1 + reps / 30));
  }

  if (inputType === 'bodyweight_plus_weight') {
    // e.g. weighted dips or pullups: (BW * 0.9 + added) * (1 + reps/30)
    const effectiveLoad = bodyweight_kg * 0.9 + (added_weight_kg || 0);
    return Math.round(effectiveLoad * (1 + reps / 30));
  }

  // Standard weight_reps
  if (reps === 1) return weight_kg;
  return Math.round(weight_kg * (1 + reps / 30));
}

// Strength standard multiplier tables relative to user bodyweight
// e.g. Bench 1RM / Bodyweight ratios for Tiers
const STRENGTH_RATIOS: Record<MuscleType, { novice: number; intermediate: number; advanced: number; elite: number }> = {
  chest: { novice: 0.7, intermediate: 1.1, advanced: 1.45, elite: 1.85 },
  back: { novice: 1.0, intermediate: 1.5, advanced: 2.0, elite: 2.5 },
  shoulders: { novice: 0.45, intermediate: 0.7, advanced: 0.95, elite: 1.2 },
  biceps: { novice: 0.25, intermediate: 0.45, advanced: 0.65, elite: 0.8 },
  triceps: { novice: 0.3, intermediate: 0.5, advanced: 0.75, elite: 0.95 },
  quads: { novice: 0.9, intermediate: 1.35, advanced: 1.8, elite: 2.25 },
  hamstrings: { novice: 0.8, intermediate: 1.25, advanced: 1.7, elite: 2.1 },
  glutes: { novice: 1.0, intermediate: 1.6, advanced: 2.2, elite: 2.8 },
  calves: { novice: 0.7, intermediate: 1.1, advanced: 1.5, elite: 1.9 },
  abs: { novice: 30, intermediate: 60, advanced: 120, elite: 180 }, // seconds or reps
  forearms: { novice: 30, intermediate: 60, advanced: 90, elite: 120 }, // hang time or grip
};

export function calculateScoreAndRank(
  muscleId: MuscleType,
  e1rm: number,
  bodyweightKg: number
): { score: number; rank: MuscleRankTier } {
  if (e1rm <= 0) {
    return { score: 0, rank: 'UNRANKED' };
  }

  const standards = STRENGTH_RATIOS[muscleId] || STRENGTH_RATIOS.chest;
  let ratio = e1rm / Math.max(45, bodyweightKg);

  if (muscleId === 'abs' || muscleId === 'forearms') {
    // These are treated directly as value (seconds/reps)
    ratio = e1rm;
  }

  let score = 0;
  if (muscleId === 'abs' || muscleId === 'forearms') {
    if (ratio < standards.novice) {
      score = Math.round((ratio / standards.novice) * 32);
    } else if (ratio < standards.intermediate) {
      score = 33 + Math.round(((ratio - standards.novice) / (standards.intermediate - standards.novice)) * 33);
    } else if (ratio < standards.advanced) {
      score = 67 + Math.round(((ratio - standards.intermediate) / (standards.advanced - standards.intermediate)) * 23);
    } else {
      score = 91 + Math.round(Math.min(9, ((ratio - standards.advanced) / (standards.elite - standards.advanced)) * 9));
    }
  } else {
    // Bodyweight ratios
    if (ratio < standards.novice) {
      score = Math.round((ratio / standards.novice) * 32);
    } else if (ratio < standards.intermediate) {
      score = 33 + Math.round(((ratio - standards.novice) / (standards.intermediate - standards.novice)) * 33);
    } else if (ratio < standards.advanced) {
      score = 67 + Math.round(((ratio - standards.intermediate) / (standards.advanced - standards.intermediate)) * 23);
    } else {
      score = 91 + Math.round(Math.min(9, ((ratio - standards.advanced) / (standards.elite - standards.advanced)) * 9));
    }
  }

  score = Math.max(1, Math.min(100, Math.round(score)));

  // Map score to tier
  for (let i = TIER_CONFIGS.length - 1; i >= 1; i--) {
    if (score >= TIER_CONFIGS[i].minScore) {
      return { score, rank: TIER_CONFIGS[i].tier };
    }
  }

  return { score, rank: 'BRONZE' };
}

export function calculateNextRankRequirements(params: {
  muscleId: MuscleType;
  currentE1RM: number;
  bodyweightKg: number;
  currentReps?: number;
}): {
  currentTier: TierConfig;
  nextTier: TierConfig | null;
  progressPct: number;
  remainingKg: number;
  required1RM: number;
} {
  const { muscleId, currentE1RM, bodyweightKg, currentReps = 8 } = params;
  const { score, rank } = calculateScoreAndRank(muscleId, currentE1RM, bodyweightKg);
  const currentTier = getTierConfig(rank);
  const nextTier = getNextTier(rank);

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      progressPct: 100,
      remainingKg: 0,
      required1RM: currentE1RM,
    };
  }

  const standards = STRENGTH_RATIOS[muscleId] || STRENGTH_RATIOS.chest;
  const targetScore = nextTier.minScore;
  let target1RM = currentE1RM;

  if (muscleId === 'abs' || muscleId === 'forearms') {
    if (targetScore <= 35) {
      target1RM = Math.round((targetScore / 35) * standards.novice);
    } else if (targetScore <= 72) {
      target1RM = Math.round(standards.novice + ((targetScore - 36) / 36) * (standards.intermediate - standards.novice));
    } else if (targetScore <= 92) {
      target1RM = Math.round(standards.intermediate + ((targetScore - 73) / 19) * (standards.advanced - standards.intermediate));
    } else {
      target1RM = Math.round(standards.advanced + ((targetScore - 93) / 7) * (standards.elite - standards.advanced));
    }
  } else {
    const bw = Math.max(45, bodyweightKg);
    let targetRatio = 1.0;
    if (targetScore <= 35) {
      targetRatio = (targetScore / 35) * standards.novice;
    } else if (targetScore <= 72) {
      targetRatio = standards.novice + ((targetScore - 36) / 36) * (standards.intermediate - standards.novice);
    } else if (targetScore <= 92) {
      targetRatio = standards.intermediate + ((targetScore - 73) / 19) * (standards.advanced - standards.intermediate);
    } else {
      targetRatio = standards.advanced + ((targetScore - 93) / 7) * (standards.elite - standards.advanced);
    }
    target1RM = Math.round(targetRatio * bw);
  }

  const remaining1RM = Math.max(1, target1RM - currentE1RM);
  const remainingWeightAtReps = Math.max(1, Math.round(remaining1RM / (1 + currentReps / 30)));

  const currentTierMin = currentTier.minScore;
  const nextTierMin = nextTier.minScore;
  const progressPct = Math.min(
    99,
    Math.max(8, Math.round(((score - currentTierMin) / Math.max(1, nextTierMin - currentTierMin)) * 100))
  );

  return {
    currentTier,
    nextTier,
    progressPct,
    remainingKg: remainingWeightAtReps,
    required1RM: target1RM,
  };
}

// Compute all 11 muscles based on actual user best_lifts
export function computeMuscleRanksFromLifts(
  userProfile: UserProfile,
  bestLifts: Record<string, BestLift>,
  sessions: WorkoutSession[]
): MuscleRank[] {
  return MUSCLE_DEFINITIONS.map((def) => {
    const lift = bestLifts[def.id];

    if (!lift) {
      return {
        muscle_id: def.id,
        muscle_name: def.name_ar,
        muscle_name_en: def.name_en,
        category: def.category,
        score: 0,
        rank: 'UNRANKED' as MuscleRankTier,
        previous_rank: 'UNRANKED' as MuscleRankTier,
        progress_percentage: 0,
        monthly_improvement_pct: 0,
        total_volume_kg: 0,
        total_sets: 0,
        is_unranked: true,
      };
    }

    const { score, rank } = calculateScoreAndRank(
      def.id,
      lift.estimated_1rm,
      userProfile.weight_kg || 75
    );

    // Compute progress % since initial best lift
    let progressPct = 0;
    if (lift.initial_estimated_1rm && lift.initial_estimated_1rm > 0) {
      progressPct = Math.round(
        ((lift.estimated_1rm - lift.initial_estimated_1rm) / lift.initial_estimated_1rm) * 100
      );
    }

    // Tier progress % towards next tier
    const req = calculateNextRankRequirements({
      muscleId: def.id,
      currentE1RM: lift.estimated_1rm,
      bodyweightKg: userProfile.weight_kg || 75,
      currentReps: lift.reps || 8,
    });

    return {
      muscle_id: def.id,
      muscle_name: def.name_ar,
      muscle_name_en: def.name_en,
      category: def.category,
      score,
      rank,
      previous_rank: lift.rank,
      progress_percentage: req.progressPct,
      monthly_improvement_pct: Math.max(0, progressPct),
      best_lift: lift,
      is_unranked: false,
      last_trained_date: lift.updated_at ? lift.updated_at.split('T')[0] : undefined,
      total_volume_kg: lift.weight_kg * lift.reps,
      total_sets: 1,
    };
  });
}
