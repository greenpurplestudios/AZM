import React from 'react';
import { Home, Dumbbell, CheckSquare, Calendar, MoreHorizontal } from 'lucide-react';
import { AppTab } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  hasActiveSession: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  hasActiveSession,
}) => {
  const { isDark, colors } = useTheme();
  const { isRTL, t } = useLanguage();

  const tabs: {
    id: AppTab;
    labelKey: string;
    fallback: string;
    icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
    badge?: string;
  }[] = [
    {
      id: 'dashboard',
      labelKey: 'nav.home',
      fallback: isRTL ? 'الرئيسية' : 'Home',
      icon: Home,
    },
    {
      id: 'workout',
      labelKey: 'nav.workout',
      fallback: isRTL ? 'التمرين' : 'Training',
      icon: Dumbbell,
      badge: hasActiveSession ? t('nav.active', 'نشط') : undefined,
    },
    {
      id: 'goals',
      labelKey: 'nav.goals',
      fallback: isRTL ? 'الأهداف' : 'Goals',
      icon: CheckSquare,
    },
    {
      id: 'calendar',
      labelKey: 'nav.calendar',
      fallback: isRTL ? 'التقويم' : 'Calendar',
      icon: Calendar,
    },
    {
      id: 'more',
      labelKey: 'nav.more',
      fallback: isRTL ? 'المزيد' : 'More',
      icon: MoreHorizontal,
    },
  ];

  // Map sub-tabs to their parent tab in bottom nav
  const isSelected = (tabId: AppTab) => {
    if (activeTab === tabId) return true;
    if (
      tabId === 'more' &&
      [
        'muscles',
        'progress',
        'routines',
        'water',
        'profile',
        'leaderboards',
        'calories',
        'athletic_tools',
      ].includes(activeTab)
    ) {
      return true;
    }
    return false;
  };

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 inset-x-0 z-40 px-3 py-2 select-none transition-colors duration-200"
      style={{
        backgroundColor: isDark ? '#0B0B0C' : '#FFFFFF',
        borderTop: `1px solid ${colors.border}`,
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isSelected(tab.id);

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="relative flex flex-col items-center justify-center py-1 rounded-xl transition-colors duration-150 active:scale-95"
              style={{
                color: active ? colors.accent : colors.textSecondary,
              }}
            >
              <div className="relative">
                <Icon
                  className="w-5 h-5 transition-transform"
                  style={{
                    strokeWidth: active ? 2.5 : 2,
                  }}
                />
                {tab.badge && (
                  <span
                    className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-mono font-bold text-white animate-pulse"
                    style={{ backgroundColor: colors.accent }}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className="text-[11px] mt-1 font-bold tracking-tight"
                style={{
                  color: active ? colors.textPrimary : colors.textSecondary,
                }}
              >
                {t(tab.labelKey, tab.fallback)}
              </span>

              {active && (
                <div
                  className="w-1.5 h-1.5 rounded-full mt-0.5"
                  style={{ backgroundColor: colors.accent }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
