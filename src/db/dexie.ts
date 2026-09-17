import Dexie, { type Table } from 'dexie';
import {
  UserProfile,
  WaterLog,
  Exercise,
  Routine,
  WorkoutSession,
  WorkoutSet,
  PersonalRecord,
  CalendarEvent,
  MuscleRank,
  BestLift,
  DailyObjective,
  FoodLogEntry,
} from '../types';

export class AzmDatabase extends Dexie {
  user_profile!: Table<UserProfile, string>;
  water_logs!: Table<WaterLog, string>;
  exercises!: Table<Exercise, string>;
  routines!: Table<Routine, string>;
  workout_sessions!: Table<WorkoutSession, string>;
  workout_sets!: Table<WorkoutSet, string>;
  personal_records!: Table<PersonalRecord, string>;
  calendar_events!: Table<CalendarEvent, string>;
  muscle_ranks!: Table<MuscleRank, string>;
  best_lifts!: Table<BestLift, string>;
  daily_objectives!: Table<DailyObjective, string>;
  food_logs!: Table<FoodLogEntry, string>;

  constructor() {
    super('AzmFitnessDB');
    this.version(1).stores({
      user_profile: 'id',
      water_logs: 'id, date',
      exercises: 'id, category, name',
      routines: 'id, title',
      workout_sessions: 'id, started_at, is_completed',
      workout_sets: 'id, session_id, exercise_id, completed',
      personal_records: 'id, exercise_id, weight_kg',
    });

    // Version 2: Personal Calendar & Tasks + Muscle Ranks
    this.version(2).stores({
      user_profile: 'id',
      water_logs: 'id, date',
      exercises: 'id, category, name, equipment_type',
      routines: 'id, title',
      workout_sessions: 'id, started_at, is_completed',
      workout_sets: 'id, session_id, exercise_id, completed',
      personal_records: 'id, exercise_id, weight_kg',
      calendar_events: 'id, date, category, is_completed',
      muscle_ranks: 'muscle_id, score, rank',
    });

    // Version 3: Best Lifts per Muscle (Unranked System)
    this.version(3).stores({
      user_profile: 'id',
      water_logs: 'id, date',
      exercises: 'id, category, name, equipment_type',
      routines: 'id, title',
      workout_sessions: 'id, started_at, is_completed',
      workout_sets: 'id, session_id, exercise_id, completed',
      personal_records: 'id, exercise_id, weight_kg',
      calendar_events: 'id, date, category, is_completed',
      muscle_ranks: 'muscle_id, score, rank',
      best_lifts: 'muscle_id, exercise_name, updated_at',
    });

    // Version 4: Daily Objectives
    this.version(4).stores({
      user_profile: 'id',
      water_logs: 'id, date',
      exercises: 'id, category, name, equipment_type',
      routines: 'id, title',
      workout_sessions: 'id, started_at, is_completed',
      workout_sets: 'id, session_id, exercise_id, completed',
      personal_records: 'id, exercise_id, weight_kg',
      calendar_events: 'id, date, category, is_completed',
      muscle_ranks: 'muscle_id, score, rank',
      best_lifts: 'muscle_id, exercise_name, updated_at',
      daily_objectives: 'id, date, completed',
    });

    // Version 5: Nutrition & Calorie Tracking System
    this.version(5).stores({
      user_profile: 'id',
      water_logs: 'id, date',
      exercises: 'id, category, name, equipment_type',
      routines: 'id, title',
      workout_sessions: 'id, started_at, is_completed',
      workout_sets: 'id, session_id, exercise_id, completed',
      personal_records: 'id, exercise_id, weight_kg',
      calendar_events: 'id, date, category, is_completed',
      muscle_ranks: 'muscle_id, score, rank',
      best_lifts: 'muscle_id, exercise_name, updated_at',
      daily_objectives: 'id, date, completed',
      food_logs: 'id, date, meal, food_id',
    });
  }
}

export const db = new AzmDatabase();

// Pre-seeded Exercises in Arabic with equipment categorization and targeted muscles
export const INITIAL_EXERCISES: Exercise[] = [
  // صدر (Chest)
  {
    id: 'ex_bench_press',
    name: 'بنش برس مستوي بالبار',
    name_en: 'Barbell Bench Press',
    category: 'chest',
    equipment: 'بار وقبضة أولمبية',
    equipment_type: 'barbell',
    muscles: ['chest', 'triceps', 'shoulders'],
    primary_muscle: 'chest',
  },
  {
    id: 'ex_incline_db_press',
    name: 'بنش مائل بالدامبلز',
    name_en: 'Incline Dumbbell Press',
    category: 'chest',
    equipment: 'دامبلز ومقعد مائل',
    equipment_type: 'dumbbells',
    muscles: ['chest', 'shoulders', 'triceps'],
    primary_muscle: 'chest',
  },
  {
    id: 'ex_cable_fly',
    name: 'تفتيح الصدر بالكيبل',
    name_en: 'Cable Chest Fly',
    category: 'chest',
    equipment: 'جهاز الكيبل المزدوج',
    equipment_type: 'cable',
    muscles: ['chest'],
    primary_muscle: 'chest',
  },
  {
    id: 'ex_chest_dips',
    name: 'المتوازي للصدر',
    name_en: 'Chest Dips',
    category: 'chest',
    equipment: 'جهاز المتوازي / عقلة',
    equipment_type: 'pullup_bar',
    muscles: ['chest', 'triceps', 'shoulders'],
    primary_muscle: 'chest',
  },
  {
    id: 'ex_machine_press',
    name: 'ضغط الصدر بالجهاز',
    name_en: 'Chest Press Machine',
    category: 'chest',
    equipment: 'جهاز الصدر',
    equipment_type: 'machines',
    muscles: ['chest', 'triceps'],
    primary_muscle: 'chest',
  },
  {
    id: 'ex_pushups',
    name: 'تمرين الضغط (Push-ups)',
    name_en: 'Push-ups',
    category: 'chest',
    equipment: 'وزن الجسم فقط',
    equipment_type: 'bodyweight',
    muscles: ['chest', 'triceps', 'shoulders', 'abs'],
    primary_muscle: 'chest',
  },
  {
    id: 'ex_diamond_pushups',
    name: 'ضغط الماس (Diamond Push-ups)',
    name_en: 'Diamond Push-ups',
    category: 'chest',
    equipment: 'وزن الجسم فقط',
    equipment_type: 'bodyweight',
    muscles: ['triceps', 'chest'],
    primary_muscle: 'triceps',
  },

  // ظهر (Back)
  {
    id: 'ex_deadlift',
    name: 'الرفعة الميتة (ديدليفت)',
    name_en: 'Deadlift',
    category: 'back',
    equipment: 'بار أولمبي وأوزان',
    equipment_type: 'barbell',
    muscles: ['back', 'hamstrings', 'glutes', 'forearms'],
    primary_muscle: 'back',
  },
  {
    id: 'ex_lat_pulldown',
    name: 'سحب علوي عريض (لات بول داون)',
    name_en: 'Lat Pulldown',
    category: 'back',
    equipment: 'جهاز السحب العلوي',
    equipment_type: 'machines',
    muscles: ['back', 'biceps', 'forearms'],
    primary_muscle: 'back',
  },
  {
    id: 'ex_barbell_row',
    name: 'سحب ظهر بالبار منحنياً',
    name_en: 'Barbell Bent Over Row',
    category: 'back',
    equipment: 'بار مستوي',
    equipment_type: 'barbell',
    muscles: ['back', 'biceps', 'forearms'],
    primary_muscle: 'back',
  },
  {
    id: 'ex_db_row',
    name: 'سحب ظهر فردي بالدامبل',
    name_en: 'Single-Arm Dumbbell Row',
    category: 'back',
    equipment: 'دامبل ومقعد',
    equipment_type: 'dumbbells',
    muscles: ['back', 'biceps'],
    primary_muscle: 'back',
  },
  {
    id: 'ex_cable_row',
    name: 'سحب جالس للظهر بالكيبل',
    name_en: 'Seated Cable Row',
    category: 'back',
    equipment: 'كيبل وبكرة منخفضة',
    equipment_type: 'cable',
    muscles: ['back', 'biceps'],
    primary_muscle: 'back',
  },
  {
    id: 'ex_pullups',
    name: 'العقلة (وزن الجسم/أوزان)',
    name_en: 'Pull-ups',
    category: 'back',
    equipment: 'عقلة',
    equipment_type: 'pullup_bar',
    muscles: ['back', 'biceps', 'forearms'],
    primary_muscle: 'back',
  },
  {
    id: 'ex_inverted_rows',
    name: 'سحب أسترالي معكوس (وزن الجسم)',
    name_en: 'Inverted Rows',
    category: 'back',
    equipment: 'طاولة / عقلة منخفضة',
    equipment_type: 'bodyweight',
    muscles: ['back', 'biceps'],
    primary_muscle: 'back',
  },

  // أرجل (Legs)
  {
    id: 'ex_barbell_squat',
    name: 'سكوات خلفي بالبار',
    name_en: 'Barbell Back Squat',
    category: 'legs',
    equipment: 'راك البار والسكوات',
    equipment_type: 'barbell',
    muscles: ['quads', 'glutes', 'hamstrings'],
    primary_muscle: 'quads',
  },
  {
    id: 'ex_goblet_squat',
    name: 'سكوات كأس بالدامبل (Goblet)',
    name_en: 'Goblet Squat',
    category: 'legs',
    equipment: 'دامبل أو كيتل بيل',
    equipment_type: 'dumbbells',
    muscles: ['quads', 'glutes'],
    primary_muscle: 'quads',
  },
  {
    id: 'ex_bodyweight_squat',
    name: 'سكوات بوزن الجسم',
    name_en: 'Bodyweight Air Squat',
    category: 'legs',
    equipment: 'وزن الجسم فقط',
    equipment_type: 'bodyweight',
    muscles: ['quads', 'glutes'],
    primary_muscle: 'quads',
  },
  {
    id: 'ex_walking_lunges',
    name: 'الطعنات المتنقلة (Lunges)',
    name_en: 'Walking Lunges',
    category: 'legs',
    equipment: 'دامبلز أو وزن الجسم',
    equipment_type: 'bodyweight',
    muscles: ['quads', 'glutes', 'hamstrings'],
    primary_muscle: 'quads',
  },
  {
    id: 'ex_leg_press',
    name: 'دفع الأرجل بالجهاز 45°',
    name_en: 'Leg Press 45°',
    category: 'legs',
    equipment: 'جهاز مكبس الأرجل',
    equipment_type: 'machines',
    muscles: ['quads', 'glutes'],
    primary_muscle: 'quads',
  },
  {
    id: 'ex_romanian_deadlift',
    name: 'ديدليفت روماني (RDL)',
    name_en: 'Romanian Deadlift',
    category: 'legs',
    equipment: 'بار أو دامبلز',
    equipment_type: 'barbell',
    muscles: ['hamstrings', 'glutes', 'back'],
    primary_muscle: 'hamstrings',
  },
  {
    id: 'ex_leg_extension',
    name: 'مد ركبة أمامي بالجهاز',
    name_en: 'Leg Extension',
    category: 'legs',
    equipment: 'جهاز الفخذ الأمامي',
    equipment_type: 'machines',
    muscles: ['quads'],
    primary_muscle: 'quads',
  },
  {
    id: 'ex_leg_curl',
    name: 'مرجحة فخذ خلفي بالجهاز',
    name_en: 'Lying/Seated Leg Curl',
    category: 'legs',
    equipment: 'جهاز الفخذ الخلفي',
    equipment_type: 'machines',
    muscles: ['hamstrings'],
    primary_muscle: 'hamstrings',
  },
  {
    id: 'ex_standing_calf',
    name: 'رفع السمانة واقفاً',
    name_en: 'Standing Calf Raise',
    category: 'legs',
    equipment: 'جهاز السمانة أو دامبلز أو وزن الجسم',
    equipment_type: 'bodyweight',
    muscles: ['calves'],
    primary_muscle: 'calves',
  },

  // أكتاف (Shoulders)
  {
    id: 'ex_overhead_press',
    name: 'ضغط أكتاف عسكري واقف بالبار',
    name_en: 'Overhead Press (OHP)',
    category: 'shoulders',
    equipment: 'بار أولمبي',
    equipment_type: 'barbell',
    muscles: ['shoulders', 'triceps'],
    primary_muscle: 'shoulders',
  },
  {
    id: 'ex_db_shoulder_press',
    name: 'ضغط أكتاف جالس بالدامبلز',
    name_en: 'Dumbbell Shoulder Press',
    category: 'shoulders',
    equipment: 'دامبلز ومقعد 90°',
    equipment_type: 'dumbbells',
    muscles: ['shoulders', 'triceps'],
    primary_muscle: 'shoulders',
  },
  {
    id: 'ex_pike_pushups',
    name: 'ضغط بايك للأكتاف (وزن الجسم)',
    name_en: 'Pike Push-ups',
    category: 'shoulders',
    equipment: 'وزن الجسم فقط',
    equipment_type: 'bodyweight',
    muscles: ['shoulders', 'triceps'],
    primary_muscle: 'shoulders',
  },
  {
    id: 'ex_lateral_raise',
    name: 'رفرفة كتف جانبي بالدامبل',
    name_en: 'Dumbbell Lateral Raise',
    category: 'shoulders',
    equipment: 'دامبلز خفيفة',
    equipment_type: 'dumbbells',
    muscles: ['shoulders'],
    primary_muscle: 'shoulders',
  },
  {
    id: 'ex_face_pull',
    name: 'فيس بول بالكيبل والحبل',
    name_en: 'Cable Face Pull',
    category: 'shoulders',
    equipment: 'كيبل وحبل',
    equipment_type: 'cable',
    muscles: ['shoulders', 'back'],
    primary_muscle: 'shoulders',
  },

  // ذراعين (Arms)
  {
    id: 'ex_barbell_curl',
    name: 'مرجحة بايسبس بالبار',
    name_en: 'Barbell Bicep Curl',
    category: 'arms',
    equipment: 'بار مستوي أو متعرج EZ',
    equipment_type: 'barbell',
    muscles: ['biceps', 'forearms'],
    primary_muscle: 'biceps',
  },
  {
    id: 'ex_hammer_curl',
    name: 'مرجحة مطرقة بالدامبل',
    name_en: 'Hammer Curl',
    category: 'arms',
    equipment: 'دامبلز',
    equipment_type: 'dumbbells',
    muscles: ['biceps', 'forearms'],
    primary_muscle: 'biceps',
  },
  {
    id: 'ex_bench_dips',
    name: 'غطس ترايسبس على المقعد (Bench Dips)',
    name_en: 'Bench Dips',
    category: 'arms',
    equipment: 'مقعد أو كرسي',
    equipment_type: 'bodyweight',
    muscles: ['triceps', 'chest'],
    primary_muscle: 'triceps',
  },
  {
    id: 'ex_tricep_pushdown',
    name: 'دفع ترايسبس بالحبل بالكيبل',
    name_en: 'Tricep Rope Pushdown',
    category: 'arms',
    equipment: 'كيبل وحبل',
    equipment_type: 'cable',
    muscles: ['triceps'],
    primary_muscle: 'triceps',
  },
  {
    id: 'ex_skull_crusher',
    name: 'كسارة الجمجمة للترايسبس EZ',
    name_en: 'Lying Triceps Extension',
    category: 'arms',
    equipment: 'بار EZ ومقعد',
    equipment_type: 'barbell',
    muscles: ['triceps'],
    primary_muscle: 'triceps',
  },

  // بطن وكور (Core)
  {
    id: 'ex_plank',
    name: 'تمرين الثبات (بلانك)',
    name_en: 'Standard Plank',
    category: 'core',
    equipment: 'سجادة أرضية',
    equipment_type: 'bodyweight',
    muscles: ['abs'],
    primary_muscle: 'abs',
  },
  {
    id: 'ex_cable_crunch',
    name: 'طحن البطن راكعاً بالكيبل',
    name_en: 'Kneeling Cable Crunch',
    category: 'core',
    equipment: 'كيبل وحبل',
    equipment_type: 'cable',
    muscles: ['abs'],
    primary_muscle: 'abs',
  },
  {
    id: 'ex_hanging_leg_raise',
    name: 'رفع الأرجل معلقاً',
    name_en: 'Hanging Leg Raise',
    category: 'core',
    equipment: 'عقلة أو متوازي',
    equipment_type: 'pullup_bar',
    muscles: ['abs'],
    primary_muscle: 'abs',
  },
];

export const INITIAL_ROUTINES: Routine[] = [
  {
    id: 'routine_push',
    title: 'دفع (Push) - صدر وأكتاف وترايسبس',
    description: 'تركيز على عضلات الدفع العلوية مع تحفيز القوة والضخامة',
    target_goal: 'بناء العضلات والقوة',
    exercises: [
      { exercise_id: 'ex_bench_press', target_sets: 4, target_reps: '6-8', tips: 'تحكم في النزول ولمس أسفل الصدر بخفة' },
      { exercise_id: 'ex_incline_db_press', target_sets: 3, target_reps: '8-10', tips: 'زاوية المقعد 30 درجة لتقليل الضغط على المفصل' },
      { exercise_id: 'ex_db_shoulder_press', target_sets: 3, target_reps: '8-12', tips: 'مدى حركي كامل بدون تقويس الظهر' },
      { exercise_id: 'ex_lateral_raise', target_sets: 4, target_reps: '12-15', tips: 'رفع بالمرفقين وعدم التأرجح' },
      { exercise_id: 'ex_tricep_pushdown', target_sets: 3, target_reps: '10-12', tips: 'ثبات الكوعين بجانب الجذع وعصر الترايسبس' },
    ],
  },
  {
    id: 'routine_pull',
    title: 'سحب (Pull) - ظهر وبايسبس وكتف خلفي',
    description: 'تطوير عضلات الظهر وسماكته مع عزل البايسبس والكتف الخلفي',
    target_goal: 'عرض الظهر وقوة السحب',
    exercises: [
      { exercise_id: 'ex_deadlift', target_sets: 3, target_reps: '5', tips: 'إبقاء الظهر مستقيماً والضغط بكعبي القدمين' },
      { exercise_id: 'ex_lat_pulldown', target_sets: 4, target_reps: '8-10', tips: 'سحب البار نحو الترقوة مع إرجاع الكتفين' },
      { exercise_id: 'ex_cable_row', target_sets: 3, target_reps: '10-12', tips: 'عصر عضلات منتصف الظهر ثانية في النهاية' },
      { exercise_id: 'ex_face_pull', target_sets: 4, target_reps: '12-15', tips: 'سحب الحبل نحو الجبهة مع تدوير الكتف خارجياً' },
      { exercise_id: 'ex_hammer_curl', target_sets: 3, target_reps: '10-12', tips: 'قبضة محايدة لتحفيز عضلة البراكياليس' },
    ],
  },
  {
    id: 'routine_legs',
    title: 'أرجل (Legs) - قوة وألياف متفجرة',
    description: 'يوم شاق للأرجل يغطي الفخذ الأمامي والخلفي والسمانة',
    target_goal: 'قوة الجزء السفلي واستقرار المفاصل',
    exercises: [
      { exercise_id: 'ex_barbell_squat', target_sets: 4, target_reps: '6-8', tips: 'نزول متزن تحت زاوية 90 درجة مع دفع الركبتين للخارج' },
      { exercise_id: 'ex_leg_press', target_sets: 3, target_reps: '10-12', tips: 'عدم قفل الركبة تماماً في أعلى الحركة لحماية المفصل' },
      { exercise_id: 'ex_romanian_deadlift', target_sets: 3, target_reps: '8-10', tips: 'دفع الحوض للخلف والشعور بالتمدد في الأوتار' },
      { exercise_id: 'ex_leg_curl', target_sets: 3, target_reps: '12', tips: 'عصر الأوتار والتحكم بالنزول السلبي' },
      { exercise_id: 'ex_standing_calf', target_sets: 4, target_reps: '15-20', tips: 'ثبات ثانية في القمة وثانية في أقصى التمدد' },
    ],
  },
  {
    id: 'routine_calisthenics',
    title: 'وزن الجسم والمنزل (Home & Bodyweight)',
    description: 'برنامج انضباط كامل لا يحتاج أي أوزان أو أدوات معقدة',
    target_goal: 'لياقة وقوة وظيفية منزلية',
    exercises: [
      { exercise_id: 'ex_pushups', target_sets: 4, target_reps: '15-20', tips: 'جذع مشدود ونزول حتى يلامس الصدر الأرض' },
      { exercise_id: 'ex_pike_pushups', target_sets: 3, target_reps: '10-12', tips: 'رفع الحوض للأعلى واستهداف الأكتاف' },
      { exercise_id: 'ex_bodyweight_squat', target_sets: 4, target_reps: '20-25', tips: 'سرعة نزول بطيئة مع ثبات ثانية في الأسفل' },
      { exercise_id: 'ex_bench_dips', target_sets: 3, target_reps: '12-15', tips: 'استخدام حافة المقعد أو السرير للغطس' },
      { exercise_id: 'ex_plank', target_sets: 3, target_reps: '60 ثانية', tips: 'ثبات كامل دون تقويس أسفل الظهر' },
    ],
  },
];

export async function initializeDatabaseDefaults() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Check if user profile exists
    const existingProfile = await db.user_profile.get('current_user');
    if (!existingProfile) {
      const defaultProfile: UserProfile = {
        id: 'current_user',
        name: 'البطل',
        weight_kg: 75,
        daily_water_target_ml: 2625,
        streak_count: 12,
        last_active_date: today,
        is_workout_day: true,
        equipment: ['full_gym', 'dumbbells', 'barbell', 'machines', 'cable', 'pullup_bar'],
      };
      await db.user_profile.put(defaultProfile);
    } else if (!existingProfile.equipment) {
      // Ensure equipment property exists for updated apps
      await db.user_profile.update('current_user', {
        equipment: ['full_gym', 'dumbbells', 'barbell', 'machines', 'cable', 'pullup_bar'],
      });
    }

    // Refresh exercises catalog with equipment and muscle mapping
    const exercisesCount = await db.exercises.count();
    if (exercisesCount === 0 || exercisesCount < INITIAL_EXERCISES.length) {
      await db.exercises.bulkPut(INITIAL_EXERCISES);
    }

    // Seed routines if empty
    const routinesCount = await db.routines.count();
    if (routinesCount === 0) {
      await db.routines.bulkPut(INITIAL_ROUTINES);
    }

    // Check today's water log
    const todayWater = await db.water_logs.where('date').equals(today).first();
    if (!todayWater) {
      await db.water_logs.put({
        id: `water_${today}`,
        date: today,
        total_ml: 1250,
        logs: [
          { timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), amount: 500 },
          { timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), amount: 750 },
        ],
      });
    }

    // Check initial calendar events & tasks
    const eventsCount = await db.calendar_events.count();
    if (eventsCount === 0) {
      const tomorrowDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const initialEvents: CalendarEvent[] = [
        {
          id: 'event_workout_today',
          title: 'تمرين دفع (Push Day) في الصالة',
          date: today,
          start_time: '17:00',
          end_time: '18:15',
          category: 'workout',
          notes: 'التركيز على زيادة وزن البنش برس وتحطيم رقم قياسي جديد',
          reminder: '30_min',
          is_completed: false,
          is_workout: true,
          created_at: new Date().toISOString(),
        },
        {
          id: 'event_study_today',
          title: 'مذاكرة وحل مسائل الفيزياء / الرياضيات',
          date: today,
          start_time: '19:30',
          end_time: '21:00',
          category: 'study',
          notes: 'مراجعة الفصول 3 و 4 للاستعداد للاختبار القادم',
          reminder: '15_min',
          is_completed: false,
          created_at: new Date().toISOString(),
        },
        {
          id: 'event_exam_tomorrow',
          title: 'اختبار الرياضيات (Math Exam)',
          date: tomorrowDate,
          start_time: '10:00',
          end_time: '12:00',
          category: 'exam',
          notes: 'قاعة الامتحانات المركزية - إحضار الآلة الحاسبة والبطاقة',
          reminder: '1_day',
          is_completed: false,
          created_at: new Date().toISOString(),
        },
      ];
      await db.calendar_events.bulkPut(initialEvents);
    }

    // Daily objectives start empty until the user adds them.
    // Clean up any legacy default seeded objectives:
    const defaultIds = ['obj_workout', 'obj_study', 'obj_read', 'obj_walk', 'obj_water', 'obj_plan'];
    await db.daily_objectives.bulkDelete(defaultIds);
    // Also clean up any auto-generated default IDs from earlier versions
    const allObjs = await db.daily_objectives.toArray();
    const legacyToClean = allObjs.filter(o => 
      o.id.startsWith('obj_workout_') ||
      o.id.startsWith('obj_study_') ||
      o.id.startsWith('obj_read_') ||
      o.id.startsWith('obj_walk_') ||
      o.id.startsWith('obj_water_') ||
      o.id.startsWith('obj_plan_') ||
      o.title.includes('(Workout)') ||
      o.title.includes('(Study') ||
      o.title.includes('(Read') ||
      o.title.includes('(Walk') ||
      o.title.includes('(Drink') ||
      o.title.includes('(Plan tomorrow)')
    );
    if (legacyToClean.length > 0) {
      await db.daily_objectives.bulkDelete(legacyToClean.map(o => o.id));
    }
  } catch (error) {
    console.error('Error initializing Dexie database defaults:', error);
  }
}
