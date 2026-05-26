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
  // frontmatter 指定了 heroImage 或 cover
  if (entry.data.heroImage) {
    const path = entry.data.heroImage.startsWith('/') ? entry.data.heroImage : `/${entry.data.heroImage}`;
    // 检查文件是否存在，不存在则返回默认头图
    if (existsSync(join('public', path))) {
      return path;
    }
  }
  // @ts-ignore - 兼容使用 cover 字段的作品
  if (entry.data.cover) {
    // @ts-ignore
    const path = entry.data.cover.startsWith('/') ? entry.data.cover : `/${entry.data.cover}`;
    // 检查文件是否存在，不存在则返回默认头图
    if (existsSync(join('public', path))) {
      return path;
    }
  }
  // 检查文件夹中是否有 hero.png
  const heroPath = join('public', entry.collection, entry.slug, 'hero.png');
  if (existsSync(heroPath)) {
    return `/${entry.collection}/${entry.slug}/hero.png`;
  }
  return undefined;
}