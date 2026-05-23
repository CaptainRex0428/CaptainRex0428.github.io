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
  }),
});

export const collections = { works, blog };
