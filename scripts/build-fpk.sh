#!/bin/bash
# Build on Linux with fnpack; accepts compiled dist or a Docker image.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MODE="${1:-}"
SOURCE="${2:-}"
OUTPUT="${3:-$ROOT/dist/fpk}"
case "$MODE" in
    --dist|--image) [ -n "$SOURCE" ] || { echo 'Missing source' >&2; exit 1; } ;;
    *) echo "Usage: $0 --dist /path/to/dist [output-dir] | --image image:tag [output-dir]" >&2; exit 1 ;;
esac
command -v fnpack > /dev/null
STAGE="$(mktemp -d "${TMPDIR:-/tmp}/nes-web-fpk.XXXXXX")"
CONTAINER=""
cleanup() {
    if [ -n "$CONTAINER" ]; then docker container rm "$CONTAINER" > /dev/null; fi
    # Only remove the staging directory created by this invocation.
    if [[ "$STAGE" == */nes-web-fpk.* ]]; then rm -rf -- "$STAGE"; fi
}
trap cleanup EXIT
cp -a "$ROOT/packaging/fnos/." "$STAGE/"
if [ -n "${FPK_VERSION:-}" ]; then
    if [[ ! "$FPK_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$ ]]; then
        echo 'FPK_VERSION must be a version such as 0.2.0 or 0.2.0-beta.1' >&2
        exit 1
    fi
    sed -i "s/^version=.*/version=$FPK_VERSION/" "$STAGE/manifest"
fi
if [ "$MODE" = --image ]; then
    [ "$(docker image inspect "$SOURCE" --format '{{.Architecture}}')" = amd64 ] || {
        echo 'This FPK currently targets x86_64 fnOS.' >&2; exit 1;
    }
    CONTAINER="$(docker create "$SOURCE")"
    docker cp "$CONTAINER:/server" "$STAGE/app/server"
    docker cp "$CONTAINER:/client" "$STAGE/app/client"
    docker image inspect "$SOURCE" --format '{{.Id}}' > "$STAGE/app/BUILD-INFO"
else
    [ -f "$SOURCE/server/index.js" ] && [ -f "$SOURCE/client/index.html" ]
    cp -a "$SOURCE/server" "$SOURCE/client" "$STAGE/app/"
    echo 'Source: compiled dist directory' > "$STAGE/app/BUILD-INFO"
fi
[ -d "$STAGE/app/server/node_modules" ]
if find "$STAGE/app/server" -name '*.node' -print -quit | grep -q .; then
    echo 'Native addons require a Linux fnOS rebuild; refusing to package them.' >&2
    exit 1
fi
# Legacy images include unused crawler/database sample configuration.
# Neither feature is used by nes-web; do not distribute those values.
mkdir -p "$STAGE/app/server/config"
printf '{}\n' > "$STAGE/app/server/config/client.json"
printf '{}\n' > "$STAGE/app/server/config/database.json"
cp "$ROOT/LICENSE" "$STAGE/LICENSE"
cp "$ROOT/LICENSE" "$STAGE/app/LICENSE"
chmod -R a+rX "$STAGE"
chmod 755 "$STAGE"/cmd/*
(cd "$STAGE" && fnpack build)
VERSION="$(sed -n 's/^version=//p' "$STAGE/manifest")"
mkdir -p "$OUTPUT"
cp "$STAGE/nes-web.fpk" "$OUTPUT/nes-web-$VERSION-x86.fpk"
(cd "$OUTPUT" && sha256sum "nes-web-$VERSION-x86.fpk" > "nes-web-$VERSION-x86.fpk.sha256")
cat "$OUTPUT/nes-web-$VERSION-x86.fpk.sha256"
