export function getContentSlug(entry: { id: string; slug?: string }): string {
  const slug = entry.slug;

  if (slug) {
    return slug;
  }

  let id = entry.id.replace(/\.(md|mdx)$/, '');
  if (id.endsWith('/index')) {
    id = id.slice(0, -'/index'.length);
  }

  return id;
}
