import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  card: string;
  cardElevated: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  accent: string;
  accentDark: string;
  accentLight: string;
  success: string;
  warning: string;
  error: string;
}

export const DAY_THEME: ThemeColors = {
  bgPrimary: '#F7FAFA',
  bgSecondary: '#F0F4F4',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  textPrimary: '#111315',
  textSecondary: '#687274',
  textMuted: '#9AA3A4',
  border: '#DDE4E4',
  accent: '#35C9B8', // Teal / Mint
  accentDark: '#159F91',
  accentLight: '#D9F6F2',
  success: '#22A06B',
  warning: '#D99A24',
  error: '#D94A4A',
};

export const DARK_THEME: ThemeColors = {
  bgPrimary: '#0B0B0C',
  bgSecondary: '#111113',
  card: '#171719',
  cardElevated: '#1D1D20',
  textPrimary: '#F5F5F5',
  textSecondary: '#A1A1A6',
  textMuted: '#6F7075',
  border: '#29292D',
  accent: '#E94B4B', // Minimal Red
  accentDark: '#C93636',
  accentLight: '#3A1F20',
  success: '#4CAF7D',
  warning: '#D9A441',
  error: '#E94B4B',
};

interface ThemeContextValue {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeMode: 'dark',
  isDark: true,
  colors: DARK_THEME,
  setThemeMode: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDark = true;
  const colors = DARK_THEME;
  const themeMode: ThemeMode = 'dark';

  useEffect(() => {
    try {
      localStorage.setItem('azm_theme_mode', 'dark');
    } catch {
      // ignore
    }

    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
    root.style.setProperty('--bg-primary', DARK_THEME.bgPrimary);
    root.style.setProperty('--bg-secondary', DARK_THEME.bgSecondary);
    root.style.setProperty('--bg-card', DARK_THEME.card);
    root.style.setProperty('--bg-card-elevated', DARK_THEME.cardElevated);
    root.style.setProperty('--text-primary', DARK_THEME.textPrimary);
    root.style.setProperty('--text-secondary', DARK_THEME.textSecondary);
    root.style.setProperty('--text-muted', DARK_THEME.textMuted);
    root.style.setProperty('--border-subtle', DARK_THEME.border);
    root.style.setProperty('--accent-primary', DARK_THEME.accent);
    root.style.setProperty('--accent-dark', DARK_THEME.accentDark);
    root.style.setProperty('--accent-light', DARK_THEME.accentLight);
    document.body.style.backgroundColor = DARK_THEME.bgPrimary;
    document.body.style.color = DARK_THEME.textPrimary;

    // Update meta theme-color for mobile browser header
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', DARK_THEME.bgPrimary);
    }
  }, []);

  const setThemeMode = () => {};
  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        isDark,
        colors,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
