import React, { useState } from 'react';
import { WorkoutSession } from '../types';
import { Flame, Calendar, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';

interface AzmContributionGraphProps {
  sessions: WorkoutSession[];
  streakCount: number;
}

export const AzmContributionGraph: React.FC<AzmContributionGraphProps> = ({
  sessions,
  streakCount,
}) => {
  const [selectedCell, setSelectedCell] = useState<{
    dateStr: string;
    count: number;
    volume: number;
    isFuture: boolean;
  } | null>(null);

  // Generate the last 14 weeks (approx 3.5 months) of activity
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Group completed workout sessions by date string YYYY-MM-DD
  const sessionMap = new Map<string, { count: number; volume: number }>();
  sessions.forEach((s) => {
    if (!s.is_completed) return;
    const dateKey = s.started_at.split('T')[0];
    const prev = sessionMap.get(dateKey) || { count: 0, volume: 0 };
    const sessionVolume = s.sets
      ?.filter((st) => st.completed)
      .reduce((acc, st) => acc + (st.weight_kg || 0) * (st.reps || 0), 0) || 0;
    const setsCount = s.sets?.filter((st) => st.completed).length || 0;

    sessionMap.set(dateKey, {
      count: prev.count + setsCount,
      volume: prev.volume + sessionVolume,
    });
  });

  // Calculate 16 weeks ending today
  const totalWeeks = 16;
  const weeks: { date: Date; dateStr: string; count: number; volume: number; isFuture: boolean }[][] = [];

  // Find start date: end of current week - (totalWeeks * 7 - 1) days
  const currentDayOfWeek = today.getDay(); // 0 = Sunday
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + (6 - currentDayOfWeek));

  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - totalWeeks * 7 + 1);

  let temp = new Date(startDate);
  for (let w = 0; w < totalWeeks; w++) {
    const weekDays = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = temp.toISOString().split('T')[0];
      const isFuture = temp > today;
      const data = sessionMap.get(dateStr) || { count: 0, volume: 0 };

      weekDays.push({
        date: new Date(temp),
        dateStr,
        count: data.count,
        volume: data.volume,
        isFuture,
      });
      temp.setDate(temp.getDate() + 1);
    }
    weeks.push(weekDays);
  }

  const dayLabels = ['أحد', '', 'ثلاثاء', '', 'خميس', '', 'سبت'];

  const getIntensityColor = (day: { isFuture: boolean; count: number }) => {
    if (day.isFuture) return 'bg-[#0E1A17] border border-[#1F3A34]/30 opacity-40';
    if (day.count === 0) return 'bg-[#0E1A17] border border-[#1F3A34]/60 hover:border-[#6BAF8F]/40';
    if (day.count < 6) return 'bg-[#1F3A34] border border-[#6BAF8F]/40 shadow-sm';
    if (day.count < 12) return 'bg-[#6BAF8F] border border-[#C8E6CF]/50 shadow-sm shadow-[#6BAF8F]/30';
    return 'bg-[#C8E6CF] border border-white text-[#070B0A] shadow-md shadow-[#C8E6CF]/40';
  };

  return (
    <div className="rounded-3xl bg-[#0E1A17] border border-[#1F3A34] p-4.5 space-y-3.5 shadow-xl">
      {/* Header with Streak and Description */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#1F3A34]/70 border border-[#6BAF8F]/40 flex items-center justify-center text-[#6BAF8F]">
            <Flame className="w-4 h-4 fill-current animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black text-[#F4F5F3]">سجل الاستمرارية والعزم (Heatmap)</h4>
            <span className="text-[10px] text-[#C8E6CF]/70 font-mono">
              🔥 {streakCount} يوماً متتالياً من الانضباط
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[9px] text-[#C8E6CF]/60 select-none">
          <span>أقل</span>
          <span className="w-2.5 h-2.5 rounded bg-[#0E1A17] border border-[#1F3A34]" />
          <span className="w-2.5 h-2.5 rounded bg-[#1F3A34]" />
          <span className="w-2.5 h-2.5 rounded bg-[#6BAF8F]" />
          <span className="w-2.5 h-2.5 rounded bg-[#C8E6CF]" />
          <span>أعلى</span>
        </div>
      </div>

      {/* Contribution Grid Container */}
      <div className="overflow-x-auto pb-1 pt-1">
        <div className="min-w-[420px] flex gap-1.5 justify-start">
          {/* Day of week labels */}
          <div className="grid grid-rows-7 gap-1 text-[9px] text-[#C8E6CF]/60 font-mono pl-1 select-none">
            {dayLabels.map((lbl, idx) => (
              <span key={idx} className="h-3 flex items-center leading-none">
                {lbl}
              </span>
            ))}
          </div>

          {/* Weeks columns */}
          <div className="flex gap-1">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="grid grid-rows-7 gap-1">
                {week.map((day, dIdx) => (
                  <button
                    key={dIdx}
                    onClick={() => setSelectedCell(day)}
                    title={`${day.dateStr}: ${day.count} مجموعات`}
                    className={`w-3.5 h-3 rounded transition-all transform active:scale-125 ${getIntensityColor(
                      day
                    )} ${
                      selectedCell?.dateStr === day.dateStr
                        ? 'ring-2 ring-[#F4F5F3] scale-110'
                        : ''
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Day Tooltip / Banner */}
      {selectedCell && (
        <div className="p-2.5 rounded-xl bg-[#070B0A] border border-[#1F3A34] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6BAF8F]" />
            <span className="font-mono text-[11px] text-[#F4F5F3]">{selectedCell.dateStr}</span>
          </div>

          <div className="font-mono text-xs">
            {selectedCell.count > 0 ? (
              <span className="text-[#6BAF8F] font-bold">
                {selectedCell.count} مجموعات • {selectedCell.volume.toLocaleString()} كغ
              </span>
            ) : selectedCell.isFuture ? (
              <span className="text-[#C8E6CF]/50">يوم قادم</span>
            ) : (
              <span className="text-[#C8E6CF]/60">يوم راحة / استشفاء</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
