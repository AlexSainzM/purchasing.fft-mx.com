/* Run: node tests/verify_forms_browser.cjs (requires Playwright and Chromium).
 * Requests to Formspree are always intercepted; no supplier data leaves this test.
 */
const { chromium } = require('playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  try {
    for (const folder of fs.readdirSync(path.resolve('forms'))) {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      let result = 'error', requests = 0;
      await page.route('https://**/*', async route => {
        if (route.request().url().includes('formspree.io')) {
          requests++;
          if (result === 'network') return route.abort();
          return route.fulfill({ status: result === 'ok' ? 200 : 422, contentType: 'application/json', body: result === 'ok' ? '{"ok":true}' : '{"errors":[{"message":"Test error"}]}' });
        }
        return route.abort(); // Exercise the documented CDN fallback too.
      });
      await page.goto(pathToFileURL(path.resolve('forms', folder, 'index.html')).href);
      const m = folder.includes('maquinados'), d = folder.includes('distribuidor');
      const iso = m ? 'p06_iso9001_seleccion' : 'p06_iso9001';
      const plan = m ? 'p08_planea_certificarse' : d ? 'p07_planea_certificarse' : 'p07_planea_certificarse_iso9001';
      const date = m ? 'p08_fecha_certificacion_estimada' : d ? 'p07_fecha_certificacion' : 'p07_fecha_estimada_certificacion_iso9001';
      // Drive real change handlers independently of step navigation.
      const choose = async (selector, checked = true) => page.locator(selector).evaluate((el, checked) => {
        el.checked = checked; el.dispatchEvent(new Event('change', { bubbles: true }));
      }, checked);
      const dateState = () => page.locator('#' + date).evaluate(el => ({ disabled: el.disabled, required: el.required, value: el.value }));
      assert.equal((await dateState()).disabled, true);
      await choose(`[name="${plan}"][value="Sí"]`);
      assert.equal((await dateState()).required, true);
      await page.locator('#' + date).evaluate(el => el.value = '2027-01');
      await choose(`[name="${plan}"][value="No"]`);
      assert.deepEqual(await dateState(), { disabled: true, required: false, value: '' });
      await choose(`[name="${plan}"][value="Sí"]`);
      await choose('#' + iso);
      assert.deepEqual(await dateState(), { disabled: true, required: false, value: '' });
      await page.locator('#p06_iso9001_vigencia').evaluate(el => el.value = '2028-01');
      await choose('#p06_ninguno');
      assert.equal(await page.locator('#' + iso).isChecked(), false);
      assert.deepEqual(await page.locator('#p06_iso9001_vigencia').evaluate(el => [el.disabled, el.value]), [true, '']);
      await choose('#' + iso);
      assert.equal(await page.locator('#p06_ninguno').isChecked(), false);
      if (m) {
        for (const kind of ['cnc', 'corte']) {
          const sel = page.locator(`#p04_${kind}_01_tipo`);
          assert.equal(await sel.evaluate(el => el.tagName), 'SELECT');
          const types = kind === 'cnc'
            ? ['Fresadora CNC', 'Centros de maquinado CNC en diferentes dimensiones de mesa', 'Mandriladora CNC en diferentes dimensiones de mesa', 'Torno CNC en diferentes tamaños']
            : ['Pantógrafo', 'Láser', 'Plasma', 'Chorro de agua', 'Oxígeno'];
          assert.deepEqual(await sel.locator('option').evaluateAll(options => options.map(option => option.value)), ['', ...types]);
          assert.deepEqual(await sel.locator('option').allTextContents(), ['Seleccione un tipo', ...types]);
          await sel.selectOption(types[0]);
          await choose(`#p04_${kind}_no_aplica`);
          assert.deepEqual(await sel.evaluate(el => [el.disabled, el.required, el.value]), [true, false, '']);
          await choose(`#p04_${kind}_no_aplica`, false);
          assert.equal(await sel.evaluate(el => el.required), true);
        }
        await page.evaluate(() => { addCncRow(); addCorteRow(); });
        assert.equal(await page.locator('#p04_cnc_02_tipo').count(), 1);
        assert.equal(await page.locator('#p04_corte_02_tipo').count(), 1);
        await page.evaluate(() => { window.confirm = () => true; removeTableRow(document.querySelector('#p04_cnc_tbody tr'), 'cnc'); });
        assert.equal(await page.locator('#p04_cnc_01_tipo').count(), 1);
        assert.equal(await page.locator('#p04_cnc_02_tipo').count(), 0);
        assert.match(await page.locator('#p43_indice_accidentes_label').textContent(), /Durante el año pasado,/);
        assert.equal(await page.locator('#anio_referencia_accidentes').inputValue(), String(new Date().getFullYear() - 1));
      }
      if (!d) {
        await page.locator('.si-score').evaluateAll(fields => fields.forEach(el => { el.value = '10'; el.dispatchEvent(new Event('change')); }));
        assert.equal(await page.locator('#subtotal_seguridad_informacion').inputValue(), '80');
      }
      // Keep real submit handlers; isolate submission from unrelated required questions.
      await page.evaluate(() => { findFirstInvalidStep = () => -1; document.querySelector('[name="empresa_nombre"]').value = 'Harness fixture'; });
      const submit = () => page.locator('form').evaluate(el => el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
      await submit();
      await page.waitForFunction(() => !isSubmitting);
      assert.equal(requests, 1);
      assert.ok(!page.url().includes('/thanks/'));
      assert.equal(await page.locator('[name="empresa_nombre"]').inputValue(), 'Harness fixture');
      result = 'network';
      await submit();
      await page.waitForFunction(() => !isSubmitting);
      assert.equal(await page.locator('[name="empresa_nombre"]').inputValue(), 'Harness fixture');
      result = 'ok';
      await submit();
      await page.waitForURL('**/thanks/index.html');
      assert.match(await page.locator('h1').textContent(), /Gracias/);
      assert.equal(await page.locator('#currentYear').textContent(), String(new Date().getFullYear()));
      assert.deepEqual(errors, []);
      console.log('PASS', folder, 'conditions, payload fields, mocked HTTP/network errors and success redirect');
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
