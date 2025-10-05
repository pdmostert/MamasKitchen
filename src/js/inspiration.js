import { loadHeaderFooter } from "./utils.js";
import { InspirationView } from "./inspiration.mjs";

async function init() {
  await loadHeaderFooter();
  const container = document.getElementById("main");
  container.innerHTML = "";
  const inspirationView = new InspirationView("main");
  inspirationView.init();
}

document.addEventListener("DOMContentLoaded", init);
