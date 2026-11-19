import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import {
  ValidateOutput, explainFailure, itemsFromJing, itemsFromMalformed, itemsFromValidate,
  severityFor, underline, downloadedUrl, aboutDetail, REPOSITORY, parseOutput,
  installerPython, choosePython,
} from '../parse';

test('severityFor maps Schematron roles', () => {
  assert.equal(severityFor(''), 'error');
  assert.equal(severityFor('Warning'), 'warning');
  assert.equal(severityFor('info'), 'info');
  assert.equal(severityFor('fatal'), 'error');
});

test('itemsFromValidate: violations, unknown lines and XPath errors', () => {
  const out: ValidateOutput = {
    version: '1.4', schema: '/s.sch', source: { path: '/s.sch', type: 'sch' },
    documents: [{
      file: '/d.xml',
      violations: [
        { pattern: 'p1', context: 'tei:p', type: 'assert', role: '', message: 'too long:',
          text: 'too long: 20', path: '/x', line: 5, xml_id: 'p2' },
        { pattern: '', context: 'x', type: 'report', role: 'warning', message: 'm',
          text: '', path: '/y', line: null, xml_id: null },
      ],
      xpath_errors: [{ message: 'broken', context: 'tei:p', error: 'NPE', nodes: 3 }],
    }],
  };
  const items = itemsFromValidate(out, '/d.xml');
  assert.equal(items.length, 3);
  assert.deepEqual(items[0], { line: 4, message: 'too long: 20', severity: 'error',
                               source: 'Schematron', code: 'p1' });
  assert.equal(items[1].line, -1);
  assert.equal(items[1].message, 'm');          // falls back to static message
  assert.equal(items[1].severity, 'warning');
  assert.match(items[2].message, /1 rule\(s\) failed.*\n• broken \[tei:p\]: NPE \(3 nodes\)/s);
});

test('itemsFromValidate: malformed document', () => {
  const out: ValidateOutput = {
    version: '1.4', schema: '/s.sch', source: { path: '/s.sch', type: 'sch' },
    documents: [{ file: '/d.xml', error: 'not well-formed', error_line: 7 }],
  };
  assert.deepEqual(itemsFromValidate(out, '/d.xml'),
    [{ line: 6, message: 'not well-formed', severity: 'error', source: 'XML' }]);
});

test('itemsFromMalformed: a tag mismatch also flags where the tag was opened', () => {
  const msg = 'El documento test.xml no está bien formado: Opening and ending tag ' +
    'mismatch: notde line 47 and note, line 81, column 18. Corrígelo antes de validar.';
  const items = itemsFromMalformed(msg, 81);
  assert.deepEqual(items.map(i => [i.line, i.source]), [[80, 'XML'], [46, 'XML']]);
  assert.equal(items[1].message,
    '<notde> opened here is never closed: the next end tag is </note> (line 81). ' +
    'Check for a typo in the element name.');
  // other well-formedness errors: just the one item
  assert.equal(itemsFromMalformed("error parsing attribute name, line 4, column 1", 4).length, 1);
});

test('itemsFromJing can drop fatal errors', () => {
  const txt = '/w/d.xml:47:50: error: element "notde" not allowed anywhere\n' +
              '/w/d.xml:81:13: fatal: The element type "notde" must be terminated';
  assert.deepEqual(itemsFromJing(txt, '/w/d.xml', true).map(i => i.line), [46]);
  assert.deepEqual(itemsFromJing(txt, '/w/d.xml').map(i => i.line), [46, 80]);
});

test('itemsFromJing keeps only lines for the target file', () => {
  const txt = [
    '/w/doc.xml:3:15: error: element "foo" not allowed here',
    '/w/other.xml:1:1: error: nope',
    'Picked up _JAVA_OPTIONS: -Dx=y',
    '/w/doc.xml:9:2: warning: hmm',
  ].join('\n');
  const items = itemsFromJing(txt, '/w/doc.xml');
  assert.deepEqual(items.map(i => [i.line, i.col, i.severity]),
                   [[2, 14, 'error'], [8, 1, 'warning']]);
});

test('explainFailure: missing module names the interpreter', () => {
  const f = explainFailure("ModuleNotFoundError: No module named 'saxonche'", '/usr/bin/python3');
  assert.equal(f.interpreter, true);
  assert.match(f.message, /"\/usr\/bin\/python3" does not have the 'saxonche' module/);
  assert.match(f.message, /"\/usr\/bin\/python3" -m pip install saxonche lxml/);
});

test('explainFailure: other errors keep the last meaningful lines', () => {
  assert.deepEqual(
    explainFailure('[esquema] 1 patterns\nNo existe el documento: /x.xml\n', 'python3'),
    { interpreter: false, message: 'No existe el documento: /x.xml' });
});

// End-to-end against the real py-schematron.py, when VALIDATE_PYTHON points at an
// interpreter with saxonche (skipped otherwise).
test('py-schematron.py --json round trip', { skip: !process.env.VALIDATE_PYTHON }, () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sch-'));
  const sch = path.join(dir, 't.sch');
  const doc = path.join(dir, 'd.xml');
  fs.writeFileSync(sch, `<schema xmlns="http://purl.oclc.org/dsdl/schematron" queryBinding="xslt2">
  <ns prefix="tei" uri="http://www.tei-c.org/ns/1.0"/>
  <pattern id="len"><let name="max" value="3"/>
    <rule context="tei:p"><assert test="string-length(.) le $max" role="warning"><name/> too long: <value-of select="string-length(.)"/>, rend="<value-of select="@rend"/>"</assert></rule>
  </pattern>
</schema>`);
  fs.writeFileSync(doc, `<TEI xmlns="http://www.tei-c.org/ns/1.0">
  <p>ok</p>
  <p rend="x">much too long</p>
</TEI>`);
  const validator = path.resolve(__dirname, '..', '..', 'py-schematron.py');
  let stdout = '';
  try {
    execFileSync(process.env.VALIDATE_PYTHON!, [validator, '--json', '-s', sch, doc],
                 { stdio: ['ignore', 'pipe', 'ignore'] });
  } catch (e: any) {
    assert.equal(e.status, 1);                  // violations found
    stdout = e.stdout.toString();
  }
  const items = itemsFromValidate(JSON.parse(stdout), doc);
  // <name/> gives the element name; value-of on an attribute gives its value,
  // with the surrounding quotes kept tight.
  // ...and the rule's location: line 4 of t.sch, its assert
  assert.deepEqual(items, [{ line: 2, message: 'p too long: 13, rend="x"', severity: 'warning',
                             source: 'Schematron', code: 'len',
                             // (the program resolves the path: on Windows the
                             // temporary folder's short name gets its long one)
                             rules: [{ file: fs.realpathSync.native(sch), line: 4,
                                       label: 'The rule: t.sch, line 4' }] }]);
});

test('itemsFromValidate links rules, and keeps working without them (before 1.21)', () => {
  const base = { version: '1.21', schema: 's', source: { path: 'p', type: 'rng' as const } };
  const v = { pattern: 'p1', context: 'tei:p', type: 'assert' as const, role: '', message: 'm',
              text: 'm', path: '/x', line: 3, xml_id: null };
  const rule = { file: '/s/smed-schema.xml', line: 186 };
  const [linked] = itemsFromValidate({ ...base, documents: [{ file: 'd.xml', violations: [{ ...v, rule }] }] }, 'd.xml');
  assert.deepEqual(linked.rules, [{ ...rule, label: 'The rule: smed-schema.xml, line 186' }]);
  const [plain] = itemsFromValidate({ ...base, documents: [{ file: 'd.xml', violations: [v] }] }, 'd.xml');
  assert.equal(plain.rules, undefined);
  const items = itemsFromValidate({ ...base, documents: [{ file: 'd.xml', violations: [], xpath_errors: [
    { message: 'broken', context: 'tei:p', error: 'XPTY0004', nodes: 2, rule },
    { message: '', context: 'tei:q', error: 'XPST0008', nodes: 1 }] }] }, 'd.xml');
  assert.deepEqual(items[0].rules, [{ ...rule, label: 'Failed: broken: smed-schema.xml, line 186' }]);
});

test('underline never yields an empty range', () => {
  // jing points just after a start tag that ends the line
  const l47 = '        <p>texto <notde type="x">';
  assert.deepEqual(underline(l47, l47.length), [l47.indexOf('<notde'), l47.length]);
  // column in the middle of the line: from the tag's "<" to the column
  assert.deepEqual(underline('<p>c<bogus/></p>', 12), [4, 12]);
  // no column: the content without indentation or trailing spaces
  assert.deepEqual(underline('    </note>   '), [4, 11]);
  // column past the end, no "<" before it
  assert.deepEqual(underline('  plain text', 40), [2, 12]);
});

test('downloadedUrl reads an older script\'s stderr', () => {
  assert.equal(downloadedUrl(undefined, '[xml-model] esquema detectado: https://x/s.rng\n' +
                             '[descarga] https://x/s.rng\n[esquema] 3 patterns'), 'https://x/s.rng');
  assert.equal(downloadedUrl(undefined, '[caché] https://x/s.rng ya descargado -> a-s.rng'), undefined);
});

test('aboutDetail: version, author, licence, repository and the program', () => {
  const text = aboutDetail('9.9.9', 'py-schematron.py 1.2\nPython: 3.15\n');
  const lines = text.split('\n');
  assert.equal(lines[0], 'Schematron Validator for VS Code 9.9.9');
  assert.ok(text.includes('Nicolas Vaughan <nicolasvaughan@proton.me>'));
  assert.ok(text.includes('GNU General Public License, version 3 or later'));
  assert.ok(text.includes(`Code: ${REPOSITORY}`));
  assert.ok(text.endsWith('py-schematron.py 1.2\nPython: 3.15'));
});

test('parseOutput: a report, a fatal error, or neither', () => {
  const report = parseOutput(JSON.stringify(
    { version: '1.21', schema: 's', source: { path: 'p', type: 'rng' }, documents: [], events: [] }));
  assert.ok(report && 'report' in report);
  const error = parseOutput(JSON.stringify(
    { version: '1.21', error: 'd.xml no lleva ninguna PI', events: [{ kind: 'warning', message: 'w' }] }));
  assert.deepEqual(error, { error: 'd.xml no lleva ninguna PI', events: [{ kind: 'warning', message: 'w' }] });
  assert.equal(parseOutput(''), undefined);
  assert.equal(parseOutput('Traceback (most recent call last):'), undefined);
  assert.equal(parseOutput('[1, 2]'), undefined);
});

test('downloadedUrl: from the events, or from stderr for an older script', () => {
  const base = { version: '1.21', schema: 's', source: { path: 'p', type: 'rng' as const }, documents: [] };
  const url = 'https://example.org/s.rng';
  assert.equal(downloadedUrl({ ...base, events: [
    { kind: 'xml-model', message: 'm', href: url },
    { kind: 'download', message: url, url, file: '/c/x-s.rng' }] }, ''), url);
  // events without a download: nothing was downloaded, whatever stderr says
  assert.equal(downloadedUrl({ ...base, events: [{ kind: 'cache', message: 'm', url }] },
                             `[descarga] ${url}`), undefined);
  // an older script: no events, so stderr
  assert.equal(downloadedUrl({ ...base }, `[xml-model] x\n[descarga] ${url}\n`), url);
  assert.equal(downloadedUrl(undefined, ''), undefined);
});

test('installerPython: where the installer puts its Python, on each system', () => {
  // (path.join of the system running the tests, as the extension uses it)
  assert.equal(installerPython('linux', '/home/a', {}),
               path.join('/home/a', '.local', 'share', 'py-schematron', 'venv', 'bin', 'python'));
  assert.equal(installerPython('linux', '/home/a', { XDG_DATA_HOME: '/d' }),
               path.join('/d', 'py-schematron', 'venv', 'bin', 'python'));
  assert.equal(installerPython('darwin', '/Users/a', {}),
               path.join('/Users/a', 'Library', 'Application Support', 'py-schematron', 'venv', 'bin', 'python'));
  assert.ok(installerPython('win32', 'C:\\Users\\a', { LOCALAPPDATA: 'C:\\Users\\a\\AppData\\Local' })
    .endsWith(path.join('py-schematron', 'venv', 'Scripts', 'python.exe')));
});

test('choosePython: the setting, else the installer\'s, else python3', () => {
  const yes = () => true, no = () => false;
  assert.equal(choosePython('/my/python', '/inst/python', yes, 'linux'), '/my/python');
  assert.equal(choosePython('', '/inst/python', yes, 'linux'), '/inst/python');
  assert.equal(choosePython(undefined, '/inst/python', no, 'linux'), 'python3');
  assert.equal(choosePython('', 'C:\\inst\\python.exe', no, 'win32'), 'python');
});

