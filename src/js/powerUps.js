// 道具逻辑桥接模块

// 默认道具类型（固定槽位）
const defaultPowerUpTypes = {
  slowTime: { name: 'Slow Time', icon: '⏰', duration: 5000, slot: 0 },
  precisionMode: { name: 'Precision Mode', icon: '🎯', count: 5, slot: 1 },
  doubleScore: { name: 'Double Score', icon: '💎', count: 10, slot: 2 },
  shield: { name: 'Shield', icon: '🛡️', count: 1, slot: 3 },
  comboProtect: { name: 'Combo Protect', icon: '🌟', count: 3, slot: 4 },
  refreshWords: { name: 'Word Refresh', icon: '🔄', instant: true, slot: 5 },
};

// 获取全局定义，否则使用默认
export const powerUpTypes = typeof window !== 'undefined'
  ? (window.powerUpTypes && Object.keys(window.powerUpTypes).length > 0
      ? window.powerUpTypes
      : defaultPowerUpTypes)
  : defaultPowerUpTypes;

// 确保同步到全局，供旧代码引用
if (typeof window !== 'undefined') {
  window.powerUpTypes = powerUpTypes;
}

// Helper: 返回旧脚本函数或 noop
const bind = (name) =>
  typeof window !== 'undefined' && typeof window[name] === 'function' ? window[name] : () => {};

let generatePowerUp = bind('generatePowerUp');
let usePowerUp = bind('usePowerUp');
let updatePowerUps = bind('updatePowerUps');

// 同步暴露到全局，便于渐进替换
if (typeof window !== 'undefined') {
  window.powerUpsBridge = {
    powerUpTypes,
    generatePowerUp,
    usePowerUp,
    updatePowerUps,
  };
}

import { gameState } from './gameState.js';
import { wordDatabase } from './wordDatabase.js';
import { fallingWords, FallingWord } from './words.js';
import { playPowerUpSound, playPowerUpObtainedSound } from './audio.js';
import { createExplosion } from './rendering.js';
import { dom } from './domRefs.js';

// 如果旧脚本中不存在这些函数，则提供模块实现

function isNoop(fn) {
  return fn.toString().includes('noop') || fn.toString().includes('=> {}');
}

if (isNoop(generatePowerUp)) {
  generatePowerUp = function () {
    const types = Object.keys(powerUpTypes);
    const randomType = types[Math.floor(Math.random() * types.length)];
    const powerUp = { type: randomType, ...powerUpTypes[randomType] };
    const slot = powerUpTypes[randomType].slot;
    if (gameState.powerUpSlots[slot] && gameState.powerUpSlots[slot].type === randomType) return;
    gameState.powerUpSlots[slot] = powerUp;
    playPowerUpObtainedSound();
  }
  window.generatePowerUp = generatePowerUp;
}

if (isNoop(usePowerUp)) {
  usePowerUp = function (slotIndex) {
    if (!gameState.powerUpSlots[slotIndex]) return;
    const powerUp = gameState.powerUpSlots[slotIndex];
    playPowerUpSound();
    switch (powerUp.type) {
      case 'slowTime':
        gameState.activePowerUps.slowTime = true;
        setTimeout(() => delete gameState.activePowerUps.slowTime, powerUp.duration);
        break;
      case 'precisionMode':
        gameState.activePowerUps.precisionMode = powerUp.count;
        break;
      case 'doubleScore':
        gameState.activePowerUps.doubleScore = powerUp.count;
        break;
      case 'shield':
        gameState.activePowerUps.shield = powerUp.count;
        break;
      case 'comboProtect':
        gameState.activePowerUps.comboProtect = powerUp.count;
        break;
      case 'refreshWords':
        fallingWords.length = 0;
        for (let i = 0; i < 3; i++) {
          const word = wordDatabase.easy[Math.floor(Math.random() * wordDatabase.easy.length)];
          const newWord = new FallingWord();
          newWord.word = word;
          newWord.x = Math.random() * (dom.canvas.width - 200) + 100;
          newWord.y = -50 - i * 150;
          fallingWords.push(newWord);
        }
        break;
    }
    gameState.powerUpSlots[slotIndex] = null;
  }
  window.usePowerUp = usePowerUp;
}

if (isNoop(updatePowerUps)) {
  updatePowerUps = function () {
    Object.keys(gameState.activePowerUps).forEach((key) => {
      if (typeof gameState.activePowerUps[key] === 'number') {
        gameState.activePowerUps[key]--;
        if (gameState.activePowerUps[key] <= 0) delete gameState.activePowerUps[key];
      }
    });
  }
  window.updatePowerUps = updatePowerUps;
}

// Re-export updated functions
export { generatePowerUp as generatePowerUp, usePowerUp as usePowerUp, updatePowerUps as updatePowerUps };

// 更新全局桥接对象
if (typeof window !== 'undefined') {
  window.powerUpsBridge = {
    powerUpTypes,
    generatePowerUp,
    usePowerUp,
    updatePowerUps,
  };
} 