const {chromium}=require('playwright'),assert=require('node:assert/strict');
const server=require('./viewer_server.cjs')();
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{console.log('Launching browser');browser=await chromium.launch({headless:true,executablePath:'/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'});
for(let n=Number(process.env.SERVICES_START || 0);n<5;n++){
console.log('Starting case',n+1);const page=await browser.newPage();await page.route('https://cdn.jsdelivr.net/**',r=>r.abort());await page.goto(`http://127.0.0.1:${server.address().port}/forms/08015p21_autoevaluacion_servicios/`);
console.log('Form loaded');await page.evaluate(n=>{
 for(const el of document.querySelectorAll('input,textarea,select')){
 if(el.disabled||['file','hidden','checkbox','radio'].includes(el.type)||el.readOnly)continue;
 if(el.tagName==='SELECT')el.value=String([0,4,6,8,10][n]);
 else if(el.type==='email')el.value='qa@example.test';
 else if(el.type==='number')el.value=String([1,5,6,20,21][n]);
 else if(el.type==='date')el.value='2027-01-01';
 else el.value='PRUEBA SERVICIOS SIN ARCHIVOS '+(n+1)+' '+new Date().toISOString();
 }
 for(const el of document.querySelectorAll('input[type=radio][value="No"]')){el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));}
 for(const group of document.querySelectorAll('[data-checkbox-group]')){const el=group.querySelector('input');el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));}
},n);
assert.equal(await page.evaluate(()=>validateStep(getStep(1),false)),false);
await page.locator('#p04_ninguno').evaluate(el=>{el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));});
assert.equal(await page.evaluate(()=>findFirstInvalidStep()),-1);
assert.equal(await page.locator('input[type=file]').evaluateAll(els=>els.every(el=>el.files.length===0)),true);
if(process.env.SERVICES_LIVE==='1'){
console.log('Sending case',n+1);const responsePromise=page.waitForResponse(r=>r.url()==='https://formspree.io/f/mbgjqzka'&&r.request().method()==='POST');
await page.evaluate(()=>showStep(8,false));await page.locator('#btnSubmit').click();
const response=await responsePromise;console.log(JSON.stringify({test:n+1,status:response.status(),accepted:response.ok()}));assert.equal(response.ok(),true);
}else console.log('PASS validation no files',n+1);
await page.close();
}
}finally{if(browser)await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1});
