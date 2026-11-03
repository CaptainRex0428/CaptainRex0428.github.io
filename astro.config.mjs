import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://captainrex0428.github.io',
  base: '/',
  integrations: [
    mdx(),
  ],
  // 行内 $...$ 与块级 $$...$$ 用 KaTeX 渲染（devlog 里有 GGX 分布这类公式）
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  output: 'static',
});
