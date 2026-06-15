const mod = require('react-confetti');
console.log('module keys', Object.keys(mod));
if (mod.default) {
  console.log('default kind', typeof mod.default);
  if (mod.default.$$typeof) {
    console.log('default $$typeof', mod.default.$$typeof.toString());
  }
  if (mod.default.render) {
    console.log('default render type', typeof mod.default.render);
  }
}
console.log('module default is function?', typeof mod.default === 'function');
console.log('module default is object?', typeof mod.default === 'object');
