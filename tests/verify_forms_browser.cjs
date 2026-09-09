/* Run: node tests/verify_forms_browser.cjs (requires Playwright and Chromium).
 * Requests to Formspree are always intercepted; no supplier data leaves this test.
 */
const { chromium } = require('playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const qaDirectory = process.env.FORM_QA_DIR || path.resolve('tmp/forms-qa');

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  try {
    for (const folder of fs.readdirSync(path.resolve('forms'))) {
      const page = await browser.newPage({ reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      let result = 'error', requests = 0, lastPayload = '';
      await page.route('https://**/*', async route => {
        if (route.request().url().includes('formspree.io')) {
          requests++;
          lastPayload = route.request().postData() || '';
          if (result === 'network') return route.abort();
          return route.fulfill({ status: result === 'ok' ? 200 : 422, contentType: 'application/json', body: result === 'ok' ? '{"ok":true}' : '{"errors":[{"message":"Test error"}]}' });
        }
        return process.env.FORM_QA_CDN === '1' ? route.continue() : route.abort();
      });
      await page.goto(pathToFileURL(path.resolve('forms', folder, 'index.html')).href);
      const m = folder.includes('maquinados'), d = folder.includes('distribuidor'), s = folder.includes('servicios');
      const certPrefix = s ? 'p04_' : 'p06_';
      const iso = m ? 'p06_iso9001_seleccion' : certPrefix + 'iso9001';
      const plan = m ? 'p08_planea_certificarse' : s ? 'p05_planea_certificarse' : d ? 'p07_planea_certificarse' : 'p07_planea_certificarse_iso9001';
      const date = m ? 'p08_fecha_certificacion_estimada' : s ? 'p05_fecha_certificacion' : d ? 'p07_fecha_certificacion' : 'p07_fecha_estimada_certificacion_iso9001';
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
      await page.locator('#' + certPrefix + 'iso9001_vigencia').evaluate(el => el.value = '2028-01');
      await choose('#' + certPrefix + 'ninguno');
      assert.equal(await page.locator('#' + iso).isChecked(), false);
      assert.deepEqual(await page.locator('#' + certPrefix + 'iso9001_vigencia').evaluate(el => [el.disabled, el.value]), [true, '']);
      await choose('#' + iso);
      assert.equal(await page.locator('#' + certPrefix + 'ninguno').isChecked(), false);
      if (s) await verifyServicesConditionals(page, choose);
      if (m) {
        for (const kind of ['cnc', 'corte']) {
          const sel = page.locator(`#p04_${kind}_01_tipo`);
          assert.equal(await sel.evaluate(el => el.tagName), 'SELECT');
          const types = kind === 'cnc'
            ? ['Fresadora CNC', 'Centros de maquinado CNC en diferentes dimensiones de mesa', 'Mandriladora CNC en diferentes dimensiones de mesa', 'Torno CNC en diferentes tamaños']
            : ['Pantógrafo', 'Láser', 'Plasma', 'Chorro de agua', 'Oxígeno'];
          assert.deepEqual(await sel.locator('option').evaluateAll(options => options.map(option => option.value)), ['', ...types]);
          assert.deepEqual(await sel.locator('option').allTextContents(), ['Seleccione un tipo', ...types]);
          await sel.selectOption(types[0], { force: true });
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
      if (d || s) {
        await verifyCompleteNavigation(page, s, choose);
      } else {
        await page.locator('.si-score').evaluateAll(fields => fields.forEach(el => { el.value = '10'; el.dispatchEvent(new Event('change')); }));
        assert.equal(await page.locator('#subtotal_seguridad_informacion').inputValue(), '80');
      }
      // New/extended forms use real full validation. Legacy forms isolate submit behavior.
      if (!d && !s) await page.evaluate(() => { findFirstInvalidStep = () => -1; document.querySelector('[name="empresa_nombre"]').value = 'Harness fixture'; });
      const submit = () => page.locator('form').evaluate(el => {
        el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        return document.getElementById('btnSubmit').disabled;
      });
      assert.equal(await submit(), true);
      await page.waitForFunction(() => !isSubmitting);
      assert.equal(requests, 1);
      if (d || s) {
        assert.match(lastPayload, /name="subtotal_seguridad_informacion"\r\n\r\n38/);
        assert.ok(!lastPayload.includes('name="' + date + '"'), 'Inactive date must not be sent');
        const first = s ? 32 : 43;
        for (let i = first; i < first + 8; i++) assert.ok(lastPayload.includes('name="p' + i + '_puntuacion_'));
        if (s) {
          assert.ok(!lastPayload.includes('name="p04_iso9001_archivo"'));
          assert.match(lastPayload, /name="p04_ninguno"/);
          assert.match(lastPayload, /name="empresa_puesto"/);
        }
      }
      assert.ok(!page.url().includes('/thanks/'));
      assert.equal(await page.locator('[name="empresa_nombre"]').inputValue(), 'Harness fixture');
      result = 'network';
      await submit();
      await page.waitForFunction(() => !isSubmitting);
      assert.equal(requests, 2, 'Duplicate submits must not create extra requests');
      assert.equal(await page.locator('[name="empresa_nombre"]').inputValue(), 'Harness fixture');
      result = 'ok';
      await submit();
      await page.waitForURL('**/thanks/index.html');
      assert.equal(requests, 3);
      assert.match(await page.locator('h1').textContent(), /Gracias/);
      assert.equal(await page.locator('#currentYear').textContent(), String(new Date().getFullYear()));
      assert.deepEqual(errors, []);
      if (qaDirectory && (d || s)) {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({ path: path.join(qaDirectory, (s ? 'servicios' : 'distribuidores') + '-thanks-mobile.png'), fullPage: true });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      }
      console.log('PASS', folder, 'conditions, payload fields, mocked HTTP/network errors and success redirect');
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

async function verifyServicesConditionals(page, choose) {
  const fixture = { name: 'evidencia.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\nHarness evidence\n') };
  for (const cert of ['iso9001', 'vda64', 'iso45001', 'iso14001', 'tisax', 'otros']) {
    await choose('#p04_' + cert);
    const file = page.locator('#p04_' + cert + '_archivo');
    assert.equal(await file.evaluate(el => el.required && !el.disabled && !el.checkValidity()), true);
    await file.setInputFiles(fixture);
    assert.equal(await file.evaluate(el => el.checkValidity()), true);
    await choose('#p04_ninguno');
    assert.deepEqual(await file.evaluate(el => [el.disabled, el.required, el.files.length]), [true, false, 0]);
  }
  await choose('[name="p03_servicios_empresa"][value="Otros"]');
  assert.equal(await page.locator('#p03_otros_servicios').evaluate(el => el.required), true);
  await page.locator('#p03_otros_servicios').evaluate(el => el.value = 'Otro servicio');
  await choose('[name="p03_servicios_empresa"][value="Otros"]', false);
  assert.deepEqual(await page.locator('#p03_otros_servicios').evaluate(el => [el.disabled, el.value]), [true, '']);
  for (const [name, detail, isFile] of [
    ['p09_organigrama', 'p09_archivo_organigrama', true], ['p10_referencias', 'p10_archivos_referencias', true],
    ['p11_capacitaciones', 'p11_detalle_capacitaciones'], ['p12_acceso_normas', 'p12_detalle_normas'],
    ['p13_cursos_seguridad', 'p13_detalle_cursos'], ['p21_utiliza_software', 'p21_software_utilizado'],
    ['p24_responsable_ambiental', 'p24_nombre_responsable'], ['p25_responsable_calidad', 'p25_nombre_responsable']
  ]) {
    await choose(`[name="${name}"][value="Sí"]`);
    const input = page.locator('#' + detail);
    assert.equal(await input.evaluate(el => el.required && !el.disabled), true);
    if (isFile) await input.setInputFiles(fixture);
    else await input.evaluate(el => el.value = 'Detalle de prueba');
    await choose(`[name="${name}"][value="No"]`);
    assert.deepEqual(await input.evaluate(el => [el.disabled, el.required, el.value]), [true, false, '']);
    assert.equal(await page.locator('form').evaluate((form, detail) => new FormData(form).has(detail), detail), false);
  }
}

async function verifyCompleteNavigation(page, services, choose) {
  const prefix = services ? 'p04_' : 'p06_';
  const plan = services ? 'p05_planea_certificarse' : 'p07_planea_certificarse';
  await choose('#' + prefix + 'ninguno');
  await choose(`[name="${plan}"][value="No"]`);
  await page.locator('#btnNext').click();
  assert.equal(await page.evaluate(() => currentStep), 0, 'Empty contact step must not advance');
  await page.locator('#empresa_nombre').fill('Harness fixture');
  await page.locator('#empresa_contacto').fill('Contacto de prueba');
  if (services) await page.locator('#empresa_puesto').fill('Compras');
  await page.locator('#empresa_direccion').fill('Dirección de prueba');
  await page.locator('#empresa_telefono').fill('2221234567');
  await page.locator('#empresa_email').fill('invalid');
  await page.locator('#btnNext').click();
  assert.equal(await page.evaluate(() => currentStep), 0);
  await page.locator('#empresa_email').fill('harness@example.test');
  await page.locator('#btnNext').click();
  assert.equal(await page.evaluate(() => currentStep), 1);
  if (qaDirectory) {
    fs.mkdirSync(qaDirectory, { recursive: true });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: path.join(qaDirectory, (services ? 'servicios' : 'distribuidores') + '-general-desktop.png'), fullPage: true });
  }
  const totalSteps = await page.locator('.form-step').count();
  for (let step = 1; step < totalSteps - 1; step++) {
    // Answer each visible question; navigate exclusively with the real Next button.
    await page.locator(`.form-step[data-step="${step}"]`).evaluate(scope => {
      for (const el of scope.querySelectorAll('input:enabled, textarea:enabled, select:enabled')) {
        if (el.type === 'radio') {
          if (el.value === 'No') { el.checked = true; el.dispatchEvent(new Event('change', { bubbles: true })); }
        } else if (el.type === 'checkbox' || el.type === 'file' || el.type === 'hidden' || el.readOnly) continue;
        else if (el.type === 'number') el.value = '1';
        else if (el.required) el.value = 'Respuesta de prueba';
      }
      for (const group of scope.querySelectorAll('[data-checkbox-group]')) {
        const first = group.querySelector('input[type="checkbox"]');
        first.checked = true; first.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.locator('#btnNext').click();
    assert.equal(await page.evaluate(() => currentStep), step + 1);
    assert.equal(await page.locator('.form-step:not(.d-none)').count(), 1);
    assert.equal(await page.locator('.form-step:visible').count(), 1);
  }
  assert.equal(await page.locator('#btnNext').isVisible(), false);
  assert.equal(await page.locator('#btnSubmit').isVisible(), true);
  await page.locator('#btnSubmit').click();
  assert.equal(await page.evaluate(() => currentStep), totalSteps - 1);
  assert.ok(await page.locator('.si-score.is-invalid').count() > 0, 'Unanswered scores block submission');
  const scores = [0, 4, 6, 8, 10, 0, 4, 6];
  for (let i = 0; i < 8; i++) await page.locator('.si-score').nth(i).selectOption(String(scores[i]));
  assert.equal(await page.locator('#subtotal_seguridad_informacion').inputValue(), '38');
  // An added invalid option must still fail the explicit score contract.
  await page.locator('.si-score').first().evaluate(el => { el.add(new Option('Invalid', '7')); el.value = '7'; });
  assert.equal(await page.evaluate(() => validateStep(getStep(currentStep), false)), false);
  await page.locator('.si-score').first().selectOption('0');
  await page.locator('.si-score').first().evaluate(el => el.querySelector('option[value="7"]').remove());
  // Final submission must revalidate earlier steps too, without any request.
  await page.locator('#empresa_nombre').evaluate(el => el.value = '');
  await page.locator('#btnSubmit').click();
  assert.equal(await page.evaluate(() => currentStep), 0);
  await page.locator('#empresa_nombre').fill('Harness fixture');
  for (let i = 0; i < totalSteps - 1; i++) await page.locator('#btnNext').click();
  assert.equal(await page.evaluate(() => currentStep), totalSteps - 1);
  assert.equal(await page.evaluate(() => validateStep(getStep(currentStep), false)), true);
  if (qaDirectory) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: path.join(qaDirectory, (services ? 'servicios' : 'distribuidores') + '-security-mobile.png'), fullPage: true });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'No horizontal overflow on mobile');
  }
  // A stale/tampered subtotal must be overwritten by the submit handler.
  await page.locator('#subtotal_seguridad_informacion').evaluate(el => el.value = '999');
}
