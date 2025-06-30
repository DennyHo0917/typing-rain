// 分享到 Twitter / X 模块化实现
import { languages } from './languages.js';
import { gameState } from './gameState.js';

export function shareToTwitter() {
  const gameUrl = window.location.href;
  const currentLanguage = window.currentLanguage || 'en';
  const langPack = languages[currentLanguage] || {};

  let shareText;
  const wpmEl = document.getElementById('wpm');
  const accEl = document.getElementById('accuracy');

  if (gameState.gameRunning || gameState.score > 0) {
    const currentWPM = wpmEl ? wpmEl.textContent : '0';
    const currentAccuracy = accEl ? accEl.textContent : '0%';
    if (langPack.shareText1) {
      shareText = langPack.shareText1
        .replace('{score}', gameState.score)
        .replace('{wpm}', currentWPM)
        .replace('{accuracy}', currentAccuracy)
        .replace('{level}', gameState.level);
    } else {
      shareText = `🌧️ Just played Typing Rain! 🎯 Score: ${gameState.score} | ⚡ WPM: ${currentWPM} | 🎯 Accuracy: ${currentAccuracy} | Level: ${gameState.level}\n\nChallenge your typing speed! 💪`;
    }
  } else {
    shareText = langPack.shareText2 || `🌧️ Typing Rain - An amazing typing game that improves your speed and accuracy! 🎯\n\nCatch falling words, build combos, and become a typing master! 💪\n\nPlay now and challenge your skills! ⚡`;
  }

  const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(gameUrl)}`;
  window.open(twitterUrl, '_blank', 'width=550,height=420,scrollbars=yes,resizable=yes');
}

// 挂载到全局
if (typeof window !== 'undefined') {
  window.shareToTwitter = shareToTwitter;
  window.shareToTwitterLegacy = shareToTwitter;
  window.shareBridge = { shareToTwitter };
} 