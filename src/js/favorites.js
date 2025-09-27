import { storage, loadHeaderFooter, toast } from "./utils.js";

async function init() {
  await loadHeaderFooter();

  const favorites = storage.getFavorites() || [];
  const container = document.getElementById("app");
  container.innerHTML = "";

  const main = document.createElement("main");
  main.className = "page-main";
  const title = document.createElement("h2");
  title.className = "page-title";
  title.textContent = "Favorite Recipes";
  main.appendChild(title);

  if (favorites.length === 0) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "You have no favorite recipes yet.";
    main.appendChild(p);
  } else {
    const list = document.createElement("div");
    list.className = "favorites-list";
    favorites.forEach((id) => {
      const item = document.createElement("div");
      item.className = "favorite-item";
      item.textContent = `Recipe id: ${id}`;
      list.appendChild(item);
    });
    main.appendChild(list);
  }

  container.appendChild(main);
}

document.addEventListener("DOMContentLoaded", init);
