# Registro de especificaciones

**Revisión documental:** 2026-11-02. Los estados siguientes proceden de las specs e informes existentes; no representan pruebas ejecutadas en esta revisión.

| ID | Especificación | Estado documentado | Evidencia |
| --- | --- | --- | --- |
| 001 | [Catálogo de tres formularios](001-catalogo-tres-formularios.md) | Implementada; ampliada por 003 | [Auditoría 2026-08-26](../reports/2026-08-26-auditoria-spec-001.md) |
| 002 | [Certificaciones, agradecimiento y Maquinados](002-certificaciones-agradecimiento-maquinados.md) | Implementada y verificada | [Validación 2026-09-09](../reports/2026-09-09-validacion-spec-002.md) |
| 003 | [Servicios y seguridad en Distribuidores](003-servicios-seguridad-distribuidores.md) | Implementada y verificada | [Validación 2026-09-09](../reports/2026-09-09-validacion-spec-003.md) |
| 004 | [Submission Viewers y catálogo general](004-submission-viewers-catalogo-general.md) | Implementada y verificada según informe | [Validación 2026-09-18](../reports/2026-09-18-validacion-spec-004.md) |
| 005 | [Cálculo de Servicios en dos bloques](005-calculo-evaluacion-servicios.md) | Implementada y verificada localmente | [Validación 2026-11-02](../reports/2026-11-02-validacion-spec-005.md) |

## Ciclo de una nueva spec

1. Copiar la plantilla a `docs/specs/006-descripcion-del-cambio.md` cuando se conozca la funcionalidad. Sustituir todos los marcadores.
2. En **Borrador**, definir problema, alcance, decisiones y criterios verificables.
3. Pasar a **Lista para implementar** cuando estén resueltas las decisiones necesarias; documentar responsable y fecha de esa decisión.
4. Marcar **En implementación** al iniciar el trabajo y registrar desviaciones justificadas.
5. Marcar **Implementada, pendiente de validación** si aún falta evidencia.
6. Marcar **Implementada y verificada** sólo con informe enlazado y resultados que cubran la aceptación. Registrar límites y pendientes residuales.

Una spec también puede quedar **Bloqueada** con motivo explícito, o **Cancelada / Sustituida** con referencia a la decisión o spec sucesora. Los documentos históricos no se convierten en instrucciones para nuevas iteraciones.

[Índice documental](../README.md) · [Seguimiento](../TRACKING.md)
