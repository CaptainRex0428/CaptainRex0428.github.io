/**
 * 最终 MDX 清理脚本 - 处理特殊字符和边缘情况
 */
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const blogDir = 'src/content/blog';
const files = glob.sync('**/index.mdx', { cwd: blogDir });

/**
 * 处理 MDX 文件中的特殊字符和格式问题
 */
function finalCleanMdx(content) {
  let cleaned = content;

  // 1. 处理链接中的特殊字符 - 使用 HTML 实体编码
  cleaned = cleaned.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    // 如果 URL 包含特殊字符，尝试简化或编码
    if (url.includes('zhida.zhihu.com')) {
      // 移除知乎内部搜索链接，只保留文本
      return text;
    }
    return match;
  });

  // 2. 清理任何残留的 HTML 标签
  cleaned = cleaned.replace(/<[^>]+>/g, '');

  // 3. 确保代码块格式正确
  cleaned = cleaned.replace(/```([^\n]*)([\s\S]*?)```/g, (match, lang, code) => {
    return '```\n' + code.trim() + '\n```';
  });

  // 4. 清理多余的空行
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // 5. 清理行首尾空格
  cleaned = cleaned.split('\n').map(line => line.trim()).join('\n');

  return cleaned;
}

/**
 * 处理单个文件
 */
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // 分离 frontmatter 和内容
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatterMatch) {
    console.log(`跳过无 frontmatter 的文件: ${filePath}`);
    return;
  }

  const frontmatter = frontmatterMatch[0];
  let body = content.substring(frontmatter.length);

  // 最终清理
  const cleanedBody = finalCleanMdx(body);

  // 重新组合
  const finalContent = frontmatter + cleanedBody + '\n';

  // 写回文件
  fs.writeFileSync(filePath, finalContent, 'utf-8');
  console.log(`✅ 已最终清理: ${path.basename(path.dirname(filePath))}`);
}

// 处理所有文件
console.log('开始最终清理 MDX 文件...\n');

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  try {
    processFile(filePath);
  } catch (error) {
    console.error(`❌ 处理失败 ${file}:`, error.message);
  }
});

console.log('\n✅ 最终清理完成！');
