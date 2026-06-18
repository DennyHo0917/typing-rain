const BASE_URL = 'https://your-domain.example';

export function generateSitemapXML() {
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
}

export function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Disallow: /scripts/
Disallow: /.git/
Disallow: /.cursor/
Disallow: /dist/

Sitemap: ${BASE_URL}/sitemap.xml`;
}

export function validateSEO() {
  const title = document.title || '';
  const description = document.querySelector('meta[name="description"]')?.content || '';
  const canonical = document.querySelector('link[rel="canonical"]')?.href || '';

  return {
    title: title.includes('Spelling') && title.length <= 60,
    description: description.includes('spelling') && description.length <= 160,
    canonical: canonical.startsWith(BASE_URL),
    structuredData: document.querySelectorAll('script[type="application/ld+json"]').length > 0,
    errors: [],
  };
}

if (typeof window !== 'undefined') {
  window.sitemapGenerator = {
    generateSitemapXML,
    generateRobotsTxt,
    validateSEO,
  };
}
