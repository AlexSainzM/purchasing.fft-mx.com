# Seguimiento documental

**Fecha de revisión:** 2026-11-02

## Estado y siguiente paso

Las Specs 001–004 cuentan con informes históricos en el [registro](specs/README.md). La **005** está implementada y verificada localmente: Evaluación general /26 y Seguridad de la Información /80, con resultados independientes. Véase el [informe](reports/2026-11-02-validacion-spec-005.md). Sin despliegue ni consultas LIVE; siguiente numeración disponible: **006**.

## Decisiones de negocio pendientes de confirmación

Estos puntos aparecen en la auditoría o la matriz y no tienen cierre explícito en los documentos revisados. No constituyen por sí mismos el alcance de la Spec 005.

| Tema | Fuente | Próximo paso |
| --- | --- | --- |
| Privacidad, conservación, responsable y eliminación de respuestas/evidencias | Auditoría 001 y matriz | Confirmar política con FFT México. |
| Tamaño y cantidad máximos de anexos | Auditoría 001 y matriz | Definir límites aplicables. |
| Plazo de tres días frente a formularios permanentes | Auditoría 001 y matriz | Confirmar regla de negocio. |
| Código compartido 08015p22 en Fabricantes y Maquinados | Auditoría 001 | Confirmar identificación oficial. |
| Fecha de inicio, vigencia o ambas para certificaciones | Auditoría 001 | Confirmar información que debe capturarse. |
| Ampliación de respuestas «No aplica» | Auditoría 001 | Confirmar si se necesita modificar reglas. |

Fuentes: [auditoría 001](reports/2026-08-26-auditoria-spec-001.md) y [matriz](FORM_LOGIC_MATRIX.md). Los endpoints pendientes de la auditoría fueron resueltos según las Specs 002–003; la consulta de registros se abordó en la Spec 004.

## Límites documentados de la Spec 004

El [informe](reports/2026-09-18-validacion-spec-004.md) registra frontend con claves de lectura visibles, ausencia de autenticación y de paginación, y necesidad de regenerar esquemas cuando cambien formularios. No registra despliegue. Estos límites no se presentan como fallos nuevos ni como trabajo aprobado.

## Registro de mantenimiento

| Fecha | Cambio | Verificación realizada |
| --- | --- | --- |
| 2026-10-30 | Índice, registro de specs, seguimiento y plantilla; informes agrupados en `reports/`; nombre de Spec 004 normalizado; referencias actualizadas; rutas de compatibilidad conservadas. | 53 enlaces locales válidos; cambios limitados a `docs`; SHA-256 de los cuatro CSV idéntico al inventario inicial; `git diff --check` sin errores. |
| 2026-11-02 | Spec 005: cálculo y visualización de Servicios en dos bloques; actualización documental y ruta obsoleta del informe en la prueba estructural. | Pruebas de cálculo, cuatro visores con Formspree simulado, regresión estructural y capturas; ver informe 005. |

La reorganización documental anterior conserva los resultados históricos. [Volver al índice](README.md).
