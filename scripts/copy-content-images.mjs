/**
 * 构建前脚本：将 content 目录中的图片复制到 public 目录
 * 确保 MDX 中的相对路径图片可以在网站上正确访问
 */
import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

function isImage(filename) {
  const ext = extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
}

function copyImagesRecursive(srcDir, baseDir, collectionName) {
  if (!existsSync(srcDir)) return;

  const items = readdirSync(srcDir);

  for (const item of items) {
    const srcPath = join(srcDir, item);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      // 结构: src/content/blog/slug/
      const slug = item;
      const destDir = join('public', collectionName, slug);

      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }

      // 复制该 slug 目录下的所有图片
      const subItems = readdirSync(srcPath);
      for (const subItem of subItems) {
        const subSrcPath = join(srcPath, subItem);
        const subStat = statSync(subSrcPath);
        if (subStat.isFile() && isImage(subItem)) {
          const destPath = join(destDir, subItem);
          console.log(`Copying: public/${collectionName}/${slug}/${subItem}`);
          copyFileSync(subSrcPath, destPath);
        }
      }
    } else if (stat.isFile() && isImage(item)) {
      // 文件直接放在 content/blog/ 或 content/works/ 下
      const destPath = join('public', collectionName, item);
      const destDirPath = dirname(destPath);

      if (!existsSync(destDirPath)) {
        mkdirSync(destDirPath, { recursive: true });
      }

      console.log(`Copying: public/${collectionName}/${item}`);
      copyFileSync(srcPath, destPath);
    }
  }
}

const projectRoot = join(__dirname, '..');
process.chdir(projectRoot);

console.log('Copying content images to public directory...');

// 复制 blog 和 works 目录中的图片
['blog', 'works'].forEach(collection => {
  const srcDir = join('src/content', collection);
  console.log(`Processing ${collection}...`);
  copyImagesRecursive(srcDir, srcDir, collection);
});

console.log('Done!');