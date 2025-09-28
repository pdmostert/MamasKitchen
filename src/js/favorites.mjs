import { storage, loadHeaderFooter } from "./utils.js";
import { mockRecipes } from "./mockRecipes.js";
import { SearchView } from "./search.mjs";

export default class FavoritesView {
  createRecipeCard(recipe) {
    const article = document.createElement("article");
    article.className = "recipe-card";

    const imgWrap = document.createElement("div");
    imgWrap.className = "recipe-image-wrap";
    const img = document.createElement("img");
    img.src = recipe.image;
    img.alt = recipe.title;
    img.className = "recipe-image";
    imgWrap.appendChild(img);

    const body = document.createElement("div");
    body.className = "recipe-body";

    const header = document.createElement("div");
    header.className = "recipe-header";
    const title = document.createElement("h3");
    title.className = "meal-title";
    title.textContent = recipe.title;
    header.appendChild(title);

    const meta = document.createElement("div");
    meta.className = "recipe-meta";
    meta.innerHTML = `
      <span class="muted">${recipe.cookTime}m</span>
      &nbsp;•&nbsp;
      <span class="muted">${recipe.servings}p</span>
      &nbsp;•&nbsp;
      <span class="muted">${recipe.difficulty}</span>
    `;

    const tagsRow = document.createElement("div");
    tagsRow.className = "recipe-tags";
    (recipe.tags || []).forEach((t) => {
      const span = document.createElement("span");
      span.className = "tag muted";
      span.textContent = t;
      tagsRow.appendChild(span);
    });

    const actions = document.createElement("div");
    actions.className = "recipe-actions";

    const viewBtn = document.createElement("button");
    viewBtn.className = "nav-btn";
    viewBtn.textContent = "View Recipe";
    viewBtn.addEventListener("click", () => {
      import("./utils.js").then(({ showRecipeDetailsModal }) => {
        showRecipeDetailsModal(recipe);
      });
    });

    const removeBtn = document.createElement("button");
    removeBtn.className = "nav-btn danger";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      this.removeFavorite(recipe.id);
    });

    actions.appendChild(viewBtn);
    actions.appendChild(removeBtn);

    body.appendChild(header);
    body.appendChild(meta);
    body.appendChild(tagsRow);
    body.appendChild(actions);

    article.appendChild(imgWrap);
    article.appendChild(body);

    return article;
  }

  removeFavorite(id) {
    this.favorites = this.favorites.filter((favId) => favId !== id);
    storage.setFavorites(this.favorites);
    this.favoriteRecipes = mockRecipes.filter((r) =>
      this.favorites.includes(r.id)
    );
    this.render();
  }
  constructor(containerId = "main") {
    this.container = document.getElementById(containerId);
    this.favorites = storage.getFavorites() || [];
    this.favoriteRecipes = mockRecipes.filter((r) =>
      this.favorites.includes(r.id)
    );
  }

  async render() {
    await loadHeaderFooter();
    // Re-select container in case header/footer replaced it
    this.container = document.getElementById("main");
    if (!this.container) {
      console.error(
        "FavoritesView: #main container not found after header/footer load. Check your HTML and templates."
      );
      throw new Error(
        "FavoritesView: #main container not found after header/footer load."
      );
    }
    this.container.innerHTML = "";
    const title = document.createElement("h2");
    title.className = "page-title";
    title.textContent = "Favorite Recipes";
    this.container.appendChild(title);

    if (this.favoriteRecipes.length === 0) {
      const p = document.createElement("p");
      p.className = "muted";
      p.textContent = "You have no favorite recipes yet.";
      this.container.appendChild(p);
    } else {
      const grid = document.createElement("div");
      grid.className = "recipes-grid";
      this.favoriteRecipes.forEach((recipe) => {
        grid.appendChild(this.createRecipeCard(recipe));
      });
      this.container.appendChild(grid);
    }
  }
}
