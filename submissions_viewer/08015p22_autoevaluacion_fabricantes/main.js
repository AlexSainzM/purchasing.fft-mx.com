'use strict';
const QUESTIONS = ['Personas que trabajan en la empresa','Número de sucursales','Giros de la empresa','Países de fabricación','Plazo de entrega promedio','Certificaciones','Plan de certificación ISO 9001','Disponibilidad para visita de evaluación','Antigüedad de la empresa','Experiencia en fabricación','Organigrama','Referencias comerciales','Capacitaciones frecuentes','Acceso a normas','Cursos de seguridad','Afiliación al IMSS','Equipo de seguridad','Satisfacción del personal (%)','Mantenimiento de maquinaria','Planos de mantenimiento','Reacción ante pedidos urgentes','Señaléticas y barreras','Manual de operación','Identificación de sustancias','Metas e indicadores de seguridad','Índice de accidentes laborales','Clasificación de residuos','Residuos generados (toneladas/año)','Registro ambiental','Programa ambiental','Seguro ambiental','Suministro de material peligroso','Materiales peligrosos','Responsable ambiental','Programa de reciclaje','Almacenamiento de materiales peligrosos','Productos biodegradables','Responsable de calidad','Instrucciones de trabajo','Pruebas de calidad','Documentación de pruebas','Sistema para evitar equivocaciones','Mantenimiento de instrumentos de medición','Mantenimiento documentado','Auditorías a proveedores','Proveedores certificados','Estándares de calidad','Rastreabilidad','Empaque correcto','Empaques ecológicos','Proceso de selección del transportista','Documentación de envío','Proceso de reclamos','Servicios de mantenimiento','Confidencialidad de empleados','Capacitación en seguridad de la información','Zonas de seguridad y acceso','Permisos sobre datos de clientes','Clasificación de la información','Copias de seguridad','Confidencialidad de proveedores','Firewall'];
const LABELS = {empresa_nombre:'Empresa',empresa_contacto:'Contacto',empresa_direccion:'Dirección',empresa_telefono:'Teléfono',empresa_email:'Correo electrónico',formulario_nombre:'Formulario',documento_referencia:'Documento',documento_revision:'Revisión',fecha_envio:'Fecha declarada de envío',_date:'Recepción en Formspree',subtotal_seguridad_informacion:'Subtotal reportado de seguridad de la información (máximo 80)'};
const GROUPS = [[0,'Datos de la empresa'],[8,'General'],[12,'Experiencia'],[18,'Personal'],[21,'Tecnología'],[26,'Seguridad'],[37,'Medio ambiente'],[48,'Calidad'],[54,'Envío'],[62,'Seguridad de la información'],[Infinity,'Datos del registro']];
const records = document.querySelector('#records');
const status = document.querySelector('#status');
const controls = [...document.querySelectorAll('button')];
function el(tag, text, className) { const node=document.createElement(tag); if(text!==undefined)node.textContent=text; if(className)node.className=className; return node; }
function dateValue(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T/.test(value))return null;
  const date=new Date(/(?:Z|[+-]\d{2}:\d{2})$/i.test(value)?value:value+'Z');
  return Number.isNaN(date.getTime())?null:date;
}
function dateLabel(row){const date=dateValue(row._date)||dateValue(row.fecha_envio);return date?new Intl.DateTimeFormat('es-MX',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Mexico_City'}).format(date):String(row.fecha_envio||row._date||'Fecha no disponible');}
function humanize(key){return key.replace(/^p\d+_/, '').replaceAll('_',' ').replace(/iso(\d+)/g,'ISO $1');}
function label(key){
  if(LABELS[key])return LABELS[key];
  const match=key.match(/^p(\d+)_/);if(!match)return humanize(key);
  const number=Number(match[1]);
  const extra=number===6||number===28||/_(?:archivos?|otro|nombre|fecha|numero_registro|indicador_seguridad|productos_biodegradables)/.test(key);
  return `${number}. ${QUESTIONS[number-1]||'Respuesta'}${extra?' · '+humanize(key):''}`;
}
function group(key){if(key.startsWith('empresa_'))return 0;const match=key.match(/^p(\d+)_/);if(key==='subtotal_seguridad_informacion')return 9;if(!match)return 10;return GROUPS.findIndex(([end])=>Number(match[1])<=end);}
function appendValue(parent,value){
  if(Array.isArray(value)){if(!value.length)parent.textContent='Sin respuesta recibida';else value.forEach(item=>{const line=el('div');appendValue(line,item);parent.append(line);});return;}
  if(value===null||value===undefined||value===''){parent.textContent='Sin respuesta recibida';return;}
  if(typeof value==='object'){parent.textContent=JSON.stringify(value,null,2);return;}
  const text=String(value);
  // Only explicit HTTPS evidence URLs become links. Submitted HTML is always text.
  if(text.startsWith('https://')){try{const url=new URL(text);if(url.protocol==='https:'&&!url.username&&!url.password){let name=url.pathname.split('/').pop()||url.hostname;try{name=decodeURIComponent(name);}catch{}const link=el('a','↗ '+name);link.href=url.href;link.target='_blank';link.rel='noopener noreferrer';parent.append(link);return;}}catch{}}
  parent.append(el('span',text,text==='Sí'?'answer-yes':text==='No'?'answer-no':undefined));
}
function render(rows){
  records.replaceChildren();document.querySelector('#count').textContent=rows.length;
  if(!rows.length){records.append(el('p','No hay registros recibidos.','empty'));return;}
  const sorted=[...rows].sort((a,b)=>(dateValue(b._date)||dateValue(b.fecha_envio)||0)-(dateValue(a._date)||dateValue(a.fecha_envio)||0));
  sorted.forEach(row=>{
    const detail=el('details',undefined,'record'),summary=el('summary');
    const company=el('span',undefined,'company-cell');company.append(el('span',row.empresa_nombre||'Empresa sin nombre','company'),el('span',row.empresa_contacto||'Contacto no recibido','contact'));
    const raw=row.subtotal_seguridad_informacion;const score=raw!==undefined&&raw!==null&&String(raw).trim()!==''&&Number.isFinite(Number(raw))&&Number(raw)>=0&&Number(raw)<=80?`${raw} / 80`:'Sin subtotal válido';
    const scoreNode=el('span',score,'score');scoreNode.append(el('small','Subtotal reportado'));
    const arrow=el('span','⌄','chevron');arrow.setAttribute('aria-hidden','true');summary.append(company,el('span',dateLabel(row),'date'),scoreNode,arrow);detail.append(summary);
    const body=el('div',undefined,'detail');
    GROUPS.forEach(([,title],index)=>{
      const entries=Object.entries(row).filter(([key])=>group(key)===index).sort(([a],[b])=>a.localeCompare(b,'es',{numeric:true}));if(!entries.length)return;
      const section=el('section'),list=el('dl',undefined,'fields');section.append(el('h3',title));
      entries.forEach(([key,value])=>{const field=el('div',undefined,'field');field.dataset.field=key;const term=el('dt',label(key)),answer=el('dd');appendValue(answer,value);field.append(term,answer);list.append(field);});section.append(list);body.append(section);
    });detail.append(body);records.append(detail);
  });
}
async function load(source){
  controls.forEach(button=>button.disabled=true);records.setAttribute('aria-busy','true');records.replaceChildren();document.querySelector('#count').textContent='—';status.className='';status.textContent=source==='example'?'Cargando datos de ejemplo…':'Consultando Formspree…';
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{
    const config=window.VIEWER_CONFIG||{};
    if(source!=='example'&&(!config.readOnlyKey||!config.formId))throw new Error('Falta configurar el Form ID o la clave de solo lectura. Puedes consultar el ejemplo.');
    const url=source==='example'?'response_example.json':`https://formspree.io/api/0/forms/${encodeURIComponent(config.formId)}/submissions`;
    const headers={Accept:'application/json'};if(source!=='example')headers.Authorization=`Bearer ${config.readOnlyKey}`;
    const response=await fetch(url,{method:'GET',headers,signal:controller.signal,cache:'no-store',credentials:'omit',redirect:'error'});
    if(!response.ok)throw new Error(response.status===401||response.status===403?'Acceso rechazado. Revisa la clave y la habilitación de la API en Formspree.':`No se pudo consultar la información (HTTP ${response.status}). Intenta de nuevo.`);
    const payload=await response.json();if(!payload||!Array.isArray(payload.submissions)||payload.submissions.some(row=>!row||typeof row!=='object'||Array.isArray(row)))throw new Error('La respuesta no contiene una lista válida de registros.');
    render(payload.submissions);status.textContent=source==='example'?'Datos de ejemplo · response_example.json · No es una consulta en vivo.':`Formspree · ${payload.submissions.length} registros recibidos en esta consulta · Actualizado a las ${new Intl.DateTimeFormat('es-MX',{timeStyle:'short'}).format(new Date())} · Fechas en horario de Ciudad de México.`;
  }catch(error){status.className='error';status.textContent=error.name==='AbortError'?'La consulta tardó demasiado. Intenta actualizar de nuevo.':error instanceof TypeError?'No se pudo conectar. Revisa la conexión y el acceso CORS de Formspree. Abre el prototipo desde un servidor HTTP.':error.message;document.querySelector('#count').textContent='0';records.append(el('p','No se cargaron registros. Puedes reintentar o seleccionar “Ver ejemplo”.','empty'));}
  finally{clearTimeout(timer);controls.forEach(button=>button.disabled=false);records.setAttribute('aria-busy','false');}
}
document.querySelector('#refresh').addEventListener('click',()=>load('live'));
document.querySelector('#example').addEventListener('click',()=>load('example'));
load('live');
