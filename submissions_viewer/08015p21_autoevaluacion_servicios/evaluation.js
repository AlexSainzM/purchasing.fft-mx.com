/* Servicios — Spec 005. Pure calculation; no DOM, network or stored-data changes. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ServicesEvaluation = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const fields = Object.freeze({
    5:'p05_planea_certificarse', 6:'p06_visita_evaluacion',
    7:'p07_antiguedad_empresa', 8:'p08_experiencia_servicios',
    9:'p09_organigrama', 10:'p10_referencias', 11:'p11_capacitaciones',
    12:'p12_acceso_normas', 13:'p13_cursos_seguridad', 14:'p14_imss',
    15:'p15_equipo_seguridad', 16:'p16_satisfaccion_personal',
    17:'p17_personal_ingles', 18:'p18_experiencia_extranjero',
    19:'p19_disponibilidad_viajar', 21:'p21_utiliza_software',
    22:'p22_reaccion_urgente', 23:'p23_separa_basura',
    24:'p24_responsable_ambiental', 25:'p25_responsable_calidad',
    26:'p26_pruebas_calidad', 27:'p27_documentan_pruebas',
    28:'p28_auditorias_proveedores', 29:'p29_exige_certificados',
    30:'p30_estandares', 31:'p31_reclamos_servicios',
    32:'p32_puntuacion_confidencialidad_empleados',
    33:'p33_puntuacion_capacitacion_seguridad_informacion',
    34:'p34_puntuacion_zonas_seguridad_acceso',
    35:'p35_puntuacion_permisos_datos_clientes',
    36:'p36_puntuacion_clasificacion_informacion',
    37:'p37_puntuacion_copias_seguridad',
    38:'p38_puntuacion_confidencialidad_proveedores', 39:'p39_puntuacion_firewall'
  });
  const certificates = ['iso9001','vda64','iso45001','iso14001','tisax','otros'].map(name=>'p04_'+name);
  const absent = value => value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
  function number(value) {
    if (absent(value)) return {issue:'incomplete'};
    if (typeof value !== 'number' && (typeof value !== 'string' || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim()))) return {issue:'invalid'};
    const parsed = Number(value);
    return Number.isFinite(parsed) ? {value:parsed} : {issue:'invalid'};
  }
  function yesNo(value) {
    if (absent(value)) return {issue:'incomplete'};
    if (typeof value !== 'string') return {issue:'invalid'};
    const normalized = value.trim().toLowerCase().normalize('NFD').replace(/\u0301/g,'');
    return normalized === 'si' ? {value:true} : normalized === 'no' ? {value:false} : {issue:'invalid'};
  }
  function evidence(value) {
    const values = Array.isArray(value) ? value : [value];
    if (values.every(absent)) return 'absent';
    const valid = values.some(item => {
      if (typeof item !== 'string' || !item.trim().startsWith('https://')) return false;
      try { const url = new URL(item.trim()); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
    });
    return valid ? 'present' : 'unknown';
  }
  function classify(percentage) {
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) return null;
    return percentage <= 60 ? 'C' : percentage <= 75 ? 'B' : percentage <= 90 ? 'AB' : 'A';
  }
  function evaluate(row) {
    function item(question) {
      const key = fields[question], maximum = question >= 32 ? 10 : 1;
      const result = {question, key, maximum, points:null, issue:null, reason:''};
      function pending(issue, reason) { return {...result, issue, reason:reason || (issue === 'incomplete' ? 'Respuesta ausente' : 'Respuesta inválida')}; }
      function scored(points, reason) { return {...result, points, reason}; }
      if (question === 5) {
        const choices = [...certificates,'p04_ninguno'].map(key=>absent(row[key]) ? {value:false} : yesNo(row[key]));
        if (choices.some(choice=>choice.issue)) return pending('invalid','Declaración de certificaciones inválida');
        const certified = choices.slice(0,-1).some(choice=>choice.value), none = choices.at(-1).value;
        if (certified && none) return pending('invalid','Ninguno y certificación seleccionados simultáneamente');
        if (certified) return scored(1,'Certificación declarada; máximo un punto, sin auditar vigencia o anexos');
        if (!none) return pending('incomplete','Falta declarar certificación o Ninguno');
        const plan = yesNo(row[key]);
        return plan.issue ? pending(plan.issue) : scored(plan.value ? 1 : 0, plan.value ? 'Sin certificación; planea certificarse' : 'Ninguno; no planea certificarse');
      }
      if ([7,8,16].includes(question) || question >= 32) {
        const parsed = number(row[key]);
        if (parsed.issue) return pending(parsed.issue);
        const value = parsed.value;
        if (value < 0 || (question === 16 && value > 100) || (question >= 32 && ![0,4,6,8,10].includes(value))) return pending('invalid','Valor fuera del rango u opciones permitidas');
        if (question >= 32) return scored(value,'Puntuación declarada: '+value);
        if (question === 16) return scored(value >= 95 ? 1 : value >= 85 ? .75 : value >= 75 ? .5 : value >= 50 ? .25 : 0, 'Satisfacción de '+value+' %');
        return scored(value < 2 ? 0 : value < 6 ? .25 : value <= 20 ? .75 : 1, value+' años');
      }
      const answer = yesNo(row[key]);
      if (answer.issue) return pending(answer.issue);
      if (!answer.value) return scored(0,'No');
      if (question === 9 || question === 10) {
        const state = evidence(row[question === 9 ? 'p09_archivo_organigrama' : 'p10_archivos_referencias']);
        if (state === 'unknown') return pending('invalid','Sí; evidencia no interpretable, requiere revisión');
        return scored(state === 'present' ? 1 : 0, state === 'present' ? 'Sí, con evidencia adjunta reconocible' : 'Sí, sin evidencia adjunta');
      }
      if (question === 24 || question === 25) {
        const name = row['p'+question+'_nombre_responsable'];
        if (!absent(name) && typeof name !== 'string') return pending('invalid','Nombre de responsable no interpretable');
        return scored(absent(name) ? 0 : 1, absent(name) ? 'Sí, sin nombre de responsable' : 'Sí, con nombre de responsable');
      }
      return scored(1,'Sí');
    }
    const items = Object.keys(fields).map(key=>item(Number(key)));
    function block(id, title, maximum, items) {
      const points = items.reduce((sum,item)=>sum+(item.points ?? 0),0);
      const issues = items.filter(item=>item.issue);
      const complete = issues.length === 0;
      const percentage = complete ? points / maximum * 100 : null;
      return {id,title,maximum,points,complete,percentage,classification:complete ? classify(percentage) : null,items,issues};
    }
    const general = block('general','Evaluación general',26,items.filter(item=>item.question < 32));
    const security = block('security','Seguridad de la Información',80,items.filter(item=>item.question >= 32));
    const reported = number(row.subtotal_seguridad_informacion);
    const warnings = [];
    if (!reported.issue && reported.value >= 0 && reported.value <= 80) {
      if (security.complete && reported.value !== security.points) warnings.push('El subtotal reportado ('+reported.value+'/80) difiere de Seguridad recalculada ('+security.points+'/80). Se utilizan las ocho respuestas.');
    } else if (!absent(row.subtotal_seguridad_informacion)) warnings.push('El subtotal reportado no es válido; no se utiliza para calcular Seguridad.');
    return {version:'Servicios — Spec 005',general,security,warnings};
  }
  return Object.freeze({evaluate,classify,fields});
});
