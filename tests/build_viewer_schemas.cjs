// Development only. Extract labels from the initialized forms, including dynamic controls.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
(async () => {
  const browser = await chromium.launch({headless:true, channel:'msedge'});
  try {
    for (const folder of fs.readdirSync('forms')) {
      const page = await browser.newPage();
      await page.route('https://**/*', route => route.abort());
      await page.goto(pathToFileURL(path.resolve('forms', folder, 'index.html')).href);
      const schema = await page.evaluate(() => {
        const clean = node => (node?.textContent || '').replace(/\*/g,'').replace(/\s+/g,' ').trim();
        const fields = {}, groups = [];
        for (const step of document.querySelectorAll('.form-step')) {
          const title = clean(step.querySelector('h2'));
          if (title) groups.push(title);
          for (const input of step.querySelectorAll('[name]')) {
            const key = input.name;
            if (fields[key]) continue;
            const question = input.closest('.question-block');
            const heading = clean(question?.querySelector('legend, .fw-semibold, h3'));
            const legend = clean(input.closest('fieldset:not(.form-step)')?.querySelector('legend'));
            let label = clean(input.labels?.[0]);
            if (input.type === 'radio') label = legend || heading || label;
            if (input.type === 'checkbox' && document.querySelectorAll(`[name="${CSS.escape(key)}"]`).length > 1) label = heading || legend;
            if (input.getAttribute('aria-label')) label = input.getAttribute('aria-label');
            // Repeated labels such as 'Vigencia' and 'Cantidad' need their subject.
            const cert = key.match(/^p(?:04|06)_(iso9001|iso45001|iso14001|vda64|otros?|otra_certificacion)_(?:vigencia|archivo)$/);
            if (cert) {
              const names = {iso9001:'ISO 9001',iso45001:'ISO 45001',iso14001:'ISO 14001',vda64:'VDA 6.4',otro:'Otra certificación',otros:'Otra certificación',otra_certificacion:'Otra certificación'};
              label = names[cert[1]] + ' · ' + (label || (key.endsWith('_vigencia') ? 'Vigencia (mes y año)' : 'Archivo del certificado'));
            }
            if (key.startsWith('p04_hm_') && /_(cantidad|nombre)$/.test(key)) {
              const base = key.replace(/_(cantidad|nombre)$/,'');
              const subject = document.querySelector(`[name="${base}"]`);
              label = clean(subject?.closest('fieldset')?.querySelector('legend')) + ' · ' + label;
            }
            if (heading && label && !label.startsWith(heading)) label = heading + ' · ' + label;
            fields[key] = {label:label || heading || key.replaceAll('_',' '), group:title};
          }
        }
        return {groups,fields};
      });
      const dir = path.join('submissions_viewer', folder);
      fs.mkdirSync(dir,{recursive:true});
      fs.writeFileSync(path.join(dir,'schema.js'), '// Generated from the initialized form by tests/build_viewer_schemas.cjs.\nwindow.VIEWER_SCHEMA = '+JSON.stringify(schema,null,2)+';\n');
      console.log(folder, Object.keys(schema.fields).length, 'fields');
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
