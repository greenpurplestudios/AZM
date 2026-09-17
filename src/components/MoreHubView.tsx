import React from 'react';
import {
  Timer,
  User,
  Trophy,
  Flame,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AppTab, UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface MoreHubViewProps {
  userProfile: UserProfile;
  onNavigate: (tab: AppTab) => void;
}

export const MoreHubView: React.FC<MoreHubViewProps> = ({ userProfile, onNavigate }) => {
  const { isDark, colors } = useTheme();
  const { isRTL, language, t } = useLanguage();

  const fourHubItems = [
    {
      id: 'athletic_tools' as AppTab,
      title: language === 'ar' ? 'المنبه وساعة الإيقاف والمؤقت' : 'Alarm / Stopwatch / Timer',
      description:
        language === 'ar'
          ? 'أدوات التوقيت الرياضي، مؤقت الراحة التنازلي، ومنبهات التمرين والارتواء'
          : 'Athletic stopwatch, rest countdown timer, and workout alarm alerts',
      icon: Timer,
      badge: language === 'ar' ? 'مؤقت وساعة' : 'Timer & Alarm',
    },
    {
      id: 'profile' as AppTab,
      title: language === 'ar' ? 'الملف الشخصي والإعدادات' : 'Profile & Settings',
      description:
        language === 'ar'
          ? 'البيانات الرياضية، وزن الجسم، إعدادات الخصوصية، والعتاد التدريبي'
          : 'Biometrics, body weight, privacy settings, and training equipment',
      icon: User,
      badge: language === 'ar' ? 'الحساب والمعدات' : 'Account & Gear',
    },
    {
      id: 'leaderboards' as AppTab,
      title: language === 'ar' ? 'لوائح الصدارة' : 'Leaderboards',
      description:
        language === 'ar'
          ? 'تصنيفات المشتركين، أطول سلاسل الالتزام، وأفضل الأرقام القياسية'
          : 'Athlete rankings, consistency streaks, and verified personal records',
      icon: Trophy,
      badge: language === 'ar' ? 'التصنيف والتنافس' : 'Rankings',
    },
    {
      id: 'calories' as AppTab,
      title: language === 'ar' ? 'حاسبة السعرات' : 'Calorie Calculator',
      description:
        language === 'ar'
          ? 'حساب الاحتياج اليومي من السعرات والماكروز وتتبع الوجبات بدقة'
          : 'Daily caloric expenditure, macronutrient targets, and meal logging',
      icon: Flame,
      badge: language === 'ar' ? 'السعرات والماكروز' : 'Calories & Macros',
    },
  ];

  return (
    <div
      id="azm-more-hub-view"
      className="p-4 sm:p-6 max-w-xl mx-auto space-y-6 pb-36 select-none transition-colors duration-200"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="space-y-1 pb-3 border-b" style={{ borderColor: colors.border }}>
        <span
          className="text-xs font-mono font-bold uppercase tracking-wider block text-start"
          style={{ color: colors.accent }}
        >
          {t('more.title')}
        </span>
        <h1
          className="text-2xl sm:text-3xl font-black tracking-tight text-start"
          style={{ color: colors.textPrimary }}
        >
          {language === 'ar' ? 'المزيد' : 'More'}
        </h1>
        <p className="text-xs text-start" style={{ color: colors.textSecondary }}>
          {language === 'ar'
            ? 'الأدوات والخيارات الإضافية لتجربة تدريبية متكاملة'
            : 'Essential tools and settings for a complete athletic experience'}
        </p>
      </div>

      {/* The 4 Exclusive Intentional Cards */}
      <div className="space-y-3.5 pt-1">
        {fourHubItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full p-4 sm:p-5 rounded-3xl border flex items-center justify-between transition-all duration-200 hover:shadow-md active:scale-[0.98] group"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
            >
              <div className="flex items-center gap-4 text-start">
                {/* Icon Box */}
                <div
                  className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: isDark ? '#141417' : '#F0FDF4',
                    borderColor: colors.border,
                    color: colors.accent,
                  }}
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>

                {/* Texts */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className="text-sm sm:text-base font-black tracking-tight"
                      style={{ color: colors.textPrimary }}
                    >
                      {item.title}
                    </h3>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold border hidden sm:inline-block"
                      style={{
                        borderColor: colors.border,
                        backgroundColor: isDark ? '#161619' : '#F4F7F7',
                        color: colors.textMuted,
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <p
                    className="text-xs leading-relaxed max-w-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Direction Arrow */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border opacity-70 group-hover:opacity-100 transition-opacity"
                style={{
                  borderColor: colors.border,
                  backgroundColor: isDark ? '#141417' : '#F8FAFA',
                  color: colors.textSecondary,
                }}
              >
                {isRTL ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
