# Documentación del proyecto

**Actualización:** 2026-10-30

## Ruta de lectura

1. [Contexto y arquitectura](PROJECT_OVERVIEW.md).
2. [Modelo común de autoevaluación](INSPECTION_MODEL.md) y [matriz de reglas](FORM_LOGIC_MATRIX.md).
3. [Seguimiento y decisiones pendientes](TRACKING.md).
4. [Registro de specs y evidencias](specs/README.md).
5. [Plantilla de spec](templates/spec-template.md) para definir el siguiente cambio.

## Organización

| Ubicación | Contenido |
| --- | --- |
| `PROJECT_OVERVIEW.md` | Contexto general y arquitectura documentada. |
| `INSPECTION_MODEL.md` | Contrato común y comportamiento de respuestas. |
| `FORM_LOGIC_MATRIX.md` | Reglas específicas por formulario. |
| `TRACKING.md` | Estado documental, pendientes y próximo paso. |
| `specs/` | Requisitos de cada iteración y registro de estados. |
| `reports/` | Auditorías y validaciones históricas fechadas. |
| `templates/` | Plantillas para nuevas iteraciones. |
| `csv_forms/` | Material fuente conservado sin cambios. |

Los archivos `AUDIT_REPORT_2026-08-26.md` y `VALIDATION_SPEC004_2026-09-18.md` son enlaces de compatibilidad: pruebas y documentación fuera de `docs` aún usan esas rutas. Sus informes se mantienen en `reports/`.

## Convenciones de mantenimiento

- Specs: `NNN-descripcion-en-minusculas.md`; conservar el ID durante todo el ciclo.
- Informes: `AAAA-MM-DD-validacion-spec-NNN.md`; registrar comandos, resultados, evidencia y límites.
- Enlaces Markdown relativos al documento que los contiene. Las rutas técnicas en bloques de código o entre comillas invertidas se interpretan desde la raíz del repositorio, salvo indicación explícita.
- Mantener los resultados históricos con su fecha. Una reorganización documental no acredita una nueva ejecución de pruebas.
- Al mover un documento, actualizar sus referencias dentro de `docs`. Si existen consumidores externos que no pueden modificarse, conservar un archivo de enlace en la ruta anterior.
- Actualizar el registro de specs y el seguimiento al cambiar de estado. Actualizar modelo y matriz cuando cambien contratos o reglas.

## Próxima iteración

La siguiente numeración prevista es **005**. Su funcionalidad aún no está definida. Utilizar la [plantilla](templates/spec-template.md) cuando se acuerde el alcance; no hay una Spec 005 aprobada ni lista para implementar.
