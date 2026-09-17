import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme, ThemeMode } from '../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'compact' | 'segmented';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'compact', className = '' }) => {
  const { themeMode, isDark, setThemeMode, toggleTheme } = useTheme();

  if (variant === 'segmented') {
    const modes: { id: ThemeMode; label: string; icon: React.FC<{ className?: string }> }[] = [
      { id: 'light', label: 'نهاري', icon: Sun },
      { id: 'dark', label: 'ليلي', icon: Moon },
      { id: 'system', label: 'تلقائي', icon: Laptop },
    ];

    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl border text-xs font-semibold select-none ${
          isDark
            ? 'bg-[#111113] border-[#29292D] text-[#A1A1A6]'
            : 'bg-[#F0F4F4] border-[#DDE4E4] text-[#687274]'
        } ${className}`}
      >
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = themeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setThemeMode(mode.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-semibold ${
                isSelected
                  ? isDark
                    ? 'bg-[#171719] text-[#F5F5F5] shadow-xs border border-[#29292D]'
                    : 'bg-[#FFFFFF] text-[#111315] shadow-xs border border-[#DDE4E4]'
                  : 'hover:opacity-80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? (isDark ? 'text-[#E94B4B]' : 'text-[#35C9B8]') : ''}`} />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default compact icon button
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
        isDark
          ? 'bg-[#171719] border-[#29292D] text-[#F5F5F5] hover:border-[#E94B4B]/40 active:scale-95'
          : 'bg-[#FFFFFF] border-[#DDE4E4] text-[#111315] hover:border-[#35C9B8]/40 active:scale-95'
      } ${className}`}
      title={isDark ? 'التبديل إلى النمط النهاري (Teal / Mint)' : 'التبديل إلى النمط الليلي (Minimal Red)'}
      aria-label="تبديل المظهر"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#F5F5F5] hover:text-[#E94B4B] transition-colors" />
      ) : (
        <Moon className="w-4 h-4 text-[#111315] hover:text-[#35C9B8] transition-colors" />
      )}
    </button>
  );
};
