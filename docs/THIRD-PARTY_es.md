Software libre que usa py-schematron-vscode
===========================================

py-schematron-vscode (la extensión «Schematron Validator») es software
libre, bajo la Licencia Pública General de GNU, versión 3 o posterior
(GPL-3.0-or-later).  El `.vsix` contiene solo el código compilado de la
extensión y una copia de `py-schematron.py`, de
[py-schematron](https://github.com/nivaca/py-schematron), del mismo autor
y con la misma licencia.  La extensión no tiene dependencias de npm en
tiempo de ejecución, así que ningún paquete de npm entra en el `.vsix`.
Los programas de abajo se instalan aparte y cada uno conserva su licencia.

Con qué corre la extensión
--------------------------

| Software | Para qué se usa | Licencia |
|---|---|---|
| [Visual Studio Code](https://code.visualstudio.com/) 1.85 o posterior, u otro editor hecho a partir de Code - OSS | El editor y su API de extensiones | MIT (el código de Code - OSS); las compilaciones de Microsoft tienen su propia licencia de producto |
| [Python](https://www.python.org/) 3.15 o posterior, con su biblioteca estándar | Ejecuta `py-schematron.py` | Python Software Foundation License (PSF-2.0) |
| [saxonche](https://pypi.org/project/saxonche/) (SaxonC-HE, de Saxonica) | Evalúa las reglas Schematron con XPath 3.1, en `py-schematron.py` | Mozilla Public License 2.0 (MPL-2.0) |
| [lxml](https://lxml.de/) | Halla la línea y el `xml:id` de cada infracción, en `py-schematron.py` | BSD-3-Clause |
| [libxml2](https://gitlab.gnome.org/GNOME/libxml2) y [libxslt](https://gitlab.gnome.org/GNOME/libxslt) | Las bibliotecas en C bajo lxml (incluidas en sus wheels) | MIT |
| [jing](https://relaxng.org/jclark/jing.html), de James Clark (opcional) | Revisa la estructura RelaxNG | BSD-3-Clause (Thai Open Source Software Center) |
| Un entorno de Java, como [OpenJDK](https://openjdk.org/) (solo con jing) | Ejecuta jing | GPL-2.0 con la Classpath Exception (OpenJDK) |
| [TEI Stylesheets](https://github.com/TEIC/Stylesheets): `odds/extract-isosch.xsl` y `common/functions.xsl` (solo para esquemas ODD) | Extraen las reglas Schematron de un ODD, en `py-schematron.py`.  No se distribuyen con la extensión | Doble licencia: BSD-2-Clause o Creative Commons Atribución-CompartirIgual 3.0 (CC-BY-SA-3.0), a elección del usuario |

El jing que distribuye su proyecto (un `jing.jar`, como en Windows) trae
algunas bibliotecas propias, como Xerces y Saxon 9; sus licencias están en
la carpeta `doc/` de esa distribución.

Con qué se desarrolla, se prueba y se empaqueta
-----------------------------------------------

Son las `devDependencies` de `package.json` y las herramientas que las
acompañan.  Ninguna se distribuye en el `.vsix`.

| Software | Para qué se usa | Licencia |
|---|---|---|
| [Node.js](https://nodejs.org/) y npm | Compilan, prueban y empaquetan la extensión; `node:test` ejecuta las pruebas del analizador | MIT (Node.js), Artistic-2.0 (npm) |
| [TypeScript](https://www.typescriptlang.org/) | El lenguaje de la extensión, compilado a JavaScript | Apache-2.0 |
| [@types/node](https://www.npmjs.com/package/@types/node), [@types/vscode](https://www.npmjs.com/package/@types/vscode) | Definiciones de tipos de Node.js y de la API de VS Code | MIT |
| [@vscode/test-electron](https://github.com/microsoft/vscode-test) | Ejecuta las pruebas de integración en un VS Code real | MIT |
| [@vscode/vsce](https://github.com/microsoft/vscode-vsce) | Empaqueta el `.vsix` y lo publica | MIT |
| [Xvfb](https://www.x.org/) (X.Org) | La pantalla oculta de las pruebas de integración y de las capturas | MIT/X11 |
| [GitHub Actions](https://github.com/features/actions): `actions/checkout`, `actions/setup-node`, `actions/setup-python` | Ejecutan las pruebas y publican la extensión | MIT |

npm instala otros paquetes por debajo de estos (sus propias dependencias);
sus nombres y licencias están en `package-lock.json` y en la carpeta de
cada paquete dentro de `node_modules/`.
