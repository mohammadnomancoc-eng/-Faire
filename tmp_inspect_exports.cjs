const { readFileSync } = require('fs');
const { resolve } = require('path');
const packages = ['react-confetti', 'react-datepicker'];
for (const name of packages) {
  try {
    const pkgPath = resolve('node_modules', name, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    console.log('PACKAGE', name, 'package main/module/exports:', pkg.main, pkg.module, pkg.exports);
    let entry;
    if (pkg.module) entry = resolve('node_modules', name, pkg.module);
    else if (pkg.main) entry = resolve('node_modules', name, pkg.main);
    else if (pkg.exports && typeof pkg.exports === 'string') entry = resolve('node_modules', name, pkg.exports);
    else if (pkg.exports && pkg.exports['.'] && pkg.exports['.'].import) entry = resolve('node_modules', name, pkg.exports['.'].import);
    else if (pkg.exports && pkg.exports['.'] && pkg.exports['.'].require) entry = resolve('node_modules', name, pkg.exports['.'].require);
    else entry = resolve('node_modules', name);
    console.log('ENTRY', entry);
    let mod;
    try {
      mod = require(name);
      console.log('REQUIRE', name, 'type', typeof mod, 'has default', Object.prototype.hasOwnProperty.call(mod, 'default'));
      if (mod && typeof mod === 'object') {
        const keys = Object.keys(mod).slice(0, 20);
        console.log('  keys', keys);
        if (Object.prototype.hasOwnProperty.call(mod, 'default')) {
          console.log('  default type', typeof mod.default);
          console.log('  default keys', mod.default && typeof mod.default === 'object' ? Object.keys(mod.default).slice(0,20) : []);
        }
      }
    } catch (e) {
      console.error('REQUIRE ERROR', name, e.message);
    }
    try {
      const src = readFileSync(entry, 'utf8');
      console.log('--- SOURCE HEAD', name, '---');
      console.log(src.split('\n').slice(0, 40).join('\n'));
    } catch (e) {
      console.error('READ ENTRY ERROR', name, e.message);
    }
  } catch (e) {
    console.error('PACKAGE ERROR', name, e.message);
  }
}
