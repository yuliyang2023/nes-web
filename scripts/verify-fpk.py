"""Inspect the final package without extracting or executing its contents."""
import io
import json
import posixpath
import sys
import tarfile
from pathlib import Path

def verify_members(archive):
    members = {member.name.rstrip('/'): member for member in archive.getmembers()}
    def safe(name):
        normalized = posixpath.normpath(name)
        assert not posixpath.isabs(name) and normalized != '..' and not normalized.startswith('../'), 'Unsafe archive path: ' + name
        return normalized
    def resolve(name, seen=None):
        seen = set() if seen is None else seen
        name = safe(name)
        parts = name.split('/')
        for i in range(1, len(parts) + 1):
            prefix = '/'.join(parts[:i])
            entry = members.get(prefix)
            if entry and (entry.issym() or entry.islnk()):
                assert prefix not in seen, 'Cyclic archive link: ' + prefix
                assert not posixpath.isabs(entry.linkname), 'Absolute archive link: ' + prefix + ' -> ' + entry.linkname
                target = posixpath.join(posixpath.dirname(prefix), entry.linkname) if entry.issym() else entry.linkname
                return resolve(posixpath.join(target, *parts[i:]), seen | {prefix})
        return name
    for member in members.values():
        safe(member.name)
        assert member.isfile() or member.isdir() or member.issym() or member.islnk(), 'Unsupported archive entry: ' + member.name
        if member.issym() or member.islnk():
            resolved = resolve(member.name)
            assert resolved in members, 'Dangling archive link: ' + member.name

def main():
    package = Path(sys.argv[1])
    with tarfile.open(package, 'r:gz') as outer:
        verify_members(outer)
        manifest = dict(line.split('=', 1) for line in outer.extractfile('manifest').read().decode().splitlines()
                        if '=' in line and not line.lstrip().startswith('#'))
        manifest = {key.strip(): value.strip().strip('"') for key, value in manifest.items()}
        assert manifest['install_dep_apps'] == 'nodejs_v24'
        assert manifest['platform'] == 'x86'
        for member in outer.getmembers():
            assert not member.name.startswith('/') and '..' not in Path(member.name).parts
        with tarfile.open(fileobj=io.BytesIO(outer.extractfile('app.tgz').read()), mode='r:gz') as app:
            verify_members(app)
            assert not any(member.name.endswith('.nes') for member in app.getmembers()), 'ROM included in FPK'
            for name in ['client', 'database']:
                assert json.load(app.extractfile('server/config/' + name + '.json')) == {}
            assert b'mappers[23] = Mapper23' in app.extractfile('client/cdn/tsnes/dist/nes.js').read()
            assert '简体中文'.encode() in app.extractfile('client/assets/app.js').read()
            assert b'#f5f7fb' in app.extractfile('client/assets/app.css').read()
            entry = json.load(app.extractfile('ui/config'))['.url']['nes-web.main']
            assert entry['port'] == '8180' and entry['type'] == 'url'
    print('FPK verified:', package.name)


if __name__ == "__main__":
    main()
