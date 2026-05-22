# Architecture Decisions

## Why Astro over Next.js/Vite+React
Created: 2026-05-22

### Decision: Use Astro 4.x

**Context:**
- User needs a portfolio site with works showcase + blog
- Future may include 3D/WebGL real-time rendering
- Needs internationalization (zh/en)
- Dark theme, high-end aesthetic
- User trusts developer judgment

**Options Considered:**

1. **Astro** ✓
   - Island architecture: static + interactive coexist
   - Best performance for content-heavy sites
   - Native MDX support
   - Easy to add React/Vue/Svelte for 3D components
   - Built-in i18n support
   - Zero JS by default

2. **Next.js**
   - Overkill for mostly static content
   - More complex config
   - Heavier bundle

3. **Vite + React**
   - Good but more boilerplate
   - SSR not included by default

4. **Vanilla HTML/CSS/JS**
   - Too manual for blog/works management
   - Hard to scale

**Chosen: Astro 4.x**

Rationale:
- Optimal for content-heavy portfolio + blog
- Easy 3D integration via React/Preact islands
- Excellent DX with MDX
- Lightweight compared to Next.js
- User can host on GitHub Pages

**Risks & Mitigations:**
- Risk: Learning curve for user
- Mitigation: Document key patterns in skills/astro-guide.md

## i18n Strategy
- URL prefix approach: `/en/works`, `/zh/works`
- JSON translation files in `src/i18n/`
- Language switch in header

## Media Strategy
- Images/GIFs: Optimized via Astro's image optimization
- Videos: External embed or public folder
- Future 3D: React Three Fiber component with client:load

## File Organization
- Works: `/public/works/[category]/` with metadata in frontmatter
- Blog: MDX in content collections
- Single source of truth in `src/`