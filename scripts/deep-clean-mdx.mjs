/**
 * 更深度的 MDX 文件清理脚本
 */
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const blogDir = 'src/content/blog';
const files = glob.sync('**/index.mdx', { cwd: blogDir });

/**
 * 深度清理 HTML 标签和格式问题
 */
function deepCleanHtml(html) {
  let content = html;

  // 1. 移除所有知乎特有的复杂HTML结构
  // 移除 figure 标签及其内容（只保留图片）
  content = content.replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, (match) => {
    const imgMatch = match.match(/!\[([^\]]*)\]\((https:\/\/[^)]+)\)/);
    if (imgMatch) {
      return `![${imgMatch[1] || '图片'}](${imgMatch[2]})\n\n`;
    }
    const srcMatch = match.match(/src=["'](https:\/\/[^"']+)["']/);
    if (srcMatch) {
      return `![图片](${srcMatch[1]})\n\n`;
    }
    return '';
  });

  // 2. 移除所有 span 标签但保留内容
  content = content.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1');

  // 3. 移除所有 div 标签
  content = content.replace(/<div[^>]*>/gi, '');
  content = content.replace(/<\/div>/gi, '\n');

  // 4. 移除 SVG 标签
  content = content.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '');

  // 5. 移除视频标签
  content = content.replace(/<video[^>]*>[\s\S]*?<\/video>/gi, '');

  // 6. 移除 script 和 style 标签
  content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // 7. 处理段落标签 - 完全移除，保留内容
  content = content.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');

  // 8. 处理代码块 - 移除高亮相关的 div
  content = content.replace(/<div class="highlight">``([\s\S]*?)``<\/div>/gi, '```\n$1\n```');
  content = content.replace(/<div class="highlight">```\n([\s\S]*?)\n```<\/div>/gi, '```\n$1\n```');

  // 9. 处理代码中的 span 语法高亮标签
  content = content.replace(/<span class="[a-z0-9\s\-_]+">/gi, '');
  content = content.replace(/<\/span>/gi, '');

  // 10. 处理标题
  content = content.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  content = content.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  content = content.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  content = content.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');

  // 11. 处理文本格式
  content = content.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  content = content.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  content = content.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  content = content.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

  // 12. 处理链接
  content = content.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // 13. 处理图片
  content = content.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)');

  // 14. 处理代码块
  content = content.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n');
  content = content.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

  // 15. 处理列表
  content = content.replace(/<ul[^>]*>/gi, '');
  content = content.replace(/<\/ul>/gi, '\n');
  content = content.replace(/<ol[^>]*>/gi, '');
  content = content.replace(/<\/ol>/gi, '\n');
  content = content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');

  // 16. 处理引用
  content = content.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n\n');

  // 17. 处理分割线
  content = content.replace(/<hr[^>]*>/gi, '---\n\n');

  // 18. 清理 HTML 实体
  content = content.replace(/&amp;/g, '&');
  content = content.replace(/&lt;/g, '<');
  content = content.replace(/&gt;/g, '>');
  content = content.replace(/&quot;/g, '"');
  content = content.replace(/&#39;/g, "'");

  // 19. 清理 HTML 注释
  content = content.replace(/<!--[\s\S]*?-->/g, '');

  // 20. 清理多余空行
  content = content.replace(/\n{3,}/g, '\n\n');

  // 21. 清理行首行尾多余空格
  content = content.split('\n').map(line => line.trim()).join('\n');

  return content.trim();
}

/**
 * 清理和修复 MDX 文件
 */
function fixMdxFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // 分离 frontmatter 和内容
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatterMatch) {
    console.log(`跳过无 frontmatter 的文件: ${filePath}`);
    return;
  }

  const frontmatter = frontmatterMatch[0];
  let body = content.substring(frontmatter.length);

  // 深度清理正文内容
  const cleanedBody = deepCleanHtml(body);

  // 重新组合
  const fixedContent = frontmatter + cleanedBody + '\n';

  // 写回文件
  fs.writeFileSync(filePath, fixedContent, 'utf-8');
  console.log(`✅ 已深度清理: ${path.basename(path.dirname(filePath))}`);
}

// 处理所有文件
console.log('开始深度清理 MDX 文件...\n');

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  try {
    fixMdxFile(filePath);
  } catch (error) {
    console.error(`❌ 处理失败 ${file}:`, error.message);
  }
});

console.log('\n✅ 深度清理完成！');
