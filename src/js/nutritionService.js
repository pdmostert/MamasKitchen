/**
 * Nutrition Service - Simple Nutrition Lookup
 *
 * Uses Edamam Nutrition Analysis API to get nutrition info for ingredients or recipes
 * This is your SECOND API (separate from Spoonacular recipes)
 *
 * Free tier: 200 API calls per month
 * Get your free key at: https://developer.edamam.com/edamam-nutrition-api
 */

// ============================================
// CONFIGURATION
// ============================================

/**
 * Edamam API Configuration
 * Sign up at: https://developer.edamam.com/
 * Choose "Nutrition Analysis API" (free tier)
 */
const EDAMAM_APP_ID =   import.meta.env.VITE_EDAMAM_APP_ID; // Add your App ID here
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
  const totalNutrients = rawData.totalNutrients || {};
  const totalDaily = rawData.totalDaily || {};

  return {
    calories: Math.round(rawData.calories || 0),
    servings: rawData.yield || 1,
    caloriesPerServing: Math.round(
      (rawData.calories || 0) / (rawData.yield || 1)
    ),

    // Macronutrients
    protein: {
      amount: Math.round(totalNutrients.PROCNT?.quantity || 0),
      unit: totalNutrients.PROCNT?.unit || "g",
      dailyPercent: Math.round(totalDaily.PROCNT?.quantity || 0),
    },
    carbs: {
      amount: Math.round(totalNutrients.CHOCDF?.quantity || 0),
      unit: totalNutrients.CHOCDF?.unit || "g",
      dailyPercent: Math.round(totalDaily.CHOCDF?.quantity || 0),
    },
    fat: {
      amount: Math.round(totalNutrients.FAT?.quantity || 0),
      unit: totalNutrients.FAT?.unit || "g",
      dailyPercent: Math.round(totalDaily.FAT?.quantity || 0),
    },
    fiber: {
      amount: Math.round(totalNutrients.FIBTG?.quantity || 0),
      unit: totalNutrients.FIBTG?.unit || "g",
      dailyPercent: Math.round(totalDaily.FIBTG?.quantity || 0),
    },

    // Micronutrients
    sodium: {
      amount: Math.round(totalNutrients.NA?.quantity || 0),
      unit: totalNutrients.NA?.unit || "mg",
      dailyPercent: Math.round(totalDaily.NA?.quantity || 0),
    },
    cholesterol: {
      amount: Math.round(totalNutrients.CHOLE?.quantity || 0),
      unit: totalNutrients.CHOLE?.unit || "mg",
      dailyPercent: Math.round(totalDaily.CHOLE?.quantity || 0),
    },

    // Vitamins & Minerals (top ones)
    vitaminA: {
      amount: Math.round(totalNutrients.VITA_RAE?.quantity || 0),
      unit: totalNutrients.VITA_RAE?.unit || "µg",
      dailyPercent: Math.round(totalDaily.VITA_RAE?.quantity || 0),
    },
    vitaminC: {
      amount: Math.round(totalNutrients.VITC?.quantity || 0),
      unit: totalNutrients.VITC?.unit || "mg",
      dailyPercent: Math.round(totalDaily.VITC?.quantity || 0),
    },
    calcium: {
      amount: Math.round(totalNutrients.CA?.quantity || 0),
      unit: totalNutrients.CA?.unit || "mg",
      dailyPercent: Math.round(totalDaily.CA?.quantity || 0),
    },
    iron: {
      amount: Math.round(totalNutrients.FE?.quantity || 0),
      unit: totalNutrients.FE?.unit || "mg",
      dailyPercent: Math.round(totalDaily.FE?.quantity || 0),
    },

    // Health labels
    healthLabels: rawData.healthLabels || [],
    dietLabels: rawData.dietLabels || [],
    cautions: rawData.cautions || [],
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
