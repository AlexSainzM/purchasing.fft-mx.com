// Shared exclusive “Ninguno” option. Existing names and conditional handlers stay intact.
document.addEventListener('DOMContentLoaded', function () {
  const none = document.querySelector('[data-certification-none]') || document.getElementById('p06_ninguno');
  if (!none) return;
  const prefix = none.dataset.certificationPrefix || 'p06_';
  const certificates = Array.from(document.querySelectorAll('input[type="checkbox"][name^="' + CSS.escape(prefix) + '"]'))
    .filter(function (field) { return field !== none; });

  none.addEventListener('change', function () {
    if (!none.checked) return;
    certificates.forEach(function (field) {
      field.checked = false;
      field.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
  certificates.forEach(function (field) {
    field.addEventListener('change', function () {
      if (field.checked) none.checked = false;
    });
  });
});
