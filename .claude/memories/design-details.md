# Design Details - "暗夜流光"

## Concept
暗黑简约高级风格 —— 深夜中的橙色光芒，在沉稳的深灰色调中，一抹橙色高亮如流光般点缀。

## Color Application Rules

### Base Colors
```css
--bg-base: #0a0a0f     /* 深邃黑紫 - 主背景 */
--bg-elevated: #13131a /* 卡片/浮层背景 */
--bg-border: #1f1f2a   /* 边框/分割线 */
```
- 用于页面背景、卡片背景、分隔线
- 层级通过透明度差异区分

### Accent Colors
```css
--accent: #ff8c00      /* 琥珀橙 - 主强调色 */
--accent-glow: rgba(255, 140, 0, 0.2) /* 橙色光晕 */
--accent-bright: #ffb347 /* 亮橙 - 文字高亮 */
```
- 橙色用于：hover 状态、重要按钮、链接高亮、分类标签
- 光晕效果：box-shadow 或 filter 实现

### Text Colors
```css
--text-primary: #e8e8e8  /* 主要文字 - 柔和白 */
--text-secondary: #8a8a8a /* 次要文字 - 中灰 */
--text-muted: #4a4a4a     /* 弱化文字 - 深灰 */
```
- 层级通过灰度区分

## Typography Scale
```
h1: 2.5rem (40px), weight 700, line-height 1.2
h2: 1.75rem (28px), weight 600, line-height 1.3
h3: 1.25rem (20px), weight 600
body: 1rem (16px), weight 400, line-height 1.7
small: 0.875rem (14px)
code: JetBrains Mono / Fira Code, 0.9em
```

## Component Specifications

### Glass Card
```css
.card {
  background: rgba(19, 19, 26, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(31, 31, 42, 0.8);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.card:hover {
  border-color: rgba(255, 140, 0, 0.3);
  box-shadow: 0 0 30px rgba(255, 140, 0, 0.1);
  transform: translateY(-2px);
}
```

### Accent Button
```css
.btn-accent {
  background: linear-gradient(135deg, #ff8c00, #ff6b00);
  color: #0a0a0f;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}
.btn-accent:hover {
  box-shadow: 0 0 20px rgba(255, 140, 0, 0.4);
  transform: translateY(-1px);
}
```

### Text Link
```css
.link {
  color: #ff8c00;
  text-decoration: none;
  transition: all 0.2s ease;
}
.link:hover {
  color: #ffb347;
  text-shadow: 0 0 10px rgba(255, 140, 0, 0.3);
}
```

### Badge/Tag
```css
.badge {
  background: rgba(255, 140, 0, 0.1);
  border: 1px solid rgba(255, 140, 0, 0.3);
  color: #ffb347;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 500;
}
```

## Animation Principles
- Duration: 0.2s - 0.4s (微妙的过渡感)
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (柔和缓出)
- Hover transforms: scale(1.02) / translateY(-2px) / opacity 变化
- Glow effects: box-shadow 渐变扩散
- Page transitions: fade-in + subtle slide-up (可选)

## Layout Specifications
- Container max-width: 1200px
- Grid: 12-column, gap 24px
- Spacing scale: 4px base (8/16/24/32/48/64/80/120)
- Section padding: 80px vertical (desktop), 48px (mobile)
- Card padding: 24px-32px

## Responsive Breakpoints
```css
--mobile: 480px
--tablet: 768px
--desktop: 1024px
--wide: 1280px
```

## Icon Strategy
- 使用 SVG inline icons 或 Lucide Icons
- 尺寸: 20px (inline) / 24px (buttons) / 32px+ (features)
- 颜色跟随当前文字颜色 (currentColor)

## Image Treatment
- 圆角: 12px
- Loading: skeleton shimmer 或 blur-up
- Hover: subtle scale(1.02) + brightness(1.05)