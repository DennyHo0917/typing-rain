// SEO 工具模块

/**
 * 动态更新页面的 SEO 标签
 * @param {Object} seoData - SEO 数据对象
 */
export function updateSEOTags(seoData) {
  // 更新页面标题
  if (seoData.title) {
    document.title = seoData.title;
    
    // 更新 Open Graph 标题
    updateMetaTag('property', 'og:title', seoData.ogTitle || seoData.title);
    
    // 更新 Twitter 标题
    updateMetaTag('name', 'twitter:title', seoData.twitterTitle || seoData.title);
  }

  // 更新描述
  if (seoData.description) {
    updateMetaTag('name', 'description', seoData.description);
    updateMetaTag('property', 'og:description', seoData.ogDescription || seoData.description);
    updateMetaTag('name', 'twitter:description', seoData.twitterDescription || seoData.description);
  }

  // 更新关键词
  if (seoData.keywords) {
    updateMetaTag('name', 'keywords', seoData.keywords);
  }

  // 更新 canonical URL
  if (seoData.canonicalUrl) {
    updateLinkTag('canonical', seoData.canonicalUrl);
  }

  // 更新 Open Graph URL
  if (seoData.url) {
    updateMetaTag('property', 'og:url', seoData.url);
  }
}

/**
 * 更新或创建 meta 标签
 * @param {string} attribute - 属性名称 ('name' 或 'property')
 * @param {string} value - 属性值
 * @param {string} content - 内容
 */
function updateMetaTag(attribute, value, content) {
  let meta = document.querySelector(`meta[${attribute}="${value}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, value);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}

/**
 * 更新或创建 link 标签
 * @param {string} rel - rel 属性值
 * @param {string} href - href 属性值
 */
function updateLinkTag(rel, href) {
  let link = document.querySelector(`link[rel="${rel}"]`);
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', href);
}

/**
 * 更新结构化数据
 * @param {Object} structuredData - 结构化数据对象
 * @param {string} id - script 标签的 ID
 */
export function updateStructuredData(structuredData, id = 'structured-data') {
  let script = document.getElementById(id);
  
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(structuredData, null, 2);
}

/**
 * 获取所有支持的语言列表
 */
function getSupportedLanguages() {
  return ['en', 'zh-cn', 'zh-tw', 'ja', 'ko', 'de', 'fr', 'es', 'it', 'ru', 'pt'];
}

/**
 * 动态生成并更新hreflang标签
 * @param {string} currentLang - 当前语言
 */
export function updateHreflangTags(currentLang = 'en') {
  const baseUrl = 'https://www.typingrain.top';
  const pageType = detectPageType();
  const pagePath = pageType === 'index' ? '' : `/${pageType}.html`;
  
  // 移除现有的hreflang标签
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link => link.remove());
  
  // 生成新的hreflang标签
  const supportedLangs = getSupportedLanguages();
  const head = document.head;
  
  supportedLangs.forEach(lang => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = lang;
    link.href = `${baseUrl}${pagePath}${lang === 'en' ? '' : `?lang=${lang}`}`;
    head.appendChild(link);
  });
  
  // 添加x-default
  const defaultLink = document.createElement('link');
  defaultLink.rel = 'alternate';
  defaultLink.hreflang = 'x-default';
  defaultLink.href = `${baseUrl}${pagePath}`;
  head.appendChild(defaultLink);
}

/**
 * 为不同语言生成结构化数据
 * @param {string} lang - 语言代码
 */
export function generateStructuredDataForLanguage(lang) {
  const baseUrl = 'https://www.typingrain.top';
  const pageType = detectPageType();
  const pagePath = pageType === 'index' ? '' : `/${pageType}.html`;
  const langSuffix = lang === 'en' ? '' : `?lang=${lang}`;
  
  const pack = window.languages && window.languages[lang] ? window.languages[lang] : null;
  const pageSEO = pack && pack.pageSEO && pack.pageSEO[pageType] ? pack.pageSEO[pageType] : null;
  
  const gameStructuredData = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": (pack && pack.gameTitle) || "Typing Rain",
    "description": (pageSEO && pageSEO.description) || "Free online typing game to improve typing speed and accuracy",
    "url": `${baseUrl}${pagePath}${langSuffix}`,
    "image": `${baseUrl}/images/typing-rain-screenshot.jpg`,
    "author": {
      "@type": "Organization",
      "name": "Playful Cafe",
      "url": "https://playful.cafe"
    },
    "genre": ["Educational Game", "Typing Game", "Skill Game"],
    "gamePlatform": "Web Browser",
    "operatingSystem": "Any",
    "applicationCategory": "Game",
    "inLanguage": lang,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    },
    "availableLanguage": getSupportedLanguages().map(langCode => ({
      "@type": "Language",
      "name": getLanguageName(langCode),
      "alternateName": langCode
    }))
  };

  updateStructuredData(gameStructuredData, 'game-structured-data');
}

/**
 * 获取语言的显示名称
 * @param {string} langCode - 语言代码
 */
function getLanguageName(langCode) {
  const langNames = {
    'en': 'English',
    'zh-cn': '简体中文',
    'zh-tw': '繁體中文',
    'ja': '日本語',
    'ko': '한국어',
    'de': 'Deutsch',
    'fr': 'Français',
    'es': 'Español',
    'it': 'Italiano',
    'ru': 'Русский',
    'pt': 'Português'
  };
  return langNames[langCode] || langCode;
}

/**
 * 生成 FAQ 结构化数据
 */
export function generateFAQStructuredData() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to play Typing Rain?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Type the falling words before they reach the bottom of the screen. Press Enter or Space to submit your word. Build combos by typing words consecutively."
        }
      },
      {
        "@type": "Question",
        "name": "Is Typing Rain free to play?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Typing Rain is completely free to play. No registration or payment required."
        }
      },
      {
        "@type": "Question",
        "name": "What are the power-ups in Typing Rain?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Typing Rain features 6 power-ups: Slow Time, Precision Mode, Double Score, Shield, Combo Protect, and Word Refresh. Each has a specific key to activate."
        }
      },
      {
        "@type": "Question",
        "name": "How many game modes does Typing Rain have?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Typing Rain has three game modes: Level Mode (progressive difficulty), Practice Mode (customizable settings), and Tournament Mode (2-minute timed challenge)."
        }
      }
    ]
  };

  updateStructuredData(faqData, 'faq-structured-data');
}

/**
 * 获取翻译文本（连接到实际的翻译系统）
 * @param {string} key - 翻译键
 * @param {string} lang - 语言代码
 */
function getTranslatedText(key, lang) {
  if (typeof window !== 'undefined' && window.languages && window.languages[lang]) {
    const pack = window.languages[lang];
    return pack[key] || pack.gameTitle || "Typing Rain";
  }
  
  // 默认英文回退
  const defaults = {
    gameTitle: "Typing Rain",
    gameDescription: "Free online typing game to improve typing speed and accuracy"
  };
  
  return defaults[key] || "Typing Rain";
}

/**
 * 检测当前页面类型
 */
function detectPageType() {
  const pathname = window.location.pathname;
  if (pathname.includes('practice.html')) return 'practice';
  if (pathname.includes('tournament.html')) return 'tournament';
  return 'index';
}

/**
 * 为语言切换更新SEO信息
 * @param {string} lang - 语言代码
 */
export function updateSEOForLanguage(lang) {
  if (typeof window === 'undefined' || !window.languages) return;
  
  const pageType = detectPageType();
  const pack = window.languages[lang];
  if (!pack || !pack.pageSEO || !pack.pageSEO[pageType]) return;
  
  const seoData = pack.pageSEO[pageType];
  
  // 使用现有的updateSEOTags函数
  updateSEOTags({
    title: seoData.title,
    description: seoData.description,
    ogTitle: seoData.ogTitle,
    ogDescription: seoData.ogDescription,
    twitterTitle: seoData.ogTitle,
    twitterDescription: seoData.ogDescription,
    canonicalUrl: `https://www.typingrain.top${pageType === 'index' ? '' : `/${pageType}.html`}`,
    url: `https://www.typingrain.top${pageType === 'index' ? '' : `/${pageType}.html`}`
  });
  
  // 更新结构化数据
  generateStructuredDataForLanguage(lang);
  
  // 更新hreflang标签
  updateHreflangTags(lang);
}

// 暴露SEO模块到全局
if (typeof window !== 'undefined') {
  window.seoModule = {
    updateSEOTags,
    updateSEOForLanguage,
    updateStructuredData,
    updateHreflangTags,
    generateStructuredDataForLanguage,
    generateFAQStructuredData,
    initSEORouting: () => initSEORouting()
  };
}

/**
 * 监听路由变化，更新相应的 SEO 数据
 */
export function initSEORouting() {
  // 检查当前页面并设置相应的 SEO 数据
  const currentPage = window.location.pathname;
  
  if (currentPage.includes('practice.html')) {
    updateSEOForPracticePage();
  } else if (currentPage.includes('tournament.html')) {
    updateSEOForTournamentPage();
  } else {
    updateSEOForMainPage();
  }
}

/**
 * 为练习页面更新 SEO
 */
function updateSEOForPracticePage() {
  const seoData = {
    title: "Typing Rain - Practice Mode | Free Typing Practice",
    description: "Practice your typing skills with Typing Rain's Practice Mode. Customize duration, difficulty and speed. Perfect for daily typing practice.",
    keywords: "typing practice,practice mode,typing skills,custom typing,free typing practice",
    canonicalUrl: "https://www.typingrain.top/practice.html",
    url: "https://www.typingrain.top/practice.html"
  };
  
  updateSEOTags(seoData);
}

/**
 * 为锦标赛页面更新 SEO
 */
function updateSEOForTournamentPage() {
  const seoData = {
    title: "Typing Rain - Tournament Mode | Competitive Typing Challenge",
    description: "Challenge yourself in Typing Rain Tournament Mode with 2-minute timed sessions. Compete for leaderboard rankings.",
    keywords: "typing tournament,competitive typing,typing challenge,leaderboard,timed typing",
    canonicalUrl: "https://www.typingrain.top/tournament.html",
    url: "https://www.typingrain.top/tournament.html"
  };
  
  updateSEOTags(seoData);
}

/**
 * 为主页更新 SEO
 */
function updateSEOForMainPage() {
  const seoData = {
    title: "Typing Rain - Modern Word Game | Online Typing Practice",
    description: "Typing Rain - Free online typing game to improve your typing speed and accuracy. Practice with falling words, track your WPM in real-time.",
    keywords: "typing game,typing practice,word game,online game,typing speed,WPM,typing skills",
    canonicalUrl: "https://www.typingrain.top/",
    url: "https://www.typingrain.top/"
  };
  
  updateSEOTags(seoData);
}

// 页面加载时初始化 SEO
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initSEORouting();
    generateFAQStructuredData();
  });
} 