import { GymAccessType } from '../types';

export interface PresetExercise {
  name: string;
  name_en: string;
  sets: number;
  reps: string;
  target_muscle?: string;
  weight_kg?: number;
  notes?: string;
}

export interface PresetDay {
  day_name: string;
  day_name_en?: string;
  focus: string;
  focus_en?: string;
  default_weekday: number; // 6: Sat, 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri
  exercises: PresetExercise[];
}

export interface TrainingPreset {
  id: string;
  name: string;
  name_en: string;
  days_per_week: number;
  equipment: GymAccessType;
  equipment_label_ar: string;
  equipment_label_en: string;
  main_focus: string;
  main_focus_en?: string;
  description: string;
  description_en: string;
  badge: string;
  badge_en: string;
  recommended_for?: string;
  days: PresetDay[];
}

export const TRAINING_PRESETS: TrainingPreset[] = [
  {
    id: 'preset_ppl_6',
    name: 'جدول الدفع والسحب والأرجل',
    name_en: 'Push / Pull / Legs (6 Days)',
    days_per_week: 6,
    equipment: 'gym',
    equipment_label_ar: 'صالة رياضية كاملة',
    equipment_label_en: 'Full Gym',
    main_focus: 'بناء وتضخيم عضلي مكثف',
    main_focus_en: 'Hypertrophy & Muscle Growth',
    description: 'التقسيم الأكثر كفاءة لتمرين كل عضلة مرتين أسبوعياً مع استشفاء متوازن.',
    description_en: 'Optimal split training each muscle group twice weekly with balanced recovery.',
    badge: 'الأكثر شعبية',
    badge_en: 'Most Popular',
    recommended_for: 'المستوى المتوسط والمتقدم الراغبين في أقصى استجابة عضلية',
    days: [
      {
        day_name: 'يوم الدفع الأول',
        day_name_en: 'Push Day A',
        focus: 'الصدر • الأكتاف • الترايسبس',
        focus_en: 'Chest • Shoulders • Triceps',
        default_weekday: 6, // السبت
        exercises: [
          { name: 'بنش برس مستوي بالبار', name_en: 'Barbell Bench Press', sets: 4, reps: '6-8', target_muscle: 'الصدر' },
          { name: 'ضغط أكتاف بالدامبلز جالساً', name_en: 'Seated Dumbbell Shoulder Press', sets: 3, reps: '8-10', target_muscle: 'الأكتاف' },
          { name: 'تجميع صدر مائل بالدامبلز', name_en: 'Incline Dumbbell Flyes', sets: 3, reps: '10-12', target_muscle: 'الصدر' },
          { name: 'رفرفة أكتاف جانبي بالدامبلز', name_en: 'Lateral Raises', sets: 4, reps: '12-15', target_muscle: 'الأكتاف' },
          { name: 'سحب ترايسبس بالحبل بالكيبل', name_en: 'Cable Rope Pushdown', sets: 3, reps: '10-12', target_muscle: 'الترايسبس' },
        ],
      },
      {
        day_name: 'يوم السحب الأول',
        day_name_en: 'Pull Day A',
        focus: 'الظهر • البايسبس • الأكتاف الخلفية',
        focus_en: 'Back • Biceps • Rear Delts',
        default_weekday: 0, // الأحد
        exercises: [
          { name: 'الرفعة الميتة بالبار', name_en: 'Barbell Deadlift', sets: 3, reps: '5-6', target_muscle: 'الظهر' },
          { name: 'سحب علوي بالكيبل عريض', name_en: 'Lat Pulldown', sets: 4, reps: '8-10', target_muscle: 'الظهر' },
          { name: 'سحب أرضي ضيق للظهر', name_en: 'Seated Cable Row', sets: 3, reps: '10-12', target_muscle: 'الظهر' },
          { name: 'سحب كابل للأكتاف الخلفية', name_en: 'Face Pulls', sets: 3, reps: '12-15', target_muscle: 'الأكتاف' },
          { name: 'تبادل بايسبس بالدامبلز', name_en: 'Dumbbell Bicep Curls', sets: 3, reps: '10-12', target_muscle: 'البايسبس' },
        ],
      },
      {
        day_name: 'يوم الأرجل الأول',
        day_name_en: 'Legs Day A',
        focus: 'الأفخاذ • السمانة • الجذع',
        focus_en: 'Quads • Calves • Core',
        default_weekday: 1, // الاثنين
        exercises: [
          { name: 'سكوات حر بالبار', name_en: 'Barbell Back Squat', sets: 4, reps: '6-8', target_muscle: 'الأرجل' },
          { name: 'جهاز دفع الأرجل', name_en: 'Leg Press', sets: 3, reps: '10-12', target_muscle: 'الأرجل' },
          { name: 'ثني أرجل خلفي بالجهاز', name_en: 'Lying Hamstring Curls', sets: 3, reps: '10-12', target_muscle: 'الأرجل' },
          { name: 'رفع سمانة واقفاً بالجهاز', name_en: 'Standing Calf Raise', sets: 4, reps: '12-15', target_muscle: 'السمانة' },
          { name: 'تمرين الثبات بلانك', name_en: 'Plank Hold', sets: 3, reps: '45-60 ثانية', target_muscle: 'البطن' },
        ],
      },
      {
        day_name: 'يوم الدفع الثاني',
        day_name_en: 'Push Day B',
        focus: 'تركيز الصدر العلوي • الأكتاف • الترايسبس',
        focus_en: 'Incline Chest • Shoulders • Triceps',
        default_weekday: 2, // الثلاثاء
        exercises: [
          { name: 'ضغط صدر مائل بالبار', name_en: 'Incline Barbell Bench Press', sets: 4, reps: '8-10', target_muscle: 'الصدر' },
          { name: 'تمرين المتوازي للصدر', name_en: 'Chest Dips', sets: 3, reps: '8-10', target_muscle: 'الصدر' },
          { name: 'ضغط أكتاف عسكري بالبار', name_en: 'Overhead Press', sets: 3, reps: '8-10', target_muscle: 'الأكتاف' },
          { name: 'رفرفة جانبي بالكيبل', name_en: 'Cable Lateral Raise', sets: 3, reps: '12-15', target_muscle: 'الأكتاف' },
          { name: 'مد ترايسبس بالبار الزجزاج', name_en: 'Skull Crushers', sets: 3, reps: '10-12', target_muscle: 'الترايسبس' },
        ],
      },
      {
        day_name: 'يوم السحب الثاني',
        day_name_en: 'Pull Day B',
        focus: 'سماكة الظهر • العقلة • البايسبس',
        focus_en: 'Back Thickness • Pull-ups • Biceps',
        default_weekday: 3, // الأربعاء
        exercises: [
          { name: 'تمرين العقلة بالوزن أو حر', name_en: 'Pull-ups', sets: 4, reps: '6-8', target_muscle: 'الظهر' },
          { name: 'سحب بالبار منحنياً', name_en: 'Bent-Over Row', sets: 4, reps: '8-10', target_muscle: 'الظهر' },
          { name: 'سحب منشار فردي بالدامبل', name_en: 'Single-arm Dumbbell Row', sets: 3, reps: '10-12', target_muscle: 'الظهر' },
          { name: 'تبادل المطرقة بالدامبلز', name_en: 'Hammer Curls', sets: 3, reps: '10-12', target_muscle: 'البايسبس' },
          { name: 'مرجحة بايسبس بالبار الزجزاج', name_en: 'EZ-Bar Preacher Curl', sets: 3, reps: '10-12', target_muscle: 'البايسبس' },
        ],
      },
      {
        day_name: 'يوم الأرجل الثاني',
        day_name_en: 'Legs Day B',
        focus: 'الأرجل الخلفية • عضلات الحوض • السمانة',
        focus_en: 'Hamstrings • Glutes • Calves',
        default_weekday: 4, // الخميس
        exercises: [
          { name: 'الرفعة الرومانية بالبار', name_en: 'Romanian Deadlift', sets: 4, reps: '8-10', target_muscle: 'الأرجل' },
          { name: 'دفع الحوض بالبار', name_en: 'Barbell Hip Thrust', sets: 3, reps: '10-12', target_muscle: 'الأرجل' },
          { name: 'جهاز مد الأرجل الأمامي', name_en: 'Leg Extension', sets: 3, reps: '12-15', target_muscle: 'الأرجل' },
          { name: 'خطوات الطعن بالدامبلز', name_en: 'Dumbbell Walking Lunges', sets: 3, reps: '10 خطوات لكل ساق', target_muscle: 'الأرجل' },
          { name: 'رفع سمانة جالساً', name_en: 'Seated Calf Raise', sets: 4, reps: '15-20', target_muscle: 'السمانة' },
        ],
      },
    ],
  },
  {
    id: 'preset_upper_lower_4',
    name: 'جدول الجزء العلوي والسفلي',
    name_en: 'Upper / Lower (4 Days)',
    days_per_week: 4,
    equipment: 'gym',
    equipment_label_ar: 'صالة رياضية كاملة',
    equipment_label_en: 'Full Gym',
    main_focus: 'توازن مثالي بين القوة والاستشفاء العضلي',
    main_focus_en: 'Optimal Strength & Recovery Balance',
    description: 'تقسيم كلاسيكي ممتاز لمن لديهم 4 أيام تدريب، يضمن استشفاء كامل وتطور مستمر بالأوزان.',
    description_en: 'Classic 4-day split ensuring complete recovery and consistent progressive overload.',
    badge: 'توازن ذهبي',
    badge_en: 'Golden Balance',
    recommended_for: 'الموظفين والطلاب والراغبين في نتائج احترافية بأربعة أيام أسبوعياً',
    days: [
      {
        day_name: 'الجزء العلوي - تركيز القوة',
        day_name_en: 'Upper Body A (Strength)',
        focus: 'صدر • ظهر • أكتاف • ذراعين',
        focus_en: 'Chest • Back • Shoulders • Arms',
        default_weekday: 6, // السبت
        exercises: [
          { name: 'بنش برس مستوي بالبار', name_en: 'Barbell Bench Press', sets: 4, reps: '5-6', target_muscle: 'الصدر' },
          { name: 'سحب ظهر بالبار منحنياً', name_en: 'Barbell Row', sets: 4, reps: '6-8', target_muscle: 'الظهر' },
          { name: 'ضغط أكتاف عسكري بالبار', name_en: 'Overhead Press', sets: 3, reps: '6-8', target_muscle: 'الأكتاف' },
          { name: 'سحب علوي ضيق للظهر', name_en: 'Close-grip Lat Pulldown', sets: 3, reps: '8-10', target_muscle: 'الظهر' },
          { name: 'جلسة مزدوجة بايسبس وترايسبس', name_en: 'Biceps & Triceps Superset', sets: 3, reps: '10-12', target_muscle: 'الذراعين' },
        ],
      },
      {
        day_name: 'الجزء السفلي - تركيز القوة',
        day_name_en: 'Lower Body A (Strength)',
        focus: 'أرجل أمامية وخلفية • سمانة • بطن',
        focus_en: 'Quads • Hamstrings • Calves • Abs',
        default_weekday: 0, // الأحد
        exercises: [
          { name: 'سكوات حر بالبار', name_en: 'Barbell Back Squat', sets: 4, reps: '5-6', target_muscle: 'الأرجل' },
          { name: 'الرفعة الرومانية بالبار', name_en: 'Romanian Deadlift', sets: 3, reps: '8-10', target_muscle: 'الأرجل' },
          { name: 'جهاز دفع الأرجل', name_en: 'Leg Press', sets: 3, reps: '10-12', target_muscle: 'الأرجل' },
          { name: 'رفع سمانة واقفاً', name_en: 'Standing Calf Raise', sets: 4, reps: '12-15', target_muscle: 'السمانة' },
          { name: 'رفع الأرجل معلقاً بالعقلة', name_en: 'Hanging Leg Raise', sets: 3, reps: '12-15', target_muscle: 'البطن' },
        ],
      },
      {
        day_name: 'الجزء العلوي - تضخيم وحجم',
        day_name_en: 'Upper Body B (Hypertrophy)',
        focus: 'صدر مائل • عقلة • رفرفة • ذراعين',
        focus_en: 'Incline Chest • Pull-ups • Delts • Arms',
        default_weekday: 2, // الثلاثاء
        exercises: [
          { name: 'ضغط صدر مائل بالدامبلز', name_en: 'Incline Dumbbell Press', sets: 4, reps: '8-10', target_muscle: 'الصدر' },
          { name: 'تمرين العقلة بوزن الجسم', name_en: 'Pull-ups', sets: 3, reps: '8-10', target_muscle: 'الظهر' },
          { name: 'رفرفة أكتاف جانبي بالدامبلز', name_en: 'Dumbbell Lateral Raises', sets: 4, reps: '12-15', target_muscle: 'الأكتاف' },
          { name: 'سحب منشار بالدامبل', name_en: 'Single-arm DB Row', sets: 3, reps: '10-12', target_muscle: 'الظهر' },
          { name: 'مد ترايسبس خلف الرأس بالكيبل', name_en: 'Cable Overhead Triceps Extension', sets: 3, reps: '12-15', target_muscle: 'الترايسبس' },
          { name: 'مرجحة بايسبس مائلة بالدامبلز', name_en: 'Incline DB Bicep Curl', sets: 3, reps: '10-12', target_muscle: 'البايسبس' },
        ],
      },
      {
        day_name: 'الجزء السفلي - تضخيم وحجم',
        day_name_en: 'Lower Body B (Hypertrophy)',
        focus: 'ديدليفت • طعنات • أجهزة العزل',
        focus_en: 'Deadlift • Lunges • Leg Isolation',
        default_weekday: 3, // الأربعاء
        exercises: [
          { name: 'الرفعة الميتة التقليدية بالبار', name_en: 'Barbell Deadlift', sets: 3, reps: '5-6', target_muscle: 'الظهر والأرجل' },
          { name: 'خطوات الطعن بالدامبلز', name_en: 'Walking Lunges', sets: 3, reps: '12 خطوة', target_muscle: 'الأرجل' },
          { name: 'مد أرجل أمامي بالجهاز', name_en: 'Leg Extension Machine', sets: 3, reps: '12-15', target_muscle: 'الأرجل' },
          { name: 'ثني أرجل خلفي بالجهاز', name_en: 'Leg Curl Machine', sets: 3, reps: '12-15', target_muscle: 'الأرجل' },
          { name: 'تمرين الثبات بلانك', name_en: 'Plank Hold', sets: 3, reps: '60 ثانية', target_muscle: 'البطن' },
        ],
      },
    ],
  },
  {
    id: 'preset_full_body_3',
    name: 'جدول الجسم الكامل',
    name_en: '3-Day Full Body Split',
    days_per_week: 3,
    equipment: 'both',
    equipment_label_ar: 'صالة رياضية أو أدوات منزلية',
    equipment_label_en: 'Gym or Home Weights',
    main_focus: 'أعلى تردد عضلي بأقل عدد أيام في الأسبوع',
    main_focus_en: 'High Frequency with Time Efficiency',
    description: 'مثالي لبناء أساس قوي في التمارين المركبة مع تحفيز كامل عضلات الجسم 3 مرات أسبوعياً.',
    description_en: 'Ideal for building foundational compound strength with full recovery between sessions.',
    badge: 'كفاءة الوقت',
    badge_en: 'Time Efficient',
    recommended_for: 'المبتدئين والمنشغلين ومن يريدون بناء كتلة صلبة بثلاثة أيام فقط',
    days: [
      {
        day_name: 'جلسة الجسم الكامل الأولى',
        day_name_en: 'Full Body Session A',
        focus: 'سكوات • ضغط صدر • سحب ظهر',
        focus_en: 'Squat • Bench • Row',
        default_weekday: 6, // السبت
        exercises: [
          { name: 'سكوات بالبار أو الدامبلز', name_en: 'Squats', sets: 4, reps: '6-8', target_muscle: 'الأرجل' },
          { name: 'بنش برس مستوي بالبار', name_en: 'Bench Press', sets: 4, reps: '6-8', target_muscle: 'الصدر' },
          { name: 'سحب ظهر بالبار منحنياً', name_en: 'Barbell Rows', sets: 4, reps: '8-10', target_muscle: 'الظهر' },
          { name: 'ضغط أكتاف بالدامبلز', name_en: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', target_muscle: 'الأكتاف' },
          { name: 'تمرين بلانك ثبات للبطن', name_en: 'Plank Hold', sets: 3, reps: '45 ثانية', target_muscle: 'البطن' },
        ],
      },
      {
        day_name: 'جلسة الجسم الكامل الثانية',
        day_name_en: 'Full Body Session B',
        focus: 'ديدليفت • ضغط أكتاف • ضغط مائل',
        focus_en: 'Deadlift • Overhead Press • Incline DB',
        default_weekday: 1, // الاثنين
        exercises: [
          { name: 'الرفعة الميتة بالبار', name_en: 'Deadlift', sets: 3, reps: '5-6', target_muscle: 'الظهر والأرجل' },
          { name: 'ضغط أكتاف عسكري بالبار', name_en: 'Overhead Press', sets: 4, reps: '6-8', target_muscle: 'الأكتاف' },
          { name: 'ضغط صدر مائل بالدامبلز', name_en: 'Incline DB Press', sets: 3, reps: '8-10', target_muscle: 'الصدر' },
          { name: 'سحب علوي للظهر بالكيبل', name_en: 'Lat Pulldown', sets: 3, reps: '10-12', target_muscle: 'الظهر' },
          { name: 'ثني أرجل خلفي بالجهاز', name_en: 'Hamstring Curl', sets: 3, reps: '10-12', target_muscle: 'الأرجل' },
        ],
      },
      {
        day_name: 'جلسة الجسم الكامل الثالثة',
        day_name_en: 'Full Body Session C',
        focus: 'سكوات أمامي • متوازي • عقلة • ذراعين',
        focus_en: 'Front Squat • Dips • Pull-ups • Arms',
        default_weekday: 3, // الأربعاء
        exercises: [
          { name: 'سكوات أمامي بالبار أو جهاز الدفع', name_en: 'Front Squat / Leg Press', sets: 3, reps: '8-10', target_muscle: 'الأرجل' },
          { name: 'تمرين المتوازي أو ضغط الدامبلز', name_en: 'Dips / DB Bench Press', sets: 3, reps: '8-10', target_muscle: 'الصدر' },
          { name: 'سحب منشار فردي بالدامبل', name_en: 'Dumbbell Row', sets: 3, reps: '10-12', target_muscle: 'الظهر' },
          { name: 'رفرفة أكتاف جانبي', name_en: 'Lateral Raises', sets: 4, reps: '12-15', target_muscle: 'الأكتاف' },
          { name: 'جلسة ذراعين مزدوجة', name_en: 'Arms Superset', sets: 3, reps: '10-12', target_muscle: 'الذراعين' },
        ],
      },
    ],
  },
  {
    id: 'preset_bro_split_5',
    name: 'جدول العضلة الواحدة يومياً',
    name_en: '5-Day Muscle Split',
    days_per_week: 5,
    equipment: 'gym',
    equipment_label_ar: 'صالة رياضية كاملة',
    equipment_label_en: 'Full Gym',
    main_focus: 'تركيز فائق وعزل كامل لكل عضلة',
    main_focus_en: 'High Volume & Muscle Isolation',
    description: 'الجدول الكلاسيكي: يوم مخصص للصدر، ويوم للظهر، ويوم للأكتاف، ويوم للذراعين، ويوم للأرجل.',
    description_en: 'Classic bodybuilding routine dedicating a full session to each major muscle group.',
    badge: 'كمال أجسام كلاسيكي',
    badge_en: 'Classic Bodybuilding',
    recommended_for: 'محبي ضخ الدم العالي والتركيز العميق في عضلة واحدة بكل جلسة',
    days: [
      {
        day_name: 'يوم الصدر',
        day_name_en: 'Chest Day',
        focus: 'عضلات الصدر بكافة زواياه',
        focus_en: 'Chest All Angles',
        default_weekday: 6, // السبت
        exercises: [
          { name: 'بنش برس مستوي بالبار', name_en: 'Barbell Bench Press', sets: 4, reps: '8-10', target_muscle: 'الصدر' },
          { name: 'ضغط صدر مائل بالدامبلز', name_en: 'Incline DB Press', sets: 4, reps: '8-10', target_muscle: 'الصدر' },
          { name: 'تجميع صدر بالكيبل متقاطع', name_en: 'Cable Crossover', sets: 3, reps: '12-15', target_muscle: 'الصدر' },
          { name: 'تمرين المتوازي للصدر', name_en: 'Chest Dips', sets: 3, reps: 'أقصى تكرار', target_muscle: 'الصدر' },
        ],
      },
      {
        day_name: 'يوم الظهر',
        day_name_en: 'Back Day',
        focus: 'عضلات الظهر العريض والعميق والقطنية',
        focus_en: 'Lats • Upper Back • Lower Back',
        default_weekday: 0, // الأحد
        exercises: [
          { name: 'الرفعة الميتة بالبار', name_en: 'Deadlift', sets: 3, reps: '5-6', target_muscle: 'الظهر' },
          { name: 'العقلة بوزن الجسم', name_en: 'Pull-ups', sets: 4, reps: '8-10', target_muscle: 'الظهر' },
          { name: 'سحب بالبار منحنياً', name_en: 'Barbell Row', sets: 4, reps: '8-10', target_muscle: 'الظهر' },
          { name: 'سحب أرضي ضيق بالكابل', name_en: 'Seated Cable Row', sets: 3, reps: '10-12', target_muscle: 'الظهر' },
        ],
      },
      {
        day_name: 'يوم الأكتاف',
        day_name_en: 'Shoulders Day',
        focus: 'الدالية الأمامية والجانبية والخلفية والترابيس',
        focus_en: 'Anterior, Lateral & Rear Delts',
        default_weekday: 1, // الاثنين
        exercises: [
          { name: 'ضغط أكتاف عسكري بالبار', name_en: 'Overhead Press', sets: 4, reps: '8-10', target_muscle: 'الأكتاف' },
          { name: 'رفرفة جانبي بالدامبلز واقفاً', name_en: 'Dumbbell Lateral Raise', sets: 4, reps: '12-15', target_muscle: 'الأكتاف' },
          { name: 'سحب كابل للأكتاف الخلفية', name_en: 'Cable Face Pull', sets: 4, reps: '12-15', target_muscle: 'الأكتاف' },
          { name: 'هز الأكتاف بالبار للترابيس', name_en: 'Barbell Shrugs', sets: 4, reps: '10-12', target_muscle: 'الأكتاف' },
        ],
      },
      {
        day_name: 'يوم الذراعين',
        day_name_en: 'Arms Day',
        focus: 'البايسبس والترايسبس والسواعد',
        focus_en: 'Biceps • Triceps • Forearms',
        default_weekday: 2, // الثلاثاء
        exercises: [
          { name: 'مرجحة بالبار الزجزاج للبايسبس', name_en: 'EZ-Bar Bicep Curl', sets: 4, reps: '10-12', target_muscle: 'البايسبس' },
          { name: 'مد ترايسبس بالبار الزجزاج', name_en: 'Skull Crushers', sets: 4, reps: '10-12', target_muscle: 'الترايسبس' },
          { name: 'مرجحة المطرقة بالدامبلز', name_en: 'Hammer Curls', sets: 3, reps: '10-12', target_muscle: 'البايسبس' },
          { name: 'سحب ترايسبس بالحبل بالكيبل', name_en: 'Rope Pushdown', sets: 3, reps: '12-15', target_muscle: 'الترايسبس' },
        ],
      },
      {
        day_name: 'يوم الأرجل',
        day_name_en: 'Legs Day',
        focus: 'الأفخاذ الأمامية والخلفية والسمانة',
        focus_en: 'Quads • Hamstrings • Calves',
        default_weekday: 3, // الأربعاء
        exercises: [
          { name: 'سكوات بالبار', name_en: 'Barbell Squat', sets: 4, reps: '8-10', target_muscle: 'الأرجل' },
          { name: 'جهاز دفع الأرجل', name_en: 'Leg Press', sets: 4, reps: '10-12', target_muscle: 'الأرجل' },
          { name: 'ثني أرجل خلفي بالجهاز', name_en: 'Lying Leg Curl', sets: 4, reps: '10-12', target_muscle: 'الأرجل' },
          { name: 'رفع سمانة واقفاً وجالساً', name_en: 'Calf Raises', sets: 5, reps: '15-20', target_muscle: 'السمانة' },
        ],
      },
    ],
  },
  {
    id: 'preset_home_bodyweight_4',
    name: 'جدول وزن الجسم والتمارين الحرة',
    name_en: 'Bodyweight & Calisthenics (4 Days)',
    days_per_week: 4,
    equipment: 'home',
    equipment_label_ar: 'تمارين منزلية بدون أجهزة',
    equipment_label_en: 'Bodyweight & Home Setup',
    main_focus: 'قوة نسبية فائقة ولياقة بدنية عالية',
    main_focus_en: 'Relative Strength & Calisthenics Mastery',
    description: 'تمارين بوزن الجسم وعقلة لبناء بنية رياضية صلبة بدون الحاجة لمعدات ثقيلة.',
    description_en: 'Bodyweight fundamentals to build a functional, resilient athletic body anywhere.',
    badge: 'بدون أجهزة',
    badge_en: 'No Equipment',
    recommended_for: 'المتدربين في المنزل ومحبي الجمباز والتمارين الحرة',
    days: [
      {
        day_name: 'اليوم الأول: دفع وسحب علوي',
        day_name_en: 'Day 1: Upper Push & Pull',
        focus: 'عقلة • ضغط • متوازي',
        focus_en: 'Pull-ups • Push-ups • Dips',
        default_weekday: 6, // السبت
        exercises: [
          { name: 'العقلة بقبضة واسعة', name_en: 'Wide Pull-ups', sets: 4, reps: '6-10', target_muscle: 'الظهر' },
          { name: 'تمرين الضغط الكلاسيكي', name_en: 'Standard Push-ups', sets: 4, reps: '15-20', target_muscle: 'الصدر' },
          { name: 'عقلة بقبضة معكوسة', name_en: 'Chin-ups', sets: 3, reps: '6-8', target_muscle: 'البايسبس والظهر' },
          { name: 'المتوازي بين كرسيين أو متوازي أرضي', name_en: 'Dips', sets: 3, reps: '10-12', target_muscle: 'الصدر والترايسبس' },
          { name: 'تمرين بلانك ثبات مستمر', name_en: 'Plank Hold', sets: 3, reps: '60 ثانية', target_muscle: 'البطن' },
        ],
      },
      {
        day_name: 'اليوم الثاني: أرجل وجذع منزلي',
        day_name_en: 'Day 2: Legs & Core',
        focus: 'سكوات فردي • قفز • بطن',
        focus_en: 'Split Squats • Jumps • Core',
        default_weekday: 0, // الأحد
        exercises: [
          { name: 'سكوات بلغاري فردي على مقعد', name_en: 'Bulgarian Split Squat', sets: 4, reps: '10-12 لكل ساق', target_muscle: 'الأرجل' },
          { name: 'سكوات حر بوزن الجسم', name_en: 'Bodyweight Air Squats', sets: 4, reps: '20-25', target_muscle: 'الأرجل' },
          { name: 'جسر الحوض الأرضي', name_en: 'Glute Bridges', sets: 3, reps: '15-20', target_muscle: 'الأرجل' },
          { name: 'رفع السمانة الفردي على عتبة', name_en: 'Single Leg Calf Raise', sets: 4, reps: '15-20', target_muscle: 'السمانة' },
          { name: 'رفع الأرجل معلقاً بالعقلة', name_en: 'Hanging Leg Raises', sets: 3, reps: '10-12', target_muscle: 'البطن' },
        ],
      },
      {
        day_name: 'اليوم الثالث: أكتاف وذراعين بوزن الجسم',
        day_name_en: 'Day 3: Shoulders & Arms',
        focus: 'ضغط بايك • ضغط ماسي • عقلة أفقية',
        focus_en: 'Pike Push-ups • Diamond • Inverted Rows',
        default_weekday: 2, // الثلاثاء
        exercises: [
          { name: 'ضغط البايك المرتفع للأكتاف', name_en: 'Pike Push-ups', sets: 4, reps: '8-10', target_muscle: 'الأكتاف' },
          { name: 'الضغط الماسي للترايسبس', name_en: 'Diamond Push-ups', sets: 3, reps: '10-12', target_muscle: 'الترايسبس' },
          { name: 'سحب أفقي تحت طاولة متينة', name_en: 'Inverted Bodyweight Rows', sets: 4, reps: '10-12', target_muscle: 'الظهر' },
          { name: 'التعلق الحر بالعقلة للقبضة', name_en: 'Dead Hang', sets: 3, reps: '45-60 ثانية', target_muscle: 'السواعد' },
        ],
      },
      {
        day_name: 'اليوم الرابع: لياقة وتحمل بدني',
        day_name_en: 'Day 4: Athletic Conditioning',
        focus: 'تمارين قفز • ضغط ضيق • دراجة بطن',
        focus_en: 'Burpees • Lunges • Ab Bicycle',
        default_weekday: 4, // الخميس
        exercises: [
          { name: 'تمرين بيربي كامل مع قفزة', name_en: 'Full Burpees', sets: 4, reps: '10-12', target_muscle: 'كامل الجسم' },
          { name: 'خطوات الطعن التبادلية بالقفز', name_en: 'Jumping Lunges', sets: 3, reps: '10 لكل ساق', target_muscle: 'الأرجل' },
          { name: 'ضغط ضيق للصدر والترايسبس', name_en: 'Close-Grip Push-ups', sets: 3, reps: '12-15', target_muscle: 'الصدر' },
          { name: 'دراجة البطن الأرضية التبادلية', name_en: 'Bicycle Crunches', sets: 3, reps: '20 تكرار', target_muscle: 'البطن' },
        ],
      },
    ],
  },
];
