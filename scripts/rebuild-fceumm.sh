#!/usr/bin/env bash
# Rebuild the vendored binary from the complete corresponding source.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUILD="$(mktemp -d "${TMPDIR:-/tmp}/nes-fceumm.XXXXXX")"
IMAGE='emscripten/emsdk@sha256:bbe90e2b00acbd1a9596087d88305029f383de1eb71c0cdb20f4e19647265450'
mkdir -p "$BUILD/scripts" "$BUILD/build/fceumm/src"
cp -R "$ROOT/vendor/fceumm/source/romdev/." "$BUILD/scripts/"
tar xzf "$ROOT/vendor/fceumm/source/libretro-fceumm-3a84a6f.tar.gz" -C "$BUILD/build/fceumm/src" --strip-components=1
cp "$ROOT/vendor/fceumm/source/nes-web-trainer.patch" "$BUILD/"
git -C "$BUILD/build/fceumm/src" apply --no-index "$BUILD/nes-web-trainer.patch"
# The original recipe fetches the same commit; here we use its included archive.
# Skip checkout/reset on this fresh tree so our local patch remains applied.
python3 - "$BUILD/scripts/build-fceumm.sh" <<'PY'
import sys
from pathlib import Path
p=Path(sys.argv[1])
s=p.read_text()
s='\n'.join(':' if line.startswith(('fetch_pinned cores.fceumm ', 'require_git_toplevel', 'git checkout -- ')) else line for line in s.splitlines())+'\n'
p.write_text(s)
PY
docker run --rm --platform linux/amd64 -v "$BUILD:/work" -w /work "$IMAGE" bash scripts/build-fceumm.sh
cp "$BUILD/src/cores/wasm/fceumm_libretro.js" "$ROOT/vendor/fceumm/fceumm_libretro.js"
cp "$BUILD/src/cores/wasm/fceumm_libretro.wasm" "$ROOT/vendor/tsnes/dist/fceumm_libretro.wasm"
node "$ROOT/scripts/build-core.js" --update-hashes
echo "Built core. Intermediate source: $BUILD"
