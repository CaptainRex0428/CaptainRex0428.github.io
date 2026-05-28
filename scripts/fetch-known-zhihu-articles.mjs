/**
 * 知乎文章爬取脚本 - 使用已知文章URL
 */
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 使用 stealth 插件来避免被检测
puppeteer.use(StealthPlugin());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../src/content/blog');

// 已存在的文章slug，跳过
const EXISTING_SLUGS = ['preintegrated-sss', 'restart-projectsh基于预积分的次表面渲染profile优化'];

// 知乎文章URL列表（需要手动提供）
const ARTICLE_URLS = [
  'https://zhuanlan.zhihu.com/p/2041115663838748743',
  'https://zhuanlan.zhihu.com/p/2022734328111661362',
  'https://zhuanlan.zhihu.com/p/1982126242057695477',
  'https://zhuanlan.zhihu.com/p/1980312187256992919',
  'https://zhuanlan.zhihu.com/p/1931715525014168676',
  'https://zhuanlan.zhihu.com/p/1931715203692737685',
  'https://zhuanlan.zhihu.com/p/1947311722718304050',
  'https://zhuanlan.zhihu.com/p/2017660919023420273',
];

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
async function waitForSelector(page, selector, timeout = 10000) {
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
 * 获取单篇文章内容
 */
async function fetchArticleContent(page, url) {
  console.log(`正在抓取文章: ${url}`);

  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // 滚动加载完整内容
    await scrollPage(page);

    // 等待内容加载
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 等待页面加载
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 截图调试
    const screenshotPath = `debug-${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`已保存调试截图: ${screenshotPath}`);

    const content = await page.evaluate(() => {
      // 尝试多种标题选择器
      const titleSelectors = [
        '.Post-Title',
        '.RichContent-title',
        'h1',
        '.post-title',
        '.PostTitle'
      ];

      let titleEl = null;
      for (const selector of titleSelectors) {
        titleEl = document.querySelector(selector);
        if (titleEl?.textContent?.trim()) {
          break;
        }
      }

      // 尝试多种内容选择器
      const contentSelectors = [
        '.Post-RichText',
        '.RichContent-inner',
        '.Post-content',
        'article',
        '.RichText'
      ];

      let contentEl = null;
      for (const selector of contentSelectors) {
        contentEl = document.querySelector(selector);
        if (contentEl) {
          break;
        }
      }

      // 提取所有图片
      const images = [];
      contentEl?.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('data-original') ||
                   img.getAttribute('data-src') ||
                   img.src;
        if (src && src.includes('zhimg.com') && !src.includes('zhimg.com/50/')) {
          images.push(src);
        }
      });

      // 获取正文HTML
      const bodyHTML = contentEl?.innerHTML || '';

      return {
        title: titleEl?.textContent?.trim() || '',
        images: images,
        body: bodyHTML,
        pageTitle: document.title,
        bodyPreview: document.body.innerHTML.substring(0, 500)
      };
    });

    console.log('抓取结果:', {
      title: content?.title,
      hasContent: !!content?.body,
      imageCount: content?.images?.length,
      pageTitle: content?.pageTitle
    });

    return content;

  } catch (error) {
    console.error(`抓取文章失败 ${url}:`, error.message);

    // 截图保存错误状态
    try {
      await page.screenshot({ path: `error-${Date.now()}.png` });
      console.log('已保存错误截图');
    } catch (e) {
      // 忽略截图错误
    }

    return null;
  }
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
function saveArticle(url, content) {
  if (!content || !content.title) {
    console.log(`跳过无效内容: ${url}`);
    return;
  }

  const slug = generateSlug(content.title);

  if (EXISTING_SLUGS.includes(slug)) {
    console.log(`跳过已存在的文章: ${slug}`);
    return;
  }

  const articleDir = path.join(OUTPUT_DIR, slug);
  fs.mkdirSync(articleDir, { recursive: true });

  // 下载图片
  if (content.images.length > 0) {
    const imagePromises = content.images.map((imgUrl, index) => {
      return downloadImage(imgUrl, articleDir, `image-${index + 1}.jpg`);
    });

    Promise.all(imagePromises).then(() => {
      console.log(`文章 ${slug} 的图片下载完成`);
    }).catch(err => {
      console.error(`图片下载失败:`, err);
    });
  }

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
description: "从知乎导入的技术文章"
category: graphics
tags: ['UE', '实时渲染', '图形学']
date: ${new Date().toISOString().split('T')[0]}
readTime: ${Math.max(1, Math.floor(markdown.length / 500))}
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
  console.log('启动知乎文章爬虫...\n');

  if (ARTICLE_URLS.length === 0) {
    console.log('❌ 没有提供文章URL！');
    console.log('请在脚本中的 ARTICLE_URLS 数组中添加要爬取的文章链接');
    return;
  }

  const browser = await puppeteer.launch({
    headless: true, // 改为无头模式以提高效率
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });

  try {
    const page = await browser.newPage();

    // 设置用户代理
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log(`开始处理 ${ARTICLE_URLS.length} 篇文章...\n`);

    let successCount = 0;
    let failCount = 0;

    // 抓取每篇文章
    for (let i = 0; i < ARTICLE_URLS.length; i++) {
      const url = ARTICLE_URLS[i];

      try {
        const content = await fetchArticleContent(page, url);
        if (content && content.title) {
          saveArticle(url, content);
          successCount++;
        } else {
          failCount++;
        }

        // 随机延迟，避免请求过快
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

      } catch (error) {
        console.error(`处理文章失败 ${url}:`, error.message);
        failCount++;
      }
    }

    console.log(`\n✅ 处理完成！成功: ${successCount}, 失败: ${failCount}`);

  } catch (error) {
    console.error('爬虫执行失败:', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
