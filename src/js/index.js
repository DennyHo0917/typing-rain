// Entry point for modular Typing Rain (scaffolding phase)
// This file currently bootstraps the legacy global functions while we migrate code.

// Import empty module stubs to start building the new structure. These imports have
// no runtime effect yet but allow us to progressively move logic file-by-file.
import './gameState.js';
import './wordDatabase.js';
import './powerUps.js';
import './rendering.js';
import './audio.js';
import './language.js';
import './domRefs.js';
import './screens.js';
import './leaderboard.js';
import './share.js';
import './words.js';
import './input.js';
import './privacy.js';
import { initLanguageSystem } from './ui/languageUI.js';
import { initializeWords, gameLoop } from './gameLoop.js';
import { initBackgroundParticles, resizeCanvas } from './rendering.js';
import { initAudio } from './audio.js';

// When the DOM is ready, call the existing global initGame so the current
// monolithic script continues to work. As we migrate functions, this call will
// eventually be replaced by an internal bootstrap.

document.addEventListener('DOMContentLoaded', () => {
  // Framework initializations (language, audio, rendering)
  initLanguageSystem();
  initAudio();
  resizeCanvas();
  initBackgroundParticles();
  window.addEventListener('resize', resizeCanvas);

  // Initialize words and start loop
  initializeWords();
  requestAnimationFrame(gameLoop);
}); 