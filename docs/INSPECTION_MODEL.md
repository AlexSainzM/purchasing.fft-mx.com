# Modelo común de autoevaluación

**Versión:** 1.0
**Fecha:** 2026-08-26

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

Si el endpoint está pendiente, el formulario debe detenerse localmente con un mensaje de configuración. No se debe reutilizar el endpoint de otro formulario.

## 6. Seguridad de la Información

Cuando una autoevaluación contiene esta sección, las respuestas permitidas son `0`, `4`, `6`, `8` y `10`. El subtotal se calcula en el navegador y también se incluye como campo del envío. Fabricantes y Maquinados tienen ocho reactivos y un máximo de 80 puntos.
