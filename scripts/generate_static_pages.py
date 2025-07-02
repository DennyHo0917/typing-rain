import os
import re
import json
import pathlib
from typing import Dict

TEMPLATE_FILE = pathlib.Path("index.html")  # 默认英文模板
I18N_DIR = pathlib.Path("src/i18n")
OUTPUT_DIR = pathlib.Path("dist")

# 创建输出目录
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

TITLE_RE = re.compile(r"<title>.*?</title>", re.I | re.S)
DESC_RE = re.compile(r'<meta\s+name="description"[^>]*?>', re.I)
OG_TITLE_RE = re.compile(r'<meta\s+property="og:title"[^>]*?>', re.I)
OG_DESC_RE = re.compile(r'<meta\s+property="og:description"[^>]*?>', re.I)
TW_TITLE_RE = re.compile(r'<meta\s+name="twitter:title"[^>]*?>', re.I)
TW_DESC_RE = re.compile(r'<meta\s+name="twitter:description"[^>]*?>', re.I)
HTML_LANG_RE = re.compile(r'<html\s+lang="[^"]+"', re.I)


def replace_attr(tag_str: str, attr_name: str, new_value: str) -> str:
    """通用方法：替换/添加属性值"""
    if attr_name not in tag_str:
        # 简易处理：直接插入 (不严谨，但足够)
        return tag_str.replace("<meta", f'<meta {attr_name}="{new_value}"', 1)
    return re.sub(rf'{attr_name}="[^"]*"', f'{attr_name}="{new_value}"', tag_str)


def patch_html(html: str, seo: Dict[str, str], lang_code: str) -> str:
    """根据 SEO 信息和语言代码替换模板内容"""
    # 1) <html lang="xx">
    html = HTML_LANG_RE.sub(f'<html lang="{lang_code}"', html, count=1)

    # 2) <title>
    if seo.get("title"):
        html = TITLE_RE.sub(f"<title>{seo['title']}</title>", html, count=1)

    # 3) meta description
    if seo.get("description"):
        match = DESC_RE.search(html)
        if match:
            html = html[:match.start()] + replace_attr(match.group(), "content", seo["description"]) + html[match.end():]

    # 4) og:title
    if seo.get("ogTitle"):
        match = OG_TITLE_RE.search(html)
        if match:
            html = html[:match.start()] + replace_attr(match.group(), "content", seo["ogTitle"]) + html[match.end():]
        # twitter:title 同步修改
        match = TW_TITLE_RE.search(html)
        if match:
            html = html[:match.start()] + replace_attr(match.group(), "content", seo["ogTitle"]) + html[match.end():]

    # 5) og:description & twitter:description
    if seo.get("ogDescription"):
        match = OG_DESC_RE.search(html)
        if match:
            html = html[:match.start()] + replace_attr(match.group(), "content", seo["ogDescription"]) + html[match.end():]
        match = TW_DESC_RE.search(html)
        if match:
            html = html[:match.start()] + replace_attr(match.group(), "content", seo["ogDescription"]) + html[match.end():]

    return html


def main():
    template_html = TEMPLATE_FILE.read_text(encoding="utf-8")

    for json_file in I18N_DIR.glob("*.json"):
        lang_code = json_file.stem  # 文件名即语言代码
        data = json.loads(json_file.read_text(encoding="utf-8"))
        seo = data.get("pageSEO", {}).get("index", {})
        if not seo:
            print(f"[WARN] {lang_code} 缺少 pageSEO.index，跳过")
            continue

        patched = patch_html(template_html, seo, lang_code)

        # 输出路径： dist/<lang>/index.html
        out_dir = OUTPUT_DIR / lang_code
        out_dir.mkdir(parents=True, exist_ok=True)
        out_file = out_dir / "index.html"
        out_file.write_text(patched, encoding="utf-8")
        print(f"生成 {out_file}")

    print("全部语言静态页面已生成完毕 → dist/")


if __name__ == "__main__":
    main() 