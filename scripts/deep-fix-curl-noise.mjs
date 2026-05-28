/**
 * 深度修复 curl noise 文章
 */
import fs from 'fs';
import path from 'path';

const filePath = 'src/content/blog/重启restart-projectshnoise-curlnoise/index.mdx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. 修复图片链接格式 - 将错误的 !图片 替换为正确的格式
content = content.replace(/!图片/g, '');

// 2. 修复混合链接格式 - 处理包含描述的复杂链接
content = content.replace(/\[!\[\]\([^\)]+\)\s*([^\]]+?)\s*\d+\s赞同\s*·\s*\d+\s评论\s*文章\]\([^\)]+\)/g, (match, title) => {
  return `**${title}**`;
});

// 3. 修复纯文本链接格式
content = content.replace(/([^\[]+)\s*www\.[^\s]+/g, (match, text) => {
  return `**${text.trim()}**`;
});

// 4. 修复数学公式中的 HTML 实体和格式问题
content = content.replace(/&nbsp;/g, ' ');
content = content.replace(/&#59;/g, ';');
content = content.replace(/&#34;/g, '"');
content = content.replace(/&lt;/g, '<');
content = content.replace(/&gt;/g, '>');

// 5. 清理 LaTeX 数学公式的显示问题
content = content.replace(/([a-zA-Z_])\s*\\\s*([a-zA-Z_])/g, '$1 \\$2');
content = content.replace(/([a-zA-Z0-9_]+)\s*\\cdot\s*/g, '$1 · ');

// 6. 移除损坏的图片引用
content = content.replace(/!\[\]\(\.\/image-\d+\.jpg\)\d{2}:\d{2}/g, '');
content = content.replace(/!\[\]\(\.\/image-\d+\.jpg\)/g, '');

// 7. 修复链接格式
content = content.replace(/\[([^\]]+)\]\([^\)]+\)\s*([^\n]+)/g, (match, text, trailing) => {
  if (trailing && trailing.trim()) {
    return `${text} ${trailing.trim()}`;
  }
  return text;
});

// 8. 清理多余空行
content = content.replace(/\n{3,}/g, '\n\n');

// 9. 清理行首尾空格
content = content.split('\n').map(line => line.trim()).join('\n');

// 10. 移除空行
content = content.replace(/^\s*[\r\n]/gm, '');

// 写回文件
fs.writeFileSync(filePath, content, 'utf-8');

console.log('✅ curl noise 文章深度修复完成！');
