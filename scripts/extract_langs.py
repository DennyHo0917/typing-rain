import re, os, json, pathlib, ast, textwrap

BACKUP_HTML = "index - 备份.html"
OUT_DIR = pathlib.Path("src/i18n")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# 读取备份 HTML
with open(BACKUP_HTML, "r", encoding="utf-8") as f:
    html = f.read()

# 捕获 const languages = { ... };
match = re.search(r"const\s+languages\s*=\s*\{(.*?)\};", html, re.S)
if not match:
    raise RuntimeError("未找到 languages 对象，请确认文件路径或内容")

js_obj = match.group(1)

# 简单去掉行注释，并解决未加引号的键
clean_lines = []
for line in js_obj.splitlines():
    line = re.sub(r"//.*$", "", line)  # 去掉 // 注释
    if not line.strip():
        continue
    # 为最外层键补引号：  en: {  =>  "en": {
    line = re.sub(r"^(\s*)([a-zA-Z0-9_\-]+)\s*:", r'\1"\2":', line)
    clean_lines.append(line)
clean_js = "\n".join(clean_lines)

# 用 Python literal_eval 解析成 dict
try:
    py_dict = ast.literal_eval("{" + clean_js + "}")
except Exception as e:
    raise RuntimeError("解析失败，请检查 JS->Python 转换规则") from e

# 写入各语言 JSON
for code, data in py_dict.items():
    out_file = OUT_DIR / f"{code}.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"写入 {out_file}")

print("全部语言包已导出至 src/i18n/")