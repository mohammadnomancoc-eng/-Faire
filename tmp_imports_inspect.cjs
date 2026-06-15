(async () => {
  const packages = ['react-confetti', 'react-datepicker'];
  for (const name of packages) {
    try {
      const mod = await import(name);
      console.log('MODULE', name, 'keys:', Object.keys(mod));
      console.log('default type:', typeof mod.default);
      console.log('default keys:', mod.default && typeof mod.default === 'object' ? Object.keys(mod.default).slice(0,20) : []);
      console.log('default is function?', typeof mod.default === 'function');
      if (typeof mod.default === 'function') {
        console.log('default name', mod.default.name);
      }
    } catch (e) {
      console.error('ERROR', name, e && e.message);
    }
  }
})().catch(err => { console.error(err); process.exit(1); });
