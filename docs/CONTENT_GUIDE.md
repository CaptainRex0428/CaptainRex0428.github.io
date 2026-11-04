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

## 改完自检

```bash
npm run build        # 必须 exit 0
npm run preview      # 抽查新页面 200、图片可加载
```

移动端 390px 要确认 `document.documentElement.scrollWidth === clientWidth`（长 URL、宽表格、长代码行是最常见的撑破来源）。
