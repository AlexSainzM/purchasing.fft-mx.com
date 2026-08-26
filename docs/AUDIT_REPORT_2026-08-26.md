# Auditoría funcional y de especificación

**Fecha:** 2026-08-26

## Resultado

El catálogo ya contiene los tres formularios oficiales y las validaciones locales principales funcionan. La publicación real de Maquinados y Distribuidores sigue bloqueada de forma segura hasta configurar endpoints exclusivos de Formspree.

## Hallazgos corregidos

1. La portada `index.html` estaba vacía; ahora ofrece acceso a los tres formularios.
2. Distribuidores sólo existía como PDF; ahora cuenta con una implementación web de 42 preguntas.
3. Los dos formularios existentes cargaban un logotipo local inexistente; se sustituyó por una marca textual accesible.
4. Maquinados no capturaba el nombre de la empresa y usaba un contrato distinto para el contacto; ambos campos quedaron normalizados.
5. Maquinados omitía la pregunta 7 del PDF sobre control de calidad sin certificación y renumeraba la pregunta 8; ambas quedaron restauradas.
6. Los tooltips podían detener toda la inicialización si Bootstrap no cargaba; ahora son una mejora opcional.
7. Fabricantes insertaba mensajes de error de Formspree mediante `innerHTML`; ahora usa nodos de texto y evita interpretar contenido remoto como HTML.
8. Los tres formularios usan el mismo conjunto de conceptos de empresa y metadatos de documento.
9. Se añadieron modelo común, matriz de reglas, Spec y harness estático.

## Contradicciones del material fuente

| Documento | Contradicción | Decisión web |
| --- | --- | --- |
| Fabricantes Rev. 5 | Tiene seis páginas, pero los pies indican un total de cinco. | No se reproduce la paginación. |
| Maquinados Rev. 4 | Tiene siete páginas, pero los pies indican un total de seis. | No se reproduce la paginación. |
| Maquinados Rev. 4 | Seguridad de Información reutiliza 32–39, números ya usados. | Se normaliza como 47–54. |
| Distribuidores Rev. 5 | El encabezado escribe “distribudores”. | Se corrige a “distribuidores”. |
| PDFs vs. aplicación | Los PDFs piden devolver el cuestionario en tres días; el proyecto define formularios permanentes. | La interfaz no promete un plazo hasta recibir confirmación. |
| Certificaciones | Los PDFs dicen “desde cuándo”, mientras las implementaciones previas piden vigencia. | Se conserva “vigencia” y queda pendiente confirmación de negocio. |

## Información pendiente de FFT México

1. Endpoint Formspree exclusivo para Maquinados.
2. Endpoint Formspree exclusivo para Distribuidores.
3. Confirmar si Maquinados y Fabricantes deben compartir oficialmente el código `08015p22`.
4. Confirmar si certificaciones deben capturar fecha de inicio, vigencia o ambas.
5. Confirmar si el plazo de tres días sigue vigente.
6. Definir tamaño máximo, cantidad y tipos permitidos de evidencias.
7. Definir aviso de privacidad, responsable, plazo de conservación y proceso de eliminación de respuestas.
8. Definir credenciales, permisos y pantalla requerida para consultar la API de sólo lectura de Formspree.
9. Confirmar si “No aplica” debe permitirse en más preguntas además de las expresamente indicadas por los PDFs.

## Evidencia de verificación

* `tests/verify_forms.py`: 10 contratos estructurales ejecutados correctamente; la comprobación integrada de JavaScript se omite cuando Node.js no está en `PATH`, por lo que la sintaxis se validó además con `node --check` sobre los tres `main.js` usando el runtime del workspace.
* Pruebas de navegador: portada con tres tarjetas; validación por pasos en Fabricantes y Distribuidores; reglas de “Otros”, certificaciones y limpieza de campos; preguntas 7–8 corregidas en Maquinados; prueba integral de Distribuidores bloqueada localmente por endpoint pendiente, sin transmisión.
