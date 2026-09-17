import React, { useState, useEffect } from 'react';
import { Check, Plus, Trash2, Calendar, Sparkles, Filter } from 'lucide-react';
import { db } from '../db/dexie';
import { DailyObjective } from '../types';
import { useTheme } from '../context/ThemeContext';

export const GoalsView: React.FC = () => {
  const { isDark, colors } = useTheme();
  const [objectives, setObjectives] = useState<DailyObjective[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'fitness' | 'study' | 'habit' | 'mind' | 'general'>('all');
  const [isAdding, setIsAdding] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const loadObjectives = async () => {
    try {
      const list = await db.daily_objectives.where('date').equals(todayStr).toArray();
      setObjectives(list);
    } catch (err) {
      console.error('Failed to load objectives:', err);
    }
  };

  useEffect(() => {
    loadObjectives();
  }, [todayStr]);

  const toggleObjective = async (id: string, currentCompleted: boolean) => {
    const updated = !currentCompleted;
    setObjectives((prev) =>
      prev.map((o) => (o.id === id ? { ...o, completed: updated } : o))
    );
    try {
      await db.daily_objectives.update(id, { completed: updated });
    } catch (err) {
      console.error('Failed to update objective:', err);
    }
  };

  const handleAddObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newObj: DailyObjective = {
      id: `obj_${Date.now()}`,
      title: newTitle.trim(),
      date: todayStr,
      completed: false,
      category: selectedCategory === 'all' ? 'general' : selectedCategory,
      created_at: new Date().toISOString(),
    };

    setObjectives((prev) => [...prev, newObj]);
    setNewTitle('');
    setIsAdding(false);

    try {
      await db.daily_objectives.put(newObj);
    } catch (err) {
      console.error('Failed to add objective:', err);
    }
  };

  const handleDeleteObjective = async (id: string) => {
    setObjectives((prev) => prev.filter((o) => o.id !== id));
    try {
      await db.daily_objectives.delete(id);
    } catch (err) {
      console.error('Failed to delete objective:', err);
    }
  };

  const completedCount = objectives.filter((o) => o.completed).length;
  const totalCount = objectives.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredObjectives = selectedCategory === 'all'
    ? objectives
    : objectives.filter((o) => o.category === selectedCategory);

  return (
    <div
      id="azm-goals-view"
      className="p-4 sm:p-6 max-w-xl mx-auto space-y-7 pb-28 text-right select-none transition-colors duration-200"
    >
      {/* 1. Header */}
      <div className="space-y-1">
        <span
          className="text-xs font-semibold uppercase tracking-wider block"
          style={{ color: colors.textMuted }}
        >
          أهداف اليوم • Daily Objectives
        </span>
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: colors.textPrimary }}
        >
          ما الذي تريد إنجازه اليوم؟
        </h1>
      </div>

      {/* 2. Progress Summary Card */}
      <div
        className="p-5 rounded-2xl border transition-colors"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs font-medium"
            style={{ color: colors.textSecondary }}
          >
            نسبة الإنجاز اليومية
          </span>
          <span
            className="text-base font-bold font-mono"
            style={{ color: colors.accent }}
          >
            {completedCount} / {totalCount} ({progressPercent}%)
          </span>
        </div>

        {/* Minimal Progress Bar */}
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: isDark ? '#29292D' : '#DDE4E4' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: colors.accent,
            }}
          />
        </div>
      </div>

      {/* 3. Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'all', label: 'الكل' },
          { id: 'fitness', label: 'لياقة وتدريب' },
          { id: 'study', label: 'دراسة ومذاكرة' },
          { id: 'habit', label: 'عادات وروتين' },
          { id: 'mind', label: 'قراءة وتطوير' },
        ].map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className="px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all"
              style={{
                backgroundColor: isSelected
                  ? isDark
                    ? '#1D1D20'
                    : '#FFFFFF'
                  : 'transparent',
                borderColor: isSelected ? colors.accent : colors.border,
                color: isSelected ? colors.accent : colors.textSecondary,
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 4. Objectives List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: colors.textMuted }}
          >
            قائمة المهام اليومية
          </span>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="text-xs font-semibold flex items-center gap-1 hover:underline transition-all"
              style={{ color: colors.accent }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة هدف</span>
            </button>
          )}
        </div>

        {/* Quick Add Form */}
        {isAdding && (
          <form
            onSubmit={handleAddObjective}
            className="p-3.5 rounded-xl border space-y-3 transition-colors"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.accent,
            }}
          >
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="اكتب هدفك اليوم (مثال: قراءة 15 صفحة)..."
              autoFocus
              className="w-full bg-transparent text-sm focus:outline-hidden placeholder:opacity-50"
              style={{ color: colors.textPrimary }}
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewTitle('');
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                style={{
                  borderColor: colors.border,
                  color: colors.textSecondary,
                }}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-opacity"
                style={{ backgroundColor: colors.accent }}
              >
                حفظ الهدف
              </button>
            </div>
          </form>
        )}

        {/* List items */}
        {filteredObjectives.length === 0 ? (
          <div
            className="p-8 rounded-2xl border text-center space-y-2"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: colors.textSecondary }}
            >
              لا توجد أهداف متبقية في هذا التصنيف.
            </p>
          </div>
        ) : (
          filteredObjectives.map((obj) => {
            return (
              <div
                key={obj.id}
                className="group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: obj.completed ? 0.7 : 1,
                }}
              >
                <div
                  onClick={() => toggleObjective(obj.id, obj.completed)}
                  className="flex items-center gap-3 cursor-pointer flex-1 select-none"
                >
                  {/* Subtle Checkbox */}
                  <div
                    className="w-5 h-5 rounded-md border flex items-center justify-center transition-all"
                    style={{
                      borderColor: obj.completed ? colors.accent : colors.border,
                      backgroundColor: obj.completed ? colors.accent : 'transparent',
                    }}
                  >
                    {obj.completed && (
                      <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    )}
                  </div>

                  {/* Title */}
                  <span
                    className={`text-sm font-medium transition-colors ${
                      obj.completed ? 'line-through' : ''
                    }`}
                    style={{
                      color: obj.completed ? colors.textMuted : colors.textPrimary,
                    }}
                  >
                    {obj.title}
                  </span>
                </div>

                {/* Delete action */}
                <button
                  onClick={() => handleDeleteObjective(obj.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/10 transition-opacity"
                  title="حذف الهدف"
                  style={{ color: colors.textMuted }}
                >
                  <Trash2 className="w-3.5 h-3.5 hover:text-red-500 transition-colors" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
