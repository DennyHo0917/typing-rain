// 屏幕管理桥接模块

/* 旧桥接保留但已弃用
const bind = (name) =>
  typeof window !== 'undefined' && typeof window[name] === 'function' ? window[name] : () => {};

export const showLevelStart = bind('showLevelStart');
export const showCongratulations = bind('showCongratulations');
export const showNameInput = bind('showNameInput');
export const skipNameInput = bind('skipNameInput');
export const showLeaderboard = bind('showLeaderboard');
export const closeLeaderboard = bind('closeLeaderboard');
export const showPrivacyPolicy = bind('showPrivacyPolicy');
export const closePrivacyPolicy = bind('closePrivacyPolicy');

export const screens = {
  showLevelStart,
  showCongratulations,
  showNameInput,
  skipNameInput,
  showLeaderboard,
  closeLeaderboard,
  showPrivacyPolicy,
  closePrivacyPolicy,
};

if (typeof window !== 'undefined') {
  window.screensBridge = screens;
}
*/

// 屏幕与 UI 管理模块（实现版）

import { dom } from './domRefs.js';
import { gameState, resetGameState } from './gameState.js';
import { initializeWords } from './gameLoop.js';
import { isHighScore, addToLeaderboard } from './leaderboard.js';
import { updateStats } from './rendering.js';

function getCtx() {
  if (!dom.canvas) return null;
  return dom.canvas.getContext('2d');
}

// ---------- 关卡提示 ----------
export function showLevelStart() {
  const ctx = getCtx();
  if (!ctx) return;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, dom.canvas.width, dom.canvas.height);

  ctx.fillStyle = '#00f5ff';
  ctx.font = '48px "Orbitron", monospace';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#00f5ff';
  ctx.shadowBlur = 20;
  ctx.fillText(`LEVEL ${gameState.level}`, dom.canvas.width / 2, dom.canvas.height / 2);

  ctx.font = '24px "Orbitron", monospace';
  ctx.fillStyle = '#ffffff';
  let desc = '';
  if (gameState.level === 1) desc = 'Easy words with 10% medium words';
  else if (gameState.level === 2) desc = 'Medium words with 10% hard words';
  else desc = 'All hard words - Final challenge!';
  ctx.fillText(desc, dom.canvas.width / 2, dom.canvas.height / 2 + 60);
  ctx.restore();
}

// ---------- 通关祝贺 ----------
export function showCongratulations() {
  const ctx = getCtx();
  if (!ctx) return;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.8)';
  ctx.fillRect(0, 0, dom.canvas.width, dom.canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, dom.canvas.width, 0);
  gradient.addColorStop(0, '#ff6b6b');
  gradient.addColorStop(0.2, '#feca57');
  gradient.addColorStop(0.4, '#48dbfb');
  gradient.addColorStop(0.6, '#ff9ff3');
  gradient.addColorStop(0.8, '#54a0ff');
  gradient.addColorStop(1, '#5f27cd');

  ctx.fillStyle = gradient;
  ctx.font = '64px "Orbitron", monospace';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 30;
  ctx.fillText('CONGRATULATIONS!', dom.canvas.width / 2, dom.canvas.height / 2 - 50);

  ctx.fillStyle = '#ffffff';
  ctx.font = '32px "Orbitron", monospace';
  ctx.fillText('You completed all levels!', dom.canvas.width / 2, dom.canvas.height / 2 + 20);

  ctx.font = '24px "Orbitron", monospace';
  ctx.fillText(`Final Score: ${gameState.score}`, dom.canvas.width / 2, dom.canvas.height / 2 + 70);
  ctx.restore();
}

// ---------- 游戏控制 ----------
export function startGame() {
  gameState.gameStarted = true;
  document.getElementById('game-start')?.style && (document.getElementById('game-start').style.display = 'none');
  if (dom.input) {
    dom.input.disabled = false;
    dom.input.focus();
  }
  initializeWords();
}

export function endGame() {
  gameState.gameRunning = false;
  // 更新最终统计
  document.getElementById('final-score').textContent = gameState.score;
  document.getElementById('final-level').textContent = gameState.level;
  document.getElementById('final-wpm').textContent = document.getElementById('wpm').textContent;
  document.getElementById('final-accuracy').textContent = document.getElementById('accuracy').textContent;
  document.getElementById('final-missed').textContent = gameState.missedWords;

  if (isHighScore(gameState.score)) {
    showNameInput();
  } else {
    document.getElementById('game-over').style.display = 'flex';
  }
}

export function restartGame() {
  resetGameState();
  if (dom.input) {
    dom.input.value = '';
    dom.input.disabled = true;
  }
  // 隐藏所有覆盖层
  ['game-over', 'name-input', 'leaderboard', 'privacy-policy'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  document.getElementById('game-start').style.display = 'flex';
  updateStats();
}

// ---------- 名字输入 ----------
export function showNameInput() {
  document.getElementById('name-input-score').textContent = gameState.score;
  document.getElementById('name-input').style.display = 'flex';
  document.getElementById('player-name-input').focus();
}

export function submitScore() {
  const name = document.getElementById('player-name-input').value.trim();
  const wpm = document.getElementById('wpm').textContent;
  const acc = document.getElementById('accuracy').textContent;
  addToLeaderboard(name, gameState.score, gameState.level, wpm, acc);
  document.getElementById('name-input').style.display = 'none';
  document.getElementById('game-over').style.display = 'flex';
  document.getElementById('player-name-input').value = '';
}

export function skipNameInput() {
  document.getElementById('name-input').style.display = 'none';
  document.getElementById('game-over').style.display = 'flex';
}

// 其余屏幕函数从其他模块导入/复用
import { showLeaderboard, closeLeaderboard } from './leaderboard.js';
import { showPrivacyPolicy, closePrivacyPolicy } from './privacy.js';

export const screens = {
  showLevelStart,
  showCongratulations,
  startGame,
  endGame,
  restartGame,
  showNameInput,
  submitScore,
  skipNameInput,
  showLeaderboard,
  closeLeaderboard,
  showPrivacyPolicy,
  closePrivacyPolicy,
};

// 挂载到全局，兼容旧 HTML 内联 onClick
if (typeof window !== 'undefined') {
  Object.assign(window, screens);
  // legacy aliases
  window.showLevelStart = showLevelStart;
  window.showCongratulations = showCongratulations;
  window.startGame = startGame;
  window.endGame = endGame;
  window.restartGame = restartGame;
  window.showNameInput = showNameInput;
  window.submitScore = submitScore;
  window.skipNameInput = skipNameInput;
  window.screensBridge = screens;
} 