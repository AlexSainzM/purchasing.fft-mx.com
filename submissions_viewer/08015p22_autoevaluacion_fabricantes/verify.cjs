// Run with Playwright available via NODE_PATH. All Formspree requests are mocked.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'response_example.json')));
const server = http.createServer((req, res) => {
  const name = req.url === '/' ? 'index.html' : req.url.slice(1);
  if (!['index.html','styles.css','config.js','main.js','response_example.json'].includes(name)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':name.endsWith('.json')?'application/json':'text/html; charset=utf-8');
  res.end(fs.readFileSync(path.join(__dirname,name)));
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try {
    browser=await chromium.launch({headless:true,channel:'msedge'});
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    let mode='ok'; const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.route('https://formspree.io/**',async route=>{
      assert.equal(route.request().method(),'GET');
      assert.ok(route.request().headers().authorization.startsWith('Bearer '));
      if(mode==='network')return route.abort();
      const body=mode==='empty'?{submissions:[]}:mode==='invalid'?{data:[]} : mode==='unsafe'?{submissions:[{empresa_nombre:'<img src=x onerror=alert(1)>',p11_archivo_organigrama:['javascript:alert(1)'],extra:{nested:'value'}}]}:fixture;
      return route.fulfill({status:mode==='unauthorized'?401:200,contentType:'application/json',body:JSON.stringify(body)});
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.waitForFunction(()=>document.querySelector('#count').textContent==='4');
    assert.equal(await page.locator('.record').count(),4);
    assert.equal(await page.locator('.record[open]').count(),0);
    await page.locator('.record summary').first().focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('.record[open]').count(),1);
    assert.equal(await page.locator('.field').count(),fixture.submissions.reduce((sum,row)=>sum+Object.keys(row).length,0));
    assert.equal(await page.locator('.record a[target="_blank"]').count(),fixture.submissions.reduce((sum,row)=>sum+Object.values(row).filter(Array.isArray).flat().filter(value=>typeof value==='string'&&value.startsWith('https://')).length,0));
    fs.mkdirSync(path.join(__dirname,'qa'),{recursive:true});
    await page.screenshot({path:path.join(__dirname,'qa/desktop.png')});
    await page.setViewportSize({width:390,height:844});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.screenshot({path:path.join(__dirname,'qa/mobile.png')});
    for(const scenario of ['empty','unauthorized','invalid','network','unsafe']){
      mode=scenario;await page.getByRole('button',{name:'Actualizar registros'}).click();
      await page.waitForFunction(()=>document.querySelector('#records').getAttribute('aria-busy')==='false');
      if(scenario==='empty')assert.match(await page.locator('#records').innerText(),/No hay registros/);
      if(['unauthorized','invalid','network'].includes(scenario))assert.equal(await page.locator('#status').getAttribute('class'),'error');
      if(scenario==='unsafe'){assert.equal(await page.locator('#records img').count(),0);assert.equal(await page.locator('#records a').count(),0);assert.match(await page.locator('.company').innerText(),/<img/);}
    }
    await page.getByRole('button',{name:'Ver ejemplo'}).click();
    await page.waitForFunction(()=>document.querySelector('#count').textContent==='4');
    assert.match(await page.locator('#status').innerText(),/Datos de ejemplo/);
    assert.deepEqual(errors,[]);
    console.log('PASS: 4 rows, keyboard expansion, all fields, evidence links, mobile layout, empty/auth/schema/network states, XSS safety, example recovery.');
  } finally {if(browser)await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
