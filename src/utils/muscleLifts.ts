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
        name_ar: 'المتوازي للصدر (Dips)',
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
        name_ar: 'تمرين الضغط (Push-ups)',
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
    description: 'اللاتس، المجنص، ومنتصف وأعلى الظهر',
    defaultLiftName: 'الرفعة الميتة (ديدليفت)',
    defaultLiftNameEn: 'Deadlift / Pull-ups',
    equipmentLifts: [
      {
        equipment: 'barbell',
        exercise_id: 'ex_deadlift',
        name_ar: 'الرفعة الميتة (ديدليفت)',
        name_en: 'Barbell Deadlift',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'pullup_bar',
        exercise_id: 'ex_pullups',
        name_ar: 'العقلة (Pull-ups)',
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
        name_ar: 'سحب منشار بالدامبل (DB Row)',
        name_en: 'Dumbbell Row',
        inputType: 'weight_reps',
        unitLabel: 'كغ للدامبل',
      },
      {
        equipment: 'machines',
        exercise_id: 'ex_lat_pulldown',
        name_ar: 'سحب علوي عريض (Lat Pulldown)',
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
    defaultLiftName: 'ضغط أكتاف عسكري بالبار (OHP)',
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
        name_ar: 'تمرين البايك بوش اب (Pike Push-ups)',
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
        name_ar: 'العقلة بقبضة معكوسة (Chin-ups)',
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
        name_ar: 'كسارة الجمجمة بالبار (Skull Crusher)',
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
        name_ar: 'ضغط الماس (Diamond Push-ups)',
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
        name_ar: 'سكوات خلفي بالبار (Back Squat)',
        name_en: 'Barbell Back Squat',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'machines',
        exercise_id: 'ex_leg_press',
        name_ar: 'دفع الأرجل بالجهاز (Leg Press)',
        name_en: 'Leg Press Machine',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'dumbbells',
        exercise_id: 'ex_goblet_squat',
        name_ar: 'سكوات غوبلت بالدامبل (Goblet Squat)',
        name_en: 'Goblet Squat',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'bodyweight',
        exercise_id: 'ex_bodyweight_squat',
        name_ar: 'سكوات وزن الجسم (أقصى تكرار)',
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
    defaultLiftName: 'ديدليفت روماني (RDL)',
    defaultLiftNameEn: 'Romanian Deadlift (RDL)',
    equipmentLifts: [
      {
        equipment: 'barbell',
        exercise_id: 'ex_romanian_deadlift',
        name_ar: 'ديدليفت روماني بالبار (RDL)',
        name_en: 'Barbell Romanian Deadlift',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'dumbbells',
        exercise_id: 'ex_db_rdl',
        name_ar: 'ديدليفت روماني بالدامبلز (DB RDL)',
        name_en: 'Dumbbell RDL',
        inputType: 'weight_reps',
        unitLabel: 'كغ للدامبل الواحد',
      },
      {
        equipment: 'machines',
        exercise_id: 'ex_leg_curl',
        name_ar: 'مرجحة فخذ خلفي بالجهاز (Leg Curl)',
        name_en: 'Lying Leg Curl',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'bodyweight',
        exercise_id: 'ex_nordic_curl',
        name_ar: 'نورديك كيرل / جسر الفخذ الخلفي',
        name_en: 'Hamstring Glute Bridge',
        inputType: 'bodyweight_reps',
        unitLabel: 'تكرارات',
      },
    ],
  },
  {
    id: 'glutes',
    name_ar: 'المؤخرة والأرداف',
    name_en: 'Glutes',
    category: 'lower',
    description: 'عضلات الألوية الكبرى والوسطى للثبات والقوة',
    defaultLiftName: 'دفع الحوض بالبار (Hip Thrust)',
    defaultLiftNameEn: 'Hip Thrust / Squat',
    equipmentLifts: [
      {
        equipment: 'barbell',
        exercise_id: 'ex_hip_thrust',
        name_ar: 'دفع الحوض بالبار (Barbell Hip Thrust)',
        name_en: 'Barbell Hip Thrust',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'dumbbells',
        exercise_id: 'ex_db_hip_thrust',
        name_ar: 'دفع الحوض بالدامبل أو البولغاريان',
        name_en: 'Bulgarian Split Squat / DB Thrust',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'bodyweight',
        exercise_id: 'ex_single_leg_bridge',
        name_ar: 'جسر الحوض الفردي (Single Leg Bridge)',
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
    description: 'عضلات الساق الخلفية (الجاستروكنيميوس والسوليوس)',
    defaultLiftName: 'رفع السمانة واقفاً (Calf Raise)',
    defaultLiftNameEn: 'Standing Calf Raise',
    equipmentLifts: [
      {
        equipment: 'machines',
        exercise_id: 'ex_standing_calf',
        name_ar: 'رفع السمانة واقفاً بالجهاز أو سميث',
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
    name_ar: 'البطن والكور',
    name_en: 'Abs & Core',
    category: 'core',
    description: 'عضلات البطن المستقيمة والمائلة والحزام القطني',
    defaultLiftName: 'رفع الأرجل معلقاً أو البلانك',
    defaultLiftNameEn: 'Hanging Leg Raise / Plank',
    equipmentLifts: [
      {
        equipment: 'pullup_bar',
        exercise_id: 'ex_hanging_leg_raise',
        name_ar: 'رفع الأرجل معلقاً بالعقلة (Hanging Leg Raise)',
        name_en: 'Hanging Leg Raise',
        inputType: 'bodyweight_reps',
        unitLabel: 'تكرار نظيف',
      },
      {
        equipment: 'cable',
        exercise_id: 'ex_cable_crunch',
        name_ar: 'طحن البطن راكعاً بالكيبل (Cable Crunch)',
        name_en: 'Cable Crunch',
        inputType: 'weight_reps',
        unitLabel: 'كغ',
      },
      {
        equipment: 'bodyweight',
        exercise_id: 'ex_plank',
        name_ar: 'تمرين الثبات (بلانك بالثواني)',
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
    defaultLiftName: 'التعلق الحر بالعقلة (Dead Hang)',
    defaultLiftNameEn: 'Dead Hang / Wrist Curls',
    equipmentLifts: [
      {
        equipment: 'pullup_bar',
        exercise_id: 'ex_dead_hang',
        name_ar: 'التعلق الحر بالعقلة (Dead Hang)',
        name_en: 'Dead Hang (Grip)',
        inputType: 'time_seconds',
        unitLabel: 'ثواني ثبات',
      },
      {
        equipment: 'dumbbells',
        exercise_id: 'ex_farmers_walk',
        name_ar: 'مشية المزارع بالدامبلز (Farmer’s Walk)',
        name_en: 'Farmer’s Walk',
        inputType: 'weight_reps',
        unitLabel: 'كغ لكل يد',
      },
      {
        equipment: 'barbell',
        exercise_id: 'ex_wrist_curl',
        name_ar: 'ثني المعصم بالبار (Wrist Curls)',
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
    minScore: 0,
    maxScore: 0,
    color: '#94a3b8',
    badgeBg: '#131C1A',
    badgeBorder: '#1F3A34',
    badgeText: '#94a3b8',
  },
  {
    tier: 'D',
    title_ar: 'مبتدئ (Novice)',
    minScore: 1,
    maxScore: 32,
    color: '#4b7566',
    badgeBg: 'rgba(36, 75, 63, 0.4)',
    badgeBorder: '#244B3F',
    badgeText: '#86efac',
  },
  {
    tier: 'C',
    title_ar: 'متدرب (Trained)',
    minScore: 33,
    maxScore: 47,
    color: '#348366',
    badgeBg: 'rgba(46, 101, 81, 0.4)',
    badgeBorder: '#2E6551',
    badgeText: '#86efac',
  },
  {
    tier: 'C+',
    title_ar: 'صاعد (Rising)',
    minScore: 48,
    maxScore: 56,
    color: '#46886D',
    badgeBg: 'rgba(56, 120, 94, 0.4)',
    badgeBorder: '#3D785F',
    badgeText: '#A3E6C5',
  },
  {
    tier: 'B-',
    title_ar: 'متمكن (Skilled)',
    minScore: 57,
    maxScore: 66,
    color: '#539C7C',
    badgeBg: 'rgba(70, 136, 109, 0.45)',
    badgeBorder: '#46886D',
    badgeText: '#C8E6CF',
  },
  {
    tier: 'B',
    title_ar: 'متقدم (Intermediate)',
    minScore: 67,
    maxScore: 76,
    color: '#6BAF8F',
    badgeBg: 'rgba(107, 175, 143, 0.25)',
    badgeBorder: '#6BAF8F',
    badgeText: '#C8E6CF',
  },
  {
    tier: 'B+',
    title_ar: 'محترف (Proficient)',
    minScore: 77,
    maxScore: 84,
    color: '#7EC4A3',
    badgeBg: 'rgba(107, 175, 143, 0.35)',
    badgeBorder: '#7EC4A3',
    badgeText: '#F4F5F3',
  },
  {
    tier: 'A-',
    title_ar: 'بطل (Advanced)',
    minScore: 85,
    maxScore: 90,
    color: '#93D9B7',
    badgeBg: 'rgba(147, 217, 183, 0.3)',
    badgeBorder: '#93D9B7',
    badgeText: '#F4F5F3',
  },
  {
    tier: 'A',
    title_ar: 'أسطوري (Elite)',
    minScore: 91,
    maxScore: 95,
    color: '#A7F3D0',
    badgeBg: 'rgba(167, 243, 208, 0.3)',
    badgeBorder: '#A7F3D0',
    badgeText: '#070B0A',
  },
  {
    tier: 'A+',
    title_ar: 'خارق (Master)',
    minScore: 96,
    maxScore: 98,
    color: '#C8E6CF',
    badgeBg: '#C8E6CF',
    badgeBorder: '#C8E6CF',
    badgeText: '#070B0A',
  },
  {
    tier: 'S',
    title_ar: 'عزم لا يلين (Legendary)',
    minScore: 99,
    maxScore: 100,
    color: '#F4F5F3',
    badgeBg: 'linear-gradient(135deg, #6BAF8F, #C8E6CF)',
    badgeBorder: '#C8E6CF',
    badgeText: '#070B0A',
  },
];

export function getTierConfig(tier: MuscleRankTier): TierConfig {
  return TIER_CONFIGS.find((c) => c.tier === tier) || TIER_CONFIGS[0];
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

  return { score, rank: 'D' };
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

    // Tier progress %
    const tierConfig = getTierConfig(rank);
    let progressToNext = 100;
    if (tierConfig.tier !== 'S' && tierConfig.tier !== 'UNRANKED') {
      const range = tierConfig.maxScore - tierConfig.minScore + 1;
      progressToNext = Math.min(100, Math.round(((score - tierConfig.minScore) / range) * 100));
    }

    return {
      muscle_id: def.id,
      muscle_name: def.name_ar,
      muscle_name_en: def.name_en,
      category: def.category,
      score,
      rank,
      previous_rank: lift.rank,
      progress_percentage: progressToNext,
      monthly_improvement_pct: Math.max(0, progressPct),
      best_lift: lift,
      is_unranked: false,
      last_trained_date: lift.updated_at ? lift.updated_at.split('T')[0] : undefined,
      total_volume_kg: lift.weight_kg * lift.reps,
      total_sets: 1,
    };
  });
}
