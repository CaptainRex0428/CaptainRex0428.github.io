/**
 * 修复 curl noise 文章中的格式问题
 */
import fs from 'fs';
import path from 'path';

const filePath = 'src/content/blog/重启restart-projectshnoise-curlnoise/index.mdx';
let content = fs.readFileSync(filePath, 'utf-8');

// 修复问题：
console.log('正在修复 curl noise 文章...');

// 1. 修复图片后面的时间戳问题
content = content.replace(/!\[\]\(\.\/image-\d+\.jpg\)\d{2}:\d{2}/g, (match) => {
  // 移除时间戳部分
  return match.replace(/\d{2}:\d{2}$/, '');
});

// 2. 修复混合链接格式 - 将 [text](url)format 修复为纯文本
content = content.replace(/\[([^\]]+)\]\([^\)]+\)([^\n]*)/g, (match, text, trailing) => {
  // 如果 trailing 包含时间戳或其他格式，只保留文本
  if (trailing && trailing.trim()) {
    return text + ' ' + trailing.trim();
  }
  return text;
});

// 3. 清理特殊的数学公式格式
content = content.replace(/([a-zA-Z])\s*&nbsp;\s*([a-zA-Z])/g, '$1 $2');
content = content.replace(/([a-zA-Z])\s*&#59;\s*/g, '$1; ');
content = content.replace(/&#34;/g, '"');

// 4. 修复链接中的格式问题
content = content.replace(/\[!\[\]\([^\)]+\)\s*([^\]]+)\]\([^\)]+\)/g, '![]($1)');

// 5. 清理多余的空行
content = content.replace(/\n{3,}/g, '\n\n');

// 6. 清理行首尾空格
content = content.split('\n').map(line => line.trim()).join('\n');

// 写回文件
fs.writeFileSync(filePath, content, 'utf-8');

console.log('✅ curl noise 文章修复完成！');
