import { ShoppingView } from "./shoppingView.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  const shoppingView = new ShoppingView("main");
  await shoppingView.init();
});
