// 隐私政策与本地数据管理模块
import { languages } from './languages.js';
import { gameState } from './gameState.js';

function getLangPack() {
  const current = window.currentLanguage || 'en';
  return languages[current] || {};
}

export function showPrivacyPolicy() {
  const lang = getLangPack();
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
  const lang = getLangPack();
  const confirmMsg =
    lang.clearDataConfirm ||
    'Are you sure you want to clear all your local data? This will permanently delete your leaderboard scores and cannot be undone.';
  const successMsg =
    lang.dataCleared || 'Your local data has been cleared successfully.';
  if (confirm(confirmMsg)) {
    localStorage.removeItem('typingRainLeaderboard');
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