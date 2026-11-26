# Registro de cambios

Los cambios notables de la extensión Schematron Validator. Cada versión
trae su propia copia de `py-schematron.py`; su versión se indica cuando
cambió. Las versiones, con sus archivos `.vsix`, están en
[Codeberg](https://codeberg.org/nivaca/py-schematron-vscode/releases) y
[GitHub](https://github.com/nivaca/py-schematron-vscode/releases); hasta la
0.5.12 se publicaban en
[py-schematron](https://codeberg.org/nivaca/py-schematron/releases).

## Sin publicar

- `tools/zenodo.py`: la descripción del depósito es ahora el README entero
  de la etiqueta, en HTML. El borrador recibe además el colaborador (el
  director del proyecto), los idiomas, el copyright, el repositorio en
  GitHub, el lenguaje de programación y el estado del desarrollo; estos
  últimos, por la API de registros de Zenodo, porque la de depósitos no los
  admite. El token puede guardarse en el llavero del escritorio
  (`secret-tool store --label="Zenodo token" service zenodo`) en vez de en
  `$ZENODO_TOKEN`; `tools/zenodo.py check-token` dice si hay uno.

- `tools/zenodo.py` prepara el depósito de una versión en Zenodo. `collect`
  deja en `dist/zenodo/` el árbol de la etiqueta como
  `py-schematron-vscode-VERSIÓN-source.tar.gz`, con su firma, un
  `SHA256SUMS` del depósito, firmado, y la clave pública, y comprueba cada
  firma con solo esa clave (`--packages` añade los archivos de la versión).
  `upload` lo sube a Zenodo como borrador, versión nueva del depósito si ya
  lo hay, y nunca lo publica. `tools/release.py` reúne ahora el depósito
  después de la etiqueta y lo sube como borrador, salvo con `--no-zenodo`.
  Los metadatos están en `.zenodo.json`.
- `tools/zenodo.py`: la descripción del depósito deja fuera la línea que
  lleva a los README en otras lenguas y la sección Screenshots, cuyas
  imágenes Zenodo no muestra.
- `tools/release.py` publica ahora cada versión en Zenodo
  (`tools/zenodo.py upload --publish`), en vez de dejar un borrador;
  `--zenodo-draft` todavía lo deja. `tools/zenodo.py publish` publica un
  borrador que ya está allí (por omisión, el que espera con el título del
  proyecto).

## 0.12.1 — 2026-11-21 (py-schematron.py 2.7)

- `docs/THIRD-PARTY_es.md` (y `docs/THIRD-PARTY.md`, en inglés): el
  software libre que usa la extensión, y la licencia de cada uno: VS
  Code, Python, saxonche, lxml, jing, las TEI Stylesheets, y los paquetes
  de npm y las herramientas con que se compila y se prueba. Nada de eso
  está en el `.vsix`.
- Lleva py-schematron.py 2.7.

## 0.12.0 — 2026-11-19 (py-schematron.py 2.6)

- **jing en Windows.** `schematron.jingPath` puede indicar un `jing.jar`,
  que la extensión ejecuta con Java (`java -jar`): Windows no tiene la
  orden `jing`, así que antes la capa de RelaxNG no podía ejecutarse allí.
  Su valor predeterminado está ahora vacío, lo que quiere decir `$JING`, o
  el `jing.jar` que indique `$JING_JAR` (como hace `py-schematron-all`), o
  la orden `jing`; un valor ya fijado sigue funcionando como antes.
- Trae py-schematron.py 2.6.

## 0.11.1 — 2026-11-19 (py-schematron.py 2.2)

- Las pruebas se ejecutan en GitHub también en Windows con cada push, y en
  macOS para cada versión, además de Linux: las pruebas unitarias y la
  extensión dentro de un VS Code real. Dos pruebas unitarias ya no suponen
  rutas de Unix.
- Trae py-schematron.py 2.2.

## 0.11.0 — 2026-11-19 (py-schematron.py 2.1)

- **Sin Python que configurar a mano.** py-schematron 2.1 trae un
  instalador para Linux, macOS y Windows que crea un entorno de Python con
  saxonche y lxml. Mientras `schematron.pythonPath` esté vacío, que es
  ahora su valor predeterminado, la extensión usa el Python de ese entorno
  si está instalado, y `python3` si no. Una ruta ya fijada sigue
  funcionando como antes.
- Los pasos de configuración (*Before you start*) empiezan con el
  instalador; el entorno virtual manual queda como alternativa. Los
  mensajes de error sobre Python también remiten al instalador.
- Trae py-schematron.py 2.1.

## 0.10.0 — 2026-11-19 (py-schematron.py 2.0)

- El programa que está detrás de la extensión pasa a llamarse
  **py-schematron** (era py-xmlvalidate), y también este repositorio:
  nivaca/py-schematron-vscode, en Codeberg y GitHub; las direcciones
  antiguas redirigen a él. La extensión conserva su nombre, Schematron
  Validator (`NicolasVaughan.validate-schematron`), y sus ajustes; el
  programa incluido es ahora `validator/py-schematron.py`. Si
  `schematron.validatorPath` apunta a una copia del antiguo
  `py-xmlvalidate.py`, hágalo apuntar a `py-schematron.py`.
- Trae py-schematron.py 2.0.

## 0.9.0 — 2026-11-19 (py-xmlvalidate.py 1.21)

- La extensión ya no lee los mensajes en español del programa en stderr:
  los errores fatales del programa salen de su JSON, palabra por palabra,
  y **Refresh Schema** se entera de una descarga por los eventos del
  informe. Con un `py-xmlvalidate.py` anterior (indicado en
  `schematron.validatorPath`), stderr se sigue leyendo como antes.
- **Go to Rule.** Cada error de Schematron enlaza con el assert o report
  que lo informó, en el ODD o el RelaxNG del que salió (el archivo que se
  edita, no el `.sch` generado a partir de él): bajo el error, en el texto
  emergente y en el panel Problems. **Schematron: Go to Rule** y la
  bombilla lo abren para el error que está bajo el cursor. Una regla que
  no pudo evaluarse se enlaza de la misma manera. Requiere
  py-xmlvalidate.py 1.21, que dice dónde está cada regla.
- Las pruebas se ejecutan en GitHub también cada lunes.

## 0.8.0 — 2026-11-18 (py-xmlvalidate.py 1.20)

- **Modo restringido.** La extensión declara lo que hace en una carpeta
  que no es de confianza: sigue validando, pero ignora los valores propios
  de la carpeta para `schematron.pythonPath`, `schematron.validatorPath` y
  `schematron.jingPath`, de modo que una carpeta descargada no pueda
  hacerle ejecutar un programa de su elección. VS Code lo muestra en el
  diálogo del modo restringido. Los espacios de trabajo virtuales se
  declaran no admitidos.
- El flujo de publicación crea el espacio de nombres de la extensión en
  Open VSX la primera vez, así que para publicar allí basta con el secreto
  `OVSX_PAT`.
- Trae py-xmlvalidate.py 1.20, cuya opción `-o` encuentra las TEI
  Stylesheets mediante `--stylesheets`, `TEI_STYLESHEETS` o la
  configuración de ODD2RNG. **Schematron: About** muestra qué carpeta usa.
- Las pruebas unitarias se ejecutan en GitHub con cada push, y
  `tools/release.py` publica una versión con una sola orden.

## 0.7.0 — 2026-11-18 (py-xmlvalidate.py 1.19)

- **Schematron: About** muestra qué es la extensión (su versión, autor,
  licencia y repositorio) y lo que su `py-xmlvalidate.py` dice de sí mismo
  (la nueva opción `--about` del programa: su versión, y el Python y las
  bibliotecas con que se ejecuta), con botones para abrir el repositorio o
  copiar los datos.

## 0.6.1 — 2026-11-18 (py-xmlvalidate.py 1.18)

- Trae py-xmlvalidate.py 1.18: las variables (`<let>`) declaradas en el
  nivel del esquema o del patrón se evalúan con la raíz del documento como
  contexto, como dice el Schematron ISO, y una regla que no puede evaluarse
  hace que el programa salga con 3. La extensión muestra los mismos
  problemas que antes; los esquemas con variables en esos niveles tienen
  ahora el comportamiento estándar.

## 0.6.0 — 2026-11-18 (py-xmlvalidate.py 1.17)

- La extensión tiene un repositorio propio, py-xmlvalidate-vscode, que
  trae su propia copia de `py-xmlvalidate.py`; el empaquetado incluye esa
  copia. Su historia vino con ella: cada versión tiene su etiqueta,
  `vVERSION`. El nombre y el ID de la extensión
  (NicolasVaughan.validate-schematron) y sus ajustes no cambian.
- *Setup Guide* abre el README de este repositorio.

## 0.5.12 — 2026-11-17 (py-xmlvalidate.py 1.16)

- Otra vez más rápida con documentos grandes: py-xmlvalidate.py 1.16
  evalúa cada regla con una sola llamada para todos los elementos a los
  que se aplica, en lugar de una llamada por elemento. Una edición de
  26.000 líneas pasó de 11,5 s a 1,9 s (medido una tras otra en la misma
  máquina). Los resultados son los mismos.

## 0.5.11 — 2026-11-17 (py-xmlvalidate.py 1.15)

- Revisiones más rápidas de documentos grandes: py-xmlvalidate.py 1.15
  evalúa juntas todas las pruebas de una regla, y calcula las variables de
  la regla una vez por elemento y no una vez por prueba. Una edición de
  26.000 líneas se revisa ahora en unos 3,5 s en lugar de 13,9 s, lo que
  importa sobre todo mientras se escribe. Los resultados son los mismos.

## 0.5.10 — 2026-11-17 (py-xmlvalidate.py 1.13)

- El script incluido toma el nombre del proyecto: **py-xmlvalidate.py**
  (era xmlvalidate.py). Si fijó `schematron.validatorPath` en una copia
  propia del script, hágalo apuntar a `py-xmlvalidate.py`. El nombre, el
  ID y el título de la extensión no cambian.

## 0.5.9 — 2026-11-17

- El título de la extensión nombra el proyecto: *Schematron Validator
  (py-xmlvalidate)*. Su nombre y su ID, `NicolasVaughan.validate-schematron`,
  no cambian, así que se actualiza como siempre.
- El README nombra el proyecto py-xmlvalidate, cuyo programa es
  `xmlvalidate.py`, y el zip de la versión que menciona es ahora
  `py-xmlvalidate-v.*.zip`.

## 0.5.8 — 2026-11-17 (xmlvalidate.py 1.12)

- El script incluido pasa a llamarse **xmlvalidate.py** (era validate.py),
  de acuerdo con el nuevo nombre del proyecto, py-xmlvalidate. El título de
  la extensión pasa a ser *Schematron Validator (xmlvalidate.py)*; su
  nombre y su ID, `NicolasVaughan.validate-schematron`, no cambian, así que
  se actualiza como siempre. Si fijó `schematron.validatorPath` en una
  copia propia del script, hágalo apuntar a `xmlvalidate.py`.

## 0.5.7 — 2026-11-17

- Los enlaces apuntan al nuevo nombre de los repositorios, py-xmlvalidate:
  el README, el botón y la orden **Setup Guide**, y el repositorio en los
  detalles de la extensión. La extensión conserva su nombre y su ID,
  `NicolasVaughan.validate-schematron`.

## 0.5.6 — 2026-11-14

- validate.py 1.11, que requiere Python 3.15 o posterior: con un Python
  anterior lo dice de inmediato (*validate.py necesita Python 3.15 o
  posterior*), y la extensión muestra ese mensaje, en lugar de fallar más
  tarde de una manera menos clara. **Before you start** pide Python 3.15
  (decía 3.9).

## 0.5.5 — 2026-11-12

- Instrucciones de instalación claras para quien llega por primera vez: el
  README empieza con **Before you start**, cuatro pasos para instalar
  Python y las dos bibliotecas que la extensión necesita (saxonche y
  lxml), con las órdenes para Linux, macOS y Windows, una sección opcional
  sobre jing, y qué hacer cuando algo sale mal.
- La notificación que aparece cuando al intérprete de Python le faltan las
  bibliotecas tiene un botón **Setup Guide** que abre esos pasos; también
  lo tienen el error que aparece cuando le faltan a un intérprete elegido,
  y la nueva orden **Schematron: Setup Guide**.
- La descripción de la extensión y el ajuste `schematron.pythonPath` dicen
  qué se requiere.

## 0.5.4 — 2026-11-12

- Publicada en el Visual Studio Marketplace, con el editor NicolasVaughan.
  El ID de la extensión es ahora `NicolasVaughan.validate-schematron`. Si
  instaló una versión anterior desde un `.vsix` (ID
  `nivaca.validate-schematron`), desinstálela primero, o se ejecutarán
  ambas.
- Los enlaces apuntan al nuevo nombre de los repositorios, py-validate.

## 0.5.3 — 2026-11-12

- Este registro de cambios, que se muestra en la página de la extensión.
- Empaquetada con vsce 4.1.0. Las versiones incluyen ahora también un zip
  de validate.py y su documentación, y la extensión puede publicarse en el
  Marketplace desde GitHub Actions.

## 0.5.2 — 2026-11-12

- El proyecto es ahora software libre, con la Licencia Pública General de
  GNU, versión 3 o posterior (GPL-3.0-or-later). Las versiones anteriores
  se publicaron con la licencia MIT, y sus copias la conservan.

## 0.5.1 — 2026-11-12

- El README empieza con una captura de pantalla de la extensión en
  funcionamiento.

## 0.5.0 — 2026-11-12

- Nueva orden **Schematron: Refresh Schema**: vuelve a descargar el
  esquema remoto del archivo activo (que de lo contrario queda en caché
  para siempre), reconstruye las reglas a partir de él y vuelve a validar
  los archivos abiertos. Con un esquema local dice que no hay nada que
  descargar: sus cambios se recogen solos.

## 0.4.2 — 2026-11-12

- Un icono, y un color de banner a juego para la página de la extensión.

## 0.4.1 — 2026-11-12

- Los errores en un XML mal formado llevan la etiqueta **XML**. Cuando una
  etiqueta no corresponde con su cierre (como `<notde>` por `<note>`), se
  marca también la línea donde se abrió la etiqueta sin cerrar, no solo
  aquella donde el analizador lo notó.
- jing sigue ejecutándose sobre un texto mal formado: sus errores suelen
  apuntar directamente al elemento mal escrito.
- Los errores siempre se subrayan de forma visible: los errores de RelaxNG
  subrayan la etiqueta de apertura culpable, y ningún subrayado tiene cero
  caracteres de ancho (eran invisibles cuando una etiqueta terminaba su
  línea).

## 0.4.0 — 2026-11-12 (validate.py 1.8)

- Valida **mientras se escribe**, cambios sin guardar incluidos, cuando se
  hace una pausa: los ajustes `schematron.validateOnChange` (activado por
  omisión) y `schematron.changeDelayMs` (500 ms por omisión). El texto se
  valida a partir de una copia temporal privada; su archivo nunca se
  escribe.
- **Schematron: Validate Current File** incluye los cambios sin guardar.
- validate.py 1.8: `--as`, y un documento que (todavía) no está bien
  formado recibe un error corriente en su línea en lugar de un fallo.

## 0.3.1 — 2026-11-12 (validate.py 1.7)

- Corrige "no es XML bien formado: Premature end of data" cuando se
  validaban varios archivos a la vez: validate.py 1.7 escribe sus cachés
  de forma atómica, y reemplaza por sí mismo un esquema dañado en la
  caché.

## 0.3.0 — 2026-11-12 (validate.py 1.6)

- Un elemento en la barra de estado para el archivo actual: un indicador
  giratorio mientras valida, una marca de verificación cuando no hay
  problemas, el número de problemas, o un "failed" en rojo cuando la
  validación no pudo ejecutarse. Al hacer clic se abre el registro de
  salida.
- validate.py 1.6: los mensajes muestran bien los nombres de elementos
  (`<name/>`) y los valores de atributos (`<value-of>`).

## 0.2.0 — 2026-11-12

- Cuando al intérprete de Python le falta saxonche o lxml, el mensaje
  nombra el intérprete que se probó, y una notificación (que aparece una
  sola vez) ofrece **Choose Interpreter…** y **Open Settings**.
- Nueva orden **Schematron: Select Python Interpreter…**: elige un Python,
  verifica que pueda importar saxonche y lxml, y lo guarda.
- Cambiar cualquier ajuste `schematron.*` vuelve a validar los archivos
  abiertos.

## 0.1.0 — 2026-11-12 (validate.py 1.5)

- Primera versión. Valida los archivos XML con un `<?xml-model?>` al
  abrirlos y al guardarlos con `validate.py --json`, y con jing cuando el
  esquema es RelaxNG, y muestra los resultados como diagnósticos en el
  editor y en el panel Problems. Ajustes para el intérprete de Python, el
  esquema, jing y el momento de validar.
