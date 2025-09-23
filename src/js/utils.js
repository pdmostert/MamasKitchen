

// LocalStorage utilities
export const storage = {
  getFavorites: () => {
    try {
      const saved = localStorage.getItem('mealPlannerFavorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },
  
  setFavorites: (favorites) => {
    try {
      localStorage.setItem('mealPlannerFavorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  },
  
  getMealPlan: () => {
    try {
      const saved = localStorage.getItem('mealPlannerMealPlan');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  },
  
  setMealPlan: (mealPlan) => {
    try {
      localStorage.setItem('mealPlannerMealPlan', JSON.stringify(mealPlan));
    } catch (error) {
      console.error('Failed to save meal plan:', error);
    }
  }
};

// Simple toast notification system
export function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `
    px-4 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 translate-x-full
    ${type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'}
  `;
  
  toast.textContent = message;
  toastContainer.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 10);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

export const toast = {
  success: (message) => showToast(message, 'success'),
  error: (message) => showToast(message, 'error'),
  info: (message) => showToast(message, 'info')
};
