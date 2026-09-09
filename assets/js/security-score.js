// Shared by Distribuidores and Servicios. Fields keep each document's numbering.
const ALLOWED_SECURITY_SCORES = new Set(['0', '4', '6', '8', '10']);

function isValidSecurityScore(value) {
  return ALLOWED_SECURITY_SCORES.has(value);
}

function initializeSecurityScore() {
  document.querySelectorAll('.si-score').forEach(function (field) {
    field.addEventListener('change', updateSecuritySubtotal);
  });
  updateSecuritySubtotal();
}

function updateSecuritySubtotal() {
  const total = Array.from(document.querySelectorAll('.si-score')).reduce(function (sum, field) {
    return sum + (isValidSecurityScore(field.value) ? Number(field.value) : 0);
  }, 0);
  const subtotal = document.getElementById('subtotal_seguridad_informacion');
  if (subtotal) subtotal.value = String(total);
  return total;
}
