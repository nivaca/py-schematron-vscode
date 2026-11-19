How py-schematron-vscode was made
=================================

py-schematron-vscode is the Schematron Validator, an extension for
Visual Studio Code that checks XML and TEI documents against the
Schematron rules of their schema, and against its RelaxNG structure with
jing, as you type.  Each offence is underlined in the text and listed in
the Problems panel, with the layer that found it and a link to the rule
behind it.  It runs py-schematron.py, the program of the py-schematron
project, which it carries in its own copy.  Nicolas Vaughan made it in
November 2026, for the editions of the SMTrad project, so that the checks
he ran in the terminal would show while he wrote.  It began on 12
November in the `vscode/` folder of the program's repository, and has
had a repository of its own since version 0.6.0; its name and ID
(`NicolasVaughan.validate-schematron`) have not changed through the
program's renamings.  Here I explain how it was made, in seven stages.

The extension is free software, under the GNU General Public License,
version 3 or later (until 0.5.2 it was under the MIT licence).  It has
no runtime dependencies besides VS Code; it is built with TypeScript
(Apache License 2.0) and packaged with vsce (MIT licence).  The program
it runs, py-schematron.py, is under the GPL too, and uses Saxon HE,
through saxonche (Mozilla Public License 2.0), and lxml (BSD licence);
jing, by James Clark, is under a BSD licence.

Nicolas Vaughan is Associate Professor of Literature at the School of Arts
and Humanities of the Universidad de los Andes, Bogotá, Colombia.

1. A first version
------------------

The program could already validate my editions from the terminal, but I
had to run it, read the report, and find each line by hand.  Version 1.5
of the program gave it a `--json` report, with every offence, its line,
`xml:id`, pattern and `role`, and on that report stands the extension's
first version, 0.1.0.  It runs the program, and jing when the schema is
RelaxNG, when a document with an `<?xml-model?>` is opened or saved, and
shows the offences as diagnostics: underlined in the text, with the
message on hover, and in the Problems panel.  From the start the code
was split in two: `extension.ts` deals with the editor, and `parse.ts`
reads the reports of the program and of jing without depending on VS
Code, so that it can be tested on its own.

2. Easier to set up and to read
-------------------------------

The first problem anyone would meet was Python.  The extension needs a
Python with saxonche and lxml, and VS Code often finds one without them.
Version 0.2.0 says which interpreter it tried, and offers **Choose
Interpreter…**, which checks that a Python can import both libraries
before it saves the setting.  Version 0.3.0 added a status bar item for
the current file: a spinner while it works, a tick when the file is
clean, the number of problems, or a red "failed" when validation cannot
run.  Without it, a clean file looked exactly like an extension that did
not work.

After a reload, VS Code validated two files at the same moment, and one
of them read the downloaded schema while the other was still writing it:
"Premature end of data".  The truncated copy stayed in the program's
cache, and every later run failed.  The fix belonged to the program,
which since 1.7 writes its cache atomically; the extension 0.3.1 carried
it.

3. Validating as you type
-------------------------

Version 0.4.0 validates the text being edited, unsaved changes included,
once typing pauses, half a second by default.  The text is written to a
private temporary folder, never next to the user's file, and the
program's new `--as` treats that copy as if it were the real file, so
relative `<?xml-model?>` paths still work.  While a tag is half typed the
document is not well-formed for a moment, and the program now reports
that as an ordinary error on its line, not as a failure.

Running the extension inside a real VS Code showed two problems that the
tests had missed (0.4.1).  A misspelt element, such as `<notde>` for
`<note>`, was reported where the parser noticed it, dozens of lines
later; now the line where the unclosed tag was opened is flagged too,
and jing, which keeps running on such text, points straight at it.  And
jing gives the position just after a start tag, often at the end of a
line, which gave underlines of no width, which VS Code does not draw; now
the tag itself is underlined.

4. Publishing
-------------

A remote schema is downloaded once and kept, so a new version of it was
not seen until the cache was emptied by hand; the command **Refresh
Schema** downloads it again and validates the open files (0.5.0).  The
extension got an icon, an XML tag whose slash is a tick, above the red
underline it draws (0.4.2), and a changelog (0.5.3).  It changed to the
GPL, like my other projects (0.5.2).

On 12 November, 0.5.4 was published on the Visual Studio Marketplace,
under the publisher NicolasVaughan; an ID of its own was needed for that,
so whoever had installed an earlier `.vsix` had to uninstall it first.
A GitHub workflow tests and packages the extension with each release
tag, and was meant to publish it with Trusted Publishing, without storing
any key.  That has not worked: GitHub gives repositories created or
renamed after July 2026 an immutable form of its identity token, which
the Marketplace does not seem to accept yet, so I upload each version by
hand.  For newcomers, 0.5.5 opened the README with *Before you start*,
the steps to install Python and the two libraries, with a **Setup
Guide** command and button.

5. Faster, and renamed
----------------------

The next versions mostly carried changes of the program.  It came to
require Python 3.15, and the extension shows its message when the Python
is older (0.5.6).  The program was renamed twice, from validate.py to
xmlvalidate.py and then to py-xmlvalidate.py, and the extension's title
followed; its name and ID stayed, so it kept updating as usual (0.5.7 to
0.5.10).  And the program became much faster on large documents, first
by evaluating all the tests of a rule together (0.5.11), then by
evaluating each rule in one call for all its elements (0.5.12): on a
26,000-line edition a check went from 13.9 to 1.9 seconds, which matters
most while one types.

6. A repository of its own
--------------------------

In 0.6.0 the extension moved to a repository of its own, with its
history extracted and a tag for each version.  It carries its own copy of
the program, which the program's `tools/sync-plugins.py` updates, and
packaging bundles that copy as `validator/py-schematron.py`.

Three features followed.  **Schematron: About** shows the extension's
version, author, licence and repository, and what the program says of
itself, with the Python and libraries it runs with (0.7.0).  The
extension declares what it does in a folder VS Code does not trust
(Restricted Mode): it still validates, but ignores that folder's own
settings for the Python, the program and jing, so a downloaded folder
cannot make it run a program of its choosing (0.8.0).  And **Go to
Rule** opens the schema at the assert or report behind a Schematron
error, in the ODD or RelaxNG the user edits, not in the `.sch` made from
it, since the program now says where each rule is written (0.9.0).  The
same version stopped reading the program's Spanish messages on stderr:
the errors and events come from the JSON report.

7. py-schematron, installers and Windows
----------------------------------------

When the program was renamed py-schematron, the repository took the
name py-schematron-vscode; the extension kept its own (0.10.0).  The
program then got installers for Linux, macOS and Windows, which make a
Python environment with saxonche and lxml.  While `schematron.pythonPath`
is empty, its new default, the extension uses that environment's Python,
so nobody has to set up Python by hand (0.11.0).

From 0.11.1 the tests run on GitHub on Windows too at every push, and on
macOS for each release.  Windows has no `jing` command: jing comes there
as a `jing.jar`.  In 0.12.0 `schematron.jingPath` can name a `jing.jar`,
which the extension runs with Java, and when the setting is empty, its
new default, it uses `$JING`, the `jing.jar` named by `$JING_JAR`, or the
`jing` command.

Testing
-------

The extension has 18 automated tests (`npm test`), run with Node's own
test runner.  They check how the reports of py-schematron.py and of jing
become diagnostics, the severities, where the underlines start and end,
the error messages, which Python is chosen, and how jing is run; one of
them runs py-schematron.py from beginning to end.  Another test (`npm run
test:integration`) runs the extension inside a real VS Code, without a
screen and with a profile of its own: it checks that the errors land on
the right lines and are visibly underlined, that a misspelt element is
found, that unsaved changes are validated, that *Refresh Schema* picks
up a schema changed on a small web server, that *Go to Rule* opens the
schema at the assert, and what *About* shows.

On GitHub both kinds of test run on Linux and Windows at every push, and
on macOS for each release.  `tools/release.py` runs the unit tests again
before each release, packages the `.vsix`, and checks that the files
downloaded from Codeberg and GitHub are the ones it uploaded.  The
screenshots of the READMEs are made by the program's
`tools/screenshots.py`, which drives a real VS Code on a hidden display.
The extension has about 800 lines of TypeScript, and its tests about
520.
