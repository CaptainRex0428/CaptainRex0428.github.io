/**
 * 最终修复 curl noise 文章 - 重新组织内容
 */
import fs from 'fs';

const filePath = 'src/content/blog/重启restart-projectshnoise-curlnoise/index.mdx';
let content = fs.readFileSync(filePath, 'utf-8');

// 修复 frontmatter 中的问题
content = content.replace(/tags: \[\*'UE'/, "tags: ['UE'");

// 修复混乱的行 - 按行处理
const lines = content.split('\n');
const fixedLines = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i].trim();

  // 跳过空行
  if (!line) continue;

  // 跳过 frontmatter 后面 --- 前的内容���理
  if (line.startsWith('---') && i > 5) {
    fixedLines.push(line);
    continue;
  }

  // 修复混乱的标题行
  if (line.includes('## 一、引入一些概念')) {
    fixedLines.push('## 一、引入一些概念');
    continue;
  }

  // 跳过包含 "!**" 的混乱行
  if (line.includes('!**')) continue;

  // 跳过包含 "! 向量场的介绍" 的混乱行
  if (line.includes('! 向量场的介绍')) continue;

  // 修复以 "**" 结尾但没有开头的行
  if (line.endsWith('**') && !line.startsWith('**')) {
    line = '**' + line.slice(0, -2) + '**';
  }

  fixedLines.push(line);
}

// 重新组合内容，确保适当的空行
let finalContent = '';
for (let i = 0; i < fixedLines.length; i++) {
  finalContent += fixedLines[i];

  // 在标题后添加空行
  if (fixedLines[i].startsWith('##')) {
    finalContent += '\n';
  }

  finalContent += '\n';
}

// 清理多余空行
finalContent = finalContent.replace(/\n{3,}/g, '\n\n');

// 写回文件
fs.writeFileSync(filePath, finalContent, 'utf-8');

console.log('✅ curl noise 文章最终修复完成！');
