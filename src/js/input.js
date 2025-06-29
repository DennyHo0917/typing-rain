// Typing Rain 输入与连击逻辑模块

import { dom } from './domRefs.js';
import { gameState } from './gameState.js';
import { fallingWords, spawnWord } from './words.js';
import { playKeySound, playWordCompleteSound } from './audio.js';
import { generatePowerUp, updatePowerUps, usePowerUp } from './powerUps.js';
import { createExplosion } from './rendering.js';
import { updateStats } from './rendering.js';

export function updateComboDisplay() {
  const comboDisplay = document.getElementById('combo-display');
  const comboCount = document.getElementById('combo-count');
  if (!comboDisplay) return;
  if (gameState.combo > 1) {
    comboCount.textContent = gameState.combo;
    comboDisplay.classList.add('active');
  } else {
    comboDisplay.classList.remove('active');
  }
}

export function checkWordMatch(typedWord) {
  let wordMatched = false;
  for (let i = fallingWords.length - 1; i >= 0; i--) {
    const word = fallingWords[i];
    const result = word.checkMatch(typedWord);
    if (result === 'complete') {
      wordMatched = true;
      let points = word.word.length * 10 * gameState.level;
      if (gameState.activePowerUps.doubleScore) points *= 2;
      gameState.score += points + gameState.combo * 5;
      gameState.wordsTyped++;
      gameState.combo++;
      gameState.correctChars += word.word.length;
      gameState.totalChars += word.word.length;
      gameState.wordsSinceLastPowerUp++;
      updatePowerUps();
      if (
        gameState.wordsSinceLastPowerUp >= 20 ||
        [5, 10, 15].includes(gameState.combo)
      ) {
        generatePowerUp();
        gameState.wordsSinceLastPowerUp = 0;
      }
      createExplosion(word.x, word.y, '#00ff88');
      playWordCompleteSound();
      fallingWords.splice(i, 1);
      dom.input.value = '';
      break;
    }
  }
  if (!wordMatched && typedWord.length > 0) {
    if (!gameState.activePowerUps.comboProtect) gameState.combo = 0;
    gameState.totalChars += typedWord.length;
    dom.input.value = '';
  }
  updateComboDisplay();
  updateStats();
}

export function handleInput(event) {
  const typedWord = dom.input.value.trim();
  let hasMatch = false;
  fallingWords.forEach((w) => {
    if (w.word.startsWith(typedWord) && typedWord.length > 0) {
      w.progress = typedWord.length;
      hasMatch = true;
    } else {
      w.progress = 0;
    }
  });
  // play key sound only on insert
  if (event && event.inputType === 'insertText') playKeySound(hasMatch);
}

// attach listeners
if (typeof window !== 'undefined') {
  window.updateComboDisplay = updateComboDisplay;
  window.checkWordMatch = checkWordMatch;
  window.handleInput = handleInput;

  document.addEventListener('DOMContentLoaded', () => {
    if (dom.input) {
      dom.input.addEventListener('input', handleInput);
      dom.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          checkWordMatch(dom.input.value.trim());
        }
      });
    }
    // global keydown for powerUps 1-6
    document.addEventListener('keydown', (e) => {
      if (e.key >= '1' && e.key <= '6') {
        const slot = parseInt(e.key) - 1;
        if (gameState.powerUpSlots[slot]) {
          e.preventDefault();
          usePowerUp(slot);
        }
      }
    });
  });
} 