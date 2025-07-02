// 动态sitemap生成器

/**
 * 生成sitemap XML内容
 * @returns {string} sitemap XML字符串
 */
export function generateSitemapXML() {
  const baseUrl = 'https://www.typingrain.top';
  const languages = ['en', 'zh-cn', 'zh-tw', 'ja', 'ko', 'de', 'fr', 'es', 'it', 'ru', 'pt'];
  const pages = [
    { path: '', priority: '1.0', changefreq: 'weekly' },
    { path: '/practice.html', priority: '0.8', changefreq: 'weekly' },
    { path: '/tournament.html', priority: '0.8', changefreq: 'weekly' }
  ];
  
  const currentDate = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
  
  pages.forEach(page => {
    languages.forEach(lang => {
      const isDefaultLang = lang === 'en';
      const url = isDefaultLang 
        ? `${baseUrl}${page.path}`
        : `${baseUrl}${page.path}${page.path.includes('?') ? '&' : '?'}lang=${lang}`;
      
      xml += `  <url>\n`;
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      
      // 添加hreflang链接
      languages.forEach(hrefLang => {
        const hrefUrl = hrefLang === 'en'
          ? `${baseUrl}${page.path}`
          : `${baseUrl}${page.path}${page.path.includes('?') ? '&' : '?'}lang=${hrefLang}`;
        xml += `    <xhtml:link rel="alternate" hreflang="${hrefLang}" href="${hrefUrl}" />\n`;
      });
      
      // 添加x-default
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${page.path}" />\n`;
      xml += `  </url>\n`;
    });
  });
  
  xml += `</urlset>`;
  return xml;
}

/**
 * 下载sitemap文件
 */
export function downloadSitemap() {
  const xml = generateSitemapXML();
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 生成robots.txt内容
 * @returns {string} robots.txt内容
 */
export function generateRobotsTxt() {
  const baseUrl = 'https://www.typingrain.top';
  
  return `User-agent: *
Allow: /

# 主要页面
Allow: /
Allow: /practice.html
Allow: /tournament.html

# 资源文件
Allow: /src/css/
Allow: /src/js/
Allow: /src/i18n/
Allow: /images/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# 限制
Disallow: /dist/
Disallow: /scripts/
Disallow: /*.bat
Disallow: /*.py

# 爬虫友好
Crawl-delay: 1`;
}

/**
 * 下载robots.txt文件
 */
export function downloadRobotsTxt() {
  const content = generateRobotsTxt();
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'robots.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 验证当前页面的SEO设置
 * @returns {Object} SEO验证结果
 */
export function validateSEO() {
  const results = {
    title: !!document.title && document.title.length > 10,
    description: !!document.querySelector('meta[name="description"]'),
    ogTags: !!document.querySelector('meta[property="og:title"]'),
    hreflang: document.querySelectorAll('link[rel="alternate"][hreflang]').length > 0,
    structuredData: !!document.querySelector('script[type="application/ld+json"]'),
    canonical: !!document.querySelector('link[rel="canonical"]'),
    errors: []
  };
  
  // 检查标题长度
  if (document.title.length > 60) {
    results.errors.push('Title too long (>60 characters)');
  }
  
  // 检查描述长度
  const desc = document.querySelector('meta[name="description"]');
  if (desc && desc.content.length > 160) {
    results.errors.push('Description too long (>160 characters)');
  }
  
  // 检查重复内容
  const h1Tags = document.querySelectorAll('h1');
  if (h1Tags.length > 1) {
    results.errors.push('Multiple H1 tags found');
  }
  
  return results;
}

// 暴露到全局
if (typeof window !== 'undefined') {
  window.sitemapGenerator = {
    generateSitemapXML,
    downloadSitemap,
    generateRobotsTxt,
    downloadRobotsTxt,
    validateSEO
  };
}

// 开发模式下的便捷函数
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  window.devSEO = {
    generateSitemap: generateSitemapXML,
    downloadSitemap,
    downloadRobots: downloadRobotsTxt,
    validateSEO,
    logSEOStatus: () => {
      const results = validateSEO();
      console.log('SEO Status:', results);
      return results;
    }
  };
} 