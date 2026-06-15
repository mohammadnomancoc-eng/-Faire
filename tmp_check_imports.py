import os
import re

root = os.path.join(os.getcwd(), 'src')
exports = {}
imports = []

for dirpath, dirnames, filenames in os.walk(root):
    for fname in filenames:
        if fname.endswith(('.jsx', '.js')):
            path = os.path.join(dirpath, fname)
            rel = os.path.relpath(path, root).replace('\\', '/')
            text = open(path, encoding='utf-8').read()
            for m in re.finditer(r'export default\s+([A-Za-z0-9_]+)', text):
                exports.setdefault(rel, []).append(('default', m.group(1)))
            for m in re.finditer(r'export function\s+([A-Za-z0-9_]+)', text):
                exports.setdefault(rel, []).append(('named', m.group(1)))
            for m in re.finditer(r'export const\s+([A-Za-z0-9_]+)', text):
                exports.setdefault(rel, []).append(('named', m.group(1)))
            for m in re.finditer(r'import\s+\{([^}]+)\}\s+from\s+["\']([^"\']+)["\']', text):
                names = [n.strip().split(' as ')[0] for n in m.group(1).split(',')]
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
                targetf = os.path.join(target, 'index' + ext)
                if os.path.exists(targetf):
                    target = targetf
                    break
        else:
            for ext in ['.jsx', '.js']:
                targetf = target + ext
                if os.path.exists(targetf):
                    target = targetf
                    break
        if not os.path.exists(target):
            continue
        target_rel = os.path.relpath(target, root).replace('\\', '/')
        exps = exports.get(target_rel, [])
        if typ == 'default':
            if not any(e[0] == 'default' for e in exps):
                misses.append((rel, module, names[0], typ, target_rel, exps))
        else:
            for name in names:
                if not any(e[1] == name for e in exps):
                    misses.append((rel, module, name, typ, target_rel, exps))

for miss in misses:
    print('MISMATCH', miss)
print('checked', len(imports), 'imports', 'exports', sum(len(v) for v in exports.values()))
