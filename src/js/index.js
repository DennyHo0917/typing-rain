// Entry point for modular Typing Rain (scaffolding phase)
// This file currently bootstraps the legacy global functions while we migrate code.

// Import empty module stubs to start building the new structure. These imports have
// no runtime effect yet but allow us to progressively move logic file-by-file.
import './gameState.js';
import './wordDatabase.js';
import './powerUps.js';
import './rendering.js';
import './audio.js';
import './language.js';
import './domRefs.js';
import './screens.js';
import './leaderboard.js';
import './share.js';
import './words.js';
import './input.js';
import './privacy.js';
import './seo.js'; // 导入SEO模块确保全局可用
import './sitemap.js'; // 导入sitemap生成器
import './components/navigation.js'; // 导入导航组件
import './performance/particlePool.js'; // 导入粒子对象池
import './performance/eventManager.js'; // 导入事件管理器
import './utils/errorHandler.js'; // 导入错误处理系统
import { initLanguageSystem } from './ui/languageUI.js';
import { initializeWords, gameLoop } from './gameLoop.js';
import { initBackgroundParticles, resizeCanvas } from './rendering.js';
import { initAudio } from './audio.js';
import { generateFAQStructuredData, generateStructuredDataForLanguage, updateHreflangTags } from './seo.js';
import { setupGameEvents } from './performance/eventManager.js';
import { initErrorHandling } from './utils/errorHandler.js';

// When the DOM is ready, call the existing global initGame so the current
// monolithic script continues to work. As we migrate functions, this call will
// eventually be replaced by an internal bootstrap.

document.addEventListener('DOMContentLoaded', () => {
  // 首先初始化错误处理和兼容性检查
  initErrorHandling();
  
  // Framework initializations (language, audio, rendering, SEO, events)
  initLanguageSystem();
  initAudio();
  resizeCanvas();
  initBackgroundParticles();
  setupGameEvents(); // 设置优化的事件管理
  
  // 初始化SEO结构化数据和hreflang标签
  generateFAQStructuredData();
  const currentLang = window.currentLanguage || 'en';
  generateStructuredDataForLanguage(currentLang);
  updateHreflangTags(currentLang);

  // 移除这两行，让游戏在用户点击"开始游戏"时才初始化
  // initializeWords();
  // requestAnimationFrame(gameLoop);

  // Practice mode specific UI tweaks
  if (window.currentMode === 'practice') {
    document.querySelectorAll('.stat-label').forEach((label) => {
      const key = label.textContent.trim().toUpperCase();
      if (['LEVEL', 'MISSED', 'LIVES'].includes(key)) {
        const item = label.closest('.stat-item');
        if (item) item.style.display = 'none';
      }
    });
    // Add TIME stat if not exists
    let timeItem = document.querySelector('.stat-item.time');
    if (!timeItem) {
      const statWrapper = document.querySelector('.stats');
      if (statWrapper) {
        timeItem = document.createElement('div');
        timeItem.className = 'stat-item time';
        timeItem.innerHTML = '<div class="stat-label">TIME</div><div class="stat-value" id="practice-time">3:00</div>';
        statWrapper.prepend(timeItem);
      }
    }
    // update loop
    setInterval(() => {
      const now = Date.now();
      let end = window.gameState.practiceEndTime;
      if (!end) {
        const sel = document.getElementById('practice-duration-select');
        const minutes = sel ? parseInt(sel.value, 10) || 3 : window.gameState.practiceDuration / 60;
        end = Date.now() + minutes * 60 * 1000;
      }
      let remaining = Math.max(0, Math.floor((end - now) / 1000));
      const min = String(Math.floor(remaining / 60)).padStart(1, '0');
      const sec = String(remaining % 60).padStart(2, '0');
      const el = document.getElementById('practice-time');
      if (el) el.textContent = `${min}:${sec}`;
    }, 1000);

    const speedRange = document.getElementById('practice-speed-range');
    const speedLabel = document.getElementById('practice-speed-label');
    if (speedRange && speedLabel) {
      const updateLabel = () => {
        speedLabel.textContent = speedRange.value + 'x';
        // 确保gameState.practiceSpeed与滑块值同步
        if (window.gameState) {
          window.gameState.practiceSpeed = parseFloat(speedRange.value) || 1;
        }
      };
      speedRange.addEventListener('input', updateLabel);
      updateLabel(); // 初始化时调用一次，确保gameState同步
    }
  }

  // Tournament mode：显示倒计时
  if (window.currentMode === 'tournament') {
    // 添加 TIME 统计如果不存在
    let timeItem = document.querySelector('.stat-item.time');
    if (!timeItem) {
      const statWrapper = document.querySelector('.stats');
      if (statWrapper) {
        timeItem = document.createElement('div');
        timeItem.className = 'stat-item time';
        const totalSec = window.gameState.tournamentDuration || 120;
        const minInit = String(Math.floor(totalSec / 60));
        const secInit = String(totalSec % 60).padStart(2, '0');
        timeItem.innerHTML = `<div class="stat-label">TIME</div><div class="stat-value" id="tournament-time">${minInit}:${secInit}</div>`;
        statWrapper.prepend(timeItem);
      }
    }

    setInterval(() => {
      const now = Date.now();
      const end = window.gameState.tournamentEndTime;
      if (!end) return;
      let remaining = Math.max(0, Math.floor((end - now) / 1000));
      const min = String(Math.floor(remaining / 60));
      const sec = String(remaining % 60).padStart(2, '0');
      const el = document.getElementById('tournament-time');
      if (el) el.textContent = `${min}:${sec}`;
    }, 1000);
  }

  // --- Tournament specific: override start-description text ---
  if (window.currentMode === 'tournament') {
    const descEl = document.querySelector('.start-description');
    if (descEl) {
      descEl.innerHTML = `
        <strong>Tournament Rules</strong><br>
        • Each run lasts <strong>2&nbsp;minutes</strong>.<br>
        • Total score = 0.6×typed points + 10×WPM + 5×accuracy − 20×misses.<br>
        • Rankings are based on highest total score.<br>
        • Challenge yourself and compete for the top spot on the leaderboard!`;
    }
  }
});