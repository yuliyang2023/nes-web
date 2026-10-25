# nes-web
[![travis][travis-badge]][travis-url] [![appveyor][appveyor-badge]][appveyor-url] ![license][license-badge]

[Demo](https://game.nfam.me)

Multiplayer Online Classic NES Games on Web Browser, using [`WebRTC`](https://webrtc.org) Peer to Peer connection.

## 飞牛 fnOS FPK

提供原生 x86_64 应用包，依赖飞牛官方 **Node.js v24**，不需要 Docker。
在应用中心手动安装 `.fpk`，从桌面“NES 游戏厅”打开，或访问 `http://NAS-IP:8180/`。
已有 Docker 版继续使用原来的 8080 端口，两者独立运行。

游戏文件放在 **文件管理 → 应用文件 → nes-web → roms**，同名 PNG 封面放在 **screen**。
导入或删除 ROM 后，点击网页主页“重新扫描 ROM”，无需重启。安装包不含 ROM，也不会自动迁移 Docker 数据。
应用使用专用非 root 用户运行；生命周期脚本不会删除 ROM/封面共享目录。

### 使用 NAS 其他目录与重新扫描

在飞牛应用中心找到 **NES 游戏厅 → 设置 → 授权目录**，授权要读取的游戏和封面目录。
然后打开应用的 **配置**，填写 NAS 的绝对路径（例如 `/vol1/1000/Games/roms`），
ROM/封面路径均可留空，留空使用默认应用共享目录。保存会重启服务以应用目录配置；
配置保存在应用配置目录中，升级保留。应用只读取游戏与封面，不复制或删除源目录文件。

之后添加或删除 `.nes` 文件，只需点击主页 **重新扫描 ROM**。扫描会替换游戏列表，
删除的游戏会消失，空目录会清空列表，重复扫描不会产生重复条目。
目录不可读时显示错误并保留上次成功列表；修正路径或权限后可再次扫描。
目前扫描目录的第一层，不递归扫描子文件夹；ROM 扩展名使用小写 `.nes`。

Docker/普通 Node 部署可通过 `NES_ROM_DIR` 和 `NES_SCREEN_DIR` 环境变量设置进程可访问的路径。
Docker 需要先把 NAS 目录挂载到容器。网页不接受任意文件系统路径修改；目录由部署配置管理。

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
`0.1.3` 修复了 npm `.bin` 相对链接被复制成 GitHub Runner 绝对路径，导致飞牛报
“解压 app.tgz 失败”的问题。构建会保留相对链接，并在打包前及最终包中检查绝对路径、
目录外部链接、循环链接和失效链接；工作流包含对应回归测试。请使用 `0.1.3` 或更新版本。
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
python3 scripts/verify-fpk.py dist/fpk/nes-web-0.1.4-x86.fpk
```

手动覆盖包版本可设置 `FPK_VERSION=0.1.2`，仅影响本次打包，不修改源码清单。
修改运行时 dependencies 后需同步 `build-tools/runtime/package.json` 并更新其 lockfile。

从源码生成 `dist` 后，也可构建当前 Node.js 24 Docker 运行镜像：

```shell
docker build -f Dockerfile.runtime -t nes-web:current .
```

产物位于 `dist/fpk/nes-web-0.1.4-x86.fpk`。`packaging/fnos` 包含应用清单、
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

当前源码构建使用 FCEUmm WebAssembly 核心，支持此次游戏库需要的 mapper
19、23、25、85、90、192、198，以及 NES 2.0 头信息。0.1.4 同时修复
带 trainer 的两份《曼哈顿计划》汉化版、泡泡龙启动崩溃和雪人兄弟灰屏。
《超级贪吃蛇》的指定汉化 ROM 按内容校验值选择保留的旧核心。
核心源码、许可证、补丁和重建说明见 [vendor/fceumm](vendor/fceumm/README.md)，
FPK 和 Docker 中也包含对应源码与许可证。核心无需连接外部服务。

更新到此版本需要完整重建前端和运行镜像（`npm run build:source` +
`Dockerfile.runtime`）；新的 `Emulator.load()` 返回 Promise。
`Dockerfile.core` 仅用于历史版本的 mapper 23 旧核心补丁。

可在 NAS 上对实际游戏目录进行只读回归，每个 ROM 独立进程运行 1800 帧，
模拟 Start、方向、A/B，并校验 HTTP 字节、视频、音频与异常：

```shell
NES_AUDIT_ROM_DIR=/vol2/1000/data/game \
NES_AUDIT_BASE=http://127.0.0.1:8180 \
NES_AUDIT_OUT=/tmp/nes-rom-audit \
node scripts/audit-roms.js
```

检查结果 JSON 和各阶段截图；这属于启动和短时运行测试，不代表全流程通关。
重建 WASM 核心使用 `bash scripts/rebuild-fceumm.sh`，普通源码构建使用仓库中
已编译且校验过的本地核心。

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
