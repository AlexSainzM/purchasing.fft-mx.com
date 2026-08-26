# FFT Formualrios de autoevaluación para proveedores

## PROJECT_OVERVIEW

**Estado:** Draft
**Versión:** 0.1
**Fecha:** 2026-08-25

---

## 1. Propósito del documento

Este documento describe el propósito, alcance, principios y arquitectura general del proyecto **FFT Industrial Safety Checklists**.

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

FFT México utiliza diferente formatos para evaluar de forma general a nuevos provedores, estos formatos estan en docuementos de Word, por lo que se pretender digitalizar para evitar ambiguidades en las respuestas, tener validaciones más escritas y controlables, un registro digital de las respuestas, y una interfaz mas amigable para que el usuario pueda contestarla. 

---

# 3. Objetivo general

Digitalizar los formualrios de autoevaluación de los nuevos proveedores de FFT México mediante una aplicación web que permita:

1. contestar cualquiera de los 3 formularios disponibles;
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

No debe introducirse un framework frontend si no existe una necesidad claramente documentada en una Spec.

---

## 4.4 Formspree como persistencia inicial

Cada formualrio tendrá su propio endpoint de Formspree.

```

La existencia de endpoints separados NO debe provocar contratos de datos completamente diferentes.

Los formularios deben conservar un conjunto común de conceptos definido en `INSPECTION_MODEL.md`.

## 4.5 Ya existe una plantilla para generar nuevo formularios disponible en 
./assets/templetes/form_v1
