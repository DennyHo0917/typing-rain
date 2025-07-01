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

// 添加安全的 DOM 操作函数
export function safeUpdateElement(elementId, content) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = content;
  } else {
    console.warn(`Element with id '${elementId}' not found`);
  }
}

export function safeGetElement(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with id '${elementId}' not found`);
  }
  return element;
}

if (typeof window !== 'undefined') {
  window.domBridge = dom;
  window.safeUpdateElement = safeUpdateElement;
  window.safeGetElement = safeGetElement;
}