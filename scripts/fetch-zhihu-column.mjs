/**
 * 知乎专栏爬取脚本
 * 使用 Puppeteer 获取专栏文章列表和内容
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COLUMN_URL = 'https://www.zhihu.com/column/c_1850881576583442432';
const OUTPUT_DIR = path.join(__dirname, '../src/content/blog');

// 已存在的文章slug，跳过
const EXISTING_SLUGS = ['preintegrated-sss'];

/**
 * 从文章标题生成URL友好的slug
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^一-龥a-z0-9\s-]/g, '') // 移除特殊字符，保留中文
    .replace(/\s+/g, '-') // 空格替换为连字符
    .replace(/-+/g, '-') // 多个连字符合并为一个
    .trim();
}

/**
 * 等待元素出现
 */
async function waitForSelector(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 滚动页面加载所有内容
 */
async function scrollPage(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

/**
 * 获取专栏文章列表
 */
async function fetchArticleList(page) {
  console.log('正在获取专栏文章列表...');

  await page.goto(COLUMN_URL, { waitUntil: 'networkidle0' });

  // 滚动加载所有文章
  await scrollPage(page);

  // 尝试多种选择器
  const articles = await page.evaluate(() => {
    // 尝试不同的选择器
    const selectors = [
      '.ColumnItem',
      '.ContentItem',
      '[data-zop-list]',
      'article',
      '.List-item'
    ];

    let items = [];
    for (const selector of selectors) {
      items = Array.from(document.querySelectorAll(selector));
      if (items.length > 0) {
        console.log(`Found items with selector: ${selector}`);
        break;
      }
    }

    // 调试：打印页面内容
    console.log('Page HTML sample:', document.body.innerHTML.substring(0, 1000));

    return items.map(item => {
      // 尝试多种标题选择器
      const titleSelectors = [
        '.ContentItem-title a',
        'a.ContentItem-title',
        'h2 a',
        'h3 a',
        '.title a',
        'a[title]'
      ];

      let titleEl = null;
      let linkEl = null;

      for (const selector of titleSelectors) {
        titleEl = item.querySelector(selector);
        if (titleEl) {
          linkEl = titleEl;
          break;
        }
      }

      const excerptEl = item.querySelector('.ContentItem-summary') || item.querySelector('.summary') || item.querySelector('.excerpt');
      const authorEl = item.querySelector('.AuthorInfo-name') || item.querySelector('.author');
      const timeEl = item.querySelector('.ContentItem-time') || item.querySelector('.time');

      return {
        title: titleEl?.textContent?.trim() || '',
        url: linkEl?.href || '',
        excerpt: excerptEl?.textContent?.trim() || '',
        author: authorEl?.textContent?.trim() || '',
        time: timeEl?.textContent?.trim() || ''
      };
    }).filter(article => article.url && article.title); // 过滤掉空文章
  });

  console.log(`找到 ${articles.length} 篇文章`);
  return articles;
}

/**
 * 获取单篇文章内容
 */
async function fetchArticleContent(page, url) {
  console.log(`正在抓取文章: ${url}`);

  await page.goto(url, { waitUntil: 'networkidle0' });

  // 滚动加载完整内容
  await scrollPage(page);

  const content = await page.evaluate(() => {
    const titleEl = document.querySelector('.Post-Title');
    const contentEl = document.querySelector('.Post-RichText');
    const authorEl = document.querySelector('.AuthorInfo-name');
    const timeEl = document.querySelector('.ContentItem-time');

    // 提取所有图片
    const images = [];
    contentEl?.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('data-original') || img.src;
      if (src && !src.includes('zhimg.com/50/')) {
        images.push(src);
      }
    });

    // 获取正文HTML
    const bodyHTML = contentEl?.innerHTML || '';

    return {
      title: titleEl?.textContent?.trim() || '',
      author: authorEl?.textContent?.trim() || '',
      time: timeEl?.textContent?.trim() || '',
      images: images,
      body: bodyHTML
    };
  });

  return content;
}

/**
 * 将HTML转换为Markdown
 */
function htmlToMarkdown(html) {
  let markdown = html;

  // 移除script和style标签
  markdown = markdown.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  markdown = markdown.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

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

  // 清理多余空行
  markdown = markdown.replace(/\n{3,}/g, '\n\n');

  // 清理HTML注释
  markdown = markdown.replace(/<!--[\s\S]*?-->/g, '');

  return markdown.trim();
}

/**
 * 保存文章为MDX文件
 */
function saveArticle(article, content) {
  const slug = generateSlug(article.title);

  if (EXISTING_SLUGS.includes(slug)) {
    console.log(`跳过已存在的文章: ${slug}`);
    return;
  }

  const articleDir = path.join(OUTPUT_DIR, slug);
  fs.mkdirSync(articleDir, { recursive: true });

  // 下载图片
  const imagePromises = content.images.map((imgUrl, index) => {
    return downloadImage(imgUrl, articleDir, `image-${index + 1}.jpg`);
  });

  Promise.all(imagePromises).then(() => {
    console.log(`文章 ${slug} 的图片下载完成`);
  }).catch(err => {
    console.error(`图片下载失败:`, err);
  });

  // 转换为Markdown
  const markdown = htmlToMarkdown(content.body);

  // 替换图片链接为本地相对路径
  let localMarkdown = markdown;
  content.images.forEach((imgUrl, index) => {
    localMarkdown = localMarkdown.replace(new RegExp(imgUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `./image-${index + 1}.jpg`);
  });

  // 生成MDX文件
  const mdxContent = `---
title: "${content.title.replace(/"/g, '\\"')}"
description: "${article.excerpt.replace(/"/g, '\\"')}"
category: graphics
tags: ['UE', '实时渲染', '图形学']
date: ${new Date().toISOString().split('T')[0]}
readTime: 10
heroImage: ${content.images.length > 0 ? `"./image-1.jpg"` : '""'}
---

${localMarkdown}
`;

  fs.writeFileSync(path.join(articleDir, 'index.mdx'), mdxContent, 'utf-8');
  console.log(`✅ 文章已保存: ${slug}`);
}

/**
 * 下载图片
 */
async function downloadImage(url, dir, filename) {
  const https = await import('https');
  const filepath = path.join(dir, filename);

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        downloadImage(response.headers.location, dir, filename)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * 主函数
 */
async function main() {
  console.log('启动知乎专栏爬虫...\n');

  const browser = await puppeteer.launch({
    headless: false, // 显示浏览器，方便调试
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // 设置用户代理
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // 截图调试
    console.log('访问专���页面...');
    await page.goto(COLUMN_URL, { waitUntil: 'networkidle0' });

    // 等待页面加载
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 截图
    await page.screenshot({ path: 'zhihu-column-debug.png', fullPage: true });
    console.log('已保存截图: zhihu-column-debug.png');

    // 获取页面内容用于调试
    const pageContent = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        body: document.body.innerHTML.substring(0, 5000)
      };
    });

    console.log('当前页面:', pageContent.url);
    console.log('页面标题:', pageContent.title);

    // 获取文章列表
    const articles = await fetchArticleList(page);

    if (articles.length === 0) {
      console.log('没有找到文章，退出...');
      return;
    }

    console.log('\n开始抓取文章内容...\n');

    // 抓取每篇文章
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];

      if (!article.url) {
        console.log(`跳过文章 ${i + 1}: 无URL`);
        continue;
      }

      try {
        const content = await fetchArticleContent(page, article.url);
        saveArticle(article, content);

        // 随机延迟，避免请求过快
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

      } catch (error) {
        console.error(`抓取文章失败 ${article.url}:`, error.message);
      }
    }

    console.log('\n✅ 所有文章处理完成！');

  } catch (error) {
    console.error('爬虫执行失败:', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
