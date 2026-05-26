# 如何添加新博客文章

## 快速开始

### 1. 创建新文章

在 `src/content/blog/` 下创建新文件夹和 MDX 文件：

```
src/content/blog/your-article-title/index.mdx
```

### 2. 写入元数据

在文件开头添加 frontmatter：

```mdx
---
title: "你的文章标题"
description: "文章简介（会显示在首页和列表页）"
category: frontend  # 可选：frontend, graphics, tools, essay
tags: ['标签1', '标签2']
date: 2026-05-26    # 重要：用于排序！
readTime: 8         # 阅读时间（分钟）
published: true     # false 表示草稿，不会显示
---

## 正文内容

你的 Markdown 内容...
```

### 3. 推送到 GitHub

```bash
git add src/content/blog/your-article-title/
git commit -m "Add new blog post: your article title"
git push origin master
```

### 4. 自动部署

推送后，GitHub Actions 会自动：
1. 触发构建（约 30 秒启动）
2. 执行 `npm run build`（约 1 分钟）
3. 部署到 GitHub Pages
4. 首页自动显示最新 3 篇文章

查看部署进度：https://github.com/CaptainRex0428/CaptainRex0428.github.io/actions

## 注意事项

### 文章排序规则

首页按 `date` 字段降序排列，最新的文章会排在最前面。

**重要**：
- 确保 `date` 字段格式正确（YYYY-MM-DD）
- 日期越新，文章排名越高

### 发布控制

设置 `published: false` 可以隐藏文章（草稿模式）：

```mdx
---
published: false  # 不会在首页或列表页显示
---
```

### 分类选项

- `frontend` - 前端技术
- `graphics` - 图形学
- `tools` - 工具分享
- `essay` - 随笔

## 如何添加新作品

流程与博客类似，但在 `src/content/works/` 下创建：

```mdx
---
title: "作品标题"
description: "作品简介"
category: frontend  # 可选：frontend, 3d, design-tools, other
tags: ['标签']
heroImage: /works/your-work/demo.png  # 可选
date: 2026-05-26
featured: false      # true 会在首页突出显示
order: 0             # 排序权重（越高越靠前）
---
```

作品排序规则：
1. 先按 `order` 降序
2. 再按 `date` 降序

## 常见问题

### Q: 推送后多久能看到更新？

A: 约 1-2 分钟。GitHub Actions 构建时间取决于：
- 文章数量
- 图片数量
- 网络速度

### Q: 如何预览本地效果？

A: 运行 `npm run dev` 或 `npm run build && npm run preview`

### Q: 图片应该放在哪里？

A: 放在 `public/blog/your-article/` 目录，然后在 MDX 中引用：

```mdx
![演示图](/blog/your-article/demo.png)
```

## 技术原理

详见博客文章：《构���个人博客：从静态到伪动态》

---

最后更新：2026-05-26