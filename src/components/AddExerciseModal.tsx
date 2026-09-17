import React, { useState } from 'react';
import { Exercise, ExerciseCategory, EquipmentType } from '../types';
import { db } from '../db/dexie';
import { Search, Plus, X, Dumbbell, Check, Filter } from 'lucide-react';

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  existingExercises: Exercise[];
  userEquipment?: EquipmentType[];
}

const CATEGORIES: { key: ExerciseCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'chest', label: 'صدر' },
  { key: 'back', label: 'ظهر' },
  { key: 'legs', label: 'أرجل' },
  { key: 'shoulders', label: 'أكتاف' },
  { key: 'arms', label: 'ذراعين' },
  { key: 'core', label: 'كور وبطن' },
];

export const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
  existingExercises,
  userEquipment = ['full_gym'],
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<ExerciseCategory | 'all'>('all');
  const [filterByEquipment, setFilterByEquipment] = useState(true);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customNameEn, setCustomNameEn] = useState('');
  const [customCategory, setCustomCategory] = useState<ExerciseCategory>('chest');

  if (!isOpen) return null;

  const hasFullGym = userEquipment.includes('full_gym');

  const filtered = existingExercises.filter((ex) => {
    const matchesCat = selectedCat === 'all' || ex.category === selectedCat;
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      (ex.name_en && ex.name_en.toLowerCase().includes(search.toLowerCase()));

    // Equipment filter check
    let matchesEquipment = true;
    if (filterByEquipment && !hasFullGym && userEquipment.length > 0) {
      if (ex.equipment_type) {
        matchesEquipment = userEquipment.includes(ex.equipment_type as EquipmentType);
      }
    }

    return matchesCat && matchesSearch && matchesEquipment;
  });

  const handleCreateCustom = async () => {
    if (!customName.trim()) return;

    const newEx: Exercise = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      name_en: customNameEn.trim() || undefined,
      category: customCategory,
      is_custom: true,
      equipment: 'مخصص',
      equipment_type: 'bodyweight',
    };

    await db.exercises.put(newEx);
    onSelectExercise(newEx);
    setShowCustomForm(false);
    setCustomName('');
    onClose();
  };

  return (
    <div
      id="modal-add-exercise"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#070B0A]/85 backdrop-blur-md animate-in fade-in"
    >
      <div className="w-full max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-[#0E1A17] border border-[#1F3A34] flex flex-col overflow-hidden shadow-2xl text-[#F4F5F3]">
        {/* Header */}
        <div className="p-4 border-b border-[#1F3A34] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#1F3A34] text-[#6BAF8F]">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#F4F5F3]">إضافة تمرين إلى الجلسة</h3>
              <p className="text-[10px] text-[#C8E6CF]/70">اختر تمريناً من القائمة أو أضف تمريناً مخصصاً</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#C8E6CF]/60 hover:text-[#F4F5F3] hover:bg-[#1F3A34]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 space-y-3 bg-[#070B0A]/50 border-b border-[#1F3A34]">
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8E6CF]/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم العربي أو الإنجليزي (بنش، سكوات، ديدليفت)..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-[#070B0A] border border-[#1F3A34] text-xs text-[#F4F5F3] placeholder-[#C8E6CF]/40 focus:outline-none focus:border-[#6BAF8F] transition"
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-[70%]">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCat(cat.key)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                    selectedCat === cat.key
                      ? 'bg-[#6BAF8F] text-[#070B0A] shadow-sm shadow-[#6BAF8F]/20'
                      : 'bg-[#0E1A17] text-[#C8E6CF]/70 border border-[#1F3A34] hover:text-[#F4F5F3]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Equipment Filter Toggle */}
            <button
              onClick={() => setFilterByEquipment(!filterByEquipment)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition whitespace-nowrap ${
                filterByEquipment
                  ? 'bg-[#1F3A34] border-[#6BAF8F] text-[#C8E6CF]'
                  : 'bg-[#070B0A] border-[#1F3A34] text-[#C8E6CF]/50'
              }`}
              title="فلترة حسب معداتك المتاحة"
            >
              <Filter className="w-3 h-3 text-[#6BAF8F]" />
              <span>معداتي فقط</span>
            </button>
          </div>
        </div>

        {/* List of exercises */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-[#1F3A34]/50">
          {showCustomForm ? (
            <div className="p-4 rounded-2xl bg-[#070B0A] border border-[#6BAF8F]/40 space-y-3">
              <h4 className="text-xs font-bold text-[#6BAF8F] flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> تمرين مخصص جديد
              </h4>
              <div>
                <label className="text-[11px] text-[#C8E6CF]/70">اسم التمرين (بالعربية)</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="مثال: رفرفة كابل مائل سفلي"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#0E1A17] border border-[#1F3A34] text-xs text-[#F4F5F3] focus:outline-none focus:border-[#6BAF8F]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#C8E6CF]/70">الاسم الإنجليزي (اختياري)</label>
                <input
                  type="text"
                  value={customNameEn}
                  onChange={(e) => setCustomNameEn(e.target.value)}
                  placeholder="e.g. Low Incline Cable Fly"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#0E1A17] border border-[#1F3A34] text-xs text-[#F4F5F3] focus:outline-none focus:border-[#6BAF8F]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#C8E6CF]/70">الفئة العضلية</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as ExerciseCategory)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#0E1A17] border border-[#1F3A34] text-xs text-[#F4F5F3] focus:outline-none focus:border-[#6BAF8F]"
                >
                  <option value="chest">صدر (Chest)</option>
                  <option value="back">ظهر (Back)</option>
                  <option value="legs">أرجل (Legs)</option>
                  <option value="shoulders">أكتاف (Shoulders)</option>
                  <option value="arms">ذراعين (Arms)</option>
                  <option value="core">كور وبطن (Core)</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleCreateCustom}
                  className="flex-1 py-2 rounded-xl bg-[#6BAF8F] text-[#070B0A] font-black text-xs transition"
                >
                  حفظ واختيار
                </button>
                <button
                  onClick={() => setShowCustomForm(false)}
                  className="px-3 py-2 rounded-xl bg-[#1F3A34] text-[#C8E6CF] text-xs font-bold"
                >
                  إلغاء
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCustomForm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-[#6BAF8F]/40 text-[#6BAF8F] hover:bg-[#1F3A34]/30 text-xs font-bold transition mb-3"
            >
              <Plus className="w-4 h-4" /> تمرين مخصص جديد غير مدرج
            </button>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-8 text-[#C8E6CF]/50 text-xs space-y-2">
              <p>لم نعثر على تمرين مطابق لمعداتك الحالية أو البحث.</p>
              {filterByEquipment && (
                <button
                  onClick={() => setFilterByEquipment(false)}
                  className="text-[#6BAF8F] underline block mx-auto text-xs"
                >
                  عرض جميع التمارين دون فلترة المعدات
                </button>
              )}
            </div>
          ) : (
            filtered.map((ex) => (
              <div
                key={ex.id}
                onClick={() => {
                  onSelectExercise(ex);
                  onClose();
                }}
                className="group pt-2 flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1F3A34]/40 transition cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#F4F5F3] group-hover:text-[#6BAF8F] transition">
                    {ex.name}
                  </h4>
                  {ex.name_en && (
                    <p className="text-[10px] text-[#C8E6CF]/50 font-mono tracking-wide">
                      {ex.name_en}
                    </p>
                  )}
                  {ex.equipment && (
                    <span className="inline-block mt-1 text-[9px] text-[#C8E6CF]/70 bg-[#070B0A] border border-[#1F3A34] px-1.5 py-0.5 rounded">
                      {ex.equipment}
                    </span>
                  )}
                </div>
                <div className="p-2 rounded-xl bg-[#070B0A] border border-[#1F3A34] group-hover:bg-[#6BAF8F] group-hover:text-[#070B0A] text-[#C8E6CF] transition">
                  <Check className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
