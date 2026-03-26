// Utility functions for the To-Do List application

/**
 * Format a date string (YYYY-MM-DD) to a readable format
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
  if (!dateString) {
    return '';
  }

  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', options);
}

/**
 * Escape HTML special characters to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
