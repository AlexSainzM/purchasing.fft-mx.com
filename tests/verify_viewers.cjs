const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const server=require('./viewer_server.cjs')();
const root=path.resolve(__dirname,'..'),live=process.env.VIEWER_LIVE==='1';
const fixture=JSON.parse(fs.readFileSync(path.join(root,'submissions_viewer/08015p22_autoevaluacion_fabricantes/response_example.json')));
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}`;let browser;
 try{
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage(),errors=[],broken=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)broken.push(r.url());});
  page.on('request',r=>requests.push(r.url()));
  fs.mkdirSync(path.join(root,'tmp/viewers-qa'),{recursive:true});
  async function responsive(name){for(const width of [1440,768,390]){await page.setViewportSize({width,height:950});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(root,`tmp/viewers-qa/${name}-${width}.png`)});}}
  for(const alias of ['submission_viewer','submissions_viewer']){await page.goto(`${base}/${alias}/`);assert.equal(await page.locator('.catalog-card').count(),4);await responsive(alias);}
  for(const folder of fs.readdirSync(path.join(root,'forms'))){
   const ctx={window:{}};for(const file of ['config.js','schema.js'])vm.runInNewContext(fs.readFileSync(path.join(root,'submissions_viewer',folder,file),'utf8'),ctx);
   const {formId,readOnlyKey}=ctx.window.VIEWER_CONFIG,schema=ctx.window.VIEWER_SCHEMA;
   const source=fs.readFileSync(path.join(root,'forms',folder,'main.js'),'utf8')+fs.readFileSync(path.join(root,'forms',folder,'index.html'),'utf8');
   assert.ok(source.includes('https://formspree.io/f/'+formId));
   const row=Object.fromEntries(Object.keys(schema.fields).map(key=>[key,'Respuesta QA']));
   Object.assign(row,{empresa_nombre:'PRUEBA QA',empresa_contacto:'Contacto QA',subtotal_seguridad_informacion:'40',_date:'2026-09-18T12:00:00',evidencia:['https://example.com/evidence.pdf']});
   if(folder.includes('maquinados'))row.p04_cnc_12_tipo='Fresadora';
   const payload=folder.includes('fabricantes')?fixture:{submissions:[row]};let mode='ok';
   if(!live)await page.route('https://formspree.io/**',async route=>{
    assert.equal(route.request().url(),`https://formspree.io/api/0/forms/${formId}/submissions`);assert.equal(route.request().headers().authorization,`Bearer ${readOnlyKey}`);assert.equal(route.request().method(),'GET');
    if(mode==='network')return route.abort();if(mode==='slow')await new Promise(resolve=>setTimeout(resolve,400));
    const body=mode==='empty'?{submissions:[]}:mode==='invalid'?{submissions:[null]}:mode==='unsafe'?{submissions:[{empresa_nombre:'<img src=x onerror=alert(1)>',evidence:'javascript:alert(1)',extra:{nested:'value'},subtotal_seguridad_informacion:100},{}]}:payload;
    return route.fulfill({status:mode==='auth'?403:mode==='server'?500:200,contentType:'application/json',body:JSON.stringify(body)});
   });
   await page.goto(base+'/submissions_viewer/');await page.locator(`.catalog-card a[href="${encodeURIComponent(folder)}/index.html"]`).click();
   const settled=()=>page.waitForFunction(()=>document.querySelector('#records').getAttribute('aria-busy')==='false');await settled();
   assert.notEqual(await page.locator('#status').getAttribute('class'),'error');
   if(live)console.log('LIVE',folder,await page.locator('#count').innerText());
   else{
    assert.equal(await page.locator('.record').count(),payload.submissions.length);
    assert.equal(await page.locator('.field').count(),payload.submissions.reduce((n,r)=>n+Object.keys(r).length,0));
    assert.equal(await page.locator('.record[open]').count(),0);await page.locator('summary').first().focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.record[open]').count(),1);
    const evidenceCount=payload.submissions.reduce((n,r)=>n+Object.values(r).flat().filter(v=>typeof v==='string'&&v.startsWith('https://')).length,0);
    assert.equal(await page.locator('.record a[target="_blank"]').count(),evidenceCount);
    if(folder.includes('maquinados'))assert.match(await page.locator('[data-field="p04_cnc_12_tipo"] dt').innerText(),/Tipo CNC 12/);
    for(const key of Object.keys(schema.fields)){if(!key.startsWith('p')||folder.includes('fabricantes'))continue;assert.equal(await page.locator(`[data-field="${key}"] dt`).innerText(),schema.fields[key].label);}
    await responsive(formId);
    for(const scenario of ['empty','auth','server','invalid','network','unsafe','slow']){
     mode=scenario;await page.locator('#refresh').click();if(scenario==='slow'){assert.equal(await page.locator('#records').getAttribute('aria-busy'),'true');assert.equal(await page.locator('#refresh').isDisabled(),true);}await settled();
     if(scenario==='empty')assert.match(await page.locator('#records').innerText(),/No hay registros/);
     if(['auth','server','invalid','network'].includes(scenario))assert.equal(await page.locator('#status').getAttribute('class'),'error');
     if(scenario==='unsafe'){assert.equal(await page.locator('#records img, #records a').count(),0);assert.match(await page.locator('.company').first().innerText(),/<img/);assert.match(await page.locator('.score').first().innerText(),/Sin subtotal válido/);}
    }
    assert.equal(await page.locator('.record').count(),payload.submissions.length);await page.unroute('https://formspree.io/**');
   }
   await page.getByRole('link',{name:'← Volver al catálogo'}).click();assert.equal(await page.locator('.catalog-card').count(),4);console.log('PASS',folder);
  }
  assert.deepEqual(errors,[]);assert.deepEqual(broken,[]);assert.ok(!requests.some(url=>url.includes('response_example.json')));
  console.log('PASS: catalog, relative links, all viewers, no JS errors/404/example requests'+(live?' (real Formspree)':' (fields, keyboard, evidence, responsive, states, XSS, recovery)'));
 }finally{if(browser)await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
