// Main application initialization
import { loadData } from './dataService.js';
import { renderBoards } from './boardRenderer.js';
import { attachEventListeners } from './eventHandlers.js';

async function init() {
  await loadData();
  renderBoards();
  attachEventListeners();
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
