const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const {evaluate,classify,fields}=require('../submissions_viewer/08015p21_autoevaluacion_servicios/evaluation.js');
const {complete,cases}=require('./fixtures/services.cjs');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(require.resolve('../submissions_viewer/08015p21_autoevaluacion_servicios/schema.js'),'utf8'),context);
assert.equal(Object.keys(fields).length,34);
for(const key of Object.values(fields))assert.ok(context.window.VIEWER_SCHEMA.fields[key],key);
// Cross-check the independent CSV: every scored question is represented exactly once.
const csv=fs.readFileSync(require.resolve('../docs/csv_forms/08015p21_autoevaluacion_servicios.csv'),'utf8');
const scored=csv.split('\n').slice(1).filter(line=>/,Si,/.test(line)).map(line=>Number(line.split(',')[0]));
assert.deepEqual(Object.keys(fields).map(Number),scored);
function withChange(changes){return evaluate({...complete(),...changes});}
function item(question,value){const result=withChange({[fields[question]]:value});return [...result.general.items,...result.security.items].find(i=>i.question===question);}
let result=evaluate(complete());
assert.equal(result.general.points,26);assert.equal(result.security.points,80);
assert.equal(result.general.percentage,100);assert.equal(result.security.classification,'A');
assert.deepEqual(result.warnings,[]);
const min=complete();
for(const [q,key] of Object.entries(fields))min[key]=[7,8,16].includes(Number(q))||Number(q)>=32?'0':'No';
result=evaluate(min);assert.equal(result.general.points,0);assert.equal(result.security.points,0);assert.equal(result.general.classification,'C');assert.equal(result.security.classification,'C');
for(const [boundary,at,above] of [[60,'C','B'],[75,'B','AB'],[90,'AB','A']]){
 assert.equal(classify(boundary-0.000001),at);assert.equal(classify(boundary),at);assert.equal(classify(boundary+0.000001),above);
}
assert.equal(classify(90.000001),'A');assert.equal((90.000001).toFixed(2),'90.00');
for(const value of [-1,101,NaN,Infinity,null,'75'])assert.equal(classify(value),null);
for(const q of [7,8])for(const [value,points] of [[0,0],[1.9,0],[2,.25],[5,.25],[5.5,.25],[6,.75],[20,.75],[20.1,1]])assert.equal(item(q,value).points,points);
for(const [value,points] of [[0,0],[.95,0],[49.9,0],[50,.25],[74.9,.25],[75,.5],[84.9,.5],[85,.75],[94.9,.75],[95,1],[100,1]])assert.equal(item(16,value).points,points);
for(const q of [7,8,16,32]){
 for(const value of [undefined,null,'','   '])assert.equal(item(q,value).issue,'incomplete');
 for(const value of [-1,true,false,{},[],Infinity,NaN,'1.5 años','0x10','Infinity'])assert.equal(item(q,value).issue,'invalid');
}
assert.equal(item(16,101).issue,'invalid');
for(const value of [1,2,3,5,7,9,11])assert.equal(item(32,value).issue,'invalid');
for(const value of [0,4,6,8,10])assert.equal(item(32,String(value)).points,value);
for(const value of ['Sí','SI',' sí ','si'])assert.equal(item(6,value).points,1);
assert.equal(item(6,' NO ').points,0);
for(const value of [1,true,{},[],'yes'])assert.equal(item(6,value).issue,'invalid');
assert.equal(item(6,'').issue,'incomplete');
for(const [q,key] of [[9,'p09_archivo_organigrama'],[10,'p10_archivos_referencias']]){
 for(const value of [undefined,null,'',[],[' ']])assert.equal(withChange({[key]:value}).general.items.find(i=>i.question===q).points,0);
 for(const value of ['https://example.com/a.pdf',['https://example.com/a.pdf','https://example.com/b.pdf']])assert.equal(withChange({[key]:value}).general.points,26);
 for(const value of ['a.pdf',{url:'https://example.com/a.pdf'},'javascript:alert(1)','http://example.com/a.pdf','https://user:secret@example.com/a.pdf']){
  assert.equal(withChange({[key]:value}).general.complete,false);
  assert.equal(withChange({[fields[q]]:'No',[key]:value}).general.points,25);
 }
}
for(const q of [24,25]){
 const key='p'+q+'_nombre_responsable';
 for(const value of ['',undefined,'   '])assert.equal(withChange({[key]:value}).general.points,25);
 assert.equal(withChange({[key]:{name:'QA'}}).general.complete,false);
 assert.equal(withChange({[fields[q]]:'No',[key]:'QA'}).general.points,25);
}
assert.equal(withChange({p04_ninguno:undefined,p04_iso9001:'Sí',p05_planea_certificarse:undefined}).general.points,26);
assert.equal(withChange({p04_ninguno:'No',p04_iso9001:'Sí',p04_tisax:'Sí',p05_planea_certificarse:'garbage'}).general.points,26);
assert.equal(withChange({p04_iso9001:'Sí'}).general.complete,false);
assert.equal(withChange({p04_ninguno:undefined}).general.complete,false);
assert.equal(withChange({p04_iso9001:{}}).general.complete,false);
assert.equal(withChange({p05_planea_certificarse:'No'}).general.points,25);
for(const value of [undefined,'0',{},100]){
 const r=withChange({subtotal_seguridad_informacion:value});assert.equal(r.security.points,80);assert.equal(r.security.complete,true);
}
assert.equal(withChange({subtotal_seguridad_informacion:0}).warnings.length,1);
assert.equal(withChange({p32_puntuacion_confidencialidad_empleados:undefined}).security.classification,null);
for(const row of cases()){
 const before=JSON.stringify(row);evaluate(Object.freeze(row));assert.equal(JSON.stringify(row),before);
}
const [,mixed,partial,invalid]=cases().map(evaluate);
assert.equal(mixed.general.classification,'A');assert.equal(mixed.security.classification,'C');assert.equal(mixed.warnings.length,1);
assert.equal(partial.general.classification,null);assert.equal(partial.security.classification,'A');
assert.equal(invalid.general.classification,'A');assert.equal(invalid.security.classification,null);
const inverse={...min};for(let q=32;q<=39;q++)inverse[fields[q]]=10;
assert.equal(evaluate(inverse).general.classification,'C');assert.equal(evaluate(inverse).security.classification,'A');
assert.equal(withChange({percentage:0,classification:'C',evaluation:'other',unknown:'anything'}).general.classification,'A');
const both=withChange({p06_visita_evaluacion:undefined,p07_antiguedad_empresa:'invalid'});
assert.deepEqual(both.general.issues.map(i=>i.issue),['incomplete','invalid']);
// Recorded percentage examples, checked through full evaluation rather than only the classifier.
for(const [points,percent,classification] of [[15.5,'59.62','C'],[15.75,'60.58','B'],[19.5,'75.00','B'],[19.75,'75.96','AB'],[23.25,'89.42','AB'],[23.5,'90.38','A']]){
 const row={...min};let remaining=Math.floor(points);
 const yesKeys=Object.entries(fields).filter(([q])=>Number(q)<32&&![7,8,16].includes(Number(q))).map(([,key])=>key);
 for(const key of yesKeys){if(remaining>0){row[key]='Sí';remaining--;}}
 const fraction=points-Math.floor(points);
 row.p16_satisfaccion_personal=String(fraction===.25?50:fraction===.5?75:85);
 const block=evaluate(row).general;assert.equal(block.points,points);assert.equal(block.percentage.toFixed(2),percent);assert.equal(block.classification,classification);
}
for(const [values,percent,classification] of [[[10,10,10,10,8,0,0,0],'60.00','C'],[[10,10,10,10,10,0,0,0],'62.50','B'],[[10,10,10,10,10,10,0,0],'75.00','B'],[[10,10,10,10,10,8,4,0],'77.50','AB'],[[10,10,10,10,10,10,8,4],'90.00','AB'],[[10,10,10,10,10,10,10,4],'92.50','A']]){
 const row=complete();values.forEach((v,i)=>row[fields[32+i]]=v);const block=evaluate(row).security;
 assert.equal(block.percentage.toFixed(2),percent);assert.equal(block.classification,classification);
}
console.log('PASS: Spec 005 CSV coverage, scoring, thresholds, independent blocks, incomplete/invalid inputs, evidence, certification, immutability');
