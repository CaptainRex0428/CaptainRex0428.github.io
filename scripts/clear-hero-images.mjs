/**
 * 将所有博客文章的 heroImage 置空
 */
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const blogDir = 'src/content/blog';
const files = glob.sync('**/index.mdx', { cwd: blogDir });

// 处理所有文件
files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 将 heroImage 置空
  const updatedContent = content.replace(
    /heroImage:\s*["'].*["']\n/,
    'heroImage: ""\n'
  );

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    console.log(`✅ 已清除头图: ${path.basename(path.dirname(filePath))}`);
  }
});

console.log('\n✅ 所有文章头图已置空！');
