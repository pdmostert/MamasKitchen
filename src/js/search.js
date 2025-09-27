import { loadHeaderFooter } from "./utils.js";
// Search view renderer

loadHeaderFooter();


function createTag(text) {
  const span = document.createElement("span");
  span.className = "tag muted";
  span.textContent = text;
  return span;
}

function createRecipeCard(recipe, { onView, onAddToPlan, onToggleFavorite, isFavorite }) {
  
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
    tagsRow.appendChild(createTag(t));
  });

  const actions = document.createElement("div");
  actions.className = "recipe-actions";

  const viewBtn = document.createElement("button");
  viewBtn.className = "nav-btn";
  viewBtn.textContent = "View Recipe";
  viewBtn.addEventListener("click", () => onView(recipe));

  const addBtn = document.createElement("button");
  addBtn.className = "nav-btn primary";
  addBtn.textContent = "Add to Plan";
  addBtn.addEventListener("click", () => onAddToPlan(recipe));

  const favBtn = document.createElement("button");
  favBtn.className = "nav-btn nav-inactive";
  favBtn.innerHTML = isFavorite ? "♥ Favorites" : "♡ Favorite";
  favBtn.addEventListener("click", () => onToggleFavorite(recipe, favBtn));

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

function renderList(container, recipes, handlers, favoritesSet) {
  container.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "recipes-grid";
  recipes.forEach((r) => {
    const card = createRecipeCard(r, {
      onView: handlers.onView,
      onAddToPlan: handlers.onAddToPlan,
      onToggleFavorite: handlers.onToggleFavorite,
      isFavorite: favoritesSet.has(r.id),
    });
    grid.appendChild(card);
  });
  container.appendChild(grid);
}

export function renderSearchView(container, recipes, handlers, favorites) {
  container.innerHTML = "";

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

  const listContainer = document.createElement("div");
  listContainer.className = "search-list";

  container.appendChild(header);
  container.appendChild(listContainer);

  const favoritesSet = new Set(favorites || []);

  const doFilter = () => {
    const q = (searchInput.value || "").toLowerCase().trim();
    const filtered = recipes.filter((r) => {
      if (!q) return true;
      if (r.title.toLowerCase().includes(q)) return true;
      if ((r.tags || []).some((t) => t.toLowerCase().includes(q))) return true;
      if (
        (r.ingredients || []).some((ing) => ing.name.toLowerCase().includes(q))
      )
        return true;
      return false;
    });
    renderList(listContainer, filtered, handlers, favoritesSet);
  };


  // wire handlers to update favorites set UI
  const wrappedHandlers = {
    onView: handlers.onView,
    onAddToPlan: handlers.onAddToPlan,
    onToggleFavorite: (recipe, btnEl) => {
      if (favoritesSet.has(recipe.id)) {
        favoritesSet.delete(recipe.id);
        btnEl.innerHTML = "♡ Favorite";
      } else {
        favoritesSet.add(recipe.id);
        btnEl.innerHTML = "♥ Favorites";
      }
      handlers.onToggleFavorite(recipe);
    },
  };

  // use wrapped handlers when rendering so favorite toggles update UI immediately
  renderList(listContainer, recipes, wrappedHandlers, favoritesSet);

  // initial render
  doFilter();

  // initial render
  doFilter();

  return {
    updateFavorites(newFavs) {
      favoritesSet.clear();
      (newFavs || []).forEach((f) => favoritesSet.add(f));
      doFilter();
    },
  };
}
