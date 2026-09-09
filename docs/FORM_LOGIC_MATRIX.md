# Matriz de lógica de formularios

**Versión:** 1.2
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

Seguridad de la Información se añade como 43–50 (Spec 003): mismos ocho reactivos, opciones y nota de Fabricantes 55–62; subtotal automático de 0–80. Las preguntas y nombres 1–42 se conservan.

## Servicios — 08015p21 Rev. 5, 03.06.2026

| Pregunta | Condición | Dependencia |
| ---: | --- | --- |
| 1–2 | Siempre | Número de personas y sucursales, enteros no negativos. |
| 3 | Otros | Descripción del servicio; al menos un servicio seleccionado. |
| 4 | Cada certificado | Vigencia y archivo requeridos; Otros requiere además nombre. Ninguno es excluyente y no requiere anexos. |
| 5 | Ninguna certificación seleccionada | Preguntar si planea certificarse; sólo Sí requiere mes y año. |
| 6 | Siempre | Posibilidad de visita, Sí/No. |
| 7–8 | Siempre | Años desde fundación y experiencia en los servicios solicitados, no negativos. |
| 9 | Sí | Organigrama adjunto. |
| 10 | Sí | Referencias, clientes o proyectos adjuntos; admite varios archivos. |
| 11–13 | Sí | Detalle de capacitaciones, acceso a normas/leyes y cursos de seguridad, respectivamente. |
| 14–15 | Siempre | IMSS y equipo de seguridad, Sí/No. |
| 16 | Siempre | Satisfacción del personal, entre 0 y 100 %. |
| 17–19 | Siempre | Personal con inglés, experiencia en el extranjero y disponibilidad para viajar, Sí/No. |
| 20 | Siempre | Al menos un método de registro de horas: escrito, electrónico manual o electrónico automático. |
| 21 | Sí | Software utilizado; redacción aclarada para corresponder a las opciones Sí/No del PDF. |
| 22–23 | Siempre | Reacción urgente y separación de basura, Sí/No. |
| 24–25 | Sí | Nombres de responsables ambiental y de calidad, respectivamente. |
| 26–31 | Siempre | Pruebas, documentación, auditorías, certificación de proveedores, estándares y reclamos, Sí/No. |
| 32–39 | Siempre | Seguridad de la Información: escala 0, 4, 6, 8 y 10; subtotal 0–80. |

El PDF contiene cinco páginas aunque el pie dice «de 3». Se conserva toda la información de las preguntas y se usa navegación por pasos. No se trasladan placeholders de Word ni la instrucción F9 del subtotal. La instrucción de envío por correo/plazo de tres días se adapta a Formspree y al formulario permanente, como los demás formularios.

## Datos pendientes de FFT México

1. Endpoint Maquinados configurado en el código (ver Spec 002).
2. Endpoint Distribuidores configurado en el código (ver Spec 002).
   Endpoint Servicios proporcionado por el solicitante y configurado: `https://formspree.io/f/mbgjqzka` (Spec 003).
3. Política de conservación, responsable y plazo de borrado de respuestas/evidencias en Formspree.
4. Límites máximos de tamaño y cantidad de archivos.
5. Confirmación de si los plazos de “3 días” de los PDFs siguen vigentes; la web actual los describe como formularios permanentes.

## Actualización 2026-09-09 — Spec 002

Todos los envíos AJAX satisfactorios redirigen a thanks/index.html del formulario. Los errores conservan la captura. Maquinados usa selects Tipo en ambas tablas de pregunta 4 y la frase «Durante el año pasado» en 43. Seguridad 47–54 conserva nombres y replica las opciones descriptivas de Fabricantes 55–62. Véase specs/002-certificaciones-agradecimiento-maquinados.md.
