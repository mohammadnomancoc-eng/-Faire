const modules = [
  'react-confetti',
  'react-datepicker',
  'react',
  'framer-motion',
  'react-router-dom',
  'lucide-react',
];
for (const name of modules) {
  try {
    const mod = require(name);
    console.log('MODULE', name);
    for (const key of ['default', ...Object.keys(mod).sort()]) {
      if (key in mod) {
        const value = mod[key];
        const t = typeof value;
        if (t === 'function') {
          console.log('  ', key, 'function', value.name || '(anonymous)');
        } else if (t === 'object') {
          const keys = Object.keys(value).slice(0, 10);
          console.log('  ', key, 'object keys', keys.length ? keys : '[]', keys.slice(0,5));
        } else {
          console.log('  ', key, t);
        }
      }
    }
  } catch (error) {
    console.error('ERROR', name, error.message);
  }
}
