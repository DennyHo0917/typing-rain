// 隐私政策与本地数据管理模块
import { gameState } from './gameState.js';

export function showPrivacyPolicy() {
  const policyScreen = document.getElementById('privacy-policy');
  const gameOver = document.getElementById('game-over');
  const startScreen = document.getElementById('game-start');
  // 更新日期
  const dateEl = document.getElementById('privacy-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  if (policyScreen) policyScreen.style.display = 'flex';
  if (gameOver) gameOver.style.display = 'none';
  if (startScreen) startScreen.style.display = 'none';
}

export function closePrivacyPolicy() {
  const policyScreen = document.getElementById('privacy-policy');
  if (policyScreen) policyScreen.style.display = 'none';
  const gameOver = document.getElementById('game-over');
  const startScreen = document.getElementById('game-start');
  if (gameState.gameRunning && gameState.gameStarted) return;
  if (!gameState.gameStarted && startScreen) {
    startScreen.style.display = 'flex';
  } else if (gameOver) {
    gameOver.style.display = 'flex';
  }
}

export function clearLocalData() {
  const confirmMsg = 'Clear the spelling list and read-aloud preference saved in this browser?';
  const successMsg = 'Your local spelling practice data has been cleared.';
  if (confirm(confirmMsg)) {
    localStorage.removeItem('typingRainSpellingWords');
    localStorage.removeItem('typingRainReadWords');
    alert(successMsg);
    closePrivacyPolicy();
  }
}

// 全局挂钩
if (typeof window !== 'undefined') {
  window.showPrivacyPolicy = showPrivacyPolicy;
  window.closePrivacyPolicy = closePrivacyPolicy;
  window.clearLocalData = clearLocalData;
  // legacy aliases for existing HTML attributes
  window.showPrivacyPolicyLegacy = showPrivacyPolicy;
  window.closePrivacyPolicyLegacy = closePrivacyPolicy;
  window.clearLocalDataLegacy = clearLocalData;
  window.privacyBridge = { showPrivacyPolicy, closePrivacyPolicy, clearLocalData };
}
