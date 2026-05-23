---
name: social-icons
description: 各平台 SVG icon 配置，供 Footer / 首页联系区使用
type: reference
---

# 社交平台 SVG Icon 配置

## 格式说明

所有 icon 放在 `src/i18n/icons.json`，每个平台一个 key，value 为完整的 SVG 字符串。

在 Astro 组件中使用：

```astro
---
import icons from '@/i18n/icons.json';
---
<a href="..." set:html={icons.zhihu} />
```

## 图标规范

- viewBox: `0 0 24 24`
- 尺寸: 宽高 18px（或通过 CSS 控制）
- 颜色: `currentColor`（跟随文字颜色）

## 图标列表

| key | 平台 | 说明 |
|-----|------|------|
| `zhihu` | 知乎 | |
| `xiaohongshu` | 小红书 | |
| `bilibili` | B站 | |
| `github` | GitHub | |
| `email` | 邮箱 | |
| `twitter` | Twitter/X | |
| `wechat` | 微信 | |

## 获取图标

推荐去 [Lucide Icons](https://lucide.dev/) 或 [Simple Icons](https://simpleicons.org/) 搜索下载。
也可以直接复制各平台的官方 logo SVG。

---

## 当前图标（待更新）

用户提供各平台 SVG 后，在 `src/i18n/icons.json` 中更新。