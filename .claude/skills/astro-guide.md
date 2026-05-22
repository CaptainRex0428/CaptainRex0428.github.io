# Astro Usage Guide

Quick reference for working with this project.

## Project Setup
```bash
npm create astro@latest
# Select: Empty project, TypeScript, Install dependencies
cd project
npx astro add react mdx    # Add integrations
```

## Key Commands
```bash
npm run dev      # Start dev server
npm run build   # Build for production
npm run preview # Preview production build
```

## File Structure Quick Reference
```
src/
├── components/   # .astro components
├── layouts/      # Page layouts
├── pages/        # File-based routing
│   └── [lang]/  # i18n routes (en/, zh/)
├── content/     # Content collections (MDX)
│   ├── works/
│   └── blog/
├── i18n/        # Translation JSON
└── styles/      # CSS files
```

## Creating Content

### Works Entry (Frontmatter)
```mdx
---
title: "Project Name"
description: "Brief description"
category: "frontend"  # frontend | 3d | design-tools | other
date: 2026-01-01
cover: "./cover.png"
tags: ["React", "Three.js"]
featured: true
---
```

### Blog Post
```mdx
---
title: "Post Title"
description: "Brief description"
category: "frontend"
date: 2026-01-01
tags: ["WebGL", "Performance"]
---
```

## Component Patterns

### Client Directive (Interactive Islands)
```astro
<!-- Static by default, hydrate on load -->
<ThreeCanvas client:load />

<!-- Only hydrate when visible -->
<LazyComponent client:visible />
```

### Content Collection Query
```ts
import { getCollection } from 'astro:content';

// Get all works
const works = await getCollection('works');
// Filter by category
const frontendWorks = works.filter(w => w.data.category === 'frontend');
```

## i18n Pattern
```astro
---
import { useTranslations } from './i18n';
const t = useTranslations(Astro.currentLocale);
---
<h1>{t('nav.works')}</h1>
```

## Adding Three.js/3D Content
```bash
npm install three @types/three @react-three/fiber
```

```astro
<!-- Canvas.astro -->
<Canvas client:load camera={{ position: [0, 0, 5] }}>
  <Scene />
</Canvas>
```

## Image Optimization
```astro
---
import { Image } from 'astro:assets';
import cover from './cover.png';
---
<Image src={cover} alt="Cover" width={800} />
```

## Deploy to GitHub Pages
```bash
# astro.config.mjs
export default defineConfig({
  site: 'https://captainrex0428.github.io',
  base: '/',
  output: 'static'
});
```

```bash
npm run build
# Push to main branch, GitHub Actions deploys
```

## Common Patterns

### Card Link Wrapper
```astro
<a href={href} class="card-link">
  <article class="card">
    <slot />
  </article>
</a>
```

### Category Filter
```astro
<div class="filters">
  {categories.map(cat => (
    <a href={`/works/${cat}`} class:list={['filter', { active: current === cat }]}>
      {cat}
    </a>
  ))}
</div>
```

### Language Switcher
```astro
<a href={switchLangUrl(Astro.url.pathname)}>
  {Astro.currentLocale === 'en' ? '中文' : 'English'}
</a>
```