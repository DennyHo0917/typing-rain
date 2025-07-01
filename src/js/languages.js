// 此模块负责动态加载多语言 JSON 文件，避免浏览器对 import assertion 的兼容性问题。
// 运行时会 fetch 对应语言包并注入到全局 window.languages。

export const languages = typeof window !== 'undefined' && window.languages ? window.languages : {};

const LOCALES = [
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
  'pt',
];

async function loadLocale(code) {
  try {
    const res = await fetch(`src/i18n/${code}.json`);
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    languages[code] = data;
    console.log(`[languages] Loaded ${code}`);
  } catch (e) {
    console.warn(`[languages] Failed to load ${code}:`, e);
  }
}

export async function initLanguages() {
  await Promise.all(LOCALES.map(loadLocale));
  if (typeof window !== 'undefined') {
    window.languages = languages;
  }
  if (typeof window.updateLanguage === 'function') {
    window.updateLanguage();
  }
}

// 自动加载
initLanguages();

// 在全局挂钩，提供兼容
if (typeof window !== 'undefined') {
  window.languages = languages;
  window.initLanguages = initLanguages;
}