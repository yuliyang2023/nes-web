#!/bin/bash
# Linux/fnOS integration test; does not install or alter any App Center app.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$(mktemp -d /tmp/nes-fpk-config.XXXXXX)"
export TRIM_APPDEST="$WORK/app" TRIM_PKGVAR="$WORK/var" TRIM_PKGETC="$WORK/etc"
export TRIM_SERVICE_PORT="${FPK_TEST_PORT:-18186}"
export TRIM_DATA_SHARE_PATHS="$WORK/default/roms:$WORK/default/screen"
cleanup() {
    "$WORK/cmd/main" stop || true
    if [[ "$WORK" == /tmp/nes-fpk-config.* ]]; then rm -rf -- "$WORK"; fi
}
mkdir -p "$WORK/app" "$WORK/var" "$WORK/etc" "$WORK/cmd" "$WORK/default/roms" "$WORK/default/screen" "$WORK/other roms" "$WORK/other covers"
cp "$ROOT/packaging/fnos/cmd/main" "$ROOT/packaging/fnos/cmd/config_callback" "$WORK/cmd/"
chmod +x "$WORK/cmd/"*
trap cleanup EXIT
ln -s "$ROOT/dist/server" "$WORK/app/server"
ln -s "$ROOT/dist/client" "$WORK/app/client"
printf 'fixture' > "$WORK/other roms/External.nes"
# env paths make symlinked server code independent of its source directory.
"$WORK/cmd/main" start
"$WORK/cmd/main" status
export wizard_rom_dir="$WORK/other roms" wizard_screen_dir="$WORK/other covers"
"$WORK/cmd/config_callback"
"$WORK/cmd/main" status
curl --noproxy '*' -fsS "http://127.0.0.1:$TRIM_SERVICE_PORT/api/games/" | grep -q External
printf 'fixture' > "$WORK/other roms/Added.nes"
curl --noproxy '*' -fsS -X POST "http://127.0.0.1:$TRIM_SERVICE_PORT/api/games/reload" | grep -q Added
# Invalid configuration must not replace the saved working directories.
export wizard_rom_dir="$WORK/missing"
if "$WORK/cmd/config_callback"; then echo 'Invalid path accepted' >&2; exit 1; fi
grep -Fxq "$WORK/other roms" "$WORK/etc/directories"
"$WORK/cmd/main" status
# Restart uses persisted directories without relying on wizard variables.
unset wizard_rom_dir wizard_screen_dir
"$WORK/cmd/main" stop
"$WORK/cmd/main" start
curl --noproxy '*' -fsS "http://127.0.0.1:$TRIM_SERVICE_PORT/api/games/" | grep -q External
printf 'FPK configuration passed: custom paths, spaces, immediate apply, reload, invalid paths, persistence\n'
