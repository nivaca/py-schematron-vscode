// Copies this repository's py-xmlvalidate.py into validator/, where the
// extension looks for it, so the packaged .vsix works on its own
// (schematron.validatorPath can override it). The copy at the top of the
// repository is kept in step with py-xmlvalidate by its
// tools/sync-plugins.py.
const fs = require('fs');
const path = require('path');

const ext = path.resolve(__dirname, '..');

// (start from an empty folder, so no copy left by an earlier build, such as
// the script under a former name, gets into the package)
fs.rmSync(path.join(ext, 'validator'), { recursive: true, force: true });
fs.mkdirSync(path.join(ext, 'validator'), { recursive: true });
fs.copyFileSync(path.join(ext, 'py-xmlvalidate.py'), path.join(ext, 'validator', 'py-xmlvalidate.py'));
console.log('bundled py-xmlvalidate.py');
