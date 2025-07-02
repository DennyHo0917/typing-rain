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
  'fr',
  'it',
  'ru',
  'pt'
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
  let savedLang;
  try {
    savedLang = localStorage.getItem('typingRainLanguage');
  } catch (e) {
    console.warn('localStorage not available:', e.message);
    savedLang = null;
  }
  
  const browserDetected = detectBrowserLanguage();
  
  // 如果保存的语言有效且不是错误的默认设置，使用它
  if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
    return savedLang;
  }
  
  return browserDetected;
}

// 安全的 localStorage 设置函数
export function setLanguagePreference(lang) {
  try {
    localStorage.setItem('typingRainLanguage', lang);
  } catch (e) {
    console.warn('Cannot save language preference:', e.message);
    // 可以使用 sessionStorage 或 cookie 作为降级
    try {
      sessionStorage.setItem('typingRainLanguage', lang);
    } catch (e2) {
      console.warn('No storage available for language preference');
    }
  }
}

// 先保存旧实现（若有）
const legacySwitch = typeof window !== 'undefined' && typeof window.switchLanguage === 'function' ? window.switchLanguage : null;

// 删除所有 saveLanguagePreference 调用，统一使用 setLanguagePreference
export function switchLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    console.warn(`Unsupported language: ${lang}`);
    return;
  }
  
  if (legacySwitch) {
    legacySwitch(lang);
  }
  
  // 更新语言设置
  window.currentLanguage = lang;
  setLanguagePreference(lang);
  
  // 更新URL参数以支持SEO和书签
  const url = new URL(window.location);
  if (lang === 'en') {
    // 英文作为默认语言，移除lang参数
    url.searchParams.delete('lang');
  } else {
    // 其他语言添加lang参数
    url.searchParams.set('lang', lang);
  }
  
  // 使用replaceState避免在浏览器历史中创建新条目
  window.history.replaceState({}, '', url.toString());
  
  // 更新页面内容
  if (typeof window.updateLanguage === 'function') {
    window.updateLanguage();
  }
  
  closeAllMenus();
}

export function chooseMode(mode) {
  const currentLang = window.currentLanguage || getInitialLanguage();
  setLanguagePreference(currentLang);
  
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
  
  // 构建完整URL并添加语言参数（英文除外）
  const url = new URL(targetUrl, window.location.href);
  if (currentLang !== 'en') {
    url.searchParams.set('lang', currentLang);
  }
  
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

/**
 * 智能语言重定向 - 用于SEO友好的自动语言检测
 */
function handleAutoLanguageRedirect() {
  const urlLang = getLanguageFromURL();
  
  // 如果URL中已有语言参数，或者是搜索引擎爬虫，不进行重定向
  if (urlLang || isSearchEngineCrawler()) {
    return false;
  }
  
  const detectedLang = detectBrowserLanguage();
  
  // 如果检测到的语言不是英文（默认），则重定向到对应语言版本
  if (detectedLang !== 'en') {
    const url = new URL(window.location);
    url.searchParams.set('lang', detectedLang);
    
    // 使用replace避免在浏览器历史中产生额外记录
    window.location.replace(url.toString());
    return true;
  }
  
  return false;
}

/**
 * 检测是否为搜索引擎爬虫
 */
function isSearchEngineCrawler() {
  const userAgent = navigator.userAgent.toLowerCase();
  const crawlers = [
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
    'yandexbot', 'sogou', 'facebook', 'twitter', 'linkedinbot'
  ];
  
  return crawlers.some(crawler => userAgent.includes(crawler));
}

// 初始化语言系统
export function initLanguageSystem() {
  // 设置初始语言 - 优先级：URL参数 > localStorage > 浏览器语言
  if (typeof window !== 'undefined') {
    // 首先尝试智能重定向（仅针对真实用户）
    if (handleAutoLanguageRedirect()) {
      return; // 如果重定向了，停止后续处理
    }
    
    const urlLang = getLanguageFromURL();
    const initialLang = urlLang || getInitialLanguage();
    
    window.currentLanguage = window.currentLanguage || initialLang;
    
    if (urlLang) {
      setLanguagePreference(urlLang);
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