/**
 * Autoevaluación de proveedores de servicios - FFT México
 * Documento: 08015p21 | Rev.: 5
 */

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mbgjqzka';
const STEP_NAMES = [
  'Datos de la empresa',
  'General',
  'Experiencia',
  'Personal',
  'Tecnología',
  'Medio ambiente',
  'Calidad',
  'Envío',
  'Seguridad de la Información'
];

let currentStep = 0;
let isSubmitting = false;

document.addEventListener('DOMContentLoaded', function () {
  buildYesNoQuestions();
  initializeFooterYear();
  initializeTooltips();
  initializeConditionalFields();
  initializeCertificationRule();
  initializeSecurityScore();
  initializeNavigation();
  initializeSubmission();
  showStep(0, false);
});

function buildYesNoQuestions() {
  document.querySelectorAll('[data-yes-no]').forEach(function (container) {
    const question = container.dataset.question;
    const name = container.dataset.yesNo;
    const label = container.dataset.label;
    const detailId = container.dataset.detail;
    const detailType = container.dataset.detailType || 'text';
    const detailLabel = container.dataset.detailLabel || 'Detalle';

    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.className = 'form-label fw-semibold';
    legend.textContent = question + '. ' + label + ' *';
    fieldset.appendChild(legend);

    const options = document.createElement('div');
    options.className = 'd-flex flex-wrap gap-4';
    ['Sí', 'No'].forEach(function (value) {
      const wrapper = document.createElement('label');
      wrapper.className = 'form-check';
      const input = document.createElement('input');
      input.className = 'form-check-input';
      input.type = 'radio';
      input.name = name;
      input.id = name + '_' + (value === 'Sí' ? 'si' : 'no');
      input.value = value;
      input.required = true;
      if (value === 'Sí' && detailId) {
        input.dataset.conditionalTrigger = detailId;
      }
      wrapper.appendChild(input);
      wrapper.appendChild(document.createTextNode(' ' + value));
      options.appendChild(wrapper);
    });
    fieldset.appendChild(options);
    container.appendChild(fieldset);

    if (!detailId) {
      return;
    }

    const conditional = document.createElement('div');
    conditional.className = 'conditional-field d-none mt-3';
    conditional.dataset.conditional = detailId;
    conditional.dataset.showWhenValue = 'Sí';

    const detailLabelEl = document.createElement('label');
    detailLabelEl.className = 'form-label';
    detailLabelEl.htmlFor = detailId;
    detailLabelEl.textContent = detailLabel + ' *';
    conditional.appendChild(detailLabelEl);

    const field = document.createElement(detailType === 'file' ? 'input' : 'textarea');
    field.className = 'form-control';
    field.id = detailId;
    field.name = detailId;
    field.disabled = true;
    field.dataset.required = 'true';
    if (detailType === 'file') {
      field.type = 'file';
      field.accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png';
      field.multiple = container.dataset.multiple === 'true';
    } else {
      field.rows = 3;
    }
    conditional.appendChild(field);
    container.appendChild(conditional);
  });
}

function initializeFooterYear() {
  const element = document.getElementById('footerYear');
  if (element) {
    element.textContent = String(new Date().getFullYear());
  }
}

function initializeTooltips() {
  if (!window.bootstrap || !window.bootstrap.Tooltip) {
    return;
  }
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (trigger) {
    new window.bootstrap.Tooltip(trigger);
  });
}

function initializeConditionalFields() {
  document.querySelectorAll('[data-conditional-trigger]').forEach(function (trigger) {
    const listenerTargets = trigger.type === 'radio'
      ? document.querySelectorAll('input[type="radio"][name="' + CSS.escape(trigger.name) + '"]')
      : [trigger];

    listenerTargets.forEach(function (listener) {
      if (listener.dataset.conditionalListener === '1') {
        return;
      }
      listener.dataset.conditionalListener = '1';
      listener.addEventListener('change', function () {
        updateConditionalField(trigger);
      });
    });
    updateConditionalField(trigger);
  });
}

function updateConditionalField(trigger) {
  const key = trigger.dataset.conditionalTrigger;
  if (!key) {
    return;
  }
  const targets = document.querySelectorAll('[data-conditional="' + key + '"]');
  targets.forEach(function (target) {
    let show = false;
    if (trigger.type === 'checkbox') {
      show = trigger.checked;
    } else {
      const checked = document.querySelector('input[type="radio"][name="' + CSS.escape(trigger.name) + '"]:checked');
      show = Boolean(checked && checked.value === (target.dataset.showWhenValue || 'Sí'));
    }
    toggleConditional(target, show);
  });
}

function toggleConditional(container, show) {
  container.classList.toggle('d-none', !show);
  container.querySelectorAll('input,select,textarea').forEach(function (field) {
    field.disabled = !show;
    field.required = show && field.dataset.required === 'true';
    if (!show) {
      if (field.type === 'checkbox' || field.type === 'radio') {
        field.checked = false;
      } else {
        field.value = '';
      }
      field.classList.remove('is-invalid', 'is-valid');
    }
  });
}

function initializeCertificationRule() {
  const certifications = document.querySelectorAll('.certification-trigger');
  certifications.forEach(function (field) {
    field.addEventListener('change', updateCertificationPlan);
  });
  updateCertificationPlan();
}

function updateCertificationPlan() {
  const hasCertification = Array.from(document.querySelectorAll('.certification-trigger')).some(function (field) {
    return field.checked;
  });
  const container = document.getElementById('p05_container');
  toggleConditional(container, !hasCertification);
  const planned = container.querySelector('input[type="radio"]:checked');
  toggleConditional(document.getElementById('p05_fecha_plan'), !hasCertification && Boolean(planned && planned.value === 'Sí'));
}

function initializeNavigation() {
  document.getElementById('btnPrev').addEventListener('click', function () {
    if (currentStep > 0) {
      showStep(currentStep - 1, true);
    }
  });
  document.getElementById('btnNext').addEventListener('click', function () {
    const step = getStep(currentStep);
    if (validateStep(step, true) && currentStep < STEP_NAMES.length - 1) {
      showStep(currentStep + 1, true);
    }
  });
}

function getStep(index) {
  return document.querySelector('.form-step[data-step="' + index + '"]');
}

function showStep(index, scroll) {
  if (index < 0 || index >= STEP_NAMES.length) {
    return;
  }
  currentStep = index;
  document.querySelectorAll('.form-step').forEach(function (step) {
    step.classList.toggle('d-none', Number(step.dataset.step) !== index);
  });

  const percent = Math.round(((index + 1) / STEP_NAMES.length) * 100);
  document.getElementById('stepIndicator').textContent = 'Paso ' + (index + 1) + ' de ' + STEP_NAMES.length;
  document.getElementById('stepName').textContent = STEP_NAMES[index];
  document.getElementById('progressPercent').textContent = percent + '%';
  document.getElementById('progressBar').style.width = percent + '%';
  document.getElementById('progressBar').parentElement.setAttribute('aria-valuenow', String(percent));
  document.querySelectorAll('.step-item').forEach(function (item) {
    const itemIndex = Number(item.dataset.stepLabel);
    item.classList.toggle('active', itemIndex === index);
    item.classList.toggle('completed', itemIndex < index);
    if (itemIndex === index) {
      item.setAttribute('aria-current', 'step');
    } else {
      item.removeAttribute('aria-current');
    }
  });

  document.getElementById('btnPrev').classList.toggle('d-none', index === 0);
  document.getElementById('btnNext').classList.toggle('d-none', index === STEP_NAMES.length - 1);
  document.getElementById('btnSubmit').classList.toggle('d-none', index !== STEP_NAMES.length - 1);
  hideFormMessage();

  if (scroll) {
    document.getElementById('_form').scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
  }
}

function validateStep(step, focusInvalid) {
  if (!step) {
    return true;
  }
  let valid = true;

  step.querySelectorAll('input,select,textarea').forEach(function (field) {
    if (field.disabled || field.type === 'radio' || field.type === 'checkbox') {
      return;
    }
    const fieldValid = field.checkValidity() && (!field.classList.contains('si-score') || isValidSecurityScore(field.value));
    field.classList.toggle('is-invalid', !fieldValid);
    field.classList.toggle('is-valid', fieldValid && field.value !== '');
    valid = fieldValid && valid;
  });

  const radioNames = new Set(Array.from(step.querySelectorAll('input[type="radio"]:not(:disabled)')).map(function (radio) {
    return radio.name;
  }));
  radioNames.forEach(function (name) {
    const radios = Array.from(step.querySelectorAll('input[type="radio"][name="' + CSS.escape(name) + '"]:not(:disabled)'));
    const checked = radios.some(function (radio) { return radio.checked; });
    radios.forEach(function (radio) { radio.classList.toggle('is-invalid', !checked); });
    valid = checked && valid;
  });

  step.querySelectorAll('[data-checkbox-group]').forEach(function (group) {
    const name = group.dataset.checkboxGroup;
    const checked = group.querySelector('input[type="checkbox"][name="' + CSS.escape(name) + '"]:checked:not(:disabled)');
    const feedback = group.querySelector('.checkbox-group-feedback');
    if (feedback) {
      feedback.classList.toggle('d-none', Boolean(checked));
    }
    valid = Boolean(checked) && valid;
  });

  if (!valid && focusInvalid) {
    const first = step.querySelector('.is-invalid, .checkbox-group-feedback:not(.d-none)');
    if (first) {
      first.scrollIntoView({behavior: 'smooth', block: 'center'});
      if (typeof first.focus === 'function') {
        first.focus({preventScroll: true});
      }
    }
    showFormMessage('error', 'Complete los campos obligatorios antes de continuar.');
  }
  return valid;
}

function findFirstInvalidStep() {
  for (let index = 0; index < STEP_NAMES.length; index += 1) {
    if (!validateStep(getStep(index), false)) {
      return index;
    }
  }
  return -1;
}

function initializeSubmission() {
  document.getElementById('servicesSelfAssessmentForm').addEventListener('submit', handleSubmit);
}

async function handleSubmit(event) {
  event.preventDefault();
  if (isSubmitting) {
    return;
  }

  const invalidStep = findFirstInvalidStep();
  if (invalidStep !== -1) {
    showStep(invalidStep, true);
    validateStep(getStep(invalidStep), true);
    return;
  }

  if (FORMSPREE_ENDPOINT.indexOf('REEMPLAZAR_ENDPOINT') !== -1) {
    showFormMessage('error', 'El formulario está completo, pero falta configurar el endpoint exclusivo de Formspree para Servicios. No se envió información.');
    return;
  }

  const form = event.currentTarget;
  const dateField = document.getElementById('fecha_envio');
  dateField.value = new Date().toISOString();
  updateSecuritySubtotal();
  setSubmitting(true);

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {method: 'POST', body: new FormData(form), headers: {Accept: 'application/json'}});
    if (!response.ok) {
      throw new Error('Formspree respondió con estado ' + response.status);
    }
    window.location.assign(new URL('thanks/index.html', window.location.href).href);
  } catch (error) {
    showFormMessage('error', 'No fue posible enviar la autoevaluación. Verifique su conexión e intente de nuevo.');
  } finally {
    setSubmitting(false);
  }
}

function setSubmitting(submitting) {
  isSubmitting = submitting;
  ['btnPrev', 'btnNext', 'btnSubmit'].forEach(function (id) {
    document.getElementById(id).disabled = submitting;
  });
  document.querySelector('.submit-spinner').classList.toggle('d-none', !submitting);
  document.querySelector('.submit-label').textContent = submitting ? 'Enviando…' : 'Enviar autoevaluación';
}

function showFormMessage(type, message) {
  const element = document.getElementById('formMessage');
  element.classList.remove('d-none', 'success', 'error', 'info');
  element.classList.add(type);
  element.replaceChildren();
  const icon = document.createElement('i');
  icon.className = 'bi ' + (type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle') + ' me-2';
  icon.setAttribute('aria-hidden', 'true');
  element.appendChild(icon);
  element.appendChild(document.createTextNode(message));
}

function hideFormMessage() {
  const element = document.getElementById('formMessage');
  element.classList.add('d-none');
  element.classList.remove('success', 'error', 'info');
  element.replaceChildren();
}

// Re-evaluate the date after every plan answer.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[name="p05_planea_certificarse"]').forEach(function (field) {
    field.addEventListener('change', updateCertificationPlan);
  });
});
