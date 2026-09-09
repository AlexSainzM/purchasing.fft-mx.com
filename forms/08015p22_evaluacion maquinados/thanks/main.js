/**
 * FFT México - Static Thanks Template
 * Template Version: 1.0.0
 *
 * TEMPLATE CORE — protected reusable infrastructure.
 * PAGE-SPECIFIC CONTENT — implemented in the PAGE-SPECIFIC LOGIC section below.
 * TEMPLATE CONFIGURATION lives in index.html, not here.
 */

// ======================================================
// TEMPLATE CORE — DO NOT MODIFY FOR INDIVIDUAL PAGES
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
  initializeDynamicYear();
});

/**
 * Keeps the copyright year current without manual maintenance.
 */
function initializeDynamicYear() {
  const yearElement = document.getElementById('currentYear');

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
}

// ======================================================
// PAGE-SPECIFIC LOGIC  (PAGE-SPECIFIC CONTENT)
// Add confirmation-only behavior for each page below
// this section. Do not modify TEMPLATE CORE when the
// requirement can be solved independently here.
// ======================================================
