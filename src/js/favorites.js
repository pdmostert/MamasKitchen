import FavoritesView from "./favorites.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  const view = new FavoritesView("main");
  await view.render();
});
