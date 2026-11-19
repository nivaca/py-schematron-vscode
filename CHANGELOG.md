# Changelog

All notable changes to the Schematron Validator extension. Each version
bundles its own copy of `py-schematron.py`; its version is given where it
changed. The releases, with their `.vsix` files, are on
[Codeberg](https://codeberg.org/nivaca/py-schematron-vscode/releases) and
[GitHub](https://github.com/nivaca/py-schematron-vscode/releases); until
0.5.12 they were published in
[py-schematron](https://codeberg.org/nivaca/py-schematron/releases).

## 0.10.0 — 2026-11-19 (py-schematron.py 2.0)

- The program behind the extension is renamed **py-schematron** (it was
  py-xmlvalidate), and so is this repository: nivaca/py-schematron-vscode
  on Codeberg and GitHub; the old addresses redirect to it. The extension
  keeps its name, Schematron Validator (`NicolasVaughan.validate-schematron`),
  and its settings; the bundled program is now
  `validator/py-schematron.py`. If `schematron.validatorPath` points to a
  copy of the old `py-xmlvalidate.py`, point it to `py-schematron.py`.
- Carries py-schematron.py 2.0.

## 0.9.0 — 2026-11-19 (py-xmlvalidate.py 1.21)

- The extension no longer reads the program's Spanish messages on stderr:
  the program's fatal errors come from its JSON, word for word, and
  **Refresh Schema** learns of a download from the report's events. With
  an older `py-xmlvalidate.py` (named in `schematron.validatorPath`),
  stderr is still read as before.
- **Go to Rule.** Each Schematron error links to the assert or report
  that reported it, in the ODD or RelaxNG it came from (the file you edit,
  not the `.sch` made from it): under the error, in the hover and in the
  Problems panel. **Schematron: Go to Rule** and the lightbulb open it for
  the error under the cursor. A rule that failed to evaluate is linked the
  same way. Needs py-xmlvalidate.py 1.21, which says where each rule is.
- The tests run on GitHub every Monday too.

## 0.8.0 — 2026-11-18 (py-xmlvalidate.py 1.20)

- **Restricted Mode.** The extension declares what it does in a folder that
  is not trusted: it still validates, but it ignores the folder's own
  values for `schematron.pythonPath`, `schematron.validatorPath` and
  `schematron.jingPath`, so a downloaded folder cannot make it run a
  program of its choosing. VS Code shows this in the Restricted Mode
  dialog. Virtual workspaces are declared unsupported.
- The publishing workflow creates the extension's namespace on Open VSX the
  first time, so publishing there needs only the `OVSX_PAT` secret.
- Carries py-xmlvalidate.py 1.20, whose `-o` finds the TEI Stylesheets
  through `--stylesheets`, `TEI_STYLESHEETS` or ODD2RNG's configuration.
  **Schematron: About** shows which folder it uses.
- The unit tests run on GitHub at every push, and `tools/release.py` makes
  a release in one command.

## 0.7.0 — 2026-11-18 (py-xmlvalidate.py 1.19)

- **Schematron: About** shows what the extension is (its version, author,
  licence and repository) and what its `py-xmlvalidate.py` says of itself
  (the program's new `--about`: its version, and the Python and libraries
  it runs with), with buttons to open the repository or copy the details.

## 0.6.1 — 2026-11-18 (py-xmlvalidate.py 1.18)

- Carries py-xmlvalidate.py 1.18: variables (`<let>`) declared at schema or
  pattern level are evaluated with the document's root as context, as ISO
  Schematron says, and a rule that cannot be evaluated makes the program
  exit 3. The extension shows the same problems as before; schemas with
  variables at those levels now get the standard behaviour.

## 0.6.0 — 2026-11-18 (py-xmlvalidate.py 1.17)

- The extension has a repository of its own, py-xmlvalidate-vscode, which
  carries its own copy of `py-xmlvalidate.py`; packaging bundles that copy.
  Its history came along: each version has its tag, `vVERSION`. The
  extension's name and ID (NicolasVaughan.validate-schematron) and its
  settings do not change.
- *Setup Guide* opens this repository's README.

## 0.5.12 — 2026-11-17 (py-xmlvalidate.py 1.16)

- Faster again on large documents: py-xmlvalidate.py 1.16 evaluates each
  rule in one call for all the elements it applies to, instead of one call
  per element. A 26,000-line edition went from 11.5 s to 1.9 s (measured
  back to back on the same machine). The results are the same.

## 0.5.11 — 2026-11-17 (py-xmlvalidate.py 1.15)

- Faster checks of large documents: py-xmlvalidate.py 1.15 evaluates all
  the tests of a rule together, computing the rule's variables once per
  element instead of once per test. A 26,000-line edition is now checked
  in about 3.5 s instead of 13.9 s, which matters most while you type.
  The results are the same.

## 0.5.10 — 2026-11-17 (py-xmlvalidate.py 1.13)

- The bundled script takes the project's name: **py-xmlvalidate.py** (it
  was xmlvalidate.py). If you set `schematron.validatorPath` to your own
  copy of the script, point it to `py-xmlvalidate.py`. The extension's
  name, ID and title stay the same.

## 0.5.9 — 2026-11-17

- The extension's title names the project: *Schematron Validator
  (py-xmlvalidate)*. Its name and its ID, `NicolasVaughan.validate-schematron`,
  stay the same, so it updates as usual.
- The README names the project py-xmlvalidate, whose program is
  `xmlvalidate.py`, and the release zip it mentions is now
  `py-xmlvalidate-v.*.zip`.

## 0.5.8 — 2026-11-17 (xmlvalidate.py 1.12)

- The bundled script is renamed **xmlvalidate.py** (it was validate.py),
  to match the project's new name, py-xmlvalidate. The extension's title
  becomes *Schematron Validator (xmlvalidate.py)*; its name and its ID,
  `NicolasVaughan.validate-schematron`, stay the same, so it updates as
  usual. If you set `schematron.validatorPath` to your own copy of the
  script, point it to `xmlvalidate.py`.

## 0.5.7 — 2026-11-17

- Links point to the repositories' new name, py-xmlvalidate: the README,
  the **Setup Guide** button and command, and the repository in the
  extension's details. The extension keeps its name and its ID,
  `NicolasVaughan.validate-schematron`.

## 0.5.6 — 2026-11-14

- validate.py 1.11, which needs Python 3.15 or later: with an older
  Python it now says so at once (*validate.py necesita Python 3.15 o
  posterior*), and the extension shows that message, instead of failing
  later in a less clear way. **Before you start** asks for Python 3.15
  (it said 3.9).

## 0.5.5 — 2026-11-12

- Clear setup instructions for newcomers: the README opens with
  **Before you start**, four steps to install Python and the two libraries
  the extension needs (saxonche and lxml), with the commands for Linux,
  macOS and Windows, an optional section on jing, and what to do when
  something goes wrong.
- The notification shown when the Python interpreter lacks the libraries
  has a **Setup Guide** button that opens those steps; so does the error
  shown when a chosen interpreter lacks them, and the new command
  **Schematron: Setup Guide**.
- The extension's description and the `schematron.pythonPath` setting say
  what is required.

## 0.5.4 — 2026-11-12

- Published on the Visual Studio Marketplace, under the publisher
  NicolasVaughan. The extension's ID is now
  `NicolasVaughan.validate-schematron`. If you installed an earlier version
  from a `.vsix` (ID `nivaca.validate-schematron`), uninstall it first, or
  both will run.
- Links point to the repositories' new name, py-validate.

## 0.5.3 — 2026-11-12

- This changelog, shown on the extension's page.
- Packaged with vsce 4.1.0. Releases now also include a zip of validate.py
  and its documentation, and the extension can be published to the
  Marketplace from GitHub Actions.

## 0.5.2 — 2026-11-12

- The project is now free software under the GNU General Public License,
  version 3 or later (GPL-3.0-or-later). Earlier versions were released
  under the MIT licence, and copies of them keep it.

## 0.5.1 — 2026-11-12

- The README opens with a screenshot of the extension at work.

## 0.5.0 — 2026-11-12

- New command **Schematron: Refresh Schema**: downloads the active file's
  remote schema again (it is otherwise cached for good), rebuilds the rules
  from it, and validates the open files again. For a local schema it says
  there is nothing to download: changes to it are picked up by themselves.

## 0.4.2 — 2026-11-12

- An icon, and a matching banner colour for the extension's page.

## 0.4.1 — 2026-11-12

- Errors in XML that is not well-formed are labelled **XML**. For a tag
  mismatch (such as `<notde>` for `<note>`), the line where the unclosed
  tag was opened is flagged too, not only where the parser noticed it.
- jing keeps running on text that is not well-formed: its errors usually
  point straight at the misspelt element.
- Errors are always visibly underlined: RelaxNG errors underline the
  offending start tag, and no underline is zero characters wide (they were
  invisible when a tag ended its line).

## 0.4.0 — 2026-11-12 (validate.py 1.8)

- Validates **as you type**, unsaved changes included, once typing pauses:
  settings `schematron.validateOnChange` (on by default) and
  `schematron.changeDelayMs` (500 ms by default). The text is validated from
  a private temporary copy; your file is never written.
- **Schematron: Validate Current File** includes unsaved changes.
- validate.py 1.8: `--as`, and a document that is not (yet) well-formed
  gets an ordinary error on its line instead of a failure.

## 0.3.1 — 2026-11-12 (validate.py 1.7)

- Fixes "no es XML bien formado: Premature end of data" when several files
  were validated at once: validate.py 1.7 writes its caches atomically, and
  replaces a damaged cached schema by itself.

## 0.3.0 — 2026-11-12 (validate.py 1.6)

- A status bar item for the current file: a spinner while validating, a
  tick when it is clean, the number of problems, or a red "failed" when
  validation could not run. Click it for the output log.
- validate.py 1.6: messages show element names (`<name/>`) and attribute
  values (`<value-of>`) correctly.

## 0.2.0 — 2026-11-12

- When the Python interpreter lacks saxonche or lxml, the message names the
  interpreter that was tried, and a notification (shown once) offers
  **Choose Interpreter…** and **Open Settings**.
- New command **Schematron: Select Python Interpreter…**: picks a Python,
  checks that it can import saxonche and lxml, and saves it.
- Changing any `schematron.*` setting validates the open files again.

## 0.1.0 — 2026-11-12 (validate.py 1.5)

- First release. Validates XML files with an `<?xml-model?>` on open and on
  save with `validate.py --json`, and with jing when the schema is RelaxNG,
  and shows the results as diagnostics in the editor and the Problems
  panel. Settings for the Python interpreter, the schema, jing, and when to
  validate.
