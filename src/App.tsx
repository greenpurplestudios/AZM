import React, { useState, useEffect } from 'react';
import { db, initializeDatabaseDefaults } from './db/dexie';
import { UserProfile, WorkoutSession, Routine, WorkoutSet, AppTab } from './types';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { WorkoutHubView } from './components/WorkoutHubView';
import { ActiveWorkoutView } from './components/ActiveWorkoutView';
import { GoalsView } from './components/GoalsView';
import { CalendarView } from './components/CalendarView';
import { MuscleRanksView } from './components/MuscleRanksView';
import { ProgressView } from './components/ProgressView';
import { RoutinesView } from './components/RoutinesView';
import { WaterTrackerView } from './components/WaterTrackerView';
import { ProfileView } from './components/ProfileView';
import { MoreHubView } from './components/MoreHubView';
import { LeaderboardsView } from './components/LeaderboardsView';
import { CalorieTrackerView } from './components/CalorieTrackerView';
import { AthleticToolsView } from './components/AthleticToolsView';
import { WorkoutCelebrationModal } from './components/WorkoutCelebrationModal';
import { AzmLogo } from './components/AzmLogo';

function MainApp() {
  const { isDark, colors } = useTheme();
  const { isRTL, t } = useLanguage();

  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [previousTab, setPreviousTab] = useState<AppTab>('dashboard');

  const handleNavigateTab = (tab: AppTab) => {
    setPreviousTab(activeTab);
    setActiveTab(tab);
  };
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'current_user',
    name: 'قيس',
    weight_kg: 75,
    streak_count: 7,
    daily_water_target_ml: 2625,
    is_workout_day: true,
    equipment: ['barbell', 'dumbbells', 'pullup_bar', 'bench'],
    show_in_leaderboard: true,
  });
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [completedCelebration, setCompletedCelebration] = useState<{
    session: WorkoutSession;
    oldStreak: number;
    newStreak: number;
    streakIncremented: boolean;
  } | null>(null);

  // Initialize Dexie database with default exercises, routines, and user profile
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        await initializeDatabaseDefaults();
        const profile = await db.user_profile.get('current_user');
        if (profile && isMounted) {
          setUserProfile(profile);
        }
      } catch (err) {
        console.warn('Database initialization note:', err);
      } finally {
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handler: Start a quick freestyle workout
  const handleStartQuickWorkout = () => {
    const newSession: WorkoutSession = {
      id: `session_${Date.now()}`,
      routine_title: isRTL ? 'تمرين حر سريع' : 'Quick Freestyle Workout',
      started_at: new Date().toISOString(),
      is_completed: false,
      sets: [],
    };
    setActiveSession(newSession);
  };

  // Handler: Start a workout session from a pre-made routine
  const handleStartRoutine = (routine: Routine) => {
    const sessionId = `session_${Date.now()}`;
    const initialSets: WorkoutSet[] = [];

    // Pre-populate sets according to routine
    for (const ex of routine.exercises) {
      const setsCount = typeof ex.target_sets === 'number' ? ex.target_sets : 3;
      for (let i = 1; i <= setsCount; i++) {
        initialSets.push({
          id: `set_${sessionId}_${ex.exercise_id}_${i}`,
          session_id: sessionId,
          exercise_id: ex.exercise_id,
          set_number: i,
          set_type: i === 1 ? 'warmup' : 'normal',
          weight_kg: 20,
          reps: parseInt(String(ex.target_reps).split('-')[0], 10) || 10,
          completed: false,
        });
      }
    }

    const newSession: WorkoutSession = {
      id: sessionId,
      routine_id: routine.id,
      routine_title: routine.title,
      started_at: new Date().toISOString(),
      is_completed: false,
      sets: initialSets,
    };
    setActiveSession(newSession);
  };

  // Handler: Finish and celebrate active workout
  const handleFinishSession = (
    completedSession: WorkoutSession,
    updatedProfile: UserProfile,
    streakIncremented: boolean
  ) => {
    const oldStreak = userProfile.streak_count;
    const newStreak = updatedProfile.streak_count;

    setUserProfile(updatedProfile);
    setActiveSession(null);

    setCompletedCelebration({
      session: completedSession,
      oldStreak,
      newStreak,
      streakIncremented,
    });
  };

  // Handler: Discard active workout
  const handleDiscardSession = () => {
    setActiveSession(null);
  };

  const handleAddWaterQuick = async (amount: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const existing = await db.water_logs.get(`water_${todayStr}`);
    const newLogItem = {
      timestamp: new Date().toISOString(),
      amount: amount,
    };

    if (existing) {
      await db.water_logs.update(`water_${todayStr}`, {
        total_ml: (existing.total_ml || 0) + amount,
        logs: [...(existing.logs || []), newLogItem],
      });
    } else {
      await db.water_logs.put({
        id: `water_${todayStr}`,
        date: todayStr,
        total_ml: amount,
        logs: [newLogItem],
      });
    }
  };

  if (!isInitialized) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4 text-center select-none"
        style={{
          backgroundColor: isDark ? '#0B0B0C' : '#F7F9F9',
          color: isDark ? '#F5F5F5' : '#111315',
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        <div className="mb-4 animate-pulse">
          <AzmLogo size="lg" showText={false} />
        </div>
        <h1 className="text-2xl font-black">{t('header.brand')}</h1>
        <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
          {isRTL ? 'جاري تهيئة منظومة عزم وقاعدة البيانات...' : 'Initializing AZM Fitness System...'}
        </p>
      </div>
    );
  }

  // Active Workout Session: Full Visual Focus Mode
  if (activeSession) {
    return (
      <ActiveWorkoutView
        session={activeSession}
        onFinishSession={handleFinishSession}
        onDiscardSession={handleDiscardSession}
        userProfile={userProfile}
      />
    );
  }

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col selection:bg-teal-500/20 transition-colors duration-200"
      style={{
        backgroundColor: colors.bgPrimary,
        color: colors.textPrimary,
      }}
    >
      {/* Offline Alert Badge */}
      <OfflineIndicator />

      {/* Top Application Header */}
      <header
        className="sticky top-0 z-30 px-4 py-2.5 select-none backdrop-blur-xl bg-[#0B0B0C]/90 border-b border-[#232328] relative overflow-hidden"
      >
        {/* Glowing magma gradient line on the bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E94B4B]/60 to-transparent pointer-events-none" />

        {/* Ambient magma glow behind logo */}
        <div className="absolute -top-6 right-0 w-36 h-20 bg-[#E94B4B]/15 blur-2xl pointer-events-none rounded-full" />

        <div className="max-w-2xl mx-auto flex items-center justify-between relative z-10">
          <div
            className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
            onClick={() => setActiveTab('dashboard')}
          >
            <AzmLogo size="sm" showText={true} />
          </div>

          {/* Quick Header Tools (Language Switcher & PWA Install) */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <PWAInstallButton />
          </div>
        </div>
      </header>

      {/* Main Views Router */}
      <main className="flex-1">
        {activeTab === 'dashboard' && (
          <DashboardView
            userProfile={userProfile}
            onNavigateTab={handleNavigateTab}
            onStartRoutine={handleStartRoutine}
            onQuickStartWorkout={handleStartQuickWorkout}
            onAddWater={handleAddWaterQuick}
          />
        )}

        {activeTab === 'workout' && (
          <WorkoutHubView
            onStartQuickWorkout={handleStartQuickWorkout}
            onStartRoutine={handleStartRoutine}
            userProfile={userProfile}
            onOpenMuscleRanks={() => setActiveTab('muscles')}
          />
        )}

        {(activeTab === 'goals' || activeTab === 'water') && (
          <GoalsView userProfile={userProfile} />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            userProfile={userProfile}
            onStartWorkoutClick={handleStartQuickWorkout}
          />
        )}

        {activeTab === 'muscles' && (
          <MuscleRanksView onSelectExerciseToTrain={() => setActiveTab('workout')} />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            userProfile={userProfile}
            onNavigateTrain={() => setActiveTab('workout')}
          />
        )}

        {activeTab === 'routines' && (
          <RoutinesView
            onStartRoutine={handleStartRoutine}
            onStartQuickWorkout={handleStartQuickWorkout}
          />
        )}

        {activeTab === 'water' && (
          <WaterTrackerView
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            onNavigateLeaderboards={() => handleNavigateTab('leaderboards')}
          />
        )}

        {activeTab === 'more' && (
          <MoreHubView
            userProfile={userProfile}
            onNavigate={handleNavigateTab}
          />
        )}

        {activeTab === 'leaderboards' && (
          <LeaderboardsView
            userProfile={userProfile}
            onBack={() => setActiveTab(previousTab === 'leaderboards' ? 'dashboard' : previousTab)}
          />
        )}

        {activeTab === 'calories' && (
          <CalorieTrackerView
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            onBack={() => setActiveTab('more')}
          />
        )}

        {activeTab === 'athletic_tools' && (
          <AthleticToolsView onBack={() => setActiveTab('more')} />
        )}
      </main>

      {/* Workout Completion Celebration Modal */}
      {completedCelebration && (
        <WorkoutCelebrationModal
          session={completedCelebration.session}
          oldStreak={completedCelebration.oldStreak}
          newStreak={completedCelebration.newStreak}
          streakIncremented={completedCelebration.streakIncremented}
          onCloseToHome={() => {
            setCompletedCelebration(null);
            setActiveTab('dashboard');
          }}
          onCloseToMuscles={() => {
            setCompletedCelebration(null);
            setActiveTab('muscles');
          }}
        />
      )}

      {/* Mobile-first Clean Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hasActiveSession={!!activeSession}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </ThemeProvider>
  );
}
