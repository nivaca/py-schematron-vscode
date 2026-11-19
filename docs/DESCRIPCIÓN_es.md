# py-schematron-vscode 0.12.0: descripción

## Análisis

py-schematron-vscode es Schematron Validator, una extensión de Visual Studio Code que revisa documentos XML y TEI contra las reglas Schematron de su esquema, y contra su estructura RelaxNG con jing, mientras se escribe. Fue desarrollada por Nicolas Vaughan en noviembre de 2026 para las ediciones del proyecto SMTrad, de modo que las revisiones que hacía en la terminal aparecieran mientras escribía. Empezó el 12 de noviembre en la carpeta `vscode/` del repositorio del programa, y desde la versión 0.6.0 tiene repositorio propio. Su nombre y su identificador (`NicolasVaughan.validate-schematron`) no han cambiado con los cambios de nombre del programa.

La extensión no valida por sí misma: ejecuta py-schematron.py, el programa del proyecto py-schematron, cuyo informe JSON da cada infracción, su línea, su regla y dónde está escrita esa regla, y jing cuando el esquema es RelaxNG. Los requisitos salieron del uso. Había que ver las infracciones en el texto, subrayadas, y en el panel Problemas, con la capa que encontró cada una (Schematron, RelaxNG o XML) y la gravedad de su `role`; revisar el texto sin guardar sin escribir nunca junto al archivo del usuario; señalar bien un documento que, a medio escribir, deja por un momento de estar bien formado; volver a descargar un esquema remoto que haya cambiado; y llevar de un error a la regla que lo produjo.

Tenía además que poder usarla cualquiera, sin saber qué es un entorno de Python, y en Linux, macOS y Windows. Y, como el `<?xml-model?>` de un documento elige el esquema y Saxon ejecuta su XPath, una carpeta descargada no debía poder hacerle ejecutar un programa cualquiera.

## Diseño

El código está en dos módulos. `extension.ts` se ocupa del editor: las órdenes, los ajustes, la barra de estado, los diagnósticos y los procesos. `parse.ts` lee los informes de py-schematron.py y de jing, y decide qué Python y qué jing usar, sin depender de VS Code, para poder probarlo aparte.

La extensión ejecuta `py-schematron.py --json` al abrir un documento, al guardarlo y cuando la escritura se detiene (medio segundo por omisión). El texto sin guardar se escribe en una carpeta temporal privada, y el programa lo trata con `--as` como si fuera el archivo real, de modo que las rutas relativas de `<?xml-model?>` siguen sirviendo. Cuando el esquema es RelaxNG corre también jing, que sigue funcionando sobre texto mal formado y suele señalar justo el elemento mal escrito.

Las órdenes son *Validate Current File*, *Refresh Schema* (vuelve a descargar el esquema remoto y valida otra vez los archivos abiertos), *Go to Rule* (abre el ODD o el RelaxNG en el assert o report de un error), *Select Python Interpreter…*, *Setup Guide*, *About*, *Show Output* y *Clear*. Los ajustes, todos con el prefijo `schematron.`, eligen el Python, el programa, el esquema y su tipo, jing, cuándo validar, la pausa y el tiempo máximo.

En una carpeta no confiable (*Restricted Mode*) la extensión sigue validando, pero no hace caso de los ajustes de esa carpeta para el Python, el programa y jing.

## Implementación

Está escrita en TypeScript, en unas 800 líneas, sin dependencias en tiempo de ejecución fuera de VS Code; se empaqueta con vsce, y el paquete lleva la copia del programa como `validator/py-schematron.py`.

### Diagnósticos visibles

jing da la posición justo después de una etiqueta de apertura, a menudo al final de una línea, y VS Code no dibuja un subrayado de ancho cero; la extensión subraya la etiqueta entera. Para un elemento mal escrito, como `<notde>` por `<note>`, el analizador avisa decenas de líneas después; la extensión marca también la línea donde se abrió la etiqueta sin cerrar.

### El Python

Con `schematron.pythonPath` vacío, la extensión usa el Python del entorno que crea el instalador de py-schematron, que ya tiene saxonche y lxml, y si no, `python3`. Cuando el Python no tiene esas bibliotecas, dice cuál probó y ofrece elegir otro, que verifica antes de guardarlo.

### jing en Windows

Windows no tiene una orden `jing`. `schematron.jingPath` acepta un `jing.jar`, que se ejecuta con `java -jar`; vacío, se usa `$JING`, el `jing.jar` de `$JING_JAR` o la orden `jing`, en ese orden.

### El programa

Cada versión lleva su copia de py-schematron.py, que `tools/sync-plugins.py`, en el repositorio del programa, actualiza. Desde la versión 0.9.0 la extensión no lee los mensajes en español que el programa escribe en stderr: los errores y los eventos salen de su informe JSON.

## Validación

La extensión tiene 18 pruebas automáticas (`npm test`), que corren con el ejecutor de pruebas de Node. Comprueban cómo los informes de py-schematron.py y de jing se convierten en diagnósticos, las gravedades, dónde empiezan y terminan los subrayados, los mensajes de error, qué Python se elige y cómo se ejecuta jing; una de ellas ejecuta py-schematron.py de principio a fin.

Otra prueba (`npm run test:integration`) ejecuta la extensión dentro de un VS Code real, sin pantalla y con un perfil propio: comprueba que los errores caigan en las líneas correctas y se vean subrayados, que se encuentre un elemento mal escrito, que se valide el texto sin guardar, que *Refresh Schema* recoja un esquema cambiado en un pequeño servidor web, que *Go to Rule* abra el esquema en el assert y qué muestra *About*. Esa prueba encontró los subrayados de ancho cero y el error señalado lejos de su causa, que las pruebas contra un editor simulado no habían visto.

En GitHub las dos clases de prueba corren en Linux y Windows con cada cambio, y en macOS con cada versión. `tools/release.py` repite las pruebas antes de publicar, empaqueta el `.vsix` y comprueba que lo que se descarga de Codeberg y GitHub sea lo que subió. Las capturas del README se hacen con `tools/screenshots.py`, del repositorio del programa, que maneja un VS Code real en una pantalla oculta.

## Plataforma

Necesita Visual Studio Code 1.85 o posterior, en Linux, macOS o Windows, los tres probados en GitHub; no funciona en espacios de trabajo virtuales. En Linux conviene la versión nativa (RPM o deb) y no la Flatpak, que no ve el Python ni el jing del sistema.

Para validar necesita Python 3.15 o posterior con saxonche y lxml; lo más simple es el instalador de py-schematron, cuyo Python la extensión usa por su cuenta. jing es opcional, para la estructura RelaxNG: en Linux y macOS como orden, en Windows como `jing.jar` con Java.

Solo necesita internet para descargar los esquemas remotos la primera vez, o al refrescarlos. Nunca escribe en los documentos que valida.

## Ambiente

Fue desarrollada en Fedora Linux 45 con KDE Plasma, con Node.js 22, TypeScript, Visual Studio Code y git, y probada en GitHub Actions en Linux, Windows y macOS.

El código está en el repositorio py-schematron-vscode, publicado en Codeberg (https://codeberg.org/nivaca/py-schematron-vscode) y en GitHub. Cada versión se etiqueta `vA.B.C` y se publica en las dos forjas con su `.vsix`, mediante `tools/release.py`; el historial de cambios está en `CHANGELOG.md`. La extensión está en el Visual Studio Marketplace, con el editor NicolasVaughan; cada versión se sube allí a mano, porque la publicación automática con Trusted Publishing todavía no funciona con los repositorios nuevos de GitHub. El flujo de publicación puede subirla también a Open VSX si el repositorio tiene el secreto `OVSX_PAT`.

Se instala desde el Marketplace, o con el `.vsix` de una versión y `code --install-extension`. Para desarrollarla: `npm install`, `npm run compile` y `npm test`. Los ajustes `schematron.*` se guardan en el `settings.json` del usuario o de la carpeta de trabajo, y los esquemas descargados, en el caché `.schema-cache/` junto a la copia del programa.
