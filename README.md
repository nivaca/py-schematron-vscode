# Schematron Validator for VS Code

Validates XML/TEI documents against Schematron rules with `py-schematron.py`,
the program of [py-schematron](https://codeberg.org/nivaca/py-schematron). It can also check
RelaxNG structure with jing. Results appear as squiggles in the editor and in
the Problems panel.

![The extension on a TEI document: errors underlined, the message of one, the Problems panel and the count in the status bar](https://codeberg.org/nivaca/py-schematron/raw/branch/main/docs/img/vscode_dark.png)

## Before you start

> **This extension needs Python on your computer, with two extra Python
> libraries: `saxonche` and `lxml`.** VS Code does not install them for you.
> Without them the extension cannot check anything, and the status bar shows
> *Schematron: failed*. py-schematron's installer sets them up with one
> command (step 2), and the extension then finds them by itself.

### 1. Check that Python is installed

Open a terminal. In VS Code: menu **Terminal → New Terminal**. Then type:

| System | Type this | You should see |
|---|---|---|
| Linux, macOS | `python3 --version` | `Python 3.15` or a higher number |
| Windows | `py --version` | `Python 3.15` or a higher number |

If you get an error such as *command not found*, install Python first:

- **Windows and macOS:** download it from <https://www.python.org/downloads/>
  and run the installer (or `winget install Python.Python.3.15` on Windows,
  `brew install python@3.15` on macOS).
- **Linux:** use your system's packages, e.g. `sudo apt install python3.15
  python3.15-venv` (Debian, Ubuntu) or `sudo dnf install python3.15`
  (Fedora).

Then close the terminal, open a new one, and check again.

### 2. Install the libraries with py-schematron's installer

py-schematron's installer makes a Python environment of its own with
saxonche and lxml, in your user folders, without administrator rights. In
VS Code's terminal, type:

**Linux and macOS:**

```sh
curl -LsSf https://raw.githubusercontent.com/nivaca/py-schematron/main/installers/install.sh | sh
```

**Windows** (VS Code's terminal uses PowerShell):

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://raw.githubusercontent.com/nivaca/py-schematron/main/installers/install.ps1 | iex"
```

It ends with *py-schematron … is installed in …*. That is all: while
`schematron.pythonPath` is empty, as it is at first, the extension uses
the installer's Python by itself. (The installer also gives you the
`py-schematron` command for the terminal; py-schematron's
[README](https://codeberg.org/nivaca/py-schematron#21-with-the-installer-linux-macos-windows)
explains it in detail, and how to update or remove it.)

### 3. Or install them by hand, instead

Skip this if you used the installer. To manage the Python yourself, put the
two libraries into a folder of their own, a *virtual environment*, so that
they don't interfere with anything else on your computer. (Recent Linux and
macOS systems refuse `pip install` outside one, with an
*externally-managed-environment* error.) Copy these two lines into the
terminal, one at a time:

**Linux and macOS:**

```sh
python3 -m venv ~/.venvs/schematron
~/.venvs/schematron/bin/pip install saxonche lxml
```

**Windows** (in VS Code's terminal, which uses PowerShell):

```powershell
py -m venv $HOME\.venvs\schematron
& $HOME\.venvs\schematron\Scripts\pip install saxonche lxml
```

The second line downloads the libraries; it ends with *Successfully
installed … lxml … saxonche …*.

**Then tell the extension which Python to use.** Open the Command Palette (**Ctrl+Shift+P**, or **Cmd+Shift+P** on macOS),
type **Schematron: Select Python Interpreter…** and press Enter. A file
picker opens in the `.venvs` folder made above. Go into `schematron`
and choose:

| System | The file to choose |
|---|---|
| Linux, macOS | `bin` → `python` |
| Windows | `Scripts` → `python.exe` |

The extension checks that this Python has both libraries before it saves
your choice, and says so: *Schematron: using …*. (You can also type the
path into the setting `schematron.pythonPath` yourself.)

### 4. Check that it works

Open an XML file whose first lines include an `<?xml-model … ?>`
instruction pointing to its schema, as TEI files usually do. Within a
second or two the status bar, at the bottom right, shows
**✓ Schematron** (no problems) or **Schematron: 3** (three problems,
underlined in the text). To try it on a ready-made example, download
`py-schematron-v.*.zip` from py-schematron's
[releases](https://github.com/nivaca/py-schematron/releases), unzip it, and
open `docs/example/edition.xml`: it has six deliberate mistakes in its
Schematron rules (and a seventh, structural one, if you install jing).

### Optional: jing, for structural (RelaxNG) checks

The Schematron rules are checked with the two libraries above. If you also
want the document's *structure* checked against a RelaxNG schema (which
elements may appear where), install **jing**, which needs Java:

- **Debian, Ubuntu:** `sudo apt install jing`
- **macOS:** `brew install jing-trang` (with [Homebrew](https://brew.sh))
- **Other Linux systems:** download `jing` from
  <https://github.com/relaxng/jing-trang/releases>, unzip it, and set
  `schematron.jingPath` to its `jing.jar`, which the extension runs with
  Java (`java -jar`).
- **Windows:** install Java (`winget install EclipseAdoptium.Temurin.21.JRE`),
  download `jing` from <https://github.com/relaxng/jing-trang/releases>,
  unzip it, and set `schematron.jingPath` to its `jing.jar`, for example
  `C:\Tools\jing\bin\jing.jar`.

Without jing, the extension simply skips the structural checks.

### If something goes wrong

| What you see | What to do |
|---|---|
| *The Python interpreter "…" does not have the 'saxonche' module* | Step 2 was skipped, or `schematron.pythonPath` names another Python: run the installer (step 2) and empty that setting. The notification's **Setup Guide** button opens these instructions. |
| *Could not run the Python interpreter "…"* | The path in `schematron.pythonPath` is wrong: empty it to use the installer's Python, or run **Schematron: Select Python Interpreter…** again. |
| *externally-managed-environment* when running `pip` | Use the installer (step 2), or the commands of step 3 exactly: both install into an environment of their own. |
| Nothing at all happens in an XML file | The file has no `<?xml-model?>` line, so the extension does not know its schema: add one, set `schematron.schema`, or run **Schematron: Validate Current File**. |
| VS Code on Linux installed as a Flatpak or Snap | It cannot see the Python on your system. Install VS Code from its `.rpm` or `.deb` package instead. |
| Anything else | Run **Schematron: Show Output**: it shows each command the extension ran and the full error. |

The extension has been tested on Linux. It should work the same on macOS
and Windows, but has not been tried there yet.

## What it does

- **When it runs:** as you type (once typing pauses for
  `schematron.changeDelayMs`, 500 ms by default), on open and on save, for
  `.xml` files that carry an `<?xml-model?>` processing instruction, or for
  any XML file when `schematron.schema` is set. You can also run
  **Schematron: Validate Current File** from the Command Palette.
- **Schematron layer:** runs `py-schematron.py --json`. The schema is auto-detected
  from `<?xml-model?>` (with the same download cache and classification as the
  command-line tool) or taken from your settings. Each failed `assert` or
  successful `report` becomes a diagnostic on the offending element's line.
  The pattern id is shown as the diagnostic code. A rule's `role="warning"` or
  `role="info"` sets its severity; everything else is an error.
- **RelaxNG layer:** if the schema source is a `.rng` file and jing is
  installed, jing's structural errors are added with line and column.
- **Incomplete results:** rules that fail to evaluate (XPath errors) are
  reported as one warning on the first line, because the verdict is then
  incomplete.
- **Status bar:** for the active file, it shows a spinner while validating,
  `✓ Schematron` when the file is clean, `Schematron: N` when there are
  problems, and `Schematron: failed` (red) when validation could not run.
  The tooltip gives the details and the time of the last check; clicking it
  opens the output log. It is hidden for XML files the extension does not
  validate.
- **Unsaved edits:** these are validated too. The editor's text is written to
  a private temporary folder (never next to your file), validated there as if
  it were your file, and deleted right after. While a tag is half-typed, you
  see a "not well-formed" error on that line until the XML is complete again.
  Unsaved text is always validated as UTF-8.
- **Not well-formed XML:** reported with source **XML**. The parser notices a
  broken tag only where it ends, sometimes many lines later, so for a tag
  mismatch the line where the unclosed tag was opened is flagged too. jing
  still runs, and its errors usually point straight at the misspelt element.
- **What is underlined:** the offending element's start tag for RelaxNG
  errors, and the line's content (without indentation) otherwise.

## Validating against an ODD

To take the rules from an **ODD** (`schematron.schemaType: "odd"`),
`py-schematron.py` needs `odds/extract-isosch.xsl` and `common/functions.xsl`
from the [TEI Stylesheets](https://github.com/TEIC/Stylesheets) next to it.
Set `schematron.validatorPath` to a copy of `py-schematron.py` that has them.
RelaxNG schemas and Schematron files need nothing extra.

## Settings

| Setting | Default | Meaning |
|---|---|---|
| `schematron.pythonPath` | *(empty)* | Interpreter with saxonche and lxml; empty: the one py-schematron's installer made, if it is installed, or else `python3` |
| `schematron.validatorPath` | *(bundled)* | Path to `py-schematron.py` |
| `schematron.schema` | *(auto)* | Schema file, relative to the workspace folder; empty = use `<?xml-model?>` |
| `schematron.schemaType` | `rng` | Type of `schematron.schema`: `rng`, `sch` or `odd` |
| `schematron.validateOnOpen` | `true` | Validate when a file is opened |
| `schematron.validateOnSave` | `true` | Validate when a file is saved |
| `schematron.validateOnChange` | `true` | Validate as you type, including unsaved changes |
| `schematron.changeDelayMs` | `500` | How long typing must pause before validating (ms, minimum 100) |
| `schematron.relaxng.enabled` | `true` | Run jing when the schema is RelaxNG |
| `schematron.jingPath` | *(empty)* | jing: a command, or a `jing.jar`, run with Java; empty: `$JING`, the `jing.jar` named by `$JING_JAR`, or `jing` |
| `schematron.timeoutSeconds` | `120` | Abort a run after this long |

Changing any `schematron.*` setting re-validates the open files.

The **Schematron** output channel (**Schematron: Show Output**) logs every
command run and its stderr.

## Restricted Mode

In a folder you have not marked as trusted, VS Code runs extensions in
Restricted Mode. This extension still validates there, but it ignores the
folder's own values (in `.vscode/settings.json`) for the three settings
that name programs to run: `schematron.pythonPath`,
`schematron.validatorPath` and `schematron.jingPath`. Only your user
settings count for them, so a folder you download cannot make the
extension run a program of its choosing. The other settings work as usual.

## Commands

Open the Command Palette (Ctrl+Shift+P) and type "Schematron":

| Command | Use it to |
|---|---|
| Setup Guide | Open the setup steps above in your browser |
| Validate Current File | Validate now, unsaved changes included, or a file without `<?xml-model?>` |
| Refresh Schema | Re-download the active file's schema after it changed upstream, then re-validate the open files |
| Show Output | See exactly what ran and any error output |
| Select Python Interpreter… | Choose the Python that has saxonche and lxml |
| Go to Rule | Open the schema at the rule behind the Schematron error under the cursor: the assert or report, in the ODD or RelaxNG you edit. The same link is under each error, in the hover and in the Problems panel, and in the lightbulb |
| Clear Diagnostics | Remove all underlines and Problems entries |
| About | See the extension's version, author, licence and repository, and what its `py-schematron.py` runs with (Python, saxonche, lxml); *Copy Details* puts it all on the clipboard, for a bug report |

**About Refresh Schema:** a schema referenced by URL is downloaded once and
then cached, so later changes to it (for example a new commit to the schema
repository on GitHub) are not seen until you refresh it. A local schema file
needs no refresh: changes to it are picked up automatically, and the command
says so.

## License

Copyright (C) 2026 Nicolas Vaughan. Free software under the GNU General
Public License, version 3 or later; see [LICENSE](https://codeberg.org/nivaca/py-schematron-vscode/src/branch/main/LICENSE).

## Building

From a clone of [py-schematron-vscode](https://codeberg.org/nivaca/py-schematron-vscode):

```sh
npm install
npm test            # set VALIDATE_PYTHON=/path/to/python to include the end-to-end test
# Real VS Code, headless (Linux), with a throwaway profile:
env -u WAYLAND_DISPLAY VALIDATE_PYTHON=/path/to/python JING=$(command -v jing) \
  VSCODE_PATH=/usr/share/code/code xvfb-run -a npm run test:integration
npm run package     # -> dist/validate-schematron-<version>.vsix
code --install-extension dist/validate-schematron-<version>.vsix
```

Packaging copies the repository's `py-schematron.py` into the extension
(`validator/`), so the `.vsix` works on its own. That copy is kept in step
with [py-schematron](https://codeberg.org/nivaca/py-schematron), where
the program is developed, by its `tools/sync-plugins.py`; the changelog says
which version each release carries.
