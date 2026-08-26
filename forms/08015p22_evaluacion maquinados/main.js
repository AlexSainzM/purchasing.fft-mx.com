/**
 * Autoevaluación de Maquinados - FFT México
 * Documento: 08015p22 | Rev.: 4 | Fecha origen: 20.06.2024
 */

const STEP_NAMES = [
  'Datos de contacto',
  'I. General',
  'II. Operaciones y Calidad',
  'III. Experiencia',
  'IV. Personal',
  'V. Medio ambiente e Infraestructura',
  'VI. Envío',
  'VII. Seguridad de la Información',
  'VIII. Check-list de documentos',
  'Resumen y envío'
];

const SI_SCORE_IDS = [
  'p47_confidencialidad_empleados_puntaje',
  'p48_capacitacion_seguridad_informacion_puntaje',
  'p49_zonas_seguridad_acceso_puntaje',
  'p50_permisos_acceso_datos_clientes_puntaje',
  'p51_clasificacion_informacion_puntaje',
  'p52_copias_seguridad_puntaje',
  'p53_confidencialidad_proveedores_puntaje',
  'p54_firewall_proteccion_internet_puntaje'
];

const ALLOWED_SI_SCORES = new Set(['0', '4', '6', '8', '10']);
const FORMSPREE_PLACEHOLDER = 'REEMPLAZAR_ENDPOINT_FORMSPREE';
const CURRENT_YEAR = new Date().getFullYear();
const MIN_MACHINE_YEAR = 1970;

let currentStep = 0;
let isSubmitting = false;
let cncRowCounter = 0;
let corteRowCounter = 0;
let workerRowCounter = 0;

document.addEventListener('DOMContentLoaded', function () {
  initializeDynamicDates();
  initializeTooltips();
  initializeDynamicTables();
  initializeConditionalFields();
  initializeSecurityScore();
  initializeFormValidation();
  initializeFormSubmission();
});

function initializeDynamicDates() {
  const footerYear = document.getElementById('footerYear');
  if (footerYear) {
    footerYear.textContent = String(CURRENT_YEAR);
  }

  const prevYear = CURRENT_YEAR - 1;
  const accidentYearInput = document.getElementById('anio_referencia_accidentes');
  if (accidentYearInput) {
    accidentYearInput.value = String(prevYear);
  }

  const label = document.getElementById('p43_indice_accidentes_label');
  if (label) {
    label.innerHTML =
      '43. Durante el año calendario ' +
      prevYear +
      ', ¿cuál fue su índice de accidentes laborales? <span class="text-danger" aria-hidden="true">*</span>';
  }
}

function initializeTooltips() {
  if (!window.bootstrap || !window.bootstrap.Tooltip) {
    return;
  }
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new window.bootstrap.Tooltip(tooltipTriggerEl);
  });
}

function initializeFormValidation() {
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
      hideFormMessage();
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
    step.classList.toggle('d-none', stepIndex !== currentStep);
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

  if (currentStep === 1) {
    if (!validateMachineTables(stepEl)) {
      isValid = false;
    }
  }

  if (currentStep === 4) {
    if (!validateWorkersTable(stepEl)) {
      isValid = false;
    }
  }

  const fields = stepEl.querySelectorAll('input, select, textarea');
  fields.forEach(function (field) {
    if (!isFieldVisible(field)) {
      return;
    }
    if (field.type === 'radio') {
      return;
    }
    if (field.type === 'checkbox' && field.name && stepEl.querySelector('[data-checkbox-group="' + CSS.escape(field.name) + '"]')) {
      return;
    }
    if (field.id === 'p04_cnc_no_aplica' || field.id === 'p04_corte_no_aplica') {
      return;
    }
    if (field.name && field.name.indexOf('p06_') === 0 && field.type === 'checkbox') {
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

  const radioNames = new Set();
  stepEl.querySelectorAll('input[type="radio"]').forEach(function (radio) {
    if (isFieldVisible(radio)) {
      radioNames.add(radio.name);
    }
  });

  radioNames.forEach(function (name) {
    const radios = Array.from(stepEl.querySelectorAll('input[type="radio"][name="' + CSS.escape(name) + '"]'))
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
    scrollToFirstInvalidField(stepEl);
  }

  return isValid;
}

function validateCheckboxGroups(scope) {
  let isValid = true;
  const groups = scope.querySelectorAll('[data-checkbox-group]');

  groups.forEach(function (group) {
    if (group.classList.contains('d-none') || !isFieldVisible(group.querySelector('input') || group)) {
      return;
    }

    const name = group.getAttribute('data-checkbox-group');
    const checkboxes = Array.from(group.querySelectorAll('input[type="checkbox"][name="' + CSS.escape(name) + '"]'))
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

function validateMachineTables(stepEl) {
  let isValid = true;
  const messages = [];
  const cncNa = document.getElementById('p04_cnc_no_aplica');
  const corteNa = document.getElementById('p04_corte_no_aplica');

  if (!cncNa || !cncNa.checked) {
    const rows = stepEl.querySelectorAll('#p04_cnc_tbody tr');
    if (!rows.length) {
      isValid = false;
      messages.push('Agregue al menos una máquina CNC o marque “No aplica”.');
    }
    rows.forEach(function (row) {
      row.querySelectorAll('input').forEach(function (input) {
        if (!input.checkValidity()) {
          input.classList.add('is-invalid');
          isValid = false;
        }
      });
    });
  }

  if (!corteNa || !corteNa.checked) {
    const rows = stepEl.querySelectorAll('#p04_corte_tbody tr');
    if (!rows.length) {
      isValid = false;
      messages.push('Agregue al menos un equipo de corte o marque “No aplica”.');
    }
    rows.forEach(function (row) {
      row.querySelectorAll('input').forEach(function (input) {
        if (!input.checkValidity()) {
          input.classList.add('is-invalid');
          isValid = false;
        }
      });
    });
  }

  if (messages.length) {
    showFormMessage('error', messages.join(' '));
  }

  return isValid;
}

function validateWorkersTable(stepEl) {
  let isValid = true;
  const rows = stepEl.querySelectorAll('#p38_trabajadores_tbody tr');
  if (!rows.length) {
    showFormMessage('error', 'Agregue al menos un trabajador en la pregunta 38.');
    return false;
  }

  rows.forEach(function (row) {
    row.querySelectorAll('input').forEach(function (input) {
      if (!input.checkValidity()) {
        input.classList.add('is-invalid');
        isValid = false;
      }
    });
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

function scrollToFirstInvalidField(scope) {
  const firstInvalid = scope.querySelector('.is-invalid, :invalid');
  if (firstInvalid && typeof firstInvalid.focus === 'function') {
    firstInvalid.focus({ preventScroll: false });
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    firstInvalid.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'center'
    });
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

/* ========== Tablas dinámicas ========== */

function initializeDynamicTables() {
  addCncRow();
  addCorteRow();
  addWorkerRow();

  const btnCnc = document.getElementById('btnAddCncRow');
  const btnCorte = document.getElementById('btnAddCorteRow');
  const btnWorker = document.getElementById('btnAddWorkerRow');
  const cncNa = document.getElementById('p04_cnc_no_aplica');
  const corteNa = document.getElementById('p04_corte_no_aplica');

  if (btnCnc) {
    btnCnc.addEventListener('click', function () {
      addCncRow();
    });
  }
  if (btnCorte) {
    btnCorte.addEventListener('click', function () {
      addCorteRow();
    });
  }
  if (btnWorker) {
    btnWorker.addEventListener('click', function () {
      addWorkerRow();
    });
  }

  if (cncNa) {
    cncNa.addEventListener('change', function () {
      toggleMachineTable('cnc', cncNa.checked);
    });
  }
  if (corteNa) {
    corteNa.addEventListener('change', function () {
      toggleMachineTable('corte', corteNa.checked);
    });
  }

  document.getElementById('p04_cnc_tbody').addEventListener('click', function (event) {
    const btn = event.target.closest('.btn-remove-cnc');
    if (btn) {
      removeTableRow(btn.closest('tr'), 'cnc');
    }
  });

  document.getElementById('p04_corte_tbody').addEventListener('click', function (event) {
    const btn = event.target.closest('.btn-remove-corte');
    if (btn) {
      removeTableRow(btn.closest('tr'), 'corte');
    }
  });

  document.getElementById('p38_trabajadores_tbody').addEventListener('click', function (event) {
    const btn = event.target.closest('.btn-remove-worker');
    if (btn) {
      removeTableRow(btn.closest('tr'), 'worker');
    }
  });
}

function toggleMachineTable(type, isNa) {
  const block = document.getElementById(type === 'cnc' ? 'p04_cnc_table_block' : 'p04_corte_table_block');
  const tbody = document.getElementById(type === 'cnc' ? 'p04_cnc_tbody' : 'p04_corte_tbody');
  if (!block || !tbody) {
    return;
  }

  if (isNa) {
    tbody.querySelectorAll('input').forEach(function (input) {
      clearFieldValue(input);
      input.required = false;
      input.disabled = true;
      input.classList.remove('is-invalid', 'is-valid');
    });
    block.classList.add('d-none');
    block.querySelectorAll('button').forEach(function (btn) {
      btn.disabled = true;
    });
  } else {
    block.classList.remove('d-none');
    block.querySelectorAll('button').forEach(function (btn) {
      btn.disabled = false;
    });
    if (!tbody.querySelector('tr')) {
      if (type === 'cnc') {
        addCncRow();
      } else {
        addCorteRow();
      }
    } else {
      tbody.querySelectorAll('input').forEach(function (input) {
        input.disabled = false;
        input.required = true;
      });
    }
  }
}

function createInputCell(type, className, attrs) {
  const td = document.createElement('td');
  const input = document.createElement('input');
  input.type = type;
  input.className = 'form-control form-control-sm ' + (className || '');
  Object.keys(attrs || {}).forEach(function (key) {
    input.setAttribute(key, attrs[key]);
  });
  input.required = true;
  td.appendChild(input);
  return td;
}

function createRemoveCell(btnClass) {
  const td = document.createElement('td');
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn-outline-danger btn-sm btn-remove-row ' + btnClass;
  btn.innerHTML = '<i class="bi bi-trash" aria-hidden="true"></i><span class="visually-hidden">Eliminar</span>';
  td.appendChild(btn);
  return td;
}

function addCncRow() {
  const tbody = document.getElementById('p04_cnc_tbody');
  if (!tbody) {
    return;
  }
  cncRowCounter += 1;
  const idx = String(cncRowCounter).padStart(2, '0');
  const tr = document.createElement('tr');
  tr.dataset.tempIndex = idx;

  tr.appendChild(createInputCell('text', '', { 'data-field': 'tipo', placeholder: 'Tipo', 'aria-label': 'Tipo CNC ' + idx }));
  tr.appendChild(createInputCell('text', '', { 'data-field': 'marca', placeholder: 'Marca', 'aria-label': 'Marca CNC ' + idx }));
  tr.appendChild(createInputCell('text', '', { 'data-field': 'modelo', placeholder: 'Modelo', 'aria-label': 'Modelo CNC ' + idx }));
  tr.appendChild(createInputCell('number', '', {
    'data-field': 'anio', min: String(MIN_MACHINE_YEAR), max: String(CURRENT_YEAR), step: '1', placeholder: 'Año', 'aria-label': 'Año CNC ' + idx
  }));
  tr.appendChild(createInputCell('number', '', {
    'data-field': 'cantidad', min: '1', step: '1', placeholder: 'Cant.', 'aria-label': 'Cantidad CNC ' + idx
  }));
  tr.appendChild(createInputCell('text', '', { 'data-field': 'dimension_x', placeholder: 'X', 'aria-label': 'Dimensión X CNC ' + idx }));
  tr.appendChild(createInputCell('text', '', { 'data-field': 'dimension_y', placeholder: 'Y', 'aria-label': 'Dimensión Y CNC ' + idx }));
  tr.appendChild(createInputCell('text', '', { 'data-field': 'dimension_z', placeholder: 'Z', 'aria-label': 'Dimensión Z CNC ' + idx }));
  tr.appendChild(createRemoveCell('btn-remove-cnc'));

  tbody.appendChild(tr);
  reindexCncRows();
}

function addCorteRow() {
  const tbody = document.getElementById('p04_corte_tbody');
  if (!tbody) {
    return;
  }
  corteRowCounter += 1;
  const idx = String(corteRowCounter).padStart(2, '0');
  const tr = document.createElement('tr');
  tr.dataset.tempIndex = idx;

  tr.appendChild(createInputCell('text', '', { 'data-field': 'tipo', placeholder: 'Tipo', 'aria-label': 'Tipo corte ' + idx }));
  tr.appendChild(createInputCell('text', '', { 'data-field': 'marca', placeholder: 'Marca', 'aria-label': 'Marca corte ' + idx }));
  tr.appendChild(createInputCell('text', '', { 'data-field': 'modelo', placeholder: 'Modelo', 'aria-label': 'Modelo corte ' + idx }));
  tr.appendChild(createInputCell('number', '', {
    'data-field': 'anio', min: String(MIN_MACHINE_YEAR), max: String(CURRENT_YEAR), step: '1', placeholder: 'Año', 'aria-label': 'Año corte ' + idx
  }));
  tr.appendChild(createInputCell('number', '', {
    'data-field': 'cantidad', min: '1', step: '1', placeholder: 'Cant.', 'aria-label': 'Cantidad corte ' + idx
  }));
  tr.appendChild(createInputCell('text', '', { 'data-field': 'dimensiones', placeholder: 'Dimensiones', 'aria-label': 'Dimensiones corte ' + idx }));
  tr.appendChild(createInputCell('text', '', { 'data-field': 'espesor_minimo', placeholder: 'Mín.', 'aria-label': 'Espesor mínimo ' + idx }));
  tr.appendChild(createInputCell('text', '', { 'data-field': 'espesor_maximo', placeholder: 'Máx.', 'aria-label': 'Espesor máximo ' + idx }));
  tr.appendChild(createRemoveCell('btn-remove-corte'));

  tbody.appendChild(tr);
  reindexCuttingRows();
}

function addWorkerRow() {
  const tbody = document.getElementById('p38_trabajadores_tbody');
  if (!tbody) {
    return;
  }
  workerRowCounter += 1;
  const idx = String(workerRowCounter).padStart(2, '0');
  const tr = document.createElement('tr');

  tr.appendChild(createInputCell('text', '', {
    'data-field': 'nombre', placeholder: 'Nombre completo', 'aria-label': 'Nombre trabajador ' + idx
  }));
  tr.appendChild(createInputCell('text', '', {
    'data-field': 'grado_estudios', placeholder: 'Grado de estudios', 'aria-label': 'Grado estudios ' + idx
  }));
  tr.appendChild(createRemoveCell('btn-remove-worker'));

  tbody.appendChild(tr);
  reindexWorkersRows();
}

function removeTableRow(row, type) {
  if (!row) {
    return;
  }
  const tbody = row.parentElement;
  const total = tbody ? tbody.querySelectorAll('tr').length : 0;

  if (type !== 'worker' && total <= 1) {
    const naId = type === 'cnc' ? 'p04_cnc_no_aplica' : 'p04_corte_no_aplica';
    const msg = 'No es posible eliminar la única fila. Si no aplica, marque “No aplica”.';
    showFormMessage('error', msg);
    const na = document.getElementById(naId);
    if (na) {
      na.focus();
    }
    return;
  }

  if (type === 'worker' && total <= 1) {
    showFormMessage('error', 'Debe conservar al menos un trabajador en la tabla.');
    return;
  }

  if (!window.confirm('¿Eliminar esta fila?')) {
    return;
  }

  row.remove();

  if (type === 'cnc') {
    reindexCncRows();
  } else if (type === 'corte') {
    reindexCuttingRows();
  } else {
    reindexWorkersRows();
  }
}

function reindexCncRows() {
  const rows = document.querySelectorAll('#p04_cnc_tbody tr');
  rows.forEach(function (row, index) {
    const n = String(index + 1).padStart(2, '0');
    const prefix = 'p04_cnc_' + n + '_';
    row.querySelectorAll('input[data-field]').forEach(function (input) {
      const field = input.getAttribute('data-field');
      const name = prefix + field;
      input.name = name;
      input.id = name;
    });
  });
}

function reindexCuttingRows() {
  const rows = document.querySelectorAll('#p04_corte_tbody tr');
  rows.forEach(function (row, index) {
    const n = String(index + 1).padStart(2, '0');
    const prefix = 'p04_corte_' + n + '_';
    row.querySelectorAll('input[data-field]').forEach(function (input) {
      const field = input.getAttribute('data-field');
      const name = prefix + field;
      input.name = name;
      input.id = name;
    });
  });
}

function reindexWorkersRows() {
  const rows = document.querySelectorAll('#p38_trabajadores_tbody tr');
  rows.forEach(function (row, index) {
    const n = String(index + 1).padStart(2, '0');
    const prefix = 'p38_trabajador_' + n + '_';
    row.querySelectorAll('input[data-field]').forEach(function (input) {
      const field = input.getAttribute('data-field');
      const name = prefix + field;
      input.name = name;
      input.id = name;
    });
  });
}

/* ========== Condicionales ========== */

function initializeConditionalFields() {
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
        if (trigger.hasAttribute('data-iso9001-trigger')) {
          updateIso9001PlanVisibility();
        }
      });
    }
    updateConditionalField(trigger);
  });

  updateIso9001PlanVisibility();
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
    const expected = targets[0].getAttribute('data-show-when-value') || 'si';
    shouldShow = Boolean(checked && checked.value === expected);
  }

  targets.forEach(function (target) {
    toggleConditionalSection(target, shouldShow);
  });

}

function updateIso9001PlanVisibility() {
  const iso9001 = document.getElementById('p06_iso9001_seleccion');
  const other = document.getElementById('p06_otra_certificacion_seleccion');
  const qualityTarget = document.getElementById('cond_p07_control_calidad');
  const dateTarget = document.getElementById('cond_p08_fecha_certificacion');
  if (!iso9001 || !other || !qualityTarget || !dateTarget) {
    return;
  }

  const withoutIso9001 = !iso9001.checked;
  toggleConditionalSection(qualityTarget, withoutIso9001 && other.checked);
  toggleConditionalSection(dateTarget, withoutIso9001);
}

function toggleConditionalSection(target, shouldShow) {
  target.classList.toggle('d-none', !shouldShow);
  if (target.hasAttribute('aria-expanded')) {
    target.setAttribute('aria-expanded', shouldShow ? 'true' : 'false');
  }

  const controls = Array.from(target.querySelectorAll('input, select, textarea'));
  if (target.matches && target.matches('input, select, textarea')) {
    controls.unshift(target);
  }

  const uniqueControls = Array.from(new Set(controls));
  const handledRadioGroups = new Set();

  uniqueControls.forEach(function (field) {
    if (shouldShow && isInsideHiddenNestedConditional(field, target)) {
      return;
    }

    if (shouldShow) {
      if (field.type === 'radio') {
        if (handledRadioGroups.has(field.name)) {
          return;
        }
        handledRadioGroups.add(field.name);
        const group = target.querySelectorAll('input[type="radio"][name="' + CSS.escape(field.name) + '"]');
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
    if (node.hasAttribute && node.hasAttribute('data-conditional') && node.classList.contains('d-none')) {
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

/* ========== Seguridad de la Información ========== */

function initializeSecurityScore() {
  SI_SCORE_IDS.forEach(function (id) {
    const field = document.getElementById(id);
    if (!field) {
      return;
    }
    field.addEventListener('change', updateSecuritySubtotal);
  });
  updateSecuritySubtotal();
}

function updateSecuritySubtotal() {
  let total = 0;
  SI_SCORE_IDS.forEach(function (id) {
    const field = document.getElementById(id);
    if (!field || field.value === '') {
      return;
    }
    if (ALLOWED_SI_SCORES.has(String(field.value))) {
      total += Number(field.value);
    }
  });

  const hidden = document.getElementById('subtotal_seguridad_informacion');
  if (hidden) {
    hidden.value = String(total);
  }

  const display = document.getElementById('subtotalSeguridadDisplay');
  if (display) {
    display.textContent = total + ' / 80';
  }

  return total;
}

/* ========== Envío ========== */

function initializeFormSubmission() {
  const form = document.getElementById('autoevaluacionMaquinadosForm');
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
  const endpoint = form.getAttribute('action') || '';

  if (endpoint.indexOf(FORMSPREE_PLACEHOLDER) !== -1) {
    showFormMessage('error', 'El formulario todavía requiere configurar el endpoint de Formspree.');
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

  reindexCncRows();
  reindexCuttingRows();
  reindexWorkersRows();

  const subtotal = updateSecuritySubtotal();
  const fechaEnvio = document.getElementById('fecha_envio');
  if (fechaEnvio) {
    fechaEnvio.value = new Date().toISOString();
  }
  const anioRef = document.getElementById('anio_referencia_accidentes');
  if (anioRef) {
    anioRef.value = String(CURRENT_YEAR - 1);
  }

  setSubmittingState(true);

  try {
    const formData = new FormData(form);
    formData.set('subtotal_seguridad_informacion', String(subtotal));
    formData.set('fecha_envio', fechaEnvio ? fechaEnvio.value : new Date().toISOString());
    formData.set('anio_referencia_accidentes', String(CURRENT_YEAR - 1));

    const response = await fetch(endpoint, {
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
      // mantener mensaje genérico
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
  const icon = btnSubmit ? btnSubmit.querySelector('.submit-icon') : null;

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
  if (icon) {
    icon.classList.toggle('d-none', submitting);
  }
  if (label) {
    label.textContent = submitting ? 'Enviando…' : 'Enviar autoevaluación';
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

  messageEl.replaceChildren();
  const iconEl = document.createElement('i');
  iconEl.className = 'bi ' + icon + ' me-2';
  iconEl.setAttribute('aria-hidden', 'true');
  messageEl.appendChild(iconEl);
  messageEl.appendChild(document.createTextNode(message));
  scrollToMessage();
}

function hideFormMessage() {
  const messageEl = document.getElementById('formMessage');
  if (!messageEl) {
    return;
  }
  messageEl.classList.add('d-none');
  messageEl.classList.remove('success', 'error', 'info');
  messageEl.replaceChildren();
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
  const form = document.getElementById('autoevaluacionMaquinadosForm');
  if (!form) {
    return;
  }

  form.reset();
  form.classList.remove('was-validated');
  form.querySelectorAll('.is-invalid, .is-valid').forEach(function (el) {
    el.classList.remove('is-invalid', 'is-valid');
  });

  document.getElementById('p04_cnc_tbody').replaceChildren();
  document.getElementById('p04_corte_tbody').replaceChildren();
  document.getElementById('p38_trabajadores_tbody').replaceChildren();
  cncRowCounter = 0;
  corteRowCounter = 0;
  workerRowCounter = 0;
  addCncRow();
  addCorteRow();
  addWorkerRow();

  const cncBlock = document.getElementById('p04_cnc_table_block');
  const corteBlock = document.getElementById('p04_corte_table_block');
  if (cncBlock) {
    cncBlock.classList.remove('d-none');
  }
  if (corteBlock) {
    corteBlock.classList.remove('d-none');
  }

  document.querySelectorAll('[data-conditional-trigger]').forEach(function (trigger) {
    updateConditionalField(trigger);
  });
  updateIso9001PlanVisibility();
  toggleMachineTable('cnc', false);
  toggleMachineTable('corte', false);

  initializeDynamicDates();
  updateSecuritySubtotal();
  showStep(0);
}
