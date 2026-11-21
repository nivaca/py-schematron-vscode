Open-source software used by py-schematron-vscode
=================================================

py-schematron-vscode (the extension "Schematron Validator") is free
software, under the GNU General Public License, version 3 or later
(GPL-3.0-or-later).  The `.vsix` holds only the extension's own compiled
code and a copy of `py-schematron.py`, from
[py-schematron](https://github.com/nivaca/py-schematron), by the same
author and under the same licence.  The extension has no runtime npm
dependencies, so no package from npm goes into the `.vsix`.  The programs
below are installed separately and each keeps its own licence.

What the extension runs with
----------------------------

| Software | What it is used for | Licence |
|---|---|---|
| [Visual Studio Code](https://code.visualstudio.com/) 1.85 or later, or another editor built from Code - OSS | The editor and its extension API | MIT (the Code - OSS source); Microsoft's builds have their own product licence |
| [Python](https://www.python.org/) 3.15 or later, with its standard library | Runs `py-schematron.py` | Python Software Foundation License (PSF-2.0) |
| [saxonche](https://pypi.org/project/saxonche/) (SaxonC-HE, by Saxonica) | Evaluates the Schematron rules with XPath 3.1, in `py-schematron.py` | Mozilla Public License 2.0 (MPL-2.0) |
| [lxml](https://lxml.de/) | Finds the line and the `xml:id` of each offence, in `py-schematron.py` | BSD-3-Clause |
| [libxml2](https://gitlab.gnome.org/GNOME/libxml2) and [libxslt](https://gitlab.gnome.org/GNOME/libxslt) | The C libraries under lxml (included in its wheels) | MIT |
| [jing](https://relaxng.org/jclark/jing.html), by James Clark (optional) | Checks the RelaxNG structure | BSD-3-Clause (Thai Open Source Software Center) |
| A Java runtime, such as [OpenJDK](https://openjdk.org/) (only with jing) | Runs jing | GPL-2.0 with the Classpath Exception (OpenJDK) |
| [TEI Stylesheets](https://github.com/TEIC/Stylesheets): `odds/extract-isosch.xsl` and `common/functions.xsl` (only for ODD schemas) | Extract the Schematron rules of an ODD, in `py-schematron.py`.  They are not distributed with the extension | Dual licence: BSD-2-Clause or Creative Commons Attribution-ShareAlike 3.0 (CC-BY-SA-3.0), at the user's choice |

The jing distributed by its project (a `jing.jar`, as on Windows) carries
some libraries of its own, such as Xerces and Saxon 9; their licences are
in the `doc/` folder of that distribution.

What is used to develop, test and package it
--------------------------------------------

These are the `devDependencies` of `package.json` and the tools around
them.  None of them is distributed in the `.vsix`.

| Software | What it is used for | Licence |
|---|---|---|
| [Node.js](https://nodejs.org/) and npm | Build, test and package the extension; `node:test` runs the parser tests | MIT (Node.js), Artistic-2.0 (npm) |
| [TypeScript](https://www.typescriptlang.org/) | The language of the extension, compiled to JavaScript | Apache-2.0 |
| [@types/node](https://www.npmjs.com/package/@types/node), [@types/vscode](https://www.npmjs.com/package/@types/vscode) | Type definitions for Node.js and the VS Code API | MIT |
| [@vscode/test-electron](https://github.com/microsoft/vscode-test) | Runs the integration tests in a real VS Code | MIT |
| [@vscode/vsce](https://github.com/microsoft/vscode-vsce) | Packages the `.vsix` and publishes it | MIT |
| [Xvfb](https://www.x.org/) (X.Org) | The hidden display for the integration tests and the screenshots | MIT/X11 |
| [GitHub Actions](https://github.com/features/actions): `actions/checkout`, `actions/setup-node`, `actions/setup-python` | Run the tests and publish the extension | MIT |

npm installs further packages under these (their own dependencies); their
names and licences are in `package-lock.json` and in each package's folder
under `node_modules/`.
