# Visor de Fabricantes

Autoevaluación 08015p22 Rev. 5; Formspree `mvkppyry`. La configuración propia reside en `config.js` y las etiquetas en `schema.js`. La página utiliza `../shared/main.js` y `../shared/styles.css`, compartidos por los cuatro visores.

Consulta exclusivamente Formspree. El botón de ejemplo y toda dependencia del JSON durante la ejecución fueron eliminados. `response_example.json` se conserva únicamente como fixture leído por `tests/verify_viewers.cjs` para QA, nunca como fallback.

Desde la raíz del repositorio se conservan los comandos:

```powershell
node submissions_viewer/08015p22_autoevaluacion_fabricantes/serve.cjs
node submissions_viewer/08015p22_autoevaluacion_fabricantes/verify.cjs
```

El servidor local sirve ahora la raíz del proyecto para permitir navegar al catálogo. Abrir `http://127.0.0.1:8765/submissions_viewer/`. El verificador cubre los cuatro visores y requiere Playwright y Edge.

Consultar [documentación común](../README.md) para rutas, contrato, configuración, QA y limitaciones.
