// Enhanced language management system with browser detection and persistence
import { languages as langs } from './languages.js';
export const languages = langs;

// 支持的语言列表（硬编码，避免异步加载时序问题）
const SUPPORTED_LANGUAGES = [
  'en',
  'zh-tw', 
  'zh-cn',
  'ja',
  'ko',
  'es',
  'de',
  'fr'
];

// 获取浏览器语言偏好
function detectBrowserLanguage() {
  const supportedLangs = SUPPORTED_LANGUAGES;
  const browserLang = navigator.language || navigator.userLanguage || 'en';
  
  // 直接匹配（如 'zh-CN'）
  if (supportedLangs.includes(browserLang)) {
    return browserLang;
  }
  
  // 语言代码匹配（如 'zh-CN' -> 'zh-cn'）
  const lowerBrowserLang = browserLang.toLowerCase();
  if (supportedLangs.includes(lowerBrowserLang)) {
    return lowerBrowserLang;
  }
  
  // 主语言匹配（如 'zh-CN' -> 'zh-cn' 或 'zh-tw'）
  const primaryLang = browserLang.split('-')[0].toLowerCase();
  const matchedLang = supportedLangs.find(lang => lang.startsWith(primaryLang));
  if (matchedLang) {
    return matchedLang;
  }
  
  // 默认英文
  return 'en';
}

// 从localStorage获取保存的语言，如果没有则检测浏览器语言
function getInitialLanguage() {
  const savedLang = localStorage.getItem('typingRainLanguage');
  const browserDetected = detectBrowserLanguage();
  
  // 如果保存的语言有效且不是错误的默认设置，使用它
  if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
    // 特殊处理：如果保存的是'en'但浏览器检测到的不是英文，可能是之前错误保存的
    // 清除并重新检测（这样用户可以获得正确的浏览器语言）
    if (savedLang === 'en' && browserDetected !== 'en' && !browserDetected.startsWith('en')) {
      localStorage.removeItem('typingRainLanguage');
      return browserDetected;
    }
    return savedLang;
  }
  
  return browserDetected;
}

// 保存语言设置到localStorage
function saveLanguagePreference(lang) {
  localStorage.setItem('typingRainLanguage', lang);
}

// 先保存旧实现（若有）
const legacySwitch = typeof window !== 'undefined' && typeof window.switchLanguage === 'function' ? window.switchLanguage : null;

export function switchLanguage(lang) {
  if (legacySwitch) {
    legacySwitch(lang);
  } else {
    // fallback：直接修改 currentLanguage 并触发更新
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      window.currentLanguage = lang;
      saveLanguagePreference(lang); // 保存到localStorage
      if (typeof window.updateLanguage === 'function') {
        window.updateLanguage();
      }
    }
  }
  
  // 关闭语言菜单
  closeAllMenus();
}

// 模式切换功能（保持语言设置）
export function chooseMode(mode) {
  // 保存当前语言设置
  const currentLang = window.currentLanguage || getInitialLanguage();
  saveLanguagePreference(currentLang);
  
  // 构建目标URL
  let targetUrl;
  switch (mode) {
    case 'level':
      targetUrl = window.location.pathname.includes('/') ? '../index.html' : 'index.html';
      break;
    case 'practice':
      targetUrl = window.location.pathname.includes('/') ? '../practice.html' : 'practice.html';
      break;
    case 'tournament':
      targetUrl = window.location.pathname.includes('/') ? '../tournament.html' : 'tournament.html';
      break;
    default:
      targetUrl = 'index.html';
  }
  
  // 在URL中添加语言参数，确保新页面可以立即使用正确的语言
  const url = new URL(targetUrl, window.location.href);
  url.searchParams.set('lang', currentLang);
  
  // 跳转到目标页面
  window.location.href = url.toString();
}

// 关闭所有下拉菜单
function closeAllMenus() {
  const langMenu = document.getElementById('lang-menu');
  const modeMenu = document.getElementById('mode-menu');
  
  if (langMenu) langMenu.classList.remove('show');
  if (modeMenu) modeMenu.classList.remove('show');
}

// 切换语言菜单显示状态
export function toggleLanguageMenu() {
  const menu = document.getElementById('lang-menu');
  const modeMenu = document.getElementById('mode-menu');
  
  if (menu) {
    menu.classList.toggle('show');
    // 关闭模式菜单
    if (modeMenu) modeMenu.classList.remove('show');
  }
}

// 切换模式菜单显示状态
export function toggleModeMenu() {
  const menu = document.getElementById('mode-menu');
  const langMenu = document.getElementById('lang-menu');
  
  if (menu) {
    menu.classList.toggle('show');
    // 关闭语言菜单
    if (langMenu) langMenu.classList.remove('show');
  }
}

// 从URL参数获取语言设置
function getLanguageFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const langFromUrl = urlParams.get('lang');
  
  if (langFromUrl && SUPPORTED_LANGUAGES.includes(langFromUrl)) {
    return langFromUrl;
  }
  
  return null;
}

// 初始化语言系统
export function initLanguageSystem() {
  // 设置初始语言 - 优先级：URL参数 > localStorage > 浏览器语言
  if (typeof window !== 'undefined') {
    const urlLang = getLanguageFromURL();
    const initialLang = urlLang || getInitialLanguage();
    
    window.currentLanguage = window.currentLanguage || initialLang;
    
    // 如果URL中有语言参数，保存到localStorage
    if (urlLang) {
      saveLanguagePreference(urlLang);
    }
    
    // 添加全局点击事件监听，点击外部时关闭菜单
    document.addEventListener('click', (event) => {
      const langSwitcher = document.querySelector('.language-switcher');
      const modeSwitcher = document.querySelector('.mode-switcher');
      
      // 检查点击是否在语言切换器或模式切换器内部
      const isInsideLangSwitcher = langSwitcher && langSwitcher.contains(event.target);
      const isInsideModeSwitcher = modeSwitcher && modeSwitcher.contains(event.target);
      
      if (!isInsideLangSwitcher && !isInsideModeSwitcher) {
        closeAllMenus();
      }
    });
    
    // 触发初始语言更新
    if (typeof window.updateLanguage === 'function') {
      window.updateLanguage();
    }
  }
}

// 将新版实现挂载到全局
if (typeof window !== 'undefined') {
  window.switchLanguage = switchLanguage;
  window.toggleLanguageMenu = toggleLanguageMenu;
  window.toggleModeMenu = toggleModeMenu;
  window.closeAllMenus = closeAllMenus;
  window.chooseMode = chooseMode;
} 