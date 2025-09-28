// Centralized recipe fetching logic for mock data and future API integration
import { mockRecipes } from "./mockRecipes.js";

export function getAllRecipes() {
  // Spoonacular mockRecipes is an array with one object containing .recipes
  if (
    Array.isArray(mockRecipes) &&
    mockRecipes.length > 0 &&
    Array.isArray(mockRecipes[0].recipes[0])
  ) {
    return mockRecipes[0].recipes[0];
  }
  // Fallback: if mockRecipes is just an array of recipes
  if (Array.isArray(mockRecipes)) {
    return mockRecipes;
  }
  // Fallback: if mockRecipes.recipes exists
  if (mockRecipes.recipes) {
    return mockRecipes.recipes;
  }
  return [];
}

// For future: add fetchRecipesFromAPI() here
