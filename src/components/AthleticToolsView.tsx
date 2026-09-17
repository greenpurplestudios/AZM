import React from 'react';
import { AthleticToolsSection } from './AthleticToolsSection';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, ArrowLeft, Timer } from 'lucide-react';

interface AthleticToolsViewProps {
  onBack: () => void;
}

export const AthleticToolsView: React.FC<AthleticToolsViewProps> = ({ onBack }) => {
  const { colors, isDark } = useTheme();
  const { isRTL, t } = useLanguage();

  return (
    <div
      id="athletic-tools-view"
      className="p-4 sm:p-6 max-w-xl mx-auto space-y-6 pb-36 text-right select-none transition-colors duration-200"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Header */}
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
              {isRTL ? 'الأدوات الرياضية' : 'Athletic Tools'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black" style={{ color: colors.textPrimary }}>
              {t('more.alarm_tools')}
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
          <Timer className="w-5 h-5" />
        </div>
      </div>

      {/* Athletic Tools Component */}
      <AthleticToolsSection />
    </div>
  );
};
