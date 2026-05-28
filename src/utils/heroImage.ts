import type { CollectionEntry } from 'astro:content';

/**
 * 获取文章/作品的头图路径
 * @param entry - 文章或作品条目
 * @returns 头图路径（相对于 public 目录），如果没有则返回 undefined
 */
export function getHeroImage(
  entry: CollectionEntry<'blog' | 'works'>
): string | undefined {
  // frontmatter 指定了 heroImage（且不为空）
  if (entry.data.heroImage && entry.data.heroImage.trim() !== '') {
    const path = entry.data.heroImage.startsWith('/') ? entry.data.heroImage : `/${entry.data.heroImage}`;
    return path;
  }

  // @ts-ignore - 兼容使用 cover 字段的作品
  if (entry.data.cover && entry.data.cover.trim() !== '') {
    // @ts-ignore
    const path = entry.data.cover.startsWith('/') ? entry.data.cover : `/${entry.data.cover}`;
    return path;
  }

  // 使用 slug 或从 id 生成 slug
  const slug = entry.slug || entry.id.replace(/\.(md|mdx)$/, '').replace(/\/index$/, '');
  return `/${entry.collection}/${slug}/hero.png`;
}
