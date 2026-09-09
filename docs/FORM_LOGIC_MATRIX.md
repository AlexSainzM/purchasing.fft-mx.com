# Matriz de lógica de formularios

**Versión:** 1.1
**Fecha:** 2026-09-09

Esta matriz normaliza las reglas observadas en los PDFs oficiales. Ante un cambio del documento fuente, esta matriz y la Spec deben actualizarse antes del código.

## Reglas comunes

| Regla | Comportamiento web |
| --- | --- |
| “Otros” seleccionado | Mostrar y requerir descripción; limpiar y deshabilitar al desmarcar. |
| Ninguno seleccionado | Desmarcar certificados y limpiar/deshabilitar vigencias y detalles; cualquier certificado desmarca Ninguno. |
| Certificación seleccionada | Mostrar y requerir vigencia; “Otros” requiere además el nombre. |
| Pregunta Sí/No con detalle | Mostrar y requerir detalle sólo cuando la respuesta sea “Sí”. |
| “Favor de anexar” | Requerir archivo únicamente bajo la respuesta afirmativa que origina el anexo. |
| Campos ocultos | Deshabilitados, no requeridos y sin valor residual. |
| Endpoint pendiente | Bloquear el `fetch` y mostrar un mensaje local de configuración. |

## Fabricantes — 08015p22 Rev. 5

| Pregunta | Condición | Dependencia |
| ---: | --- | --- |
| 3 | “Otros” | Descripción del giro. |
| 6 | Cada certificado | Vigencia; “Otros” requiere nombre. |
| 7 | ISO 9001 no seleccionada | Plan de certificación y fecha si responde “Sí”. |
| 11 | Sí | Organigrama. |
| 12 | Sí | Referencias. |
| 25 | Sí | Indicador y evidencia. |
| 29 | Sí | Número de registro ambiental. |
| 30 | Sí | Nombre del programa ambiental. |
| 32 | Sí | Materiales peligrosos (pregunta 33). |
| 34 | Sí | Nombre del responsable ambiental. |
| 37 | Sí | Productos biodegradables utilizados. |
| 38 | Sí | Nombre del responsable de calidad. |
| 44 | Sí | Evidencia de mantenimiento. |
| 52 | “Otro” | Tipo de documentación. |

Seguridad de Información corresponde a los reactivos 55–62. El PDF declara “página 5 de 5” y después incluye una sexta página; la web conserva los ocho reactivos y no reproduce la paginación errónea.

## Maquinados — 08015p22 Rev. 4

| Pregunta | Condición | Dependencia |
| ---: | --- | --- |
| 3 | “Otros” | Descripción del giro. |
| 4 | “No aplica” por tabla | Ocultar, limpiar y deshabilitar la tabla CNC o Corte. |
| 4 b) | Tipo de equipo de corte | Select obligatorio: Pantógrafo, Láser, Plasma, Chorro de agua y Oxígeno. Conserva `p04_corte_NN_tipo`. |
| 6 | Cada certificado | Vigencia; “Otros” requiere nombre. |
| 7 | Sin ISO 9001 y “Otros” seleccionado | Descripción del control de calidad sin sistema certificado. |
| 8 | Sin ISO 9001 | Preguntar si planea certificarse; sólo Sí requiere la fecha estimada existente. |
| 11 | Sí | Últimos dos reportes de calibración. |
| 14 | Sí | Cantidad de operadores y programa CNC (15–16). |
| 17 | Sí | Nombre del responsable de calidad. |
| 22 | Sí | Evidencia del mantenimiento. |
| 24 | Sí | Empresa, servicio y porcentaje subcontratado. |
| 31 | Sí | Organigrama. |
| 32 | Sí | Referencias. |
| 42 | Sí | Descripción del indicador. |

Los cinco anexos fiscales y del IMSS son obligatorios según el bloque VIII. El PDF reutiliza 32–39 para Seguridad de Información; la web los normaliza como 47–54 para evitar colisiones con preguntas existentes.

## Distribuidores — 08015p23 Rev. 5

| Pregunta | Condición | Dependencia |
| ---: | --- | --- |
| 3 | “Otros” | Descripción del giro. |
| 6 | Cada certificado | Vigencia; “Otros” requiere nombre. |
| 7 | Ninguna certificación seleccionada | Preguntar si planea certificarse; sólo Sí requiere la fecha planeada existente. |
| 10 | Sí | Organigrama. |
| 11 | Sí | Referencias. |
| 18 | Sí | Indicador de seguridad. |
| 21 | Sí | Nombre del responsable ambiental. |
| 22 | Sí | Nombre del programa ambiental. |
| 23 | Sí | Materiales peligrosos (pregunta 24). |
| 26 | Sí | Productos biodegradables utilizados. |
| 27 | Sí | Nombre del responsable de calidad. |
| 42 | “Otro” | Tipo de documentación. |

## Datos pendientes de FFT México

1. Endpoint Maquinados configurado en el código (ver Spec 002).
2. Endpoint Distribuidores configurado en el código (ver Spec 002).
3. Política de conservación, responsable y plazo de borrado de respuestas/evidencias en Formspree.
4. Límites máximos de tamaño y cantidad de archivos.
5. Confirmación de si los plazos de “3 días” de los PDFs siguen vigentes; la web actual los describe como formularios permanentes.

## Actualización 2026-09-09 — Spec 002

Todos los envíos AJAX satisfactorios redirigen a thanks/index.html del formulario. Los errores conservan la captura. Maquinados usa selects Tipo en ambas tablas de pregunta 4 y la frase «Durante el año pasado» en 43. Seguridad 47–54 conserva nombres y replica las opciones descriptivas de Fabricantes 55–62. Véase specs/002-certificaciones-agradecimiento-maquinados.md.
