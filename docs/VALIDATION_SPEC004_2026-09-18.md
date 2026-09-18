# Validación Spec 004 — 2026-09-18

## Implementación

Se conservó la carpeta real `submissions_viewer` y se agregó `submission_viewer/index.html` como entrada compatible con la ruta solicitada. Ambos catálogos enlazan a los cuatro visores. No se renombraron ni modificaron formularios, preguntas, cálculos o endpoints de envío.

Creado: catálogo plural y entrada singular; tres carpetas de visores con los nombres exactos de sus formularios; schema.js para los cuatro; recursos shared/main.js y shared/styles.css; servidor local común; generador de esquemas; harness de navegador y helper estático; README común y este informe.

Modificado: index/config/main/styles/serve/verify/README del visor de Fabricantes, PROJECT_OVERVIEW.md y .gitignore. El archivo de especificación previamente preparado por el usuario se conserva intacto.

El visor base no tenía filtros ni buscador. Se preservan lista desplegable, teclado, fechas, subtotal, evidencias y todos los campos recibidos. Las diferencias se concentran en config.js y schema.js, generados a partir de los controles inicializados de cada formulario; incluye las preguntas dinámicas de Servicios/Distribuidores y las tablas de Maquinados.

## Resultados

- Harness de los cuatro visores: PASS. Destino y clave correctos, cuatro enlaces de catálogo, regreso, cero rutas locales 404 y cero errores JavaScript.
- Campos y etiquetas por formulario; fixture original de Fabricantes completo; evidencias HTTPS; navegación con Enter; fila CNC 12: PASS.
- Vacío, HTTP 403 y 500, respuesta inválida, error de conexión, loading, registros incompletos, subtotal inválido y recuperación: PASS.
- HTML recibido y URL javascript: se mantienen inertes; no se crean imágenes ni enlaces ejecutables: PASS.
- Responsive a 1440, 768 y 390 px: sin desbordamiento horizontal; capturas guardadas localmente. Inspección visual del catálogo desktop y detalle móvil: correcta.
- Ninguna solicitud a response_example.json. Fixture conservado exclusivamente para QA.
- `python tests/verify_forms.py`: 14 pruebas correctas.

## Formspree real

Se realizaron consultas GET con cada clave suministrada, primero por HTTP y después desde los propios visores en Edge. Todos respondieron HTTP 200 y permitieron CORS. El harness LIVE pasó para los cuatro.

| Evaluación | Form ID | Registros recibidos |
| --- | --- | ---: |
| Fabricantes | mvkppyry | 4 |
| Maquinados | myeygeqy | 1 |
| Servicios | mbgjqzka | 1 |
| Distribuidores | mzebpelz | 0 |

No se enviaron pruebas ni se modificaron registros existentes. Distribuidores se validó con una respuesta real vacía y datos sintéticos del esquema del formulario en QA.

## Límites conservados

Frontend con claves de lectura visibles, sin autenticación de usuarios. La consulta conserva el comportamiento del visor original: muestra la lista devuelta por Formspree y no implementa paginación. Campos históricos desconocidos se muestran humanizados; los esquemas se regeneran cuando cambien los formularios. No se realizó despliegue.
