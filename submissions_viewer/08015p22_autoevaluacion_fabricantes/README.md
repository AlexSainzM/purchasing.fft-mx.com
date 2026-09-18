# Visor de autoevaluaciones de fabricantes

Prototipo estático 08015p22 Rev. 5. Solo se crean archivos dentro de `submissions_viewer`; el JSON de referencia se conserva intacto. Contexto: `docs/PROJECT_OVERVIEW.md`, `docs/INSPECTION_MODEL.md` y formulario de fabricantes. La documentación se usa como contexto del proyecto; el alcance de esta entrega lo define la solicitud del usuario.

## Uso

Desde la raíz del repositorio:

```powershell
node submissions_viewer/08015p22_autoevaluacion_fabricantes/serve.cjs
```

Abrir http://127.0.0.1:8765/. También puede servirse la carpeta desde cualquier servidor estático. No usar `file://`: la carga JSON requiere HTTP. El enlace de FFT al catálogo funciona cuando el visor se sirve dentro del repositorio completo.

Al abrir se consulta Formspree. Cada registro empieza cerrado y se despliega mediante clic, Enter o espacio. “Actualizar registros” repite la consulta; “Ver ejemplo” carga explícitamente los cuatro registros de `response_example.json`. Un error nunca se sustituye silenciosamente por datos de ejemplo.

## Contrato y decisiones

- HTML, CSS y JavaScript sin dependencias de ejecución; paleta, tipografía, gradiente y superficies de los formularios existentes.
- `config.js`: Form ID y clave de solo lectura proporcionada para este prototipo. La clave es visible en el navegador; esto no incorpora autenticación de usuarios. No usar una clave maestra. La consulta en vivo devuelve información interna: este prototipo no se publica en esta entrega.
- `GET https://formspree.io/api/0/forms/mvkppyry/submissions`, con `Authorization: Bearer` y `Accept: application/json`. No se crean, editan ni eliminan envíos.
- Contrato: objeto con `submissions`, array de objetos planos. Se muestran todos los campos recibidos, incluidos desconocidos. Campos condicionales ausentes no se interpretan como respuestas negativas; valores vacíos recibidos se indican explícitamente.
- Orden descendente por `_date` o fecha ISO. `_date` sin zona se interpreta como UTC; se muestra en Ciudad de México. Fechas históricas declaradas en texto se conservan sin intentar adivinar su formato.
- Subtotal reportado, sin asignar aprobación o rechazo al proveedor. Las preguntas se agrupan conforme a las secciones del formulario.
- Los adjuntos HTTPS se muestran como enlaces, sin descarga automática. Los textos se insertan con `textContent`; no se ejecuta HTML recibido.
- Límite de espera de 15 segundos; estados de carga, vacío, error HTTP, red y contrato inválido. El conteo corresponde a los registros devueltos en la consulta, sin asumir un total global.

Referencias de API: [Consulta de envíos](https://help.formspree.io/articles/the-forms-api/form-submissions-api), [autenticación](https://help.formspree.io/articles/the-forms-api/api-authentication).

## Harness de verificación

`verify.cjs` requiere Playwright y Microsoft Edge. Ejecutar con Playwright instalado o con `NODE_PATH` apuntando al runtime disponible:

```powershell
node submissions_viewer/08015p22_autoevaluacion_fabricantes/verify.cjs
```

Intercepta todas las consultas a Formspree y comprueba lista, teclado, totalidad de campos, evidencias, presentación móvil, vacío, errores, contenido no confiable y recuperación mediante ejemplo. Guarda capturas en `qa/` dentro de esta carpeta. La prueba real de conectividad se hace por separado y no guarda respuestas ni datos adicionales.
