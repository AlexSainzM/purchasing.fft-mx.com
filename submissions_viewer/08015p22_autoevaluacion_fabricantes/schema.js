// Generated from the initialized form by tests/build_viewer_schemas.cjs.
window.VIEWER_SCHEMA = {
  "groups": [
    "Datos de la empresa",
    "General",
    "Experiencia",
    "Personal",
    "Tecnología",
    "Seguridad",
    "Medio ambiente",
    "Calidad",
    "Envío",
    "Seguridad de la Información"
  ],
  "fields": {
    "empresa_nombre": {
      "label": "Nombre de la empresa",
      "group": "Datos de la empresa"
    },
    "empresa_contacto": {
      "label": "Nombre del contacto",
      "group": "Datos de la empresa"
    },
    "empresa_direccion": {
      "label": "Dirección de la empresa",
      "group": "Datos de la empresa"
    },
    "empresa_telefono": {
      "label": "Teléfono",
      "group": "Datos de la empresa"
    },
    "empresa_email": {
      "label": "Correo electrónico",
      "group": "Datos de la empresa"
    },
    "p01_personas_empresa": {
      "label": "1. ¿Cuántas personas están trabajando en su empresa?",
      "group": "General"
    },
    "p02_numero_sucursales": {
      "label": "2. ¿Cuántas sucursales tiene su empresa?",
      "group": "General"
    },
    "p03_giros_empresa": {
      "label": "3. ¿En qué giro(s) trabaja su empresa?",
      "group": "General"
    },
    "p03_otro_giro": {
      "label": "3. ¿En qué giro(s) trabaja su empresa? · Especifique otro giro",
      "group": "General"
    },
    "p04_paises_fabricacion": {
      "label": "4. ¿En cuál(es) país(es) están fabricando sus productos?",
      "group": "General"
    },
    "p05_plazo_entrega_promedio": {
      "label": "5. ¿De cuánto tiempo son sus plazos de entrega en promedio?",
      "group": "General"
    },
    "p06_ninguno": {
      "label": "6. Por favor indique si su empresa está certificada de acuerdo con alguno de los siguientes certificados y la vigencia de cada certificación: · Ninguno",
      "group": "General"
    },
    "p06_iso9001": {
      "label": "6. Por favor indique si su empresa está certificada de acuerdo con alguno de los siguientes certificados y la vigencia de cada certificación: · ISO 9001",
      "group": "General"
    },
    "p06_iso9001_vigencia": {
      "label": "6. Por favor indique si su empresa está certificada de acuerdo con alguno de los siguientes certificados y la vigencia de cada certificación: · ISO 9001 · Vigente hasta (MM/AA)",
      "group": "General"
    },
    "p06_iso45001": {
      "label": "6. Por favor indique si su empresa está certificada de acuerdo con alguno de los siguientes certificados y la vigencia de cada certificación: · ISO 45001",
      "group": "General"
    },
    "p06_iso45001_vigencia": {
      "label": "6. Por favor indique si su empresa está certificada de acuerdo con alguno de los siguientes certificados y la vigencia de cada certificación: · ISO 45001 · Vigente hasta (MM/AA)",
      "group": "General"
    },
    "p06_iso14001": {
      "label": "6. Por favor indique si su empresa está certificada de acuerdo con alguno de los siguientes certificados y la vigencia de cada certificación: · ISO 14001",
      "group": "General"
    },
    "p06_iso14001_vigencia": {
      "label": "6. Por favor indique si su empresa está certificada de acuerdo con alguno de los siguientes certificados y la vigencia de cada certificación: · ISO 14001 · Vigente hasta (MM/AA)",
      "group": "General"
    },
    "p06_vda64": {
      "label": "6. Por favor indique si su empresa está certificada de acuerdo con alguno de los siguientes certificados y la vigencia de cada certificación: · VDA 6.4",
      "group": "General"
    },
    "p06_vda64_vigencia": {
      "label": "6. Por favor indique si su empresa está certificada de acuerdo con alguno de los siguientes certificados y la vigencia de cada certificación: · VDA 6.4 · Vigente hasta (MM/AA)",
      "group": "General"
    },
    "p06_tisax": {
      "label": "6. Por favor indique si su empresa está certificada de acuerdo con alguno de los siguientes certificados y la vigencia de cada certificación: · TISAX",
      "group": "General"
    },
    "p06_tisax_vigencia": {
      "label": "6. Por favor indique si su empresa está certificada de acuerdo con alguno de los siguientes certificados y la vigencia de cada certificación: · Vigente hasta (MM/AA)",
      "group": "General"
    },
    "p06_otros": {
      "label": "6. Por favor indique si su empresa está certificada de acuerdo con alguno de los siguientes certificados y la vigencia de cada certificación: · Otros",
      "group": "General"
    },
    "p06_otros_descripcion": {
      "label": "6. Por favor indique si su empresa está certificada de acuerdo con alguno de los siguientes certificados y la vigencia de cada certificación: · Especifique otros certificados",
      "group": "General"
    },
    "p06_otros_vigencia": {
      "label": "6. Por favor indique si su empresa está certificada de acuerdo con alguno de los siguientes certificados y la vigencia de cada certificación: · Otra certificación · Vigente hasta (MM/AA)",
      "group": "General"
    },
    "p07_planea_certificarse_iso9001": {
      "label": "7. ¿Tiene planeado certificarse en ISO 9001?",
      "group": "General"
    },
    "p07_fecha_estimada_certificacion_iso9001": {
      "label": "7. ¿Tiene planeado certificarse en ISO 9001? · Mes y año estimados para obtener la certificación ISO 9001",
      "group": "General"
    },
    "p08_visita_evaluacion": {
      "label": "8. ¿Es posible visitar su empresa para llevar a cabo una evaluación en piso?",
      "group": "General"
    },
    "p09_antiguedad_empresa": {
      "label": "9. ¿Hace cuántos años se fundó su empresa?",
      "group": "Experiencia"
    },
    "p10_experiencia_fabricacion": {
      "label": "10. ¿Cuánta experiencia tiene con la fabricación de los productos solicitados?",
      "group": "Experiencia"
    },
    "p11_organigrama": {
      "label": "11. ¿Tiene un organigrama que enseña las responsabilidades en su empresa? Favor de anexar.",
      "group": "Experiencia"
    },
    "p11_archivo_organigrama": {
      "label": "11. ¿Tiene un organigrama que enseña las responsabilidades en su empresa? Favor de anexar. · Anexe el organigrama",
      "group": "Experiencia"
    },
    "p12_referencias": {
      "label": "12. ¿Cuenta con referencias / clientes / proyectos para los trabajos que provee? Favor de anexar.",
      "group": "Experiencia"
    },
    "p12_archivos_referencias": {
      "label": "12. ¿Cuenta con referencias / clientes / proyectos para los trabajos que provee? Favor de anexar. · Anexe referencias, clientes o proyectos",
      "group": "Experiencia"
    },
    "p13_capacitaciones_frecuentes": {
      "label": "13. ¿Participa su personal en capacitaciones frecuentes?",
      "group": "Personal"
    },
    "p14_acceso_normas": {
      "label": "14. ¿Tiene su personal acceso a normas y leyes actuales?",
      "group": "Personal"
    },
    "p15_cursos_seguridad": {
      "label": "15. ¿Recibe su personal con regularidad cursos de seguridad?",
      "group": "Personal"
    },
    "p16_imss": {
      "label": "16. ¿Está su personal asegurado en el IMSS (seguro social)?",
      "group": "Personal"
    },
    "p17_equipo_seguridad": {
      "label": "17. ¿Proporciona la empresa equipo de seguridad para su personal?",
      "group": "Personal"
    },
    "p18_satisfaccion_personal": {
      "label": "18. ¿Qué tan alto es el porcentaje de satisfacción de su personal?",
      "group": "Personal"
    },
    "p19_mantenimiento_maquinaria": {
      "label": "19. ¿Da mantenimiento en periodos consecutivos a su maquinaria?",
      "group": "Tecnología"
    },
    "p20_planos_mantenimiento": {
      "label": "20. ¿Existen planos de mantenimiento de las máquinas?",
      "group": "Tecnología"
    },
    "p21_reaccion_urgente": {
      "label": "21. ¿Es capaz de reaccionar flexiblemente y a corto plazo a solicitudes urgentes?",
      "group": "Tecnología"
    },
    "p22_senaleticas_barreras": {
      "label": "22. ¿Sus máquinas cumplen con las señaléticas y barreras mecánicas necesarias para evitar accidentes?",
      "group": "Seguridad"
    },
    "p23_manual_operacion": {
      "label": "23. ¿Cada máquina tiene su manual e instrucción de operación?",
      "group": "Seguridad"
    },
    "p24_identificacion_sustancias": {
      "label": "24. ¿Productos con sustancias químicas y peligrosas están identificados de acuerdo a las leyes vigentes de seguridad?",
      "group": "Seguridad"
    },
    "p25_metas_indicadores_seguridad": {
      "label": "25. ¿Tiene su empresa metas e indicadores que midan el desempeño de seguridad y la accidentabilidad?",
      "group": "Seguridad"
    },
    "p25_indicador_seguridad": {
      "label": "25. ¿Tiene su empresa metas e indicadores que midan el desempeño de seguridad y la accidentabilidad? · Cuál",
      "group": "Seguridad"
    },
    "p25_archivo_evidencia_seguridad": {
      "label": "25. ¿Tiene su empresa metas e indicadores que midan el desempeño de seguridad y la accidentabilidad? · Favor de mandar evidencia",
      "group": "Seguridad"
    },
    "p26_indice_accidentes_laborales": {
      "label": "26. ¿En el año calendario pasado cuál ha sido su índice de accidentes laborales?",
      "group": "Seguridad"
    },
    "p27_clasifican_residuos": {
      "label": "27. ¿En su empresa se clasifican los residuos?",
      "group": "Medio ambiente"
    },
    "p28_residuos_peligrosos": {
      "label": "28. ¿Indique la cantidad de residuos peligrosos / de manejo especial (reciclables) y urbanos que produce su empresa cada año en toneladas (estimación)? · Residuos peligrosos (t/año)",
      "group": "Medio ambiente"
    },
    "p28_residuos_manejo_especial": {
      "label": "28. ¿Indique la cantidad de residuos peligrosos / de manejo especial (reciclables) y urbanos que produce su empresa cada año en toneladas (estimación)? · Residuos de manejo especial (t/año)",
      "group": "Medio ambiente"
    },
    "p28_residuos_urbanos": {
      "label": "28. ¿Indique la cantidad de residuos peligrosos / de manejo especial (reciclables) y urbanos que produce su empresa cada año en toneladas (estimación)? · Urbanos (t/año)",
      "group": "Medio ambiente"
    },
    "p29_registro_ambiental": {
      "label": "29. ¿Cuenta su empresa con un número de registro ambiental (NRA) por parte de SEMARNAT como generador de residuos peligrosos (aplica solo para empresas mexicanas)?",
      "group": "Medio ambiente"
    },
    "p29_numero_registro_ambiental": {
      "label": "29. ¿Cuenta su empresa con un número de registro ambiental (NRA) por parte de SEMARNAT como generador de residuos peligrosos (aplica solo para empresas mexicanas)? · ¿Cuál es el número?",
      "group": "Medio ambiente"
    },
    "p30_programa_ambiental": {
      "label": "30. ¿Está inscrito su empresa en algún programa de protección ambiental (requerido por alguna ley local, federal o nacional)?",
      "group": "Medio ambiente"
    },
    "p30_nombre_programa_ambiental": {
      "label": "30. ¿Está inscrito su empresa en algún programa de protección ambiental (requerido por alguna ley local, federal o nacional)? · Nombre del programa",
      "group": "Medio ambiente"
    },
    "p31_seguro_ambiental": {
      "label": "31. ¿Tiene su empresa un seguro para posibles daños al medio ambiente?",
      "group": "Medio ambiente"
    },
    "p32_provee_material_peligroso": {
      "label": "32. ¿Provee a FFT alguna sustancia o material peligroso?",
      "group": "Medio ambiente"
    },
    "p33_materiales_peligrosos": {
      "label": "33. Si la respuesta en 32. es sí, ¿cuáles materiales son?",
      "group": "Medio ambiente"
    },
    "p34_existe_encargado_ambiental": {
      "label": "34. ¿Hay una persona encargada de protección ambiental?",
      "group": "Medio ambiente"
    },
    "p34_nombre_encargado_ambiental": {
      "label": "34. ¿Hay una persona encargada de protección ambiental? · Nombre",
      "group": "Medio ambiente"
    },
    "p35_programa_reciclaje": {
      "label": "35. ¿Cuenta con algún programa de reciclaje?",
      "group": "Medio ambiente"
    },
    "p36_almacenamiento_peligrosos": {
      "label": "36. ¿Los materiales peligrosos se almacenan, procesan adecuadamente hasta y durante su uso?",
      "group": "Medio ambiente"
    },
    "p37_usa_biodegradables": {
      "label": "37. ¿Usa su empresa productos biodegradables?",
      "group": "Medio ambiente"
    },
    "p37_productos_biodegradables": {
      "label": "37. ¿Usa su empresa productos biodegradables? · Cuáles",
      "group": "Medio ambiente"
    },
    "p38_existe_encargado_calidad": {
      "label": "38. ¿Hay una persona encargada de calidad?",
      "group": "Calidad"
    },
    "p38_nombre_encargado_calidad": {
      "label": "38. ¿Hay una persona encargada de calidad? · Nombre",
      "group": "Calidad"
    },
    "p39_instrucciones_trabajo": {
      "label": "39. ¿Existen instrucciones de trabajo en las áreas correspondientes?",
      "group": "Calidad"
    },
    "p40_pruebas_calidad": {
      "label": "40. ¿Se aplican pruebas de calidad antes de la entrega final de los servicios/materiales?",
      "group": "Calidad"
    },
    "p41_documentan_pruebas": {
      "label": "41. ¿Se documentan los resultados de las pruebas?",
      "group": "Calidad"
    },
    "p42_sistema_evita_equivocacion": {
      "label": "42. ¿Existe un sistema de calidad que evita la equivocación de materiales antes de su salida?",
      "group": "Calidad"
    },
    "p43_mantenimiento_medicion": {
      "label": "43. ¿Da mantenimiento en periodos consecutivos a los instrumentos de medición?",
      "group": "Calidad"
    },
    "p44_mantenimiento_documentado": {
      "label": "44. Si la respuesta es sí en 43. ¿Está documentado este mantenimiento?",
      "group": "Calidad"
    },
    "p44_archivo_mantenimiento_medicion": {
      "label": "44. Si la respuesta es sí en 43. ¿Está documentado este mantenimiento? · Anexar evidencia",
      "group": "Calidad"
    },
    "p45_auditorias_proveedores": {
      "label": "45. ¿Se llevan a cabo auditorías frecuentes / evaluaciones de proveedores?",
      "group": "Calidad"
    },
    "p46_proveedores_certificados": {
      "label": "46. ¿Ustedes pide a sus proveedores que sean certificados?",
      "group": "Calidad"
    },
    "p47_estandares_calidad": {
      "label": "47. ¿Puede asegurar que siempre está trabajando de acuerdo a los estándares y normas internacionales actuales de calidad?",
      "group": "Calidad"
    },
    "p48_rastreabilidad": {
      "label": "48. ¿Se puede rastrear el origen de sus productos?",
      "group": "Calidad"
    },
    "p49_empaque_correcto": {
      "label": "49. ¿Sus productos están empaquetados correctamente para evitar daños de envío?",
      "group": "Envío"
    },
    "p50_empaques_ecologicos": {
      "label": "50. ¿Se usan empaques ecológicos o reciclables?",
      "group": "Envío"
    },
    "p51_proceso_transportista": {
      "label": "51. ¿Tiene un proceso definido para la selección del transportista?",
      "group": "Envío"
    },
    "p52_documentacion_envio": {
      "label": "52. ¿Qué tipo de documentación provee su empresa con el envío de cada producto?",
      "group": "Envío"
    },
    "p52_otro_documento": {
      "label": "52. ¿Qué tipo de documentación provee su empresa con el envío de cada producto? · Especifique otro documento",
      "group": "Envío"
    },
    "p53_proceso_reclamos": {
      "label": "53. ¿Tiene un proceso definido para atender reclamos y garantías de materiales?",
      "group": "Envío"
    },
    "p54_servicios_mantenimiento": {
      "label": "54. ¿Ofrece servicios de mantenimiento y/o técnico para sus productos (sólo aplica a productos de alta tecnología que requieran mantenimiento/capacitación especial)?",
      "group": "Envío"
    },
    "p55_puntuacion_confidencialidad_empleados": {
      "label": "55. ¿Están todos los empleados obligados por contrato a mantener la confidencialidad?",
      "group": "Seguridad de la Información"
    },
    "p56_puntuacion_capacitacion_seguridad_informacion": {
      "label": "56. ¿Son instruidos todos los trabajadores regularmente sobre la seguridad de la información y protección de datos?",
      "group": "Seguridad de la Información"
    },
    "p57_puntuacion_zonas_seguridad_acceso": {
      "label": "57. ¿Se han implementado zonas de seguridad y reglas de acceso en la empresa?",
      "group": "Seguridad de la Información"
    },
    "p58_puntuacion_permisos_datos_clientes": {
      "label": "58. ¿Se otorgan permisos de acceso a los datos de clientes según cada proyecto y se revisan regularmente?",
      "group": "Seguridad de la Información"
    },
    "p59_puntuacion_clasificacion_informacion": {
      "label": "59. ¿La información se clasifica según su nivel de confidencialidad y se protege de acuerdo a ello?",
      "group": "Seguridad de la Información"
    },
    "p60_puntuacion_copias_seguridad": {
      "label": "60. ¿Existe un proceso de copias de seguridad definido e implementado en la empresa?",
      "group": "Seguridad de la Información"
    },
    "p61_puntuacion_confidencialidad_proveedores": {
      "label": "61. ¿Los proveedores que participan en proyectos específicos están obligados a mantener la confidencialidad?",
      "group": "Seguridad de la Información"
    },
    "p62_puntuacion_firewall": {
      "label": "62. ¿El acceso a internet está protegido mediante un Firewall contra accesos no autorizados y software malicioso?",
      "group": "Seguridad de la Información"
    },
    "subtotal_seguridad_informacion": {
      "label": "Suma / Subtotal Seguridad de la Información",
      "group": "Seguridad de la Información"
    }
  }
};
