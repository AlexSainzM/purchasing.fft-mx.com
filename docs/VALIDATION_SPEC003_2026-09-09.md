# Verificación de Spec 003 — 2026-09-09

## Resultado

Servicios implementa las 39 preguntas del PDF 08015p21 Rev. 5 (03.06.2026), con anexos y condiciones. Distribuidores conserva todos los nombres existentes y añade Seguridad de la Información como 43–50. El catálogo contiene cuatro formularios. El endpoint de Servicios fue proporcionado por el solicitante y está configurado como `https://formspree.io/f/mbgjqzka`.

## Comandos reproducibles

```powershell
python tests/verify_forms.py
$env:PLAYWRIGHT_CHANNEL = 'msedge'
node tests/verify_forms_browser.cjs
# Repetir con Bootstrap habilitado:
$env:FORM_QA_CDN = '1'
$env:FORM_QA_DIR = 'tmp/forms-qa-cdn'
node tests/verify_forms_browser.cjs
```

Se requiere Python y Playwright resoluble por Node, con Chromium o Edge instalado. En Codex se usaron los paquetes del runtime mediante `NODE_PATH`, sin instalar dependencias en el proyecto. Para usar Chromium de Playwright omitir `PLAYWRIGHT_CHANNEL`. Las capturas temporales se guardan en `tmp/forms-qa` por defecto o en `FORM_QA_DIR`.

## Cobertura y evidencias

- 14 pruebas estáticas aprobadas: catálogo de cuatro enlaces, metadatos, nombres/IDs, preguntas, recursos, archivos de agradecimiento, endpoints exclusivos y sintaxis JavaScript, incluidos módulos compartidos.
- Equivalencia exacta de textos y opciones de los ocho reactivos de Seguridad con Fabricantes, para Maquinados, Distribuidores y Servicios.
- Servicios: orden 1–39, diez servicios del PDF, seis tipos de certificado con vigencia/archivo inicialmente deshabilitados y puesto de quien completa el cuestionario.
- Navegador Edge: los cuatro formularios aprobaron tanto con CDN bloqueado como con Bootstrap habilitado; ningún error JavaScript.
- Distribuidores y Servicios se recorrieron completamente con los botones reales y la validación real. Contacto vacío y correo inválido bloquean avance; seguridad sin responder bloquea envío; quitar un dato inicial desde el último paso devuelve a la sección inválida.
- Servicios: los seis certificados requieren archivos al seleccionarse; Ninguno los limpia y deshabilita. Se comprobaron Otros, plan Sí/No, organigrama, referencias y detalles 11–13, 21, 24–25, incluida exclusión del `FormData` al responder No.
- Escala de seguridad: rechaza un valor 7 aun si se introduce una opción artificial. Valores 0, 4, 6, 8, 10, 0, 4, 6 producen subtotal 38; el envío recalcula un subtotal alterado de 999 y transmite 38 junto con los ocho nombres de respuesta.
- Se inspeccionó el multipart enviado a la ruta simulada: incluye respuestas y metadatos, excluye fechas y archivos deshabilitados. Dos eventos simultáneos de envío generan una sola solicitud y deshabilitan Enviar mientras está en curso.
- HTTP 422 y error de red simulados conservan la captura; una respuesta 200 simulada abre el agradecimiento propio. Se comprobó el año dinámico y el ancho móvil de las páginas de agradecimiento.
- Revisión visual de las cinco páginas del PDF y de los formularios en escritorio y móvil (390 px), con y sin CDN. Se ajustaron visibilidad sin Bootstrap, ancho de controles, texto del número de secciones y contraste del pie. No hay desplazamiento horizontal en los pasos comprobados ni en agradecimiento móvil.
- Comparación con HEAD: ningún nombre existente de Distribuidores, incluidos los definidos por `data-yes-no` y `data-detail`, fue eliminado.

## Límites

No se realizaron envíos reales a Formspree: todas sus solicitudes fueron interceptadas. La recepción efectiva de correo/archivos, cuotas y configuración del servicio externo no forman parte de esta prueba. La validación completa nueva cubre Servicios y Distribuidores; los escenarios heredados de Fabricantes y Maquinados siguen aislando el manejador de envío de sus preguntas ajenas a este cambio.

Los PNG y el script usados para preparar la implementación son temporales y se retiraron tras la revisión. Las Specs e informes anteriores se conservan como antecedentes históricos.
