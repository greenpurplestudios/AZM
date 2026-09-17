export type ExerciseCategory = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';

export type SetType = 'normal' | 'warmup' | 'drop' | 'failure';

// Equipment Types available to the user
export type EquipmentType =
  | 'full_gym'
  | 'dumbbells'
  | 'barbell'
  | 'machines'
  | 'cable'
  | 'bands'
  | 'kettlebell'
  | 'pullup_bar'
  | 'bodyweight';

// 1. User & Preferences
export interface UserProfile {
  id: string;
  name: string;
  weight_kg: number;
  daily_water_target_ml: number;
  streak_count: number;
  last_active_date?: string; // YYYY-MM-DD
  is_workout_day?: boolean;
  equipment?: EquipmentType[]; // Selected available equipment
}

// 2. Muscle Ranking System (Liftoff Inspired)
export type MuscleType =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves';

export type MuscleRankTier =
  | 'UNRANKED'
  | 'D'
  | 'C'
  | 'C+'
  | 'B-'
  | 'B'
  | 'B+'
  | 'A-'
  | 'A'
  | 'A+'
  | 'S';

// Best Lift Record per Muscle
export interface BestLift {
  id?: string;
  muscle_id: MuscleType;
  exercise_id?: string;
  exercise_name: string;
  exercise_name_en?: string;
  input_type: 'weight_reps' | 'bodyweight_reps' | 'bodyweight_plus_weight' | 'time_seconds';
  weight_kg: number;
  reps: number;
  bodyweight_kg?: number;
  added_weight_kg?: number;
  assisted_weight_kg?: number;
  time_seconds?: number;
  estimated_1rm: number;
  score: number; // 0 - 100
  rank: MuscleRankTier;
  initial_estimated_1rm?: number;
  progress_pct: number; // e.g. +8%
  updated_at: string;
  notes?: string;
}

export interface MuscleRank {
  muscle_id: MuscleType;
  muscle_name: string;
  muscle_name_en: string;
  category: 'upper' | 'lower' | 'core';
  score: number; // 0 - 100 (0 if unranked)
  rank: MuscleRankTier;
  previous_rank?: MuscleRankTier;
  progress_percentage: number; // 0 - 100 towards next rank threshold
  monthly_improvement_pct: number; // e.g. +6%
  last_trained_date?: string;
  total_volume_kg: number;
  total_sets: number;
  best_lift?: BestLift;
  is_unranked?: boolean;
}

// 3. Daily Water Tracking
export interface WaterLogEntry {
  id: string;
  timestamp: string; // ISO String
  amount: number; // ml
}

export interface WaterLog {
  id: string;
  date: string; // YYYY-MM-DD
  total_ml: number;
  logs: { timestamp: string; amount: number }[];
}

// 4. Exercise & Routine Structure
export interface Exercise {
  id: string;
  name: string; // Arabic name
  name_en?: string; // English / gym standard name (e.g., Bench Press)
  category: ExerciseCategory;
  equipment?: string;
  equipment_type?: EquipmentType | string;
  muscles?: MuscleType[]; // Targeted muscles for ranking system
  primary_muscle?: MuscleType;
  target_muscle?: string;
  is_custom?: boolean;
}

export interface RoutineExerciseItem {
  exercise_id: string;
  target_sets: number;
  target_reps: string;
  tips?: string;
}

export interface Routine {
  id: string;
  title: string;
  description?: string;
  target_goal?: string;
  exercises: RoutineExerciseItem[];
  created_at?: string;
}

// 5. Workout Active Session
export interface WorkoutSet {
  id: string;
  session_id: string;
  exercise_id: string;
  set_number: number;
  set_type: SetType;
  weight_kg: number;
  reps: number;
  completed: boolean;
  is_pr?: boolean;
  completed_at?: string;
}

export interface WorkoutSession {
  id: string;
  routine_id?: string;
  routine_title?: string;
  started_at: string;
  ended_at?: string;
  is_completed: boolean;
  duration_seconds?: number;
  sets: WorkoutSet[];
  notes?: string;
}

// 6. Personal Records (PR)
export interface PersonalRecord {
  id: string;
  exercise_id: string;
  exercise_name: string;
  weight_kg: number;
  reps: number;
  estimated_1rm: number;
  achieved_at: string;
  session_id: string;
}

// 7. Personal Life Calendar & Task Planning
export type EventCategory =
  | 'workout'
  | 'study'
  | 'exam'
  | 'university'
  | 'work'
  | 'appointment'
  | 'football'
  | 'task'
  | 'personal';

export type ReminderOption =
  | 'none'
  | 'at_time'
  | '5_min'
  | '15_min'
  | '30_min'
  | '1_hour'
  | '1_day';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  start_time?: string; // HH:MM
  end_time?: string; // HH:MM
  category: EventCategory;
  notes?: string;
  reminder?: ReminderOption;
  is_completed: boolean;
  is_workout?: boolean;
  workout_session_id?: string;
  created_at?: string;
}

// 8. AI Routine Generation Contract
export interface AIRoutineDay {
  day_name: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    tips: string;
  }[];
}

export interface AIRoutineResponse {
  routine_title: string;
  target_goal: string;
  days: AIRoutineDay[];
}

// 9. AI Weekly Recap
export interface AIWeeklyRecapResponse {
  headline: string;
  summary: string;
  streak_feedback: string;
  hydration_analysis: string;
  strength_progress: string;
  recovery_recommendations: string[];
  motivational_quote: string;
}

// 10. Daily Objectives (Personal daily commitments)
export interface DailyObjective {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  category?: 'fitness' | 'study' | 'habit' | 'mind' | 'general';
  created_at?: string;
}

// UI Navigation Tabs
export type AppTab =
  | 'dashboard'
  | 'workout'
  | 'goals'
  | 'calendar'
  | 'more'
  | 'progress'
  | 'muscles'
  | 'water'
  | 'routines'
  | 'profile';

