"""Regression: fnOS refuses app.tgz links pointing at the CI build host."""
import importlib.util
import io
import tarfile
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('verify_fpk', Path(__file__).resolve().parents[1] / 'scripts/verify-fpk.py')
verify = importlib.util.module_from_spec(spec)
spec.loader.exec_module(verify)


class ArchiveLinks(unittest.TestCase):
    def check_archive(self, entries):
        data = io.BytesIO()
        with tarfile.open(fileobj=data, mode='w:gz') as archive:
            for name, target in entries:
                entry = tarfile.TarInfo(name)
                if target is not None:
                    entry.type = tarfile.SYMTYPE
                    entry.linkname = target
                archive.addfile(entry)
        data.seek(0)
        with tarfile.open(fileobj=data) as archive:
            verify.verify_members(archive)

    def test_relative_npm_bin_links(self):
        self.check_archive([('server/node_modules/mime/cli.js', None),
                            ('server/node_modules/.bin/mime', '../mime/cli.js')])

    def test_ci_absolute_links_rejected(self):
        with self.assertRaisesRegex(AssertionError, 'Absolute archive link'):
            self.check_archive([('server/node_modules/.bin/mime',
                                 '/home/runner/work/nes-web/nes-web/build-tools/runtime/node_modules/mime/cli.js')])

    def test_escaping_link_rejected(self):
        with self.assertRaisesRegex(AssertionError, 'Unsafe archive path'):
            self.check_archive([('server/escape', '../../outside')])

    def test_chain_escape_rejected(self):
        with self.assertRaises(AssertionError):
            self.check_archive([('server/bin/tool', '../redirect/tool'), ('server/redirect', '../../outside')])

    def test_dangling_and_cyclic_links_rejected(self):
        for entries in [[('server/bin/tool', '../missing')], [('a', 'b'), ('b', 'a')]]:
            with self.assertRaises(AssertionError):
                self.check_archive(entries)


if __name__ == '__main__':
    unittest.main()
