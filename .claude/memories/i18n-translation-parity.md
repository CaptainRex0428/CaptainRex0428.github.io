---
name: i18n-translation-parity
description: i18n 中英切换必排错误：en.json 缺少字段导致 t.property undefined
type: reference
---

# i18n 翻译字段一致性规范

## 常见陷阱

i18n 切换时最容易踩的坑：**zh.json 写了新字段，en.json 忘了加对应翻译**。

构建时只要任何页面 render 过程中引用到 `t.xxx.yyy`，且 en locale 下该路径为 `undefined`，就会直接 **build 失败**，报错：

```
Cannot read properties of undefined (reading 'xxx')
```

这在 CI/CD 中会导致 GitHub Pages 无法部署。

## 根因

`zh.json` 新增 `contact: { title, phone, ... }` 后，`Footer.astro` 调用 `t.contact.title`，而 `en.json` 没有这个字段 → 构建崩溃。

## 预防措施

1. **新增翻译字段时，同时修改 zh.json 和 en.json**，不要遗漏
2. **在 `index.ts` 中添加运行时校验**（可选）：
   ```ts
   export function useTranslations(locale: Locale): Translations {
     // 或在 build 时输出 warning
   }
   ```
3. **本地 `npm run build` 通过后再 push**，能提前发现

## 相关文件

- `src/i18n/zh.json`
- `src/i18n/en.json`
- `src/i18n/index.ts` — 翻译工具函数
- `src/layouts/Base.astro` — 通用布局，引用 i18n
- `src/components/Footer.astro` — 高频引用 `t.contact.*`