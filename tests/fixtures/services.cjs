// Synthetic records only. No actual submissions or personal data.
function complete() {
 return {
  empresa_nombre:'Proveedor sintético',empresa_contacto:'Contacto QA',_date:'2026-11-02T12:00:00Z',
  p04_ninguno:'Sí',p04_iso9001:'No',p04_vda64:'No',p04_iso45001:'No',p04_iso14001:'No',p04_tisax:'No',p04_otros:'No',
  p05_planea_certificarse:'Sí',p06_visita_evaluacion:'Sí',p07_antiguedad_empresa:'21',p08_experiencia_servicios:'21',
  p09_organigrama:'Sí',p09_archivo_organigrama:['https://example.com/organigrama.pdf'],
  p10_referencias:'Sí',p10_archivos_referencias:['https://example.com/referencia.pdf','https://example.com/referencia2.pdf'],
  p11_capacitaciones:'Sí',p12_acceso_normas:'Sí',p13_cursos_seguridad:'Sí',p14_imss:'Sí',p15_equipo_seguridad:'Sí',
  p16_satisfaccion_personal:'100',p17_personal_ingles:'Sí',p18_experiencia_extranjero:'Sí',p19_disponibilidad_viajar:'Sí',
  p21_utiliza_software:'Sí',p22_reaccion_urgente:'Sí',p23_separa_basura:'Sí',
  p24_responsable_ambiental:'Sí',p24_nombre_responsable:'Persona QA',p25_responsable_calidad:'Sí',p25_nombre_responsable:'Persona QA',
  p26_pruebas_calidad:'Sí',p27_documentan_pruebas:'Sí',p28_auditorias_proveedores:'Sí',p29_exige_certificados:'Sí',p30_estandares:'Sí',p31_reclamos_servicios:'Sí',
  p32_puntuacion_confidencialidad_empleados:'10',p33_puntuacion_capacitacion_seguridad_informacion:'10',
  p34_puntuacion_zonas_seguridad_acceso:'10',p35_puntuacion_permisos_datos_clientes:'10',p36_puntuacion_clasificacion_informacion:'10',
  p37_puntuacion_copias_seguridad:'10',p38_puntuacion_confidencialidad_proveedores:'10',p39_puntuacion_firewall:'10',
  subtotal_seguridad_informacion:'80'
 };
}
function cases() {
 const maximum=complete();
 const mixed={...complete(),empresa_nombre:'General A / Seguridad C',_date:'2026-11-01T12:00:00Z'};
 Object.keys(mixed).filter(key=>/^p(?:3[2-9])_/.test(key)).forEach(key=>mixed[key]='0');
 const partial={...complete(),empresa_nombre:'General pendiente / Seguridad A',_date:'2026-10-31T12:00:00Z'};
 delete partial.p06_visita_evaluacion;
 const invalid={...complete(),empresa_nombre:'General A / Seguridad inválida',_date:'2026-10-30T12:00:00Z',p32_puntuacion_confidencialidad_empleados:'5'};
 return [maximum,mixed,partial,invalid];
}
module.exports={complete,cases};
