import React, { useState } from 'react';
import { MuscleType, MuscleRankTier, MuscleRank } from '../types';
import { Eye, RotateCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getTierConfig, TIER_CONFIGS } from '../utils/muscleLifts';

interface MuscleBodyMapProps {
  muscleRanks: Record<string, MuscleRank>;
  selectedMuscleId: MuscleType | null;
  onSelectMuscle: (muscleId: MuscleType) => void;
}

export const MuscleBodyMap: React.FC<MuscleBodyMapProps> = ({
  muscleRanks,
  selectedMuscleId,
  onSelectMuscle,
}) => {
  const { isDark, colors } = useTheme();
  const [view, setView] = useState<'front' | 'back'>('front');
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleType | null>(null);

  // Return fill color and stroke based on muscle's rank tier
  const getMuscleColor = (muscleId: MuscleType) => {
    const data = muscleRanks[muscleId];
    const isSelected = selectedMuscleId === muscleId;
    const isHovered = hoveredMuscle === muscleId;

    if (!data || data.rank === 'UNRANKED' || data.is_unranked) {
      return {
        fill: isSelected
          ? isDark ? '#2D2D32' : '#DDE4E4'
          : isHovered
          ? isDark ? '#242428' : '#E8EEEE'
          : isDark ? '#171719' : '#F0F4F4',
        stroke: isSelected ? colors.accent : (isDark ? '#2B2B30' : '#CBD5E1'),
        strokeWidth: isSelected ? '2.5' : '1',
        opacity: isSelected ? '1' : '0.85',
      };
    }

    const tierConfig = getTierConfig(data.rank);
    const tierColor = tierConfig.color;

    return {
      fill: isHovered
        ? tierColor
        : isDark
        ? `${tierColor}55` // 33% hex alpha in dark mode
        : `${tierColor}40`, // 25% hex alpha in light mode
      stroke: isSelected ? (isDark ? '#FFFFFF' : '#0F172A') : tierColor,
      strokeWidth: isSelected ? '2.5' : isHovered ? '2' : '1.5',
      opacity: '1',
    };
  };

  const activeHoveredData = hoveredMuscle ? muscleRanks[hoveredMuscle] : null;

  return (
    <div
      className="relative rounded-2xl border p-4 transition-colors duration-200 overflow-hidden"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
    >
      {/* View Switcher Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div>
          <span
            className="text-[10px] font-bold uppercase tracking-wider block"
            style={{ color: colors.textMuted }}
          >
            خريطة التشريح العضلي
          </span>
          <h3
            className="text-sm font-bold"
            style={{ color: colors.textPrimary }}
          >
            {view === 'front' ? 'المنظر الأمامي (Front View)' : 'المنظر الخلفي (Back View)'}
          </h3>
        </div>

        {/* View Toggle Tabs */}
        <div
          className="flex items-center p-1 rounded-xl border text-xs"
          style={{
            backgroundColor: isDark ? '#111113' : '#F0F4F4',
            borderColor: colors.border,
          }}
        >
          <button
            onClick={() => setView('front')}
            className="px-2.5 py-1 rounded-lg font-bold transition-all text-xs"
            style={{
              backgroundColor: view === 'front' ? colors.card : 'transparent',
              color: view === 'front' ? colors.accent : colors.textSecondary,
              boxShadow: view === 'front' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            أمامي
          </button>
          <button
            onClick={() => setView('back')}
            className="px-2.5 py-1 rounded-lg font-bold transition-all text-xs"
            style={{
              backgroundColor: view === 'back' ? colors.card : 'transparent',
              color: view === 'back' ? colors.accent : colors.textSecondary,
              boxShadow: view === 'back' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            خلفي
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative flex items-center justify-center py-2 select-none">
        <svg
          viewBox="0 0 280 440"
          className="w-full max-w-[290px] h-[370px] transition-transform duration-300"
        >
          <defs>
            <linearGradient id="bodyBase" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#14221E" />
              <stop offset="100%" stopColor="#0B1311" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#6BAF8F" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* BASE SILHOUETTE - Anatomical Body Frame */}
          {/* Head & Neck */}
          <ellipse cx="140" cy="38" rx="20" ry="24" fill="url(#bodyBase)" stroke="#1F3A34" strokeWidth="1.2" />
          <path d="M133 60 L133 78 L147 78 L147 60 Z" fill="#14221E" />

          {/* FRONT VIEW ANATOMY */}
          {view === 'front' && (
            <g id="front-view-muscles">
              {/* SHOULDERS (Deltoids) Left & Right */}
              <path
                id="muscle-shoulders-left"
                d="M 112 78 C 96 82 82 98 84 114 C 85 120 90 124 96 122 C 102 118 106 106 108 94 Z"
                {...getMuscleColor('shoulders')}
                onClick={() => onSelectMuscle('shoulders')}
                onMouseEnter={() => setHoveredMuscle('shoulders')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />
              <path
                id="muscle-shoulders-right"
                d="M 168 78 C 184 82 198 98 196 114 C 195 120 190 124 184 122 C 178 118 174 106 172 94 Z"
                {...getMuscleColor('shoulders')}
                onClick={() => onSelectMuscle('shoulders')}
                onMouseEnter={() => setHoveredMuscle('shoulders')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />

              {/* CHEST (Pectorals) Left & Right */}
              <path
                id="muscle-chest-left"
                d="M 110 82 C 122 80 137 84 138 98 C 138 116 124 124 106 122 C 100 114 102 96 110 82 Z"
                {...getMuscleColor('chest')}
                onClick={() => onSelectMuscle('chest')}
                onMouseEnter={() => setHoveredMuscle('chest')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />
              <path
                id="muscle-chest-right"
                d="M 170 82 C 158 80 143 84 142 98 C 142 116 156 124 174 122 C 180 114 178 96 170 82 Z"
                {...getMuscleColor('chest')}
                onClick={() => onSelectMuscle('chest')}
                onMouseEnter={() => setHoveredMuscle('chest')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />

              {/* BICEPS Left & Right */}
              <path
                id="muscle-biceps-left"
                d="M 85 118 C 80 128 78 144 82 156 C 86 160 92 158 95 152 C 98 142 98 128 94 120 Z"
                {...getMuscleColor('biceps')}
                onClick={() => onSelectMuscle('biceps')}
                onMouseEnter={() => setHoveredMuscle('biceps')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />
              <path
                id="muscle-biceps-right"
                d="M 195 118 C 200 128 202 144 198 156 C 194 160 188 158 185 152 C 182 142 182 128 186 120 Z"
                {...getMuscleColor('biceps')}
                onClick={() => onSelectMuscle('biceps')}
                onMouseEnter={() => setHoveredMuscle('biceps')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />

              {/* FOREARMS Left & Right */}
              <path
                id="muscle-forearms-left"
                d="M 80 160 C 72 174 68 196 72 214 C 76 218 82 216 85 208 C 90 192 92 176 90 162 Z"
                {...getMuscleColor('forearms')}
                onClick={() => onSelectMuscle('forearms')}
                onMouseEnter={() => setHoveredMuscle('forearms')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />
              <path
                id="muscle-forearms-right"
                d="M 200 160 C 208 174 212 196 208 214 C 204 218 198 216 195 208 C 190 192 188 176 190 162 Z"
                {...getMuscleColor('forearms')}
                onClick={() => onSelectMuscle('forearms')}
                onMouseEnter={() => setHoveredMuscle('forearms')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />

              {/* ABS & CORE (6-pack & obliques) */}
              <g
                id="muscle-abs"
                onClick={() => onSelectMuscle('abs')}
                onMouseEnter={() => setHoveredMuscle('abs')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              >
                {/* Upper Abs */}
                <path
                  d="M 126 126 C 132 126 138 126 138 138 C 138 144 132 145 125 145 C 120 145 116 138 120 130 Z"
                  {...getMuscleColor('abs')}
                />
                <path
                  d="M 154 126 C 148 126 142 126 142 138 C 142 144 148 145 155 145 C 160 145 164 138 160 130 Z"
                  {...getMuscleColor('abs')}
                />
                {/* Mid Abs */}
                <path
                  d="M 126 148 C 132 148 138 148 138 160 C 138 166 132 168 125 168 C 120 168 116 160 120 152 Z"
                  {...getMuscleColor('abs')}
                />
                <path
                  d="M 154 148 C 148 148 142 148 142 160 C 142 166 148 168 155 168 C 160 168 164 160 160 152 Z"
                  {...getMuscleColor('abs')}
                />
                {/* Lower Abs / Core V-Cut */}
                <path
                  d="M 124 171 C 132 171 138 171 138 185 C 138 198 128 206 122 202 C 118 196 116 182 124 171 Z"
                  {...getMuscleColor('abs')}
                />
                <path
                  d="M 156 171 C 148 171 142 171 142 185 C 142 198 152 206 158 202 C 162 196 164 182 156 171 Z"
                  {...getMuscleColor('abs')}
                />
                {/* Obliques */}
                <path
                  d="M 104 130 C 114 132 118 152 118 176 C 114 184 108 182 106 168 C 102 156 100 142 104 130 Z"
                  {...getMuscleColor('abs')}
                />
                <path
                  d="M 176 130 C 166 132 162 152 162 176 C 166 184 172 182 174 168 C 178 156 180 142 176 130 Z"
                  {...getMuscleColor('abs')}
                />
              </g>

              {/* QUADS (Quadriceps) Left & Right */}
              <path
                id="muscle-quads-left"
                d="M 108 206 C 114 204 134 206 136 218 C 138 244 132 284 128 306 C 122 308 116 308 112 300 C 104 274 100 240 108 206 Z"
                {...getMuscleColor('quads')}
                onClick={() => onSelectMuscle('quads')}
                onMouseEnter={() => setHoveredMuscle('quads')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />
              <path
                id="muscle-quads-right"
                d="M 172 206 C 166 204 146 206 144 218 C 142 244 148 284 152 306 C 158 308 164 308 168 300 C 176 274 180 240 172 206 Z"
                {...getMuscleColor('quads')}
                onClick={() => onSelectMuscle('quads')}
                onMouseEnter={() => setHoveredMuscle('quads')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />

              {/* CALVES (Anterior / Shins) Left & Right */}
              <path
                id="muscle-calves-left"
                d="M 112 320 C 120 320 126 330 126 352 C 126 376 122 400 118 412 C 114 412 110 408 108 392 C 104 366 106 336 112 320 Z"
                {...getMuscleColor('calves')}
                onClick={() => onSelectMuscle('calves')}
                onMouseEnter={() => setHoveredMuscle('calves')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />
              <path
                id="muscle-calves-right"
                d="M 168 320 C 160 320 154 330 154 352 C 154 376 158 400 162 412 C 166 412 170 408 172 392 C 176 366 174 336 168 320 Z"
                {...getMuscleColor('calves')}
                onClick={() => onSelectMuscle('calves')}
                onMouseEnter={() => setHoveredMuscle('calves')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />
            </g>
          )}

          {/* BACK VIEW ANATOMY */}
          {view === 'back' && (
            <g id="back-view-muscles">
              {/* TRAPEZIUS / UPPER BACK */}
              <path
                id="muscle-traps"
                d="M 140 64 L 122 78 C 118 88 126 108 140 120 C 154 108 162 88 158 78 Z"
                {...getMuscleColor('back')}
                onClick={() => onSelectMuscle('back')}
                onMouseEnter={() => setHoveredMuscle('back')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />

              {/* REAR SHOULDERS Left & Right */}
              <path
                id="muscle-rear-shoulders-left"
                d="M 116 78 C 98 84 84 100 86 114 C 92 118 100 114 106 102 Z"
                {...getMuscleColor('shoulders')}
                onClick={() => onSelectMuscle('shoulders')}
                onMouseEnter={() => setHoveredMuscle('shoulders')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />
              <path
                id="muscle-rear-shoulders-right"
                d="M 164 78 C 182 84 196 100 194 114 C 188 118 180 114 174 102 Z"
                {...getMuscleColor('shoulders')}
                onClick={() => onSelectMuscle('shoulders')}
                onMouseEnter={() => setHoveredMuscle('shoulders')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />

              {/* TRICEPS Left & Right */}
              <path
                id="muscle-triceps-left"
                d="M 86 116 C 80 126 78 142 82 154 C 88 156 94 150 96 138 C 96 126 92 118 86 116 Z"
                {...getMuscleColor('triceps')}
                onClick={() => onSelectMuscle('triceps')}
                onMouseEnter={() => setHoveredMuscle('triceps')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />
              <path
                id="muscle-triceps-right"
                d="M 194 116 C 200 126 202 142 198 154 C 192 156 186 150 184 138 C 184 126 188 118 194 116 Z"
                {...getMuscleColor('triceps')}
                onClick={() => onSelectMuscle('triceps')}
                onMouseEnter={() => setHoveredMuscle('triceps')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />

              {/* LATS / BACK WINGS Left & Right */}
              <path
                id="muscle-back-left"
                d="M 124 96 C 108 106 98 132 108 168 C 114 176 124 178 132 174 C 132 152 130 118 124 96 Z"
                {...getMuscleColor('back')}
                onClick={() => onSelectMuscle('back')}
                onMouseEnter={() => setHoveredMuscle('back')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />
              <path
                id="muscle-back-right"
                d="M 156 96 C 172 106 182 132 172 168 C 166 176 156 178 148 174 C 148 152 150 118 156 96 Z"
                {...getMuscleColor('back')}
                onClick={() => onSelectMuscle('back')}
                onMouseEnter={() => setHoveredMuscle('back')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />

              {/* GLUTES (Gluteus Maximus) Left & Right */}
              <path
                id="muscle-glutes-left"
                d="M 112 188 C 122 184 138 186 138 206 C 138 230 124 242 108 234 C 102 222 104 200 112 188 Z"
                {...getMuscleColor('glutes')}
                onClick={() => onSelectMuscle('glutes')}
                onMouseEnter={() => setHoveredMuscle('glutes')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />
              <path
                id="muscle-glutes-right"
                d="M 168 188 C 158 184 142 186 142 206 C 142 230 156 242 172 234 C 178 222 176 200 168 188 Z"
                {...getMuscleColor('glutes')}
                onClick={() => onSelectMuscle('glutes')}
                onMouseEnter={() => setHoveredMuscle('glutes')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />

              {/* HAMSTRINGS Left & Right */}
              <path
                id="muscle-hamstrings-left"
                d="M 108 238 C 122 244 136 242 134 266 C 132 290 126 308 116 308 C 108 300 102 270 108 238 Z"
                {...getMuscleColor('hamstrings')}
                onClick={() => onSelectMuscle('hamstrings')}
                onMouseEnter={() => setHoveredMuscle('hamstrings')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />
              <path
                id="muscle-hamstrings-right"
                d="M 172 238 C 158 244 144 242 146 266 C 148 290 154 308 164 308 C 172 300 178 270 172 238 Z"
                {...getMuscleColor('hamstrings')}
                onClick={() => onSelectMuscle('hamstrings')}
                onMouseEnter={() => setHoveredMuscle('hamstrings')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />

              {/* CALVES (Gastrocnemius) Left & Right */}
              <path
                id="muscle-back-calves-left"
                d="M 112 320 C 122 320 128 332 128 356 C 128 382 122 406 118 412 C 114 412 108 404 106 386 C 102 360 106 332 112 320 Z"
                {...getMuscleColor('calves')}
                onClick={() => onSelectMuscle('calves')}
                onMouseEnter={() => setHoveredMuscle('calves')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />
              <path
                id="muscle-back-calves-right"
                d="M 168 320 C 158 320 152 332 152 356 C 152 382 158 406 162 412 C 166 412 172 404 174 386 C 178 360 174 332 168 320 Z"
                {...getMuscleColor('calves')}
                onClick={() => onSelectMuscle('calves')}
                onMouseEnter={() => setHoveredMuscle('calves')}
                onMouseLeave={() => setHoveredMuscle(null)}
                className="cursor-pointer transition-all duration-200"
              />
            </g>
          )}
        </svg>

        {/* Hover Floating Tooltip */}
        {activeHoveredData && (
          <div
            className="absolute top-2 left-3 pointer-events-none px-3 py-1.5 rounded-xl border shadow-sm text-right"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <span
              className="text-xs font-bold block"
              style={{ color: colors.textPrimary }}
            >
              {activeHoveredData.muscle_name}
            </span>
            <div
              className="flex items-center gap-1.5 text-[10px] font-mono font-bold"
              style={{ color: colors.accent }}
            >
              <span>الرتبة: {activeHoveredData.rank}</span>
              {activeHoveredData.score > 0 && <span>• {activeHoveredData.score}/100</span>}
            </div>
          </div>
        )}
      </div>

      {/* Ranked System Legend */}
      <div
        className="pt-3 border-t flex items-center justify-between text-[11px] select-none flex-wrap gap-2"
        style={{
          borderColor: colors.border,
          color: colors.textSecondary,
        }}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full border"
            style={{
              backgroundColor: isDark ? '#171719' : '#F0F4F4',
              borderColor: colors.border,
            }}
          />
          <span className="text-[10px]">غير مصنف</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#CD7F32' }} />
          <span className="text-[10px]">برونزي</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#CBD5E1' }} />
          <span className="text-[10px]">فضي</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
          <span className="text-[10px]">ذهبي</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#38BDF8' }} />
          <span className="text-[10px]">بلاتيني</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#06B6D4' }} />
          <span className="text-[10px]">ماسي</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#A855F7' }} />
          <span className="text-[10px]">أنريل</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#E11D48' }} />
          <span className="text-[10px] font-bold" style={{ color: '#E11D48' }}>توب 50</span>
        </div>
      </div>
    </div>
  );
};
