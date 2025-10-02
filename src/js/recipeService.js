/**
 * Recipe Service - Simple and Clean
 *
 * Fetches recipe data from:
 * - Mock data (for development to save API calls)
 * - Spoonacular API (when ready for real data)
 *
 * Toggle between mock and real data with USE_MOCK_DATA flag
 */

import { mockRecipes } from "./mockRecipes.js";

// ============================================
// CONFIGURATION
// ============================================

/**
 * Toggle between mock data and real API calls
 * Set to TRUE during development to preserve API call limits
 * Set to FALSE when ready to use real API
 */
const USE_MOCK_DATA = true;

/**
 * Spoonacular API Configuration
 * Get your free API key at: https://spoonacular.com/food-api
 * Free tier: 150 calls per day
 */
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = "https://api.spoonacular.com";

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get recipes from mock data
 * Extracts recipes from the nested structure
 * @returns {Array} Array of recipe objects
 */
function getMockRecipes() {
  // mockRecipes structure: [{recipes: [recipe1, recipe2, ...]}]
  if (Array.isArray(mockRecipes) && mockRecipes.length > 0) {
    if (mockRecipes[0].recipes && Array.isArray(mockRecipes[0].recipes)) {
      return mockRecipes[0].recipes;
    }
  }

  console.warn("Could not extract recipes from mockRecipes");
  return [];
}

// ============================================
// SPOONACULAR API FUNCTIONS
// ============================================

/**
 * Search recipes on Spoonacular
 * @param {string} query - Search query (e.g., "pasta", "chicken")
 * @param {Object} options - Optional filters {diet, cuisine, number, etc.}
 * @returns {Promise<Array>} Array of recipes
 */
async function searchSpoonacularRecipes(query, options = {}) {
  if (!SPOONACULAR_API_KEY) {
    console.error("Spoonacular API key not configured");
    return [];
  }

  const params = new URLSearchParams({
    apiKey: SPOONACULAR_API_KEY,
    query: query,
    number: options.number || 10,
    addRecipeInformation: true,
    fillIngredients: true,
    ...(options.diet && { diet: options.diet }),
    ...(options.cuisine && { cuisine: options.cuisine }),
  });

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/complexSearch?${params}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching from Spoonacular:", error);
    return [];
  }
}

/**
 * Get random recipes from Spoonacular
 * @param {number} count - Number of recipes to fetch (default: 10)
 * @returns {Promise<Array>} Array of recipes
 */
async function getRandomSpoonacularRecipes(count = 10) {
  if (!SPOONACULAR_API_KEY) {
    console.error("Spoonacular API key not configured");
    return [];
  }

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/random?apiKey=${SPOONACULAR_API_KEY}&number=${count}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.recipes || [];
  } catch (error) {
    console.error("Error fetching random recipes:", error);
    return [];
  }
}

/**
 * Get recipe details by ID
 * @param {number} id - Recipe ID
 * @returns {Promise<Object|null>} Recipe object or null
 */
async function getSpoonacularRecipeDetails(id) {
  if (!SPOONACULAR_API_KEY) {
    console.error("Spoonacular API key not configured");
    return null;
  }

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    return null;
  }
}

// ============================================
// PUBLIC API - What you use in your code
// ============================================

/**
 * Get all recipes
 * Returns mock data or fetches from Spoonacular based on USE_MOCK_DATA flag
 * @returns {Promise<Array>|Array} Array of recipes
 */
export function getAllRecipes() {
  if (USE_MOCK_DATA) {
    console.log("📦 Using mock data");
    return getMockRecipes();
  }

  // When using real API, get random recipes
  return getRandomSpoonacularRecipes(10);
}

/**
 * Search for recipes
 * @param {string} query - What to search for
 * @param {Object} options - Optional filters
 * @returns {Promise<Array>} Array of matching recipes
 */
export async function searchRecipes(query, options = {}) {
  if (USE_MOCK_DATA) {
    console.log("📦 Searching in mock data");
    const allRecipes = getMockRecipes();

    // Simple local search by title
    return allRecipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  return searchSpoonacularRecipes(query, options);
}

/**
 * Get a specific recipe by ID
 * @param {number} id - Recipe ID
 * @returns {Promise<Object|null>} Recipe object or null
 */
export async function getRecipeById(id) {
  if (USE_MOCK_DATA) {
    console.log("📦 Getting recipe from mock data");
    const allRecipes = getMockRecipes();
    return allRecipes.find((recipe) => recipe.id == id) || null;
  }

  return getSpoonacularRecipeDetails(id);
}

/**
 * Get random recipes
 * @param {number} count - Number of recipes (default: 10)
 * @returns {Promise<Array>} Array of random recipes
 */
export async function getRandomRecipes(count = 10) {
  if (USE_MOCK_DATA) {
    console.log("📦 Getting random recipes from mock data");
    const allRecipes = getMockRecipes();

    // Shuffle array and return requested count
    const shuffled = [...allRecipes].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  return getRandomSpoonacularRecipes(count);
}

/**
 * Check if using mock data
 * @returns {boolean} True if using mock data
 */
export function isUsingMockData() {
  return USE_MOCK_DATA;
}

// Log current mode on load
if (USE_MOCK_DATA) {
  console.log(
    "%c📦 MOCK DATA MODE",
    "background: #fbbf24; color: #000; padding: 4px 8px; font-weight: bold;"
  );
  console.log("Set USE_MOCK_DATA = false in recipeService.js to use real API");
} else {
  console.log(
    "%c🌐 LIVE API MODE",
    "background: #10b981; color: #fff; padding: 4px 8px; font-weight: bold;"
  );
  console.log(
    "Spoonacular API:",
    SPOONACULAR_API_KEY ? "✅ Configured" : "❌ Add your API key"
  );
}
