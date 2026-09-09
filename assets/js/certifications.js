// Shared exclusive “Ninguno” option. Existing names and conditional handlers stay intact.
document.addEventListener('DOMContentLoaded', function () {
  const none = document.getElementById('p06_ninguno');
  const certificates = Array.from(document.querySelectorAll('input[type="checkbox"][name^="p06_"]'))
    .filter(function (field) { return field !== none; });
  if (!none) return;

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
