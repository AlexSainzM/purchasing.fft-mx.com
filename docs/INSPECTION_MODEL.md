# Modelo común de autoevaluación

**Versión:** 1.2
**Fecha:** 2026-09-09

## 1. Entidad principal

Cada envío representa una autoevaluación de una empresa proveedora y debe incluir:

* `formulario_nombre`;
* `documento_referencia`;
* `documento_revision`;
* `fecha_envio` en formato ISO 8601;
* `empresa_nombre`;
* `empresa_contacto`;
* `empresa_direccion`;
* `empresa_telefono`;
* `empresa_email`;
* las respuestas propias del formulario.

Los nombres técnicos de preguntas usan `pNN_descripcion_corta`, sin acentos y en `snake_case`. Los grupos de opciones comparten el mismo `name`. Cada `id` debe ser único en el documento.

## 2. Estados de respuesta

Una pregunta puede estar en uno de estos estados:

* **activa y requerida:** visible, habilitada y obligatoria;
* **activa y opcional:** visible y habilitada;
* **inactiva:** oculta, deshabilitada, no requerida y sin valor residual;
* **no aplica:** respuesta explícita permitida sólo cuando el PDF fuente la contempla o la matriz lo justifica.

Una pregunta condicional nunca debe enviarse si su condición no está activa. Al desactivar una condición, sus campos dependientes se limpian.

En certificaciones, `p06_ninguno` es una respuesta explícita y excluyente con los certificados; no requiere vigencia. El plan de certificación solicita primero Sí/No y sólo requiere la fecha cuando se responde Sí. Se conservan los nombres de las fechas existentes; se añaden `p08_planea_certificarse` en Maquinados y `p07_planea_certificarse` en Distribuidores. Fabricantes conserva `p07_planea_certificarse_iso9001`.

Servicios conserva la numeración de su PDF: certificaciones `p04_*`, opción `p04_ninguno`, plan `p05_planea_certificarse` y fecha `p05_fecha_certificacion`. Cada certificado seleccionado exige vigencia y archivo; Otros exige además nombre. La persona que completa Servicios se registra en `empresa_contacto` y su puesto en `empresa_puesto`.

## 3. Archivos de evidencia

Las evidencias aceptan documentos e imágenes de trabajo (`pdf`, `doc`, `docx`, `xls`, `xlsx`, `jpg`, `jpeg`, `png`). Cuando el documento oficial dice “favor de anexar”, la evidencia es requerida únicamente si la respuesta que la origina es afirmativa, salvo que la matriz indique que el anexo es obligatorio para todo envío.

## 4. Validación y navegación

* Sólo una sección del formulario está visible a la vez.
* “Siguiente” valida exclusivamente la sección activa.
* “Enviar” valida todas las secciones y lleva al usuario a la primera sección inválida.
* Los controles ocultos o deshabilitados no bloquean la navegación ni se incluyen en el envío.
* Los porcentajes aceptan valores entre 0 y 100.
* Las cantidades e índices no aceptan valores negativos.
* Los correos usan validación de formato del navegador.

## 5. Envío

Cada formulario usa su propio endpoint de Formspree. El frontend envía `multipart/form-data` con `Accept: application/json`, impide envíos duplicados mientras una solicitud está activa y muestra estados de éxito o error en una región accesible.

Tras confirmar `response.ok`, redirige mediante JavaScript a `thanks/index.html` relativo al formulario. No se usa `_next` porque los envíos actuales son AJAX. Los errores HTTP y de red mantienen las respuestas para reintentar. El agradecimiento muestra un encabezado de confirmación y un enlace al catálogo.

Si el endpoint está pendiente, el formulario debe detenerse localmente con un mensaje de configuración. No se debe reutilizar el endpoint de otro formulario.

## 6. Seguridad de la Información

Los cuatro formularios contienen ocho reactivos de Seguridad de la Información. Las respuestas permitidas son `0`, `4`, `6`, `8` y `10`, sin preselección. El subtotal se calcula en el navegador y se incluye como `subtotal_seguridad_informacion`, con máximo de 80 puntos. La numeración es 55–62 en Fabricantes, 47–54 en Maquinados, 43–50 en Distribuidores y 32–39 en Servicios. Los dos últimos se incorporan según Spec 003 y recalculan el subtotal antes de construir el payload, aunque el campo visible haya sido alterado.
