import { defineCollection, z } from 'astro:content';

const works = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['frontend', '3d', 'design-tools', 'other']),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    date: z.date().optional(),
    featured: z.boolean().default(false),
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
    items: z.array(z.string()),
    date: z.date().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const workSeries = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    coverImage: z.string(),
    items: z.array(z.string()),
    date: z.date().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = { works, blog, blogSeries, workSeries };
