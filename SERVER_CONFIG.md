# 服务器配置指南 - 多语言SEO优化

## Apache (.htaccess) 配置

创建 `.htaccess` 文件在网站根目录：

```apache
# 启用重写引擎
RewriteEngine On

# 语言内容协商 - 根据Accept-Language头自动重定向
# 仅当没有指定lang参数时生效，避免影响SEO爬虫
RewriteCond %{QUERY_STRING} !lang=
RewriteCond %{HTTP:Accept-Language} ^zh-cn [NC]
RewriteRule ^$ /?lang=zh-cn [R=302,L]

RewriteCond %{QUERY_STRING} !lang=
RewriteCond %{HTTP:Accept-Language} ^zh-tw [NC]
RewriteRule ^$ /?lang=zh-tw [R=302,L]

RewriteCond %{QUERY_STRING} !lang=
RewriteCond %{HTTP:Accept-Language} ^ja [NC]
RewriteRule ^$ /?lang=ja [R=302,L]

RewriteCond %{QUERY_STRING} !lang=
RewriteCond %{HTTP:Accept-Language} ^ko [NC]
RewriteRule ^$ /?lang=ko [R=302,L]

RewriteCond %{QUERY_STRING} !lang=
RewriteCond %{HTTP:Accept-Language} ^de [NC]
RewriteRule ^$ /?lang=de [R=302,L]

RewriteCond %{QUERY_STRING} !lang=
RewriteCond %{HTTP:Accept-Language} ^fr [NC]
RewriteRule ^$ /?lang=fr [R=302,L]

RewriteCond %{QUERY_STRING} !lang=
RewriteCond %{HTTP:Accept-Language} ^es [NC]
RewriteRule ^$ /?lang=es [R=302,L]

RewriteCond %{QUERY_STRING} !lang=
RewriteCond %{HTTP:Accept-Language} ^it [NC]
RewriteRule ^$ /?lang=it [R=302,L]

RewriteCond %{QUERY_STRING} !lang=
RewriteCond %{HTTP:Accept-Language} ^ru [NC]
RewriteRule ^$ /?lang=ru [R=302,L]

RewriteCond %{QUERY_STRING} !lang=
RewriteCond %{HTTP:Accept-Language} ^pt [NC]
RewriteRule ^$ /?lang=pt [R=302,L]

# 设置合适的缓存头
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/html "access plus 1 hour"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# 启用Gzip压缩
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# 安全头设置
<IfModule mod_headers.c>
    Header always set X-Frame-Options DENY
    Header always set X-Content-Type-Options nosniff
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

## Nginx 配置

在 `server` 块中添加：

```nginx
# 语言重定向 - 仅当没有lang参数时
location = / {
    if ($args !~ "lang=") {
        set $lang_redirect "";
    }
    
    if ($http_accept_language ~* "^zh-cn") {
        set $lang_redirect "zh-cn";
    }
    
    if ($http_accept_language ~* "^zh-tw") {
        set $lang_redirect "zh-tw";
    }
    
    if ($http_accept_language ~* "^ja") {
        set $lang_redirect "ja";
    }
    
    if ($http_accept_language ~* "^ko") {
        set $lang_redirect "ko";
    }
    
    if ($http_accept_language ~* "^de") {
        set $lang_redirect "de";
    }
    
    if ($http_accept_language ~* "^fr") {
        set $lang_redirect "fr";
    }
    
    if ($http_accept_language ~* "^es") {
        set $lang_redirect "es";
    }
    
    if ($http_accept_language ~* "^it") {
        set $lang_redirect "it";
    }
    
    if ($http_accept_language ~* "^ru") {
        set $lang_redirect "ru";
    }
    
    if ($http_accept_language ~* "^pt") {
        set $lang_redirect "pt";
    }
    
    if ($lang_redirect) {
        return 302 /?lang=$lang_redirect;
    }
    
    try_files $uri $uri/ /index.html;
}

# 缓存设置
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
    expires 1h;
    add_header Cache-Control "public";
}

# 安全头
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

## Cloudflare 配置

如果使用 Cloudflare，可以使用 Page Rules：

1. **创建重定向规则**：
   - URL: `typingrain.top/*`
   - 设置: Custom response headers
   - 添加：`CF-Auto-Language: true`

2. **缓存规则**：
   - HTML文件：Browser Cache TTL: 4 hours
   - 静态资源：Browser Cache TTL: 1 year

## Google Search Console 配置

1. **提交sitemap**：
   ```
   https://www.typingrain.top/sitemap.xml
   ```

2. **设置多语言版本**：
   - 在 Google Search Console 中为每个语言版本创建属性
   - 提交各语言的URL

3. **监控搜索表现**：
   - 关注不同语言的搜索查询
   - 检查hreflang实现是否正确

## SEO测试工具

使用以下工具验证多语言SEO配置：

1. **Google富媒体结果测试**：
   ```
   https://search.google.com/test/rich-results
   ```

2. **hreflang测试工具**：
   ```
   https://www.aleydasolis.com/en/international-seo-tools/hreflang-tags-generator/
   ```

3. **站点速度测试**：
   ```
   https://pagespeed.web.dev/
   ```

## 效果预期

配置完成后，用户体验将是：

- 🇨🇳 中文用户搜索 "打字雨游戏" → 自动进入中文版本
- 🇯🇵 日文用户搜索 "タイピングゲーム" → 自动进入日文版本  
- 🇺🇸 英文用户搜索 "typing game" → 进入英文默认版本
- 🤖 搜索引擎爬虫可以发现所有语言版本
- 📱 移动端体验一致

## 注意事项

1. **避免重定向循环**：确保有lang参数时不再重定向
2. **SEO友好**：使用302重定向而非301，保持灵活性
3. **性能优化**：适当的缓存设置提高加载速度
4. **监控指标**：定期检查各语言版本的搜索表现 