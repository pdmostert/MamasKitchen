import { loadHeaderFooter } from "./utils.js";
import { MealPlan } from "./mealPlan.mjs";

async function init() {
  await loadHeaderFooter();
  const container = document.getElementById("main");
  container.innerHTML = "";
  const mealPlan = new MealPlan("main");
  mealPlan.init();
}

document.addEventListener("DOMContentLoaded", init);

