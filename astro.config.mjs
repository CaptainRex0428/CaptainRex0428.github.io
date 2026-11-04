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
  // 旧文章地址（中文 slug / 合并前的重复篇）永久重定向到新地址
  redirects: {
    '/blog/重启restart-projectshnoise-curlnoise': '/blog/restart-projectsh-curl-noise',
    '/blog/重启restart-projectshue发丝渲染': '/blog/restart-projectsh-ue-hair-strands',
    '/blog/重启restart-projectshui-流沙模拟物理守恒': '/blog/restart-projectsh-sand-flow',
    '/blog/重启restart-projectsh丝绸布料渲染forwardshading': '/blog/restart-projectsh-silk-forward-shading',
    '/blog/重启restart-projectsh基于预积分的次表面渲染preintegrated-sss': '/blog/restart-projectsh-preintegrated-sss',
    '/blog/重启restart-projectsh基于预积分的次表面渲染profile优化': '/blog/restart-projectsh-preintegrated-sss-profile',
    '/blog/重启restart-projectsh头发各向异性仿终末地': '/blog/restart-projectsh-anisotropic-hair',
    '/blog/preintegrated-sss': '/blog/restart-projectsh-preintegrated-sss',
  },
});
