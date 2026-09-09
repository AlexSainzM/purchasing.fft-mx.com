FFT México — Static Form Template

Reusable static form template for the development of internal FFT México forms.

Template Version: 1.1.0

Purpose

This template provides a standardized starting point for creating static web forms for FFT México.

It is designed to maintain consistency across implementations while allowing developers and AI coding agents to focus primarily on the requirements of each individual form.

The template provides reusable infrastructure for:

* FFT México visual identity
* Responsive layout
* Bootstrap-based form components
* HTML5 form validation
* Accessibility
* Formspree-compatible form submission
* Conditional questions
* Consistent field naming
* Separation between reusable infrastructure and form-specific business logic

The template intentionally remains simple and static.

Technology Stack

The template uses:

* HTML5
* Bootstrap 5.3.x
* Bootstrap Icons
* Vanilla CSS
* Vanilla JavaScript

Do not introduce additional frameworks, libraries, build systems, or package managers unless a specific requirement justifies doing so.

In particular, standard implementations should not require React, Vue, Angular, TypeScript, npm, bundlers, or additional form libraries.

⸻

Project Structure

form/
├── index.html
├── styles.css
└── main.js

index.html

Contains:

* Template configuration
* FFT layout and form shell
* Form-specific questions
* Formspree endpoint
* Semantic HTML structure

styles.css

Contains:

* FFT design tokens
* Template visual infrastructure
* Reusable form components
* Responsive behavior
* Accessibility rules
* Optional form-specific styles

main.js

Contains:

* Bootstrap initialization
* Generic form validation
* Dynamic footer year
* Reusable template behavior
* Form-specific conditional logic, calculations, and business rules

⸻

Template Responsibility Areas

The source code is divided into three responsibility areas.

1. TEMPLATE CORE

TEMPLATE CORE contains protected reusable infrastructure.

Examples include:

* Bootstrap dependencies
* Navigation structure
* Form shell
* Submit area
* Footer structure
* Base form components
* Validation infrastructure
* Accessibility behavior
* Responsive behavior

Do not modify TEMPLATE CORE when creating an individual form unless a specific technical or business requirement makes the change necessary.

Changes that improve all future forms should be made in the source template and released as a new template version instead of being implemented independently in multiple forms.

⸻

2. TEMPLATE CONFIGURATION

TEMPLATE CONFIGURATION contains values that must be customized for each form without changing the surrounding template structure.

The base template uses machine-identifiable placeholders:

{{FORM_TITLE}}
{{FORM_META_DESCRIPTION}}
{{NAV_HREF}}
{{NAV_ICON}}
{{NAV_LABEL}}
{{FORM_EYEBROW}}
{{FORM_INTRODUCTION}}
{{FORM_INSTRUCTIONS}}
{{SECTION_TITLE}}
{{SECTION_DESCRIPTION}}
{{FORMSPREE_ENDPOINT}}
{{FORM_THANKS_URL}}
{{SUBMIT_ICON}}
{{SUBMIT_LABEL}}
{{FOOTER_DESCRIPTION}}

Icon placeholders must be Bootstrap Icons class names without the leading `bi ` group, for example `bi-building` or `bi-arrow-right-circle`.

The confirmation page uses the companion template in ../thanks/.
Point {{FORM_THANKS_URL}} to that page after copying both folders.

Example mapping from reception-access:

{{FORM_TITLE}} → Registro de visitantes
{{FORM_META_DESCRIPTION}} → Registro de entrada de visitantes a FFT México.
{{NAV_HREF}} → #mainForm
{{NAV_ICON}} → bi-building
{{NAV_LABEL}} → Recepción · Control de acceso
{{FORM_EYEBROW}} → BIENVENIDO A FFT MÉXICO
{{FORM_INTRODUCTION}} → Tu visita comienza aquí.
{{FORM_INSTRUCTIONS}} → Completa tus datos para registrar tu entrada. La fecha y la hora se asignan automáticamente.
{{SECTION_TITLE}} → Datos de tu visita
{{SECTION_DESCRIPTION}} → Control individual de accesos autorizados.
{{FORMSPREE_ENDPOINT}} → https://formspree.io/f/ID_DEL_FORMULARIO
{{FORM_THANKS_URL}} → https://visitors.fft-mx.com/forms/<form>/thanks/
{{SUBMIT_ICON}} → bi-arrow-right-circle
{{SUBMIT_LABEL}} → Registrar entrada
{{FOOTER_DESCRIPTION}} → Recepción · Registro de visitantes

Replace the applicable placeholders when implementing a form.

A production-ready form must contain:

ZERO unresolved {{...}} placeholders

The only exception is during development when a service such as the Formspree endpoint has intentionally not yet been configured.

⸻

3. FORM-SPECIFIC CONTENT

FORM-SPECIFIC CONTENT contains the questions and controls belonging to an individual form.

Examples include:

* Text inputs
* Select controls
* Radio groups
* Checkboxes
* Textareas
* Date fields
* File uploads
* Conditional questions

Form-specific content must use the existing Bootstrap and FFT components whenever possible.

Do not create new CSS rules when an existing template or Bootstrap component already solves the requirement.

⸻

Creating a New Form

Never develop a new form directly inside the source template.

Create a copy of the current approved template and work inside the copied folder.

Recommended workflow:

Copy approved template
        ↓
Create destination folder
        ↓
Define business requirements
        ↓
Configure template placeholders
        ↓
Implement form questions
        ↓
Implement form-specific logic
        ↓
Configure Formspree
        ↓
Validate implementation
        ↓
Test responsive behavior
        ↓
Production-ready form

The original template should remain unchanged.

⸻

Field Naming Convention

Every question must use an identifiable and stable field name suitable for Formspree exports and future data processing.

Use:

pNN_short_description

Where:

* p identifies a question.
* NN is a two-digit sequential question number.
* short_description describes the field using lowercase snake_case.

Examples:

p01_nombre
p02_departamento
p03_tipo_solicitud
p04_fecha_ingreso

Rules:

* Use lowercase.
* Use snake_case.
* Do not use spaces.
* Do not use accents.
* Use two-digit numbering.
* Keep names meaningful but reasonably short.
* Keep names stable even if the visible wording of a question changes slightly.
* Whenever possible, use the same value for id and name.

Example:

<input
  type="text"
  id="p01_nombre"
  name="p01_nombre"
>

⸻

Radio Groups

Questions with multiple mutually exclusive options should use semantic HTML:

<fieldset>
  <legend>Question</legend>
  ...
</fieldset>

All radio buttons belonging to the same question must:

* Share the same name.
* Have unique id values.
* Have an explicit <label> associated with each option.

Example naming:

name="p03_tipo_solicitud"
id="p03_tipo_solicitud_interna"
id="p03_tipo_solicitud_externa"

For required radio groups, apply required consistently according to the template convention.

Validation feedback belongs conceptually to the complete question/group rather than to an individual option.

⸻

Required Fields

Required fields must:

1. Use the native HTML required attribute.
2. Display the template’s visual required indicator.
3. Provide appropriate validation feedback where necessary.

Example:

<label for="p01_nombre" class="form-label">
  Nombre
  <span class="required-indicator" aria-hidden="true">*</span>
</label>
<input
  type="text"
  class="form-control"
  id="p01_nombre"
  name="p01_nombre"
  required
>

Do not replace native HTML validation with unnecessary custom JavaScript.

The template already provides reusable Bootstrap-compatible validation infrastructure.

⸻

Conditional Questions

Conditional questions must follow the template convention.

Use:

conditional-field

for the conditional container and Bootstrap’s:

d-none

to hide it when inactive.

A conditional control that is required when visible must use:

data-required="true"

When inactive

The conditional container must:

* Be hidden.
* Have its controls disabled.
* Have required removed from inactive controls.

Example behavior:

container.classList.add('d-none');
field.disabled = true;
field.required = false;

When active

The conditional container must:

* Become visible.
* Enable its controls.
* Restore required only for fields marked with data-required="true".

Example behavior:

container.classList.remove('d-none');
field.disabled = false;
field.required = field.dataset.required === 'true';

Do not create a generic conditional-form engine unless future requirements demonstrate a clear need for one.

Conditional behavior should normally remain in the FORM-SPECIFIC LOGIC section of main.js.

⸻

Form-Specific JavaScript

All business-specific JavaScript must be placed below the:

FORM-SPECIFIC LOGIC

section in main.js.

Examples include:

* Conditional visibility
* Dynamic calculations
* Question dependencies
* Business-specific validations
* Derived values

Do not modify the template initialization or generic validation functions when form-specific logic can solve the requirement independently.

⸻

Form-Specific CSS

Add custom CSS only when the requirement cannot reasonably be implemented using:

1. Existing template components, or
2. Bootstrap utilities/components.

Form-specific styles must be placed in the designated:

FORM-SPECIFIC CONTENT

section at the end of styles.css.

Avoid modifying reusable TEMPLATE CORE styles for a single form.

⸻

Formspree

Forms use standard HTML POST submission and are designed to be compatible with Formspree.

Configure the endpoint using:

action="{{FORMSPREE_ENDPOINT}}"

Configure the confirmation redirect using:

<input type="hidden" name="_next" value="{{FORM_THANKS_URL}}">

Replace both placeholders before production deployment. Use the companion template in ../thanks/ for the confirmation page.

Do not introduce fetch(), AJAX submission, or custom asynchronous submission unless a specific requirement requires it.

Field name values determine how submitted information is identified in Formspree.

For this reason, field naming conventions must remain stable.

⸻

Accessibility

Maintain the accessibility behavior provided by the template.

When adding questions:

* Associate every applicable input with a <label>.
* Use <fieldset> and <legend> for grouped controls.
* Preserve keyboard navigation.
* Do not remove visible focus behavior.
* Use native semantic HTML before adding ARIA.
* Do not rely exclusively on color to communicate meaning.
* Keep validation messages understandable.
* Respect reduced-motion behavior provided by the template.

Do not add unnecessary ARIA attributes when native HTML already provides the required semantics.

⸻

Template Core Changes

If a requirement exposes a limitation in the template, first determine whether the change is:

Form-specific

Only this implementation requires the change.

Implement it inside the designated form-specific area.

Template-wide

The change would improve or correct all future forms.

Implement it first in the source template, review it, update the template version when appropriate, and then propagate it deliberately.

Avoid independently modifying the same core behavior in multiple forms.

⸻

AI Coding Agent Instructions

When using Cursor or another AI coding agent, the agent should treat the existing source files as part of the implementation specification.

The agent must:

* Read the existing files before making changes.
* Preserve TEMPLATE CORE unless modification is explicitly required.
* Replace applicable TEMPLATE CONFIGURATION placeholders.
* Implement questions only inside FORM-SPECIFIC CONTENT.
* Implement business logic inside FORM-SPECIFIC LOGIC.
* Follow the existing field naming convention.
* Reuse existing Bootstrap and FFT components.
* Avoid unnecessary CSS.
* Avoid unnecessary abstractions.
* Avoid introducing dependencies without justification.
* Preserve accessibility behavior.
* Preserve responsive behavior.
* Verify conditional fields do not interfere with validation when inactive.

Business requirements should describe what the form must do.

The template defines how standard form behavior should be implemented.

⸻

Pre-Production Checklist

Before considering a form production-ready:

* All required business questions have been implemented.
* Question numbering is correct.
* Field name values follow pNN_short_description.
* Field names are stable and meaningful.
* Labels are correctly associated with controls.
* Required fields use native validation.
* Radio/checkbox groups use appropriate semantic HTML.
* Conditional questions show and hide correctly.
* Hidden conditional fields do not block validation.
* Form-specific calculations or derived values have been tested.
* Formspree field names have been reviewed.
* The correct Formspree endpoint is configured.
* No unintended {{...}} placeholders remain.
* No unnecessary dependencies were introduced.
* No unnecessary modifications were made to TEMPLATE CORE.
* No JavaScript errors appear during normal use.
* The form works on desktop and mobile layouts.
* Keyboard navigation works correctly.
* Required-field validation has been tested.
* The form has been tested before deployment.

⸻

Deployment Assumptions

The template is designed for the existing FFT México internal-services project structure.

Some navigation and asset paths are relative to that deployment structure.

Do not change those paths automatically when creating a new form.

If the destination folder depth or project structure changes, verify the following manually:

* FFT México logo path
* Return link to Servicios Internos
* Local styles.css reference
* Local main.js reference

⸻

Versioning

The template follows semantic versioning:

MAJOR.MINOR.PATCH

Examples:

1.0.1 — backward-compatible correction
1.1.0 — new reusable template capability
2.0.0 — breaking architectural change

The version refers to the template architecture, not to an individual business form.

Forms created from a template should preserve information about which template version they originated from.

⸻

Design Principle

Keep the template simple.

Prefer:

HTML + Bootstrap + CSS + Vanilla JavaScript

over additional architecture unless actual requirements justify additional complexity.

The goal is not to create a universal form framework.

The goal is to provide a predictable, maintainable, accessible, and agent-friendly foundation for FFT México forms.