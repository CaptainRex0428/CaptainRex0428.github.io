/**
 * 为所有博客文章添加 published: true 属性
 */
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const blogDir = 'src/content/blog';
const files = glob.sync('**/index.mdx', { cwd: blogDir });

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 检查是否已有 published 属性
  if (content.includes('published:')) {
    console.log(`跳过已有 published 属性的文件: ${file}`);
    return;
  }

  // 在 frontmatter 中添加 published: true
  // 查找 heroImage 行并在其后添加
  const heroImageMatch = content.match(/(heroImage:\s*)(.*)/);
  if (heroImageMatch) {
    const heroImageLine = heroImageMatch[0];
    const newLine = `published: true`;
    content = content.replace(heroImageLine, `${heroImageLine}\n${newLine}`);

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ 已添加 published 属性: ${file}`);
  } else {
    console.log(`❌ 未找到 heroImage 行: ${file}`);
  }
});

console.log('\n处理完成！');
