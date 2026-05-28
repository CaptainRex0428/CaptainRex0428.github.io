import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Works collection - 3D/WebGL 前端作品
const works = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['frontend', '3d', 'design-tools', 'other']),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    cover: z.string().optional(),
    date: z.date().optional(),
    order: z.number().default(0),
    seriesSlug: z.string().optional(),
  }),
});

// Blog collection - 技术博客
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['frontend', 'graphics', 'tools', 'essay']),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    date: z.date(),
    readTime: z.number().optional(),
    published: z.boolean().default(true),
    seriesSlug: z.string().optional(),
  }),
});

// Blog Series - 博客合集
const blogSeries = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blogSeries' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    coverImage: z.string().optional(),
    items: z.array(z.string()), // 引用的文章 slug 列表
    tags: z.array(z.string()).default([]), // 合集独立的标签
    date: z.date().optional(),
    order: z.number().default(0),
  }),
});

// Work Series - 作品合集
const workSeries = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/workSeries' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    coverImage: z.string().optional(),
    items: z.array(z.string()), // 引用的作品 slug 列表
    tags: z.array(z.string()).default([]), // 合集独立的标签
    date: z.date().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { works, blog, blogSeries, workSeries };