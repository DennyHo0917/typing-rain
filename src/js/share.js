import { languages } from './languages.js';
import { gameState } from './gameState.js';

export function shareToTwitter() {
  const gameUrl = window.location.href;
  const currentLanguage = window.currentLanguage || 'en';
  const langPack = languages[currentLanguage] || {};
  const wpmEl = document.getElementById('wpm');
  const accEl = document.getElementById('accuracy');

  let shareText = langPack.shareText2 ||
    'My Spelling Game turns any weekly spelling list into a falling-word typing game. Paste your words, play, and replay missed words.';

  if (gameState.gameRunning || gameState.score > 0) {
    const currentWPM = wpmEl ? wpmEl.textContent : '0';
    const currentAccuracy = accEl ? accEl.textContent : '0%';
    shareText = (langPack.shareText1 ||
      'Just practiced spelling on My Spelling Game. Score: {score} | WPM: {wpm} | Accuracy: {accuracy} | Level: {level}\n\nPaste a spelling list and play.')
      .replace('{score}', gameState.score)
      .replace('{wpm}', currentWPM)
      .replace('{accuracy}', currentAccuracy)
      .replace('{level}', gameState.level);
  }

  const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(gameUrl)}`;
  window.open(twitterUrl, '_blank', 'width=550,height=420,scrollbars=yes,resizable=yes');
}

if (typeof window !== 'undefined') {
  window.shareToTwitter = shareToTwitter;
  window.shareToTwitterLegacy = shareToTwitter;
  window.shareBridge = { shareToTwitter };
}
