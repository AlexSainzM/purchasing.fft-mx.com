/**
 * Plantilla de Validación de Formularios - FFT México
 * Archivo base para nuevos formularios
 */

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  initializeTooltips();
});

/**
 * Inicializa los tooltips de Bootstrap
 */
function initializeTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

// Log para debug
console.log('✅ Plantilla de formularios FFT México inicializada correctamente');
