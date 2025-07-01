// Typing Rain 词汇与掉落单词逻辑模块

import { gameState } from './gameState.js';
import { wordDatabase } from './wordDatabase.js';
import { createExplosion } from './rendering.js';
import { playWordCompleteSound } from './audio.js';

// 与旧代码共享同一个数组
export const fallingWords = typeof window !== 'undefined' && window.fallingWords ? window.fallingWords : [];
if (typeof window !== 'undefined') {
  window.fallingWords = fallingWords;
}

function getCanvas() {
  return document.getElementById('game-canvas');
}

function getCtx() {
  const canvas = getCanvas();
  return canvas ? canvas.getContext('2d') : null;
}

export class FallingWord {
  constructor() {
    this.word = this.getRandomWord();
    if (!this.word) return; // 无可用单词

    const canvas = getCanvas();
    this.x = Math.random() * (canvas.width - 200) + 100;
    this.y = -50;
    this.speed = (Math.random() * 0.5 + 0.3 + (gameState.level - 1) * 0.1);
    if (gameState.mode === 'practice' && gameState.practiceSpeed) {
      this.speed *= gameState.practiceSpeed;
    }
    this.color = this.getWordColor();
    this.fontSize = 24;
    this.matched = false;
    this.progress = 0;
  }

  getRandomWord() {
    let word;
    
    // 锦标赛模式：固定比例混合难度
    if (gameState.mode === 'tournament') {
      const rand = Math.random();
      
      if (rand < 0.3) {
        // 30% 简单词
        word = wordDatabase.easy[Math.floor(Math.random() * wordDatabase.easy.length)];
      } else if (rand < 0.8) {
        // 50% 中等词 (0.3 + 0.5 = 0.8)
        word = wordDatabase.medium[Math.floor(Math.random() * wordDatabase.medium.length)];
      } else {
        // 20% 困难词
        word = wordDatabase.hard[Math.floor(Math.random() * wordDatabase.hard.length)];
      }
      return word;
    }
    
    // 原有的级别模式逻辑保持不变
    if (gameState.level === 1) {
      if (Math.random() < 0.1 && gameState.usedMediumWords.size < wordDatabase.medium.length) {
        do {
          word = wordDatabase.medium[Math.floor(Math.random() * wordDatabase.medium.length)];
        } while (gameState.usedMediumWords.has(word));
        gameState.usedMediumWords.add(word);
      } else {
        if (gameState.usedEasyWords.size >= wordDatabase.easy.length) {
          gameState.level = 2;
          gameState.levelStarted = false;
          return this.getRandomWord();
        }
        do {
          word = wordDatabase.easy[Math.floor(Math.random() * wordDatabase.easy.length)];
        } while (gameState.usedEasyWords.has(word));
        gameState.usedEasyWords.add(word);
      }
    } else if (gameState.level === 2) {
      if (Math.random() < 0.1 && gameState.usedHardWords.size < wordDatabase.hard.length) {
        do {
          word = wordDatabase.hard[Math.floor(Math.random() * wordDatabase.hard.length)];
        } while (gameState.usedHardWords.has(word));
        gameState.usedHardWords.add(word);
      } else {
        if (gameState.usedMediumWords.size >= wordDatabase.medium.length) {
          gameState.level = 3;
          gameState.levelStarted = false;
          return this.getRandomWord();
        }
        do {
          word = wordDatabase.medium[Math.floor(Math.random() * wordDatabase.medium.length)];
        } while (gameState.usedMediumWords.has(word));
        gameState.usedMediumWords.add(word);
      }
    } else if (gameState.level === 3) {
      if (gameState.usedHardWords.size >= wordDatabase.hard.length) {
        gameState.gameCompleted = true;
        return null;
      }
      do {
        word = wordDatabase.hard[Math.floor(Math.random() * wordDatabase.hard.length)];
      } while (gameState.usedHardWords.has(word));
      gameState.usedHardWords.add(word);
    }
    return word;
  }

  getWordColor() {
    const colors = ['#00f5ff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    const speedMultiplier = gameState.activePowerUps.slowTime ? 0.5 : 1;
    this.y += this.speed * speedMultiplier;
  }

  draw() {
    const ctx = getCtx();
    if (!ctx) return;

    ctx.save();
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.font = `${this.fontSize}px 'Orbitron', monospace`;

    const totalWidth = ctx.measureText(this.word).width;
    const startX = this.x - totalWidth / 2;

    if (this.progress > 0) {
      ctx.fillStyle = '#00ff88';
      ctx.textAlign = 'left';
      const partialWord = this.word.substring(0, this.progress);
      ctx.fillText(partialWord, startX, this.y);
    }

    ctx.fillStyle = this.color;
    const remainingWord = this.word.substring(this.progress);
    const offsetX = ctx.measureText(this.word.substring(0, this.progress)).width;
    ctx.fillText(remainingWord, startX + offsetX, this.y);
    ctx.restore();
  }

  checkMatch(typedWord) {
    if (gameState.activePowerUps.precisionMode && typedWord.length >= 3) {
      if (this.word.startsWith(typedWord.substring(0, 3))) {
        this.matched = true;
        return 'complete';
      }
    }

    if (this.word.startsWith(typedWord)) {
      this.progress = typedWord.length;
      if (typedWord === this.word) {
        this.matched = true;
        return 'complete';
      }
      return 'partial';
    }
    return 'none';
  }
}

if (typeof window !== 'undefined') {
  window.FallingWord = FallingWord;
}

export function spawnWord() {
  if (gameState.gameCompleted) return;

  const minWords = 3;
  const maxWords = 5;

  if (fallingWords.length < minWords) {
    const newWord = new FallingWord();
    if (newWord.word) fallingWords.push(newWord);
    return;
  }

  if (fallingWords.length < maxWords) {
    const spawnRate = 0.025 + gameState.level * 0.008;
    if (Math.random() < spawnRate) {
      const newWord = new FallingWord();
      if (newWord.word) fallingWords.push(newWord);
    }
  }
}

if (typeof window !== 'undefined') {
  window.spawnWord = spawnWord;
}