# CaptainRex 个人主页

图灵老师的个人技术主页源码：技术美术、图形学与实时渲染，以及 UE / DirectX / C++ 方向的学习笔记与作品。

- 线上站点：<https://captainrex0428.github.io/>
- 定位：纯个人技术主页。文中的机构账号链接只作为入口，不做招生与商业推广。

## 技术栈

- **Astro 4 + MDX**，`output: 'static'`，构建产物是纯静态站点
- 原生 TypeScript / CSS，没有 UI 框架
- 中英双语：文案在 `src/i18n/`，英文路由带 `/en/` 前缀
- 部署走 GitHub Actions → GitHub Pages

## 本地开发

需要 Node 20 及以上。

```bash
# 注意：必须跳过 puppeteer 的 Chromium 下载
# 只有 scripts/fetch-zhihu-*.mjs 这两个知乎导入脚本才需要 Chromium
PUPPETEER_SKIP_DOWNLOAD=true npm ci

npm run dev      # 开发服务器，默认 http://localhost:4321
npm run build    # 构建到 dist/
npm run preview  # 预览 dist/ 里的构建产物
```

Windows PowerShell 下这样写环境变量：

```powershell
$env:PUPPETEER_SKIP_DOWNLOAD="true"; npm ci
```

## 目录结构

```text
src/
├─ pages/          路由：/、/blog、/works、/about，英文版在 /en/ 下
├─ content/
│  ├─ blog/        文章：<slug>/index.mdx，图片放同一目录
│  ├─ works/       作品：同上
│  ├─ blogSeries/  文章合集
│  └─ workSeries/  作品合集
├─ components/     Card、Header、Footer 等组件
├─ layouts/        Base 布局
├─ i18n/           zh.json / en.json
├─ config/         联系方式等站点配置
└─ styles/         global.css
public/            静态资源：图标、二维码、内容图片副本
scripts/           构建前后脚本
docs/              工程经验记录
```

## 写内容

新增一篇文章：

1. 建目录 `src/content/blog/<slug>/`
2. 放入 `index.mdx`，frontmatter 至少包含 `title`、`description`、`category`、`tags`、`date`
3. 图片放在同一目录；`npm run build` 前的 `prebuild` 会自动复制到 `public/blog/<slug>/`

作品同理，放 `src/content/works/<slug>/`，另有 `featured`（是否推荐）和 `order`（首页排序）两个字段。

合集页由 `src/content/blogSeries/`、`src/content/workSeries/` 控制。

## 部署

推送到 `master` 会触发 `.github/workflows/deploy.yml`：

```text
npm ci → npm run build → 上传 dist/ → 发布到 GitHub Pages
```

站点地址不随仓库改名变化，仍是 <https://captainrex0428.github.io/>。

## 已知注意事项

- 用固定视口截图检查移动端时，看着像「横向溢出」往往只是截图裁剪；判断要看 `documentElement.scrollWidth` 是否等于 `clientWidth`。
- `prebuild` 会往 `public/` 写图片副本，正常情况下构建后工作树仍然干净；若出现改动，说明 `src/content` 里的图和 `public/` 下的副本不同步。
- `npm ci` 报的若干漏洞集中在 `puppeteer-extra` 与旧版 `glob` 这类仅导入脚本使用的传递依赖，不会进入静态产物。

更多踩坑记录见 [`docs/DEV_EXPERIENCE.md`](docs/DEV_EXPERIENCE.md)。
