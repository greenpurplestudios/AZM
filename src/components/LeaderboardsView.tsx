import React, { useState, useEffect } from 'react';
import { UserProfile, LeaderboardPlayer, PRCategory } from '../types';
import { db } from '../db/dexie';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { COMMUNITY_LEADERBOARD_PLAYERS } from '../data/mockLeaderboardData';
import { PublicPlayerProfileModal } from './PublicPlayerProfileModal';
import {
  Trophy,
  Flame,
  Dumbbell,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Shield,
  Medal,
} from 'lucide-react';

interface LeaderboardsViewProps {
  userProfile: UserProfile;
  onBack: () => void;
}

export const LeaderboardsView: React.FC<LeaderboardsViewProps> = ({
  userProfile,
  onBack,
}) => {
  const { isDark, colors } = useTheme();
  const { isRTL, t } = useLanguage();

  const [mainTab, setMainTab] = useState<'consistency' | 'prs'>('consistency');
  const [prCategory, setPrCategory] = useState<PRCategory>('bench_press');
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardPlayer | null>(null);

  // Dynamic user stats loaded from DB
  const [userPRs, setUserPRs] = useState<{
    bench_press_kg?: number;
    deadlift_kg?: number;
    squat_kg?: number;
    push_up_reps?: number;
    pull_up_reps?: number;
  }>({});
  const [userConsistencyStats, setUserConsistencyStats] = useState({
    consistency_days: 0,
    consistency_percentage: 0,
    best_streak: userProfile.streak_count || 0,
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const prs = await db.personal_records.toArray();
        const bestLifts = await db.best_lifts.toArray();
        const objectives = await db.daily_objectives.toArray();
        const waterLogs = await db.water_logs.toArray();

        // Calculate user PRs
        let bench: number | undefined;
        let deadlift: number | undefined;
        let squat: number | undefined;
        let pushups: number | undefined;
        let pullups: number | undefined;

        // Check best_lifts
        bestLifts.forEach((b) => {
          const name = b.exercise_name.toLowerCase();
          if (name.includes('bench') || name.includes('بنش') || b.muscle_id === 'chest') {
            bench = Math.max(bench || 0, b.weight_kg);
          } else if (name.includes('deadlift') || name.includes('ديدلفت') || b.muscle_id === 'hamstrings') {
            deadlift = Math.max(deadlift || 0, b.weight_kg);
          } else if (name.includes('squat') || name.includes('سكوات') || b.muscle_id === 'quads') {
            squat = Math.max(squat || 0, b.weight_kg);
          }
        });

        // Check personal_records table
        prs.forEach((p) => {
          const exId = p.exercise_id?.toLowerCase() || '';
          if (exId.includes('bench') || exId.includes('بنش')) {
            bench = Math.max(bench || 0, p.weight_kg);
          } else if (exId.includes('deadlift') || exId.includes('ديدلفت')) {
            deadlift = Math.max(deadlift || 0, p.weight_kg);
          } else if (exId.includes('squat') || exId.includes('سكوات')) {
            squat = Math.max(squat || 0, p.weight_kg);
          } else if (exId.includes('push') || exId.includes('ضغط')) {
            pushups = Math.max(pushups || 0, p.reps || Math.round(p.weight_kg));
          } else if (exId.includes('pull') || exId.includes('عقلة')) {
            pullups = Math.max(pullups || 0, p.reps || Math.round(p.weight_kg));
          }
        });

        // Strictly actual logged numbers
        setUserPRs({
          bench_press_kg: bench || 0,
          deadlift_kg: deadlift || 0,
          squat_kg: squat || 0,
          push_up_reps: pushups || 0,
          pull_up_reps: pullups || 0,
        });

        // Calculate consistency from completed days with water + objectives
        const daysWithWater = new Set(
          waterLogs.filter((w) => w.total_ml >= (userProfile.daily_water_target_ml || 2500)).map((w) => w.date)
        );
        const daysWithObjectives = new Set(
          objectives.filter((o) => o.completed).map((o) => o.date)
        );

        let sharedDays = 0;
        daysWithWater.forEach((date) => {
          if (daysWithObjectives.has(date)) sharedDays++;
        });

        const completedDays = sharedDays > 0 ? sharedDays : (userProfile.streak_count || 0);
        const rate = completedDays > 0 ? 100 : (userProfile.streak_count > 0 ? 100 : 0);

        setUserConsistencyStats({
          consistency_days: completedDays,
          consistency_percentage: rate,
          best_streak: Math.max(userProfile.streak_count || 0, completedDays),
        });
      } catch (e) {
        console.error('Error loading leaderboard data:', e);
      }
    };

    loadUserData();
  }, [userProfile]);

  // Current user representation
  const currentUserPlayer: LeaderboardPlayer = {
    id: 'current_user',
    name: userProfile.name || (isRTL ? 'البطل' : 'Athlete'),
    username: (userProfile.name || 'athlete').toLowerCase().replace(/\s+/g, '_'),
    avatar_url: userProfile.avatar_url,
    bio: userProfile.bio || (isRTL ? 'بطل في منظومة عزم الرياضية.' : 'AZM fitness athlete.'),
    best_streak: userConsistencyStats.best_streak,
    current_streak: userProfile.streak_count || 1,
    consistency_days: userConsistencyStats.consistency_days,
    consistency_percentage: userConsistencyStats.consistency_percentage,
    prs: userPRs,
    is_current_user: true,
  };

  // Build Consistency leaderboard list
  const consistencyList: LeaderboardPlayer[] = [
    ...COMMUNITY_LEADERBOARD_PLAYERS,
    ...(userProfile.show_in_leaderboard !== false ? [currentUserPlayer] : []),
  ].sort((a, b) => b.consistency_days - a.consistency_days || b.best_streak - a.best_streak);

  // Build PR leaderboard list for selected exercise
  const prKeyMap: Record<PRCategory, keyof LeaderboardPlayer['prs']> = {
    bench_press: 'bench_press_kg',
    deadlift: 'deadlift_kg',
    squat: 'squat_kg',
    push_up: 'push_up_reps',
    pull_up: 'pull_up_reps',
  };

  const activePRKey = prKeyMap[prCategory];

  const prList: LeaderboardPlayer[] = [
    ...COMMUNITY_LEADERBOARD_PLAYERS,
    ...(userProfile.show_in_leaderboard !== false ? [currentUserPlayer] : []),
  ].sort((a, b) => {
    const valA = a.prs[activePRKey] || 0;
    const valB = b.prs[activePRKey] || 0;
    return valB - valA;
  });

  const currentUserConsistencyRank = consistencyList.findIndex((p) => p.is_current_user) + 1;
  const currentUserPRRank = prList.findIndex((p) => p.is_current_user) + 1;

  const prCategoriesList: { id: PRCategory; label_ar: string; label_en: string; unit_ar: string; unit_en: string }[] = [
    { id: 'bench_press', label_ar: 'ضغط البنش', label_en: 'Bench Press', unit_ar: 'كجم', unit_en: 'kg' },
    { id: 'deadlift', label_ar: 'الديدلفت', label_en: 'Deadlift', unit_ar: 'كجم', unit_en: 'kg' },
    { id: 'squat', label_ar: 'السكوات', label_en: 'Squat', unit_ar: 'كجم', unit_en: 'kg' },
    { id: 'push_up', label_ar: 'تمارين الضغط', label_en: 'Push-Up', unit_ar: 'تكرار', unit_en: 'reps' },
    { id: 'pull_up', label_ar: 'العقلة', label_en: 'Pull-Up', unit_ar: 'تكرار', unit_en: 'reps' },
  ];

  const currentUnitAr = prCategoriesList.find((p) => p.id === prCategory)?.unit_ar || 'كجم';
  const currentUnitEn = prCategoriesList.find((p) => p.id === prCategory)?.unit_en || 'kg';

  return (
    <div
      id="leaderboards-view"
      className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6 pb-36 text-right select-none transition-colors duration-200"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Header with Back button */}
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: colors.border }}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition hover:opacity-80 active:scale-95"
            style={{
              borderColor: colors.border,
              backgroundColor: isDark ? '#141417' : '#F8FAFA',
              color: colors.textPrimary,
            }}
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{t('common.back')}</span>
          </button>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: colors.accent }}>
              {t('leaderboards.title')}
            </span>
            <h2 className="text-xl sm:text-2xl font-black" style={{ color: colors.textPrimary }}>
              {isRTL ? 'لوائح الصدارة والتحدي' : 'Athletic Leaderboards'}
            </h2>
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs"
          style={{
            backgroundColor: isDark ? '#1a1a1f' : '#f0fdfa',
            borderColor: colors.border,
            color: colors.accent,
          }}
        >
          <Trophy className="w-5 h-5" />
        </div>
      </div>

      {/* Main Category Tabs: Consistency vs PR */}
      <div
        className="grid grid-cols-2 p-1.5 rounded-2xl border"
        style={{
          backgroundColor: isDark ? '#141417' : '#F8FAFA',
          borderColor: colors.border,
        }}
      >
        <button
          type="button"
          onClick={() => setMainTab('consistency')}
          className="py-2.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2"
          style={{
            backgroundColor: mainTab === 'consistency' ? colors.card : 'transparent',
            color: mainTab === 'consistency' ? colors.accent : colors.textSecondary,
            boxShadow: mainTab === 'consistency' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          <Flame className="w-4 h-4" />
          <span>{t('leaderboards.tab_consistency')}</span>
        </button>

        <button
          type="button"
          onClick={() => setMainTab('prs')}
          className="py-2.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2"
          style={{
            backgroundColor: mainTab === 'prs' ? colors.card : 'transparent',
            color: mainTab === 'prs' ? colors.accent : colors.textSecondary,
            boxShadow: mainTab === 'prs' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          <Dumbbell className="w-4 h-4" />
          <span>{t('leaderboards.tab_prs')}</span>
        </button>
      </div>

      {/* If PR tab, show the 5 exercise category chips */}
      {mainTab === 'prs' && (
        <div className="space-y-2">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {prCategoriesList.map((cat) => {
              const isSelected = prCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setPrCategory(cat.id)}
                  className="px-3 py-2 rounded-xl border text-xs font-bold whitespace-nowrap transition active:scale-95 flex items-center gap-1.5 shrink-0"
                  style={{
                    backgroundColor: isSelected
                      ? isDark
                        ? '#222228'
                        : '#F0F9F8'
                      : colors.card,
                    borderColor: isSelected ? colors.accent : colors.border,
                    color: isSelected ? colors.accent : colors.textSecondary,
                  }}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{isRTL ? cat.label_ar : cat.label_en}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Banner on Scoring */}
      <div
        className="p-3.5 rounded-2xl border text-xs leading-relaxed flex items-start gap-2.5"
        style={{
          backgroundColor: isDark ? '#16161a' : '#F7FAFC',
          borderColor: colors.border,
          color: colors.textSecondary,
        }}
      >
        <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: colors.accent }} />
        <div>
          {mainTab === 'consistency' ? (
            <p>
              {isRTL
                ? 'تحتسب الاستمرارية بشفافية تامة: إتمام كامل الأهداف اليومية (100%) + تحقيق هدف شرب الماء اليومي. اضغط على أي لاعب لعرض ملفه الرياضي.'
                : 'Consistency is scored transparently: 100% daily goals completed + water target reached. Tap any player to view their public athletic profile.'}
            </p>
          ) : (
            <p>
              {isRTL
                ? `ترتيب القوة في ${prCategoriesList.find((c) => c.id === prCategory)?.label_ar}: يتم تحديث أرقامك القياسية تلقائياً عند تسجيل جلسات تمرينك في عزم.`
                : `Power ranking in ${prCategoriesList.find((c) => c.id === prCategory)?.label_en}: Your rank automatically updates whenever you log personal records in AZM.`}
            </p>
          )}
        </div>
      </div>

      {/* Players Ranking List */}
      {((mainTab === 'consistency' ? consistencyList : prList).length === 0) ? (
        <div
          className="p-8 sm:p-12 rounded-2xl border text-center space-y-3 shadow-xs"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border"
            style={{
              backgroundColor: isDark ? '#1a1a20' : '#f0fdfa',
              borderColor: colors.border,
              color: colors.accent,
            }}
          >
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-sm sm:text-base font-black" style={{ color: colors.textPrimary }}>
            {isRTL ? 'لوائح الصدارة فارغة حالياً' : 'Leaderboards are Currently Empty'}
          </h3>
          <p className="text-xs max-w-md mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>
            {isRTL
              ? 'لا يوجد لاعبون مسجلون في لوائح الصدارة حالياً. ستظهر قوائم المنافسين وترتيب المتصدرين هنا تلقائياً عند انضمام لاعبين حقيقيين وتسجيل أرقامهم وإنجازاتهم.'
              : 'No players have appeared on the leaderboards yet. Rankings will appear here once actual athletes join and record their achievements.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {(mainTab === 'consistency' ? consistencyList : prList).map((player, index) => {
            const rank = index + 1;
            const isUser = player.is_current_user;
            const scoreValue =
              mainTab === 'consistency'
                ? player.consistency_days
                : player.prs[activePRKey] || 0;

            return (
              <div
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
                className="p-3.5 rounded-2xl border flex items-center justify-between transition active:scale-[0.99] cursor-pointer hover:shadow-xs"
                style={{
                  backgroundColor: isUser
                    ? isDark
                      ? '#1f2227'
                      : '#edf8f6'
                    : colors.card,
                  borderColor: isUser ? colors.accent : colors.border,
                }}
              >
                {/* Rank Badge + Avatar + Names */}
                <div className="flex items-center gap-3">
                  {/* Rank Number / Medal */}
                  <div
                    className="w-8 h-8 rounded-xl font-mono font-black text-sm flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor:
                        rank === 1
                          ? '#FEF3C7'
                          : rank === 2
                          ? '#F3F4F6'
                          : rank === 3
                          ? '#FFEDD5'
                          : isDark
                          ? '#17171b'
                          : '#f9fafb',
                      color:
                        rank === 1
                          ? '#D97706'
                          : rank === 2
                          ? '#4B5563'
                          : rank === 3
                          ? '#C2410C'
                          : colors.textSecondary,
                      borderColor:
                        rank <= 3
                          ? 'rgba(0,0,0,0.1)'
                          : colors.border,
                    }}
                  >
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                  </div>

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {player.avatar_url ? (
                      <img
                        src={player.avatar_url}
                        alt={player.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border"
                        style={{ borderColor: isUser ? colors.accent : colors.border }}
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs border text-white"
                        style={{ backgroundColor: colors.accent, borderColor: colors.border }}
                      >
                        {player.name.slice(0, 2)}
                      </div>
                    )}
                  </div>

                  {/* Name and Handle */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black" style={{ color: colors.textPrimary }}>
                        {player.name}
                      </span>
                      {isUser && (
                        <span
                          className="px-1.5 py-0.2 rounded-md text-[9px] font-bold text-white uppercase"
                          style={{ backgroundColor: colors.accent }}
                        >
                          {isRTL ? 'أنت' : 'YOU'}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono block" style={{ color: colors.textMuted }}>
                      @{player.username}
                    </span>
                  </div>
                </div>

                {/* Score / PR Value */}
                <div className="flex items-center gap-3">
                  <div className="text-left font-mono space-y-0.5" style={{ direction: 'ltr' }}>
                    <div className="text-base font-black" style={{ color: isUser ? colors.accent : colors.textPrimary }}>
                      {scoreValue}{' '}
                      <span className="text-xs font-normal" style={{ color: colors.textSecondary }}>
                        {mainTab === 'consistency'
                          ? isRTL
                            ? 'يوم'
                            : 'days'
                          : isRTL
                          ? currentUnitAr
                          : currentUnitEn}
                      </span>
                    </div>
                    {mainTab === 'consistency' && (
                      <span className="text-[10px] font-bold block" style={{ color: colors.accent }}>
                        {player.consistency_percentage}% {isRTL ? 'التزام' : 'rate'}
                      </span>
                    )}
                  </div>

                  {isRTL ? (
                    <ChevronLeft className="w-4 h-4" style={{ color: colors.textMuted }} />
                  ) : (
                    <ChevronRight className="w-4 h-4" style={{ color: colors.textMuted }} />
                  )}
                </div>
              </div>
            );
          })}

          {/* If the current user is currently the only active athlete */}
          {(mainTab === 'consistency' ? consistencyList : prList).length === 1 &&
            (mainTab === 'consistency' ? consistencyList : prList)[0].is_current_user && (
              <div
                className="p-4 rounded-2xl border text-center space-y-1 mt-3"
                style={{
                  backgroundColor: isDark ? '#141418' : '#F9FBFA',
                  borderColor: colors.border,
                }}
              >
                <p className="text-xs font-bold" style={{ color: colors.accent }}>
                  {isRTL ? 'أنت اللاعب الوحيد المسجل حالياً في لوائح الصدارة' : 'You are currently the only player registered'}
                </p>
                <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                  {isRTL
                    ? 'ستظهر مراكز المنافسين الآخرين فور انضمام لاعبين حقيقيين وتسجيل أرقامهم.'
                    : 'Other competitors will appear here once actual athletes join and log their records.'}
                </p>
              </div>
            )}
        </div>
      )}

      {/* Sticky Bottom Bar Showing User's Own Rank */}
      {userProfile.show_in_leaderboard !== false &&
        (mainTab === 'consistency' ? consistencyList : prList).length > 0 &&
        (mainTab === 'consistency' ? currentUserConsistencyRank > 0 : currentUserPRRank > 0) && (
        <div
          className="fixed bottom-16 inset-x-0 mx-auto max-w-xl p-3 px-4 rounded-2xl border shadow-xl flex items-center justify-between z-30 transition-all"
          style={{
            backgroundColor: isDark ? '#1a1a20' : '#ffffff',
            borderColor: colors.accent,
            direction: isRTL ? 'rtl' : 'ltr',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl font-mono font-black text-sm flex items-center justify-center text-white"
              style={{ backgroundColor: colors.accent }}
            >
              #{mainTab === 'consistency' ? currentUserConsistencyRank : currentUserPRRank}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: colors.textMuted }}>
                {t('leaderboards.your_rank')}
              </span>
              <span className="text-xs font-black" style={{ color: colors.textPrimary }}>
                {userProfile.name || (isRTL ? 'أنت' : 'You')}
              </span>
            </div>
          </div>

          <button
            onClick={() => setSelectedPlayer(currentUserPlayer)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border transition hover:opacity-80 active:scale-95"
            style={{
              borderColor: colors.border,
              backgroundColor: isDark ? '#23232a' : '#f0fdfa',
              color: colors.accent,
            }}
          >
            {t('leaderboards.view_profile')}
          </button>
        </div>
      )}

      {/* Modal for Public Profile */}
      {selectedPlayer && (
        <PublicPlayerProfileModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
};
