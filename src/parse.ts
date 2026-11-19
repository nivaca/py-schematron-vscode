// Pure parsing of py-xmlvalidate.py --json and jing output into editor-neutral
// diagnostic items. No dependency on the vscode API, so it can be unit-tested
// with plain Node.

import * as path from 'path';

export type Severity = 'error' | 'warning' | 'info';

export interface Item {
  /** 0-based line; -1 when unknown (shown on the first line). */
  line: number;
  /** 0-based column, when the tool reports one. */
  col?: number;
  message: string;
  severity: Severity;
  source: 'Schematron' | 'RelaxNG' | 'XML';
  code?: string;
  /** Where the rules behind it are, with a label for each (Schematron). */
  rules?: RuleLink[];
}

/** Where an assert or report is written (since py-xmlvalidate.py 1.21): in
 *  the ODD or RelaxNG it came from, the file one edits. Line is 1-based. */
export interface RuleLocation { file: string; line: number | null }

export interface RuleLink extends RuleLocation { label: string }

/** The label of a link to a rule: "The rule: smed-schema.xml, line 186". */
export function ruleLabel(rule: RuleLocation, what = 'The rule'): string {
  return `${what}: ${path.basename(rule.file)}` + (rule.line ? `, line ${rule.line}` : '');
}

export interface Violation {
  pattern: string;
  context: string;
  type: 'assert' | 'report';
  role: string;
  message: string;
  text: string;
  path: string;
  line: number | null;
  xml_id: string | null;
  rule?: RuleLocation;                // (since 1.21)
}

export interface XPathError {
  message: string;
  context: string;
  error: string;
  nodes: number;
  rule?: RuleLocation;                // (since 1.21)
}

export interface DocumentResult {
  file: string;
  violations?: Violation[];
  xpath_errors?: XPathError[];
  seconds?: number;
  error?: string;
  error_line?: number | null;
}

/** What py-xmlvalidate.py did on the way (since 1.21): a download, a cached
 *  copy, the extraction or harvest of the rules... `kind` and the data are
 *  stable; `message` is the program's own text (in Spanish). */
export interface ProgramEvent {
  kind: 'cache' | 'download' | 'xml-model' | 'schema' | 'extraction' | 'harvest' | 'warning' | string;
  message: string;
  url?: string;
  file?: string;
  [key: string]: unknown;
}

export interface ValidateOutput {
  version: string;
  schema: string;
  source: { path: string; type: 'rng' | 'sch' | 'odd' };
  documents: DocumentResult[];
  events?: ProgramEvent[];            // (absent before 1.21)
}

/** py-xmlvalidate.py's stdout with --json: a report, or (since 1.21) a fatal
 *  error with its message; undefined when it is neither (no JSON at all, as
 *  when Python itself fails, or an older script's error). */
export function parseOutput(stdout: string):
    { report: ValidateOutput } | { error: string; events: ProgramEvent[] } | undefined {
  let d: unknown;
  try { d = JSON.parse(stdout); } catch { return undefined; }
  if (!d || typeof d !== 'object') { return undefined; }
  const o = d as Record<string, unknown>;
  if (Array.isArray(o.documents)) { return { report: o as unknown as ValidateOutput }; }
  if (typeof o.error === 'string') {
    return { error: o.error, events: Array.isArray(o.events) ? o.events as ProgramEvent[] : [] };
  }
  return undefined;
}

/** Schematron `role` wins when it names a level; otherwise every failed
 *  assert or successful report is an error. */
export function severityFor(role: string): Severity {
  const r = role.trim().toLowerCase();
  if (r === 'warning' || r === 'warn') { return 'warning'; }
  if (r === 'info' || r === 'information' || r === 'hint') { return 'info'; }
  return 'error';
}

const toLine = (n: number | null | undefined) => (n && n > 0 ? n - 1 : -1);

export function itemsFromValidate(out: ValidateOutput, file: string): Item[] {
  const target = path.resolve(file);
  const doc = out.documents.find(d => path.resolve(d.file) === target)
    ?? out.documents[0];
  if (!doc) { return []; }
  if (doc.error) {
    return itemsFromMalformed(doc.error, doc.error_line);
  }
  const items: Item[] = (doc.violations ?? []).map(v => ({
    line: toLine(v.line),
    message: v.text || v.message,
    severity: severityFor(v.role),
    source: 'Schematron' as const,
    code: v.pattern || undefined,
    ...(v.rule?.file ? { rules: [{ ...v.rule, label: ruleLabel(v.rule) }] } : {}),
  }));
  const errs = doc.xpath_errors ?? [];
  if (errs.length) {
    const detail = errs
      .map(e => `• ${e.message || '(no message)'} [${e.context}]: ${e.error} (${e.nodes} nodes)`)
      .join('\n');
    items.push({
      line: -1,
      severity: 'warning',
      source: 'Schematron',
      message: `${errs.length} rule(s) failed to evaluate; the verdict is incomplete.\n${detail}`,
      rules: errs.filter(e => e.rule?.file).map(e => ({
        ...e.rule!, label: ruleLabel(e.rule!, `Failed: ${e.message || e.context}`) })),
    });
  }
  return items;
}

/** A not-well-formed document. The parser reports where it NOTICED the
 *  problem (e.g. the closing tag that doesn't match), which is often far
 *  from the typo; for a tag mismatch, also flag the line where the unclosed
 *  tag was opened. */
export function itemsFromMalformed(message: string, line?: number | null): Item[] {
  const items: Item[] = [{ line: toLine(line), message, severity: 'error', source: 'XML' }];
  const m = /Opening and ending tag mismatch: (\S+) line (\d+) and (\S+?),?\s/.exec(message);
  if (m && Number(m[2]) !== line) {
    const [, opened, at, closing] = m;
    items.push({
      line: Number(at) - 1, severity: 'error', source: 'XML',
      message: `<${opened}> opened here is never closed: the next end tag is </${closing}>` +
        (line ? ` (line ${line})` : '') + `. Check for a typo in the element name.`,
    });
  }
  return items;
}

/** Columns [start, end) to underline on a line. jing's column points just
 *  AFTER the offending start tag, often at the end of the line, which would
 *  give an empty (invisible) range; so the underline runs from that tag's
 *  "<" to the reported column. Without a column, the line's content (minus
 *  indentation and trailing spaces) is underlined. */
export function underline(text: string, col?: number): [number, number] {
  const first = text.search(/\S/);
  const whole: [number, number] = first < 0 ? [0, text.length] : [first, text.trimEnd().length];
  if (col === undefined) { return whole; }
  const c = Math.min(col, text.length);
  const lt = c > 0 ? text.lastIndexOf('<', c - 1) : -1;
  if (lt >= 0) { return [lt, Math.max(c, lt + 1)]; }
  return c < whole[1] ? [c, whole[1]] : whole;
}

// jing: "/abs/file.xml:12:34: error: message"
const JING_RE = /^(.*?):(\d+):(\d+): (error|warning|fatal): (.*)$/;

/** `dropFatal`: leave out jing's fatal (well-formedness) errors, when
 *  py-xmlvalidate.py has already reported the document as not well-formed. */
export function itemsFromJing(output: string, file: string, dropFatal = false): Item[] {
  const target = path.resolve(file);
  const items: Item[] = [];
  for (const raw of output.split(/\r?\n/)) {
    const m = JING_RE.exec(raw.trim());
    if (!m) { continue; }
    const [, f, line, col, level, msg] = m;
    if (path.resolve(f) !== target || (dropFatal && level === 'fatal')) { continue; }
    items.push({
      line: Number(line) - 1,
      col: Math.max(Number(col) - 1, 0),
      message: msg,
      severity: level === 'warning' ? 'warning' : 'error',
      source: 'RelaxNG',
    });
  }
  return items;
}

export interface Failure {
  message: string;
  /** True when the problem is the Python interpreter itself (missing
   *  modules), so the user should pick another one. */
  interpreter: boolean;
}

/** URL that py-xmlvalidate.py downloaded in this run, if any: from the
 *  report's events, or, from a script older than 1.21, which has none, from
 *  its "[descarga] URL" line on stderr. */
export function downloadedUrl(report: ValidateOutput | undefined, stderr: string): string | undefined {
  if (report?.events) {
    return report.events.find(e => e.kind === 'download')?.url;
  }
  return /^\[descarga\] (\S+)/m.exec(stderr)?.[1];
}

/** Best explanation from py-xmlvalidate.py's stderr when it produced no JSON
 *  (environment errors, exit code 3). `python` is the interpreter used. */
export function explainFailure(stderr: string, python: string): Failure {
  const mod = /No module named '?(saxonche|lxml)/.exec(stderr)?.[1];
  if (mod) {
    return {
      interpreter: true,
      message: `The Python interpreter "${python}" does not have the '${mod}' module. ` +
        `Choose an interpreter that has saxonche and lxml (schematron.pythonPath), ` +
        `or install them into this one: "${python}" -m pip install saxonche lxml`,
    };
  }
  const lines = stderr.split(/\r?\n/).map(l => l.trim())
    .filter(l => l && !/^\[(caché|descarga|xml-model|esquema|extracción|cosecha|aviso)\]/.test(l));
  return { interpreter: false,
           message: lines.slice(-3).join(' ') || 'py-xmlvalidate.py failed without a message.' };
}

export const REPOSITORY = 'https://codeberg.org/nivaca/py-xmlvalidate-vscode';

/** The text of the About command: the extension's version, author, licence
 *  and repository, then what its py-xmlvalidate.py says of itself
 *  (`--about`), or why that could not be run. */
export function aboutDetail(version: string, program: string): string {
  return [
    `Schematron Validator for VS Code ${version}`,
    '',
    'Checks XML documents, TEI editions in particular, against the Schematron ' +
      'rules of their schema as you type, and their RelaxNG structure with jing.',
    '',
    'Author: Nicolas Vaughan <nicolasvaughan@proton.me>',
    'Licence: GNU General Public License, version 3 or later',
    `Code: ${REPOSITORY}`,
    '',
    'Its py-xmlvalidate.py (--about):',
    '',
    program.trim(),
  ].join('\n');
}
