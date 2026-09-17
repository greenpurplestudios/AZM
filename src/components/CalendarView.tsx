import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  WorkoutSession,
  CalendarEvent,
  EventCategory,
} from '../types';
import { db } from '../db/dexie';
import { useTheme } from '../context/ThemeContext';
import {
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronLeft,
  Dumbbell,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  BedDouble,
} from 'lucide-react';

interface CalendarViewProps {
  userProfile: UserProfile;
  onStartWorkoutClick?: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  userProfile,
  onStartWorkoutClick,
}) => {
  const { isDark, colors } = useTheme();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [completedSessions, setCompletedSessions] = useState<WorkoutSession[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('17:00');
  const [newEventCategory, setNewEventCategory] = useState<EventCategory>('workout');

  const loadData = async () => {
    try {
      const allEvents = await db.calendar_events.toArray();
      const allSessions = await db.workout_sessions.where('is_completed').equals(1).toArray();
      setEvents(allEvents);
      setCompletedSessions(allSessions);
    } catch (err) {
      console.error('Failed to load calendar data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString('ar-EG', {
    month: 'long',
    year: 'numeric',
  });

  const dayNames = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  // Identify status for each date in current month
  const getDayInfo = (day: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    const hasWorkoutSession = completedSessions.some((s) => s.started_at.startsWith(dateStr));
    const dayEvents = events.filter((e) => e.date === dateStr);
    const hasScheduledWorkout = dayEvents.some((e) => e.category === 'workout');
    const isRest = dayEvents.some((e) => e.title.includes('راحة') || e.title.includes('Rest'));

    return {
      dateStr,
      hasWorkoutSession,
      hasScheduledWorkout,
      isRest,
      eventsCount: dayEvents.length,
    };
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEv: CalendarEvent = {
      id: `ev_${Date.now()}`,
      title: newEventTitle.trim(),
      date: selectedDateStr,
      start_time: newEventTime,
      category: newEventCategory,
      is_completed: false,
      created_at: new Date().toISOString(),
    };

    setEvents((prev) => [...prev, newEv]);
    setNewEventTitle('');
    setIsAddingEvent(false);

    try {
      await db.calendar_events.put(newEv);
    } catch (err) {
      console.error('Failed to save calendar event:', err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    try {
      await db.calendar_events.delete(id);
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  // Selected date data
  const selectedDaySessions = completedSessions.filter((s) =>
    s.started_at.startsWith(selectedDateStr)
  );
  const selectedDayEvents = events.filter((e) => e.date === selectedDateStr);

  const selectedDateObj = new Date(selectedDateStr + 'T00:00:00');
  const selectedDateHuman = selectedDateObj.toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div
      id="azm-calendar-view"
      className="p-4 sm:p-6 max-w-xl mx-auto space-y-7 pb-28 text-right select-none transition-colors duration-200"
    >
      {/* 1. Header */}
      <div className="space-y-1">
        <span
          className="text-xs font-semibold uppercase tracking-wider block"
          style={{ color: colors.textMuted }}
        >
          التقويم والتخطيط • Calendar
        </span>
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: colors.textPrimary }}
        >
          جدول التمارين والمواعيد
        </h1>
      </div>

      {/* 2. Month Grid Card */}
      <div
        className="p-5 rounded-2xl border transition-colors duration-200 space-y-4"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        {/* Month Selector Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl border hover:opacity-80 transition-all active:scale-95"
            style={{ borderColor: colors.border, color: colors.textPrimary }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <h3
            className="text-base font-bold capitalize"
            style={{ color: colors.textPrimary }}
          >
            {monthName}
          </h3>

          <button
            onClick={prevMonth}
            className="p-2 rounded-xl border hover:opacity-80 transition-all active:scale-95"
            style={{ borderColor: colors.border, color: colors.textPrimary }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {dayNames.map((name, i) => (
            <div
              key={i}
              className="text-[11px] font-semibold py-1"
              style={{ color: colors.textMuted }}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Month Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const { dateStr, hasWorkoutSession, hasScheduledWorkout, isRest } =
              getDayInfo(dayNum);
            const isSelected = selectedDateStr === dateStr;
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDateStr(dateStr)}
                className="aspect-square relative rounded-xl flex flex-col items-center justify-center p-1 transition-all active:scale-95 border"
                style={{
                  backgroundColor: isSelected
                    ? isDark
                      ? '#2A1F21'
                      : '#E6F8F5'
                    : 'transparent',
                  borderColor: isSelected
                    ? colors.accent
                    : isToday
                    ? colors.textMuted
                    : 'transparent',
                  color: isSelected
                    ? colors.accent
                    : isToday
                    ? colors.textPrimary
                    : colors.textSecondary,
                  fontWeight: isSelected || isToday ? 700 : 500,
                }}
              >
                <span className="text-xs font-mono">{dayNum}</span>

                {/* Subtle workout indicator dots/lines */}
                <div className="flex items-center gap-0.5 mt-0.5 h-1">
                  {hasWorkoutSession && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: colors.accent }}
                      title="تمرين مكتمل"
                    />
                  )}
                  {hasScheduledWorkout && !hasWorkoutSession && (
                    <span
                      className="w-1.5 h-1.5 rounded-full border"
                      style={{ borderColor: colors.accent }}
                      title="تمرين مجدول"
                    />
                  )}
                  {isRest && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: colors.textMuted }}
                      title="يوم استشفاء وراحة"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div
          className="pt-3 border-t flex items-center justify-between text-[10px] select-none"
          style={{ borderColor: colors.border, color: colors.textSecondary }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.accent }}
            />
            <span>تمرين مكتمل</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full border"
              style={{ borderColor: colors.accent }}
            />
            <span>تمرين مجدول</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.textMuted }}
            />
            <span>راحة واستشفاء</span>
          </div>
        </div>
      </div>

      {/* 3. Selected Day Details (Appears directly below the calendar) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <span
              className="text-xs font-semibold uppercase tracking-wider block"
              style={{ color: colors.textMuted }}
            >
              تفاصيل اليوم المحدد
            </span>
            <h2
              className="text-base font-bold tracking-tight"
              style={{ color: colors.textPrimary }}
            >
              {selectedDateHuman}
            </h2>
          </div>

          <button
            onClick={() => setIsAddingEvent(!isAddingEvent)}
            className="text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-xl border transition-all"
            style={{
              borderColor: colors.border,
              color: colors.accent,
              backgroundColor: colors.card,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة موعد</span>
          </button>
        </div>

        {/* Add Event Form */}
        {isAddingEvent && (
          <form
            onSubmit={handleAddEvent}
            className="p-4 rounded-2xl border space-y-3 transition-colors"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.accent,
            }}
          >
            <input
              type="text"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              placeholder="عنوان التمرين أو الموعد (مثال: تمرين أرجل، مراجعة)..."
              autoFocus
              className="w-full bg-transparent text-sm focus:outline-hidden"
              style={{ color: colors.textPrimary }}
            />

            <div className="flex items-center gap-3">
              <input
                type="time"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                className="p-1.5 rounded-lg border text-xs font-mono"
                style={{
                  backgroundColor: isDark ? '#111113' : '#F7F9F9',
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
              />

              <select
                value={newEventCategory}
                onChange={(e) => setNewEventCategory(e.target.value as EventCategory)}
                className="p-1.5 rounded-lg border text-xs"
                style={{
                  backgroundColor: isDark ? '#111113' : '#F7F9F9',
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
              >
                <option value="workout">تمرين رياضي</option>
                <option value="study">مذاكرة ودراسة</option>
                <option value="appointment">موعد شخصي</option>
                <option value="general">عام / أخرى</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingEvent(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                style={{ borderColor: colors.border, color: colors.textSecondary }}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white"
                style={{ backgroundColor: colors.accent }}
              >
                حفظ في التقويم
              </button>
            </div>
          </form>
        )}

        {/* Selected Day Completed Sessions */}
        {selectedDaySessions.length > 0 && (
          <div className="space-y-2">
            <span
              className="text-xs font-semibold uppercase tracking-wider px-1"
              style={{ color: colors.textMuted }}
            >
              التمارين المنجزة في هذا اليوم
            </span>
            {selectedDaySessions.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-2xl border flex items-center justify-between"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: isDark ? '#2D1B1E' : '#E6F8F5',
                      color: colors.accent,
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4
                      className="text-sm font-bold"
                      style={{ color: colors.textPrimary }}
                    >
                      {s.routine_title || 'تمرين مقاومة'}
                    </h4>
                    <span
                      className="text-xs"
                      style={{ color: colors.textSecondary }}
                    >
                      {Math.round((s.duration_seconds || 1800) / 60)} دقيقة • {s.sets?.length || 0} جولات
                    </span>
                  </div>
                </div>

                <span
                  className="text-xs font-bold font-mono"
                  style={{ color: colors.accent }}
                >
                  مكتمل ✓
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Selected Day Scheduled Events */}
        {selectedDayEvents.length > 0 ? (
          <div className="space-y-2">
            <span
              className="text-xs font-semibold uppercase tracking-wider px-1"
              style={{ color: colors.textMuted }}
            >
              المواعيد والمهام المجدولة
            </span>
            <div
              className="rounded-2xl border divide-y overflow-hidden"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
            >
              {selectedDayEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-md border flex items-center justify-center"
                      style={{
                        borderColor: colors.border,
                        color: colors.accent,
                      }}
                    >
                      {ev.category === 'workout' ? (
                        <Dumbbell className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <h4
                        className="font-bold text-sm"
                        style={{ color: colors.textPrimary }}
                      >
                        {ev.title}
                      </h4>
                      <span style={{ color: colors.textSecondary }}>
                        {ev.start_time || 'طوال اليوم'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="p-1 rounded-md hover:bg-red-500/10 text-red-500"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          selectedDaySessions.length === 0 && (
            <div
              className="p-6 rounded-2xl border text-center text-xs"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.textSecondary,
              }}
            >
              لا توجد تمارين أو مواعيد مسجلة في هذا اليوم.
            </div>
          )
        )}
      </div>
    </div>
  );
};
