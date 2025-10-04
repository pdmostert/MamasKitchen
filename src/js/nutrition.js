import { loadHeaderFooter } from "./utils.js";
import { NutritionView } from "./nutrition.mjs";

async function init() {
  await loadHeaderFooter();
   const container = document.getElementById("main");
  container.innerHTML = "";
  const nutritionInfo = new NutritionView("main");
  nutritionInfo.init();
}

document.addEventListener("DOMContentLoaded", init);
