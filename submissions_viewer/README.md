# Consulta de evaluaciones de proveedores

Aplicación 100 % frontend: HTML, CSS y JavaScript; Formspree es la única persistencia. Los comandos Node son exclusivamente herramientas locales de desarrollo y QA.

## Rutas y arquitectura

Los visores y el catálogo viven en `submissions_viewer/`. El catálogo está en `index.html` y enlaza a los cuatro formularios.

| Carpeta en submissions_viewer | Form ID | Documento |
| --- | --- | --- |
| 08015p21_autoevaluacion_servicios | mbgjqzka | 08015p21 Rev. 5 |
| 08015p22_autoevaluacion_fabricantes | mvkppyry | 08015p22 Rev. 5 |
| 08015p22_evaluacion maquinados | myeygeqy | 08015p22 Rev. 4 |
| 08015p23_evaluación_distribuidor | mzebpelz | 08015p23 Rev. 5 |

- `index.html`: catálogo con cuatro tarjetas.
- Cada carpeta contiene `index.html`, `config.js` (Form ID y clave de solo lectura de la especificación) y `schema.js` (campos, etiquetas y secciones de su formulario).
- `shared/main.js` y `shared/styles.css`: consulta, renderizado y presentación comunes, derivados del visor original de Fabricantes.
- Los archivos originales `main.js`, `styles.css`, `serve.cjs` y `verify.cjs` de Fabricantes se conservan como entradas de compatibilidad; su página carga directamente los recursos compartidos.
- `tests/build_viewer_schemas.cjs` genera los esquemas leyendo los formularios inicializados en Edge, incluidos controles creados por JavaScript. Ejecutarlo cuando cambien las preguntas, revisar el diff y volver a ejecutar QA. No se ejecuta al abrir los visores.

Las claves suministradas permanecen visibles en el navegador, como corresponde al prototipo autorizado. Cada visor hace únicamente GET a `https://formspree.io/api/0/forms/{formId}/submissions` con su propia clave. No se agregan autenticación ni servicios de producción.

## Interacción y datos

Los visores salvo Servicios mantienen el patrón original: empresa/contacto, recepción, subtotal reportado sobre 80 y detalle desplegable accesible por teclado. El detalle muestra todos los campos recibidos, evidencia HTTPS, metadatos y secciones propias de cada evaluación. Maquinados admite filas numeradas de CNC, corte y trabajadores más allá de la primera fila. Campos históricos no presentes en el esquema siguen visibles con nombres humanizados en Datos del registro.

Se conserva el orden por fecha descendente y el horario de Ciudad de México. Valores ausentes no equivalen a No. Servicios es la excepción al subtotal reportado: implementa la Spec 005 con Evaluación general (máximo 26) y Seguridad de la Información (máximo 80), cada una con porcentaje y clasificación independientes. No se calcula una calificación conjunta ni autorización de compra. Los otros tres visores conservan el subtotal reportado. El visor original no tenía búsqueda ni filtros; se conserva ese alcance.

Carga inicial y actualización consultan exclusivamente Formspree. Se eliminó el botón Ver ejemplo, la selección de fuente, la URL del ejemplo y los mensajes que ofrecían usarlo. `08015p22_autoevaluacion_fabricantes/response_example.json` se conserva exclusivamente como fixture explícito del harness, sin solicitudes del navegador ni fallback de producción.

La consulta tiene un timeout de 15 segundos y mensajes para errores HTTP, conexión, contrato inválido y cero registros. Los datos se insertan mediante textContent; sólo enlaces HTTPS sin credenciales se convierten en enlaces externos. El contador representa los registros devueltos por la consulta, no un total global. Se conserva la consulta original sin paginación; conjuntos mayores requerirían una iteración específica.

## Cálculo de Servicios — Spec 005

`08015p21_autoevaluacion_servicios/evaluation.js` calcula sin DOM ni escrituras; `config.js` lo activa mediante `evaluation: "services-spec-005"`. El módulo devuelve `general`, `security`, incidencias por pregunta y avisos de subtotal discrepante. La lista y el detalle muestran ambos resultados; el detalle conserva los datos originales y agrupa los 34 reactivos con sus razones.

Los denominadores son fijos (26 y 80). Se clasifica sin redondear: C ≤60 %, B ≤75 %, AB ≤90 %, A >90 %. Un bloque incompleto o inválido muestra puntos parciales sin porcentaje final ni clasificación, mientras el otro puede evaluarse. No se sustituye ninguna respuesta faltante por el subtotal recibido.

Evidencias: HTTPS individual o lista de URLs, sin credenciales; formatos desconocidos requieren revisión. No se descargan ni auditan documentos. Reglas completas y límites: [Spec 005](../docs/specs/005-calculo-evaluacion-servicios.md) e [informe](../docs/reports/2026-11-02-validacion-spec-005.md).

## Ejecución local

Desde la raíz del proyecto:

```powershell
node submissions_viewer/serve.cjs
```

Abrir `http://127.0.0.1:8765/submissions_viewer/`. El comando anterior de Fabricantes también inicia este servidor. Servir la raíz completa permite resolver navegación y recursos compartidos. En despliegue basta un servidor estático; no usar file://.

## QA

Requiere Node.js y Playwright disponible mediante NODE_PATH. El navegador predeterminado es Microsoft Edge; `VIEWER_BROWSER` permite indicar la ruta de otro Chromium instalado (por ejemplo, Brave).

```powershell
node tests/build_viewer_schemas.cjs
node tests/verify_services_evaluation.cjs
node tests/verify_viewers.cjs
$env:VIEWER_LIVE = '1'
node tests/verify_viewers.cjs
Remove-Item Env:VIEWER_LIVE
python tests/verify_forms.py
```

El harness normal intercepta Formspree: comprueba destino y clave por visor, catálogo, rutas relativas, cantidad y etiquetas de campos, filas dinámicas, evidencias, teclado, responsive, errores, vacío, datos incompletos, HTML no confiable y recuperación mediante actualización real simulada. Rechaza solicitudes del navegador al fixture. Capturas sintéticas en `tmp/viewers-qa/` (ignoradas por Git).

El modo LIVE sólo consulta registros existentes y comprueba la integración real desde el navegador, incluido CORS. No envía ni modifica submissions ni guarda respuestas reales. Véase `docs/reports/2026-09-18-validacion-spec-004.md`. La validación de la Spec 005 se hizo con Formspree simulado, sin LIVE.
