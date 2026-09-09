# Spec 003 — Servicios y Seguridad de la Información en Distribuidores

**Estado:** Implementada y verificada
**Fecha:** 2026-09-09

## Fuente y alcance

Digitalizar `forms/08015p21_autoevaluacion_servicios/08015p21_evaluacion_servicios.pdf`, documento 08015p21, revisión 5, fecha 03.06.2026. Se revisaron sus cinco páginas visualmente y por extracción de texto. Conservar las preguntas 1–39. El PDF numera sus últimas páginas como «4 de 3» y «5 de 3»; la web usa pasos, sin reproducir ese error.

Añadir a Distribuidores los ocho reactivos de Seguridad de la Información de Fabricantes, como preguntas 43–50 después de Envío. Los campos existentes 1–42 no cambian. Los nuevos nombres siguen `p43_puntuacion_confidencialidad_empleados` hasta `p50_puntuacion_firewall`, con los mismos sufijos conceptuales de Fabricantes.

## Criterios de aceptación

1. Servicios aparece como cuarto formulario del catálogo y reutiliza la presentación y navegación de los formularios actuales. Pasos: Empresa, General (1–6), Experiencia (7–10), Personal (11–20), Tecnología (21–22), Medio ambiente (23–24), Calidad (25–30), Envío (31) y Seguridad de la Información (32–39).
2. Captura los datos comunes de empresa y `empresa_puesto`, solicitado por el PDF. `empresa_contacto` identifica a quien completa el cuestionario; la dirección se añade por el modelo común.
3. Servicios 3 permite las diez opciones del PDF; Otros requiere descripción. Servicios 4 incluye ISO 9001, VDA 6.4, ISO 45001, ISO 14001, TISAX y Otros; añade Ninguno excluyente. Cada certificado seleccionado requiere vigencia y archivo, y Otros requiere nombre. Los nombres usan `p04_`, conservando la numeración fuente.
4. Servicios 5 pregunta primero si planea certificarse cuando no hay certificados seleccionados. Sólo Sí activa y requiere `p05_fecha_certificacion`; No o seleccionar un certificado limpia y deshabilita el plan inactivo.
5. Servicios 9 y 10 requieren organigrama y referencias sólo bajo Sí. Las preguntas 11, 12, 13, 21, 24 y 25 requieren detalle sólo bajo Sí. Todos los campos dependientes se limpian, deshabilitan y excluyen del envío al desactivar la condición.
6. Servicios 20 permite seleccionar uno o varios métodos de registro de horas, conforme a las casillas del PDF. Servicios 21 conserva su intención y sus opciones Sí/No mediante «¿Trabaja con software para prestar sus servicios?» y pide indicar cuál bajo Sí (el PDF combina «¿Con cuál software trabaja?» con Sí/No).
7. Seguridad en ambos formularios replica los ocho textos, la escala descriptiva y su nota de Fabricantes: 0, 4, 6, 8, 10; respuestas obligatorias sin valor preseleccionado; subtotal automático 0–80 incluido en `subtotal_seguridad_informacion` y recalculado al enviar.
8. Validación por paso y completa antes de enviar, bloqueo de duplicados, errores accesibles que conservan captura y agradecimiento basado en `form_v2/thanks` sólo tras respuesta exitosa.
9. Servicios usa un endpoint exclusivo. Mientras no se proporcione, la captura y validación funcionan y el envío se bloquea localmente; no se reutiliza ningún endpoint existente. El correo del PDF se ofrece como contacto, sin envíos automáticos por correo. Se mantiene el criterio de formulario permanente de la matriz, sin imponer el plazo histórico de tres días.
10. Actualizar matriz, modelo, overview y harness para cuatro formularios. Verificar equivalencia de seguridad, anexos, condicionales, validación real de los dos formularios modificados, payload y envío simulado; revisar presentación en escritorio y móvil. No enviar datos reales a Formspree.

## Decisiones de implementación

Se reutiliza el comportamiento de Distribuidores para Servicios y un módulo de subtotal compartido entre ambos. Los formularios existentes de Fabricantes y Maquinados conservan sus implementaciones. La exclusión de Ninguno se configura para `p04_` en Servicios y mantiene `p06_` en los demás.

Las Specs 001 y 002 y los informes anteriores se mantienen como antecedentes; esta Spec amplía el catálogo a cuatro y Distribuidores a 50 preguntas.

El solicitante proporcionó `https://formspree.io/f/mbgjqzka` durante la implementación; Servicios queda configurado con ese destino. Se corrigieron los avisos obsoletos del catálogo y Distribuidores que aún decían endpoint pendiente.

La prueba sin CDN detectó que la clase `d-none` dependía de Bootstrap. Los estilos de Distribuidores, heredados por Servicios, añaden el respaldo de visibilidad, etiquetas, ancho de controles y mensajes de validación. Los otros dos formularios no se modifican en esta ampliación.

Resultados y comandos reproducibles: `docs/VALIDATION_SPEC003_2026-09-09.md`.
