# Spec 005 — Cálculo y clasificación de proveedores de Servicios

**Estado:** Borrador para revisión; no implementar todavía

**Fecha:** 2026-11-02

**Responsable de validación de negocio:** Solicitante / FFT México

**Decisión para iniciar:** Pendiente de revisión y autorización para la siguiente iteración

**Specs relacionadas:** [003 — Servicios](003-servicios-seguridad-distribuidores.md) y [004 — Visores](004-submission-viewers-catalogo-general.md)

## 1. Problema y resultado esperado

El visor de Servicios muestra las respuestas y el subtotal de seguridad reportado, pero requiere dos resultados independientes: **Evaluación general** y **Seguridad de la Información**. Cada bloque se calcula desde las respuestas de cada registro y las ponderaciones del CSV de Servicios, sin modificar los puntos por pregunta. Separar los denominadores evita que los 80 puntos posibles de Seguridad tengan más peso sobre los 26 puntos generales en una calificación conjunta.

Ejemplo: un registro con 22 puntos generales y 68 de Seguridad mostrará **Evaluación general: 22/26 — 84.62 % — Clasificación AB** y **Seguridad de la Información: 68/80 — 85.00 % — Clasificación AB**, con un desglose que permita explicar ambos resultados. No se calcula una calificación global, suma ni promedio de los porcentajes de ambos bloques. Se evalúa cada registro individualmente; no se consolidan envíos de una empresa ni se infiere autorización de compra.

Esta iteración únicamente prepara esta Spec. La implementación y validación funcional se realizarán en una iteración posterior.

## 2. Contexto y fuentes

- Fuente de ponderación: [08015p21_autoevaluacion_servicios.csv](../csv_forms/08015p21_autoevaluacion_servicios.csv).
- Campos vigentes: [formulario de Servicios](../../forms/08015p21_autoevaluacion_servicios/index.html), [lógica del formulario](../../forms/08015p21_autoevaluacion_servicios/main.js) y [esquema del visor](../../submissions_viewer/08015p21_autoevaluacion_servicios/schema.js).
- Presentación actual: [visor de Servicios](../../submissions_viewer/08015p21_autoevaluacion_servicios/index.html), [lógica compartida](../../submissions_viewer/shared/main.js) y [README de visores](../../submissions_viewer/README.md).
- Contexto: [modelo común](../INSPECTION_MODEL.md), [matriz de lógica](../FORM_LOGIC_MATRIX.md) y [arquitectura](../PROJECT_OVERVIEW.md).

El CSV define los puntos; el formulario y su esquema identifican los campos enviados. Las propuestas que resuelven casos no definidos en el CSV se señalan en la sección 10.

## 3. Alcance

1. Calcular puntos, porcentaje y clasificación independientes para cada uno de los dos bloques por registro exclusivamente para **Servicios, 08015p21**.
2. Mostrar resultados en la lista y desglose por reactivo en el detalle.
3. Recalcular registros existentes y nuevos con las mismas reglas, sin modificar los datos almacenados.
4. Manejar datos incompletos, inválidos y evidencias necesarias para puntuar.
5. Verificar cálculo, presentación y ausencia de cambios funcionales en los otros visores.

La futura implementación podrá modificar el visor de Servicios y los recursos compartidos estrictamente necesarios. Se propone un módulo de cálculo propio dentro de `submissions_viewer/08015p21_autoevaluacion_servicios/`, separado del renderizado y comprobable con datos sintéticos.

## 4. Fuera de alcance y restricciones

- No calcular ni modificar calificaciones de Fabricantes, Maquinados o Distribuidores.
- No cambiar preguntas, opciones, validaciones, payload ni envío del formulario de captura. Esta Spec evalúa sus registros desde el visor.
- No modificar el CSV, PDFs, claves, endpoints ni respuestas almacenadas.
- No agregar backend, framework, autenticación, exportaciones, filtros ni clasificación manual.
- Mantener HTML/CSS/JavaScript estáticos y consulta de solo lectura a Formspree.
- La clasificación deriva de la autoevaluación; no acredita la autenticidad de documentos ni sustituye su revisión humana.

## 5. Comportamiento requerido

### 5.1 Bloques y fórmulas confirmados

| Bloque | Reactivos | Máximo por reactivo | Máximo del bloque |
| --- | --- | ---: | ---: |
| Evaluación general | 5–19 y 21–31: 26 preguntas | 1 | 26 |
| Seguridad de la Información | 32–39: 8 preguntas | 10 | 80 |
| Informativos | 1–4 y 20 | No puntúan por separado | 0 |

```text
puntos_general = suma de puntos de P5–P19 y P21–P31
maximo_general = 26
porcentaje_general = (puntos_general / maximo_general) × 100

puntos_seguridad = suma de puntos de P32–P39
maximo_seguridad = 80
porcentaje_seguridad = (puntos_seguridad / maximo_seguridad) × 100
```

Cada denominador es fijo e independiente: 26 para Evaluación general y 80 para Seguridad de la Información; no depende del número de respuestas recibidas. Los puntos de Seguridad no forman parte del numerador ni del denominador de Evaluación general. P4 alimenta P5, pero no aporta otro punto. P5 mantiene su máximo aunque esté inactiva por existir una certificación. No sumar nuevamente `subtotal_seguridad_informacion`.

Se conserva el CSV y la ponderación de cada pregunta: máximo 1 por reactivo general y 10 por reactivo de Seguridad. No normalizar los reactivos de Seguridad a un punto. Los 34 reactivos se distribuyen en dos evaluaciones independientes; 106 no se utiliza como denominador ni como total de una calificación conjunta. Esta decisión sustituye el cálculo combinado anterior.

### 5.2 Reglas por reactivo

Estas reglas aplican a entradas válidas; la sección 5.4 distingue respuestas negativas de datos ausentes o inválidos.

| Pregunta | Campos de entrada | Puntos |
| --- | --- | --- |
| 1–4, 20 | Informativos; certificaciones alimentan P5 | Sin puntos propios. |
| 5 | `p04_iso9001`, `p04_vda64`, `p04_iso45001`, `p04_iso14001`, `p04_tisax`, `p04_otros`; `p04_ninguno`; `p05_planea_certificarse` | 1 si declara al menos una certificación o, sin certificaciones, responde Sí al plan; 0 si declara Ninguno y responde No al plan. Máximo 1 aunque existan varias certificaciones. |
| 6 | `p06_visita_evaluacion` | Sí = 1; No = 0. |
| 7 | `p07_antiguedad_empresa` | Menos de 2 años = 0; de 2 a 5 = 0.25; de 6 a 20 = 0.75; más de 20 = 1. Ver propuesta para decimales en sección 10. |
| 8 | `p08_experiencia_servicios` | Mismos intervalos y puntos que P7. |
| 9 | `p09_organigrama`, `p09_archivo_organigrama` | Sí y evidencia adjunta reconocible = 1; No o Sí sin evidencia = 0. |
| 10 | `p10_referencias`, `p10_archivos_referencias` | Sí y al menos una evidencia adjunta reconocible = 1; No o Sí sin evidencia = 0. Varios archivos no multiplican los puntos. |
| 11–15 | `p11_capacitaciones`, `p12_acceso_normas`, `p13_cursos_seguridad`, `p14_imss`, `p15_equipo_seguridad` | Cada pregunta: Sí = 1; No = 0. |
| 16 | `p16_satisfaccion_personal` | 95–100 % = 1; 85–<95 % = 0.75; 75–<85 % = 0.5; 50–<75 % = 0.25; 0–<50 % = 0. |
| 17–19 | `p17_personal_ingles`, `p18_experiencia_extranjero`, `p19_disponibilidad_viajar` | Cada pregunta: Sí = 1; No = 0. |
| 21–23 | `p21_utiliza_software`, `p22_reaccion_urgente`, `p23_separa_basura` | Cada pregunta: Sí = 1; No = 0. |
| 24 | `p24_responsable_ambiental`, `p24_nombre_responsable` | Sí y nombre no vacío después de quitar espacios exteriores = 1; No o Sí sin nombre = 0. |
| 25 | `p25_responsable_calidad`, `p25_nombre_responsable` | Misma regla que P24. |
| 26–31 | `p26_pruebas_calidad`, `p27_documentan_pruebas`, `p28_auditorias_proveedores`, `p29_exige_certificados`, `p30_estandares`, `p31_reclamos_servicios` | Cada pregunta: Sí = 1; No = 0. |
| 32–39 | Ocho campos `p32_puntuacion_confidencialidad_empleados` a `p39_puntuacion_firewall`, identificados individualmente en el esquema | Sumar cada respuesta, máximo 10 por reactivo. La captura ofrece 0, 4, 6, 8 y 10; ver sección 10 para datos históricos distintos. |

P16 se captura de 0 a 100; los umbrales 0.95, 0.85, 0.75 y 0.5 del CSV equivalen a 95, 85, 75 y 50 %. Un valor recibido de `0.95` significa 0.95 %, no 95 %; no autodetectar otra escala.

Los detalles de P11, P12, P13 y P21 se requieren durante la captura, pero el CSV no condiciona sus puntos a esos textos. No agregar penalizaciones por su ausencia. Un archivo o nombre residual bajo una respuesta No no otorga puntos.

### 5.3 Clasificación por bloque

Aplicar los límites confirmados a cada porcentaje por separado. Cada bloque tiene su propia clasificación; no asignar una clasificación global al registro ni usar un bloque para modificar la clasificación del otro.

| Clasificación | Porcentaje exacto |
| --- | --- |
| C | 0 % ≤ porcentaje ≤ 60 % |
| B | 60 % < porcentaje ≤ 75 % |
| AB | 75 % < porcentaje ≤ 90 % |
| A | 90 % < porcentaje ≤ 100 % |

El solicitante confirmó que exactamente 60 % es C, 75 % es B y 90 % es AB. Clasificar antes de redondear. Mostrar dos decimales de porcentaje y conservar cuartos de punto en las puntuaciones. Si el redondeo visual coincide con un límite, aclarar que la clase utiliza el porcentaje sin redondear.

### 5.4 Datos incompletos e inválidos — propuesta para revisión

- Aceptar números y cadenas numéricas completas no vacías; rechazar texto parcial, infinitos, booleanos, objetos y valores fuera de rango. No convertir vacío en cero ni ajustar valores a los límites.
- En Sí/No, normalizar espacios exteriores, mayúsculas y acento de Sí; rechazar otros valores. No inferir Sí por mera presencia de un campo.
- Una respuesta principal puntuable ausente o inválida impide una calificación completa únicamente en el bloque al que pertenece. El otro bloque conserva su resultado y clasificación si está completo y es válido. En el bloque afectado, mostrar **Sin clasificación — Datos incompletos** o **Sin clasificación — Datos inválidos**, con preguntas y causas. Si concurren ambos problemas, detallar ambos.
- Mostrar **Evaluación general — Puntos parciales: X / 26** o **Seguridad de la Información — Puntos parciales: Y / 80**, según el bloque afectado, indicando sus reactivos pendientes; no mostrar porcentaje final ni asignar C por defecto a ese bloque. No reducir los denominadores. Si ambos bloques tienen incidencias, mostrar el estado y las causas de cada uno por separado.
- Excepciones del CSV: P9/P10 con Sí sin evidencia y P24/P25 con Sí sin nombre valen cero, explicando la condición incumplida; no quedan indeterminadas por esa ausencia.
- P5 sin plan es válida si existe certificación seleccionada. Sin certificación ni declaración explícita Ninguno, requiere revisión. Ninguno junto con una certificación es contradictorio y deja Evaluación general sin clasificación. Una certificación seleccionada prevalece sobre un plan residual, que debería estar inactivo.
- Evidencia reconocible propuesta: URL HTTPS sin credenciales, individual o lista con al menos una URL válida, en el campo correspondiente. No descargar documentos para puntuar. Un nombre de archivo u objeto desconocido no acredita por sí solo un adjunto: marcar evidencia no interpretable y dejar el reactivo pendiente, distinguiéndolo de una ausencia que vale cero.
- Recalcular Seguridad desde sus ocho respuestas. Un subtotal reportado ausente o discrepante no impide clasificar si las respuestas son válidas; mostrar discrepancias. Nunca usar el subtotal como sustituto de respuestas faltantes.
- Los campos informativos ausentes no impiden clasificar salvo cuando sean necesarios para resolver una regla, como certificaciones para P5.

### 5.5 Interfaz del submission viewer

| ID | Situación | Resultado requerido |
| --- | --- | --- |
| RF-01 | Carga o actualización de Servicios | Calcular ambos bloques de cada registro desde sus respuestas, de forma independiente. |
| RF-02 | Registro completo en la lista | Mostrar empresa/contacto, fecha y dos secciones identificadas: **Evaluación general** (X/26, porcentaje y clasificación textual) y **Seguridad de la Información** (Y/80, porcentaje y clasificación textual). No mostrar una columna de calificación global. |
| RF-03 | Apertura del detalle | Resumen con las mismas dos secciones de la lista, cada una con sus puntos/máximo, porcentaje y clasificación; seguridad siempre recalculada. Agrupar por bloque el desglose de los 34 reactivos: número, etiqueta, puntos/máximo y razón del resultado. Conservar respuestas originales y evidencias. |
| RF-04 | Registro incompleto o inválido | Estado de 5.4, puntos parciales y causas en el bloque afectado; conservar el resultado del otro bloque si es evaluable y continuar procesando los otros registros. |
| RF-05 | Subtotal recibido discrepante | Conservar el reportado identificado como tal y advertir la diferencia; calcular desde las respuestas. |
| RF-06 | Móvil, escritorio y teclado | Texto legible sin depender solo del color; conservar detalle desplegable accesible, sin desbordamiento horizontal. |
| RF-07 | Carga, vacío, error o reintento | Conservar estados actuales; un fallo de consulta no produce calificación cero. |
| RF-08 | Otros visores | Conservar subtotal reportado, presentación y funcionamiento actuales. |

Ejemplos de desglose: «P9: 0/1 — Sí, sin evidencia adjunta» y «P16: 0.75/1 — Satisfacción de 90 %». Identificar la versión como **Servicios — Spec 005**, distinta de la revisión del formulario. Conservar orden cronológico; no agregar ordenamiento por calificación.

## 6. Datos e integraciones

La fuente sigue siendo `submissions` de la consulta de solo lectura de Formspree configurada en el visor de Servicios. No se requieren campos persistidos nuevos ni migraciones. Puntos, porcentaje, clasificación, estado y desglose de cada bloque se derivan en memoria; no confiar en campos de calificación enviados por el proveedor.

Aplicar las mismas reglas a registros históricos evaluables. Conservar datos originales, incluidos campos desconocidos, sin mutar el registro. La lógica debe ser independiente del DOM, recibir un registro y devolver dos resultados independientes (general y seguridad), cada uno con sus incidencias. Activar el cálculo por configuración del visor, no por coincidencias en campos enviados por el proveedor. Conservar el manejo seguro de texto y enlaces.

## 7. Criterios de aceptación

| ID | Requisito | Comprobación verificable |
| --- | --- | --- |
| CA-01 | RF-01 | 34 reactivos separados: 26 generales con máximo 26 y 8 de Seguridad con máximo 80; P1–4 y P20 no se suman por separado. Ningún cálculo utiliza 106 como denominador. |
| CA-02 | RF-01/02 | Máximos completos: general 26/26 y seguridad 80/80, ambos 100.00 %, A. Mínimos completos: general 0/26 y seguridad 0/80, ambos 0.00 %, C. General 26/26 con seguridad 0/80 conserva A en general y C en seguridad; el caso inverso conserva C en general y A en seguridad. |
| CA-03 | RF-01/02 | General: 15.5/26 → 59.62 %, C; 15.75/26 → 60.58 %, B; 19.5/26 → 75.00 %, B; 19.75/26 → 75.96 %, AB; 23.25/26 → 89.42 %, AB; 23.5/26 → 90.38 %, A. Seguridad: 48/80 → 60.00 %, C; 50/80 → 62.50 %, B; 60/80 → 75.00 %, B; 62/80 → 77.50 %, AB; 72/80 → 90.00 %, AB; 74/80 → 92.50 %, A. |
| CA-04 | RF-01 | Probar clasificador de ambos bloques en 60, 75 y 90 %, inmediatamente por debajo y encima; redondear no cambia la clase. Verificar directamente los límites en el clasificador, además de los casos alcanzables con los puntos de cada bloque. |
| CA-05 | RF-01/03 | P5 concede un solo punto por certificación o plan afirmativo; Ninguno + No = 0; plan inactivo no penaliza al certificado. |
| CA-06 | RF-01 | P7/P8: 0, 1.9, 2, 5, 5.5, 6, 20 y 20.1 según D-01. P16: 0, 49.9, 50, 74.9, 75, 84.9, 85, 94.9, 95 y 100. |
| CA-07 | RF-01/03 | P9/P10: Sí con evidencia = 1; Sí sin evidencia = 0; No con archivo residual = 0. P24/P25: Sí con nombre = 1; Sí con espacios = 0; No con nombre residual = 0. |
| CA-08 | RF-04 | Vacíos, ausentes, negativos, satisfacción >100, seguridad inválida y contradicciones producen estados y causas de 5.4, sin clase engañosa ni fallo global. Un faltante general no impide clasificar Seguridad válida y completa; un faltante en Seguridad no impide clasificar Evaluación general válida y completa. |
| CA-09 | RF-05 | Alterar/eliminar subtotal reportado no modifica cálculo con respuestas válidas. Una respuesta de seguridad ausente no se suple con subtotal 80. |
| CA-10 | RF-02/03/06 | Lista y detalle muestran ambos bloques con sus puntos/máximo, porcentajes, clasificaciones o estados parciales y razones en escritorio y móvil, con teclado y texto seguro; respuestas y evidencias siguen disponibles. |
| CA-11 | RF-07/08 | Carga, vacío, errores y recuperación funcionan; los otros visores no muestran nuevas calificaciones. No hay escrituras externas. |

## 8. Plan de validación de la futura implementación

1. Preparar fixtures sintéticos de Servicios con mínimos, máximos, clases intermedias, evidencias, incompletos e inválidos por bloque. Incluir bloques con resultados opuestos y un bloque completo junto a otro incompleto para verificar su independencia. No guardar respuestas personales reales como fixtures.
2. Añadir pruebas unitarias de cálculo y límites; establecer el comando reproducible al crear el módulo. Contrastar la matriz con el CSV para detectar omisiones o doble conteo.
3. Ampliar [tests/verify_viewers.cjs](../../tests/verify_viewers.cjs) y ejecutar `node tests/verify_viewers.cjs` con Formspree interceptado. Verificar los cuatro visores, detalle, actualización, seguridad de texto, escritorio y móvil.
4. Ejecutar `python tests/verify_forms.py` como regresión estructural y `git diff --check`.
5. Revisar capturas y documentar resultados en `docs/reports/AAAA-MM-DD-validacion-spec-005.md` después de validar.

No regenerar esquemas si los campos no cambian. No se programan consultas LIVE, envíos ni escrituras externas en esta iteración documental. Estos comandos son trabajo futuro, no pruebas ya ejecutadas.

## 9. Documentación y rutas afectadas

**Esta iteración:** únicamente `docs/specs/005-calculo-evaluacion-servicios.md`.

**Futura implementación:** visor de Servicios, módulo de cálculo propuesto, recursos compartidos necesarios y pruebas. Actualizar `submissions_viewer/README.md`, `docs/specs/README.md`, `docs/TRACKING.md` y, cuando corresponda, `docs/PROJECT_OVERVIEW.md`, `docs/INSPECTION_MODEL.md` y `docs/FORM_LOGIC_MATRIX.md`. Documentar la excepción de Servicios al comportamiento actual sin calificación y crear informe de validación al finalizar.

El registro y seguimiento todavía describen la 005 como pendiente de definición; sincronizarlos en la siguiente iteración. Esta entrega se limita al archivo solicitado.

## 10. Decisiones abiertas y riesgos

Las propuestas siguientes completan vacíos del CSV y requieren revisión antes de declarar la Spec lista para implementar. No son cambios aprobados.

| ID | Tema y propuesta | Decisión necesaria | Responsable | ¿Bloquea implementación? |
| --- | --- | --- | --- | --- |
| D-01 | P7/P8 admiten decimales; CSV omite valores entre 5 y 6. Propuesta: 0 ≤ años <2 → 0; 2 ≤ años <6 → 0.25; 6 ≤ años ≤20 → 0.75; años >20 → 1. Así, 5.5 = 0.25 y 20.1 = 1. | Confirmar intervalos continuos sin cambiar captura. | Solicitante | Sí, para años decimales. |
| D-02 | CSV dice seguridad «Del 0 al 10»; captura ofrece 0, 4, 6, 8, 10. Propuesta: aceptar solo estas cinco opciones, también históricas. | Confirmar si valores históricos intermedios son inválidos o se admiten. | Solicitante | Sí, para seguridad histórica. |
| D-03 | Incompletos e inválidos: puntos parciales sin clasificación solo en el bloque afectado, con excepciones expresas de evidencia/nombre de 5.4. | Confirmar tratamiento de faltantes y contradicciones. | Solicitante | Sí, para registros incompletos. |
| D-04 | P5 no exige en el CSV revisar vigencia o anexos. Propuesta: basta declaración de certificación o plan; no descontar por vencimiento ni fecha/archivo ausente. | Confirmar que se puntúa la declaración, sin auditar certificación. | Solicitante | Sí, para P5. |
| D-05 | Evidencias P9/P10: URL HTTPS individual o lista; código actual no demuestra todos los formatos de archivos de Servicios. | Confirmar contrato con fixture anonimizado disponible o documentación al implementar; adaptar estructuras conocidas sin confundir texto con archivo. | Implementación | Sí, antes de cerrar pruebas de evidencias. |

Se conservan los puntos por pregunta y los límites de clasificación. La evaluación queda separada en dos bloques con denominadores 26 y 80, sin ponderación conjunta ni calificación global. El resultado debe ser reproducible desde los datos recibidos; cambios futuros de reglas requerirán nueva versión documentada.

## 11. Cierre de la iteración documental

**Estado final:** Borrador preparado para revisión.

**Verificación documental:** CSV, campos de captura, esquema y funcionamiento actual del visor revisados; recuento del CSV: 39 preguntas, 34 puntuables, máximos independientes de 26 puntos generales y 80 de Seguridad. Revisión documental del 2026-11-02: fórmulas, interfaz y criterios de aceptación alineados con los dos bloques.

**Validación funcional:** No aplica todavía; no se ha implementado ni ejecutado el cálculo.

**Pendientes:** Resolver D-01 a D-04 con el solicitante; verificar D-05 al implementar; autorizar inicio de la siguiente iteración.

## 12. Historial de decisiones

| Fecha | Decisión | Motivo y responsable |
| --- | --- | --- |
| 2026-10-30 | Sustituir plantilla por borrador exclusivo de Servicios. | Solicitud del usuario: trabajar primero solo en la Spec. |
| 2026-10-30 | Conservar máximo 106 y ponderación 80/106 de seguridad. **Sustituida por la decisión del 2026-11-02.** | Confirmación inicial del solicitante. |
| 2026-10-30 | C ≤60 %; B >60–75 %; AB >75–90 %; A >90–100 %. | Confirmación explícita: 75 % pertenece a B y 90 % a AB. |
| 2026-11-02 | Separar Evaluación general (puntos/26) y Seguridad de la Información (puntos/80), mostrando ambos resultados en lista y detalle, con porcentaje y clasificación por bloque. Conservar puntos por pregunta y eliminar el cálculo combinado. | Solicitud del usuario para evitar que Seguridad tenga más peso sobre las demás preguntas. Solo modificar esta Spec; no iniciar implementación. |

[Registro de specs](README.md) · [Índice documental](../README.md)
