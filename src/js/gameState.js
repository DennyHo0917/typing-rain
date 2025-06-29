// 游戏状态桥接模块

function createInitialState() {
  return {
    score: 0,
    level: 1,
    lives: 3,
    wordsTyped: 0,
    totalChars: 0,
    correctChars: 0,
    startTime: Date.now(),
    gameRunning: true,
    combo: 0,
    maxCombo: 0,
    missedWords: 0,
    maxMisses: 5,
    // 关卡系统
    usedEasyWords: new Set(),
    usedMediumWords: new Set(),
    usedHardWords: new Set(),
    levelStarted: false,
    gameCompleted: false,
    gameStarted: false,
    // 道具系统 - 6 个固定槽位
    powerUpSlots: [null, null, null, null, null, null],
    activePowerUps: {},
    wordsSinceLastPowerUp: 0,
  };
}

export const gameState = typeof window !== 'undefined' && window.gameState
  ? window.gameState
  : createInitialState();

export function resetGameState() {
  const fresh = createInitialState();
  // 使用 Object.assign 以保持引用不变，便于模块共享
  Object.keys(gameState).forEach((k) => delete gameState[k]);
  Object.assign(gameState, fresh);
}

// 简易绑定到旧版循环/初始化函数
const bind = (name) =>
  typeof window !== 'undefined' && typeof window[name] === 'function' ? window[name] : () => {};

export const initGame = bind('initGame');
export const gameLoop = bind('gameLoop');
export const resetGame = bind('resetGame'); // 若未来实现

// 暴露到全局，兼容旧代码
if (typeof window !== 'undefined') {
  window.gameState = gameState;
  window.resetGame = resetGameState;
} 