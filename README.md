# nes-web
[![travis][travis-badge]][travis-url] [![appveyor][appveyor-badge]][appveyor-url] ![license][license-badge]

[Demo](https://game.nfam.me)

Multiplayer Online Classic NES Games on Web Browser, using [`WebRTC`](https://webrtc.org) Peer to Peer connection.

- Supports Gamepad.
- Supports Gamepad Simulation (Keyboard).
- Supports Fullscreen.
- Supports multiple languages.

Language settings include English, Vietnamese, and Simplified Chinese at
`/settings/language`. The selected language is saved in the browser.
The home page provides visible links to settings, key mapping, and language
settings, plus a USB gamepad connection hint. The interface uses a light theme
with white controls and blue selection states. SVG icon data URLs are
percent-encoded for modern browsers.
USB directions support both the left stick and standard D-pad buttons 12–15,
including diagonals and menu repeat. `npm test` includes input regression tests
using the project's TypeScript compiler.
Normal frontend builds include all translations. To update an existing legacy
image, export its `/client/assets/app.js` and compile the locale overlay with
the project's TypeScript 2.9.2 dependency:

```shell
node scripts/build-locale-overlay.js existing-app.js .build/client/app.zh.js
docker build -f Dockerfile.locale --build-arg BASE_IMAGE=nes-web:mapper23-20261025 -t nes-web:mapper23-zh .
```

For the navigation overlay, export the current image's `app.js` and `app.css`,
then use:

```shell
node scripts/build-locale-overlay.js existing-app.js .build/client/app.navigation.js app/translate/lang-zh app/translate/lang-vi app/game/game-list.component app/shared/overlay-button.component
node scripts/build-navigation-css.js existing-app.css .build/client/app.navigation.css
docker build -f Dockerfile.navigation --build-arg BASE_IMAGE=nes-web:mapper23-zh-20261025 -t nes-web:navigation .
```

To apply the light theme to the navigation image:

```shell
node scripts/build-locale-overlay.js existing-app.js .build/client/app.light.js app/game/game-list.component
node scripts/build-navigation-css.js existing-app.css .build/client/app.light.css
docker build -f Dockerfile.light -t nes-web:light .
```

The bundled `vendor/tsnes` core adds mapper 23 (VRC2/VRC4) support.
Run `npm test`, or `NES_TEST_ROM=/path/to/game.nes npm test` for a ROM smoke test.
Normal builds use this local core rather than downloading the original tsnes.

To update an existing legacy container image without rebuilding the old frontend
toolchain, tag its current image and run:

```shell
docker build -f Dockerfile.core --build-arg BASE_IMAGE=nes-web:previous -t nes-web:mapper23 .
```

Recreate the container with its existing port and volume settings. Keep the old
container stopped for rollback. The core image updates the SystemJS URL and
AppCache manifest so browsers can pick up the new core; existing open tabs may
need a reload after their offline cache finishes updating.

![Catalog][1]
![Multiplayer][2]

## How to use this image

### Run on host networking

This example uses host networking for simplicity. Also note the `-v` argument. This directory will be used to store `NES` roms and screen images.

```shell
sudo docker run -d \
    --name nes-web \
    -p 8080:8080 \
    -v ~/data/roms:/data/roms \
    -v ~/data/screen:/data/screen \
    nfam/nes-web
```

- ROM file names in /data/roms must end with `.nes` extension.
- Screen images must have `.png` and have the same base name with the corresponding ROM.

#### HTML

Just navigate to `http://{{address}}:8080/`.

[1]: catalog.png
[2]: multiplayer.png

[travis-badge]: https://travis-ci.org/nfam/nes-web.svg
[travis-url]: https://travis-ci.org/nfam/nes-web
[appveyor-badge]: https://ci.appveyor.com/api/projects/status/github/nfam/nes-web?svg=true
[appveyor-url]: https://ci.appveyor.com/project/nfam/nes-web/
[license-badge]: https://img.shields.io/github/license/nfam/nes-web.svg
