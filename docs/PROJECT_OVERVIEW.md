# FFT Formularios de autoevaluación para proveedores

## PROJECT_OVERVIEW

**Estado:** Activo
**Versión:** 0.4
**Fecha:** 2026-09-09

---

## 1. Propósito del documento

Este documento describe el propósito, alcance, principios y arquitectura general del proyecto **FFT Formularios de autoevaluación para proveedores**.

Su objetivo es funcionar como una fuente estable de contexto para:

* desarrollo manual;
* agentes de programación;
* generación de Specs;
* revisión de cambios;
* futuras iteraciones del proyecto.

Las reglas específicas relacionadas con qué representa una inspección y cómo deben comportarse las respuestas se encuentran en:

`docs/INSPECTION_MODEL.md`

Las particularidades de cada checklist oficial deberán documentarse posteriormente en:

`docs/FORM_LOGIC_MATRIX.md`

---

# 2. Contexto

FFT México utiliza diferentes formatos para evaluar a nuevos proveedores. Los formatos oficiales fueron exportados a PDF y se conservan en la carpeta de cada formulario como referencia funcional. La aplicación los digitaliza para reducir respuestas ambiguas, aplicar validaciones controlables, conservar un registro digital y ofrecer una interfaz más clara.

---

# 3. Objetivo general

Digitalizar los formualrios de autoevaluación de los nuevos proveedores de FFT México mediante una aplicación web que permita:

1. contestar cualquiera de los cuatro formularios: Fabricantes, Maquinados, Distribuidores y Servicios;
2. adjuntar evidencia cuando sea requerido;
3. enviar cada formulario al endpoint correspondiente de Formspree;
4. consultar posteriormente los registros mediante la API de solo lectura de Formspree;

La primera versión debe priorizar la funcionalidad antes que la administración de usuarios, autenticación, permisos o administración centralizada de activos.

---

# 4. Principios del proyecto

## 4.3 Frontend primero

La V1 debe funcionar principalmente como una aplicación frontend estática.

Tecnologías permitidas inicialmente:

* HTML;
* CSS;
* JavaScript;
* Bootstrap;
* Formspree.

Los formularios deben seguir funcionando para captura y validación cuando Bootstrap o Bootstrap Icons no estén disponibles. Esos recursos sólo mejoran la presentación.

No debe introducirse un framework frontend si no existe una necesidad claramente documentada en una Spec.

---

## 4.4 Formspree como persistencia inicial

Cada formulario tendrá su propio endpoint de Formspree. Un endpoint no configurado debe producir un mensaje local claro y nunca intentar un envío a un destino alterno.

La existencia de endpoints separados NO debe provocar contratos de datos completamente diferentes.

Los formularios deben conservar el conjunto común de conceptos definido en `INSPECTION_MODEL.md`.

## 4.5 Plantilla y harness

Existen plantillas en `assets/templetes/form_v1` y `assets/templetes/form_v2`. Los cuatro formularios implementan el agradecimiento de `form_v2/thanks` en su propia carpeta `thanks/`, con redirección JavaScript después del envío AJAX exitoso.

Las reglas estructurales comunes se verifican con `tests/verify_forms.py`. Cualquier cambio de preguntas o lógica condicional debe actualizar primero `docs/FORM_LOGIC_MATRIX.md` y la Spec correspondiente.

`tests/verify_forms_browser.cjs` verifica en un navegador los condicionales, las tablas de Maquinados y el flujo de envío con respuestas de Formspree simuladas. La Spec 002 documenta los cambios de certificación, agradecimiento y Maquinados, conservando los nombres de campos existentes.

La Spec 003 añade Servicios (39 preguntas del PDF 08015p21 Rev. 5, 03.06.2026) y Seguridad de la Información en Distribuidores (43–50). Ambos usan `assets/js/security-score.js` para validar la escala y recalcular el subtotal. El harness recorre sus formularios completos con validación real y prueba los anexos de Servicios. La exclusión de Ninguno usa `assets/js/certifications.js`, configurable para la pregunta 4 de Servicios y compatible con la pregunta 6 de los demás.

---

## 5. Estado de configuración

| Formulario | Documento | Revisión | Implementación web | Endpoint Formspree |
| --- | --- | ---: | --- | --- |
| Fabricantes | 08015p22 | 5 | Disponible | Configurado |
| Maquinados | 08015p22 | 4 | Disponible | Configurado |
| Distribuidores | 08015p23 | 5 | Disponible | Configurado |
| Servicios | 08015p21 | 5 | Disponible | Configurado |

Estado constatado en el código el 2026-09-09; no implica una prueba real de recepción en Formspree.

## Consulta de evaluaciones — Spec 004 (2026-09-18)

Los cuatro formularios cuentan con visores estáticos en `submissions_viewer/`, con catálogo en `submissions_viewer/index.html` y acceso compatible en `submission_viewer/index.html`. Cada visor conserva su configuración Formspree y esquema de campos; comparten presentación y lógica. Fabricantes consulta exclusivamente Formspree y el JSON de ejemplo se reserva para QA. Ejecución local, rutas y pruebas: [README de visores](../submissions_viewer/README.md). Resultados: [validación Spec 004](VALIDATION_SPEC004_2026-09-18.md).
