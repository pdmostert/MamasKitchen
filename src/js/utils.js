/**
 * Shows a modal dialog with the given HTML content and optional title.
 * Returns a function to close the modal.
 */
export function showModal({ title = "", content = "", onClose = null }) {
  // Remove any existing modal
  const existing = document.getElementById("global-modal");
  if (existing) existing.remove();

  // Modal overlay
  const overlay = document.createElement("div");
  overlay.id = "global-modal";
  overlay.className = "modal-overlay";

  // Modal box
  const modal = document.createElement("div");
  modal.className = "modal-box";

  // Title (optional)
  if (title) {
    const titleEl = document.createElement("h2");
    titleEl.className = "modal-title";
    titleEl.textContent = title;
    modal.appendChild(titleEl);
  }

  // Content
  const contentEl = document.createElement("div");
  contentEl.className = "modal-content";
  if (typeof content === "string") {
    contentEl.innerHTML = content;
  } else {
    contentEl.appendChild(content);
  }
  modal.appendChild(contentEl);

  // Button row
  const btnRow = document.createElement("div");
  btnRow.className = "modal-btn-row";
  const closeBtn = document.createElement("button");
  closeBtn.className = "modal-btn modal-cancel";
  closeBtn.textContent = "Close";
  closeBtn.onclick = () => {
    overlay.remove();
    if (typeof onClose === "function") onClose();
  };
  btnRow.appendChild(closeBtn);
  modal.appendChild(btnRow);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  return () => overlay.remove();
}
// Utility functions for loading templates, managing localStorage, and showing toasts

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

// Load an HTML template from a file
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// Load Partials
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");

  const headerElement = document.querySelector("#site-header");
  const footerElement = document.querySelector("#site-footer");
  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
  // Navigation initialization is intentionally not forced here.
  // Pages that want extra JS-driven nav behavior (mobile menu, active state)
  // can include or import `./navigation.js` themselves.
}

// LocalStorage utilities
export const storage = {
  getFavorites: () => {
    try {
      const saved = localStorage.getItem("mealPlannerFavorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  setFavorites: (favorites) => {
    try {
      localStorage.setItem("mealPlannerFavorites", JSON.stringify(favorites));
    } catch (_error) {
      // ignore storage write errors in browsers where storage may be disabled
    }
  },

  getMealPlan: () => {
    try {
      const saved = localStorage.getItem("mealPlannerMealPlan");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  },

  setMealPlan: (mealPlan) => {
    try {
      localStorage.setItem("mealPlannerMealPlan", JSON.stringify(mealPlan));
    } catch (_error) {
      // ignore storage write errors
    }
  },
};

// Simple toast notification system
export function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toast-container");

  const toastEl = document.createElement("div");
  toastEl.className = `toast ${type === "success" ? "toast-success" : type === "error" ? "toast-error" : "toast-info"}`;

  toastEl.textContent = message;
  toastContainer.appendChild(toastEl);

  // Animate in
  setTimeout(() => {
    toastEl.classList.add("toast-enter");
  }, 10);

  // Auto remove after 3 seconds
  setTimeout(() => {
    toastEl.classList.remove("toast-enter");
    toastEl.classList.add("toast-exit");
    setTimeout(() => {
      if (toastEl.parentNode) {
        toastEl.parentNode.removeChild(toastEl);
      }
    }, 300);
  }, 3000);
}

export const toast = {
  success: (message) => showToast(message, "success"),
  error: (message) => showToast(message, "error"),
  info: (message) => showToast(message, "info"),
};
