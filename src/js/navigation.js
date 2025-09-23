// Simple navigation system
class SimpleNavigation {
  constructor() {
    this.currentView = "meal-plan";
    this.init();
  }

  // Initialize navigation after page loads
  init() {
    this.setupNavButtons();
    this.setupMobileMenu();
    this.updateActiveButton();
  }

  // Set up click handlers for navigation buttons
  setupNavButtons() {
    const navButtons = document.querySelectorAll("[data-view]");

    navButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const view = e.currentTarget.dataset.view;
        this.changeView(view);
      });
    });
  }

  // Set up mobile menu toggle
  setupMobileMenu() {
    const mobileButton = document.getElementById("mobile-menu-button");
    if (mobileButton) {
      mobileButton.addEventListener("click", this.toggleMobileMenu);
    }
  }

  // Change the current view
  changeView(view) {
    this.currentView = view;
    this.updateActiveButton();

    // Trigger custom event for other parts of the app
    window.dispatchEvent(
      new CustomEvent("viewChanged", {
        detail: { view: view },
      })
    );
  }

  // Update which button looks active
  updateActiveButton() {
    const allButtons = document.querySelectorAll("[data-view]");

    allButtons.forEach((button) => {
      const isActive = button.dataset.view === this.currentView;

      if (isActive) {
        button.classList.remove("text-gray-700", "hover:bg-gray-100");
        button.classList.add("bg-black", "text-white");
      } else {
        button.classList.remove("bg-black", "text-white");
        button.classList.add("text-gray-700", "hover:bg-gray-100");
      }
    });
  }

  // Simple mobile menu toggle
  toggleMobileMenu() {
    // Simple implementation - just alert for now
    alert("Mobile menu clicked! You can add mobile menu functionality here.");
  }

  // Get current view
  getCurrentView() {
    return this.currentView;
  }
}

// Initialize navigation when page loads
document.addEventListener("DOMContentLoaded", () => {
  window.navigation = new SimpleNavigation();
});

// Export for module use
export { SimpleNavigation };
