import { loadHeaderFooter } from "./utils.js";

async function init() {
  await loadHeaderFooter();
  const container = document.getElementById("app");
  container.innerHTML = "";

  const main = document.createElement("main");
  main.className = "page-main";
  const title = document.createElement("h2");
  title.className = "page-title";
  title.textContent = "Nutrition Info";
  main.appendChild(title);

  const p = document.createElement("p");
  p.className = "muted";
  p.textContent = "Nutrition functionality coming soon!";
  main.appendChild(p);

  container.appendChild(main);
}

document.addEventListener("DOMContentLoaded", init);
