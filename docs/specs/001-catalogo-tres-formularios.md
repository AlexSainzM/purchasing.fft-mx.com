# Spec 001 — Catálogo de tres formularios

**Estado:** Implementada
**Fecha:** 2026-08-26

## Problema

El repositorio contiene dos formularios web, un tercer cuestionario sólo en PDF y una portada vacía. Además, existen recursos rotos y endpoints sin configurar.

## Alcance

* publicar una portada que permita elegir entre los tres formularios;
* digitalizar `08015p23_evaluación_distribuidor_español.pdf`;
* conservar la numeración y el sentido de las 42 preguntas;
* implementar las condiciones de `FORM_LOGIC_MATRIX.md`;
* eliminar dependencias a imágenes inexistentes;
* exponer de forma segura cualquier endpoint pendiente;
* añadir un harness estático reproducible.

## Fuera de alcance

* crear o reutilizar endpoints de Formspree sin autorización;
* autenticación y administración de usuarios;
* consulta de respuestas mediante la API de Formspree;
* corregir el contenido normativo de los PDFs fuente.

## Criterios de aceptación

1. La portada muestra exactamente tres tarjetas y cada enlace responde con HTTP 200.
2. Cada formulario tiene metadatos de documento y revisión, datos comunes de empresa y nombres de campos únicos.
3. Distribuidores contiene las preguntas 1–42 distribuidas en secciones navegables.
4. Sólo una sección es visible y “Siguiente” no avanza si la sección activa es inválida.
5. Todos los destinos condicionales tienen un disparador y los campos inactivos comienzan deshabilitados.
6. Ningún HTML de producción contiene placeholders de plantilla `{{...}}` ni imágenes locales rotas.
7. Un endpoint pendiente bloquea el envío antes de cualquier solicitud de red.
8. `tests/verify_forms.py` termina con código 0 y valida los contratos anteriores.
