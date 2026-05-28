/**
 * 修复已抓取的 MDX 文件，清理不合法的 HTML 标签
 */
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const blogDir = 'src/content/blog';
const files = glob.sync('**/index.mdx', { cwd: blogDir });

/**
 * 更好的 HTML 到 Markdown 转换
 */
function htmlToMarkdown(html) {
  let markdown = html;

  // 移除知乎特有的复杂HTML结构
  markdown = markdown.replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, (match) => {
    // 提取其中的图片链接
    const imgMatch = match.match(/!\[\]\((https:\/\/[^\)]+)\)/);
    if (imgMatch) {
      return `![图片](${imgMatch[1]})\n\n`;
    }
    return '';
  });

  // 移除 span 标签但保留内容（知乎用span做内联样式）
  markdown = markdown.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1');

  // 移除其他知乎特有的 div 和 class
  markdown = markdown.replace(/<div[^>]*>/gi, '');
  markdown = markdown.replace(/<\/div>/gi, '\n');
  markdown = markdown.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, ''); // 移除 SVG 图标

  // 移除 script 和 style 标签
  markdown = markdown.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  markdown = markdown.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // 移除视频标签
  markdown = markdown.replace(/<video[^>]*>[\s\S]*?<\/video>/gi, '');

  // 标题
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');

  // 粗体和斜体
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

  // 链接
  markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // 图片
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)');

  // 代码块 - 处理语法高亮的 span
  markdown = markdown.replace(/<div class="highlight">``([\s\S]*?)``<\/div>/gi, '```$1```');
  markdown = markdown.replace(/<div class="highlight">```\n([\s\S]*?)\n```<\/div>/gi, '```\n$1\n```');

  // 简化代码块中的 span 标签
  markdown = markdown.replace(/<span class="[^"]*">/gi, '');
  markdown = markdown.replace(/<\/span>/gi, '');

  // 代码块
  markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n');
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

  // 段落
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gis, '$1\n\n');

  // 列表
  markdown = markdown.replace(/<ul[^>]*>/gi, '');
  markdown = markdown.replace(/<\/ul>/gi, '\n');
  markdown = markdown.replace(/<ol[^>]*>/gi, '');
  markdown = markdown.replace(/<\/ol>/gi, '\n');
  markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');

  // 引用
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n\n');

  // 分割线
  markdown = markdown.replace(/<hr[^>]*>/gi, '---\n\n');

  // 清理 HTML 实体
  markdown = markdown.replace(/&amp;/g, '&');
  markdown = markdown.replace(/&lt;/g, '<');
  markdown = markdown.replace(/&gt;/g, '>');
  markdown = markdown.replace(/&quot;/g, '"');
  markdown = markdown.replace(/&#39;/g, "'");

  // 清理多余空行
  markdown = markdown.replace(/\n{3,}/g, '\n\n');

  // 清理HTML注释
  markdown = markdown.replace(/<!--[\s\S]*?-->/g, '');

  return markdown.trim();
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

  // 清理正文内容
  const cleanedBody = htmlToMarkdown(body);

  // 重新组合
  const fixedContent = frontmatter + cleanedBody;

  // 写回文件
  fs.writeFileSync(filePath, fixedContent, 'utf-8');
  console.log(`✅ 已修复: ${path.basename(path.dirname(filePath))}`);
}

// 处理所有文件
files.forEach(file => {
  const filePath = path.join(blogDir, file);
  try {
    fixMdxFile(filePath);
  } catch (error) {
    console.error(`❌ 处理失败 ${file}:`, error.message);
  }
});

console.log('\n✅ 所有文件修复完成！');
