import { storage, loadHeaderFooter, toast } from "./utils.js";
import { createMealPlan } from "./mealPlan.mjs";


function init() {
  
  loadHeaderFooter();

  const data = {
    mealPlan: storage.getMealPlan() || {},
    favorites: storage.getFavorites() || [],
  };

  const container = document.getElementById("app");

  function handleAddMeal(day, mealType) {
    toast.info("Add meal clicked: " + mealType + " for " + day);
  }

  function removeMealFromPlan(day, mealType) {
    if (data.mealPlan[day] && data.mealPlan[day][mealType]) {
      const meal = data.mealPlan[day][mealType];
      delete data.mealPlan[day][mealType];
      if (Object.keys(data.mealPlan[day]).length === 0)
        delete data.mealPlan[day];
      storage.setMealPlan(data.mealPlan);
      render();
      toast.success("Removed " + meal.title + " from meal plan");
    }
  }

  function viewRecipeDetails(recipe) {
    toast.info("Viewing: " + recipe.title);
  }

  function render() {
    container.innerHTML = "";
    const mealPlanEl = createMealPlan(
      data.mealPlan,
      removeMealFromPlan,
      handleAddMeal,
      viewRecipeDetails
    );
    container.appendChild(mealPlanEl);
  }

  render();
}

document.addEventListener("DOMContentLoaded", init);
