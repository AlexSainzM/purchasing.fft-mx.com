# Seguimiento documental

**Fecha de revisión:** 2026-10-30

## Estado y siguiente paso

Las Specs 001–004 cuentan con informes históricos en el [registro](specs/README.md). La siguiente iteración será la **005**, con funcionalidad pendiente de definición. Se deja únicamente la [plantilla](templates/spec-template.md), conforme a lo solicitado; no se asignan requisitos ni fechas de implementación.

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

La reorganización conserva los resultados históricos y no modifica la aplicación. [Volver al índice](README.md).
