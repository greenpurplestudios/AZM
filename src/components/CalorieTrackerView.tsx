import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, FoodItem, FoodLogEntry, MealType, NutritionUnit } from '../types';
import { db } from '../db/dexie';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  searchFoodDatabase,
  parseFoodQuery,
  calculateFoodNutrition,
  VERIFIED_FOOD_DATABASE,
} from '../data/foodDatabase';
import {
  calculateAthleticTargets,
  BMRCalculationInput,
  CalculatedNutritionTargets,
} from '../utils/nutritionCalculations';
import {
  Utensils,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  Flame,
  Scale,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Settings2,
  Info,
  Calendar,
  Apple,
  Fish,
  Beef,
} from 'lucide-react';

interface CalorieTrackerViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onBack: () => void;
}

export const CalorieTrackerView: React.FC<CalorieTrackerViewProps> = ({
  userProfile,
  onUpdateProfile,
  onBack,
}) => {
  const { isDark, colors } = useTheme();
  const { isRTL, t } = useLanguage();

  // Selected date for food log (defaults to today YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Daily logged food entries from Dexie
  const [dailyLogs, setDailyLogs] = useState<FoodLogEntry[]>([]);

  // Search & Logging Modal/Section State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetMeal, setTargetMeal] = useState<MealType>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantityInput, setQuantityInput] = useState<number>(100);
  const [selectedUnit, setSelectedUnit] = useState<NutritionUnit>('g');

  // Calculator Modal State (Mifflin-St Jeor)
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [calcInput, setCalcInput] = useState<BMRCalculationInput>({
    weight_kg: userProfile.weight_kg || 75,
    height_cm: userProfile.height_cm || 175,
    age: userProfile.age || 25,
    gender: userProfile.gender || 'male',
    activity_level: userProfile.activity_level || 'moderate',
    fitness_goal: userProfile.fitness_goal || 'maintain',
  });
  const [saveCalcSuccess, setSaveCalcSuccess] = useState(false);

  // Load food logs from Dexie
  const loadDailyLogs = async () => {
    try {
      const entries = await db.food_logs.where('date').equals(selectedDate).toArray();
      setDailyLogs(entries);
    } catch (e) {
      console.error('Error loading food logs:', e);
    }
  };

  useEffect(() => {
    loadDailyLogs();
  }, [selectedDate]);

  // Live search results
  const searchResults = useMemo(() => {
    return searchFoodDatabase(searchQuery);
  }, [searchQuery]);

  // When search query changes, check if query contains quantity / unit
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const parsed = parseFoodQuery(val);
    if (parsed.detectedQuantity) {
      setQuantityInput(parsed.detectedQuantity);
    }
    if (parsed.detectedUnit) {
      setSelectedUnit(parsed.detectedUnit);
    }
  };

  // Select a food item to log
  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    const parsed = parseFoodQuery(searchQuery);
    if (parsed.detectedQuantity) {
      setQuantityInput(parsed.detectedQuantity);
    } else {
      setQuantityInput(food.serving_size_g || 100);
    }
    if (parsed.detectedUnit && food.allowed_units.includes(parsed.detectedUnit)) {
      setSelectedUnit(parsed.detectedUnit);
    } else if (food.allowed_units.includes('g')) {
      setSelectedUnit('g');
    } else {
      setSelectedUnit(food.allowed_units[0]);
    }
  };

  // Preview nutrition values for currently selected food + quantity + unit
  const livePreviewNutrition = useMemo(() => {
    if (!selectedFood) return null;
    return calculateFoodNutrition(selectedFood, quantityInput, selectedUnit);
  }, [selectedFood, quantityInput, selectedUnit]);

  // Add food entry to Dexie
  const handleLogFood = async () => {
    if (!selectedFood || quantityInput <= 0) return;
    const nutrition = calculateFoodNutrition(selectedFood, quantityInput, selectedUnit);

    const newEntry: FoodLogEntry = {
      id: `food_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      date: selectedDate,
      meal: targetMeal,
      food_id: selectedFood.id,
      food_name_ar: selectedFood.name_ar,
      food_name_en: selectedFood.name_en,
      quantity: quantityInput,
      unit: selectedUnit,
      calories: nutrition.calories,
      protein_g: nutrition.protein,
      carbs_g: nutrition.carbs,
      fat_g: nutrition.fat,
      created_at: new Date().toISOString(),
    };

    await db.food_logs.put(newEntry);
    await loadDailyLogs();

    // Reset modal
    setSelectedFood(null);
    setSearchQuery('');
    setIsAddModalOpen(false);
  };

  // Delete food log entry
  const handleDeleteEntry = async (id: string) => {
    await db.food_logs.delete(id);
    await loadDailyLogs();
  };

  // Calculate daily totals
  const dailyTotals = useMemo(() => {
    return dailyLogs.reduce(
      (acc, curr) => {
        acc.calories += curr.calories;
        acc.protein += curr.protein_g;
        acc.carbs += curr.carbs_g;
        acc.fat += curr.fat_g;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [dailyLogs]);

  // User nutrition targets (from profile or calculated defaults)
  const userTargets = useMemo(() => {
    const calculated = calculateAthleticTargets(calcInput);
    return {
      calories: userProfile.target_calories || calculated.target_calories,
      protein: userProfile.target_protein_g || calculated.protein_g,
      carbs: userProfile.target_carbs_g || calculated.carbs_g,
      fat: userProfile.target_fat_g || calculated.fat_g,
      water: userProfile.daily_water_target_ml || calculated.water_target_ml,
    };
  }, [userProfile, calcInput]);

  // Live calculator calculation
  const liveCalculatedTargets = useMemo(() => {
    return calculateAthleticTargets(calcInput);
  }, [calcInput]);

  // Save calculated targets to profile
  const handleSaveCalculatedTargets = async () => {
    const updated: UserProfile = {
      ...userProfile,
      weight_kg: calcInput.weight_kg,
      height_cm: calcInput.height_cm,
      age: calcInput.age,
      gender: calcInput.gender,
      activity_level: calcInput.activity_level,
      fitness_goal: calcInput.fitness_goal,
      target_calories: liveCalculatedTargets.target_calories,
      target_protein_g: liveCalculatedTargets.protein_g,
      target_carbs_g: liveCalculatedTargets.carbs_g,
      target_fat_g: liveCalculatedTargets.fat_g,
      daily_water_target_ml: liveCalculatedTargets.water_target_ml,
    };

    await db.user_profile.put(updated);
    onUpdateProfile(updated);
    setSaveCalcSuccess(true);
    setTimeout(() => {
      setSaveCalcSuccess(false);
      setShowCalculatorModal(false);
    }, 1500);
  };

  const mealSections: { id: MealType; label_ar: string; label_en: string }[] = [
    { id: 'breakfast', label_ar: 'الفطور', label_en: 'Breakfast' },
    { id: 'lunch', label_ar: 'الغداء', label_en: 'Lunch' },
    { id: 'dinner', label_ar: 'العشاء', label_en: 'Dinner' },
    { id: 'snack', label_ar: 'وجبات خفيفة', label_en: 'Snacks' },
  ];

  return (
    <div
      id="calorie-tracker-view"
      className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6 pb-36 text-right select-none transition-colors duration-200"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: colors.border }}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition hover:opacity-80 active:scale-95"
            style={{
              borderColor: colors.border,
              backgroundColor: isDark ? '#141417' : '#F8FAFA',
              color: colors.textPrimary,
            }}
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{t('common.back')}</span>
          </button>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: colors.accent }}>
              {t('calories.title')}
            </span>
            <h2 className="text-xl sm:text-2xl font-black" style={{ color: colors.textPrimary }}>
              {isRTL ? 'تتبع الوجبات والماكروز' : 'Macro & Food Tracker'}
            </h2>
          </div>
        </div>

        <button
          onClick={() => setShowCalculatorModal(true)}
          className="p-2.5 rounded-2xl border flex items-center gap-1.5 text-xs font-bold transition active:scale-95 shadow-xs"
          style={{
            backgroundColor: isDark ? '#1a1a1f' : '#f0fdfa',
            borderColor: colors.accent,
            color: colors.accent,
          }}
          title={isRTL ? 'حاسبة الاحتياج اليومي والمعادلات' : 'Calorie Target Calculator'}
        >
          <Settings2 className="w-4 h-4" />
          <span className="hidden sm:inline">{t('calories.recalculate')}</span>
        </button>
      </div>

      {/* Daily Macro & Calorie Summary Card */}
      <div
        className="rounded-3xl border p-5 space-y-5 shadow-xs transition-all"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-mono uppercase font-bold" style={{ color: colors.accent }}>
              {t('calories.today_summary')}
            </span>
            <h3 className="text-base font-black" style={{ color: colors.textPrimary }}>
              {isRTL ? 'السعرات والقيم الغذائية اليومية' : 'Daily Macro Allocation'}
            </h3>
          </div>

          <div
            className="px-3 py-1 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5"
            style={{
              borderColor: colors.border,
              backgroundColor: isDark ? '#141417' : '#F8FAFA',
              color: colors.textSecondary,
            }}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{selectedDate}</span>
          </div>
        </div>

        {/* Calories Highlight Meter */}
        <div
          className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{
            backgroundColor: isDark ? '#141417' : '#F8FAFA',
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0"
              style={{ backgroundColor: colors.accent, color: '#fff' }}
            >
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold block" style={{ color: colors.textMuted }}>
                {t('calories.calories')}
              </span>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-2xl font-black" style={{ color: colors.textPrimary }}>
                  {dailyTotals.calories}
                </span>
                <span className="text-xs font-bold" style={{ color: colors.textSecondary }}>
                  / {userTargets.calories} {t('common.kcal')}
                </span>
              </div>
            </div>
          </div>

          {/* Remaining Indicator */}
          <div className="text-left font-mono">
            <span className="text-xs font-bold block" style={{ color: colors.textMuted }}>
              {t('calories.remaining')}
            </span>
            <span
              className="text-lg font-black"
              style={{
                color: userTargets.calories - dailyTotals.calories < 0 ? '#EF4444' : colors.accent,
              }}
            >
              {userTargets.calories - dailyTotals.calories}{' '}
              <span className="text-xs font-normal" style={{ color: colors.textSecondary }}>
                {t('common.kcal')}
              </span>
            </span>
          </div>
        </div>

        {/* 3 Macro Progress Bars (Protein, Carbs, Fat) */}
        <div className="grid grid-cols-3 gap-3">
          {/* Protein */}
          <div
            className="p-3 rounded-2xl border space-y-1.5"
            style={{
              backgroundColor: isDark ? '#141417' : '#F8FAFA',
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span style={{ color: colors.textPrimary }}>{t('calories.protein')}</span>
              <span className="text-[10px] font-mono font-bold" style={{ color: colors.accent }}>
                {Math.round(dailyTotals.protein)} / {userTargets.protein} {t('common.g')}
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden bg-black/10 dark:bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round((dailyTotals.protein / userTargets.protein) * 100))}%`,
                  backgroundColor: colors.accent,
                }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div
            className="p-3 rounded-2xl border space-y-1.5"
            style={{
              backgroundColor: isDark ? '#141417' : '#F8FAFA',
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span style={{ color: colors.textPrimary }}>{t('calories.carbs')}</span>
              <span className="text-[10px] font-mono font-bold" style={{ color: colors.textSecondary }}>
                {Math.round(dailyTotals.carbs)} / {userTargets.carbs} {t('common.g')}
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden bg-black/10 dark:bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round((dailyTotals.carbs / userTargets.carbs) * 100))}%`,
                  backgroundColor: isDark ? '#60A5FA' : '#3B82F6',
                }}
              />
            </div>
          </div>

          {/* Fat */}
          <div
            className="p-3 rounded-2xl border space-y-1.5"
            style={{
              backgroundColor: isDark ? '#141417' : '#F8FAFA',
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span style={{ color: colors.textPrimary }}>{t('calories.fat')}</span>
              <span className="text-[10px] font-mono font-bold" style={{ color: colors.textSecondary }}>
                {Math.round(dailyTotals.fat)} / {userTargets.fat} {t('common.g')}
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden bg-black/10 dark:bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round((dailyTotals.fat / userTargets.fat) * 100))}%`,
                  backgroundColor: isDark ? '#F59E0B' : '#D97706',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Meals Log Sections (Breakfast, Lunch, Dinner, Snacks) */}
      <div className="space-y-4">
        {mealSections.map((section) => {
          const sectionEntries = dailyLogs.filter((e) => e.meal === section.id);
          const sectionCalories = sectionEntries.reduce((sum, e) => sum + e.calories, 0);
          const sectionProtein = sectionEntries.reduce((sum, e) => sum + e.protein_g, 0);

          return (
            <div
              key={section.id}
              className="rounded-3xl border p-4 space-y-3 shadow-xs"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black" style={{ color: colors.textPrimary }}>
                    {isRTL ? section.label_ar : section.label_en}
                  </h4>
                  <span className="text-xs font-mono font-bold" style={{ color: colors.textSecondary }}>
                    ({sectionCalories} {t('common.kcal')} • {Math.round(sectionProtein)} {isRTL ? 'غ بروتين' : 'g Protein'})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTargetMeal(section.id);
                    setIsAddModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition active:scale-95"
                  style={{
                    backgroundColor: isDark ? '#1f1f26' : '#f0fdfa',
                    borderColor: colors.border,
                    color: colors.accent,
                  }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('calories.add_food')}</span>
                </button>
              </div>

              {sectionEntries.length === 0 ? (
                <p className="text-xs py-2 text-center" style={{ color: colors.textMuted }}>
                  {isRTL ? 'لم يتم تسجيل وجبات هنا بعد.' : 'No foods logged for this meal yet.'}
                </p>
              ) : (
                <div className="space-y-2">
                  {sectionEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-2.5 rounded-2xl border text-xs"
                      style={{
                        backgroundColor: isDark ? '#141417' : '#F8FAFA',
                        borderColor: colors.border,
                      }}
                    >
                      <div className="space-y-0.5">
                        <span className="font-black block" style={{ color: colors.textPrimary }}>
                          {isRTL ? entry.food_name_ar : entry.food_name_en}
                        </span>
                        <span className="text-[11px] font-mono" style={{ color: colors.textMuted }}>
                          {entry.quantity} {entry.unit} • {entry.protein_g} {isRTL ? 'غ بروتين' : 'g P'} • {entry.carbs_g} {isRTL ? 'غ كارب' : 'g C'} • {entry.fat_g} {isRTL ? 'غ دهون' : 'g F'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black" style={{ color: colors.accent }}>
                          {entry.calories} {t('common.kcal')}
                        </span>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1 rounded-lg transition hover:opacity-70 text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ADD FOOD MODAL / DRAWER */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              direction: isRTL ? 'rtl' : 'ltr',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: colors.border }}>
              <h3 className="text-sm font-black" style={{ color: colors.textPrimary }}>
                {t('calories.add_food')} - {mealSections.find((m) => m.id === targetMeal)?.[isRTL ? 'label_ar' : 'label_en']}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs font-bold px-2 py-1 rounded-lg border"
                style={{ borderColor: colors.border, color: colors.textSecondary }}
              >
                {t('common.cancel')}
              </button>
            </div>

            {/* Smart Search Input */}
            <div className="relative">
              <Search
                className="w-4 h-4 absolute top-3.5 right-3 pointer-events-none"
                style={{ color: colors.accent }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t('calories.search_placeholder')}
                className="w-full p-2.5 pr-9 pl-3 rounded-2xl border text-xs font-bold focus:outline-hidden"
                style={{
                  backgroundColor: isDark ? '#141417' : '#F8FAFA',
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
                autoFocus
              />
            </div>

            {/* Selected Food & Quantity Adjuster */}
            {selectedFood && livePreviewNutrition && (
              <div
                className="p-4 rounded-2xl border space-y-3 shadow-xs"
                style={{
                  backgroundColor: isDark ? '#191920' : '#F0F9F8',
                  borderColor: colors.accent,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black" style={{ color: colors.textPrimary }}>
                      {isRTL ? selectedFood.name_ar : selectedFood.name_en}
                    </h4>
                    <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>
                      {selectedFood.data_source}
                    </span>
                  </div>
                  <div className="text-right font-mono font-black" style={{ color: colors.accent }}>
                    {livePreviewNutrition.calories} {t('common.kcal')}
                  </div>
                </div>

                {/* Quantity & Unit inputs */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold block mb-1" style={{ color: colors.textSecondary }}>
                      {isRTL ? 'الكمية:' : 'Quantity:'}
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="1"
                      value={quantityInput || ''}
                      onChange={(e) => setQuantityInput(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 rounded-xl border text-xs font-mono font-bold focus:outline-hidden"
                      style={{
                        backgroundColor: isDark ? '#141417' : '#FFFFFF',
                        borderColor: colors.border,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold block mb-1" style={{ color: colors.textSecondary }}>
                      {isRTL ? 'الوحدة:' : 'Unit:'}
                    </label>
                    <select
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value as NutritionUnit)}
                      className="w-full p-2 rounded-xl border text-xs font-bold focus:outline-hidden"
                      style={{
                        backgroundColor: isDark ? '#141417' : '#FFFFFF',
                        borderColor: colors.border,
                        color: colors.textPrimary,
                      }}
                    >
                      {selectedFood.allowed_units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit === 'g'
                            ? isRTL
                              ? 'غرام (g)'
                              : 'Grams (g)'
                            : unit === 'kg'
                            ? isRTL
                              ? 'كيلوغرام (kg)'
                              : 'Kilogram (kg)'
                            : unit === 'piece'
                            ? isRTL
                              ? 'حبة / قطعة'
                              : 'Piece'
                            : unit === 'cup'
                            ? isRTL
                              ? 'كوب'
                              : 'Cup'
                            : unit === 'serving'
                            ? isRTL
                              ? 'حصة كاملة'
                              : 'Serving'
                            : unit === 'tbsp'
                            ? isRTL
                              ? 'ملعقة طعام'
                              : 'Tablespoon'
                            : unit === 'ml'
                            ? isRTL
                              ? 'مل'
                              : 'ml'
                            : unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Macro Breakdown Chips */}
                <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                  <span>{isRTL ? 'بروتين:' : 'Protein:'} <b>{livePreviewNutrition.protein} {t('common.g')}</b></span>
                  <span>{isRTL ? 'كارب:' : 'Carbs:'} <b>{livePreviewNutrition.carbs} {t('common.g')}</b></span>
                  <span>{isRTL ? 'دهون:' : 'Fat:'} <b>{livePreviewNutrition.fat} {t('common.g')}</b></span>
                  <span>{isRTL ? 'الوزن:' : 'Weight:'} <b>{livePreviewNutrition.grams} {t('common.g')}</b></span>
                </div>

                {/* Log Button */}
                <button
                  type="button"
                  onClick={handleLogFood}
                  className="w-full py-2.5 rounded-xl font-black text-xs text-white transition active:scale-[0.98] shadow-sm flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: colors.accent }}
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('calories.log_food_btn')}</span>
                </button>
              </div>
            )}

            {/* Food Search Results List */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: colors.textMuted }}>
                {isRTL ? 'قاعدة الأطعمة المعتمدة دولياً:' : 'Verified Food Database (USDA & FAO):'}
              </span>

              {searchResults.map((food) => (
                <button
                  key={food.id}
                  onClick={() => handleSelectFood(food)}
                  className="w-full p-2.5 rounded-xl border text-right flex items-center justify-between transition hover:opacity-80 active:scale-98"
                  style={{
                    backgroundColor: selectedFood?.id === food.id ? (isDark ? '#23232a' : '#f0fdfa') : colors.card,
                    borderColor: selectedFood?.id === food.id ? colors.accent : colors.border,
                  }}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold block" style={{ color: colors.textPrimary }}>
                      {isRTL ? food.name_ar : food.name_en}
                    </span>
                    <span className="text-[10px]" style={{ color: colors.textMuted }}>
                      {isRTL ? food.serving_label_ar : food.serving_label_en}
                    </span>
                  </div>

                  <div className="text-left font-mono text-xs">
                    <span className="font-bold block" style={{ color: colors.accent }}>
                      {food.calories_per_100g} {t('common.kcal')}
                    </span>
                    <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                      {isRTL ? 'لكل 100غ' : '/ 100g'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BMR & TARGET CALCULATOR MODAL (Mifflin-St Jeor) */}
      {showCalculatorModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowCalculatorModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              direction: isRTL ? 'rtl' : 'ltr',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: colors.border }}>
              <div>
                <span className="text-xs font-mono font-bold uppercase" style={{ color: colors.accent }}>
                  {isRTL ? 'المعادلة العلمية المعتمدة' : 'Clinical Standard Formula'}
                </span>
                <h3 className="text-base font-black" style={{ color: colors.textPrimary }}>
                  {isRTL ? 'حاسبة السعرات والاحتياج اليومي' : 'Mifflin-St Jeor Calculator'}
                </h3>
              </div>
              <button
                onClick={() => setShowCalculatorModal(false)}
                className="text-xs font-bold px-2 py-1 rounded-lg border"
                style={{ borderColor: colors.border, color: colors.textSecondary }}
              >
                {t('common.cancel')}
              </button>
            </div>

            {/* Step 1: Biometrics (Weight, Height, Age, Gender) */}
            <div className="space-y-3">
              <span className="text-xs font-bold block" style={{ color: colors.accent }}>
                1. {t('calories.step1')}
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: colors.textSecondary }}>
                    {t('profile.weight_label')}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={calcInput.weight_kg}
                    onChange={(e) =>
                      setCalcInput({ ...calcInput, weight_kg: parseFloat(e.target.value) || 75 })
                    }
                    className="w-full p-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-hidden"
                    style={{
                      backgroundColor: isDark ? '#141417' : '#F8FAFA',
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: colors.textSecondary }}>
                    {isRTL ? 'الطول (سم):' : 'Height (cm):'}
                  </label>
                  <input
                    type="number"
                    value={calcInput.height_cm}
                    onChange={(e) =>
                      setCalcInput({ ...calcInput, height_cm: parseFloat(e.target.value) || 175 })
                    }
                    className="w-full p-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-hidden"
                    style={{
                      backgroundColor: isDark ? '#141417' : '#F8FAFA',
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: colors.textSecondary }}>
                    {isRTL ? 'العمر:' : 'Age:'}
                  </label>
                  <input
                    type="number"
                    value={calcInput.age}
                    onChange={(e) =>
                      setCalcInput({ ...calcInput, age: parseInt(e.target.value) || 25 })
                    }
                    className="w-full p-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-hidden"
                    style={{
                      backgroundColor: isDark ? '#141417' : '#F8FAFA',
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: colors.textSecondary }}>
                    {isRTL ? 'الجنس:' : 'Sex:'}
                  </label>
                  <select
                    value={calcInput.gender}
                    onChange={(e) =>
                      setCalcInput({ ...calcInput, gender: e.target.value as 'male' | 'female' })
                    }
                    className="w-full p-2.5 rounded-xl border text-xs font-bold focus:outline-hidden"
                    style={{
                      backgroundColor: isDark ? '#141417' : '#F8FAFA',
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                  >
                    <option value="male">{isRTL ? 'ذكر' : 'Male'}</option>
                    <option value="female">{isRTL ? 'أنثى' : 'Female'}</option>
                  </select>
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="text-xs font-bold block mb-1" style={{ color: colors.textSecondary }}>
                  {isRTL ? 'مستوى النشاط البدني والتدريبي:' : 'Activity Level:'}
                </label>
                <select
                  value={calcInput.activity_level}
                  onChange={(e) =>
                    setCalcInput({
                      ...calcInput,
                      activity_level: e.target.value as BMRCalculationInput['activity_level'],
                    })
                  }
                  className="w-full p-2.5 rounded-xl border text-xs font-bold focus:outline-hidden"
                  style={{
                    backgroundColor: isDark ? '#141417' : '#F8FAFA',
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                >
                  <option value="sedentary">{t('calories.activity_sedentary')}</option>
                  <option value="light">{t('calories.activity_light')}</option>
                  <option value="moderate">{t('calories.activity_moderate')}</option>
                  <option value="active">{t('calories.activity_active')}</option>
                  <option value="very_active">{t('calories.activity_very_active')}</option>
                </select>
              </div>
            </div>

            {/* Step 2: Goal (Maintain, Cut, Lean Bulk, Bulk) */}
            <div className="space-y-2">
              <span className="text-xs font-bold block" style={{ color: colors.accent }}>
                2. {t('calories.step2')}
              </span>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'maintain', label: t('calories.goal_maintain') },
                  { id: 'cut', label: t('calories.goal_cut') },
                  { id: 'lean_bulk', label: t('calories.goal_lean_bulk') },
                  { id: 'bulk', label: t('calories.goal_bulk') },
                ].map((g) => {
                  const isSelected = calcInput.fitness_goal === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() =>
                        setCalcInput({
                          ...calcInput,
                          fitness_goal: g.id as BMRCalculationInput['fitness_goal'],
                        })
                      }
                      className="p-2.5 rounded-xl border text-center transition text-xs font-bold"
                      style={{
                        backgroundColor: isSelected
                          ? isDark
                            ? '#222228'
                            : '#F0F9F8'
                          : 'transparent',
                        borderColor: isSelected ? colors.accent : colors.border,
                        color: isSelected ? colors.accent : colors.textSecondary,
                      }}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Calculated Targets Breakdown */}
            <div
              className="p-4 rounded-2xl border space-y-3"
              style={{
                backgroundColor: isDark ? '#141417' : '#F8FAFA',
                borderColor: colors.border,
              }}
            >
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: colors.textSecondary }}>{isRTL ? 'معدل الأيض الأساسي:' : 'Basal Metabolic Rate (BMR):'}</span>
                <span className="font-mono font-bold" style={{ color: colors.textPrimary }}>
                  {liveCalculatedTargets.bmr} {t('common.kcal')}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: colors.textSecondary }}>{isRTL ? 'استهلاك الطاقة الكلي:' : 'Total Daily Energy Expenditure (TDEE):'}</span>
                <span className="font-mono font-bold" style={{ color: colors.textPrimary }}>
                  {liveCalculatedTargets.tdee} {t('common.kcal')}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t" style={{ borderColor: colors.border }}>
                <span className="font-bold" style={{ color: colors.textPrimary }}>
                  {isRTL ? 'الهدف اليومي المعتمد:' : 'Target Daily Calories:'}
                </span>
                <span className="font-mono font-black text-sm" style={{ color: colors.accent }}>
                  {liveCalculatedTargets.target_calories} {t('common.kcal')}
                </span>
              </div>

              {/* Athletic Macro Allocation */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                <div className="p-2 rounded-xl border" style={{ borderColor: colors.border }}>
                  <span className="text-[10px] block" style={{ color: colors.textMuted }}>{isRTL ? 'البروتين' : 'Protein'}</span>
                  <span className="text-xs font-black" style={{ color: colors.textPrimary }}>
                    {liveCalculatedTargets.protein_g} {t('common.g')}
                  </span>
                </div>
                <div className="p-2 rounded-xl border" style={{ borderColor: colors.border }}>
                  <span className="text-[10px] block" style={{ color: colors.textMuted }}>{isRTL ? 'الكارب' : 'Carbs'}</span>
                  <span className="text-xs font-black" style={{ color: colors.textPrimary }}>
                    {liveCalculatedTargets.carbs_g} {t('common.g')}
                  </span>
                </div>
                <div className="p-2 rounded-xl border" style={{ borderColor: colors.border }}>
                  <span className="text-[10px] block" style={{ color: colors.textMuted }}>{isRTL ? 'الدهون' : 'Fat'}</span>
                  <span className="text-xs font-black" style={{ color: colors.textPrimary }}>
                    {liveCalculatedTargets.fat_g} {t('common.g')}
                  </span>
                </div>
              </div>
            </div>

            {/* Save Targets Button */}
            <button
              onClick={handleSaveCalculatedTargets}
              className="w-full py-3 rounded-2xl font-black text-xs text-white transition active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
              style={{ backgroundColor: colors.accent }}
            >
              {saveCalcSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isRTL ? 'تم حفظ وتحديث الأهداف الرياضية!' : 'Nutrition targets saved!'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isRTL ? 'اعتماد وحفظ هذه الأهداف في ملفي' : 'Apply & Save Targets to Profile'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
