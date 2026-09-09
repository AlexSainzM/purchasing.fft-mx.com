/**
 * FFT México - Static Form Template
 * Template Version: 1.1.0
 *
 * TEMPLATE CORE — protected reusable infrastructure.
 * FORM-SPECIFIC CONTENT — implemented in the FORM-SPECIFIC LOGIC section below.
 * TEMPLATE CONFIGURATION lives in index.html, not here.
 */

// ======================================================
// TEMPLATE CORE — DO NOT MODIFY FOR INDIVIDUAL FORMS
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
  initializeTooltips();
  initializeFormValidation();
  initializeDynamicYear();
});

/**
 * Initializes every Bootstrap tooltip declared in the document.
 * The guard keeps the template usable if the CDN is unavailable.
 */
function initializeTooltips() {
  if (!window.bootstrap?.Tooltip) {
    return;
  }

  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((trigger) => {
    new window.bootstrap.Tooltip(trigger);
  });
}

/**
 * Applies reusable Bootstrap-compatible HTML5 validation to the main form.
 */
function initializeFormValidation() {
  const form = document.getElementById('mainForm');

  if (!form) {
    return;
  }

  form.addEventListener('submit', (event) => {
    const isValid = form.checkValidity();

    if (!isValid) {
      event.preventDefault();
      event.stopPropagation();
      focusFirstInvalidField(form);
    }

    form.classList.add('was-validated');
  });
}

/**
 * Moves keyboard focus to the first invalid control when possible.
 */
function focusFirstInvalidField(form) {
  const firstInvalidField = form.querySelector(':invalid');

  if (firstInvalidField instanceof HTMLElement) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    firstInvalidField.focus({ preventScroll: true });
    firstInvalidField.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'center'
    });
  }
}

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
// FORM-SPECIFIC LOGIC  (FORM-SPECIFIC CONTENT)
// Add conditional fields, calculations, or business
// rules for each form below this section.
// Do not implement a generic conditional-form engine.
//
// Conditional-field convention:
// - Conditional fields required when active must use data-required="true".
// - When hidden/inactive:
//     add d-none to the conditional container,
//     disable its controls,
//     set their required property to false.
// - When visible/active:
//     remove d-none,
//     enable its controls,
//     restore required only when data-required="true".
// ======================================================