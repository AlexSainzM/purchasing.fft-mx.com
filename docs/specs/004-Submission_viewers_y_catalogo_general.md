# ITERACIÓN — Submission Viewers + Catálogo General

## ===== CONTEXTO GENERAL =====

Este proyecto es un prototipo funcional para formularios de evaluación de proveedores.

Debe mantenerse 100% Frontend.

Formspree funciona como backend para:
- recepción de formularios;
- almacenamiento de submissions;
- consulta de registros mediante su API.

NO implementar:
- backend propio;
- bases de datos adicionales;
- servidores de aplicación;
- autenticación backend;
- APIs intermedias;
- Lambda;
- PHP;
- Django;
- Node como backend de producción.

Los archivos auxiliares de Node que ya existan pueden utilizarse únicamente para desarrollo, QA, validaciones o ejecución local si actualmente cumplen esa función.

La documentación del proyecto se encuentra en:

./docs

Antes de realizar cambios, revisa la documentación relevante del proyecto y la implementación existente.

También debes inspeccionar los formularios existentes en:

./forms

para entender la estructura real de los datos enviados a Formspree.

Actualmente existe un Submission Viewer funcional para el formulario de Fabricantes dentro de:

./submission_viewer/08015p22_autoevaluacion_fabricantes

Esta implementación debe considerarse la REFERENCIA FUNCIONAL Y VISUAL para los demás viewers.

No asumas nombres de campos, preguntas o estructura de submissions. Obtén esta información directamente de:
1. los formularios existentes;
2. la documentación de ./docs;
3. la implementación actual del viewer de Fabricantes;
4. respuestas reales de Formspree cuando sea necesario.

Se permite enviar submissions de prueba a los formularios si esto es necesario para validar la integración.

No modificar innecesariamente los formularios existentes.

---

## ===== FORMSPREE =====

### Maquinados
Endpoint:
https://formspree.io/f/myeygeqy

READ-ONLY API KEY:
67568c05d1b8f9d5046eb58cb4590208de1b82ca


### Fabricantes
Endpoint:
https://formspree.io/f/mvkppyry

READ-ONLY API KEY:
dcf6296a8f25b085beae26442f1d9c8a38d62ed8


### Distribuidores
Endpoint:
https://formspree.io/f/mzebpelz

READ-ONLY API KEY:
bf2828f6b5bd0edbb131550d2e6c4826118755e5


### Servicios
Endpoint:
https://formspree.io/f/mbgjqzka

READ-ONLY API KEY:
ee187c8af8a90a7b56d203b88cb96415ef9103dc

Estas credenciales corresponden al prototipo frontend actual.

No sustituir Formspree por otra arquitectura.

---

# ===== OBJETIVO DE LA ITERACIÓN =====

Actualmente existe únicamente el Submission Viewer correspondiente a:

08015p22_autoevaluacion_fabricantes

La iteración debe dejar disponible un sistema de consulta para los cuatro tipos de evaluación:

- Servicios
- Fabricantes
- Maquinados
- Distribuidores

Además, debe existir un catálogo general dentro de:

./submission_viewer/

desde el cual el usuario pueda entrar a cada uno de los cuatro viewers.

---

# ===== FASE 1 — ANÁLISIS PREVIO OBLIGATORIO =====

Antes de modificar código:

1. Lee la documentación relevante de:

   ./docs

2. Analiza:

   ./submission_viewer/08015p22_autoevaluacion_fabricantes

3. Identifica:
   - cómo se consulta actualmente Formspree;
   - cómo se transforma una submission;
   - cómo se construyen las filas de la tabla;
   - cómo funcionan filtros y búsqueda;
   - cómo se muestran los detalles;
   - cómo se manejan estados de carga;
   - cómo se manejan errores;
   - cómo se utilizan config.js, main.js, verify.js y demás archivos;
   - qué partes dependen todavía de response_example.json;
   - qué campos son compartidos entre formularios;
   - qué campos son específicos de cada evaluación.

4. Revisa los cuatro formularios existentes dentro de:

   ./forms

y determina la correspondencia correcta entre:

   formulario → endpoint → viewer

No cambies los nombres reales de las carpetas de formularios existentes.

5. Si existe alguna diferencia entre documentación y código, utiliza como fuente principal:
   - primero el comportamiento actual funcional;
   - después la documentación más reciente.

No comenzar creando archivos hasta haber entendido esta arquitectura.

---

# ===== FASE 2 — ACTUALIZAR VIEWER DE FABRICANTES =====

Trabajar primero sobre:

./submission_viewer/08015p22_autoevaluacion_fabricantes

El viewer actualmente existente debe seguir funcionando como referencia.

Sin embargo, deben eliminarse las dependencias y referencias iniciales al archivo de ejemplo:

response_example.json

El viewer debe consultar exclusivamente los submissions reales obtenidos desde Formspree durante su funcionamiento normal.

Esto incluye revisar y eliminar, cuando corresponda:

- imports;
- fetch;
- fallback automático;
- referencias en config;
- referencias en main.js;
- referencias en README;
- mensajes visibles;
- comentarios obsoletos;
- código de inicialización que dependa del ejemplo.

IMPORTANTE:

response_example.json puede mantenerse únicamente si tiene una finalidad explícita de documentación o QA.

Pero:

EL VIEWER DE PRODUCCIÓN/PROTOTIPO NO DEBE DEPENDER DE response_example.json PARA FUNCIONAR.

Si el archivo deja de tener utilidad, puede eliminarse.

No eliminar fixtures utilizados legítimamente por tests sin adaptar primero dichos tests.

---

# ===== FASE 3 — CREAR LOS VIEWERS RESTANTES =====

Crear Submission Viewers para:

1. Servicios
2. Maquinados
3. Distribuidores

dentro de:

./submission_viewer/

Utiliza nombres de carpetas consistentes con los formularios existentes.

No inventes nomenclaturas nuevas si ya existe una nomenclatura equivalente en ./forms.

Cada viewer debe utilizar como referencia visual y funcional:

./submission_viewer/08015p22_autoevaluacion_fabricantes

---

## Los cuatro viewers deben compartir

- misma identidad visual;
- misma estructura general;
- mismo encabezado;
- misma navegación;
- misma tipografía;
- mismos estilos de botones;
- mismo comportamiento responsive;
- misma estructura de tabla;
- mismos estados de loading;
- mismos estados de error;
- mismo patrón para visualizar detalles;
- mismo comportamiento general de filtros y búsqueda cuando sea aplicable.

No generar cuatro diseños diferentes.

El usuario debe percibirlos como partes del mismo sistema.

---

# ===== FASE 4 — ADAPTACIÓN DE DATOS =====

Aunque visualmente sean equivalentes, NO debes asumir que los cuatro formularios contienen exactamente las mismas preguntas.

Para cada formulario:

1. inspecciona su HTML/JS;
2. identifica los nombres enviados a Formspree;
3. determina cuáles deben mostrarse:
   - directamente en la tabla;
   - únicamente en el detalle;
   - como metadatos;
   - como resultados/subtotales si existen.

No mostrar nombres técnicos como:

p34_referencia_pregunta

como etiquetas principales para el usuario si existe una etiqueta legible equivalente.

Los nombres técnicos pueden seguir utilizándose internamente para identificar los campos.

La interfaz debe presentar textos comprensibles.

---

# ===== TABLA PRINCIPAL =====

Mantén el patrón establecido por el viewer de Fabricantes.

Cuando los datos estén disponibles, prioriza información que permita identificar rápidamente cada submission, por ejemplo:

- fecha;
- proveedor;
- empresa;
- contacto;
- correo;
- resultado;
- subtotal o calificación;
- acciones.

La selección exacta de columnas debe determinarse revisando los campos reales de cada formulario.

No inventar datos inexistentes.

No saturar la tabla con todas las respuestas.

Las respuestas detalladas deben permanecer dentro de la vista/modal/sección de detalle correspondiente.

---

# ===== MANEJO DE SUBMISSIONS =====

Todos los viewers deben:

- consultar Formspree utilizando su endpoint/configuración correspondiente;
- manejar correctamente respuestas vacías;
- manejar errores HTTP;
- manejar problemas de conexión;
- manejar submissions incompletos;
- evitar que un campo inexistente rompa el renderizado;
- escapar contenido proveniente de submissions antes de insertarlo como HTML;
- mostrar estados de loading claros.

No utilizar datos mock como fallback silencioso.

Si Formspree falla, mostrar un estado de error real.

---

# ===== CONFIGURACIÓN =====

Mantener las diferencias entre formularios lo más concentradas posible.

Evitar duplicar innecesariamente lógica si puede compartirse de manera segura.

Sin embargo:

NO realizar una refactorización masiva del proyecto si no es necesaria para completar esta iteración.

Prioridad:

1. funcionamiento;
2. consistencia;
3. mantenibilidad;
4. mínima regresión.

Si la arquitectura actual utiliza un config.js por viewer, conservar el patrón salvo que exista una razón clara y documentada para modificarlo.

Los endpoints y READ-ONLY API KEYS deben quedar correctamente asociados con cada viewer.

Nunca cruzar credenciales entre formularios.

---

# ===== FASE 5 — CATÁLOGO GENERAL =====

Crear:

./submission_viewer/index.html

Este archivo será la pantalla inicial del servicio de consulta de submissions.

Debe funcionar como catálogo para acceder a:

- Autoevaluación de Servicios
- Autoevaluación de Fabricantes
- Evaluación de Maquinados
- Evaluación de Distribuidores

El catálogo debe respetar la identidad visual existente del proyecto y particularmente del Submission Viewer actual.

No crear una página visualmente desconectada.

---

## Diseño esperado

Crear una interfaz limpia y profesional con:

- encabezado;
- título;
- descripción breve;
- tarjetas o bloques para cada formulario;
- nombre del formulario;
- código del formato cuando pueda obtenerse del proyecto;
- descripción breve;
- botón o CTA para "Ver registros".

Cada tarjeta debe dirigir al:

index.html

del Submission Viewer correspondiente mediante rutas relativas.

El catálogo debe funcionar correctamente tanto:
- servido localmente;
- como desplegado dentro del proyecto.

No utilizar rutas absolutas dependientes de localhost.

---

# ===== NAVEGACIÓN ENTRE VIEWERS =====

Agregar, si resulta consistente con el diseño actual, una forma clara de regresar desde cada Submission Viewer al catálogo general.

Por ejemplo:

← Volver al catálogo

Debe utilizar rutas relativas.

No debe romper el layout existente.

---

# ===== RESPONSIVE =====

Validar al menos:

- Desktop
- Tablet
- Mobile

En dispositivos pequeños:

- las tarjetas del catálogo deben reorganizarse correctamente;
- la navegación debe mantenerse utilizable;
- la tabla no debe destruir el layout;
- conservar el comportamiento responsive que ya utilice el viewer de Fabricantes.

---

# ===== PRUEBAS CON FORMSPREE =====

Se autoriza enviar registros de prueba cuando sea necesario.

Si necesitas hacerlo:

- usa datos claramente identificables como pruebas;
- evita generar grandes cantidades de submissions;
- no alteres submissions existentes;
- no elimines submissions reales;
- utiliza únicamente las credenciales proporcionadas.

Comprueba al menos una consulta real contra Formspree por cada viewer.

---

# ===== QA =====

Una vez terminada la implementación, validar:

## Catálogo

- abre correctamente;
- aparecen los cuatro formularios;
- cada tarjeta abre el viewer correcto;
- ninguna ruta genera 404;
- funciona mediante rutas relativas.

## Fabricantes

- ya no depende de response_example.json;
- obtiene submissions reales;
- mantiene el comportamiento existente;
- mantiene filtros/búsqueda/detalles existentes.

## Servicios

- utiliza su endpoint correcto;
- utiliza su READ-ONLY API KEY correcta;
- carga submissions reales;
- los campos corresponden a su formulario.

## Maquinados

- utiliza su endpoint correcto;
- utiliza su READ-ONLY API KEY correcta;
- carga submissions reales;
- los campos corresponden a su formulario.

## Distribuidores

- utiliza su endpoint correcto;
- utiliza su READ-ONLY API KEY correcta;
- carga submissions reales;
- los campos corresponden a su formulario.

## General

- no hay errores JavaScript en consola;
- no existen referencias rotas;
- no existen rutas absolutas innecesarias;
- no existen dependencias accidentales entre viewers;
- ningún viewer consulta el endpoint de otro formulario;
- estados vacíos funcionan;
- estados de error funcionan;
- loading funciona;
- layout responsive funciona.

---

# ===== TESTS EXISTENTES =====

Revisa también:

./tests

y cualquier herramienta de QA/validación existente.

Si las modificaciones hacen necesario actualizar tests existentes, hazlo.

No elimines validaciones únicamente para conseguir que los tests pasen.

Si existen scripts como:

verify.js
verify_forms.cjs
verify_forms_browser.cjs

úsalos cuando sean relevantes.

---

# ===== DOCUMENTACIÓN =====

Actualizar la documentación mínima necesaria para reflejar:

- existencia de los cuatro Submission Viewers;
- catálogo general;
- rutas;
- configuración Formspree;
- forma básica de ejecutar/probar localmente.

No reescribir documentación no relacionada.

---

# ===== RESTRICCIONES =====

NO:

- implementar backend;
- introducir frameworks nuevos sin necesidad;
- cambiar los endpoints de los formularios;
- modificar preguntas de los formularios;
- modificar lógica de cálculo de los formularios;
- renombrar carpetas existentes sin necesidad;
- rediseñar completamente la interfaz;
- utilizar mocks como fallback de producción;
- cruzar endpoints o API Keys;
- eliminar funcionalidad existente del viewer de Fabricantes;
- realizar refactors grandes fuera del alcance.

---

# ===== CRITERIOS DE ACEPTACIÓN =====

La tarea se considera terminada cuando:

1. Existen cuatro Submission Viewers funcionales.

2. Cada viewer consulta exclusivamente su formulario correspondiente en Formspree.

3. El viewer de Fabricantes ya no depende de response_example.json.

4. Los tres nuevos viewers conservan el mismo lenguaje visual y patrón de interacción del viewer de Fabricantes.

5. Existe:

   ./submission_viewer/index.html

   funcionando como catálogo principal.

6. Desde el catálogo se puede ingresar a cualquiera de los cuatro viewers.

7. Desde los viewers existe una navegación razonable hacia el catálogo.

8. Los datos mostrados corresponden a los campos reales de cada formulario.

9. Todos los viewers manejan:
   - loading;
   - error;
   - cero submissions;
   - submissions válidos.

10. No existen errores JavaScript relevantes en consola.

11. Todo continúa funcionando 100% en frontend.

12. Se verificó el funcionamiento mediante datos reales de Formspree.

---

# ===== FORMA DE TRABAJO =====

Procede de manera autónoma.

Primero inspecciona el proyecto y después implementa.

No me preguntes por información que pueda determinarse inspeccionando:

- ./docs
- ./forms
- ./submission_viewer
- ./tests

Si descubres una ambigüedad que realmente impida continuar y que no pueda resolverse a partir del repositorio, indícala.

Evita cambios fuera del alcance de esta iteración.

Al terminar, entrega un resumen indicando:

1. archivos creados;
2. archivos modificados;
3. arquitectura final de ./submission_viewer;
4. cómo se eliminó la dependencia de response_example.json;
5. cómo quedó configurado cada formulario;
6. pruebas realizadas;
7. resultados de las pruebas;
8. cualquier limitación o deuda técnica encontrada.

No te limites a describir cambios: realiza la implementación completa.