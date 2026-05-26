import type { CollectionEntry } from 'astro:content';

/**
 * Tag statistics for a single tag
 */
export interface TagStat {
  name: string;
  count: number;
  slugs: string[];
}

/**
 * Get tag statistics from all posts and works
 */
export function getTagStatistics(posts: CollectionEntry<'blog'>[], works: CollectionEntry<'works'>[]) {
  const stats = new Map<string, TagStat>();

  posts.forEach(post => {
    post.data.tags?.forEach(tag => {
      if (!stats.has(tag)) stats.set(tag, { name: tag, count: 0, slugs: [] });
      const s = stats.get(tag)!;
      s.count++;
      s.slugs.push(post.slug);
    });
  });

  works.forEach(work => {
    work.data.tags?.forEach(tag => {
      if (!stats.has(tag)) stats.set(tag, { name: tag, count: 0, slugs: [] });
      const s = stats.get(tag)!;
      s.count++;
      s.slugs.push(work.slug);
    });
  });

  return Array.from(stats.values()).sort((a, b) => b.count - a.count);
}

/**
 * Aggregate tags from series member posts
 */
export function aggregateSeriesTags(slugs: string[], allPosts: CollectionEntry<'blog'>[]) {
  const tagCount = new Map<string, number>();
  slugs.forEach(slug => {
    const post = allPosts.find(p => p.slug === slug);
    post?.data.tags?.forEach(tag => {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    });
  });
  return Array.from(tagCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);
}

/**
 * Filter out series members from posts/works
 */
export function getStandalonePosts(allPosts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
  const seriesMemberSlugs = new Set<string>();

  allPosts.forEach(post => {
    if (post.data.seriesSlug) {
      seriesMemberSlugs.add(post.slug);
    }
  });

  return allPosts.filter(p => !seriesMemberSlugs.has(p.slug));
}

export function getStandaloneWorks(allWorks: CollectionEntry<'works'>[]): CollectionEntry<'works'>[] {
  const seriesMemberSlugs = new Set<string>();

  allWorks.forEach(work => {
    if (work.data.seriesSlug) {
      seriesMemberSlugs.add(work.slug);
    }
  });

  return allWorks.filter(w => !seriesMemberSlugs.has(w.slug));
}

/**
 * Get series posts in order
 */
export function getSeriesPosts(seriesItems: string[], allPosts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
  return seriesItems
    .map(slug => allPosts.find(p => p.slug === slug))
    .filter((p): p is CollectionEntry<'blog'> => p !== undefined);
}

/**
 * Get series works in order
 */
export function getSeriesWorks(seriesItems: string[], allWorks: CollectionEntry<'works'>[]): CollectionEntry<'works'>[] {
  return seriesItems
    .map(slug => allWorks.find(w => w.slug === slug))
    .filter((w): w is CollectionEntry<'works'> => w !== undefined);
}