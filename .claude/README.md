# CaptainRex0428.github.io 工程说明

## 项目概述

基于 GitHub Pages 托管的 Astro 静态个人主页，展示作品集与技术博客。

**线上地址**: https://captainrex0428.github.io

---

## 技术栈

| 类型 | 技术 |
|------|------|
| 框架 | Astro 4.16.19（岛架构） |
| 渲染模式 | 静态站点生成（`output: 'static'`） |
| 样式 | 原生 CSS + CSS 变量（无 UI 框架） |
| 交互组件 | React 3.6.0（按需 `client:load`） |
| 内容格式 | MDX 3.1.0 |
| 国际化 | URL 前缀方案（`/en/` 无前缀 `zh`） |
| 部署 | GitHub Actions → GitHub Pages（master 分支） |

---

## 目录结构

```
src/
├── components/        # Astro 组件（Header, Footer, Card, Badge, MediaViewer）
├── content/           # Content Collections（MDX 内容）
│   ├── works/         # 作品（已有 particle-system.mdx）
│   └── blog/          # 博客文章
├── i18n/              # 国际化
│   ├── index.ts       # useTranslations, getLocaleFromUrl, getLocalizedPath 等工具函数
│   ├── en.json        # 英文翻译
│   └── zh.json       # 中文翻译
├── layouts/           # 页面布局
│   ├── Base.astro     # 根布局（HTML shell + header + footer）
│   └── Post.astro     # 详情页布局（待实现）
├── pages/             # 基于文件的路由
│   ├── index.astro    # 首页（中文默认）
│   ├── about.astro    # 关于页
│   ├── en/
│   │   └── index.astro  # 首页英文版
│   ├── works/
│   │   ├── index.astro  # 作品列表
│   │   └── [category].astro  # 作品分类页（待实现）
│   └── blog/
│       ├── index.astro  # 博客列表
│       └── [category].astro  # 博客分类页（待实现）
└── styles/
    └── global.css     # 全局设计系统 CSS（变量、组件样式、动画）

public/
├── works/             # 作品相关静态资源
├── blog/              # 博客相关静态资源
├── images/             # 通用图片
└── favicon.svg        # 站点图标

.github/workflows/deploy.yml  # CI/CD 自动部署
```

---

## 已实现页面

| 路由 | 说明 | 状态 |
|------|------|------|
| `/` | 首页（中文） | ✅ |
| `/en/` | 首页（英文） | ✅ |
| `/about` | 关于页 | ✅ |
| `/works` | 作品列表（含分类筛选 tab） | ✅ |
| `/blog` | 博客列表（含分类筛选 tab） | ✅ |
| `/works/[category]` | 作品分类页 | ❌ 待实现 |
| `/blog/[category]` | 博客分类页 | ❌ 待实现 |
| `/en/about` | 关于页英文版 | ❌ |
| `/en/works` | 作品列表英文版 | ❌ |
| `/en/blog` | 博客列表英文版 | ❌ |

---

## 已实现组件

| 组件 | 说明 | 路径 |
|------|------|------|
| `Header` | 粘性导航栏，含语言切换按钮 | `src/components/Header.astro` |
| `Footer` | 页脚，含社交链接 | `src/components/Footer.astro` |
| `Card` | 可复用卡片，支持链接/纯展示变体 | `src/components/Card.astro` |
| `Badge` | 分类标签组件 | ❌ 待实现 |
| `MediaViewer` | 图片/GIF/视频查看器 | ❌ 待实现 |

---

## 设计系统："暗夜流光"

详见 `.claude/memories/design-details.md`，核心变量如下：

```css
--bg-base: #0a0a0f       /* 主背景 */
--bg-elevated: #13131a   /* 卡片背景 */
--bg-border: #1f1f2a    /* 边框 */
--accent: #ff8c00        /* 橙色强调 */
--accent-glow: #ff8c0033 /* hover 光晕 */
--accent-bright: #ffb347 /* 高亮文字 */
--text-primary: #e8e8e8  /* 主文字 */
--text-secondary: #8a8a8a /* 次要文字 */
--text-muted: #4a4a4a    /* 弱化文字 */
```

**字号**: h1 2.5rem (700) / h2 1.75rem (600) / h3 1.25rem (600) / body 1rem (400) / code JetBrains Mono

**动效**: 0.2–0.4s, cubic-bezier(0.4, 0, 0.2, 1)，hover 时 translateY(-2px) + 橙色 glow

**断点**: mobile 480px / tablet 768px / desktop 1024px / wide 1280px

---

## 内容分类

### 作品分类 (works)
- `frontend` — 前端项目
- `3d` — 3D/图形学作品
- `design-tools` — 设计工具
- `other` — 其他

### 文章分类 (blog)
- `frontend` — 前端技术
- `graphics` — 图形学
- `tools` — 工具分享
- `essay` — 随笔

---

## 内容规范（Frontmatter）

### 作品
```mdx
---
title: "项目名称"
description: "简短描述"
category: "frontend"   # frontend | 3d | design-tools | other
date: 2026-05-22
cover: "./cover.png"   # 封面图路径
tags: ["React", "Three.js"]
featured: true          # 是否在首页展示
---
```

### 博客
```mdx
---
title: "文章标题"
description: "简短描述"
category: "frontend"    # frontend | graphics | tools | essay
date: 2026-05-22
tags: ["WebGL", "Performance"]
---
```

---

## 常用命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览构建结果
```

---

## 部署流程

推送 `master` 分支后，GitHub Actions 自动运行 `deploy.yml` 构建并部署到 GitHub Pages，无需手动操作。

---

## 待开发功能（按优先级）

1. **[高]** Post.astro 详情页布局 + 内容集合配置 + Badge 组件
2. **[高]** 动态分类页 `/works/[category]` + `/blog/[category]`
3. **[中]** 英文版 about/works/blog 页面
4. **[中]** Header 移动端 hamburger 菜单
5. **[低]** MediaViewer 组件（图片/GIF/视频）
6. **[低]** 社交分享按钮
7. **[低]** Three.js / 3D 示例集成

---

## 协作者说明

本工程由 AI 辅助开发。开发规范、架构决策、设计细节分别记录在：
- `.claude/memories/development-workflow.md` — 开发协作规范
- `.claude/memories/architecture.md` — 架构决策
- `.claude/memories/design-details.md` — 设计规范
- `.claude/skills/astro-guide.md` — Astro 常用模式

如需继续开发，直接告知优先做哪个功能模块即可，无需重复说明项目背景。