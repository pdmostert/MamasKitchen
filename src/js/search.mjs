import { loadHeaderFooter } from "./utils.js";

export class SearchView {
  constructor(
    containerId = "main",
    recipes = [],
    handlers = {},
    favorites = []
  ) {
    this.container = document.getElementById(containerId);
    this.recipes = recipes;
    this.handlers = handlers;
    this.favoritesSet = new Set(favorites);
  }

  createTag(text) {
    const span = document.createElement("span");
    span.className = "tag muted";
    span.textContent = text;
    return span;
  }

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
      tagsRow.appendChild(this.createTag(t));
    });

    const actions = document.createElement("div");
    actions.className = "recipe-actions";

    const viewBtn = document.createElement("button");
    viewBtn.className = "nav-btn";
    viewBtn.textContent = "View Recipe";
    viewBtn.addEventListener("click", () => this.handlers.onView(recipe));

    const addBtn = document.createElement("button");
    addBtn.className = "nav-btn primary";
    addBtn.textContent = "Add to Plan";
    addBtn.addEventListener("click", () => this.handlers.onAddToPlan(recipe));

    const favBtn = document.createElement("button");
    favBtn.className = "nav-btn nav-inactive";
    favBtn.innerHTML = this.favoritesSet.has(recipe.id)
      ? "♥ Favorites"
      : "♡ Favorite";
    favBtn.addEventListener("click", () => {
      if (this.favoritesSet.has(recipe.id)) {
        this.favoritesSet.delete(recipe.id);
        favBtn.innerHTML = "♡ Favorite";
      } else {
        this.favoritesSet.add(recipe.id);
        favBtn.innerHTML = "♥ Favorites";
      }
      this.handlers.onToggleFavorite(recipe);
    });

    actions.appendChild(viewBtn);
    actions.appendChild(addBtn);
    actions.appendChild(favBtn);

    body.appendChild(header);
    body.appendChild(meta);
    body.appendChild(tagsRow);
    body.appendChild(actions);

    article.appendChild(imgWrap);
    article.appendChild(body);

    return article;
  }

  renderList(recipes) {
    this.container.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "recipes-grid";
    recipes.forEach((r) => {
      const card = this.createRecipeCard(r);
      grid.appendChild(card);
    });
    this.container.appendChild(grid);
  }

  filterRecipes(query) {
    const q = (query || "").toLowerCase().trim();
    return this.recipes.filter((r) => {
      if (!q) return true;
      if (r.title.toLowerCase().includes(q)) return true;
      if ((r.tags || []).some((t) => t.toLowerCase().includes(q))) return true;
      if (
        (r.ingredients || []).some((ing) => ing.name.toLowerCase().includes(q))
      )
        return true;
      return false;
    });
  }

  renderSearchHeader() {
    const header = document.createElement("div");
    header.className = "search-header";

    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.placeholder = "Search recipes, ingredients, or tags...";
    searchInput.className = "search-input";

    const filterBtn = document.createElement("button");
    filterBtn.className = "nav-btn";
    filterBtn.textContent = "Filters";

    header.appendChild(searchInput);
    header.appendChild(filterBtn);

    searchInput.addEventListener("input", () => {
      const filtered = this.filterRecipes(searchInput.value);
      this.renderList(filtered);
    });

    return header;
  }

  render() {
    this.container.innerHTML = "";
    const header = this.renderSearchHeader();
    this.container.appendChild(header);
    this.renderList(this.recipes);
  }

  updateFavorites(newFavs) {
    this.favoritesSet = new Set(newFavs || []);
    this.renderList(this.recipes);
  }
}
