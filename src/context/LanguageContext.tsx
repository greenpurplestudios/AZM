import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.workout': 'التمرين',
    'nav.goals': 'الأهداف',
    'nav.calendar': 'التقويم',
    'nav.more': 'المزيد',
    'nav.active': 'نشط',

    // Header
    'header.brand': 'عَــزْم',
    'header.tagline': 'منظومة الانضباط الرياضي والبدني',

    // Weekdays
    'day.saturday': 'السبت',
    'day.sunday': 'الأحد',
    'day.monday': 'الاثنين',
    'day.tuesday': 'الثلاثاء',
    'day.wednesday': 'الأربعاء',
    'day.thursday': 'الخميس',
    'day.friday': 'الجمعة',
    'day.short.sat': 'سبت',
    'day.short.sun': 'أحد',
    'day.short.mon': 'اثنين',
    'day.short.tue': 'ثلاثاء',
    'day.short.wed': 'أربعاء',
    'day.short.thu': 'خميس',
    'day.short.fri': 'جمعة',

    // Training Schedule Flow (4 Steps)
    'schedule.modal_title': 'إنشاء جدول التدريب الأسبوعي',
    'schedule.modal_subtitle': 'صمم جدولك التدريبي المخصص خطوة بخطوة',
    'schedule.step1_tab': '1. اختيار الأيام',
    'schedule.step2_tab': '2. تخصيص التمارين',
    'schedule.step3_tab': '3. إعدادات الجدولة',
    'schedule.step4_tab': '4. المراجعة والتفعيل',

    // Step 1: Choose Training Days
    'schedule.step1_title': 'الخطوة الأولى: تحديد أيام التدريب',
    'schedule.step1_desc': 'اختر الأيام التي ترغب بالتمرين فيها بكل حرية ومرونة',
    'schedule.selected_count': 'أيام التدريب المختارة',
    'schedule.rest_count': 'أيام الاستشفاء والراحة',
    'schedule.days_selected_label': 'أيام تدريب',
    'schedule.day_workout': 'يوم تمرين',
    'schedule.day_rest': 'يوم راحة واستشفاء',
    'schedule.no_days_warning': 'يرجى اختيار يوم تدريب واحد على الأقل للمتابعة',
    'schedule.preset_templates': 'أو اختر من النماذج التدريبية الجاهزة',
    'schedule.load_template': 'استيراد هذا النموذج',

    // Step 2: Customize Each Selected Day
    'schedule.step2_title': 'الخطوة الثانية: تخصيص أيام التدريب',
    'schedule.step2_desc': 'حدد لكل يوم اسمه، تركيزه العضلي، وتمارينه المستهدفة',
    'schedule.day_name_label': 'اسم يوم التمرين',
    'schedule.day_name_placeholder': 'مثال: يوم الصدر، الجزء العلوي، يوم الأرجل...',
    'schedule.muscle_focus_label': 'المجموعة العضلية أو التركيز',
    'schedule.muscle_focus_placeholder': 'مثال: الصدر والأكتاف والترايسبس...',
    'schedule.day_notes_label': 'ملاحظات وتوجيهات الجلسة (اختياري)',
    'schedule.day_notes_placeholder': 'اكتب أي توجيهات خاصة بالتمارين أو الإحماء...',
    'schedule.exercises_count': 'التمارين المحددة',
    'schedule.add_exercise_btn': 'إضافة تمرين إلى هذا اليوم',
    'schedule.no_exercises_day': 'لم يتم إضافة تمارين بعد لهذا اليوم. اضغط لإضافة تمارين.',
    'schedule.reorder_up': 'تحريك لأعلى',
    'schedule.reorder_down': 'تحريك لأسفل',
    'schedule.remove_exercise': 'حذف التمرين',
    'schedule.sets_label': 'الجولات',
    'schedule.reps_label': 'التكرارات',
    'schedule.notes_label': 'ملاحظة',
    'schedule.pick_exercise': 'اختيار من مكتبة التمارين',
    'schedule.custom_exercise': 'إضافة تمرين مخصص',
    'schedule.exercise_name_custom': 'اسم التمرين المخصص',
    'schedule.search_exercise': 'ابحث في مكتبة التمارين المعتمدة...',

    // Step 3: Scheduling Options
    'schedule.step3_title': 'الخطوة الثالثة: إعدادات الجدولة والتوقيت',
    'schedule.step3_desc': 'حدد تفاصيل الخطة الزمنية وتكاملها مع تقويمك اليومي',
    'schedule.plan_name_label': 'اسم الخطة التدريبية العامة',
    'schedule.plan_name_placeholder': 'مثال: خطة بناء القوة، جدول التنشيف الصيفي...',
    'schedule.default_time_label': 'موعد التمرين المفضل',
    'schedule.duration_label': 'مدة استمرار الخطة التدريبية',
    'schedule.duration_4weeks': '4 أسابيع (شهر واحد)',
    'schedule.duration_8weeks': '8 أسابيع (شهران)',
    'schedule.duration_12weeks': '12 أسبوعاً (3 أشهر)',
    'schedule.duration_ongoing': 'مستمر بلا نهاية محددة',
    'schedule.auto_add_calendar': 'إدراج التمارين تلقائياً في التقويم',
    'schedule.auto_add_calendar_desc': 'ستظهر التمارين ومواعيدها تلقائياً في جدولك اليومي بالتقويم',

    // Step 4: Review and Activate
    'schedule.step4_title': 'الخطوة الرابعة: المراجعة وتفعيل الخطة',
    'schedule.step4_desc': 'نظرة شاملة على توزيع أيامك وحجم تدريبك الأسبوعي قبل الحفظ',
    'schedule.weekly_breakdown': 'التوزيع الأسبوعي للأيام',
    'schedule.total_weekly_sets': 'إجمالي الجولات الأسبوعية',
    'schedule.total_exercises': 'إجمالي التمارين',
    'schedule.activate_plan_btn': 'تأكيد وتفعيل الجدول التدريبي',
    'schedule.activated_success': 'تم تفعيل جدول التدريب بنجاح وإدراجه في منظومتك!',
    'schedule.next_step': 'التالي',
    'schedule.prev_step': 'السابق',

    // Dashboard View
    'dashboard.welcome': 'مرحباً بك مجدداً',
    'dashboard.athlete': 'بطل عزم',
    'dashboard.today_workout': 'تمرين اليوم',
    'dashboard.rest_day': 'يوم راحة واستشفاء',
    'dashboard.rest_day_desc': 'اليوم مخصص لاستشفاء العضلات واستعادة الطاقة للأيام القادمة.',
    'dashboard.start_workout': 'بدء تمرين اليوم',
    'dashboard.quick_freestyle': 'بدء تمرين حر سريع',
    'dashboard.create_schedule_btn': 'إنشاء جدولك التدريبي',
    'dashboard.objectives_title': 'أهداف اليوم والانضباط',
    'dashboard.add_objective': 'إضافة هدف',
    'dashboard.streak_label': 'أيام متتالية',
    'dashboard.hydration_title': 'الارتواء واستهلاك الماء',
    'dashboard.water_logged': 'المستهلك اليوم',
    'dashboard.water_target': 'الهدف اليومي',
    'dashboard.add_water_quick': '+250 مل ماء',

    // Workout Hub View
    'workout.title': 'مركز التمارين والقوة',
    'workout.subtitle': 'إدارة جداولك التدريبية، رتبك العضلية، وأرقامك القياسية',
    'workout.muscle_rank': 'الرتب العضلية',
    'workout.view_details': 'عرض التفاصيل',
    'workout.view_ranks_btn': 'عرض الرتب العضلية',
    'workout.today_session': 'جلسة اليوم',
    'workout.start_today': 'بدء تمرين اليوم',
    'workout.quick_workout': 'تمرين حر سريع',
    'workout.create_schedule_btn': 'إنشاء جدول تدريبي',
    'workout.prs_title': 'الأرقام القياسية الشخصية',
    'workout.history_title': 'سجل التمارين السابقة',
    'workout.active_routine': 'الجدول التدريبي الحالي',
    'workout.all_routines': 'الجداول التدريبية المحفوظة',
    'workout.personal_records': 'الأرقام القياسية الشخصية',
    'workout.muscle_ranks': 'رتب القوة العضلية',
    'workout.history': 'سجل التمارين السابقة',
    'workout.empty_history': 'لا توجد تمارين مسجلة حتى الآن. ابدأ تمرينك الأول اليوم!',
    'workout.create_new_plan': 'إنشاء جدول جديد',
    'workout.no_plan_yet': 'لم تقم بإنشاء جدول تدريبي بعد. صمم خطتك الآن!',

    // Calendar View
    'calendar.title': 'التقويم والجدول الزمني',
    'calendar.subtitle': 'متابعة مواعيد تمارينك اليومية وأيام الاستشفاء المخططة',
    'calendar.today': 'اليوم',
    'calendar.add_event': 'إضافة موعد',
    'calendar.scheduled_workouts': 'التمارين المجدولة',
    'calendar.no_events_today': 'لا توجد تمارين مجدولة في هذا اليوم.',
    'calendar.workout_event': 'تمرين',

    // Goals View
    'goals.title': 'الأهداف والارتواء',
    'goals.subtitle': 'تتبع أهدافك اليومية واستمرارية شرب الماء والعادات الصحية',
    'goals.daily_water': 'تتبع شرب الماء',
    'goals.habits_checklist': 'قائمة العادات اليومية',

    // Athletic Tools (Stopwatch, Timer, Alarm)
    'tools.title': 'أدوات التوقيت الرياضي',
    'tools.subtitle': 'ساعة الإيقاف، مؤقت الراحة التنازلي، ومنبهات التمرين',
    'tools.stopwatch': 'ساعة الإيقاف',
    'tools.timer': 'مؤقت تنازلي',
    'tools.alarm': 'المنبه الرياضي',
    'tools.start': 'بدء',
    'tools.pause': 'إيقاف مؤقت',
    'tools.resume': 'استئناف',
    'tools.reset': 'إعادة ضبط',
    'tools.lap': 'تسجيل دورة',
    'tools.laps_history': 'سجل الدورات',
    'tools.rest_presets': 'فترات راحة سريعة',
    'tools.alarm_time': 'وقت التنبيه',
    'tools.alarm_label': 'اسم التنبيه',
    'tools.add_alarm': 'إضافة منبه',
    'tools.alarm_active': 'المنبه مفعل',

    // More Hub
    'more.title': 'المزيد والخيارات',
    'more.subtitle': 'المؤقت، الملف الشخصي، لوائح الصدارة، وحاسبة السعرات',
    'more.alarm_tools': 'المؤقت وساعة الإيقاف والمنبه',
    'more.alarm_tools_desc': 'ساعة الإيقاف، مؤقت الراحة بين الجولات، وتنبيهات التمرين والارتواء',
    'more.profile': 'الملف الشخصي والإعدادات',
    'more.profile_desc': 'البيانات الحيوية، الصورة، النبذة، وبيئة التدريب والمعدات',
    'more.leaderboards': 'لوائح الصدارة',
    'more.leaderboards_desc': 'تنافس في الاستمرارية اليومية وأرقام القوة القياسية',
    'more.calories': 'حاسبة السعرات',
    'more.calories_desc': 'تتبع وجباتك وحساب الماكروز وسعراتك اليومية ببيانات موثوقة',

    // Leaderboards
    'leaderboards.title': 'لوائح الصدارة',
    'leaderboards.subtitle': 'تنافس بأرقامك الحقيقية واستمراريتك مع أبطال عزم',
    'leaderboards.tab_consistency': 'الاستمرارية',
    'leaderboards.tab_prs': 'الأرقام القياسية',
    'leaderboards.bench': 'ضغط البنش',
    'leaderboards.deadlift': 'الرفعة الميتة',
    'leaderboards.squat': 'السكوات',
    'leaderboards.pushup': 'تمارين الضغط',
    'leaderboards.pullup': 'العقلة',
    'leaderboards.your_rank': 'موقعك في الترتيب',
    'leaderboards.completed_days': 'أيام مكتملة',
    'leaderboards.current_streak': 'السلسلة الحالية',
    'leaderboards.longest_streak': 'أطول سلسلة',
    'leaderboards.consistency_score': 'نسبة الالتزام',
    'leaderboards.view_profile': 'عرض الملف',
    'leaderboards.empty': 'لا توجد بيانات مسجلة في هذا القسم بعد.',

    // Public Profile
    'public_profile.title': 'الملف الرياضي العام',
    'public_profile.best_streak': 'أطول سلسلة',
    'public_profile.consistency': 'معدل الاستمرارية',
    'public_profile.days': 'أيام',
    'public_profile.personal_records': 'الأرقام القياسية الشخصية',
    'public_profile.no_prs': 'لم يتم تسجيل أرقام قياسية بعد',
    'public_profile.close': 'إغلاق',

    // Calorie Calculator
    'calories.title': 'حاسبة السعرات والماكروز',
    'calories.subtitle': 'تتبع وجباتك اليومية وحساب الاحتياج الرياضي بدقة علمية',
    'calories.step1': 'البيانات الشخصية',
    'calories.step2': 'الهدف الرياضي',
    'calories.step3': 'الاحتياج المحسوب',
    'calories.today_summary': 'ملخص اليوم',
    'calories.calories': 'السعرات',
    'calories.protein': 'البروتين',
    'calories.carbs': 'الكربوهيدرات',
    'calories.fat': 'الدهون',
    'calories.consumed': 'المستهلك',
    'calories.target': 'الهدف',
    'calories.remaining': 'المتبقي',
    'calories.add_food': 'إضافة طعام',
    'calories.search_placeholder': 'ابحث عن طعام (مثل: صدر دجاج، بيض مسلوق، أرز)...',
    'calories.food_quantity': 'الكمية والوحدة',
    'calories.log_food_btn': 'تسجيل في الوجبة',
    'calories.breakfast': 'الفطور',
    'calories.lunch': 'الغداء',
    'calories.dinner': 'العشاء',
    'calories.snacks': 'وجبات خفيفة',
    'calories.source_verified': 'قاعدة بيانات غذائية موثوقة',
    'calories.recalculate': 'تعديل الهدف والمعادلة',
    'calories.goal_maintain': 'ثبات الوزن والمحافظة',
    'calories.goal_cut': 'تنشيف وخسارة دهون (-500 سعرة)',
    'calories.goal_lean_bulk': 'تضخيم نقي محسوب (+250 سعرة)',
    'calories.goal_bulk': 'تضخيم مكثف (+500 سعرة)',
    'calories.activity_sedentary': 'خامل (عمل مكتبي، قليل الحركة)',
    'calories.activity_light': 'نشاط خفيف (1-3 أيام تمرين في الأسبوع)',
    'calories.activity_moderate': 'نشاط متوسط (3-5 أيام تمرين في الأسبوع)',
    'calories.activity_active': 'نشاط عالي (6-7 أيام تمرين في الأسبوع)',
    'calories.activity_very_active': 'نشاط رياضي شاق (تمرين مرتين يومياً)',

    // Profile
    'profile.title': 'الملف الشخصي',
    'profile.edit_photo': 'تغيير الصورة',
    'profile.remove_photo': 'حذف الصورة',
    'profile.bio_label': 'النبذة الرياضية',
    'profile.bio_placeholder': 'اكتب نبذة عن أهدافك ومسيرتك التدريبية...',
    'profile.name_label': 'الاسم الرياضي',
    'profile.weight_label': 'وزن الجسم (كجم)',
    'profile.save_btn': 'حفظ التعديلات',
    'profile.saved_success': 'تم حفظ البيانات بنجاح!',
    'profile.leaderboard_privacy': 'الظهور في لوائح الصدارة التنافسية',
    'profile.leaderboard_privacy_desc': 'السماح بإظهار اسمك وأرقامك القياسية وسلسلة انضباطك لباقي الأبطال',

    // Muscle Ranks
    'muscle.ranking_title': 'نظام الرتب العضلية',
    'muscle.ranking_subtitle': 'خريطة الرتب وتطور القوة العضلية',
    'muscle.rank_unranked': 'غير مصنف',
    'muscle.rank_bronze': 'برونزي',
    'muscle.rank_silver': 'فضي',
    'muscle.rank_gold': 'ذهبي',
    'muscle.rank_platinum': 'بلاتيني',
    'muscle.rank_diamond': 'ماسي',
    'muscle.rank_unreal': 'أسطوري',
    'muscle.rank_top50': 'أفضل 50',

    // General
    'common.kg': 'كجم',
    'common.reps': 'تكرار',
    'common.g': 'غرام',
    'common.kcal': 'سعرة',
    'common.ml': 'مل',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.back': 'رجوع',
    'common.language': 'اللغة',
    'common.close': 'إغلاق',
    'common.edit': 'تعديل',
    'common.done': 'تم',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.workout': 'Training',
    'nav.goals': 'Goals',
    'nav.calendar': 'Calendar',
    'nav.more': 'More',
    'nav.active': 'Active',

    // Header
    'header.brand': 'AZM',
    'header.tagline': 'Athletic Discipline & Fitness System',

    // Weekdays
    'day.saturday': 'Saturday',
    'day.sunday': 'Sunday',
    'day.monday': 'Monday',
    'day.tuesday': 'Tuesday',
    'day.wednesday': 'Wednesday',
    'day.thursday': 'Thursday',
    'day.friday': 'Friday',
    'day.short.sat': 'Sat',
    'day.short.sun': 'Sun',
    'day.short.mon': 'Mon',
    'day.short.tue': 'Tue',
    'day.short.wed': 'Wed',
    'day.short.thu': 'Thu',
    'day.short.fri': 'Fri',

    // Training Schedule Flow (4 Steps)
    'schedule.modal_title': 'Create Your Training Schedule',
    'schedule.modal_subtitle': 'Build your fully customized weekly split step-by-step',
    'schedule.step1_tab': '1. Choose Days',
    'schedule.step2_tab': '2. Customize Days',
    'schedule.step3_tab': '3. Scheduling Options',
    'schedule.step4_tab': '4. Review & Activate',

    // Step 1: Choose Training Days
    'schedule.step1_title': 'Step 1 — Choose Training Days',
    'schedule.step1_desc': 'Select which days of the week you want to train. Choose any combination freely.',
    'schedule.selected_count': 'Selected Training Days',
    'schedule.rest_count': 'Rest & Recovery Days',
    'schedule.days_selected_label': 'training days',
    'schedule.day_workout': 'Workout Day',
    'schedule.day_rest': 'Rest Day',
    'schedule.no_days_warning': 'Please select at least one training day to proceed.',
    'schedule.preset_templates': 'Or choose from verified preset templates',
    'schedule.load_template': 'Load This Template',

    // Step 2: Customize Each Selected Day
    'schedule.step2_title': 'Step 2 — Customize Each Selected Day',
    'schedule.step2_desc': 'Configure the day title, target muscle focus, and specific exercises.',
    'schedule.day_name_label': 'Training Day Name',
    'schedule.day_name_placeholder': 'e.g. Chest Day, Upper Body, Push Day, Leg Day...',
    'schedule.muscle_focus_label': 'Muscle Group or Focus',
    'schedule.muscle_focus_placeholder': 'e.g. Chest, Shoulders & Triceps...',
    'schedule.day_notes_label': 'Session Notes & Warm-up (Optional)',
    'schedule.day_notes_placeholder': 'Add warm-up cues, superset instructions, or notes...',
    'schedule.exercises_count': 'Scheduled Exercises',
    'schedule.add_exercise_btn': 'Add Exercise to this Day',
    'schedule.no_exercises_day': 'No exercises added yet. Tap to add exercises.',
    'schedule.reorder_up': 'Move Up',
    'schedule.reorder_down': 'Move Down',
    'schedule.remove_exercise': 'Remove Exercise',
    'schedule.sets_label': 'Sets',
    'schedule.reps_label': 'Reps',
    'schedule.notes_label': 'Note',
    'schedule.pick_exercise': 'Pick from Exercise Library',
    'schedule.custom_exercise': 'Add Custom Exercise',
    'schedule.exercise_name_custom': 'Custom Exercise Name',
    'schedule.search_exercise': 'Search exercise library...',

    // Step 3: Scheduling Options
    'schedule.step3_title': 'Step 3 — Scheduling Options',
    'schedule.step3_desc': 'Configure your plan name, default workout time, duration, and calendar sync.',
    'schedule.plan_name_label': 'Overall Plan Name',
    'schedule.plan_name_placeholder': 'e.g. My Hypertrophy Split, Summer Cut, Strength Phase 1...',
    'schedule.default_time_label': 'Preferred Workout Time',
    'schedule.duration_label': 'Schedule Duration',
    'schedule.duration_4weeks': '4 Weeks (1 Month)',
    'schedule.duration_8weeks': '8 Weeks (2 Months)',
    'schedule.duration_12weeks': '12 Weeks (3 Months)',
    'schedule.duration_ongoing': 'Ongoing (Indefinite)',
    'schedule.auto_add_calendar': 'Automatically Add to Calendar',
    'schedule.auto_add_calendar_desc': 'Workouts will appear on their scheduled days in your calendar automatically.',

    // Step 4: Review and Activate
    'schedule.step4_title': 'Step 4 — Review and Activate',
    'schedule.step4_desc': 'Review your weekly schedule breakdown and total volume before activation.',
    'schedule.weekly_breakdown': 'Weekly Breakdown',
    'schedule.total_weekly_sets': 'Total Weekly Sets',
    'schedule.total_exercises': 'Total Exercises',
    'schedule.activate_plan_btn': 'Confirm & Activate Training Schedule',
    'schedule.activated_success': 'Training schedule activated and scheduled successfully!',
    'schedule.next_step': 'Next',
    'schedule.prev_step': 'Previous',

    // Dashboard View
    'dashboard.welcome': 'Welcome Back',
    'dashboard.athlete': 'AZM Athlete',
    'dashboard.today_workout': "Today's Workout",
    'dashboard.rest_day': 'Rest & Recovery Day',
    'dashboard.rest_day_desc': 'Today is reserved for muscle recovery, rebuilding, and hydration.',
    'dashboard.start_workout': "Start Today's Workout",
    'dashboard.quick_freestyle': 'Quick Freestyle Workout',
    'dashboard.create_schedule_btn': 'Create Your Training Schedule',
    'dashboard.objectives_title': 'Daily Disciplines & Objectives',
    'dashboard.add_objective': 'Add Objective',
    'dashboard.streak_label': 'Days Streak',
    'dashboard.hydration_title': 'Hydration & Water Intake',
    'dashboard.water_logged': 'Logged Today',
    'dashboard.water_target': 'Daily Target',
    'dashboard.add_water_quick': '+250 ml Water',

    // Workout Hub View
    'workout.title': 'Workout & Strength Hub',
    'workout.subtitle': 'Manage your training splits, muscle ranks, and personal records',
    'workout.muscle_rank': 'Muscle Ranks',
    'workout.view_details': 'View Details',
    'workout.view_ranks_btn': 'View Muscle Ranks',
    'workout.today_session': "Today's Session",
    'workout.start_today': "Start Today's Workout",
    'workout.quick_workout': 'Quick Workout',
    'workout.create_schedule_btn': 'Create Training Schedule',
    'workout.prs_title': 'Personal Records (PR)',
    'workout.history_title': 'Past Workout History',
    'workout.active_routine': 'Active Training Routine',
    'workout.all_routines': 'Saved Training Routines',
    'workout.personal_records': 'Personal Records (PR)',
    'workout.muscle_ranks': 'Muscle Strength Ranks',
    'workout.history': 'Past Workout History',
    'workout.empty_history': 'No completed workouts yet. Start your first session today!',
    'workout.create_new_plan': 'Create New Schedule',
    'workout.no_plan_yet': "You haven't created a training split yet. Build one now!",

    // Calendar View
    'calendar.title': 'Calendar & Timeline',
    'calendar.subtitle': 'Track scheduled sessions, rest days, and training consistency',
    'calendar.today': 'Today',
    'calendar.add_event': 'Add Event',
    'calendar.scheduled_workouts': 'Scheduled Workouts',
    'calendar.no_events_today': 'No workouts scheduled for this day.',
    'calendar.workout_event': 'Workout',

    // Goals View
    'goals.title': 'Goals & Hydration',
    'goals.subtitle': 'Monitor daily habits, water intake, and physical disciplines',
    'goals.daily_water': 'Water Intake Tracker',
    'goals.habits_checklist': 'Daily Habits Checklist',

    // Athletic Tools
    'tools.title': 'Athletic Timing Tools',
    'tools.subtitle': 'Chronograph stopwatch, set rest timer, and athletic alarms',
    'tools.stopwatch': 'Stopwatch',
    'tools.timer': 'Countdown Timer',
    'tools.alarm': 'Athletic Alarm',
    'tools.start': 'Start',
    'tools.pause': 'Pause',
    'tools.resume': 'Resume',
    'tools.reset': 'Reset',
    'tools.lap': 'Record Lap',
    'tools.laps_history': 'Laps History',
    'tools.rest_presets': 'Quick Rest Presets',
    'tools.alarm_time': 'Alarm Time',
    'tools.alarm_label': 'Alarm Label',
    'tools.add_alarm': 'Add Alarm',
    'tools.alarm_active': 'Alarm Active',

    // More Hub
    'more.title': 'More & Options',
    'more.subtitle': 'Timer, Profile, Leaderboards, and Calorie Tracker',
    'more.alarm_tools': 'Alarm, Stopwatch & Timer',
    'more.alarm_tools_desc': 'Stopwatch, rest timer between sets, workout & hydration alerts',
    'more.profile': 'Profile & Settings',
    'more.profile_desc': 'Biometrics, photo, bio, equipment & training environment',
    'more.leaderboards': 'Leaderboards',
    'more.leaderboards_desc': 'Compete in daily consistency and personal strength records',
    'more.calories': 'Calorie Calculator',
    'more.calories_desc': 'Track meals, macros, and daily targets with verified scientific data',

    // Leaderboards
    'leaderboards.title': 'Leaderboards',
    'leaderboards.subtitle': 'Compete with verified lifts and daily consistency among AZM athletes',
    'leaderboards.tab_consistency': 'Consistency',
    'leaderboards.tab_prs': 'Personal Records',
    'leaderboards.bench': 'Bench Press',
    'leaderboards.deadlift': 'Deadlift',
    'leaderboards.squat': 'Squat',
    'leaderboards.pushup': 'Push-Up',
    'leaderboards.pullup': 'Pull-Up',
    'leaderboards.your_rank': 'Your Rank',
    'leaderboards.completed_days': 'Completed Days',
    'leaderboards.current_streak': 'Current Streak',
    'leaderboards.longest_streak': 'Best Streak',
    'leaderboards.consistency_score': 'Consistency Rate',
    'leaderboards.view_profile': 'View Profile',
    'leaderboards.empty': 'No records available in this category yet.',

    // Public Profile
    'public_profile.title': 'Public Athletic Profile',
    'public_profile.best_streak': 'Best Streak',
    'public_profile.consistency': 'Consistency',
    'public_profile.days': 'days',
    'public_profile.personal_records': 'Personal Records',
    'public_profile.no_prs': 'No personal records logged yet',
    'public_profile.close': 'Close',

    // Calorie Calculator
    'calories.title': 'Calorie & Macro Calculator',
    'calories.subtitle': 'Track daily food intake and calculate athletic requirements scientifically',
    'calories.step1': 'Personal Info',
    'calories.step2': 'Fitness Goal',
    'calories.step3': 'Calculated Targets',
    'calories.today_summary': "Today's Summary",
    'calories.calories': 'Calories',
    'calories.protein': 'Protein',
    'calories.carbs': 'Carbohydrates',
    'calories.fat': 'Fat',
    'calories.consumed': 'Consumed',
    'calories.target': 'Target',
    'calories.remaining': 'Remaining',
    'calories.add_food': 'Add Food',
    'calories.search_placeholder': 'Search food (e.g., chicken breast, boiled eggs, rice)...',
    'calories.food_quantity': 'Quantity & Unit',
    'calories.log_food_btn': 'Log to Meal',
    'calories.breakfast': 'Breakfast',
    'calories.lunch': 'Lunch',
    'calories.dinner': 'Dinner',
    'calories.snacks': 'Snacks',
    'calories.source_verified': 'Verified Food Database',
    'calories.recalculate': 'Adjust Goal & Targets',
    'calories.goal_maintain': 'Maintenance (Keep Weight)',
    'calories.goal_cut': 'Cut / Fat Loss (-500 kcal)',
    'calories.goal_lean_bulk': 'Lean Bulk / Muscle Gain (+250 kcal)',
    'calories.goal_bulk': 'Bulk (+500 kcal)',
    'calories.activity_sedentary': 'Sedentary (Desk job, minimal activity)',
    'calories.activity_light': 'Lightly Active (1-3 training days/week)',
    'calories.activity_moderate': 'Moderately Active (3-5 training days/week)',
    'calories.activity_active': 'Very Active (6-7 intense training days/week)',
    'calories.activity_very_active': 'Extremely Active (Athletic training twice daily)',

    // Profile
    'profile.title': 'Profile',
    'profile.edit_photo': 'Change Photo',
    'profile.remove_photo': 'Remove Photo',
    'profile.bio_label': 'Athletic Bio',
    'profile.bio_placeholder': 'Write a brief athletic bio and your fitness objectives...',
    'profile.name_label': 'Display Name',
    'profile.weight_label': 'Body Weight (kg)',
    'profile.save_btn': 'Save Changes',
    'profile.saved_success': 'Profile updated successfully!',
    'profile.leaderboard_privacy': 'Appear on Competitive Leaderboards',
    'profile.leaderboard_privacy_desc': 'Allow other athletes to see your name, PRs, and consistency streak',

    // Muscle Ranks
    'muscle.ranking_title': 'Muscle Ranking System',
    'muscle.ranking_subtitle': 'Strength map & muscle progression',
    'muscle.rank_unranked': 'Unranked',
    'muscle.rank_bronze': 'Bronze',
    'muscle.rank_silver': 'Silver',
    'muscle.rank_gold': 'Gold',
    'muscle.rank_platinum': 'Platinum',
    'muscle.rank_diamond': 'Diamond',
    'muscle.rank_unreal': 'Unreal',
    'muscle.rank_top50': 'Top 50',

    // General
    'common.kg': 'kg',
    'common.reps': 'reps',
    'common.g': 'g',
    'common.kcal': 'kcal',
    'common.ml': 'ml',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.language': 'Language',
    'common.close': 'Close',
    'common.edit': 'Edit',
    'common.done': 'Done',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  isRTL: true,
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('azm_language');
      if (saved === 'ar' || saved === 'en') return saved;
      return 'ar';
    } catch {
      return 'ar';
    }
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    try {
      localStorage.setItem('azm_language', language);
    } catch (e) {
      console.warn('Could not save language to storage', e);
    }
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    if (translations.ar[key]) {
      return translations.ar[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, isRTL, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
