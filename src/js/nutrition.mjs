import { storage, toast } from "./utils.js";
import { analyzeNutrition } from "./nutritionService.js";

export default class NutritionView {
  constructor(containerId = "app") {
    this.data = {
      mealPlan: storage.getMealPlan() || {},
      nutrition: {},
    };

    this.container = document.getElementById(containerId);
  }

  //use ingredients from meal plan to get nutrition info
  async fetchNutritionInfo() {
    const allIngredients = [];
    for (const day in this.data.mealPlan) {
      for (const mealType in this.data.mealPlan[day]) {
        const recipe = this.data.mealPlan[day][mealType];
        if (recipe && recipe.extendedIngredients) {
          recipe.extendedIngredients.forEach((ing) => {
            allIngredients.push(ing.original);
          });
        }
      }
    }

    // Fetch nutrition info for all ingredients
    if (allIngredients.length > 0) {
      // Simple filter to only keep ingredients that start with a number or fraction
      const isValidIngredient = (ingredient) => {
        const trimmed = ingredient.trim();
        // Check if it starts with:
        // - A number (1, 2, 10, etc.)
        // - A fraction (1/2, 3/4, etc.)
        // - A decimal (0.5, 1.25, etc.)
        // - Common fraction characters (½, ¼, etc.)
        const validPattern = /^(\d+(\.\d+)?|\d+\/\d+|[½¼¾⅓⅔⅛⅜⅝⅞])/;
        return validPattern.test(trimmed);
      };

      const validIngredients = allIngredients.filter(isValidIngredient);

      console.log(`Original ingredients: ${allIngredients.length}`);
      console.log(`Valid ingredients: ${validIngredients.length}`);
      console.log("Valid Ingredients:", validIngredients);

      if (validIngredients.length === 0) {
        console.warn("No valid ingredients found for nutrition analysis");
        this.data.nutrition = {};
        return;
      }

      const nutritionData = await analyzeNutrition(validIngredients);
      this.data.nutrition = nutritionData || {};
    }
  }

  render() {
    // Render the nutrition information
    this.container.innerHTML = `
           <h2>Nutrition Information</h2>
           <pre>${JSON.stringify(this.data.nutrition, null, 2)}</pre>
       `;
  }

  async init() {
    await this.fetchNutritionInfo();
    this.render();
  }
}

export { NutritionView };
