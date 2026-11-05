# 内容维护指南

新增/修改博客与作品的实操说明。取代早期 `.claude/how-to-add-blog.md`（其中"图片放 public"的说法已过时，见下文）。

## 目录约定

一篇内容一个文件夹，正文文件名为 `index.md` 或 `index.mdx`，配图与正文同目录：

```
src/content/blog/<slug>/index.md
src/content/blog/<slug>/01-xxx.png
src/content/blog/works/<slug>/index.mdx
```

`<slug>` 即 URL 段（`/blog/<slug>/`），**只用小写英文与连字符**。中文目录名会让 URL 变成百分号编码，改名前先确认没有外链。

## 博客 frontmatter

```yaml
---
title: "标题"
description: "一句话摘要，会进列表卡与 meta description"
category: graphics        # frontend | graphics | tools | essay
tags: ['次表面散射（SSS）', 'UE']
date: 2026-05-28          # 用于排序
readTime: 15              # 分钟
heroImage: "./01-cover.png"
published: true           # false 为草稿，不显示
seriesSlug: xxx           # 谨慎：填了会从博客总列表里消失，见"合集"
---
```

## 作品 frontmatter

```yaml
---
title: "标题"
description: "简介"
category: frontend        # frontend | 3d | design-tools | other
tags: ['Three.js']
heroImage: "./cover.png"
date: 2026-05-28
featured: false
order: 0                  # 越大越靠前
---
```

排序：作品先按 `order` 降序、再按 `date` 降序；博客按 `date` 降序。

## 图片：两条路径别搞混

| 写法 | 走向 | 适合 |
|---|---|---|
| `![](./01-shot.png)` | Astro 图片管线，构建时转 WebP、加哈希名 | 常规配图（推荐） |
| `![](/blog/<slug>/anim.gif)` | `public` 原样直出 | 需要保留动画的 GIF、需要固定 URL 的文件 |

`prebuild` 脚本（`scripts/copy-content-images.mjs`）会把 `src/content/blog/<slug>/*.png|jpg|gif` 复制到 `public/blog/<slug>/`，按仓库约定这些副本**也入库**。所以同一个文件会出现两份，这是既有的、故意的冗余。

GIF 若写成 `./anim.gif`，会被转成静态 WebP 丢动画 —— 这就是上表第二行的存在理由。

## 合集（blogSeries）

成员靠 `items`（slug 数组）关联，不是靠文章里的字段：

```yaml
---
title: "重启RestArt ProjectSH"
description: "一句话说明这个合集在讲什么"
coverImage: "/blog/series/<slug>/cover.webp"
items: ['slug-a', 'slug-b']
tags: ['实时渲染', 'UE']
order: 3
---
```

关键坑：文章 frontmatter 里**不要**填 `seriesSlug`。模板的 `getStandalonePosts()` 会把带该字段的文章从博客总列表剔除 —— 想要"既在博客列表、又在合集里"，就不填。

合集头图 `coverImage` 走 public 直达路径（不经图片管线），入库前自己转 WebP 控体积。

## 日期显示

frontmatter 的 `2026-05-28` 会被解析成 UTC 零点，直接格式化会显示成 `2026-05-28 08:00`。列表与文章页统一用 `formatDateShort`（只到日）。

## 发布

推 `master` 即触发 GitHub Actions 构建并部署 Pages，约 1 分钟。推送前跑完整性闸门（见 `AGENTS.md`）。

## 日期口径（导入内容必须遵守）

`date` 只有一个合法来源：**内容的首次发布时间**，不是抓取日、不是最后编辑时间。

### 常见错误

- ❌ **用抓取当天**：知乎导入脚本没取到日期时图省事写当天，结果整批文章挤在同一天（本仓库真踩过：ProjectSH 七篇全被写成 `2026-05-28`）。
- ❌ **用「编辑于」**：知乎文章页那行 `编辑于 2026-06-04` 是 `dateModified`（最后编辑），作者批量改一次就会被全部刷成同一天。界面上看到的往往就是它。

### 正确取法（知乎）

| 来源 | 字段 | 含义 |
|---|---|---|
| 文章页 | `<meta itemprop="datePublished">` | ✅ 首次发布（首选） |
| 文章页 | `<meta itemprop="dateModified">` | 最后编辑（不要用） |
| 专栏列表 API | `items[].created` | ✅ 与 `datePublished` 一致 |
| 专栏列表 API | `items[].updated` | 最后编辑 |

取到的是 UTC ISO 时间，转成本地日期再写进 frontmatter：

```python
datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d')          # created 是秒级时间戳
new Date(pub).toLocaleDateString('sv-SE')                          # datePublished 是 ISO 串
```

### 硬性要求

1. 导入任何平台内容前，先确认该平台的「发布时间」字段在哪，**写成脚本的一部分**，不要事后补。
2. 取不到真实发布日就**停下来问负责人**，不许拿抓取日或编辑日顶替。
3. 合集（`blogSeries`）的 `date` 取成员里最早的一篇，保证合集在列表里的位置合理。
4. 站点只展示发布日；「最后更新」暂不展示，也不必入库。
5. 批量导入后必须抽查：打开几篇原文页，把 `datePublished` 与 frontmatter 逐一对上。

## 改完自检

```bash
npm run build        # 必须 exit 0
npm run preview      # 抽查新页面 200、图片可加载
```

移动端 390px 要确认 `document.documentElement.scrollWidth === clientWidth`（长 URL、宽表格、长代码行是最常见的撑破来源）。
