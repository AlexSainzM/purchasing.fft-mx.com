# FFT Formularios de autoevaluación para proveedores

## PROJECT_OVERVIEW

**Estado:** Activo
**Versión:** 0.2
**Fecha:** 2026-08-25

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

1. contestar cualquiera de los tres formularios oficiales: Fabricantes, Maquinados y Distribuidores;
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

Existe una plantilla para generar nuevos formularios en `assets/templetes/form_v1`.

Las reglas estructurales comunes se verifican con `tests/verify_forms.py`. Cualquier cambio de preguntas o lógica condicional debe actualizar primero `docs/FORM_LOGIC_MATRIX.md` y la Spec correspondiente.

---

## 5. Estado de configuración

| Formulario | Documento | Revisión | Implementación web | Endpoint Formspree |
| --- | --- | ---: | --- | --- |
| Fabricantes | 08015p22 | 5 | Disponible | Configurado |
| Maquinados | 08015p22 | 4 | Disponible | Pendiente de configuración |
| Distribuidores | 08015p23 | 5 | Disponible | Pendiente de configuración |
