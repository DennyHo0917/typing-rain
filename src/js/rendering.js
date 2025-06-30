// 渲染相关函数桥接模块。
// 注意：所有渲染函数均在此模块实现，避免重复声明。

import { gameState } from './gameState.js';
import { usePowerUp } from './powerUps.js';
import { dom } from './domRefs.js';
import { getLocalizedPowerUpName } from './powerUps.js';

// -------- Particle systems ---------

export class Particle {
  constructor(x, y, color, size = 2, velocity = null) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.velocity = velocity || { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4 };
    this.life = 1;
    this.decay = 0.02;
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.life -= this.decay;
    this.velocity.x *= 0.99;
    this.velocity.y *= 0.99;
  }

  draw(context) {
    context.save();
    context.globalAlpha = this.life;
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}

export class BackgroundParticle {
  constructor() {
    // 依赖全局 canvas/particlesCtx（仍由 index.html 创建）
    const canvas = document.getElementById('game-canvas');
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.velocity = {
      x: (Math.random() - 0.5) * 0.5,
      y: Math.random() * 0.5 + 0.1,
    };
    this.opacity = Math.random() * 0.5 + 0.1;
  }

  update() {
    const canvas = document.getElementById('game-canvas');
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.y > canvas.height) {
      this.y = -10;
      this.x = Math.random() * canvas.width;
    }
    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
  }

  draw() {
    const particlesCanvas = document.getElementById('particles-canvas');
    if (!particlesCanvas) return;
    const particlesCtx = particlesCanvas.getContext('2d');
    particlesCtx.save();
    particlesCtx.globalAlpha = this.opacity;
    particlesCtx.fillStyle = '#00f5ff';
    particlesCtx.beginPath();
    particlesCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    particlesCtx.fill();
    particlesCtx.restore();
  }
}

// Expose to global for legacy use
if (typeof window !== 'undefined') {
  window.Particle = Particle;
  window.BackgroundParticle = BackgroundParticle;
}

// 重新实现画布尺寸调整，摆脱对旧全局变量依赖
export function resizeCanvas() {
  const container = document.getElementById('game-container');
  if (!container || !dom.canvas || !dom.particlesCanvas) return;

  const { clientWidth, clientHeight } = container;
  dom.canvas.width = clientWidth;
  dom.canvas.height = clientHeight;
  dom.particlesCanvas.width = clientWidth;
  dom.particlesCanvas.height = clientHeight;
}

// 获取本地化道具名称
// 移除这里的getLocalizedPowerUpName函数定义
// function getLocalizedPowerUpName(key) { ... } // 删除这个函数

// 更新道具显示 - 固定位置映射
export function updatePowerUpDisplay() {
  const grid = document.getElementById('power-ups-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const slotLabels = ['⏰', '🎯', '💎', '🛡️', '🌟', '🔄'];
  const slotKeys = ['slowTime', 'precisionMode', 'doubleScore', 'shield', 'comboProtect', 'refreshWords'];

  for (let i = 0; i < 6; i++) {
    const slot = document.createElement('div');
    slot.className = 'power-up-slot';

    if (gameState.powerUpSlots && gameState.powerUpSlots[i]) {
      const powerUp = gameState.powerUpSlots[i];
      const localizedName = getLocalizedPowerUpName(powerUp.type);
      slot.innerHTML = `<div class="power-up-icon">${powerUp.icon}</div><div class="power-up-key">${i + 1}</div>`;
      slot.title = localizedName;
      slot.onclick = () => usePowerUp(i);
          } else {
        slot.classList.add('empty');
        const localizedName = getLocalizedPowerUpName(slotKeys[i]);
        const emptyText = (typeof window !== 'undefined' && window.languages && window.currentLanguage && window.languages[window.currentLanguage].emptySlot) || 'Empty';
        slot.innerHTML = `<div class="power-up-icon" style="opacity: 0.3;">${slotLabels[i]}</div><div class="power-up-key">${i + 1}</div>`;
        slot.title = `${localizedName} (${emptyText})`;
      }

    grid.appendChild(slot);
  }

  // Active effects display
  const activeEffects = document.getElementById('active-effects');
  if (activeEffects) {
    activeEffects.innerHTML = '';
    Object.keys(gameState.activePowerUps || {}).forEach((key) => {
      const effect = document.createElement('div');
      effect.className = 'active-effect';
      const value = gameState.activePowerUps[key];
      const localizedName = getLocalizedPowerUpName(key);
      switch (key) {
        case 'slowTime':
          effect.textContent = `⏰ ${localizedName}`;
          break;
        case 'precisionMode':
          effect.textContent = `🎯 ${localizedName} x${value}`;
          break;
        case 'doubleScore':
          effect.textContent = `💎 ${localizedName} x${value}`;
          break;
        case 'shield':
          effect.textContent = `🛡️ ${localizedName} x${value}`;
          break;
        case 'comboProtect':
          effect.textContent = `🌟 ${localizedName} x${value}`;
          break;
      }
      activeEffects.appendChild(effect);
    });
  }
}

// 更新游戏统计
export function updateStats() {
  const scoreEl = document.getElementById('score');
  if (!scoreEl) return; // 若尚未渲染 DOM 则跳过

  scoreEl.textContent = gameState.score;
  document.getElementById('level').textContent = gameState.level;
  document.getElementById('missed-words').textContent = `${gameState.missedWords}/${gameState.maxMisses}`;

  const timeElapsed = (Date.now() - gameState.startTime) / 60000;
  const wpm = gameState.wordsTyped > 0 ? Math.round(gameState.wordsTyped / timeElapsed) : 0;
  document.getElementById('wpm').textContent = wpm;

  const accuracy = gameState.totalChars > 0 ? Math.round((gameState.correctChars / gameState.totalChars) * 100) : 100;
  document.getElementById('accuracy').textContent = `${accuracy}%`;

  updatePowerUpDisplay();
}

// 初始化背景粒子
export function initBackgroundParticles() {
  if (typeof window === 'undefined') return;
  window.backgroundParticles = [];
  for (let i = 0; i < 50; i++) {
    window.backgroundParticles.push(new BackgroundParticle());
  }
}

// 创建爆炸效果
export function createExplosion(x, y, color) {
  if (typeof window === 'undefined') return;
  window.particles = window.particles || [];
  for (let i = 0; i < 15; i++) {
    window.particles.push(new Particle(x, y, color, Math.random() * 3 + 1));
  }
}

// 重新组装 rendering 对象，确保导出更新函数
export const rendering = {
  resizeCanvas,
  initBackgroundParticles,
  createExplosion,
  updatePowerUpDisplay,
  updateStats,
};

// 更新全局引用
if (typeof window !== 'undefined') {
  window.resizeCanvas = resizeCanvas;
  window.initBackgroundParticles = initBackgroundParticles;
  window.createExplosion = createExplosion;
  window.updatePowerUpDisplay = updatePowerUpDisplay;
  window.updateStats = updateStats;
  window.renderBridge = rendering;
}