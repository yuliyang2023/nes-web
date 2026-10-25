FCEUmm core for nes-web
======================

Upstream: https://github.com/libretro/libretro-fceumm
Commit: 3a84a6fd0ba20dd4877c06b1d58741172148395f
License: GPL-2.0-or-later; see LICENSE and the notices inside the source archive.

The original integration/build recipe is from romdev at
https://github.com/monteslu/romdev/tree/ef6deb4c36e35a6fb2b8fb582e44d0d21960023b
(package romdev-core-fceumm 0.13.2). Its build scripts, memory-region patch
and debug sources are included in source/romdev. The upstream FCEUmm source
archive, including libretro-common, is included in source/.

nes-web additionally applies source/nes-web-trainer.patch: VRC2/VRC4 carts
with an iNES trainer retain readable/writable cartridge RAM when a translated
ROM clears the VRC4 WRAM-enable bit. This preserves self-modifying trainer
code used by the two translated Manhattan Project ROMs. Carts without a
trainer retain the original WRAM protection behavior. No ROM data is patched.

Build with scripts/rebuild-fceumm.sh (Docker, pinned Emscripten 4.0.18), then
node scripts/build-core.js. The latter wraps generated glue for AMD/CommonJS
and supplies wasmBinary/MEMFS in both hosts. The app downloads WASM locally;
no third-party runtime/CDN is required for the core.

The web adapter is maintained at vendor/tsnes/src/runtime.js. It resamples
stereo 48 kHz output to the app's mono 44.1 kHz stream, converts pixels to the
existing video format, and maps both players and turbo buttons. Loading is
asynchronous; callers must await load().

Compatibility exception: the translated Super Snake image of 57360 bytes,
CRC32 d2c415f0 (SHA256 c49c9f0d527d197ad10a06d481d41a2eb17249b164342efbaffa1bdf76977ba5),
uses the bundled legacy tsnes core. The replacement core black-screens on
this particular translation; the legacy core reaches gameplay. Selection is
by complete content checksum, never filename or a mapper-wide fallback.
Legacy source and its GPL-3.0 license are also shipped in the built app.
