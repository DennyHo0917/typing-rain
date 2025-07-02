@echo off
echo 🌍 生成多语言静态页面...
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: Python未安装或不在PATH中
    echo 请安装Python 3.7+ 并确保python命令可用
    pause
    exit /b 1
)

REM 运行多语言生成器
echo 正在生成多语言页面...
python scripts/generate_multilang_pages.py

if errorlevel 1 (
    echo ❌ 生成失败
    pause
    exit /b 1
)

echo.
echo ✅ 多语言页面生成完成！
echo 📁 输出目录: dist/
echo.
echo 🚀 接下来：
echo 1. 检查 dist/ 目录中的生成文件
echo 2. 将 dist/ 目录内容部署到服务器
echo 3. 配置服务器支持多语言路由
echo.

pause 