import { toast } from "./utils.js";

const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = "https://api.spoonacular.com";

/**
 * Search for recipes using Spoonacular API
 * @param {string} query - Search query string
 * @param {Object} options - Optional parameters (number, diet, cuisine, type)
 * @returns {Array} - Array of recipe objects
 */
async function searchSpoonacularRecipes(query, options = {}) {
  if (!SPOONACULAR_API_KEY) {
    console.error("Spoonacular API key not configured");
    toast.error("Recipe search is not configured. Please add an API key.");
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
    ...(options.type && { type: options.type }),
  });

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/complexSearch?${params}`
    );

    if (!response.ok) {
      if (response.status === 402) {
        toast.error("API limit reached. Please try again later.");
      } else if (response.status === 401) {
        toast.error("Invalid API key. Please check your configuration.");
      } else {
        toast.error("Failed to search recipes. Please try again.");
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching from Spoonacular:", error);
    // Only show toast if not already shown above
    if (!error.message.includes("API error")) {
      toast.error("Network error. Please check your connection.");
    }
    return [];
  }
}
/**
 * Get random recipes from Spoonacular API
 * @param {number} count - Number of random recipes to fetch
 * @returns {Array} - Array of recipe objects
 */
async function getRandomSpoonacularRecipes(count = 10) {
  if (!SPOONACULAR_API_KEY) {
    console.error("Spoonacular API key not configured");
    toast.error("Recipe service is not configured. Please add an API key.");
    return [];
  }

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/random?apiKey=${SPOONACULAR_API_KEY}&number=${count}`
    );

    if (!response.ok) {
      if (response.status === 402) {
        toast.error("API limit reached. Please try again later.");
      } else if (response.status === 401) {
        toast.error("Invalid API key. Please check your configuration.");
      } else {
        toast.error("Failed to load recipes. Please try again.");
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.recipes || [];
  } catch (error) {
    console.error("Error fetching random recipes:", error);
    if (!error.message.includes("API error")) {
      toast.error("Network error. Please check your connection.");
    }
    return [];
  }
}
/**
 * Get detailed information for a specific recipe
 * @param {number} id - Recipe ID from Spoonacular
 * @returns {Object|null} - Recipe details object or null if error
 */
async function getSpoonacularRecipeDetails(id) {
  if (!SPOONACULAR_API_KEY) {
    console.error("Spoonacular API key not configured");
    toast.error("Recipe service is not configured. Please add an API key.");
    return null;
  }

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 402) {
        toast.error("API limit reached. Please try again later.");
      } else if (response.status === 401) {
        toast.error("Invalid API key. Please check your configuration.");
      } else if (response.status === 404) {
        toast.error("Recipe not found.");
      } else {
        toast.error("Failed to load recipe details. Please try again.");
      }
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    if (!error.message.includes("API error")) {
      toast.error("Network error. Please check your connection.");
    }
    return null;
  }
}

export function getAllRecipes() {
  return getRandomSpoonacularRecipes(20);
}

export async function searchRecipes(query, options = {}) {
  return searchSpoonacularRecipes(query, options);
}

export async function getRecipeById(id) {
  return getSpoonacularRecipeDetails(id);
}

export async function getRandomRecipes(count = 20) {
  return getRandomSpoonacularRecipes(count);
}
