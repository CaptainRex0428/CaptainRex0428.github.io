# DEV EXPERIENCE

本文件记录本项目的工程经验：修 bug、踩环境坑、遇到反直觉行为之后**当场追加**一条。
每条四段式：**现象 / 根因 / 修法 / 边界**。只记录会重复发生、且下次不看就会再踩一次的东西。

---

## EX-001｜`npm ci` 卡死在 puppeteer 下载 Chromium

- **现象**：全新克隆后跑 `npm ci`，前面几百个包都装完，最后在 `node_modules/puppeteer` 的 postinstall 报 `command failed: node install.mjs`，错误链是 `Failed to set up chrome v149.0.7827.22` → `DefaultProvider: read ECONNRESET`。整条 `npm ci` 以 exit 1 结束，`node_modules` 处于半装状态。
- **根因**：`puppeteer` 的 postinstall 会从 `storage.googleapis.com` 下载 Chromium 与 chrome-headless-shell。本机网络（国内）对这个 CDN 会 `ECONNRESET`，属于网络层问题，不是依赖树或 Node 版本问题；`Test-NetConnection storage.googleapis.com:443` 是通的，误导性很强。
- **修法**：`$env:PUPPETEER_SKIP_DOWNLOAD="true"` 后再跑 `npm ci`（PowerShell 里也可写成 `$env:PUPPETEER_SKIP_DOWNLOAD="true"; npm ci`），本机实测 447 包 / 23 s / exit 0。构建、`astro dev`、`astro preview` 都不需要 Chromium。
- **边界**：只有 `scripts/fetch-zhihu-column.mjs`、`scripts/fetch-known-zhihu-articles.mjs` 这两个知乎导入脚本需要真浏览器。要用它们时再单独装 Chromium，并且一样得挂代理；不要为此把 `PUPPETEER_SKIP_DOWNLOAD` 写进 `.npmrc` 一劳永逸——那会让后来人以为项目不需要浏览器。

## EX-002｜固定视口截图看着像移动端溢出，其实是截图裁剪

- **现象**：用 `msedge --headless --screenshot --window-size=390,1600` 抓移动端首页，作品卡片的描述文字明显被右边缘切断，像是横向溢出。
- **根因**：`--screenshot` 只截**指定尺寸的视口**，不是整页。页面在 390 宽下卡片确实会超出 1600 高的可视区，截图把超出部分硬裁了；用肉眼看截图无法区分「裁剪」和「真溢出」。
- **修法**：用项目已装的 `puppeteer` 驱动本机 Edge（`executablePath` 指向 `msedge.exe`，Chromium 没下载也能用），在页面里直接读 `documentElement.scrollWidth` 与 `clientWidth`，并遍历元素取 `getBoundingClientRect().right > innerWidth`。实测桌面 1440 / 移动 390 各 4 页，`scrollWidth == clientWidth`，溢出元素 0，确认是假象。整页截图用 `page.screenshot({ fullPage: true })`。
- **边界**：探针脚本放在同步盘和仓库之外（`D:\tmp\scratch\`），不进仓库、不进构建；它只是本地核对手段，不替代真机验收。

## EX-003｜`prebuild` 会往 `public/` 写图片，但不会弄脏工作树

- **现象**：`npm run build` 之前先跑 `scripts/copy-content-images.mjs`，把 `src/content/{blog,works}/*/` 下的图片复制到 `public/{blog,works}/`，看起来会修改仓库里已跟踪的文件。
- **根因**：这些副本本来就已提交进 `public/`，且复制是覆盖式同字节写入，`git` 比对后无差异。
- **修法**：无需处理。构建后 `git status --porcelain` 应为空；若非空，说明有人只改了 `src/content` 里的图而没同步提交 `public/`，那才是真问题。
- **边界**：只有新增或替换内容图片时会改变 `public/`，此时两个位置要一起提交，否则线上图与源图不一致。
