import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, toggleLanguage } = useLanguage();
  const { colors, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold transition-all hover:opacity-85 active:scale-95 shadow-xs"
      style={{
        backgroundColor: isDark ? '#141417' : '#F8FAFA',
        borderColor: colors.border,
        color: colors.textPrimary,
      }}
      title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
    >
      <Globe className="w-3.5 h-3.5" style={{ color: colors.accent }} />
      <span>{language === 'ar' ? 'English' : 'العربية'}</span>
    </button>
  );
};
