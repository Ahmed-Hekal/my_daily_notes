// Utility functions

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function formatStatus(status) {
  return status.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
