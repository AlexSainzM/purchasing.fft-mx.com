# Validación Spec 005 — Evaluación de Servicios en dos bloques

**Fecha:** 2026-11-02  
**Resultado:** Implementada y verificada localmente. Sin despliegue ni consultas LIVE.

## Implementación

- `submissions_viewer/08015p21_autoevaluacion_servicios/evaluation.js`: cálculo puro de los 34 reactivos. General /26 y Seguridad /80, clasificación independiente sin redondeo previo y razones por pregunta.
- Activación explícita mediante configuración de Servicios; lista y detalle muestran ambos bloques. Los otros tres visores conservan sus subtotales reportados.
- Faltantes e inválidos generan puntos parciales y causas solo en el bloque afectado. Se conservan respuestas originales y se avisa de diferencias con el subtotal recibido.
- Se aplicaron las propuestas D-01 a D-04 al recibir la instrucción de implementar. D-05 reconoce HTTPS individual o listas sin credenciales; el fixture existente de Fabricantes contiene listas de URLs de Formspree. Los casos de Servicios son sintéticos; estructuras desconocidas quedan pendientes de revisión.
- Sin cambios a formularios, CSV, esquemas, endpoints ni registros almacenados.

## Verificaciones ejecutadas

| Comando / revisión | Resultado |
| --- | --- |
| `node tests/verify_services_evaluation.cjs` | PASS: correspondencia de los 34 reactivos con CSV y esquema, mínimos/máximos, umbrales, ejemplos porcentuales, años decimales, satisfacción, normalización, faltantes, inválidos, certificaciones, evidencias, nombres, subtotal e inmutabilidad. |
| `node tests/verify_viewers.cjs` | PASS para los cuatro visores: catálogo, campos originales, evidencias, teclado, 1440/768/390 px sin desbordamiento, carga, vacío, errores, contenido no confiable y recuperación. Servicios verifica dos resultados, 34 reactivos, bloques con calificaciones opuestas y estados parciales independientes. |
| `python3 tests/verify_forms.py` | 14 pruebas OK, incluida sintaxis JavaScript con Node en PATH. |
| Revisión visual | Capturas de Servicios con máximos en escritorio y con bloque general pendiente / Seguridad A en móvil: puntos, estados y desglose legibles. |
| `git diff --check` | Sin errores de espacios. |

Se usó Node v24.22.1 del runtime local y Playwright con Brave instalado, mediante `NODE_PATH` y `VIEWER_BROWSER`. El servidor temporal de QA se cerró al terminar. Formspree se interceptó; el harness comprueba exclusivamente GET y la configuración correspondiente a cada visor. No se descargaron evidencias ni se enviaron datos.

La primera ejecución de regresión estructural detectó una ruta obsoleta a `docs/AUDIT_REPORT_2026-08-26.md`. Se actualizó la prueba para apuntar al informe existente `docs/reports/2026-08-26-auditoria-spec-001.md`; después pasó completa. No se modificó la captura para resolver este problema.

## Evidencia y reproducción

Los fixtures sintéticos están en `tests/fixtures/services.cjs`. Las capturas generadas permanecen en `tmp/viewers-qa/` (ignorado por Git): `mbgjqzka-1440.png`, `mbgjqzka-768.png`, `mbgjqzka-390.png` y `services-partial-{1440,768,390}.png`.

Con Node y Playwright disponibles, ejecutar los tres comandos de la tabla. El navegador por defecto del harness es Edge; `VIEWER_BROWSER` permite seleccionar un Chromium instalado. No activar `VIEWER_LIVE` para reproducir estos resultados.

## Límites

No se verificó la integración real de adjuntos de Servicios mediante LIVE ni se desplegó. Nombres de archivo aislados y objetos no reconocidos se muestran como evidencia no interpretable; nunca conceden puntos por sí mismos. Las clasificaciones son de autoevaluación, no una aprobación de compra ni una auditoría de documentos.

[Spec 005](../specs/005-calculo-evaluacion-servicios.md) · [Registro](../specs/README.md)
