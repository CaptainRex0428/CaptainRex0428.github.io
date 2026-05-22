# CaptainRex0428.github.io - Site Design & Progress

## Project Overview
Personal portfolio site with works showcase and technical blog.

## Tech Stack
- **Framework**: Astro 4.x (岛架构，支持静态+交互混合)
- **UI**: 原生 CSS + CSS 变量（无框架依赖）
- **Components**: Astro Components + 少量 client:load 交互
- **Content**: MDX (Markdown + JSX)
- **i18n**: astro-i18n + URL 前缀方案 (/en/...)
- **3D/Future**: Three.js (按需引入)

## Design System

### Color Palette
```
--bg-base:     #0a0a0f   /* 背景 */
--bg-elevated: #13131a   /* 卡片/浮层 */
--bg-border:   #1f1f2a   /* 边框/分割线 */
--accent:      #ff8c00   /* 主强调色-橙 */
--accent-glow: #ff8c0033 /* 橙色光晕 (hover用) */
--accent-bright: #ffb347 /* 亮橙-文字高亮 */
--text-primary: #e8e8e8  /* 主要文字 */
--text-secondary: #8a8a8a /* 次要文字 */
--text-muted: #4a4a4a     /* 弱化文字 */
```

### Typography
- **标题**: Noto Sans SC (中文) / Inter (英文), weight 600-700
- **正文**: Noto Sans SC / Inter, weight 400
- **代码**: JetBrains Mono, Fira Code

### Design Language - "暗夜流光"
- 玻璃态卡片 (glassmorphism)：backdrop-filter blur + 微透明
- 微妙渐变：大面积深色 + 小范围橙到透明渐变
- 精致动效：微妙的 scale/translate + 光晕过渡
- 微光效果：hover 时橙色 glow 扩散
- 圆角：12px-16px

### Layout Rhythm
- 最大宽度：1200px
- 间距基准：8px grid
- 卡片内边距：24px-32px
- 区块间距：80px-120px

## Content Structure

### 作品分类 (Works Categories)
1. `frontend` - 前端项目
2. `3d` - 3D/图形学作品
3. `design-tools` - 设计工具
4. `other` - 其他

### 文章分类 (Blog Categories)
1. `frontend` - 前端技术
2. `graphics` - 图形学
3. `tools` - 工具分享
4. `essay` - 随笔

## File Structure
```
/
├── .claude/
│   ├── CLAUDE.md         # 本文件 - 设计总览与进度
│   ├── memories/
│   │   ├── architecture.md  # 架构决策记录
│   │   └── design-details.md # 设计细节规范
│   └── skills/
│       └── astro-guide.md    # Astro 使用规范
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Card.astro
│   │   ├── Badge.astro
│   │   └── MediaViewer.astro
│   ├── layouts/
│   │   ├── Base.astro
│   │   └── Post.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── works/
│   │   │   ├── index.astro
│   │   │   └── [category]/
│   │   └── blog/
│   │       ├── index.astro
│   │       └── [category]/
│   ├── i18n/
│   │   ├── en.json
│   │   └── zh.json
│   └── styles/
│       └── global.css
├── public/
│   ├── works/
│   ├── blog/
│   └── images/
└── astro.config.mjs
```

## Progress

### Phase 1: Foundation (Current)
- [x] 确定技术栈 (Astro)
- [x] 确定设计系统 (暗夜流光)
- [x] 确定配色方案
- [x] 设计文件结构
- [x] 初始化 Astro 项目
- [x] 搭建全局样式系统
- [x] 实现基础布局组件
- [x] 实现国际化基础

### Phase 2: Core Pages
- [x] 首页设计
- [x] 关于页
- [x] 作品列表页
- [x] 文章列表页
- [ ] 详情页模板

### Phase 3: Advanced Features
- [ ] 媒体查看器组件 (图片/GIF/视频)
- [ ] 3D 渲染示例集成
- [ ] 动效优化
- [ ] 响应式优化

## Design Decisions Log
See memories/ for detailed decision records.

---
Last Updated: 2026-05-22