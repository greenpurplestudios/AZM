import React from 'react';
import {
  Shield,
  BarChart3,
  ListOrdered,
  Droplets,
  User,
  ChevronLeft,
} from 'lucide-react';
import { AppTab, UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';

interface MoreHubViewProps {
  userProfile: UserProfile;
  onNavigate: (tab: AppTab) => void;
}

export const MoreHubView: React.FC<MoreHubViewProps> = ({ userProfile, onNavigate }) => {
  const { isDark, colors } = useTheme();

  const menuSections = [
    {
      title: 'التدريب وتطور العضلات',
      items: [
        {
          id: 'muscles',
          title: 'رتب العضلات وخريطة القوة',
          description: 'نظام Liftoff المعتمد لحساب رتب كل عضلة وفق أفضل رفعة',
          icon: Shield,
        },
        {
          id: 'progress',
          title: 'الإحصائيات والأرقام القياسية',
          description: 'الحجم التدريبي، ونسبة الاستمرارية، وكسر الأرقام',
          icon: BarChart3,
        },
        {
          id: 'routines',
          title: 'الجداول التدريبية والتقسيمات',
          description: 'برامج Push/Pull/Legs ومولد الجداول التلقائي',
          icon: ListOrdered,
        },
      ],
    },
    {
      title: 'العادات والاستشفاء',
      items: [
        {
          id: 'water',
          title: 'الارتواء ومتابعة شرب الماء',
          description: 'سجل السوائل اليومي وهدفك المحسوب لوزن جسمك',
          icon: Droplets,
        },
        {
          id: 'profile',
          title: 'الملف الشخصي والمعدات',
          description: 'الوزن، وسلسلة الأيام، والمعدات المتاحة في صالتك',
          icon: User,
        },
      ],
    },
  ];

  return (
    <div
      id="azm-more-hub-view"
      className="p-4 sm:p-6 max-w-xl mx-auto space-y-7 pb-28 text-right select-none transition-colors duration-200"
    >
      {/* 1. Header */}
      <div className="space-y-1">
        <span
          className="text-xs font-semibold uppercase tracking-wider block"
          style={{ color: colors.textMuted }}
        >
          المزيد • Options & Hub
        </span>
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: colors.textPrimary }}
        >
          المزيد والخيارات
        </h1>
      </div>

      {/* Navigation Sections */}
      {menuSections.map((section, sIdx) => (
        <div key={sIdx} className="space-y-2">
          <h2
            className="text-xs font-semibold uppercase tracking-wider px-1"
            style={{ color: colors.textMuted }}
          >
            {section.title}
          </h2>

          <div
            className="rounded-2xl border divide-y overflow-hidden transition-colors"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as AppTab)}
                  className="w-full p-4 flex items-center justify-between text-right hover:opacity-85 transition-opacity active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: isDark ? '#1D1D20' : '#F0F4F4',
                        borderColor: colors.border,
                        color: colors.accent,
                      }}
                    >
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div>
                      <h4
                        className="text-sm font-semibold"
                        style={{ color: colors.textPrimary }}
                      >
                        {item.title}
                      </h4>
                      <p
                        className="text-xs mt-0.5 line-clamp-1"
                        style={{ color: colors.textSecondary }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ChevronLeft
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: colors.textMuted }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
