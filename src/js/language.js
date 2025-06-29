// Placeholder for language detection and switching
import { languages as langs } from './languages.js';
export const languages = langs;

// 先保存旧实现（若有）
const legacySwitch = typeof window !== 'undefined' && typeof window.switchLanguage === 'function' ? window.switchLanguage : null;

export function switchLanguage(lang) {
  if (legacySwitch) {
    legacySwitch(lang);
  } else {
    // fallback：直接修改 currentLanguage 并触发更新
    if (languages[lang]) {
      window.currentLanguage = lang;
      if (typeof window.updateLanguage === 'function') {
        window.updateLanguage();
      }
    }
  }
}

// 将新版实现挂载到全局，覆盖旧的，但内部仍会调用 legacySwitch（若存在）
if (typeof window !== 'undefined') {
  window.switchLanguage = switchLanguage;
} 