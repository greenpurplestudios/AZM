import React from 'react';
import { Home, Dumbbell, CheckSquare, Calendar, MoreHorizontal } from 'lucide-react';
import { AppTab } from '../types';
import { useTheme } from '../context/ThemeContext';

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

  const tabs: {
    id: AppTab;
    label: string;
    icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
    badge?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'الرئيسية',
      icon: Home,
    },
    {
      id: 'workout',
      label: 'الجيم',
      icon: Dumbbell,
      badge: hasActiveSession ? 'نشط' : undefined,
    },
    {
      id: 'goals',
      label: 'الأهداف',
      icon: CheckSquare,
    },
    {
      id: 'calendar',
      label: 'التقويم',
      icon: Calendar,
    },
    {
      id: 'more',
      label: 'المزيد',
      icon: MoreHorizontal,
    },
  ];

  // Map sub-tabs to their parent tab in bottom nav
  const isSelected = (tabId: AppTab) => {
    if (activeTab === tabId) return true;
    if (tabId === 'more' && ['muscles', 'progress', 'routines', 'water', 'profile'].includes(activeTab)) {
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
                className="text-[11px] mt-1 font-medium tracking-tight"
                style={{
                  fontWeight: active ? 700 : 500,
                  color: active ? colors.accent : colors.textMuted,
                }}
              >
                {tab.label}
              </span>

              {active && (
                <span
                  className="absolute -bottom-1 w-3 h-0.5 rounded-full"
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
