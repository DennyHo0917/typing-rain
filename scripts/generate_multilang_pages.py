#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
多语言静态页面生成器
生成每种支持语言的独立HTML页面，优化SEO
"""

import json
import os
import re
from pathlib import Path

# 配置
LANGUAGES = ['en', 'zh-cn', 'zh-tw', 'ja', 'ko', 'de', 'fr', 'es', 'it', 'ru', 'pt']
BASE_DOMAIN = 'https://www.typingrain.top'
SOURCE_PAGES = ['index.html', 'practice.html', 'tournament.html']
I18N_DIR = 'src/i18n'
OUTPUT_DIR = 'dist'

def load_translations():
    """加载所有语言的翻译文件"""
    translations = {}
    for lang in LANGUAGES:
        file_path = f"{I18N_DIR}/{lang}.json"
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                translations[lang] = json.load(f)
        else:
            print(f"Warning: Translation file not found: {file_path}")
            translations[lang] = {}
    return translations

def get_lang_name_mapping():
    """语言代码到显示名称的映射"""
    return {
        'en': {'name': 'English', 'flag': '🇺🇸'},
        'zh-cn': {'name': '简体中文', 'flag': '🇨🇳'},
        'zh-tw': {'name': '繁體中文', 'flag': '🇹🇼'},
        'ja': {'name': '日本語', 'flag': '🇯🇵'},
        'ko': {'name': '한국어', 'flag': '🇰🇷'},
        'de': {'name': 'Deutsch', 'flag': '🇩🇪'},
        'fr': {'name': 'Français', 'flag': '🇫🇷'},
        'es': {'name': 'Español', 'flag': '🇪🇸'},
        'it': {'name': 'Italiano', 'flag': '🇮🇹'},
        'ru': {'name': 'Русский', 'flag': '🇷🇺'},
        'pt': {'name': 'Português', 'flag': '🇵🇹'}
    }

def get_page_seo_data(page, lang, translations):
    """获取页面的SEO数据"""
    trans = translations.get(lang, {})
    page_seo = trans.get('pageSEO', {})
    
    page_key = page.replace('.html', '')
    page_data = page_seo.get(page_key, {})
    
    # 默认SEO数据
    default_data = {
        'index': {
            'title': 'Typing Rain - Modern Word Game | Online Typing Practice',
            'description': 'Free online typing game to improve your typing speed and accuracy. Practice with falling words, track your WPM in real-time.',
            'keywords': 'typing game,typing practice,word game,online game,typing speed,WPM'
        },
        'practice': {
            'title': 'Typing Rain - Practice Mode | Free Typing Practice', 
            'description': 'Practice your typing skills with customizable settings. Perfect for daily typing improvement.',
            'keywords': 'typing practice,practice mode,typing skills,custom typing'
        },
        'tournament': {
            'title': 'Typing Rain - Tournament Mode | Competitive Typing Challenge',
            'description': 'Challenge yourself in Tournament Mode with 2-minute timed sessions.',
            'keywords': 'typing tournament,competitive typing,typing challenge,leaderboard'
        }
    }
    
    return {
        'title': page_data.get('title', default_data[page_key]['title']),
        'description': page_data.get('description', default_data[page_key]['description']),
        'keywords': page_data.get('keywords', default_data[page_key]['keywords']),
        'ogTitle': page_data.get('ogTitle', page_data.get('title', default_data[page_key]['title'])),
        'ogDescription': page_data.get('ogDescription', page_data.get('description', default_data[page_key]['description']))
    }

def generate_hreflang_links(page, current_lang):
    """生成hreflang链接"""
    links = []
    for lang in LANGUAGES:
        if lang == 'en':
            url = f"{BASE_DOMAIN}/{page}"
        else:
            url = f"{BASE_DOMAIN}/{lang}/{page}"
        links.append(f'    <link rel="alternate" hreflang="{lang}" href="{url}" />')
    
    # 添加 x-default
    links.append(f'    <link rel="alternate" hreflang="x-default" href="{BASE_DOMAIN}/{page}" />')
    return '\n'.join(links)

def generate_canonical_url(page, lang):
    """生成canonical URL"""
    if lang == 'en':
        return f"{BASE_DOMAIN}/{page}"
    else:
        return f"{BASE_DOMAIN}/{lang}/{page}"

def replace_meta_tags(html_content, seo_data, page, lang):
    """替换HTML中的meta标签"""
    # 替换title
    html_content = re.sub(r'<title>.*?</title>', f'<title>{seo_data["title"]}</title>', html_content)
    
    # 替换description
    html_content = re.sub(
        r'<meta name="description" content=".*?">', 
        f'<meta name="description" content="{seo_data["description"]}">',
        html_content
    )
    
    # 替换keywords
    html_content = re.sub(
        r'<meta name="keywords" content=".*?">', 
        f'<meta name="keywords" content="{seo_data["keywords"]}">',
        html_content
    )
    
    # 替换Open Graph标签
    html_content = re.sub(
        r'<meta property="og:title" content=".*?">', 
        f'<meta property="og:title" content="{seo_data["ogTitle"]}">',
        html_content
    )
    
    html_content = re.sub(
        r'<meta property="og:description" content=".*?">', 
        f'<meta property="og:description" content="{seo_data["ogDescription"]}">',
        html_content
    )
    
    # 替换canonical URL
    canonical_url = generate_canonical_url(page, lang)
    html_content = re.sub(
        r'<link rel="canonical" href=".*?">', 
        f'<link rel="canonical" href="{canonical_url}">',
        html_content
    )
    
    # 替换hreflang链接
    hreflang_pattern = r'    <link rel="alternate" hreflang=".*?" href=".*?" />\n?'
    html_content = re.sub(hreflang_pattern, '', html_content, flags=re.MULTILINE)
    hreflang_links = generate_hreflang_links(page, lang)
    
    # 在canonical后面插入hreflang
    html_content = html_content.replace(
        f'<link rel="canonical" href="{canonical_url}">',
        f'<link rel="canonical" href="{canonical_url}">\n    \n    <!-- Hreflang for international SEO -->\n{hreflang_links}'
    )
    
    # 设置html lang属性
    html_content = re.sub(r'<html lang=".*?">', f'<html lang="{lang}">', html_content)
    
    return html_content

def add_prerendered_content(html_content, lang, translations):
    """添加预渲染的翻译内容，移除JS依赖"""
    trans = translations.get(lang, {})
    
    # 替换主要的文本内容
    text_replacements = {
        'data-i18n="gameTitle"': f'>{trans.get("gameTitle", "TYPING RAIN")}<',
        'data-i18n="startGame"': f'>{trans.get("startGame", "START GAME")}<',
        'data-i18n="playAgain"': f'>{trans.get("playAgain", "PLAY AGAIN")}<',
        'data-i18n="leaderboard"': f'>{trans.get("leaderboard", "LEADERBOARD")}<',
        # 添加更多需要替换的内容...
    }
    
    for pattern, replacement in text_replacements.items():
        html_content = re.sub(pattern + r'>[^<]*<', replacement, html_content)
    
    return html_content

def generate_page(page, lang, translations):
    """生成单个页面的特定语言版本"""
    # 读取源文件
    with open(page, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # 获取SEO数据
    seo_data = get_page_seo_data(page, lang, translations)
    
    # 替换meta标签
    html_content = replace_meta_tags(html_content, seo_data, page, lang)
    
    # 添加预渲染内容
    html_content = add_prerendered_content(html_content, lang, translations)
    
    # 确定输出路径
    if lang == 'en':
        output_path = f"{OUTPUT_DIR}/{page}"
    else:
        output_path = f"{OUTPUT_DIR}/{lang}/{page}"
    
    # 创建输出目录
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # 写入文件
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"Generated: {output_path}")

def copy_assets():
    """复制静态资源到输出目录"""
    import shutil
    
    # 复制src目录
    if os.path.exists('src'):
        shutil.copytree('src', f'{OUTPUT_DIR}/src', dirs_exist_ok=True)
    
    # 复制其他必要文件
    files_to_copy = ['robots.txt', 'sitemap.xml', 'manifest.json', 'browserconfig.xml']
    for file in files_to_copy:
        if os.path.exists(file):
            shutil.copy2(file, OUTPUT_DIR)

def update_sitemap():
    """更新sitemap.xml包含所有语言版本"""
    sitemap_content = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
'''
    
    for page in SOURCE_PAGES:
        for lang in LANGUAGES:
            if lang == 'en':
                url = f"{BASE_DOMAIN}/{page}"
                loc = f"  <url>\n    <loc>{url}</loc>"
            else:
                url = f"{BASE_DOMAIN}/{lang}/{page}"
                loc = f"  <url>\n    <loc>{url}</loc>"
            
            sitemap_content += f'''{loc}
    <changefreq>weekly</changefreq>
    <priority>{'1.0' if page == 'index.html' else '0.8'}</priority>
    <lastmod>2024-01-01</lastmod>
'''
            
            # 添加hreflang链接
            for hreflang_lang in LANGUAGES:
                if hreflang_lang == 'en':
                    hreflang_url = f"{BASE_DOMAIN}/{page}"
                else:
                    hreflang_url = f"{BASE_DOMAIN}/{hreflang_lang}/{page}"
                sitemap_content += f'    <xhtml:link rel="alternate" hreflang="{hreflang_lang}" href="{hreflang_url}" />\n'
            
            sitemap_content += "  </url>\n\n"
    
    sitemap_content += "</urlset>"
    
    with open(f"{OUTPUT_DIR}/sitemap.xml", 'w', encoding='utf-8') as f:
        f.write(sitemap_content)
    
    print("Updated sitemap.xml with all language versions")

def main():
    """主函数"""
    print("🌍 开始生成多语言静态页面...")
    
    # 创建输出目录
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # 加载翻译
    translations = load_translations()
    
    # 为每种语言生成页面
    for page in SOURCE_PAGES:
        for lang in LANGUAGES:
            generate_page(page, lang, translations)
    
    # 复制静态资源
    copy_assets()
    
    # 更新sitemap
    update_sitemap()
    
    print(f"\n✅ 多语言页面生成完成！")
    print(f"📁 输出目录: {OUTPUT_DIR}")
    print(f"🌐 支持语言: {', '.join(LANGUAGES)}")
    print(f"\n📖 URL结构:")
    print(f"   英文 (默认): {BASE_DOMAIN}/")
    print(f"   中文简体: {BASE_DOMAIN}/zh-cn/")
    print(f"   日文: {BASE_DOMAIN}/ja/")
    print(f"   等等...")

if __name__ == "__main__":
    main() 