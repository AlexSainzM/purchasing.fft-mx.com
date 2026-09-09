"""Harness estático para los formularios FFT.

Ejecutar desde la raíz del repositorio:
    python tests/verify_forms.py
"""

from __future__ import annotations

import re
import shutil
import subprocess
import sys
import unittest
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parents[1]
FORMS = {
    "servicios": ROOT / "forms/08015p21_autoevaluacion_servicios/index.html",
    "fabricantes": ROOT / "forms/08015p22_autoevaluacion_fabricantes/index.html",
    "maquinados": ROOT / "forms/08015p22_evaluacion maquinados/index.html",
    "distribuidores": ROOT / "forms/08015p23_evaluación_distribuidor/index.html",
}
EXPECTED_QUESTIONS = {
    "servicios": set(range(1, 40)),
    "fabricantes": set(range(1, 63)),
    "maquinados": set(range(1, 55)),
    "distribuidores": set(range(1, 51)),
}
COMMON_FIELDS = {
    "empresa_nombre",
    "empresa_contacto",
    "empresa_direccion",
    "empresa_telefono",
    "empresa_email",
}


class ParsedHTML(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.tags: list[tuple[str, dict[str, str]]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.tags.append((tag, {key: value or "" for key, value in attrs}))


def parse(path: Path) -> tuple[str, ParsedHTML]:
    source = path.read_text(encoding="utf-8")
    parser = ParsedHTML()
    parser.feed(source)
    return source, parser


def local_reference(base: Path, value: str) -> Path | None:
    parsed = urlparse(value)
    if not value or parsed.scheme or value.startswith(('#', 'mailto:', 'tel:')):
        return None
    clean = unquote(parsed.path)
    return (base / clean).resolve()


class CatalogContractTests(unittest.TestCase):
    def test_catalog_has_exactly_four_form_links(self) -> None:
        _, page = parse(ROOT / "index.html")
        links = [attrs["href"] for tag, attrs in page.tags if tag == "a" and attrs.get("href", "").startswith("forms/")]
        self.assertEqual(4, len(links), links)
        for href in links:
            target = local_reference(ROOT, href)
            self.assertIsNotNone(target)
            self.assertTrue(target.is_file(), f"Enlace roto: {href}")

    def test_required_documents_exist(self) -> None:
        required = [
            ROOT / "docs/PROJECT_OVERVIEW.md",
            ROOT / "docs/INSPECTION_MODEL.md",
            ROOT / "docs/FORM_LOGIC_MATRIX.md",
            ROOT / "docs/AUDIT_REPORT_2026-08-26.md",
            ROOT / "docs/specs/001-catalogo-tres-formularios.md",
            ROOT / "docs/specs/003-servicios-seguridad-distribuidores.md",
        ]
        for path in required:
            self.assertTrue(path.is_file() and path.stat().st_size > 0, str(path))


class FormContractTests(unittest.TestCase):
    def test_all_four_forms_are_present(self) -> None:
        for path in FORMS.values():
            self.assertTrue(path.is_file(), str(path))
            self.assertTrue(path.with_name("main.js").is_file(), str(path.with_name("main.js")))
            self.assertTrue(path.with_name("styles.css").is_file(), str(path.with_name("styles.css")))

    def test_ids_are_unique_and_labels_resolve(self) -> None:
        for name, path in FORMS.items():
            _, page = parse(path)
            ids = [attrs["id"] for _, attrs in page.tags if attrs.get("id")]
            duplicates = [item for item, count in Counter(ids).items() if count > 1]
            self.assertEqual([], duplicates, f"{name}: ids duplicados {duplicates}")
            known_ids = set(ids)
            broken_labels = [attrs["for"] for tag, attrs in page.tags if tag == "label" and attrs.get("for") and attrs["for"] not in known_ids]
            self.assertEqual([], broken_labels, f"{name}: labels sin control {broken_labels}")

    def test_common_supplier_fields(self) -> None:
        for name, path in FORMS.items():
            source, _ = parse(path)
            names = set(re.findall(r'\bname="([^"]+)"', source))
            self.assertTrue(COMMON_FIELDS <= names, f"{name}: faltan {sorted(COMMON_FIELDS - names)}")

    def test_question_coverage(self) -> None:
        for name, path in FORMS.items():
            source, _ = parse(path)
            declared = {int(value) for value in re.findall(r'data-question="(\d+)"', source)}
            field_prefixes = {int(value) for value in re.findall(r'\bp(\d{2})_', source)}
            observed = declared | field_prefixes
            missing = EXPECTED_QUESTIONS[name] - observed
            self.assertEqual(set(), missing, f"{name}: preguntas ausentes {sorted(missing)}")

    def test_conditional_triggers_have_targets(self) -> None:
        for name, path in FORMS.items():
            _, page = parse(path)
            triggers = {attrs["data-conditional-trigger"] for _, attrs in page.tags if attrs.get("data-conditional-trigger")}
            targets = {attrs["data-conditional"] for _, attrs in page.tags if attrs.get("data-conditional")}
            self.assertTrue(triggers <= targets, f"{name}: destinos ausentes {sorted(triggers - targets)}")

    def test_one_initially_visible_step(self) -> None:
        for name, path in FORMS.items():
            _, page = parse(path)
            steps = [attrs for tag, attrs in page.tags if tag == "fieldset" and "form-step" in attrs.get("class", "").split()]
            visible = [attrs for attrs in steps if "d-none" not in attrs.get("class", "").split()]
            self.assertGreater(len(steps), 1, name)
            self.assertEqual(1, len(visible), f"{name}: pasos visibles al iniciar")

    def test_no_template_placeholders_or_broken_local_assets(self) -> None:
        production = [ROOT / "index.html", *FORMS.values(), *(p.parent / 'thanks/index.html' for p in FORMS.values())]
        for path in production:
            source, page = parse(path)
            self.assertNotRegex(source, r"\{\{[A-Z0-9_]+\}\}", str(path))
            for tag, attrs in page.tags:
                attribute = "src" if tag in {"img", "script"} else "href" if tag == "link" else None
                if not attribute or not attrs.get(attribute):
                    continue
                target = local_reference(path.parent, attrs[attribute])
                if target is not None:
                    self.assertTrue(target.is_file(), f"{path}: recurso roto {attrs[attribute]}")

    def test_formspree_endpoints_are_isolated(self) -> None:
        manufacturer_js = FORMS["fabricantes"].with_name("main.js").read_text(encoding="utf-8")
        machining_html = FORMS["maquinados"].read_text(encoding="utf-8")
        distributor_js = FORMS["distribuidores"].with_name("main.js").read_text(encoding="utf-8")
        self.assertIn("https://formspree.io/f/mvkppyry", manufacturer_js)
        self.assertIn("https://formspree.io/f/myeygeqy", machining_html)
        self.assertIn("https://formspree.io/f/mzebpelz", distributor_js)
        self.assertNotIn("mvkppyry", machining_html + distributor_js)
        services_js = FORMS['servicios'].with_name('main.js').read_text(encoding='utf-8')
        self.assertIn('https://formspree.io/f/mbgjqzka', services_js)
        for other_id in ('mvkppyry', 'myeygeqy', 'mzebpelz'):
            self.assertNotIn(other_id, services_js)

    def test_certification_and_thanks_contract(self) -> None:
        for name, path in FORMS.items():
            source, page = parse(path)
            self.assertIn('name="p04_ninguno"' if name == 'servicios' else 'name="p06_ninguno"', source, name)
            self.assertIn('assets/js/certifications.js', source, name)
            self.assertTrue((path.parent / 'thanks/index.html').is_file())
            self.assertIn("new URL('thanks/index.html', window.location.href)", path.with_name('main.js').read_text(encoding='utf-8'))

    def test_security_questions_match_manufacturers(self) -> None:
        manufacturer = FORMS['fabricantes'].read_text(encoding='utf-8')
        for name, first in [('maquinados', 47), ('distribuidores', 43), ('servicios', 32)]:
            source = FORMS[name].read_text(encoding='utf-8')
            for offset in range(8):
                labels, options = [], []
                for html, question in ((manufacturer, 55 + offset), (source, first + offset)):
                    block = re.search(r'data-question="' + str(question) + r'">(.*?)</select>', html, re.S).group(1)
                    labels.append(re.search(r'fw-semibold">\d+\. (.*?)</label>', block, re.S).group(1))
                    options.append(re.findall(r'<option value="(.*?)">(.*?)</option>', block))
                self.assertEqual(*labels, name)
                self.assertEqual(*options, name)

    def test_services_pdf_contract(self) -> None:
        source, page = parse(FORMS['servicios'])
        self.assertIn('03.06.2026', source)
        self.assertIn('name="documento_referencia" value="08015p21"', source)
        self.assertIn('name="empresa_puesto"', source)
        self.assertEqual(list(range(1, 40)), [int(attrs['data-question']) for _, attrs in page.tags if 'data-question' in attrs])
        for cert in ('iso9001', 'vda64', 'iso45001', 'iso14001', 'tisax', 'otros'):
            for detail in ('vigencia', 'archivo'):
                fields = [attrs for _, attrs in page.tags if attrs.get('name') == f'p04_{cert}_{detail}']
                self.assertEqual(1, len(fields))
                self.assertIn('disabled', fields[0])
                self.assertEqual('true', fields[0].get('data-required'))
        services = [attrs['value'] for _, attrs in page.tags if attrs.get('name') == 'p03_servicios_empresa']
        self.assertEqual(['Programación de robot', 'Programación de PLC', 'Instalación eléctrica', 'Instalación mecánica', 'Instalación neumática', 'Diseño y simulación', 'Administración', 'Sistemas informáticos', 'Servicios financieros', 'Otros'], services)


class JavaScriptSyntaxTests(unittest.TestCase):
    def test_javascript_parses(self) -> None:
        executable = shutil.which("node") or shutil.which("node.exe")
        if not executable:
            self.skipTest("Node.js no está disponible en PATH")
        scripts = [(name, path.with_name('main.js')) for name, path in FORMS.items()]
        scripts += [('shared', path) for path in (ROOT / 'assets/js').glob('*.js')]
        for name, script in scripts:
            result = subprocess.run(
                [executable, "--check", str(script)],
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                check=False,
            )
            self.assertEqual(0, result.returncode, f"{name}: {result.stderr}")


if __name__ == "__main__":
    suite = unittest.defaultTestLoader.loadTestsFromModule(sys.modules[__name__])
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    raise SystemExit(0 if result.wasSuccessful() else 1)
