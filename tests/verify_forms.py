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
    "fabricantes": ROOT / "forms/08015p22_autoevaluacion_fabricantes/index.html",
    "maquinados": ROOT / "forms/08015p22_evaluacion maquinados/index.html",
    "distribuidores": ROOT / "forms/08015p23_evaluación_distribuidor/index.html",
}
EXPECTED_QUESTIONS = {
    "fabricantes": set(range(1, 63)),
    "maquinados": set(range(1, 55)),
    "distribuidores": set(range(1, 43)),
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
    def test_catalog_has_exactly_three_form_links(self) -> None:
        _, page = parse(ROOT / "index.html")
        links = [attrs["href"] for tag, attrs in page.tags if tag == "a" and attrs.get("href", "").startswith("forms/")]
        self.assertEqual(3, len(links), links)
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
        ]
        for path in required:
            self.assertTrue(path.is_file() and path.stat().st_size > 0, str(path))


class FormContractTests(unittest.TestCase):
    def test_all_three_forms_are_present(self) -> None:
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
        production = [ROOT / "index.html", *FORMS.values()]
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
        self.assertIn("REEMPLAZAR_ENDPOINT_FORMSPREE", machining_html)
        self.assertIn("REEMPLAZAR_ENDPOINT_DISTRIBUIDORES", distributor_js)
        self.assertNotIn("mvkppyry", machining_html + distributor_js)


class JavaScriptSyntaxTests(unittest.TestCase):
    def test_javascript_parses(self) -> None:
        executable = shutil.which("node") or shutil.which("node.exe")
        if not executable:
            self.skipTest("Node.js no está disponible en PATH")
        for name, path in FORMS.items():
            result = subprocess.run(
                [executable, "--check", str(path.with_name("main.js"))],
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
