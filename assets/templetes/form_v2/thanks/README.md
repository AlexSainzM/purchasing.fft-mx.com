FFT México — Static Thanks Template

Reusable confirmation page for forms created from `assets/templetes/form_v1`.

Template Version: 1.0.0

Purpose

This template is the post-submit page that Formspree opens via `_next`.

It follows the same responsibility areas and `{{PLACEHOLDER_NAME}}` rules as `form_v1/index.html`.

A production-ready page must contain:

ZERO unresolved `{{...}}` placeholders

⸻

Project Structure

thanks/
├── index.html
├── styles.css
└── main.js

Copy this folder next to the form as `forms/<form>/thanks/`.
Set the form’s `{{FORM_THANKS_URL}}` to the public URL of this page.

⸻

TEMPLATE CONFIGURATION placeholders

{{THANKS_TITLE}}
{{THANKS_META_DESCRIPTION}}
{{FORM_HOME_URL}}
{{NAV_ICON}}
{{NAV_LABEL}}
{{THANKS_ICON}}
{{THANKS_EYEBROW}}
{{THANKS_HEADING}}
{{THANKS_INTRODUCTION}}
{{THANKS_DETAIL_ICON}}
{{THANKS_DETAIL}}
{{THANKS_ACTION_URL}}
{{THANKS_ACTION_ICON}}
{{THANKS_ACTION_LABEL}}
{{FOOTER_DESCRIPTION}}

Icon placeholders must be Bootstrap Icons class names without the leading `bi ` group, for example `bi-building` or `bi-check-lg`.

⸻

Example mapping from reception-access

{{THANKS_TITLE}} → Entrada registrada
{{THANKS_META_DESCRIPTION}} → Confirmación del registro de entrada de visitantes a FFT México.
{{FORM_HOME_URL}} → ../
{{NAV_ICON}} → bi-building
{{NAV_LABEL}} → Recepción · Control de acceso
{{THANKS_ICON}} → bi-check-lg
{{THANKS_EYEBROW}} → REGISTRO COMPLETADO
{{THANKS_HEADING}} → Tu entrada se registró correctamente
{{THANKS_INTRODUCTION}} → Gracias. Ya puedes continuar con recepción para iniciar tu visita.
{{THANKS_DETAIL_ICON}} → bi-info-circle-fill
{{THANKS_DETAIL}} → Recuerda portar tu identificación y seguir las indicaciones del personal durante tu estancia.
{{THANKS_ACTION_URL}} → ../
{{THANKS_ACTION_ICON}} → bi-person-plus
{{THANKS_ACTION_LABEL}} → Registrar otra visita
{{FOOTER_DESCRIPTION}} → Recepción · Registro de visitantes

⸻

Creating a New Confirmation Page

Never develop a new page directly inside the source template.

Copy approved template
        ↓
Create destination folder forms/<form>/thanks/
        ↓
Replace TEMPLATE CONFIGURATION placeholders
        ↓
Add optional PAGE-SPECIFIC CONTENT
        ↓
Point the form `_next` / {{FORM_THANKS_URL}} to this page
        ↓
Verify logo and stylesheet paths
        ↓
Production-ready page

⸻

Deployment Assumptions

This template assumes the destination path `forms/<form>/thanks/`.

If the folder depth changes, verify manually:

* FFT México logo path
* Parent form `../styles.css`
* Local `styles.css` and `main.js`
* {{FORM_HOME_URL}} and {{THANKS_ACTION_URL}}
