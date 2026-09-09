# Spec 002 — Certificaciones, agradecimiento y Maquinados

**Estado:** Implementada y verificada
**Fecha:** 2026-09-09

## Alcance y aceptación

1. Los tres formularios usan una copia personalizada de `assets/templetes/form_v2/thanks` en su carpeta `thanks/`. El envío AJAX redirige sólo después de una respuesta HTTP satisfactoria. Los errores conservan las respuestas y permiten reintentar.
2. La pregunta 6 añade `p06_ninguno`, excluyente con las certificaciones. Seleccionarlo limpia y deshabilita sus vigencias y detalles; seleccionar un certificado desmarca Ninguno.
3. Fabricantes conserva su plan ISO 9001 existente. Maquinados añade `p08_planea_certificarse` cuando no hay ISO 9001; Distribuidores añade `p07_planea_certificarse` cuando no hay certificaciones. Sólo Sí habilita y exige la fecha existente; No u ocultar el plan la limpia y deshabilita.
4. Maquinados convierte Tipo en select obligatorio para CNC y Corte. CNC ofrece Fresadora CNC, Centros de maquinado CNC en diferentes dimensiones de mesa, Mandriladora CNC en diferentes dimensiones de mesa y Torno CNC en diferentes tamaños. Según la corrección del solicitante, Corte ofrece Pantógrafo, Láser, Plasma, Chorro de agua y Oxígeno, en ese orden. Se conservan `p04_cnc_NN_tipo` y `p04_corte_NN_tipo`, incluida su reindexación. No aplica limpia y deshabilita también los selects.
5. Pregunta 43: «Durante el año pasado»; `anio_referencia_accidentes` conserva el año calendario anterior calculado.
6. Seguridad de la Información en Maquinados usa los mismos ocho reactivos y opciones descriptivas de Fabricantes. Su numeración existente 47–54 ya sigue a 46, por lo que se conserva junto con los nombres técnicos. Subtotal 0–80, valores permitidos 0, 4, 6, 8 y 10.
7. Actualizar el harness para páginas de agradecimiento, contratos de campos y comportamiento condicional. No realizar envíos reales durante las pruebas.

## Compatibilidad

No se renombra ningún campo existente. Los nuevos campos son aditivos. Se conservan los endpoints encontrados en el código (los tres están configurados), sin crear ni reutilizar destinos.

La plantilla referencia un logotipo local inexistente: sus copias usan la marca textual FFT México, como los formularios actuales. La plantilla fuente permanece intacta.

## Verificación

Ver `docs/VALIDATION_2026-09-09.md` para los comandos reproducibles, resultados y límites de las pruebas. El informe de auditoría de agosto permanece como registro histórico.
