# Verificación — 2026-09-09

Alcance: Spec 002, certificaciones, agradecimiento y Maquinados.

## Comandos

Desde la raíz del repositorio:

```powershell
python tests/verify_forms.py
node tests/verify_forms_browser.cjs
```

La prueba de navegador requiere Playwright resoluble por Node y un Chromium instalado. Para usar Edge instalado, definir `$env:PLAYWRIGHT_CHANNEL = 'msedge'`. En el runtime de Codex se configuró `NODE_PATH` al directorio de paquetes provisto por `load_workspace_dependencies`; no se agregaron dependencias al proyecto.

## Resultados

- Harness estático: 13 pruebas aprobadas, incluidos recursos locales de los agradecimientos, ausencia de placeholders, nombres/IDs, cobertura de preguntas, endpoints separados y equivalencia de los ocho reactivos y opciones de Seguridad de la Información.
- Edge sin interfaz: los tres formularios aprobaron las transiciones de plan Sí/No, limpieza al seleccionar ISO 9001, exclusión Ninguno/certificado y limpieza de vigencia.
- Maquinados: selects obligatorios CNC/Corte, limpieza y deshabilitación con No aplica, creación y reindexación de filas, texto de pregunta 43 y año de referencia calculado.
- Fabricantes y Maquinados: ocho respuestas con 10 producen subtotal 80.
- Los tres formularios conservaron la captura ante HTTP 422 y error de red simulados; respuesta 200 simulada redirigió al agradecimiento propio y actualizó el año del pie.
- Las pruebas de navegador bloquearon recursos CDN para cubrir el respaldo sin Bootstrap. No hubo errores JavaScript.

## Límites y decisiones

No se enviaron respuestas reales: Formspree se intercepta en la prueba. El ensayo de envío aísla la validación de preguntas ajenas al cambio para ejercitar los manejadores reales de envío; no representa una autoevaluación completa contestada manualmente.

Los endpoints ya estaban configurados antes de estos cambios. Se corrigieron las expectativas obsoletas del harness y la documentación sin modificar esos destinos. Tras la aclaración del solicitante, Corte ofrece Pantógrafo, Láser, Plasma, Chorro de agua y Oxígeno. La prueba de navegador verifica las opciones y sus valores exactos; CNC conserva su catálogo original.
