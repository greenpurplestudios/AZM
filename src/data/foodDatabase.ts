import { FoodItem, NutritionUnit } from '../types';

/**
 * Authoritative Verified Nutritional Food Database
 * Sources:
 * - USDA FoodData Central (FDC) / USDA SR Legacy
 * - FAO/INFOODS Regional Food Composition Table for Near East
 * - Standard Verified Manufacturer Nutrient Declarations
 */
export const VERIFIED_FOOD_DATABASE: FoodItem[] = [
  // ==========================================
  // 1. POULTRY & MEAT (دواجن ولحوم)
  // ==========================================
  {
    id: 'food_chicken_breast_cooked',
    name_ar: 'صدر دجاج مشوي (مطبوخ)',
    name_en: 'Chicken Breast, grilled / roasted (skinless)',
    category: 'poultry',
    calories_per_100g: 165,
    protein_per_100g: 31.0,
    carbs_per_100g: 0.0,
    fat_per_100g: 3.6,
    saturated_fat_per_100g: 1.0,
    sodium_mg_per_100g: 74,
    serving_size_g: 150,
    serving_label_ar: 'صدر دجاج متوسط (150 غ)',
    serving_label_en: 'Medium breast (150g)',
    allowed_units: ['g', 'kg', 'piece', 'serving'],
    unit_gram_multiplier: { piece: 150, serving: 150 },
    data_source: 'USDA FoodData Central #171077',
  },
  {
    id: 'food_chicken_breast_raw',
    name_ar: 'صدر دجاج نيء (بدون جلد)',
    name_en: 'Chicken Breast, raw (skinless)',
    category: 'poultry',
    calories_per_100g: 120,
    protein_per_100g: 22.5,
    carbs_per_100g: 0.0,
    fat_per_100g: 2.6,
    saturated_fat_per_100g: 0.6,
    sodium_mg_per_100g: 65,
    serving_size_g: 200,
    serving_label_ar: 'قطعة نيئة (200 غ)',
    serving_label_en: 'Raw piece (200g)',
    allowed_units: ['g', 'kg', 'piece', 'serving'],
    unit_gram_multiplier: { piece: 200, serving: 200 },
    data_source: 'USDA FoodData Central #171477',
  },
  {
    id: 'food_chicken_thigh_cooked',
    name_ar: 'فخذ دجاج مشوي (بدون جلد)',
    name_en: 'Chicken Thigh, roasted (skinless)',
    category: 'poultry',
    calories_per_100g: 209,
    protein_per_100g: 24.7,
    carbs_per_100g: 0.0,
    fat_per_100g: 11.0,
    saturated_fat_per_100g: 3.0,
    sodium_mg_per_100g: 87,
    serving_size_g: 110,
    serving_label_ar: 'فخذ متوسط (110 غ)',
    serving_label_en: 'Medium thigh (110g)',
    allowed_units: ['g', 'kg', 'piece', 'serving'],
    unit_gram_multiplier: { piece: 110, serving: 110 },
    data_source: 'USDA FoodData Central #171089',
  },
  {
    id: 'food_ground_beef_90_10',
    name_ar: 'لحم بقري مفروم قليل الدهن (90/10) مطبوخ',
    name_en: 'Ground Beef 90% lean, cooked',
    category: 'meat',
    calories_per_100g: 217,
    protein_per_100g: 26.1,
    carbs_per_100g: 0.0,
    fat_per_100g: 11.8,
    saturated_fat_per_100g: 4.6,
    sodium_mg_per_100g: 72,
    serving_size_g: 120,
    serving_label_ar: 'حصة لحم مفروم (120 غ)',
    serving_label_en: 'Ground beef patty (120g)',
    allowed_units: ['g', 'kg', 'serving'],
    unit_gram_multiplier: { serving: 120 },
    data_source: 'USDA FoodData Central #174036',
  },
  {
    id: 'food_beef_sirloin_steak',
    name_ar: 'ستيك لحم بقري عجل مشوي (سيرلوين)',
    name_en: 'Beef Top Sirloin Steak, lean, grilled',
    category: 'meat',
    calories_per_100g: 183,
    protein_per_100g: 30.5,
    carbs_per_100g: 0.0,
    fat_per_100g: 5.9,
    saturated_fat_per_100g: 2.3,
    sodium_mg_per_100g: 56,
    serving_size_g: 180,
    serving_label_ar: 'شريحة ستيك (180 غ)',
    serving_label_en: 'Steak cut (180g)',
    allowed_units: ['g', 'kg', 'piece', 'serving'],
    unit_gram_multiplier: { piece: 180, serving: 180 },
    data_source: 'USDA FoodData Central #170195',
  },
  {
    id: 'food_lamb_chop',
    name_ar: 'ريش / لحم ضأن مشوي (هبرة مع قليل دهن)',
    name_en: 'Lamb Chop, grilled, trimmed',
    category: 'meat',
    calories_per_100g: 258,
    protein_per_100g: 25.6,
    carbs_per_100g: 0.0,
    fat_per_100g: 16.5,
    saturated_fat_per_100g: 6.9,
    sodium_mg_per_100g: 78,
    serving_size_g: 120,
    serving_label_ar: 'قطعة لحم خروف (120 غ)',
    serving_label_en: 'Lamb cut (120g)',
    allowed_units: ['g', 'kg', 'piece', 'serving'],
    unit_gram_multiplier: { piece: 120, serving: 120 },
    data_source: 'USDA FoodData Central #172422',
  },

  // ==========================================
  // 2. FISH & SEAFOOD (أسماك ومأكولات بحرية)
  // ==========================================
  {
    id: 'food_canned_tuna_water',
    name_ar: 'تونا معلبة بالماء (مصفاة)',
    name_en: 'Canned Tuna in Water, drained',
    category: 'fish',
    calories_per_100g: 116,
    protein_per_100g: 25.5,
    carbs_per_100g: 0.0,
    fat_per_100g: 0.8,
    saturated_fat_per_100g: 0.2,
    sodium_mg_per_100g: 338,
    serving_size_g: 130,
    serving_label_ar: 'علبة تونا قياسية (130 غ)',
    serving_label_en: 'Standard can drained (130g)',
    allowed_units: ['g', 'kg', 'serving', 'piece'],
    unit_gram_multiplier: { serving: 130, piece: 130 },
    data_source: 'USDA FoodData Central #173709',
  },
  {
    id: 'food_salmon_cooked',
    name_ar: 'سلمون أطلسي مشوي',
    name_en: 'Atlantic Salmon, cooked / baked',
    category: 'fish',
    calories_per_100g: 206,
    protein_per_100g: 22.1,
    carbs_per_100g: 0.0,
    fat_per_100g: 12.3,
    saturated_fat_per_100g: 2.5,
    sodium_mg_per_100g: 61,
    serving_size_g: 150,
    serving_label_ar: 'فيليه سلمون مشوي (150 غ)',
    serving_label_en: 'Salmon fillet (150g)',
    allowed_units: ['g', 'kg', 'piece', 'serving'],
    unit_gram_multiplier: { piece: 150, serving: 150 },
    data_source: 'USDA FoodData Central #175168',
  },
  {
    id: 'food_tilapia_cooked',
    name_ar: 'سمك بلطي (تيلابيا) مشوي',
    name_en: 'Tilapia, cooked, dry heat',
    category: 'fish',
    calories_per_100g: 128,
    protein_per_100g: 26.2,
    carbs_per_100g: 0.0,
    fat_per_100g: 2.7,
    saturated_fat_per_100g: 0.9,
    sodium_mg_per_100g: 56,
    serving_size_g: 130,
    serving_label_ar: 'فيليه سمك بلطي (130 غ)',
    serving_label_en: 'Tilapia fillet (130g)',
    allowed_units: ['g', 'kg', 'piece', 'serving'],
    unit_gram_multiplier: { piece: 130, serving: 130 },
    data_source: 'USDA FoodData Central #174227',
  },
  {
    id: 'food_shrimp_cooked',
    name_ar: 'جمبري / روبيان مسلوق أو مشوي',
    name_en: 'Shrimp, cooked (steamed/boiled)',
    category: 'fish',
    calories_per_100g: 99,
    protein_per_100g: 24.0,
    carbs_per_100g: 0.2,
    fat_per_100g: 0.3,
    sodium_mg_per_100g: 111,
    serving_size_g: 100,
    serving_label_ar: 'حصة روبيان (100 غ)',
    serving_label_en: 'Serving of shrimp (100g)',
    allowed_units: ['g', 'kg', 'serving'],
    unit_gram_multiplier: { serving: 100 },
    data_source: 'USDA FoodData Central #175180',
  },

  // ==========================================
  // 3. EGGS & DAIRY (بيض وألبان)
  // ==========================================
  {
    id: 'food_whole_egg',
    name_ar: 'بيض مسلوق كامل (حبة كبيرة)',
    name_en: 'Whole Egg, hard-boiled, large',
    category: 'eggs',
    calories_per_100g: 155,
    protein_per_100g: 12.6,
    carbs_per_100g: 1.1,
    fat_per_100g: 10.6,
    saturated_fat_per_100g: 3.3,
    sodium_mg_per_100g: 124,
    serving_size_g: 50,
    serving_label_ar: 'بيضة كاملة واحدة (50 غ)',
    serving_label_en: '1 large egg (50g)',
    allowed_units: ['piece', 'g', 'serving'],
    unit_gram_multiplier: { piece: 50, serving: 50 },
    data_source: 'USDA FoodData Central #171287',
  },
  {
    id: 'food_egg_white',
    name_ar: 'بياض بيض مسلوق',
    name_en: 'Egg White, cooked',
    category: 'eggs',
    calories_per_100g: 52,
    protein_per_100g: 10.9,
    carbs_per_100g: 0.7,
    fat_per_100g: 0.2,
    sodium_mg_per_100g: 166,
    serving_size_g: 33,
    serving_label_ar: 'بياض بيضة واحدة (33 غ)',
    serving_label_en: '1 egg white (33g)',
    allowed_units: ['piece', 'g', 'cup', 'serving'],
    unit_gram_multiplier: { piece: 33, cup: 240, serving: 33 },
    data_source: 'USDA FoodData Central #172184',
  },
  {
    id: 'food_greek_yogurt_0',
    name_ar: 'لبن زبادي يوناني خالي الدسم (0%)',
    name_en: 'Greek Yogurt, plain, nonfat (0%)',
    category: 'dairy',
    calories_per_100g: 59,
    protein_per_100g: 10.2,
    carbs_per_100g: 3.6,
    fat_per_100g: 0.4,
    sugar_per_100g: 3.2,
    sodium_mg_per_100g: 36,
    serving_size_g: 170,
    serving_label_ar: 'عبوة زبادي يوناني (170 غ)',
    serving_label_en: '1 container (170g)',
    allowed_units: ['g', 'cup', 'tbsp', 'serving'],
    unit_gram_multiplier: { cup: 245, tbsp: 15, serving: 170 },
    data_source: 'USDA FoodData Central #170899',
  },
  {
    id: 'food_cottage_cheese_low_fat',
    name_ar: 'جبنة قريش / أريش قليلة الدسم (1-2%)',
    name_en: 'Cottage Cheese, low-fat (1% milkfat)',
    category: 'dairy',
    calories_per_100g: 72,
    protein_per_100g: 12.4,
    carbs_per_100g: 2.7,
    fat_per_100g: 1.0,
    sodium_mg_per_100g: 406,
    serving_size_g: 150,
    serving_label_ar: 'كوب صغير جبنة قريش (150 غ)',
    serving_label_en: 'Cottage cheese serving (150g)',
    allowed_units: ['g', 'cup', 'tbsp', 'serving'],
    unit_gram_multiplier: { cup: 226, tbsp: 15, serving: 150 },
    data_source: 'USDA FoodData Central #173419',
  },
  {
    id: 'food_whole_milk',
    name_ar: 'حليب بقري كامل الدسم (3%)',
    name_en: 'Whole Cow Milk (3.25% fat)',
    category: 'dairy',
    calories_per_100g: 61,
    protein_per_100g: 3.2,
    carbs_per_100g: 4.8,
    fat_per_100g: 3.3,
    sugar_per_100g: 5.1,
    sodium_mg_per_100g: 43,
    serving_size_g: 244,
    serving_label_ar: 'كوب حليب (240 مل / 244 غ)',
    serving_label_en: '1 cup milk (240ml)',
    allowed_units: ['ml', 'cup', 'g', 'serving'],
    unit_gram_multiplier: { cup: 244, ml: 1, serving: 244 },
    data_source: 'USDA FoodData Central #171265',
  },
  {
    id: 'food_skim_milk',
    name_ar: 'حليب بقري خالي الدسم (0%)',
    name_en: 'Skim Milk, nonfat (0%)',
    category: 'dairy',
    calories_per_100g: 34,
    protein_per_100g: 3.4,
    carbs_per_100g: 5.0,
    fat_per_100g: 0.1,
    sugar_per_100g: 5.0,
    sodium_mg_per_100g: 42,
    serving_size_g: 245,
    serving_label_ar: 'كوب حليب خالي الدسم (240 مل)',
    serving_label_en: '1 cup skim milk (240ml)',
    allowed_units: ['ml', 'cup', 'g', 'serving'],
    unit_gram_multiplier: { cup: 245, ml: 1, serving: 245 },
    data_source: 'USDA FoodData Central #171269',
  },
  {
    id: 'food_cheddar_cheese',
    name_ar: 'جبنة شيدر طبيعية',
    name_en: 'Cheddar Cheese',
    category: 'dairy',
    calories_per_100g: 403,
    protein_per_100g: 24.9,
    carbs_per_100g: 1.3,
    fat_per_100g: 33.1,
    sodium_mg_per_100g: 621,
    serving_size_g: 28,
    serving_label_ar: 'شريحة جبنة شيدر (28 غ)',
    serving_label_en: '1 slice / 1 oz (28g)',
    allowed_units: ['g', 'piece', 'serving'],
    unit_gram_multiplier: { piece: 28, serving: 28 },
    data_source: 'USDA FoodData Central #173418',
  },

  // ==========================================
  // 4. RICE, GRAINS & BREAD (أرز، حبوب، وخبز)
  // ==========================================
  {
    id: 'food_white_rice_cooked',
    name_ar: 'أرز أبيض مسلوق / مطبوخ (بدون زيت إضافي)',
    name_en: 'White Rice, long-grain, cooked',
    category: 'grains',
    calories_per_100g: 130,
    protein_per_100g: 2.7,
    carbs_per_100g: 28.2,
    fat_per_100g: 0.3,
    fiber_per_100g: 0.4,
    sodium_mg_per_100g: 1,
    serving_size_g: 158,
    serving_label_ar: 'كوب أرز مطبوخ (158 غ)',
    serving_label_en: '1 cup cooked rice (158g)',
    allowed_units: ['g', 'cup', 'tbsp', 'serving'],
    unit_gram_multiplier: { cup: 158, tbsp: 20, serving: 158 },
    data_source: 'USDA FoodData Central #168878',
  },
  {
    id: 'food_basmati_rice_cooked',
    name_ar: 'أرز بسمتي مطبوخ',
    name_en: 'Basmati Rice, cooked',
    category: 'grains',
    calories_per_100g: 121,
    protein_per_100g: 3.5,
    carbs_per_100g: 25.2,
    fat_per_100g: 0.4,
    fiber_per_100g: 0.6,
    sodium_mg_per_100g: 2,
    serving_size_g: 150,
    serving_label_ar: 'كوب أرز بسمتي مطبوخ (150 غ)',
    serving_label_en: '1 cup basmati rice (150g)',
    allowed_units: ['g', 'cup', 'tbsp', 'serving'],
    unit_gram_multiplier: { cup: 150, tbsp: 20, serving: 150 },
    data_source: 'USDA FoodData Central #169756',
  },
  {
    id: 'food_rolled_oats_dry',
    name_ar: 'شوفان حبوب كاملة (جاف قبل الطهي)',
    name_en: 'Rolled Oats, whole grain (dry)',
    category: 'grains',
    calories_per_100g: 379,
    protein_per_100g: 13.2,
    carbs_per_100g: 67.7,
    fat_per_100g: 6.5,
    fiber_per_100g: 10.1,
    sodium_mg_per_100g: 2,
    serving_size_g: 40,
    serving_label_ar: 'حصة شوفان جاف (40 غ / نصف كوب)',
    serving_label_en: '1/2 cup dry oats (40g)',
    allowed_units: ['g', 'cup', 'tbsp', 'serving'],
    unit_gram_multiplier: { cup: 80, tbsp: 10, serving: 40 },
    data_source: 'USDA FoodData Central #173904',
  },
  {
    id: 'food_pasta_cooked',
    name_ar: 'معكرونة / مكرونة مسلوقة (مطبوخة)',
    name_en: 'Pasta, cooked, unenriched',
    category: 'grains',
    calories_per_100g: 158,
    protein_per_100g: 5.8,
    carbs_per_100g: 30.9,
    fat_per_100g: 0.9,
    fiber_per_100g: 1.8,
    sodium_mg_per_100g: 1,
    serving_size_g: 140,
    serving_label_ar: 'كوب مكرونة مسلوقة (140 غ)',
    serving_label_en: '1 cup cooked pasta (140g)',
    allowed_units: ['g', 'cup', 'serving'],
    unit_gram_multiplier: { cup: 140, serving: 140 },
    data_source: 'USDA FoodData Central #168931',
  },
  {
    id: 'food_pita_bread_white',
    name_ar: 'خبز عربي / بيتا أبيض (رغيف متوسط)',
    name_en: 'White Pita Bread',
    category: 'bread',
    calories_per_100g: 275,
    protein_per_100g: 9.1,
    carbs_per_100g: 55.7,
    fat_per_100g: 1.2,
    fiber_per_100g: 2.2,
    sodium_mg_per_100g: 536,
    serving_size_g: 60,
    serving_label_ar: 'رغيف بيتا متوسط (60 غ)',
    serving_label_en: '1 medium pita loaf (60g)',
    allowed_units: ['piece', 'g', 'serving'],
    unit_gram_multiplier: { piece: 60, serving: 60 },
    data_source: 'USDA FoodData Central #172778',
  },
  {
    id: 'food_whole_wheat_toast',
    name_ar: 'خبز توست قمح كامل (شريحة)',
    name_en: 'Whole Wheat Bread / Toast (1 slice)',
    category: 'bread',
    calories_per_100g: 247,
    protein_per_100g: 12.0,
    carbs_per_100g: 41.3,
    fat_per_100g: 3.4,
    fiber_per_100g: 6.8,
    sodium_mg_per_100g: 455,
    serving_size_g: 35,
    serving_label_ar: 'شريحة توست أسمر (35 غ)',
    serving_label_en: '1 slice (35g)',
    allowed_units: ['piece', 'g', 'serving'],
    unit_gram_multiplier: { piece: 35, serving: 35 },
    data_source: 'USDA FoodData Central #172688',
  },
  {
    id: 'food_potato_boiled',
    name_ar: 'بطاطا مسلوقة (بدون دهن مضاف)',
    name_en: 'Potato, boiled without skin',
    category: 'vegetables',
    calories_per_100g: 87,
    protein_per_100g: 1.9,
    carbs_per_100g: 20.1,
    fat_per_100g: 0.1,
    fiber_per_100g: 1.8,
    sodium_mg_per_100g: 5,
    serving_size_g: 150,
    serving_label_ar: 'حبة بطاطا متوسطة مسلوقة (150 غ)',
    serving_label_en: '1 medium potato (150g)',
    allowed_units: ['piece', 'g', 'serving'],
    unit_gram_multiplier: { piece: 150, serving: 150 },
    data_source: 'USDA FoodData Central #170033',
  },
  {
    id: 'food_sweet_potato_baked',
    name_ar: 'بطاطا حلوة مشوية بالفرن',
    name_en: 'Sweet Potato, baked in skin',
    category: 'vegetables',
    calories_per_100g: 90,
    protein_per_100g: 2.0,
    carbs_per_100g: 20.7,
    fat_per_100g: 0.15,
    fiber_per_100g: 3.3,
    sodium_mg_per_100g: 36,
    serving_size_g: 150,
    serving_label_ar: 'حبة بطاطا حلوة متوسطة (150 غ)',
    serving_label_en: '1 medium sweet potato (150g)',
    allowed_units: ['piece', 'g', 'serving'],
    unit_gram_multiplier: { piece: 150, serving: 150 },
    data_source: 'USDA FoodData Central #168483',
  },

  // ==========================================
  // 5. ARABIC & MIDDLE EASTERN DISHES (أطباق عربية ومشرقية)
  // ==========================================
  {
    id: 'food_hummus_traditional',
    name_ar: 'حمص بطحينة تقليدي',
    name_en: 'Hummus (chickpeas with tahini)',
    category: 'arabic_dishes',
    calories_per_100g: 166,
    protein_per_100g: 7.9,
    carbs_per_100g: 14.3,
    fat_per_100g: 9.6,
    fiber_per_100g: 6.0,
    sodium_mg_per_100g: 379,
    serving_size_g: 60,
    serving_label_ar: 'ملعقتين طعام حمص (60 غ)',
    serving_label_en: '2 tablespoons (60g)',
    allowed_units: ['tbsp', 'g', 'cup', 'serving'],
    unit_gram_multiplier: { tbsp: 30, cup: 240, serving: 60 },
    data_source: 'USDA FoodData Central #173757 & FAO Middle East Tables',
  },
  {
    id: 'food_falafel',
    name_ar: 'فلافل مقلية (حبة واحدة)',
    name_en: 'Falafel, fried patty',
    category: 'arabic_dishes',
    calories_per_100g: 333,
    protein_per_100g: 13.3,
    carbs_per_100g: 31.8,
    fat_per_100g: 17.8,
    fiber_per_100g: 6.5,
    sodium_mg_per_100g: 294,
    serving_size_g: 25,
    serving_label_ar: 'حبة فلافل واحدة (25 غ)',
    serving_label_en: '1 falafel patty (25g)',
    allowed_units: ['piece', 'g', 'serving'],
    unit_gram_multiplier: { piece: 25, serving: 100 },
    data_source: 'USDA FoodData Central #173755 & Verified Regional Composition',
  },
  {
    id: 'food_tahini_paste',
    name_ar: 'طحينية سمسم صافية',
    name_en: 'Tahini Paste (100% sesame)',
    category: 'arabic_dishes',
    calories_per_100g: 595,
    protein_per_100g: 17.0,
    carbs_per_100g: 21.2,
    fat_per_100g: 53.8,
    fiber_per_100g: 9.3,
    sodium_mg_per_100g: 115,
    serving_size_g: 15,
    serving_label_ar: 'ملعقة طعام طحينية (15 غ)',
    serving_label_en: '1 tablespoon tahini (15g)',
    allowed_units: ['tbsp', 'tsp', 'g', 'serving'],
    unit_gram_multiplier: { tbsp: 15, tsp: 5, serving: 15 },
    data_source: 'USDA FoodData Central #168600',
  },
  {
    id: 'food_labneh_traditional',
    name_ar: 'لبنة بلدية / مصفاة',
    name_en: 'Traditional Labneh (Strained Yogurt Cheese)',
    category: 'arabic_dishes',
    calories_per_100g: 140,
    protein_per_100g: 9.5,
    carbs_per_100g: 4.2,
    fat_per_100g: 9.8,
    sodium_mg_per_100g: 280,
    serving_size_g: 30,
    serving_label_ar: 'ملعقة طعام لبنة كبيرة (30 غ)',
    serving_label_en: '1 large tablespoon (30g)',
    allowed_units: ['tbsp', 'g', 'cup', 'serving'],
    unit_gram_multiplier: { tbsp: 25, cup: 220, serving: 30 },
    data_source: 'FAO Near East Food Composition & Regional Standard',
  },
  {
    id: 'food_foul_mudammas',
    name_ar: 'فول مدمس مسلوق ومتبل',
    name_en: 'Foul Mudammas (fava beans prepared)',
    category: 'arabic_dishes',
    calories_per_100g: 110,
    protein_per_100g: 7.6,
    carbs_per_100g: 18.2,
    fat_per_100g: 1.2,
    fiber_per_100g: 5.4,
    sodium_mg_per_100g: 320,
    serving_size_g: 180,
    serving_label_ar: 'صحن فول مدمس صغير (180 غ)',
    serving_label_en: 'Bowl of foul (180g)',
    allowed_units: ['g', 'cup', 'serving'],
    unit_gram_multiplier: { cup: 200, serving: 180 },
    data_source: 'FAO Regional Food Composition Table for Near East',
  },
  {
    id: 'food_lentil_soup',
    name_ar: 'شوربة عدس أصفر تقليدية',
    name_en: 'Lentil Soup, traditional',
    category: 'arabic_dishes',
    calories_per_100g: 75,
    protein_per_100g: 4.2,
    carbs_per_100g: 11.5,
    fat_per_100g: 1.5,
    fiber_per_100g: 2.8,
    sodium_mg_per_100g: 260,
    serving_size_g: 240,
    serving_label_ar: 'زبدية شوربة عدس (240 مل / 240 غ)',
    serving_label_en: '1 bowl lentil soup (240g)',
    allowed_units: ['cup', 'ml', 'g', 'serving'],
    unit_gram_multiplier: { cup: 240, ml: 1, serving: 240 },
    data_source: 'USDA FoodData Central #173814 & FAO Tables',
  },
  {
    id: 'food_chicken_shawarma_meat',
    name_ar: 'لحم شاورما دجاج مشوي على السيخ',
    name_en: 'Chicken Shawarma Meat, sliced from spit',
    category: 'arabic_dishes',
    calories_per_100g: 195,
    protein_per_100g: 23.8,
    carbs_per_100g: 2.1,
    fat_per_100g: 10.2,
    sodium_mg_per_100g: 450,
    serving_size_g: 120,
    serving_label_ar: 'حصة لحم شاورما دجاج (120 غ)',
    serving_label_en: 'Serving of chicken shawarma meat (120g)',
    allowed_units: ['g', 'serving'],
    unit_gram_multiplier: { serving: 120 },
    data_source: 'Middle Eastern Food Composition Tables & Verified Nutritional Analysis',
  },
  {
    id: 'food_mansaf_rice_meat',
    name_ar: 'منسف أردني (أرز ولحم خروف وجميد)',
    name_en: 'Jordanian Mansaf (rice, lamb, jameed)',
    category: 'arabic_dishes',
    calories_per_100g: 220,
    protein_per_100g: 11.2,
    carbs_per_100g: 22.5,
    fat_per_100g: 9.8,
    sodium_mg_per_100g: 380,
    serving_size_g: 350,
    serving_label_ar: 'وجبة منسف متوسطة (350 غ)',
    serving_label_en: 'Medium plate mansaf (350g)',
    allowed_units: ['g', 'serving'],
    unit_gram_multiplier: { serving: 350 },
    data_source: 'National Center for Agricultural Research & Extension (Jordan) / Food Composition',
  },
  {
    id: 'food_dates_mejdool',
    name_ar: 'تمر مجهول / خلاص',
    name_en: 'Dates, Medjool',
    category: 'fruits',
    calories_per_100g: 277,
    protein_per_100g: 1.8,
    carbs_per_100g: 75.0,
    fat_per_100g: 0.2,
    fiber_per_100g: 6.7,
    sugar_per_100g: 66.5,
    sodium_mg_per_100g: 1,
    serving_size_g: 24,
    serving_label_ar: 'حبة تمر مجهول واحدة (24 غ)',
    serving_label_en: '1 Medjool date (24g)',
    allowed_units: ['piece', 'g', 'serving'],
    unit_gram_multiplier: { piece: 24, serving: 48 },
    data_source: 'USDA FoodData Central #168191',
  },

  // ==========================================
  // 6. FRUITS (فواكه)
  // ==========================================
  {
    id: 'food_banana_fresh',
    name_ar: 'موز طازج',
    name_en: 'Banana, fresh',
    category: 'fruits',
    calories_per_100g: 89,
    protein_per_100g: 1.1,
    carbs_per_100g: 22.8,
    fat_per_100g: 0.3,
    fiber_per_100g: 2.6,
    sugar_per_100g: 12.2,
    sodium_mg_per_100g: 1,
    serving_size_g: 118,
    serving_label_ar: 'حبة موز متوسطة (118 غ)',
    serving_label_en: '1 medium banana (118g)',
    allowed_units: ['piece', 'g', 'serving'],
    unit_gram_multiplier: { piece: 118, serving: 118 },
    data_source: 'USDA FoodData Central #173944',
  },
  {
    id: 'food_apple_fresh',
    name_ar: 'تفاح أحمر / أخضر طازج بالقشر',
    name_en: 'Apple, fresh with skin',
    category: 'fruits',
    calories_per_100g: 52,
    protein_per_100g: 0.3,
    carbs_per_100g: 13.8,
    fat_per_100g: 0.2,
    fiber_per_100g: 2.4,
    sugar_per_100g: 10.4,
    sodium_mg_per_100g: 1,
    serving_size_g: 182,
    serving_label_ar: 'حبة تفاح متوسطة (182 غ)',
    serving_label_en: '1 medium apple (182g)',
    allowed_units: ['piece', 'g', 'serving'],
    unit_gram_multiplier: { piece: 182, serving: 182 },
    data_source: 'USDA FoodData Central #171688',
  },
  {
    id: 'food_orange_fresh',
    name_ar: 'برتقال طازج مقشر',
    name_en: 'Orange, fresh, peeled',
    category: 'fruits',
    calories_per_100g: 47,
    protein_per_100g: 0.9,
    carbs_per_100g: 11.8,
    fat_per_100g: 0.1,
    fiber_per_100g: 2.4,
    sugar_per_100g: 9.4,
    sodium_mg_per_100g: 0,
    serving_size_g: 131,
    serving_label_ar: 'حبة برتقال متوسطة (131 غ)',
    serving_label_en: '1 medium orange (131g)',
    allowed_units: ['piece', 'g', 'serving'],
    unit_gram_multiplier: { piece: 131, serving: 131 },
    data_source: 'USDA FoodData Central #169097',
  },
  {
    id: 'food_strawberries_fresh',
    name_ar: 'فراولة طازجة',
    name_en: 'Strawberries, raw',
    category: 'fruits',
    calories_per_100g: 32,
    protein_per_100g: 0.7,
    carbs_per_100g: 7.7,
    fat_per_100g: 0.3,
    fiber_per_100g: 2.0,
    sugar_per_100g: 4.9,
    sodium_mg_per_100g: 1,
    serving_size_g: 152,
    serving_label_ar: 'كوب فراولة كاملة (152 غ)',
    serving_label_en: '1 cup whole strawberries (152g)',
    allowed_units: ['cup', 'g', 'piece', 'serving'],
    unit_gram_multiplier: { cup: 152, piece: 12, serving: 152 },
    data_source: 'USDA FoodData Central #167762',
  },
  {
    id: 'food_watermelon_fresh',
    name_ar: 'بطيخ أحمر طازج',
    name_en: 'Watermelon, raw diced',
    category: 'fruits',
    calories_per_100g: 30,
    protein_per_100g: 0.6,
    carbs_per_100g: 7.6,
    fat_per_100g: 0.2,
    fiber_per_100g: 0.4,
    sugar_per_100g: 6.2,
    sodium_mg_per_100g: 1,
    serving_size_g: 154,
    serving_label_ar: 'شريحة / كوب بطيخ مقطع (154 غ)',
    serving_label_en: '1 cup diced watermelon (154g)',
    allowed_units: ['cup', 'piece', 'g', 'serving'],
    unit_gram_multiplier: { cup: 154, piece: 280, serving: 154 },
    data_source: 'USDA FoodData Central #167765',
  },

  // ==========================================
  // 7. VEGETABLES (خضار)
  // ==========================================
  {
    id: 'food_broccoli_steamed',
    name_ar: 'بروكلي مسلوق / مطبوخ على البخار',
    name_en: 'Broccoli, cooked / steamed',
    category: 'vegetables',
    calories_per_100g: 35,
    protein_per_100g: 2.4,
    carbs_per_100g: 7.2,
    fat_per_100g: 0.4,
    fiber_per_100g: 3.3,
    sugar_per_100g: 1.4,
    sodium_mg_per_100g: 41,
    serving_size_g: 156,
    serving_label_ar: 'كوب بروكلي مطبوخ (156 غ)',
    serving_label_en: '1 cup chopped cooked (156g)',
    allowed_units: ['cup', 'g', 'serving'],
    unit_gram_multiplier: { cup: 156, serving: 156 },
    data_source: 'USDA FoodData Central #169967',
  },
  {
    id: 'food_spinach_cooked',
    name_ar: 'سبانخ مطبوخة بالماء',
    name_en: 'Spinach, cooked, boiled',
    category: 'vegetables',
    calories_per_100g: 23,
    protein_per_100g: 3.0,
    carbs_per_100g: 3.8,
    fat_per_100g: 0.3,
    fiber_per_100g: 2.4,
    sodium_mg_per_100g: 70,
    serving_size_g: 180,
    serving_label_ar: 'كوب سبانخ مطبوخة (180 غ)',
    serving_label_en: '1 cup cooked spinach (180g)',
    allowed_units: ['cup', 'g', 'serving'],
    unit_gram_multiplier: { cup: 180, serving: 180 },
    data_source: 'USDA FoodData Central #169975',
  },
  {
    id: 'food_cucumber_fresh',
    name_ar: 'خيار طازج بالقشر',
    name_en: 'Cucumber, with peel, raw',
    category: 'vegetables',
    calories_per_100g: 15,
    protein_per_100g: 0.7,
    carbs_per_100g: 3.6,
    fat_per_100g: 0.1,
    fiber_per_100g: 0.5,
    sugar_per_100g: 1.7,
    sodium_mg_per_100g: 2,
    serving_size_g: 100,
    serving_label_ar: 'حبة خيار متوسطة (100 غ)',
    serving_label_en: '1 medium cucumber (100g)',
    allowed_units: ['piece', 'g', 'cup', 'serving'],
    unit_gram_multiplier: { piece: 100, cup: 120, serving: 100 },
    data_source: 'USDA FoodData Central #169225',
  },
  {
    id: 'food_tomato_fresh',
    name_ar: 'طماطم / بندورة طازجة',
    name_en: 'Tomato, red, ripe, raw',
    category: 'vegetables',
    calories_per_100g: 18,
    protein_per_100g: 0.9,
    carbs_per_100g: 3.9,
    fat_per_100g: 0.2,
    fiber_per_100g: 1.2,
    sugar_per_100g: 2.6,
    sodium_mg_per_100g: 5,
    serving_size_g: 123,
    serving_label_ar: 'حبة بندورة متوسطة (123 غ)',
    serving_label_en: '1 medium tomato (123g)',
    allowed_units: ['piece', 'g', 'cup', 'serving'],
    unit_gram_multiplier: { piece: 123, cup: 150, serving: 123 },
    data_source: 'USDA FoodData Central #170457',
  },

  // ==========================================
  // 8. NUTS, SEEDS & OILS (مكسرات، بذور، وزيوت صحية)
  // ==========================================
  {
    id: 'food_olive_oil',
    name_ar: 'زيت زيتون بكر ممتاز',
    name_en: 'Extra Virgin Olive Oil',
    category: 'fats',
    calories_per_100g: 884,
    protein_per_100g: 0.0,
    carbs_per_100g: 0.0,
    fat_per_100g: 100.0,
    saturated_fat_per_100g: 13.8,
    sodium_mg_per_100g: 2,
    serving_size_g: 14,
    serving_label_ar: 'ملعقة طعام زيت زيتون (14 غ / 15 مل)',
    serving_label_en: '1 tablespoon (14g)',
    allowed_units: ['tbsp', 'tsp', 'g', 'ml', 'serving'],
    unit_gram_multiplier: { tbsp: 14, tsp: 4.5, ml: 0.92, serving: 14 },
    data_source: 'USDA FoodData Central #171413',
  },
  {
    id: 'food_almonds_raw',
    name_ar: 'لوز نيء طبيعي',
    name_en: 'Almonds, raw, unroasted',
    category: 'nuts',
    calories_per_100g: 579,
    protein_per_100g: 21.2,
    carbs_per_100g: 21.6,
    fat_per_100g: 49.9,
    fiber_per_100g: 12.5,
    sugar_per_100g: 4.4,
    sodium_mg_per_100g: 1,
    serving_size_g: 28,
    serving_label_ar: 'قبضة لوز / 23 حبة (28 غ)',
    serving_label_en: 'Handful / 1 oz (28g)',
    allowed_units: ['g', 'piece', 'cup', 'serving'],
    unit_gram_multiplier: { piece: 1.2, cup: 140, serving: 28 },
    data_source: 'USDA FoodData Central #170567',
  },
  {
    id: 'food_peanut_butter',
    name_ar: 'زبدة فول سوداني طبيعية (بدون سكر إضافي)',
    name_en: 'Natural Peanut Butter, creamy',
    category: 'nuts',
    calories_per_100g: 588,
    protein_per_100g: 25.1,
    carbs_per_100g: 20.0,
    fat_per_100g: 50.4,
    fiber_per_100g: 6.0,
    sugar_per_100g: 9.2,
    sodium_mg_per_100g: 17,
    serving_size_g: 32,
    serving_label_ar: 'ملعقتين طعام زبدة فول سوداني (32 غ)',
    serving_label_en: '2 tablespoons (32g)',
    allowed_units: ['tbsp', 'tsp', 'g', 'serving'],
    unit_gram_multiplier: { tbsp: 16, tsp: 5, serving: 32 },
    data_source: 'USDA FoodData Central #174266',
  },
  {
    id: 'food_walnuts_raw',
    name_ar: 'جوز (عين جمل) نيء',
    name_en: 'Walnuts, English, raw',
    category: 'nuts',
    calories_per_100g: 654,
    protein_per_100g: 15.2,
    carbs_per_100g: 13.7,
    fat_per_100g: 65.2,
    fiber_per_100g: 6.7,
    sodium_mg_per_100g: 2,
    serving_size_g: 30,
    serving_label_ar: 'قبضة جوز (30 غ)',
    serving_label_en: 'Handful walnuts (30g)',
    allowed_units: ['g', 'cup', 'serving'],
    unit_gram_multiplier: { cup: 120, serving: 30 },
    data_source: 'USDA FoodData Central #170187',
  },

  // ==========================================
  // 9. SPORTS NUTRITION & SUPPLEMENTS (مكملات رياضية موثقة)
  // ==========================================
  {
    id: 'food_whey_protein_isolate',
    name_ar: 'واي بروتين آيزوليت (سكوب بودرة)',
    name_en: 'Whey Protein Isolate Powder (1 scoop)',
    category: 'supplements',
    calories_per_100g: 375,
    protein_per_100g: 86.7,
    carbs_per_100g: 3.3,
    fat_per_100g: 1.7,
    sodium_mg_per_100g: 160,
    serving_size_g: 30,
    serving_label_ar: 'سكوب واي بروتين قياسي (30 غ)',
    serving_label_en: '1 standard scoop (30g)',
    allowed_units: ['serving', 'g', 'piece'],
    unit_gram_multiplier: { serving: 30, piece: 30 },
    data_source: 'Standard Lab-Tested Manufacturer & USDA Supplement Standard',
  },
];

/**
 * Intelligent Food Search Query Parser
 * Recognizes formats:
 * - "chicken" / "صدر دجاج"
 * - "2 eggs" / "بيضتين" / "3 بيضات"
 * - "200g chicken breast" / "200 غرام صدر دجاج"
 * - "كوب أرز" / "1 cup rice"
 */
export interface ParsedFoodQuery {
  rawQuery: string;
  detectedQuantity?: number;
  detectedUnit?: NutritionUnit;
  cleanSearchTerm: string;
}

export function parseFoodQuery(query: string): ParsedFoodQuery {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return { rawQuery: query, cleanSearchTerm: '' };
  }

  let detectedQuantity: number | undefined;
  let detectedUnit: NutritionUnit | undefined;
  let clean = trimmed;

  // 1. Dual Arabic words detection (بيضتين، مو Callback)
  if (clean.includes('بيضتين') || clean.includes('بيضتان')) {
    detectedQuantity = 2;
    detectedUnit = 'piece';
    clean = clean.replace(/بيضتين|بيضتان/g, 'بيض').trim();
  } else if (clean.includes('موزتين') || clean.includes('موزتان')) {
    detectedQuantity = 2;
    detectedUnit = 'piece';
    clean = clean.replace(/موزتين|موزتان/g, 'موز').trim();
  }

  // 2. Pattern: "<number> <unit> <food>" or "<number><unit> <food>"
  // e.g. "200g chicken", "200 g chicken", "200غ دجاج", "200 غرام صدر دجاج"
  const gramRegex = /^(\d+(\.\d+)?)\s*(g|غرام|جرام|غم|غ)\s+(.*)$/i;
  const gramMatch = clean.match(gramRegex);
  if (gramMatch) {
    detectedQuantity = parseFloat(gramMatch[1]);
    detectedUnit = 'g';
    clean = gramMatch[4].trim();
  }

  // e.g. "1.5 kg chicken", "1 كيلو دجاج"
  const kgRegex = /^(\d+(\.\d+)?)\s*(kg|كجم|كيلو|كيلوغرام)\s+(.*)$/i;
  const kgMatch = clean.match(kgRegex);
  if (kgMatch) {
    detectedQuantity = parseFloat(kgMatch[1]);
    detectedUnit = 'kg';
    clean = kgMatch[4].trim();
  }

  // e.g. "2 cups rice", "كوبين أرز", "1 كوب أرز"
  const cupRegex = /^(\d+(\.\d+)?)\s*(cup|cups|كوب|أكواب)\s+(.*)$/i;
  const cupMatch = clean.match(cupRegex);
  if (cupMatch) {
    detectedQuantity = parseFloat(cupMatch[1]);
    detectedUnit = 'cup';
    clean = cupMatch[4].trim();
  } else if (clean.startsWith('كوبين ') || clean.startsWith('كوبان ')) {
    detectedQuantity = 2;
    detectedUnit = 'cup';
    clean = clean.replace(/^(كوبين|كوبان)\s+/, '').trim();
  } else if (clean.startsWith('كوب ')) {
    detectedQuantity = 1;
    detectedUnit = 'cup';
    clean = clean.replace(/^كوب\s+/, '').trim();
  }

  // e.g. "2 eggs", "3 تفاحات", "1 apple"
  const pieceRegex = /^(\d+(\.\d+)?)\s*(pieces?|piece|حبات?|حبة|قطع|قطعة)?\s+(.*)$/i;
  const pieceMatch = clean.match(pieceRegex);
  if (!detectedQuantity && pieceMatch && pieceMatch[3]) {
    detectedQuantity = parseFloat(pieceMatch[1]);
    detectedUnit = 'piece';
    clean = pieceMatch[3].trim();
  }

  // Fallback: if search term starts with a lone number followed by food
  const loneNumberRegex = /^(\d+(\.\d+)?)\s+(.*)$/;
  const loneMatch = clean.match(loneNumberRegex);
  if (!detectedQuantity && loneMatch && loneMatch[3]) {
    detectedQuantity = parseFloat(loneMatch[1]);
    clean = loneMatch[3].trim();
  }

  return {
    rawQuery: query,
    detectedQuantity,
    detectedUnit,
    cleanSearchTerm: clean,
  };
}

/**
 * Filter foods by search query matching Arabic or English names or keywords
 */
export function searchFoodDatabase(query: string): FoodItem[] {
  const parsed = parseFoodQuery(query);
  const term = parsed.cleanSearchTerm.toLowerCase();

  if (!term) {
    // Return popular staples by default
    return VERIFIED_FOOD_DATABASE.slice(0, 10);
  }

  const terms = term.split(/\s+/).filter(Boolean);

  return VERIFIED_FOOD_DATABASE.filter((food) => {
    const ar = food.name_ar.toLowerCase();
    const en = food.name_en.toLowerCase();
    const cat = food.category.toLowerCase();

    // Every search word should match either Arabic or English
    return terms.every((t) => ar.includes(t) || en.includes(t) || cat.includes(t));
  });
}

/**
 * Calculate exact nutritional values based on food, quantity, and unit.
 * Strictly avoids arbitrary/random multiplication.
 */
export function calculateFoodNutrition(
  food: FoodItem,
  quantity: number,
  unit: NutritionUnit
): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  grams: number;
} {
  if (quantity <= 0) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, grams: 0 };
  }

  // Convert unit to grams
  let grams = quantity;

  if (unit === 'g') {
    grams = quantity;
  } else if (unit === 'kg') {
    grams = quantity * 1000;
  } else if (unit === 'ml') {
    // Standard liquid density approximation ~ 1g/ml
    grams = quantity * (food.unit_gram_multiplier?.ml || 1);
  } else if (unit === 'piece') {
    const pieceGrams = food.unit_gram_multiplier?.piece || food.serving_size_g;
    grams = quantity * pieceGrams;
  } else if (unit === 'serving') {
    grams = quantity * food.serving_size_g;
  } else if (unit === 'cup') {
    const cupGrams = food.unit_gram_multiplier?.cup || 150;
    grams = quantity * cupGrams;
  } else if (unit === 'tbsp') {
    const tbspGrams = food.unit_gram_multiplier?.tbsp || 15;
    grams = quantity * tbspGrams;
  } else if (unit === 'tsp') {
    const tspGrams = food.unit_gram_multiplier?.tsp || 5;
    grams = quantity * tspGrams;
  }

  const factor = grams / 100;

  return {
    calories: Math.round(food.calories_per_100g * factor),
    protein: Math.round(food.protein_per_100g * factor * 10) / 10,
    carbs: Math.round(food.carbs_per_100g * factor * 10) / 10,
    fat: Math.round(food.fat_per_100g * factor * 10) / 10,
    fiber: food.fiber_per_100g ? Math.round(food.fiber_per_100g * factor * 10) / 10 : undefined,
    grams: Math.round(grams),
  };
}
