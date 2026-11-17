// Copies ../xmlvalidate.py and ../LICENSE into the extension folder so the
// packaged .vsix works on its own (schematron.validatorPath can override it).
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const ext = path.resolve(__dirname, '..');

// (start from an empty folder, so no copy left by an earlier build, such as
// the script under a former name, gets into the package)
fs.rmSync(path.join(ext, 'validator'), { recursive: true, force: true });
fs.mkdirSync(path.join(ext, 'validator'), { recursive: true });
fs.copyFileSync(path.join(root, 'xmlvalidate.py'), path.join(ext, 'validator', 'xmlvalidate.py'));
fs.copyFileSync(path.join(root, 'LICENSE'), path.join(ext, 'LICENSE'));
console.log('bundled xmlvalidate.py and LICENSE');
