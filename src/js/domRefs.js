// DOM 引用缓存模块

export const dom = typeof document !== 'undefined' ? {
  canvas: document.getElementById('game-canvas'),
  particlesCanvas: document.getElementById('particles-canvas'),
  input: document.getElementById('word-input'),
  score: document.getElementById('score'),
  level: document.getElementById('level'),
  missed: document.getElementById('missed-words'),
  wpm: document.getElementById('wpm'),
  accuracy: document.getElementById('accuracy'),
  powerUpsGrid: document.getElementById('power-ups-grid'),
} : {};

if (typeof window !== 'undefined') {
  window.domBridge = dom;
} 