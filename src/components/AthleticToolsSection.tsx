import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { gymSound, vibratePhone } from '../utils/audio';
import {
  Timer as TimerIcon,
  Play,
  Pause,
  RotateCcw,
  Flag,
  Bell,
  BellRing,
  Plus,
  Trash2,
  Check,
  X,
  Clock,
  Sparkles,
  Volume2,
} from 'lucide-react';

type ToolTab = 'stopwatch' | 'timer' | 'alarm';

interface AlarmItem {
  id: string;
  time: string; // HH:MM (24-hour)
  label: string;
  enabled: boolean;
  days?: string[]; // optional repeating
}

const TIMER_PRESETS = [
  { label_ar: '30 ثانية', label_en: '30 sec', seconds: 30 },
  { label_ar: '60 ثانية', label_en: '60 sec', seconds: 60 },
  { label_ar: '90 ثانية', label_en: '90 sec', seconds: 90 },
  { label_ar: '2 دقيقة', label_en: '2 min', seconds: 120 },
  { label_ar: '3 دقائق', label_en: '3 min', seconds: 180 },
  { label_ar: '5 دقائق', label_en: '5 min', seconds: 300 },
];

const ALARM_PRESET_LABELS = [
  { ar: 'موعد الذهاب للتمرين', en: 'Workout Session' },
  { ar: 'شرب الماء والارتواء', en: 'Hydration Break' },
  { ar: 'وجبة ما قبل التمرين', en: 'Pre-Workout Meal' },
  { ar: 'وجبة البروتين والاستشفاء', en: 'Post-Workout Protein' },
  { ar: 'الاستيقاظ الصباحي', en: 'Morning Wakeup' },
  { ar: 'موعد النوم والراحة', en: 'Sleep & Recovery' },
];

export const AthleticToolsSection: React.FC = () => {
  const { isDark, colors } = useTheme();
  const { isRTL, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<ToolTab>('stopwatch');

  // ==========================================
  // 1. STOPWATCH STATE
  // ==========================================
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchElapsed, setStopwatchElapsed] = useState(0); // milliseconds
  const [stopwatchLaps, setStopwatchLaps] = useState<number[]>([]);
  const stopwatchRef = useRef<number | null>(null);
  const stopwatchLastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (stopwatchRunning) {
      stopwatchLastTimeRef.current = Date.now() - stopwatchElapsed;
      stopwatchRef.current = window.setInterval(() => {
        setStopwatchElapsed(Date.now() - stopwatchLastTimeRef.current);
      }, 30);
    } else if (stopwatchRef.current) {
      clearInterval(stopwatchRef.current);
      stopwatchRef.current = null;
    }
    return () => {
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    };
  }, [stopwatchRunning]);

  const handleStopwatchToggle = () => {
    if (!stopwatchRunning) {
      gymSound.playSetCheckedSound();
      vibratePhone(30);
    }
    setStopwatchRunning((prev) => !prev);
  };

  const handleStopwatchReset = () => {
    setStopwatchRunning(false);
    setStopwatchElapsed(0);
    setStopwatchLaps([]);
    vibratePhone(20);
  };

  const handleStopwatchLap = () => {
    if (!stopwatchRunning) return;
    gymSound.playLapSound();
    vibratePhone(30);
    setStopwatchLaps((prev) => [stopwatchElapsed, ...prev]);
  };

  const formatStopwatchTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return {
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      centiseconds: String(centiseconds).padStart(2, '0'),
    };
  };

  // ==========================================
  // 2. COUNTDOWN TIMER STATE
  // ==========================================
  const [timerInitialSeconds, setTimerInitialSeconds] = useState(60);
  const [timerRemainingSeconds, setTimerRemainingSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimerRemainingSeconds((prev) => {
          if (prev <= 1) {
            // Timer Finished!
            gymSound.playAlarmSound();
            vibratePhone([100, 100, 100, 100]);
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerRunning]);

  const handleSelectPresetTimer = (sec: number) => {
    setTimerRunning(false);
    setTimerInitialSeconds(sec);
    setTimerRemainingSeconds(sec);
    gymSound.playSetCheckedSound();
  };

  const handleTimerToggle = () => {
    if (timerRemainingSeconds === 0) {
      setTimerRemainingSeconds(timerInitialSeconds);
    }
    gymSound.playSetCheckedSound();
    vibratePhone(30);
    setTimerRunning((prev) => !prev);
  };

  const handleTimerReset = () => {
    setTimerRunning(false);
    setTimerRemainingSeconds(timerInitialSeconds);
    vibratePhone(20);
  };

  const formatTimerTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // ==========================================
  // 3. ALARM STATE
  // ==========================================
  const [alarms, setAlarms] = useState<AlarmItem[]>(() => {
    try {
      const saved = localStorage.getItem('azm_alarms');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'al_1', time: '06:00', label: 'الاستيقاظ والتمرين الصباحي', enabled: true },
      { id: 'al_2', time: '17:00', label: 'موعد الذهاب لصالة التمرين', enabled: true },
      { id: 'al_3', time: '21:30', label: 'شرب الماء والراحة', enabled: false },
    ];
  });

  const [isAddingAlarm, setIsAddingAlarm] = useState(false);
  const [newAlarmTime, setNewAlarmTime] = useState('18:00');
  const [newAlarmLabel, setNewAlarmLabel] = useState(ALARM_PRESET_LABELS[0]);
  const [ringingAlarm, setRingingAlarm] = useState<AlarmItem | null>(null);

  // Save alarms
  useEffect(() => {
    try {
      localStorage.setItem('azm_alarms', JSON.stringify(alarms));
    } catch {}
  }, [alarms]);

  // Periodic alarm checker (every 20 seconds)
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      alarms.forEach((alarm) => {
        if (alarm.enabled && alarm.time === currentTimeStr && (!ringingAlarm || ringingAlarm.id !== alarm.id)) {
          setRingingAlarm(alarm);
          gymSound.playAlarmSound();
          vibratePhone([200, 100, 200, 100]);
        }
      });
    };

    const interval = setInterval(checkAlarms, 15000);
    return () => clearInterval(interval);
  }, [alarms, ringingAlarm]);

  const toggleAlarm = (id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
    gymSound.playSetCheckedSound();
  };

  const deleteAlarm = (id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlarm: AlarmItem = {
      id: `al_${Date.now()}`,
      time: newAlarmTime,
      label: newAlarmLabel.trim() || 'منبه عزم الرياضي',
      enabled: true,
    };
    setAlarms((prev) => [...prev, newAlarm]);
    setIsAddingAlarm(false);
    gymSound.playSetCheckedSound();
  };

  const dismissRingingAlarm = () => {
    setRingingAlarm(null);
  };

  const snoozeRingingAlarm = () => {
    if (!ringingAlarm) return;
    // Add 5 minutes
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    const newH = String(now.getHours()).padStart(2, '0');
    const newM = String(now.getMinutes()).padStart(2, '0');
    const snoozedTime = `${newH}:${newM}`;

    setAlarms((prev) =>
      prev.map((a) => (a.id === ringingAlarm.id ? { ...a, time: snoozedTime } : a))
    );
    setRingingAlarm(null);
    vibratePhone(50);
  };

  const swTime = formatStopwatchTime(stopwatchElapsed);
  const timerPct =
    timerInitialSeconds > 0
      ? Math.max(0, Math.min(100, (timerRemainingSeconds / timerInitialSeconds) * 100))
      : 0;

  return (
    <div
      id="athletic-tools-section"
      className="p-5 rounded-3xl border shadow-xl space-y-5 transition-colors select-none"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
    >
      {/* Header & Tool Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: colors.border }}>
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: colors.accent }}>
            {language === 'ar' ? 'أدوات التوقيت الرياضي' : 'Athletic Timing Tools'}
          </span>
          <h2 className="text-lg font-bold tracking-tight" style={{ color: colors.textPrimary }}>
            {language === 'ar' ? 'ساعة الإيقاف، المؤقت، والمنبه' : 'Stopwatch, Timer, and Alarm'}
          </h2>
        </div>

        {/* Tab Controls */}
        <div
          className="flex items-center p-1 rounded-xl border text-xs font-semibold gap-1 self-start sm:self-auto"
          style={{
            backgroundColor: isDark ? '#141416' : '#E8EEEE',
            borderColor: colors.border,
          }}
        >
          <button
            onClick={() => setActiveTab('stopwatch')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'stopwatch' ? 'shadow-xs font-bold' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'stopwatch' ? colors.card : 'transparent',
              color: activeTab === 'stopwatch' ? colors.accent : colors.textSecondary,
            }}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'ساعة إيقاف' : 'Stopwatch'}</span>
          </button>

          <button
            onClick={() => setActiveTab('timer')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'timer' ? 'shadow-xs font-bold' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'timer' ? colors.card : 'transparent',
              color: activeTab === 'timer' ? colors.accent : colors.textSecondary,
            }}
          >
            <TimerIcon className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'مؤقت تنازلي' : 'Timer'}</span>
          </button>

          <button
            onClick={() => setActiveTab('alarm')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'alarm' ? 'shadow-xs font-bold' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'alarm' ? colors.card : 'transparent',
              color: activeTab === 'alarm' ? colors.accent : colors.textSecondary,
            }}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'المنبه' : 'Alarm'}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. STOPWATCH VIEW */}
      {/* ======================================================== */}
      {activeTab === 'stopwatch' && (
        <div className="space-y-5 animate-in fade-in-50 duration-200">
          {/* Digital Chronograph Display */}
          <div
            className="p-6 rounded-2xl border text-center space-y-2 relative overflow-hidden"
            style={{
              backgroundColor: isDark ? '#121214' : '#F6F9F9',
              borderColor: colors.border,
            }}
          >
            <div className="flex items-baseline justify-center gap-1.5 font-mono select-none" dir="ltr">
              <span className="text-4xl sm:text-5xl font-black text-white" style={{ color: colors.textPrimary }}>
                {swTime.minutes}:{swTime.seconds}
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono" style={{ color: colors.accent }}>
                .{swTime.centiseconds}
              </span>
            </div>

            <p className="text-[11px]" style={{ color: colors.textMuted }}>
              {language === 'ar' ? 'دقائق : ثواني . أجزاء من المائة' : 'minutes : seconds . centiseconds'}
            </p>
          </div>

          {/* Stopwatch Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleStopwatchReset}
              disabled={stopwatchElapsed === 0}
              className="p-3.5 rounded-2xl border text-xs font-bold transition-all disabled:opacity-40 active:scale-95 flex items-center justify-center"
              style={{
                borderColor: colors.border,
                backgroundColor: isDark ? '#1A1A1D' : '#E8EEEE',
                color: colors.textSecondary,
              }}
              title={language === 'ar' ? 'إعادة تعيين' : 'Reset'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleStopwatchToggle}
              className="py-3.5 px-8 rounded-2xl font-black text-white text-sm shadow-lg transition-all active:scale-95 flex items-center gap-2"
              style={{
                backgroundColor: stopwatchRunning ? '#EF4444' : colors.accent,
              }}
            >
              {stopwatchRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>{language === 'ar' ? 'إيقاف مؤقت' : 'Pause'}</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>{stopwatchElapsed > 0 ? (language === 'ar' ? 'استئناف' : 'Resume') : (language === 'ar' ? 'بدء التوقيت' : 'Start')}</span>
                </>
              )}
            </button>

            <button
              onClick={handleStopwatchLap}
              disabled={!stopwatchRunning}
              className="p-3.5 rounded-2xl border text-xs font-bold transition-all disabled:opacity-40 active:scale-95 flex items-center justify-center"
              style={{
                borderColor: colors.border,
                backgroundColor: isDark ? '#1A1A1D' : '#E8EEEE',
                color: colors.textSecondary,
              }}
              title={language === 'ar' ? 'تسجيل دورة' : 'Record Lap'}
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>

          {/* Laps List */}
          {stopwatchLaps.length > 0 && (
            <div className="space-y-2 pt-2 border-t" style={{ borderColor: colors.border }}>
              <div className="flex items-center justify-between text-xs px-1" style={{ color: colors.textMuted }}>
                <span>{language === 'ar' ? `الدورات المسجلة (${stopwatchLaps.length}):` : `Recorded Laps (${stopwatchLaps.length}):`}</span>
                <span>{language === 'ar' ? 'توقيت الدورة' : 'Lap Time'}</span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1 font-mono text-xs">
                {stopwatchLaps.map((lapMs, idx) => {
                  const num = stopwatchLaps.length - idx;
                  const t = formatStopwatchTime(lapMs);
                  return (
                    <div
                      key={idx}
                      className="p-2 rounded-xl border flex items-center justify-between"
                      style={{
                        backgroundColor: isDark ? '#161618' : '#F8FAFA',
                        borderColor: colors.border,
                      }}
                    >
                      <span className="font-bold" style={{ color: colors.accent }}>
                        {language === 'ar' ? `دورة #${num}` : `Lap #${num}`}
                      </span>
                      <span className="font-bold" style={{ color: colors.textPrimary }} dir="ltr">
                        {t.minutes}:{t.seconds}.{t.centiseconds}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TIMER VIEW */}
      {/* ======================================================== */}
      {activeTab === 'timer' && (
        <div className="space-y-5 animate-in fade-in-50 duration-200">
          {/* Timer Display */}
          <div
            className="p-6 rounded-2xl border text-center space-y-3 relative overflow-hidden"
            style={{
              backgroundColor: isDark ? '#121214' : '#F6F9F9',
              borderColor: colors.border,
            }}
          >
            {/* Circular/Linear Progress Visual */}
            <div className="w-full h-2 rounded-full overflow-hidden bg-slate-800/40">
              <div
                className="h-full transition-all duration-1000 rounded-full"
                style={{
                  width: `${timerPct}%`,
                  backgroundColor: timerRemainingSeconds <= 5 ? '#EF4444' : colors.accent,
                }}
              />
            </div>

            <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white" style={{ color: colors.textPrimary }} dir="ltr">
              {formatTimerTime(timerRemainingSeconds)}
            </div>

            <p className="text-[11px]" style={{ color: colors.textMuted }}>
              {timerRemainingSeconds === 0
                ? (language === 'ar' ? 'انتهى الوقت!' : 'Time is up!')
                : (language === 'ar' ? 'الوقت المتبقي للجولة أو الراحة' : 'Time remaining for set or rest')}
            </p>
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {TIMER_PRESETS.map((p) => (
              <button
                key={p.seconds}
                onClick={() => handleSelectPresetTimer(p.seconds)}
                className="py-2 px-1 rounded-xl text-xs font-bold border transition-all active:scale-95"
                style={{
                  borderColor:
                    timerInitialSeconds === p.seconds ? colors.accent : colors.border,
                  backgroundColor:
                    timerInitialSeconds === p.seconds
                      ? colors.accent
                      : isDark
                      ? '#1A1A1D'
                      : '#EEF2F2',
                  color: timerInitialSeconds === p.seconds ? '#FFFFFF' : colors.textSecondary,
                }}
              >
                {language === 'ar' ? p.label_ar : p.label_en}
              </button>
            ))}
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleTimerReset}
              className="p-3.5 rounded-2xl border text-xs font-bold transition-all active:scale-95 flex items-center justify-center"
              style={{
                borderColor: colors.border,
                backgroundColor: isDark ? '#1A1A1D' : '#E8EEEE',
                color: colors.textSecondary,
              }}
              title={language === 'ar' ? 'إعادة تعيين' : 'Reset'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleTimerToggle}
              className="py-3.5 px-8 rounded-2xl font-black text-white text-sm shadow-lg transition-all active:scale-95 flex items-center gap-2"
              style={{
                backgroundColor: timerRunning ? '#EF4444' : colors.accent,
              }}
            >
              {timerRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>{language === 'ar' ? 'إيقاف مؤقت' : 'Pause'}</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>{timerRemainingSeconds === 0 ? (language === 'ar' ? 'إعادة تشغيل' : 'Restart') : (language === 'ar' ? 'بدء العد التنازلي' : 'Start Countdown')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. ALARM VIEW */}
      {/* ======================================================== */}
      {activeTab === 'alarm' && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold" style={{ color: colors.textSecondary }}>
              {language === 'ar'
                ? `المنبهات الرياضية النشطة (${alarms.filter((a) => a.enabled).length}):`
                : `Active Athletic Alarms (${alarms.filter((a) => a.enabled).length}):`}
            </span>
            <button
              onClick={() => setIsAddingAlarm(!isAddingAlarm)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 text-white transition active:scale-95"
              style={{ backgroundColor: colors.accent }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'إضافة منبه' : 'Add Alarm'}</span>
            </button>
          </div>

          {/* Add Alarm Form */}
          {isAddingAlarm && (
            <form
              onSubmit={handleAddAlarm}
              className="p-4 rounded-2xl border space-y-3"
              style={{
                backgroundColor: isDark ? '#141416' : '#F6F9F9',
                borderColor: colors.accent,
              }}
            >
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold block" style={{ color: colors.textPrimary }}>
                    {language === 'ar' ? 'وقت المنبه:' : 'Alarm Time:'}
                  </label>
                  <input
                    type="time"
                    value={newAlarmTime}
                    onChange={(e) => setNewAlarmTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-center font-mono font-bold text-sm focus:outline-none"
                    style={{
                      backgroundColor: isDark ? '#1A1A1D' : '#FFFFFF',
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold block" style={{ color: colors.textPrimary }}>
                    {language === 'ar' ? 'عنوان المنبه:' : 'Alarm Label:'}
                  </label>
                  <input
                    type="text"
                    value={newAlarmLabel}
                    onChange={(e) => setNewAlarmLabel(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: موعد التمرين...' : 'e.g., Workout time...'}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none"
                    style={{
                      backgroundColor: isDark ? '#1A1A1D' : '#FFFFFF',
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                    required
                  />
                </div>
              </div>

              {/* Preset Labels */}
              <div className="flex flex-wrap gap-1">
                {ALARM_PRESET_LABELS.map((preset, pIdx) => (
                  <button
                    type="button"
                    key={pIdx}
                    onClick={() => setNewAlarmLabel(language === 'ar' ? preset.ar : preset.en)}
                    className="px-2 py-0.5 rounded-md text-[10px] border transition"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: isDark ? '#1F1F23' : '#E8EEEE',
                      color: colors.textSecondary,
                    }}
                  >
                    {language === 'ar' ? preset.ar : preset.en}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingAlarm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                  style={{ borderColor: colors.border, color: colors.textSecondary }}
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white"
                  style={{ backgroundColor: colors.accent }}
                >
                  {language === 'ar' ? 'حفظ وتفعيل المنبه' : 'Save & Activate'}
                </button>
              </div>
            </form>
          )}

          {/* Alarms List */}
          <div className="space-y-2">
            {alarms.map((alarm) => {
              // Convert 24h to 12h Arabic
              const [h, m] = alarm.time.split(':');
              const hourNum = parseInt(h, 10);
              const isPM = hourNum >= 12;
              const displayHour = hourNum % 12 || 12;
              const ampm = language === 'ar' ? (isPM ? 'م' : 'ص') : (isPM ? 'PM' : 'AM');
              const formatted12h = `${displayHour}:${m} ${ampm}`;

              return (
                <div
                  key={alarm.id}
                  className="p-3.5 rounded-2xl border flex items-center justify-between transition-all"
                  style={{
                    backgroundColor: isDark ? '#161618' : '#F9FBFB',
                    borderColor: colors.border,
                    opacity: alarm.enabled ? 1 : 0.6,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      className="p-2 rounded-xl border transition-all"
                      style={{
                        backgroundColor: alarm.enabled ? colors.accent : 'transparent',
                        borderColor: alarm.enabled ? colors.accent : colors.border,
                        color: alarm.enabled ? '#FFFFFF' : colors.textMuted,
                      }}
                      title={alarm.enabled ? (language === 'ar' ? 'تعطيل المنبه' : 'Disable Alarm') : (language === 'ar' ? 'تفعيل المنبه' : 'Enable Alarm')}
                    >
                      {alarm.enabled ? (
                        <BellRing className="w-4 h-4 animate-pulse" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-baseline gap-2">
                        <span
                          className="text-lg font-black font-mono tracking-tight"
                          style={{ color: colors.textPrimary }}
                        >
                          {formatted12h}
                        </span>
                        <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>
                          ({alarm.time})
                        </span>
                      </div>
                      <span className="text-xs font-medium block" style={{ color: colors.textSecondary }}>
                        {alarm.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Toggle Switch */}
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                        alarm.enabled ? 'bg-red-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          alarm.enabled ? 'translate-x-0' : '-translate-x-5'
                        }`}
                      />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteAlarm(alarm.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition"
                      title={language === 'ar' ? 'حذف المنبه' : 'Delete Alarm'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ringing Alarm Modal Popup */}
      {ringingAlarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full max-w-sm rounded-3xl border shadow-2xl p-6 text-center space-y-4 animate-bounce"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.accent,
            }}
          >
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 mx-auto flex items-center justify-center">
              <BellRing className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <span className="text-3xl font-black font-mono block text-white">
                {ringingAlarm.time}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {ringingAlarm.label}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'ar' ? 'حان وقت التذكير الرياضي!' : 'Time for your athletic reminder!'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={snoozeRingingAlarm}
                className="py-3 px-4 rounded-xl border text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
                style={{ borderColor: colors.border }}
              >
                {language === 'ar' ? 'غفوة 5 دقائق' : 'Snooze 5 min'}
              </button>

              <button
                onClick={dismissRingingAlarm}
                className="py-3 px-4 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition shadow-lg shadow-red-600/30"
              >
                {language === 'ar' ? 'إيقاف المنبه' : 'Stop Alarm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
