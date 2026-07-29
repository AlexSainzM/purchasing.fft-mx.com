/**
 * Autoevaluación de los fabricantes - FFT México
 * Documento: 08015p22 | Rev.: 5
 */

// Sustituir REEMPLAZAR_ID por el ID proporcionado por Formspree.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/REEMPLAZAR_ID';

const STEP_NAMES = [
  'Datos de la empresa',
  'General',
  'Experiencia',
  'Personal',
  'Tecnología',
  'Seguridad',
  'Medio ambiente',
  'Calidad',
  'Envío',
  'Seguridad de la Información'
];

const SI_SCORE_IDS = [
  'p55_puntuacion_confidencialidad_empleados',
  'p56_puntuacion_capacitacion_seguridad_informacion',
  'p57_puntuacion_zonas_seguridad_acceso',
  'p58_puntuacion_permisos_datos_clientes',
  'p59_puntuacion_clasificacion_informacion',
  'p60_puntuacion_copias_seguridad',
  'p61_puntuacion_confidencialidad_proveedores',
  'p62_puntuacion_firewall'
];

const ALLOWED_SI_SCORES = new Set(['0', '4', '6', '8', '10']);

let currentStep = 0;
let isSubmitting = false;

document.addEventListener('DOMContentLoaded', function () {
  initializeFooterYear();
  initializeTooltips();
  initializeFormSteps();
  initializeConditionalFields();
  initializeInformationSecurityScore();
  initializeFileInputs();
  initializeFormSubmit();
});

function initializeFooterYear() {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

function initializeTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

function initializeFormSteps() {
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');

  if (btnPrev) {
    btnPrev.addEventListener('click', function () {
      if (currentStep > 0) {
        showStep(currentStep - 1);
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', function () {
      if (!validateCurrentStep()) {
        return;
      }
      if (currentStep < STEP_NAMES.length - 1) {
        showStep(currentStep + 1);
      }
    });
  }

  showStep(0);
}

function showStep(index) {
  const steps = document.querySelectorAll('.form-step');
  const total = STEP_NAMES.length;

  if (index < 0 || index >= total) {
    return;
  }

  currentStep = index;

  steps.forEach(function (step) {
    const stepIndex = Number(step.getAttribute('data-step'));
    const isActive = stepIndex === currentStep;
    step.classList.toggle('d-none', !isActive);
  });

  updateProgress();
  updateNavigationButtons();
  scrollToFormTop();
}

function updateProgress() {
  const total = STEP_NAMES.length;
  const percent = Math.round(((currentStep + 1) / total) * 100);

  const stepIndicator = document.getElementById('stepIndicator');
  const stepName = document.getElementById('stepName');
  const progressPercent = document.getElementById('progressPercent');
  const progressBar = document.getElementById('progressBar');
  const progressContainer = progressBar ? progressBar.parentElement : null;

  if (stepIndicator) {
    stepIndicator.textContent = 'Paso ' + (currentStep + 1) + ' de ' + total;
  }
  if (stepName) {
    stepName.textContent = STEP_NAMES[currentStep];
  }
  if (progressPercent) {
    progressPercent.textContent = percent + '%';
  }
  if (progressBar) {
    progressBar.style.width = percent + '%';
  }
  if (progressContainer) {
    progressContainer.setAttribute('aria-valuenow', String(percent));
  }

  document.querySelectorAll('.step-item').forEach(function (item) {
    const itemIndex = Number(item.getAttribute('data-step-label'));
    item.classList.toggle('active', itemIndex === currentStep);
    item.classList.toggle('completed', itemIndex < currentStep);

    if (itemIndex === currentStep) {
      item.setAttribute('aria-current', 'step');
    } else {
      item.removeAttribute('aria-current');
    }
  });
}

function updateNavigationButtons() {
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnSubmit = document.getElementById('btnSubmit');
  const lastStep = currentStep === STEP_NAMES.length - 1;

  if (btnPrev) {
    btnPrev.classList.toggle('d-none', currentStep === 0);
  }
  if (btnNext) {
    btnNext.classList.toggle('d-none', lastStep);
  }
  if (btnSubmit) {
    btnSubmit.classList.toggle('d-none', !lastStep);
  }
}

function scrollToFormTop() {
  const formSection = document.getElementById('_form');
  if (!formSection) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  formSection.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start'
  });
}

function getCurrentStepElement() {
  return document.querySelector('.form-step[data-step="' + currentStep + '"]');
}

function isFieldVisible(field) {
  if (!field || field.disabled) {
    return false;
  }

  let node = field;
  while (node && node !== document.body) {
    if (node.classList && node.classList.contains('d-none')) {
      return false;
    }
    node = node.parentElement;
  }

  return true;
}

function validateCurrentStep() {
  const stepEl = getCurrentStepElement();
  if (!stepEl) {
    return true;
  }

  clearStepValidation(stepEl);

  let isValid = true;
  const fields = stepEl.querySelectorAll('input, select, textarea');

  fields.forEach(function (field) {
    if (!isFieldVisible(field)) {
      return;
    }

    if (field.type === 'radio') {
      return;
    }

    if (field.type === 'checkbox' && field.name && stepEl.querySelector('[data-checkbox-group="' + field.name + '"]')) {
      return;
    }

    if (!field.checkValidity()) {
      field.classList.add('is-invalid');
      isValid = false;
    } else {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
    }
  });

  // Validar grupos de radio visibles
  const radioNames = new Set();
  stepEl.querySelectorAll('input[type="radio"]').forEach(function (radio) {
    if (isFieldVisible(radio)) {
      radioNames.add(radio.name);
    }
  });

  radioNames.forEach(function (name) {
    const radios = Array.from(stepEl.querySelectorAll('input[type="radio"][name="' + name + '"]'))
      .filter(isFieldVisible);
    const checked = radios.some(function (radio) {
      return radio.checked;
    });

    if (!checked) {
      isValid = false;
      radios.forEach(function (radio) {
        radio.classList.add('is-invalid');
      });
    } else {
      radios.forEach(function (radio) {
        radio.classList.remove('is-invalid');
      });
    }
  });

  if (!validateCheckboxGroups(stepEl)) {
    isValid = false;
  }

  if (!validateInformationSecurityScores(stepEl)) {
    isValid = false;
  }

  stepEl.classList.add('was-validated');

  if (!isValid) {
    focusFirstInvalidField(stepEl);
  }

  return isValid;
}

function validateCheckboxGroups(scope) {
  let isValid = true;
  const groups = scope.querySelectorAll('[data-checkbox-group]');

  groups.forEach(function (group) {
    if (group.classList.contains('d-none') || !isFieldVisible(group)) {
      return;
    }

    const name = group.getAttribute('data-checkbox-group');
    const checkboxes = Array.from(group.querySelectorAll('input[type="checkbox"][name="' + name + '"]'))
      .filter(isFieldVisible);
    const feedback = group.querySelector('.checkbox-group-feedback');
    const anyChecked = checkboxes.some(function (cb) {
      return cb.checked;
    });

    if (!anyChecked) {
      isValid = false;
      group.classList.add('is-invalid');
      checkboxes.forEach(function (cb) {
        cb.classList.add('is-invalid');
      });
      if (feedback) {
        feedback.classList.remove('d-none');
      }
    } else {
      group.classList.remove('is-invalid');
      checkboxes.forEach(function (cb) {
        cb.classList.remove('is-invalid');
      });
      if (feedback) {
        feedback.classList.add('d-none');
      }
    }
  });

  return isValid;
}

function validateInformationSecurityScores(scope) {
  let isValid = true;

  SI_SCORE_IDS.forEach(function (id) {
    const field = scope.querySelector('#' + id);
    if (!field || !isFieldVisible(field)) {
      return;
    }

    if (!ALLOWED_SI_SCORES.has(field.value)) {
      field.classList.add('is-invalid');
      isValid = false;
    }
  });

  return isValid;
}

function clearStepValidation(stepEl) {
  stepEl.classList.remove('was-validated');
  stepEl.querySelectorAll('.is-invalid, .is-valid').forEach(function (el) {
    el.classList.remove('is-invalid', 'is-valid');
  });
  stepEl.querySelectorAll('.checkbox-group-feedback').forEach(function (el) {
    el.classList.add('d-none');
  });
}

function focusFirstInvalidField(scope) {
  const firstInvalid = scope.querySelector('.is-invalid, :invalid');
  if (firstInvalid && typeof firstInvalid.focus === 'function') {
    firstInvalid.focus({ preventScroll: false });
  }
}

function findFirstInvalidStep() {
  const previousStep = currentStep;

  for (let i = 0; i < STEP_NAMES.length; i += 1) {
    showStep(i);
    if (!validateCurrentStep()) {
      return i;
    }
  }

  showStep(previousStep);
  return -1;
}

function initializeConditionalFields() {
  // Triggers: checkboxes y grupos de radio con data-conditional-trigger
  document.querySelectorAll('[data-conditional-trigger]').forEach(function (trigger) {
    if (trigger.type === 'radio') {
      document.querySelectorAll('input[type="radio"][name="' + CSS.escape(trigger.name) + '"]').forEach(function (radio) {
        if (radio.dataset.conditionalListener === '1') {
          return;
        }
        radio.dataset.conditionalListener = '1';
        radio.addEventListener('change', function () {
          updateConditionalField(trigger);
        });
      });
    } else {
      trigger.addEventListener('change', function () {
        updateConditionalField(trigger);
      });
    }
    updateConditionalField(trigger);
  });

  // Pregunta 7: visible solo si ISO 9001 NO está marcado
  const iso9001 = document.getElementById('p06_iso9001');
  if (iso9001) {
    iso9001.addEventListener('change', updateIso9001PlanVisibility);
    updateIso9001PlanVisibility();
  }

  // Pregunta 44 anidada: archivo solo si p44 = Sí
  document.querySelectorAll('input[name="p44_mantenimiento_documentado"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      updateNestedConditionalByValue('p44_mantenimiento_documentado', 'p44_archivo_mantenimiento_medicion', 'Sí');
    });
  });
}

function updateConditionalField(trigger) {
  const targetKey = trigger.getAttribute('data-conditional-trigger');
  if (!targetKey) {
    return;
  }

  const targets = document.querySelectorAll('[data-conditional="' + targetKey + '"]');
  if (!targets.length) {
    return;
  }

  let shouldShow = false;

  if (trigger.type === 'checkbox') {
    shouldShow = trigger.checked;
  } else if (trigger.type === 'radio') {
    const checked = document.querySelector('input[name="' + CSS.escape(trigger.name) + '"]:checked');
    const expected = targets[0].getAttribute('data-show-when-value') || 'Sí';
    shouldShow = Boolean(checked && checked.value === expected);
  }

  targets.forEach(function (target) {
    setConditionalVisibility(target, shouldShow);
  });

  // p44 depende de p43; al ocultarse también limpia el archivo anidado
  if (targetKey === 'p44_mantenimiento_documentado' && !shouldShow) {
    const fileTarget = document.querySelector('[data-conditional="p44_archivo_mantenimiento_medicion"]');
    if (fileTarget) {
      setConditionalVisibility(fileTarget, false);
    }
  }

  if (targetKey === 'p44_mantenimiento_documentado' && shouldShow) {
    updateNestedConditionalByValue('p44_mantenimiento_documentado', 'p44_archivo_mantenimiento_medicion', 'Sí');
  }
}

function updateNestedConditionalByValue(radioName, conditionalKey, expectedValue) {
  const checked = document.querySelector('input[name="' + radioName + '"]:checked');
  const target = document.querySelector('[data-conditional="' + conditionalKey + '"]');
  if (!target) {
    return;
  }

  const shouldShow = Boolean(checked && checked.value === expectedValue);
  setConditionalVisibility(target, shouldShow);
}

function updateIso9001PlanVisibility() {
  const iso9001 = document.getElementById('p06_iso9001');
  const target = document.querySelector('[data-conditional="p07_planea_certificarse_iso9001"]');
  if (!iso9001 || !target) {
    return;
  }

  // Visible y obligatoria únicamente cuando ISO 9001 NO está seleccionada
  const shouldShow = !iso9001.checked;
  setConditionalVisibility(target, shouldShow);

  if (shouldShow) {
    // El campo de fecha estimada solo aplica si la respuesta es "Sí"
    updateNestedConditionalByValue(
      'p07_planea_certificarse_iso9001',
      'p07_fecha_estimada_certificacion_iso9001',
      'Sí'
    );
  }
}

function setConditionalVisibility(target, shouldShow) {
  target.classList.toggle('d-none', !shouldShow);

  const controls = Array.from(target.querySelectorAll('input, select, textarea'));
  if (target.matches && target.matches('input, select, textarea')) {
    controls.unshift(target);
  }

  const uniqueControls = Array.from(new Set(controls));
  const handledRadioGroups = new Set();

  uniqueControls.forEach(function (field) {
    // Al mostrar un bloque, no forzar required en campos anidados aún ocultos
    if (shouldShow && isInsideHiddenNestedConditional(field, target)) {
      return;
    }

    if (shouldShow) {
      if (field.type === 'radio') {
        if (handledRadioGroups.has(field.name)) {
          return;
        }
        handledRadioGroups.add(field.name);
        const group = target.querySelectorAll('input[type="radio"][name="' + field.name + '"]');
        group.forEach(function (radio, index) {
          radio.required = index === 0;
          radio.disabled = false;
        });
      } else if (field.type === 'checkbox') {
        field.disabled = false;
      } else {
        field.required = true;
        field.disabled = false;
      }
    } else {
      clearFieldValue(field);
      field.required = false;
      field.disabled = true;
      field.classList.remove('is-invalid', 'is-valid');
    }
  });
}

function isInsideHiddenNestedConditional(field, root) {
  let node = field.parentElement;
  while (node && node !== root) {
    if (node.classList && node.classList.contains('d-none')) {
      return true;
    }
    node = node.parentElement;
  }
  return false;
}

function clearFieldValue(field) {
  if (!field) {
    return;
  }

  if (field.type === 'file') {
    field.value = '';
    return;
  }

  if (field.type === 'checkbox' || field.type === 'radio') {
    field.checked = false;
    return;
  }

  field.value = '';
}

function initializeInformationSecurityScore() {
  SI_SCORE_IDS.forEach(function (id) {
    const field = document.getElementById(id);
    if (!field) {
      return;
    }

    field.addEventListener('change', function () {
      calculateInformationSecuritySubtotal();
    });
  });

  calculateInformationSecuritySubtotal();
}

function calculateInformationSecuritySubtotal() {
  let total = 0;

  SI_SCORE_IDS.forEach(function (id) {
    const field = document.getElementById(id);
    if (!field || field.value === '') {
      return;
    }

    const value = Number(field.value);
    if (ALLOWED_SI_SCORES.has(String(field.value))) {
      total += value;
    }
  });

  const subtotalField = document.getElementById('subtotal_seguridad_informacion');
  if (subtotalField) {
    subtotalField.value = String(total);
  }

  return total;
}

function initializeFileInputs() {
  document.querySelectorAll('input[type="file"]').forEach(function (input) {
    input.addEventListener('change', function () {
      if (input.files && input.files.length > 0) {
        input.classList.remove('is-invalid');
      }
    });
  });
}

function initializeFormSubmit() {
  const form = document.getElementById('manufacturerSelfAssessmentForm');
  if (!form) {
    return;
  }

  form.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(event) {
  event.preventDefault();

  if (isSubmitting) {
    return;
  }

  const form = event.target;

  if (FORMSPREE_ENDPOINT.includes('REEMPLAZAR_ID')) {
    showFormMessage(
      'error',
      'Configuración pendiente: sustituya REEMPLAZAR_ID en FORMSPREE_ENDPOINT (main.js) por el ID real de Formspree antes de enviar.'
    );
    return;
  }

  const invalidStep = findFirstInvalidStep();
  if (invalidStep !== -1) {
    showStep(invalidStep);
    showFormMessage(
      'error',
      'Existen campos pendientes o inválidos. Revise la sección actual y complete la información requerida.'
    );
    return;
  }

  const subtotal = calculateInformationSecuritySubtotal();
  setSubmittingState(true);

  try {
    const formData = new FormData(form);

    formData.set('formulario_nombre', 'Autoevaluación de los fabricantes');
    formData.set('documento_referencia', '08015p22');
    formData.set('documento_revision', '5');
    formData.set('fecha_envio', new Date().toLocaleString('es-MX'));
    formData.set('subtotal_seguridad_informacion', String(subtotal));

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json'
      }
    });

    if (response.ok) {
      showFormMessage(
        'success',
        'La autoevaluación fue enviada correctamente. Gracias por completar el formulario.'
      );
      resetFormState();
      scrollToMessage();
      return;
    }

    let errorMessage = 'No fue posible enviar la autoevaluación. Intente nuevamente.';
    try {
      const data = await response.json();
      if (data && data.errors && data.errors.length) {
        errorMessage = data.errors.map(function (err) {
          return err.message || JSON.stringify(err);
        }).join(' ');
      } else if (data && data.error) {
        errorMessage = data.error;
      }
    } catch (parseError) {
      // Mantener mensaje genérico si la respuesta no es JSON
    }

    showFormMessage('error', errorMessage);
  } catch (error) {
    showFormMessage(
      'error',
      'Ocurrió un error de red al enviar el formulario. Verifique su conexión e intente de nuevo.'
    );
  } finally {
    setSubmittingState(false);
  }
}

function setSubmittingState(submitting) {
  isSubmitting = submitting;

  const btnSubmit = document.getElementById('btnSubmit');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const spinner = btnSubmit ? btnSubmit.querySelector('.submit-spinner') : null;
  const label = btnSubmit ? btnSubmit.querySelector('.submit-label') : null;

  if (btnSubmit) {
    btnSubmit.disabled = submitting;
  }
  if (btnPrev) {
    btnPrev.disabled = submitting;
  }
  if (btnNext) {
    btnNext.disabled = submitting;
  }
  if (spinner) {
    spinner.classList.toggle('d-none', !submitting);
  }
  if (label) {
    label.textContent = submitting ? 'Enviando...' : 'Enviar autoevaluación';
  }
}

function showFormMessage(type, message) {
  const messageEl = document.getElementById('formMessage');
  if (!messageEl) {
    return;
  }

  messageEl.classList.remove('d-none', 'success', 'error', 'info');
  messageEl.classList.add(type);

  const icon = type === 'success'
    ? 'bi-check-circle'
    : type === 'error'
      ? 'bi-exclamation-triangle'
      : 'bi-info-circle';

  messageEl.innerHTML = '<i class="bi ' + icon + ' me-2" aria-hidden="true"></i>' + message;
  scrollToMessage();
}

function scrollToMessage() {
  const messageEl = document.getElementById('formMessage');
  if (!messageEl) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  messageEl.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'center'
  });
}

function resetFormState() {
  const form = document.getElementById('manufacturerSelfAssessmentForm');
  if (!form) {
    return;
  }

  form.reset();
  form.classList.remove('was-validated');
  form.querySelectorAll('.is-invalid, .is-valid').forEach(function (el) {
    el.classList.remove('is-invalid', 'is-valid');
  });

  // Reaplicar estado condicional tras reset
  document.querySelectorAll('[data-conditional-trigger]').forEach(function (trigger) {
    updateConditionalField(trigger);
  });
  updateIso9001PlanVisibility();
  updateNestedConditionalByValue('p44_mantenimiento_documentado', 'p44_archivo_mantenimiento_medicion', 'Sí');

  calculateInformationSecuritySubtotal();
  showStep(0);
}
