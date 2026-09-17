import React, { useState, useRef } from 'react';
import { UserProfile, EquipmentType, GymAccessType } from '../types';
import { db } from '../db/dexie';
import { AzmLogo } from './AzmLogo';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  User,
  Scale,
  Camera,
  Trash2,
  Upload,
  HardDrive,
  ShieldCheck,
  Download,
  CheckCircle2,
  Home,
  Building2,
  Repeat,
  Save,
  Trophy,
  Sparkles,
} from 'lucide-react';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigateLeaderboards?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  onNavigateLeaderboards,
}) => {
  const { isDark, colors } = useTheme();
  const { isRTL, t } = useLanguage();

  const [name, setName] = useState(userProfile.name);
  const [bio, setBio] = useState(userProfile.bio || '');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(userProfile.avatar_url);
  const [weight, setWeight] = useState<string>(String(userProfile.weight_kg || 75));
  const [height, setHeight] = useState<string>(String(userProfile.height_cm || 175));
  const [age, setAge] = useState<string>(String(userProfile.age || 25));
  const [showInLeaderboard, setShowInLeaderboard] = useState<boolean>(
    userProfile.show_in_leaderboard !== false
  );
  const [gymAccess, setGymAccess] = useState<GymAccessType>(userProfile.gym_access || 'gym');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Photo Upload with client-side canvas compression to max 400x400
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarUrl(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    const w = parseFloat(weight) || 75;
    const h = parseFloat(height) || 175;
    const a = parseInt(age) || 25;

    const updated: UserProfile = {
      ...userProfile,
      name: name.trim() || (isRTL ? 'البطل' : 'Athlete'),
      bio: bio.trim(),
      avatar_url: avatarUrl,
      weight_kg: w,
      height_cm: h,
      age: a,
      daily_water_target_ml: Math.round(w * 35),
      gym_access: gymAccess,
      show_in_leaderboard: showInLeaderboard,
    };

    await db.user_profile.put(updated);
    onUpdateProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportData = async () => {
    const workouts = await db.workout_sessions.toArray();
    const water = await db.water_logs.toArray();
    const prs = await db.personal_records.toArray();
    const routines = await db.routines.toArray();
    const events = await db.calendar_events.toArray();
    const bestLifts = await db.best_lifts.toArray();
    const foodLogs = await db.food_logs.toArray();

    const backup = {
      export_date: new Date().toISOString(),
      user: userProfile,
      workouts,
      water,
      prs,
      bestLifts,
      routines,
      events,
      foodLogs,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `azm_fitness_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div
      id="profile-view"
      className="p-4 sm:p-6 max-w-xl mx-auto space-y-6 pb-36 text-right select-none transition-colors duration-200"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Brand & Section Header */}
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: colors.border }}>
        <div className="space-y-0.5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: colors.accent }}>
            {isRTL ? 'الهوية والملف الرياضي' : 'Athletic Identity'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black" style={{ color: colors.textPrimary }}>
            {t('profile.title')}
          </h2>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            {isRTL
              ? 'تخصيص بياناتك وصورتك ونبذتك وبيئة تمرينك الرياضية.'
              : 'Customize your avatar, bio, biometrics, and training environment.'}
          </p>
        </div>
        <AzmLogo size="sm" showText={false} />
      </div>

      {/* Profile Header Preview Card (Photo, Name, Bio) */}
      <div
        className="rounded-3xl border p-5 sm:p-6 space-y-4 shadow-xs flex flex-col items-center text-center transition-all"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        {/* Avatar with Upload / Edit button */}
        <div className="relative group">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-full object-cover border-3 shadow-md transition-all"
              style={{ borderColor: colors.accent }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center font-black text-2xl border-3 text-white shadow-md"
              style={{ backgroundColor: colors.accent, borderColor: colors.border }}
            >
              {(name || 'AZM').slice(0, 2).toUpperCase()}
            </div>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 rounded-full border shadow-md text-white transition active:scale-95"
            style={{ backgroundColor: colors.accent, borderColor: '#fff' }}
            title={t('profile.edit_photo')}
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Photo actions buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition hover:opacity-80 active:scale-95"
            style={{
              backgroundColor: isDark ? '#1a1a1f' : '#f0fdfa',
              borderColor: colors.border,
              color: colors.accent,
            }}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t('profile.edit_photo')}</span>
          </button>

          {avatarUrl && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition hover:opacity-80 active:scale-95 text-red-500"
              style={{
                backgroundColor: isDark ? '#1a1a1f' : '#fef2f2',
                borderColor: colors.border,
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('profile.remove_photo')}</span>
            </button>
          )}
        </div>

        {/* Display Name & Bio Preview */}
        <div className="space-y-1 w-full max-w-sm">
          <h3 className="text-lg font-black" style={{ color: colors.textPrimary }}>
            {name || (isRTL ? 'البطل' : 'Athlete')}
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
            {bio || (isRTL ? 'لا توجد نبذة شخصية بعد. اكتب نبذتك بالأسفل!' : 'No bio yet. Add one below!')}
          </p>
        </div>
      </div>

      {/* Edit Bio and Name Card */}
      <div
        className="rounded-3xl border p-5 space-y-4 shadow-xs"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        <h3 className="text-sm font-black" style={{ color: colors.textPrimary }}>
          {isRTL ? 'المعلومات الشخصية والنبذة' : 'Personal Info & Bio'}
        </h3>

        {/* Name input */}
        <div className="space-y-1">
          <label className="text-xs font-bold" style={{ color: colors.textSecondary }}>
            {t('profile.name_label')}:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 rounded-xl border text-xs font-bold focus:outline-hidden"
            style={{
              backgroundColor: isDark ? '#141417' : '#F8FAFA',
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
          />
        </div>

        {/* Bio Textarea */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold" style={{ color: colors.textSecondary }}>
              {t('profile.bio_label')}:
            </label>
            <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>
              {bio.length}/200
            </span>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 200))}
            rows={3}
            placeholder={t('profile.bio_placeholder')}
            className="w-full p-2.5 rounded-xl border text-xs font-medium focus:outline-hidden resize-none leading-relaxed"
            style={{
              backgroundColor: isDark ? '#141417' : '#F8FAFA',
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
          />
        </div>

        {/* Leaderboard Privacy Toggle */}
        <div
          className="p-3.5 rounded-2xl border flex items-center justify-between gap-3"
          style={{
            backgroundColor: isDark ? '#141417' : '#F8FAFA',
            borderColor: colors.border,
          }}
        >
          <div className="space-y-0.5">
            <span className="text-xs font-bold block" style={{ color: colors.textPrimary }}>
              {t('profile.leaderboard_privacy')}
            </span>
            <span className="text-[11px] block leading-tight" style={{ color: colors.textMuted }}>
              {t('profile.leaderboard_privacy_desc')}
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={showInLeaderboard}
              onChange={(e) => setShowInLeaderboard(e.target.checked)}
              className="sr-only peer"
            />
            <div
              className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
              style={{
                backgroundColor: showInLeaderboard ? colors.accent : isDark ? '#333' : '#d1d5db',
              }}
            />
          </label>
        </div>
      </div>

      {/* Training Environment Setting (Gym / Home / Both) */}
      <div
        className="rounded-3xl border p-5 space-y-3 shadow-xs"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        <div className="space-y-1">
          <h3 className="text-sm font-black" style={{ color: colors.textPrimary }}>
            {isRTL ? 'بيئة التمرين الأساسية' : 'Primary Training Environment'}
          </h3>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            {isRTL
              ? 'يحدد هذا الخيار نوعية الجداول المقترحة والتمارين الملائمة لك تلقائياً.'
              : 'Determines suggested routines and compatible exercises.'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            {
              id: 'gym' as GymAccessType,
              title: isRTL ? 'جيم كامل' : 'Full Gym',
              sub: isRTL ? 'نادي رياضي' : 'Commercial Gym',
              icon: Building2,
            },
            {
              id: 'home' as GymAccessType,
              title: isRTL ? 'منزلي' : 'Home',
              sub: isRTL ? 'أوزان ووزن جسم' : 'Dumbbells / Body',
              icon: Home,
            },
            {
              id: 'both' as GymAccessType,
              title: isRTL ? 'كلاهما' : 'Both',
              sub: isRTL ? 'نادي ومنزل' : 'Hybrid',
              icon: Repeat,
            },
          ].map((item) => {
            const isSelected = gymAccess === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setGymAccess(item.id)}
                className="p-3 rounded-2xl border text-center transition-all active:scale-[0.98] flex flex-col items-center gap-1.5"
                style={{
                  backgroundColor: isSelected
                    ? isDark
                      ? '#232328'
                      : '#F0F9F8'
                    : 'transparent',
                  borderColor: isSelected ? colors.accent : colors.border,
                  color: isSelected ? colors.accent : colors.textSecondary,
                  boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <Icon className="w-5 h-5" />
                <div>
                  <span className="text-xs font-bold block" style={{ color: isSelected ? colors.textPrimary : colors.textSecondary }}>
                    {item.title}
                  </span>
                  <span className="text-[10px]" style={{ color: colors.textMuted }}>
                    {item.sub}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Biometrics Settings Card (Weight, Height, Age) */}
      <div
        className="rounded-3xl border p-5 space-y-4 shadow-xs"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        <h3 className="text-sm font-black" style={{ color: colors.textPrimary }}>
          {isRTL ? 'البيانات الحيوية' : 'Biometrics'}
        </h3>

        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-bold flex items-center gap-1" style={{ color: colors.textSecondary }}>
              <Scale className="w-3.5 h-3.5" style={{ color: colors.accent }} />
              <span>{isRTL ? 'الوزن (كجم):' : 'Weight (kg):'}</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="30"
              max="250"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-2 rounded-xl border text-xs font-mono font-bold focus:outline-hidden"
              style={{
                backgroundColor: isDark ? '#141417' : '#F8FAFA',
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold flex items-center gap-1" style={{ color: colors.textSecondary }}>
              <span>{isRTL ? 'الطول (سم):' : 'Height (cm):'}</span>
            </label>
            <input
              type="number"
              min="100"
              max="240"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full p-2 rounded-xl border text-xs font-mono font-bold focus:outline-hidden"
              style={{
                backgroundColor: isDark ? '#141417' : '#F8FAFA',
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold flex items-center gap-1" style={{ color: colors.textSecondary }}>
              <span>{isRTL ? 'العمر:' : 'Age:'}</span>
            </label>
            <input
              type="number"
              min="14"
              max="100"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-2 rounded-xl border text-xs font-mono font-bold focus:outline-hidden"
              style={{
                backgroundColor: isDark ? '#141417' : '#F8FAFA',
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
            />
          </div>
        </div>

        <span className="text-[11px] block" style={{ color: colors.textMuted }}>
          {isRTL
            ? `يُستخدم لحساب احتياج شرب الماء اليومي (${Math.round((parseFloat(weight) || 75) * 35)} مل) وحساب السعرات والماكروز.`
            : `Used to calculate daily water target (${Math.round((parseFloat(weight) || 75) * 35)} ml) and macro requirements.`}
        </span>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-3.5 rounded-2xl font-black text-xs text-white transition active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
        style={{ backgroundColor: colors.accent }}
      >
        {saveSuccess ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('profile.saved_success')}</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            <span>{t('profile.save_btn')}</span>
          </>
        )}
      </button>

      {/* Offline Storage & Privacy */}
      <div
        className="rounded-3xl border p-5 space-y-3"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4" style={{ color: colors.accent }} />
          <h3 className="text-xs font-bold" style={{ color: colors.textPrimary }}>
            {isRTL ? 'البيانات والأمان المحلي' : 'Local Data & Privacy'}
          </h3>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
          {isRTL
            ? 'بياناتك الرياضية مخزنة محلياً بالكامل ومحمية في متصفحك. لا يتم رفع سجلاتك لأي خادم خارجي.'
            : 'Your fitness data is stored 100% locally and securely in your browser.'}
        </p>

        <button
          onClick={handleExportData}
          className="w-full py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition hover:opacity-80"
          style={{
            borderColor: colors.border,
            color: colors.textPrimary,
            backgroundColor: isDark ? '#141417' : '#F8FAFA',
          }}
        >
          <Download className="w-4 h-4" />
          <span>{isRTL ? 'تصدير نسخة احتياطية من بياناتي' : 'Export Data Backup (JSON)'}</span>
        </button>
      </div>
    </div>
  );
};
