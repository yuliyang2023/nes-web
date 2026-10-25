# nes-web
[![travis][travis-badge]][travis-url] [![appveyor][appveyor-badge]][appveyor-url] ![license][license-badge]

[Demo](https://game.nfam.me)

Multiplayer Online Classic NES Games on Web Browser, using [`WebRTC`](https://webrtc.org) Peer to Peer connection.

## 飞牛 fnOS FPK

提供原生 x86_64 应用包，依赖飞牛官方 **Node.js v24**，不需要 Docker。
在应用中心手动安装 `.fpk`，从桌面“NES 游戏厅”打开，或访问 `http://NAS-IP:8180/`。
已有 Docker 版继续使用原来的 8080 端口，两者独立运行。

游戏文件放在 **文件管理 → 应用文件 → nes-web → roms**，同名 PNG 封面放在 **screen**。
导入或删除 ROM 后重启原生应用，重新扫描列表。安装包不含 ROM，也不会自动迁移 Docker 数据。
应用使用专用非 root 用户运行；生命周期脚本不会删除 ROM/封面共享目录。

在安装了官方 [fnpack](https://developer.fnnas.com/docs/cli/fnpack) 的 Linux 主机上打包：

```shell
# 使用已经构建好的完整 dist（包括 server/node_modules）
bash scripts/build-fpk.sh --dist /path/to/dist
# 或从包含最新修复的 x86_64 镜像提取服务与前端
bash scripts/build-fpk.sh --image nes-web:gamepad-20261025
```

### GitHub Actions 自动打包

仓库的 **Actions → Build fnOS FPK → Run workflow** 可手动打包，版本留空时使用
`packaging/fnos/manifest` 中的版本。完成后在该次运行的 **Artifacts** 下载 FPK 和 SHA-256 校验文件。
推送 master 或提交 PR 也会构建、测试并上传产物，产物保留 30 天。

推送 `v0.1.2` 等版本标签时，工作流使用标签中的版本打包，并自动创建 GitHub Release、上传安装包。
无需配置额外 Secret，也不需要 SSH 连接 NAS 或发布 Docker 镜像。

云端使用 Node.js 24 和独立锁定的 `build-tools` 依赖，从源码构建所有前后端文件，
不运行旧 Gulp/node-sass 工具链，也不调用在线 favicon 生成服务。官方 fnpack 下载有固定 SHA-256 校验。
在本地复现源码构建：

```shell
npm ci --prefix build-tools --ignore-scripts
npm ci --prefix build-tools/runtime --ignore-scripts
NODE_PATH="$PWD/build-tools/node_modules" npm test
npm run build:source
node scripts/smoke-dist.js
# 可选：同时检查真实浏览器中的启动、中文、游戏加载和手机布局
node build-tools/node_modules/playwright/cli.js install chromium
node scripts/smoke-dist.js --browser
bash scripts/build-fpk.sh --dist "$PWD/dist"
python3 scripts/verify-fpk.py dist/fpk/nes-web-0.1.1-x86.fpk
```

手动覆盖包版本可设置 `FPK_VERSION=0.1.2`，仅影响本次打包，不修改源码清单。
修改运行时 dependencies 后需同步 `build-tools/runtime/package.json` 并更新其 lockfile。

产物位于 `dist/fpk/nes-web-0.1.1-x86.fpk`。`packaging/fnos` 包含应用清单、
权限、共享目录、桌面入口和启停脚本；图标可通过 `python3 scripts/create-fpk-icons.py` 重建。
打包时会移除旧镜像中未使用的示例配置值，并拒绝直接打包未经适配的原生 Node 插件。

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
