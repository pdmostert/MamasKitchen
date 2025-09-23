// Simple partials loader for HTML files
class PartialLoader {
  constructor() {
    this.cache = new Map();
  }

  // Load a partial HTML file
  async loadPartial(partialPath) {
    // Check cache first
    if (this.cache.has(partialPath)) {
      return this.cache.get(partialPath);
    }

    try {
      const response = await fetch(partialPath);
      if (!response.ok) {
        throw new Error(`Failed to load partial: ${partialPath}`);
      }

      const html = await response.text();
      this.cache.set(partialPath, html);
      return html;
    } catch (error) {
      console.error("Error loading partial:", error);
      return `<div>Error loading ${partialPath}</div>`;
    }
  }

  // Insert partial into a DOM element
  async insertPartial(elementId, partialPath) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id '${elementId}' not found`);
      return;
    }

    const html = await this.loadPartial(partialPath);
    element.innerHTML = html;
  }

  // Load multiple partials at once
  async loadPartials(partials) {
    const promises = partials.map((partial) =>
      this.insertPartial(partial.elementId, partial.path)
    );

    await Promise.all(promises);
  }
}

// Create global instance
window.partialLoader = new PartialLoader();

// Export for module use
export { PartialLoader };
