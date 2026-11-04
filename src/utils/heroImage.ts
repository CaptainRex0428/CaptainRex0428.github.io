import type { CollectionEntry } from 'astro:content';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * 获取文章/作品的头图路径
 * @param entry - 文章或作品条目
 * @returns 头图路径（相对于 public 目录），如果没有则返回 undefined
 */
export function getHeroImage(
  entry: CollectionEntry<'blog' | 'works'>
): string | undefined {
  const slug =
    entry.slug || entry.id.replace(/\.(md|mdx)$/, '').replace(/\/index$/, '');

  // frontmatter 指定了 heroImage（且不为空）
  if (entry.data.heroImage && entry.data.heroImage.trim() !== '') {
    const raw = entry.data.heroImage.trim();
    // 绝对路径直接用；相对路径按「文章目录」解析到 public 副本
    if (raw.startsWith('/')) return raw;
    const name = raw.replace(/^\.\//, '');
    const publicPath = join('public', entry.collection, slug, name);
    return existsSync(publicPath) ? `/${entry.collection}/${slug}/${name}` : undefined;
  }

  // @ts-ignore - 兼容使用 cover 字段的作品
  if (entry.data.cover && entry.data.cover.trim() !== '') {
    // @ts-ignore
    const raw = entry.data.cover.trim();
    if (raw.startsWith('/')) return raw;
    const name = raw.replace(/^\.\//, '');
    const publicPath = join('public', entry.collection, slug, name);
    return existsSync(publicPath) ? `/${entry.collection}/${slug}/${name}` : undefined;
  }

  // 检查文件夹中是否有 hero.png
  const heroPath = join('public', entry.collection, slug, 'hero.png');
  
  if (existsSync(heroPath)) {
    return `/${entry.collection}/${slug}/hero.png`;
  }

  return undefined;
}
