"""Inspect the final package without extracting or executing its contents."""
import io
import json
import sys
import tarfile
from pathlib import Path

package = Path(sys.argv[1])
with tarfile.open(package, 'r:gz') as outer:
    manifest = dict(line.split('=', 1) for line in outer.extractfile('manifest').read().decode().splitlines()
                    if '=' in line and not line.lstrip().startswith('#'))
    manifest = {key.strip(): value.strip().strip('"') for key, value in manifest.items()}
    assert manifest['install_dep_apps'] == 'nodejs_v24'
    assert manifest['platform'] == 'x86'
    for member in outer.getmembers():
        assert not member.name.startswith('/') and '..' not in Path(member.name).parts
    with tarfile.open(fileobj=io.BytesIO(outer.extractfile('app.tgz').read()), mode='r:gz') as app:
        assert not any(member.name.endswith('.nes') for member in app.getmembers()), 'ROM included in FPK'
        for name in ['client', 'database']:
            assert json.load(app.extractfile('server/config/' + name + '.json')) == {}
        assert b'mappers[23] = Mapper23' in app.extractfile('client/cdn/tsnes/dist/nes.js').read()
        assert '简体中文'.encode() in app.extractfile('client/assets/app.js').read()
        assert b'#f5f7fb' in app.extractfile('client/assets/app.css').read()
        entry = json.load(app.extractfile('ui/config'))['.url']['nes-web.main']
        assert entry['port'] == '8180' and entry['type'] == 'url'
print('FPK verified:', package.name)
