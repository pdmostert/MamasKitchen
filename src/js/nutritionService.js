const EDAMAM_APP_ID = import.meta.env.VITE_EDAMAM_APP_ID; // Add your App ID here
const EDAMAM_APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY; // Add your App Key here
const EDAMAM_API_URL = "https://api.edamam.com/api/nutrition-details";

// ============================================
// NUTRITION API FUNCTIONS
// ============================================

/**
 * Analyze nutrition for a list of ingredients
 * @param {Array<string>} ingredients - Array of ingredient strings (e.g., ["1 cup rice", "2 eggs"])
 * @param {string} title - Optional recipe title
 * @returns {Promise<Object|null>} Nutrition data or null
 *
 * @example
 * const nutrition = await analyzeNutrition([
 *   "1 cup rice",
 *   "2 chicken breasts",
 *   "1 tablespoon olive oil"
 * ], "Chicken and Rice");
 */
export async function analyzeNutrition(ingredients, title = "Recipe") {
  if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) {
    console.error("Edamam API credentials not configured");
    console.log("Get your free API key at: https://developer.edamam.com/");
    return null;
  }

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    console.error("Please provide an array of ingredients");
    return null;
  }

  try {
    const response = await fetch(
      `${EDAMAM_API_URL}?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          ingr: ingredients,
        }),
      }
    );

    console.log(response);

    if (!response.ok) {
      throw new Error(`Edamam API error: ${response.status}`);
    }

    const data = await response.json();
    return formatNutritionData(data);
  } catch (error) {
    console.error("Error analyzing nutrition:", error);
    return null;
  }
}

/**
 * Get nutrition for a Spoonacular recipe
 * Converts recipe ingredients to format Edamam expects
 * @param {Object} recipe - Recipe object from Spoonacular
 * @returns {Promise<Object|null>} Nutrition data
 */
export async function getNutritionForRecipe(recipe) {
  if (!recipe || !recipe.extendedIngredients) {
    console.error("Invalid recipe object");
    return null;
  }

  // Convert Spoonacular ingredients to simple strings
  const ingredients = recipe.extendedIngredients.map((ing) => ing.original);

  return analyzeNutrition(ingredients, recipe.title);
}

/**
 * Format nutrition data into a simple structure
 * @param {Object} rawData - Raw data from Edamam API
 * @returns {Object} Formatted nutrition info
 */
function formatNutritionData(rawData) {
  const ingredients = rawData.ingredients || [];

  // Initialize totals
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    totalWeight: 0,
  };

  // Calculate totals from all ingredients
  ingredients.forEach((ingredient) => {
    if (ingredient.parsed && ingredient.parsed.length > 0) {
      const parsedItem = ingredient.parsed[0]; // Take first parsed item
      const nutrients = parsedItem.nutrients || {};

      // Add to totals
      totals.calories += nutrients.ENERC_KCAL?.quantity || 0;
      totals.protein += nutrients.PROCNT?.quantity || 0;
      totals.carbs += nutrients.CHOCDF?.quantity || 0;
      totals.fat += nutrients.FAT?.quantity || 0;
      totals.fiber += nutrients.FIBTG?.quantity || 0;
      totals.sugar += nutrients.SUGAR?.quantity || 0;
      totals.iron += nutrients.FE?.quantity || 0;
      totals.totalWeight += parsedItem.weight || 0;
    }
  });

  // Calculate daily percentages (based on 2000 calorie diet)
  const dailyValues = {
    calories: 2000,
    protein: 50, // grams
    carbs: 300, // grams
    fat: 65, // grams
    fiber: 25, // grams
    sugar: 50, // grams
  };

  const servings = rawData.yield || 1;

  return {


    calories: {
      amount: Math.round(totals.calories),
      unit: "kcal",
      dailyPercent: Math.round((totals.calories / dailyValues.calories) * 100),
      dailyValues: dailyValues.calories,
    },
    protein: {
      amount: Math.round(totals.protein),
      unit: "g",
      dailyPercent: Math.round((totals.protein / dailyValues.protein) * 100),
      dailyValues: dailyValues.protein,
    },
    carbs: {
      amount: Math.round(totals.carbs),
      unit: "g",
      dailyPercent: Math.round((totals.carbs / dailyValues.carbs) * 100),
      dailyValues: dailyValues.carbs,
    },
    fat: {
      amount: Math.round(totals.fat),
      unit: "g",
      dailyPercent: Math.round((totals.fat / dailyValues.fat) * 100),
      dailyValues: dailyValues.fat,
    },
    fiber: {
      amount: Math.round(totals.fiber),
      unit: "g",
      dailyPercent: Math.round((totals.fiber / dailyValues.fiber) * 100),
      dailyValues: dailyValues.fiber,
    },
    sugar: {
      amount: Math.round(totals.sugar),
      unit: "g",
      dailyPercent: Math.round((totals.sugar / dailyValues.sugar) * 100),
      dailyValues: dailyValues.sugar,
    },
  };
}

/**
 * Check if API credentials are configured
 * @returns {boolean} True if credentials are set
 */
export function isNutritionAPIConfigured() {
  return Boolean(EDAMAM_APP_ID && EDAMAM_APP_KEY);
}

// Log status on load
if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) {
  console.log(
    "%c🥗 NUTRITION API",
    "background: #f97316; color: #fff; padding: 4px 8px; font-weight: bold;"
  );
  console.log("❌ Edamam API not configured");
  console.log("Get your free API key at: https://developer.edamam.com/");
} else {
  console.log(
    "%c🥗 NUTRITION API READY",
    "background: #10b981; color: #fff; padding: 4px 8px; font-weight: bold;"
  );
}
