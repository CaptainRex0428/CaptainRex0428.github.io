import { defineCollection, z } from 'astro:content';

const works = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['frontend', '3d', 'design-tools', 'other']),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    date: z.date().optional(),
    order: z.number().default(0),
    seriesSlug: z.string().optional(),
  }),
});

const blog = defineCollection({
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

const blogSeries = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    coverImage: z.string(),
    items: z.array(z.string()), // 引用的文章 slug 列表
    tags: z.array(z.string()).default([]), // 合集独立的标签
    date: z.date().optional(),
    order: z.number().default(0),
  }),
});

const workSeries = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    coverImage: z.string(),
    items: z.array(z.string()), // 引用的作品 slug 列表
    tags: z.array(z.string()).default([]), // 合集独立的标签
    date: z.date().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { works, blog, blogSeries, workSeries };
