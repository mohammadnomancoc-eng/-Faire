const fs = require('fs');
const path = require('path');
const root = path.join(process.cwd(), 'src');
const imports = [];
const exportsMap = {};

function readFile(file) {
  return fs.readFileSync(file, 'utf8');
}

function addExport(rel, kind, name) {
  exportsMap[rel] = exportsMap[rel] || [];
  exportsMap[rel].push({ kind, name });
}

function resolveImport(srcRel, modulePath) {
  const dir = path.dirname(path.join(root, srcRel));
  let target = path.resolve(dir, modulePath);
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    for (const ext of ['.jsx', '.js', '.ts', '.tsx']) {
      const candidate = path.join(target, 'index' + ext);
      if (fs.existsSync(candidate)) return path.relative(root, candidate).replace(/\\/g, '/');
    }
  }
  for (const ext of ['.jsx', '.js', '.ts', '.tsx']) {
    if (fs.existsSync(target + ext)) return path.relative(root, target + ext).replace(/\\/g, '/');
  }
  if (fs.existsSync(target)) return path.relative(root, target).replace(/\\/g, '/');
  return null;
}

function parseModule(moduleText, rel) {
  const lines = moduleText.split(/\r?\n/);
  for (const line of lines) {
    const importRe = /^\s*import\s+([^\n]+?)\s+from\s+['\"]([^'\"]+)['\"]/;
    const match = line.match(importRe);
    if (match) {
      const importsText = match[1].trim();
      const modulePath = match[2];
      if (!modulePath.startsWith('.')) continue;
      if (importsText.startsWith('{')) {
        const names = importsText
          .slice(1, -1)
          .split(',')
          .map(s => s.trim().split(' as ')[0].trim())
          .filter(Boolean);
        imports.push({ rel, modulePath, names, type: 'named' });
      } else {
        const name = importsText.split(',')[0].trim();
        imports.push({ rel, modulePath, names: [name], type: 'default' });
      }
    }
    const exportDefaultRe = /^\s*export\s+default\s+([A-Za-z0-9_]+)/;
    const exportFnRe = /^\s*export\s+function\s+([A-Za-z0-9_]+)/;
    const exportConstRe = /^\s*export\s+const\s+([A-Za-z0-9_]+)/;
    const exportNamedRe = /^\s*export\s+\{\s*([^}]+?)\s*\}(?:\s*from\s+['\"]([^'\"]+)['\"])?/;
    if (exportDefaultRe.test(line)) {
      addExport(rel, 'default', line.match(exportDefaultRe)[1]);
    }
    if (exportFnRe.test(line)) {
      addExport(rel, 'named', line.match(exportFnRe)[1]);
    }
    if (exportConstRe.test(line)) {
      addExport(rel, 'named', line.match(exportConstRe)[1]);
    }
    const exportNamedMatch = line.match(exportNamedRe);
    if (exportNamedMatch) {
      const names = exportNamedMatch[1]
        .split(',')
        .map(s => s.trim().split(' as ')[-1])
        .filter(Boolean);
      if (exportNamedMatch[2]) {
        names.forEach(name => addExport(rel, 'reexport', { name, source: exportNamedMatch[2] }));
      } else {
        names.forEach(name => addExport(rel, 'named', name));
      }
    }
  }
}

function collectFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full);
    } else if (entry.isFile() && /\.(jsx|js|ts|tsx)$/.test(entry.name)) {
      const rel = path.relative(root, full).replace(/\\/g, '/');
      parseModule(readFile(full), rel);
    }
  }
}

collectFiles(root);

function resolveReexports() {
  let changed = true;
  while (changed) {
    changed = false;
    for (const [rel, exps] of Object.entries(exportsMap)) {
      for (const exp of exps.filter(e => e.kind === 'reexport')) {
        const targetRel = resolveImport(rel, exp.source);
        if (!targetRel) continue;
        const targetExports = exportsMap[targetRel] || [];
        const named = targetExports.filter(e => e.name === exp.name);
        if (named.length) {
          addExport(rel, 'named', exp.name);
          changed = true;
        }
      }
    }
  }
}
resolveReexports();

for (const imp of imports) {
  const targetRel = resolveImport(imp.rel, imp.modulePath);
  if (!targetRel) continue;
  const targetExports = exportsMap[targetRel] || [];
  if (imp.type === 'default') {
    if (!targetExports.some(e => e.kind === 'default')) {
      console.log('INVALID default import', imp.rel, imp.names[0], imp.modulePath, '=>', targetRel, 'exports', targetExports);
    }
  } else {
    for (const name of imp.names) {
      if (!targetExports.some(e => e.kind === 'named' && e.name === name)) {
        console.log('INVALID named import', imp.rel, name, imp.modulePath, '=>', targetRel, 'exports', targetExports);
      }
    }
  }
}
