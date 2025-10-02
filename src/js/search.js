import { loadHeaderFooter, storage } from "./utils.js";
import { SearchView } from "./search.mjs";
import { getAllRecipes } from "./recipeService.js";

document.addEventListener("DOMContentLoaded", async () => {
  loadHeaderFooter();
  
  // Fetch recipes using the new service (handles mock vs real API automatically)
  const recipes = await getAllRecipes();
  
  const handlers = {
    onView: (recipe) => {
      alert(`View: ${recipe.title}`);
    },
    onAddToPlan: (recipe) => {
      alert(`Add to plan: ${recipe.title}`);
    },
    onToggleFavorite: (recipe) => {
      alert(`Toggle favorite: ${recipe.title}`);
    },
  };
  const favorites = storage.getFavorites() || [];
  const searchView = new SearchView("main", recipes, handlers, favorites);
  searchView.render();
});

