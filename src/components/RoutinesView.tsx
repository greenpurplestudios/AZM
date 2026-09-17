import React, { useState, useEffect } from 'react';
import { Routine, Exercise } from '../types';
import { db } from '../db/dexie';
import { Dumbbell, Play, Plus, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface RoutinesViewProps {
  onStartRoutine: (routine: Routine) => void;
  onStartQuickWorkout: () => void;
}

export const RoutinesView: React.FC<RoutinesViewProps> = ({
  onStartRoutine,
  onStartQuickWorkout,
}) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const allRoutines = await db.routines.toArray();
      const allExercises = await db.exercises.toArray();
      setRoutines(allRoutines);
      setExercises(allExercises);
    };
    loadData();
  }, []);

  const getExerciseName = (exId: string) => {
    return exercises.find((e) => e.id === exId)?.name || 'تمرين';
  };

  const handleDeleteRoutine = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await db.routines.delete(id);
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div
      id="routines-view"
      className="relative isolate min-h-[calc(100vh-76px)] overflow-hidden p-4 space-y-6 max-w-xl mx-auto pb-28 text-[#F4F5F3]"
    >
      {/* Dedicated Workout Routines & Plans Background Layer */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <img
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop"
          alt="جداول وبرامج التمارين"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-105 filter contrast-125 brightness-90 opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070B0A]/92 via-[#070B0A]/80 to-[#070B0A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(107,175,143,0.18),_transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(22,46,39,0.35),_transparent_75%)]" />
      </div>

      {/* Top Banner & Quick Start */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-emerald-400" />
            <span>جداول التمارين</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            اختر جدولاً جاهزاً أو ابدأ جلسة حرة وفورية في صالة الحديد
          </p>
        </div>

        <button
          onClick={onStartQuickWorkout}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-emerald-500/20 active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>تمرين حر</span>
        </button>
      </div>

      {/* Routines List */}
      <div className="space-y-3">
        {routines.map((routine) => {
          const isExpanded = expandedRoutineId === routine.id;

          return (
            <div
              key={routine.id}
              className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl transition"
            >
              <div
                onClick={() => setExpandedRoutineId(isExpanded ? null : routine.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{routine.title}</h3>
                    {routine.target_goal && (
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {routine.target_goal}
                      </span>
                    )}
                  </div>
                  {routine.description && (
                    <p className="text-xs text-slate-400">{routine.description}</p>
                  )}
                  <span className="text-[11px] text-slate-500 block pt-0.5">
                    {routine.exercises.length} تمارين مدرجة
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartRoutine(routine);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 font-bold text-xs transition active:scale-95 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>ابدأ</span>
                  </button>

                  <button className="p-1 text-slate-400 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Exercises preview */}
              {isExpanded && (
                <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 space-y-2.5 text-xs animate-in slide-in-from-top-2">
                  <div className="space-y-2">
                    {routine.exercises.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/60"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center font-mono text-[11px] font-bold text-emerald-400">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-white block">{getExerciseName(item.exercise_id)}</span>
                            {item.tips && <span className="text-[10px] text-slate-400">{item.tips}</span>}
                          </div>
                        </div>

                        <div className="text-slate-300 font-mono text-xs">
                          <span>{item.target_sets} جولات</span> × <span>{item.target_reps} تكرار</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={(e) => handleDeleteRoutine(e, routine.id)}
                      className="text-xs text-slate-500 hover:text-rose-400 transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف الجدول</span>
                    </button>

                    <button
                      onClick={() => onStartRoutine(routine)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      بدء هذا التمرين الآن
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
