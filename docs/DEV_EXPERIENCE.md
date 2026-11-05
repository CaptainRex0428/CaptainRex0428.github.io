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

## EX-004｜`en.json` 少一个字段，整站构建直接失败

- **现象**：往 `src/i18n/zh.json` 加了新字段（如 `contact`），本地 `npm run build` 报 `Cannot read properties of undefined (reading 'xxx')`，构建中断；若已推送，GitHub Pages 会停在上一版。
- **根因**：i18n 是 URL 前缀方案，构建时 `/en/` 页面也会渲染 `Footer.astro` 等组件并读 `t.contact.title`。`en.json` 缺该路径 → 取到 `undefined` → 抛错。这属于**构建期**失败，不是运行期兜底。
- **修法**：改 `zh.json` 必须同一次提交补齐 `en.json` 的对应字段；改完本地 `npm run build` 验证再推。
- **边界**：纯中文页面（未挂 i18n 的内容页，如文章正文）不受影响；但只要用了 `t.*` 的共享组件（Header/Footer/Base）就会踩到。

## EX-005｜GIF 走图片管线会变静态图

- **现象**：博客里的屏录 GIF 引用成 `./anim.gif` 后，线上变成一张静态图，动画没了。
- **根因**：Astro 图片管线会把它转成 WebP，只取首帧。
- **修法**：需要保动画的 GIF 改用 public 直出路径 `/blog/<slug>/anim.gif`（`prebuild` 已把内容目录图片复制过去）。
- **边界**：普通截图仍用 `./x.png`，能享受转码与尺寸优化；只有"必须动"的文件才走 public。

## EX-006｜知乎「编辑于」不是发布日，导入批次全写成抓取日

- **现象**：ProjectSH 七篇导入后 `date` 全是 `2026-05-28`，文章页显示同一天；知乎上每篇的发布时间其实分散在 2025-09 到 2026-05。
- **根因**：两层叠加。① 早期导入脚本没取日期字段，退回抓取当天；② 知乎文章页那行 `编辑于 2026-06-04` 是 `dateModified`（作者批量编辑后的时间），被误当成发布日。真正的发布日在 `<meta itemprop="datePublished">`，与专栏列 API 的 `items[].created` 一致。
- **修法**：逐篇读 `datePublished`（或列 API 的 `created`），转本地日期后写入 frontmatter；合集 `date` 取成员最早一篇。见 `docs/CONTENT_GUIDE.md`「日期口径」。
- **边界**：`updated` 只反映最后编辑，任何平台导出一律不用它当发布日期；取不到真实日期就停下来问负责人，不许用抓取日顶替。
