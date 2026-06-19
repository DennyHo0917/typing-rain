// Entry point for modular Typing Rain (scaffolding phase)
// This file currently bootstraps the legacy global functions while we migrate code.

// Import empty module stubs to start building the new structure. These imports have
// no runtime effect yet but allow us to progressively move logic file-by-file.
import './gameState.js';
import { getPageLocale } from './pageLocale.js';
import './wordDatabase.js';
import './powerUps.js';
import './rendering.js';
import './audio.js';
import './domRefs.js';
import './screens.js';
import './spellingMode.js';
import './words.js';
import './input.js';
import './privacy.js';
import './performance/particlePool.js';
import './performance/eventManager.js'; // 导入事件管理器
import './utils/errorHandler.js'; // 导入错误处理系统
import { initBackgroundParticles, resizeCanvas } from './rendering.js';
import { initAudio } from './audio.js';
import { setupGameEvents } from './performance/eventManager.js';
import { initErrorHandling } from './utils/errorHandler.js';

// When the DOM is ready, call the existing global initGame so the current
// monolithic script continues to work. As we migrate functions, this call will
// eventually be replaced by an internal bootstrap.

document.addEventListener('DOMContentLoaded', () => {
  // 首先初始化错误处理和兼容性检查
  initErrorHandling();
  
  // Framework initializations (language, audio, rendering, SEO, events)
  window.currentLanguage = getPageLocale();
  initAudio();
  resizeCanvas();
  initBackgroundParticles();
  setupGameEvents(); // 设置优化的事件管理
  
  // 移除这两行，让游戏在用户点击"开始游戏"时才初始化
  // initializeWords();
  // requestAnimationFrame(gameLoop);

});
