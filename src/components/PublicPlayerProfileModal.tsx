import React from 'react';
import { LeaderboardPlayer } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Flame,
  CheckCircle2,
  Trophy,
  Dumbbell,
  User,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

interface PublicPlayerProfileModalProps {
  player: LeaderboardPlayer;
  onClose: () => void;
}

export const PublicPlayerProfileModal: React.FC<PublicPlayerProfileModalProps> = ({
  player,
  onClose,
}) => {
  const { isDark, colors } = useTheme();
  const { isRTL, t } = useLanguage();

  const prList = [
    {
      key: 'bench',
      name_ar: 'ضغط البنش',
      name_en: 'Bench Press',
      val: player.prs.bench_press_kg,
      unit_ar: 'كجم',
      unit_en: 'kg',
    },
    {
      key: 'deadlift',
      name_ar: 'الديدلفت',
      name_en: 'Deadlift',
      val: player.prs.deadlift_kg,
      unit_ar: 'كجم',
      unit_en: 'kg',
    },
    {
      key: 'squat',
      name_ar: 'السكوات',
      name_en: 'Squat',
      val: player.prs.squat_kg,
      unit_ar: 'كجم',
      unit_en: 'kg',
    },
    {
      key: 'pushup',
      name_ar: 'تمرين الضغط',
      name_en: 'Push-Up',
      val: player.prs.push_up_reps,
      unit_ar: 'تكرار',
      unit_en: 'reps',
    },
    {
      key: 'pullup',
      name_ar: 'تمرين العقلة',
      name_en: 'Pull-Up',
      val: player.prs.pull_up_reps,
      unit_ar: 'تكرار',
      unit_en: 'reps',
    },
  ].filter((item) => item.val !== undefined && item.val > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border p-6 space-y-6 shadow-2xl relative transition-all"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          color: colors.textPrimary,
          direction: isRTL ? 'rtl' : 'ltr',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Back/Close button */}
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: colors.border }}>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition hover:opacity-80 active:scale-95"
            style={{
              borderColor: colors.border,
              backgroundColor: isDark ? '#1a1a1f' : '#f4f7f6',
              color: colors.textPrimary,
            }}
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{t('common.back')}</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs font-mono font-bold" style={{ color: colors.accent }}>
            <ShieldCheck className="w-4 h-4" />
            <span>{t('public_profile.title')}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl transition hover:opacity-70"
            style={{ color: colors.textSecondary }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Player Identity (Avatar, Name, Username, Bio) */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            {player.avatar_url ? (
              <img
                src={player.avatar_url}
                alt={player.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover border-2 shadow-md"
                style={{ borderColor: colors.accent }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center font-black text-xl border-2 text-white"
                style={{ backgroundColor: colors.accent, borderColor: colors.border }}
              >
                {player.name.slice(0, 2)}
              </div>
            )}
            {player.is_current_user && (
              <span
                className="absolute -bottom-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-white shadow-xs"
                style={{ backgroundColor: colors.accent }}
              >
                {isRTL ? 'أنت' : 'YOU'}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-lg font-black" style={{ color: colors.textPrimary }}>
              {player.name}
            </h3>
            <p className="text-xs font-mono" style={{ color: colors.textMuted }}>
              @{player.username}
            </p>
          </div>

          {player.bio && (
            <p
              className="text-xs leading-relaxed max-w-xs p-3 rounded-2xl border"
              style={{
                backgroundColor: isDark ? '#141417' : '#F8FAFA',
                borderColor: colors.border,
                color: colors.textSecondary,
              }}
            >
              {player.bio}
            </p>
          )}
        </div>

        {/* Key Stats Cards (Best Streak, Consistency Rate) */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="p-3.5 rounded-2xl border space-y-1 text-center"
            style={{
              backgroundColor: isDark ? '#141417' : '#F8FAFA',
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold" style={{ color: colors.accent }}>
              <Flame className="w-4 h-4" />
              <span>{t('public_profile.best_streak')}</span>
            </div>
            <div className="text-2xl font-black font-mono" style={{ color: colors.textPrimary }}>
              {player.best_streak}{' '}
              <span className="text-xs font-normal" style={{ color: colors.textSecondary }}>
                {t('public_profile.days')}
              </span>
            </div>
            <p className="text-[10px]" style={{ color: colors.textMuted }}>
              {isRTL ? `سلسلة حالية: ${player.current_streak} يوم` : `Current: ${player.current_streak} days`}
            </p>
          </div>

          <div
            className="p-3.5 rounded-2xl border space-y-1 text-center"
            style={{
              backgroundColor: isDark ? '#141417' : '#F8FAFA',
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold" style={{ color: colors.accent }}>
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('public_profile.consistency')}</span>
            </div>
            <div className="text-2xl font-black font-mono" style={{ color: colors.textPrimary }}>
              {player.consistency_percentage}%
            </div>
            <p className="text-[10px]" style={{ color: colors.textMuted }}>
              {isRTL ? `${player.consistency_days} يوم مكتمل` : `${player.consistency_days} completed days`}
            </p>
          </div>
        </div>

        {/* Personal Records List */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: colors.textPrimary }}>
            <Trophy className="w-4 h-4" style={{ color: colors.accent }} />
            <span>{t('public_profile.personal_records')}</span>
          </div>

          {prList.length === 0 ? (
            <p className="text-xs text-center py-4" style={{ color: colors.textMuted }}>
              {t('public_profile.no_prs')}
            </p>
          ) : (
            <div className="space-y-1.5">
              {prList.map((pr) => (
                <div
                  key={pr.key}
                  className="flex items-center justify-between p-2.5 rounded-xl border text-xs"
                  style={{
                    backgroundColor: isDark ? '#141417' : '#F8FAFA',
                    borderColor: colors.border,
                  }}
                >
                  <span className="font-bold" style={{ color: colors.textPrimary }}>
                    {isRTL ? pr.name_ar : pr.name_en}
                  </span>
                  <span className="font-mono font-black" style={{ color: colors.accent }}>
                    {pr.val} {isRTL ? pr.unit_ar : pr.unit_en}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
