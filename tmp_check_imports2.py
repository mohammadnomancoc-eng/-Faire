import os
import re

root = os.path.join(os.getcwd(), 'src')
exports = {}
imports = []

def add_export(rel, kind, name):
    exports.setdefault(rel, []).append((kind, name))

for dirpath, dirnames, filenames in os.walk(root):
    for fname in filenames:
        if fname.endswith(('.jsx', '.js')):
            path = os.path.join(dirpath, fname)
            rel = os.path.relpath(path, root).replace('\\', '/')
            text = open(path, encoding='utf-8').read()
            for m in re.finditer(r'export\s+default\s+([A-Za-z0-9_]+)', text):
                add_export(rel, 'default', m.group(1))
            for m in re.finditer(r'export\s+function\s+([A-Za-z0-9_]+)', text):
                add_export(rel, 'named', m.group(1))
            for m in re.finditer(r'export\s+const\s+([A-Za-z0-9_]+)', text):
                add_export(rel, 'named', m.group(1))
            for m in re.finditer(r'export\s+\{\s*([^}]+?)\s*\}', text):
                names = [n.strip().split(' as ')[-1] for n in m.group(1).split(',') if n.strip()]
                for name in names:
                    add_export(rel, 'named', name)
            for m in re.finditer(r'export\s+\{\s*([^}]+?)\s*\}\s*from\s+["\']([^"\']+)["\']', text):
                names = [n.strip().split(' as ')[-1] for n in m.group(1).split(',') if n.strip()]
                for name in names:
                    add_export(rel, 'named', name)
            # imports
            for m in re.finditer(r'import\s+\{([^}]+)\}\s+from\s+["\']([^"\']+)["\']', text):
                names = [n.strip().split(' as ')[0] for n in m.group(1).split(',') if n.strip()]
                imports.append((rel, m.group(2), names, 'named'))
            for m in re.finditer(r'import\s+([A-Za-z0-9_]+)\s+from\s+["\']([^"\']+)["\']', text):
                if m.group(1) not in ('React', 'useState', 'useEffect', 'useMemo', 'useContext', 'useRef', 'useCallback', 'useLayoutEffect', 'useReducer', 'useImperativeHandle', 'useDebugValue'):
                    imports.append((rel, m.group(2), [m.group(1)], 'default'))

misses = []
for rel, module, names, typ in imports:
    if module.startswith('.'):
        src_dir = os.path.dirname(os.path.join(root, rel))
        target = os.path.normpath(os.path.join(src_dir, module))
        if os.path.isdir(target):
            for ext in ['.jsx', '.js']:
                candidate = os.path.join(target, 'index' + ext)
                if os.path.exists(candidate):
                    target = candidate
                    break
        else:
            for ext in ['.jsx', '.js']:
                candidate = target + ext
                if os.path.exists(candidate):
                    target = candidate
                    break
        if not os.path.exists(target):
            continue
        target_rel = os.path.relpath(target, root).replace('\\', '/')
        exps = exports.get(target_rel, [])
        if typ == 'default':
            if not any(e[0] == 'default' for e in exps):
                misses.append((rel, module, names[0], typ, target_rel, exps[:10]))
        else:
            for name in names:
                if not any(e[1] == name for e in exps):
                    misses.append((rel, module, name, typ, target_rel, exps[:10]))

for miss in misses:
    print('MISMATCH', miss)
print('checked', len(imports), 'imports', 'exports', sum(len(v) for v in exports.values()))
