export interface BMRCalculationInput {
  weight_kg: number;
  height_cm: number;
  age: number;
  gender: 'male' | 'female';
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  fitness_goal: 'maintain' | 'cut' | 'lean_bulk' | 'bulk';
}

export interface CalculatedNutritionTargets {
  bmr: number;
  tdee: number;
  calorie_adjustment: number;
  target_calories: number;
  protein_g: number;
  protein_calories: number;
  protein_percentage: number;
  carbs_g: number;
  carbs_calories: number;
  carbs_percentage: number;
  fat_g: number;
  fat_calories: number;
  fat_percentage: number;
  water_target_ml: number;
  formula_name: string;
}

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2, // Little to no exercise
  light: 1.375, // Light exercise 1-3 days/week
  moderate: 1.55, // Moderate exercise 3-5 days/week
  active: 1.725, // Hard exercise 6-7 days/week
  very_active: 1.9, // Very hard exercise & physical job / 2x daily
};

export const GOAL_ADJUSTMENTS = {
  maintain: 0,
  cut: -500, // Safe healthy fat loss deficit
  lean_bulk: 250, // Lean athletic surplus
  bulk: 500, // Standard hypertrophy mass gain
};

/**
 * Calculates scientifically grounded athletic calorie & macro targets
 * using the clinically validated Mifflin-St Jeor Equation.
 */
export function calculateAthleticTargets(input: BMRCalculationInput): CalculatedNutritionTargets {
  const { weight_kg, height_cm, age, gender, activity_level, fitness_goal } = input;

  const validWeight = Math.max(35, Math.min(250, weight_kg || 75));
  const validHeight = Math.max(120, Math.min(230, height_cm || 175));
  const validAge = Math.max(14, Math.min(100, age || 25));

  // 1. Mifflin-St Jeor Equation
  let bmr = 10 * validWeight + 6.25 * validHeight - 5 * validAge;
  if (gender === 'female') {
    bmr -= 161;
  } else {
    bmr += 5;
  }
  bmr = Math.round(bmr);

  // 2. Total Daily Energy Expenditure (TDEE)
  const multiplier = ACTIVITY_MULTIPLIERS[activity_level] || 1.55;
  const tdee = Math.round(bmr * multiplier);

  // 3. Goal Calorie Adjustment
  const calorie_adjustment = GOAL_ADJUSTMENTS[fitness_goal] || 0;
  const target_calories = Math.max(1200, Math.round(tdee + calorie_adjustment));

  // 4. Macro Allocation (Athletic Standard for Resistance Training)
  // Protein: 2.0g per kg of bodyweight
  const protein_g = Math.round(validWeight * 2.0);
  const protein_calories = protein_g * 4;

  // Fat: 0.9g per kg of bodyweight (essential for hormones & joint health)
  let fat_g = Math.round(validWeight * 0.9);
  // Ensure fat is at least 20% of target calories
  if (fat_g * 9 < target_calories * 0.2) {
    fat_g = Math.round((target_calories * 0.2) / 9);
  }
  const fat_calories = fat_g * 9;

  // Carbs: The remaining calories allocated to Carbohydrates (4 kcal/g)
  const remainingCalories = Math.max(200, target_calories - (protein_calories + fat_calories));
  const carbs_g = Math.round(remainingCalories / 4);
  const carbs_calories = carbs_g * 4;

  // Exact recalculated target calories to ensure mathematical verification:
  const totalCal = protein_calories + carbs_calories + fat_calories;

  const protein_percentage = Math.round((protein_calories / totalCal) * 100);
  const carbs_percentage = Math.round((carbs_calories / totalCal) * 100);
  const fat_percentage = Math.max(0, 100 - (protein_percentage + carbs_percentage));

  // Daily water minimum based on bodyweight
  const water_target_ml = Math.round(validWeight * 35);

  return {
    bmr,
    tdee,
    calorie_adjustment,
    target_calories: totalCal,
    protein_g,
    protein_calories,
    protein_percentage,
    carbs_g,
    carbs_calories,
    carbs_percentage,
    fat_g,
    fat_calories,
    fat_percentage,
    water_target_ml,
    formula_name: 'Mifflin-St Jeor Formula & Athletic Macro Distribution (2.0g/kg Pro, 0.9g/kg Fat)',
  };
}
