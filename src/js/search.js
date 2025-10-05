import { loadHeaderFooter, storage, toast } from "./utils.js";
import { SearchView } from "./search.mjs";
import { getAllRecipes, searchRecipes } from "./recipeService.js";

document.addEventListener("DOMContentLoaded", async () => {
  loadHeaderFooter();

  // Check if there's a type filter in URL (coming from meal planner)
  const urlParams = new URLSearchParams(window.location.search);
  const typeFilter = urlParams.get("type");
  const day = urlParams.get("day");
  const meal = urlParams.get("meal");

  let recipes;

  // If there's a type filter, fetch recipes from Spoonacular for that type
  if (typeFilter) {
    // Show loading message
    if (day && meal) {
      toast.info(`Finding ${meal} recipes for ${day}...`);
    }

    // Map the type to a search query for better results
    const queryMap = {
      breakfast: "breakfast",
      "main course": "main course lunch dinner",
      snack: "snack appetizer",
    };
    const searchQuery = queryMap[typeFilter] || typeFilter;

    recipes = await searchRecipes(searchQuery, {
      number: 30, // Get more results for better selection
      type: typeFilter,
    });

    if (recipes.length > 0) {
      toast.success(`Found ${recipes.length} ${typeFilter} recipes!`);
    }
  } else {
    // Default: get random recipes
    recipes = await getAllRecipes();
  }

  const favorites = storage.getFavorites() || [];
  const searchView = new SearchView("main", recipes, {}, favorites);
  searchView.render();
});
