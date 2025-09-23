# Mama's Kitchen - Simplified Project Structure

A simple, beginner-friendly meal planning application built with vanilla HTML, CSS, and JavaScript.

## 🏗️ Project Structure

```
src/
├── index.html                 # Main HTML file
├── js/
│   ├── partials.js           # Simple system to load HTML partials
│   ├── navigation.js         # Simple navigation system
│   ├── main-simple.js        # Main application logic (simplified)
│   ├── mealPlan.mjs         # Meal plan component
│   ├── utils.js             # Utility functions
│   └── mockRecipes.js       # Sample recipe data
├── styles/
│   └── styles.css           # Canonical stylesheet (consolidated)
└── public/
    └── partials/
        ├── header.html      # Header partial
        └── footer.html      # Footer partial
```

## 🎯 Key Features (Simplified)

### 1. **Partials System**

- Load header and footer from separate HTML files
- Easy to maintain and modify
- No complex JavaScript needed

### 2. **Simple Navigation**

- Uses data attributes for clean HTML
- Easy event handling
- Clear separation of concerns

### 3. **Organized CSS**

- CSS variables for easy theming
- Nested CSS for better organization
- Color-coded meal types

### 4. **Modular JavaScript**

- Small, focused functions
- Clear separation between files
- Easy to understand and modify

## 🚀 How It Works

### Partials Loading

```javascript
// Load header and footer automatically
await window.partialLoader.loadPartials([
  { elementId: "header-container", path: "./public/partials/header.html" },
  { elementId: "footer-container", path: "./public/partials/footer.html" },
]);
```

### Navigation System

```html
<!-- Simple data attribute navigation -->
<button data-view="meal-plan">Meal Plan</button>
<button data-view="search">Search</button>
```

### CSS Variables

```css
:root {
  --breakfast-color: #ea580c;
  --lunch-color: #16a34a;
  --dinner-color: #2563eb;
  --snack-color: #9333ea;
}
```

## 📁 File Purposes

- **`partials.js`** - Loads HTML partials into containers
- **`navigation.js`** - Handles navigation between views
- **`main-simple.js`** - Main app logic, simplified for beginners
- **`styles.css`** - Canonical stylesheet (consolidated)
- **`header.html`** - Static header with navigation
- **`footer.html`** - Simple footer

## 🎨 Customization

### Colors

Edit the CSS variables in `styles/styles.css`:

```css
:root {
  --primary-color: #000; /* Change main color */
  --breakfast-color: #ea580c; /* Change breakfast color */
  /* ... other colors ... */
}
```

### Navigation

Add new views by:

1. Adding a button with `data-view="your-view"` in `header.html`
2. Adding a case in `changeView()` function in `main-simple.js`

### Styling

The CSS uses nested syntax for better organization:

```css
.meal-plan {
  .title {
    font-size: 2rem;
    /* Nested styles here */
  }

  .grid {
    display: grid;
    /* Grid styles here */
  }
}
```

## 🔧 Development

1. **Start development server:**

   ```bash
   npm start
   ```

2. **The app will run on:** `http://localhost:5173` (or next available port)

3. **Make changes:**
   - Edit HTML partials in `public/partials/`
   - Modify JavaScript in `js/` files

- Update styles in `styles/styles.css`

## 🎓 Learning Points

This simplified version teaches:

- HTML partials and modular design
- CSS variables and nested CSS
- Simple JavaScript modules
- Event handling with data attributes
- Separation of concerns
- Clean, maintainable code structure

Perfect for junior developers learning web development fundamentals!
