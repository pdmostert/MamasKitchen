import { loadHeaderFooter, storage } from "./utils.js";
import { SearchView } from "./search.mjs";
import { mockRecipes } from "./mockRecipes.js";

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
  const recipes = mockRecipes;
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
