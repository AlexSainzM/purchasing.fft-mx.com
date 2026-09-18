# Consulta de evaluaciones de proveedores

Aplicación 100 % frontend: HTML, CSS y JavaScript; Formspree es la única persistencia. Los comandos Node son exclusivamente herramientas locales de desarrollo y QA.

## Rutas y arquitectura

La carpeta existente se llama `submissions_viewer` (plural) y se conserva para no romper enlaces. `submission_viewer/index.html` también ofrece el catálogo solicitado por la Spec 004 y enlaza a los mismos visores mediante rutas relativas.

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

La lista mantiene el patrón original: empresa/contacto, recepción, subtotal reportado sobre 80 y detalle desplegable accesible por teclado. El detalle muestra todos los campos recibidos, evidencia HTTPS, metadatos y secciones propias de cada evaluación. Maquinados admite filas numeradas de CNC, corte y trabajadores más allá de la primera fila. Campos históricos no presentes en el esquema siguen visibles con nombres humanizados en Datos del registro.

Se conserva el orden por fecha descendente y el horario de Ciudad de México. Valores ausentes no equivalen a No. No se calculan resultados de aprobación. El visor original no tenía búsqueda ni filtros; se conserva ese alcance.

Carga inicial y actualización consultan exclusivamente Formspree. Se eliminó el botón Ver ejemplo, la selección de fuente, la URL del ejemplo y los mensajes que ofrecían usarlo. `08015p22_autoevaluacion_fabricantes/response_example.json` se conserva exclusivamente como fixture explícito del harness, sin solicitudes del navegador ni fallback de producción.

La consulta tiene un timeout de 15 segundos y mensajes para errores HTTP, conexión, contrato inválido y cero registros. Los datos se insertan mediante textContent; sólo enlaces HTTPS sin credenciales se convierten en enlaces externos. El contador representa los registros devueltos por la consulta, no un total global. Se conserva la consulta original sin paginación; conjuntos mayores requerirían una iteración específica.

## Ejecución local

Desde la raíz del proyecto:

```powershell
node submissions_viewer/serve.cjs
```

Abrir `http://127.0.0.1:8765/submissions_viewer/` o `http://127.0.0.1:8765/submission_viewer/`. El comando anterior de Fabricantes también inicia este servidor. Servir la raíz completa permite resolver navegación y recursos compartidos. En despliegue basta un servidor estático; no usar file://.

## QA

Requiere Playwright disponible mediante NODE_PATH y Microsoft Edge:

```powershell
node tests/build_viewer_schemas.cjs
node tests/verify_viewers.cjs
$env:VIEWER_LIVE = '1'
node tests/verify_viewers.cjs
Remove-Item Env:VIEWER_LIVE
python tests/verify_forms.py
```

El harness normal intercepta Formspree: comprueba destino y clave por visor, catálogo, rutas relativas, cantidad y etiquetas de campos, filas dinámicas, evidencias, teclado, responsive, errores, vacío, datos incompletos, HTML no confiable y recuperación mediante actualización real simulada. Rechaza solicitudes del navegador al fixture. Capturas sintéticas en `tmp/viewers-qa/` (ignoradas por Git).

El modo LIVE sólo consulta registros existentes y comprueba la integración real desde el navegador, incluido CORS. No envía ni modifica submissions ni guarda respuestas reales. Véase `docs/VALIDATION_SPEC004_2026-09-18.md`.
