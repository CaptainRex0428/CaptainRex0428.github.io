import fs from 'fs';
import path from 'path';
import https from 'https';

// 知乎文章的图片链接
const images = [
  'https://pic1.zhimg.com/v2-faccdb3253412c54778cfef3bb32066a_1440w.jpg', // 头图
  'https://pic2.zhimg.com/v2-1c96a9ebf96ab262a68cf968ee69fbb9_1440w.jpg', // FaceWorks预积分方案
  'https://pic3.zhimg.com/v2-6fbe514601e9e36709f80ac38c494d96_1440w.jpg', // Curvature Lut
  'https://pica.zhimg.com/v2-576b29fe4f3122d33454b221bbdc4a9e_1440w.jpg', // Shadow Lut
  'https://pic1.zhimg.com/v2-d0a5930281c67698e6081b3d6be1ca1c_1440w.jpg', // FaceWorks方案说明
  'https://pic4.zhimg.com/v2-6de3600e5cfc720da639b1c9538aa655_1440w.jpg', // MaterialAttributeDefinitionMap
  'https://pica.zhimg.com/v2-379148beea44b9d53af58bb003d730c0_1440w.jpg', // Material.cpp
  'https://picx.zhimg.com/v2-52c6b275c691766bdfbacbcf339b6093_1440w.jpg', // 效果对比1
  'https://pica.zhimg.com/v2-8764b9ceceaec982084ce4e18c219545.jpg?source=382ee89a', // 效果对比2
  'https://picx.zhimg.com/v2-c746636e6f4c344b21b27fabc37ff1eb_1440w.jpg', // 其他
  'https://pica.zhimg.com/v2-9f3400f782c36146c1ef8c8432affa0c_1440w.jpg'  // 其他
];

// 图片文件名映射
const fileNames = [
  'hero.jpg',
  'faceworks-demo.jpg',
  'curvature-lut.jpg',
  'shadow-lut.jpg',
  'faceworks-scheme.jpg',
  'material-attributes.jpg',
  'material-cpp.jpg',
  'comparison-1.jpg',
  'comparison-2.jpg',
  'image-10.jpg',
  'image-11.jpg'
];

// 目标目录
const targetDir = '../src/content/blog/preintegrated-sss/';

// 确保目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 下载图片函数
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // 处理重定向
        downloadImage(response.headers.location, filepath)
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
        console.log(`✅ Downloaded: ${filepath}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {}); // 删除不完整的文件
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 批量下载
async function downloadAll() {
  console.log('开始下载知乎文章图片...\n');

  for (let i = 0; i < images.length; i++) {
    const url = images[i];
    const filename = fileNames[i];
    const filepath = path.join(targetDir, filename);

    try {
      await downloadImage(url, filepath);
    } catch (error) {
      console.error(`❌ 下载失败 ${filename}:`, error.message);
    }
  }

  console.log('\n下载完成！');
}

downloadAll().catch(console.error);