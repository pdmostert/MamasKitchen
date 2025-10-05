import { loadHeaderFooter, storage } from "./utils.js";
import { SearchView } from "./search.mjs";
import { getAllRecipes } from "./recipeService.js";

document.addEventListener("DOMContentLoaded", async () => {
  loadHeaderFooter();
  const recipes = await getAllRecipes();
  const favorites = storage.getFavorites() || [];
  const searchView = new SearchView("main", recipes, {}, favorites);
  searchView.render();
});

